import type { PartialDeep } from 'type-fest'
import type { TypedSchema } from 'vee-validate'

import { isPlainObject } from 'es-toolkit'
import { z } from 'zod'


type ParseOptions = Parameters<z.ZodType['safeParseAsync']>[1]
type Schema = z.core.$ZodType

/** Zod 4.6 → vee-validate 4: validation, initial values and field metadata. */
export function toTypedSchema<
	TSchema extends z.ZodType,
	TOutput = z.output<TSchema>,
	TInput = PartialDeep<z.input<TSchema>>,
>(schema: TSchema, options?: ParseOptions): TypedSchema<TInput, TOutput> {
	// Async parsing bypasses compilation; the sync cast uses its fast path.
	const compiled = z.compile(schema)
	const adapter: TypedSchema = {
		__type: 'VVTypedSchema',
		async parse(values) {
			const result = await schema.safeParseAsync(values, options)
			if (result.success)
				return { value: result.data, errors: [] }

			const errors = new Map<string, string[]>()
			collectIssues(result.error.issues, errors)
			return {
				errors: [...errors].map(([path, errors]) => ({ path, errors })),
			}
		},
		cast(values) {
			try {
				return compiled.parse(values)
			}
			catch {
				// cast is synchronous, so async schemas also take this fallback.
				const defaults = getDefaults(schema)
				return isPlainObject(defaults) && isPlainObject(values)
					? mergeDefaults(defaults, values)
					: values
			}
		},
		describe(path) {
			try {
				const parts = !path
					? []
					: /^\[.+\]$/.test(path)
						? [path.replace(/\[|\]/g, '')]
						: path.split(/\.|\[(\d+)\]/).filter(Boolean)
				const field = getSchemaForPath(schema, parts)
				return field
					? { exists: true, required: !z.validate(field, undefined) }
					: { exists: false, required: false }
			}
			catch {
				// Like the upstream adapter, description must never break a form.
				return { exists: false, required: false }
			}
		},
	}
	return adapter
}

function formPath(parts: PropertyKey[]): string {
	return parts.map(String).reduce((path, part, index) => index === 0
		? part
		: /^\d+$/.test(part) ? `${path}[${part}]` : `${path}.${part}`, '')
}

function collectIssues(
	issues: z.core.$ZodIssue[],
	errors: Map<string, string[]>,
	prefix: PropertyKey[] = [],
) {
	for (const issue of issues) {
		const parts = [...prefix, ...issue.path]
		const path = formPath(parts)
		if (issue.code === 'invalid_union') {
			for (const branch of issue.errors)
				collectIssues(branch, errors, parts)
			if (!path)
				continue
		}
		const messages = errors.get(path) ?? []
		messages.push(issue.message)
		errors.set(path, messages)
	}
}

/** Public Zod accessors only; default/prefault values are resolved by Zod itself. */
function unwrap(schema: Schema): Schema | undefined {
	if (schema instanceof z.ZodOptional || schema instanceof z.ZodExactOptional
		|| schema instanceof z.ZodNullable || schema instanceof z.ZodDefault
		|| schema instanceof z.ZodPrefault || schema instanceof z.ZodNonOptional
		|| schema instanceof z.ZodReadonly || schema instanceof z.ZodCatch
		|| schema instanceof z.ZodLazy) {
		return schema.unwrap()
	}
	if (schema instanceof z.ZodPipe)
		return schema.in instanceof z.ZodTransform ? schema.out : schema.in
}

function getDefaults(schema: Schema, ancestors = new Set<Schema>()): unknown {
	if (ancestors.has(schema))
		return undefined
	ancestors = new Set(ancestors).add(schema)

	if (schema instanceof z.ZodDefault || schema instanceof z.ZodPrefault) {
		try {
			const result = z.safeParse(schema, undefined)
			return result.success ? result.data : undefined
		}
		catch {
			// Async prefaults cannot supply synchronous initial values.
			return undefined
		}
	}
	if (schema instanceof z.ZodObject) {
		return Object.fromEntries(Object.entries(schema.shape).map(([key, field]) => [
			key,
			getDefaults(field, ancestors),
		]))
	}
	const inner = unwrap(schema)
	return inner ? getDefaults(inner, ancestors) : undefined
}

/** Explicit input (even undefined) wins; arrays are replaced, not merged. */
function mergeDefaults(
	defaults: Record<string, unknown>,
	values: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries([
		...Object.entries(defaults),
		...Object.entries(values).map(([key, value]) => [key, Object.hasOwn(defaults, key) && isPlainObject(defaults[key]) && isPlainObject(value)
			? mergeDefaults(defaults[key], value)
			: value]),
	])
}

function getSchemaForPath(
	schema: Schema,
	parts: string[],
	visited = new Set<Schema>(),
): Schema | undefined {
	if (!parts.length)
		return schema
	if (visited.has(schema))
		return undefined
	visited = new Set(visited).add(schema)
	const key = parts[0]!
	const rest = parts.slice(1)
	let child: Schema | undefined

	if (schema instanceof z.ZodObject) {
		child = Object.hasOwn(schema.shape, key) ? schema.shape[key] : undefined
	}
	else if (schema instanceof z.ZodArray && /^\d+$/.test(key)) {
		child = schema.element
	}
	else if (schema instanceof z.ZodTuple && /^\d+$/.test(key)) {
		child = schema.def.items[Number(key)] ?? schema.def.rest ?? undefined
	}
	else if (schema instanceof z.ZodRecord) {
		child = z.validate(schema.keyType, key) ? schema.valueType : undefined
	}
	else {
		const inner = unwrap(schema)
		return inner ? getSchemaForPath(inner, parts, visited) : undefined
	}
	// A recursive schema may be revisited after consuming a path segment.
	return child ? getSchemaForPath(child, rest) : undefined
}
