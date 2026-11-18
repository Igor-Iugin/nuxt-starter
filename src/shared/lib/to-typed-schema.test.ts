import type { TypedSchema } from 'vee-validate'

import { describe, expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'

import { toTypedSchema } from '@shared/lib'


describe('схемы форм Zod 4', () => {
	it.each([
		{
			name: 'Back Safety',
			schema: z.object({
				roll: z.number().pipe(z.literal([0, 90, 180, 270])).prefault(0),
				shift: z.number().default(0),
			}),
			values: { roll: 3.1, shift: 0 },
			expected: { roll: 3.1, shift: 0 },
		},
		{
			name: 'Safety 3D',
			schema: z.object({
				mode: z.enum(['full', 'zone', 'pose']).default('full'),
				floor_thresh: z.number().default(0),
			}),
			values: { floor_thresh: 'broken' },
			expected: { mode: 'full', floor_thresh: 'broken' },
		},
	])('сохраняет неверную конфигурацию $name при инициализации и сбросе', ({ schema, values, expected }) => {
		const formSchema: TypedSchema = toTypedSchema(schema)
		// Так vee-validate подготавливает initialValues и значения при resetForm.
		const initialize = () => formSchema.cast?.(values) ?? values
		expect(initialize()).toEqual(expected)
		expect(initialize()).toEqual(expected)
	})

	it('применяет default, prefault и преобразования при проверке, удаляет лишние ключи', async () => {
		const schema = toTypedSchema(z.object({
			mode: z.enum(['full', 'zone']).default('full'),
			label: z.string().trim().prefault(' default '),
			shift: z.number().transform(value => Math.round(value * 1000) / 1000),
		}))
		const values = { shift: 1.23456, extra: true }
		expect(await schema.parse(values)).toEqual({
			value: { mode: 'full', label: 'default', shift: 1.235 },
			errors: [],
		})
	})

	it('возвращает ошибки неверного roll, позволяет исправить его', async () => {
		const schema = toTypedSchema(z.object({
			roll: z.number().pipe(z.literal([0, 90, 180, 270])).prefault(0),
			shift: z.number().default(0),
		}))
		expect(await schema.parse({ roll: 3.1 })).toEqual({
			errors: [{ path: 'roll', errors: [expect.any(String)] }],
		})
		expect(await schema.parse({ roll: 90 })).toEqual({
			value: { roll: 90, shift: 0 },
			errors: [],
		})
	})

	it('группирует ошибки по путям vee-validate, включая вложенные массивы', async () => {
		const schema = toTypedSchema(z.object({
			items: z.array(z.object({ name: z.string().min(3, 'short').regex(/^[a-z]+$/, 'letters') })),
		}).refine(() => false, { error: 'form error' }))
		expect(await schema.parse({ items: [{ name: '1' }] })).toEqual({
			errors: [
				{ path: 'items[0].name', errors: ['short', 'letters'] },
				{ path: '', errors: ['form error'] },
			],
		})
	})

	it('обрабатывает ошибки union Zod 4', async () => {
		const schema = toTypedSchema(z.object({ value: z.union([z.string(), z.number()]) }))
		expect(await schema.parse({ value: null } as never)).toEqual({
			errors: [{ path: 'value', errors: [expect.any(String), expect.any(String), expect.any(String)] }],
		})
	})

	it('поддерживает асинхронную проверку и различает типы ввода и результата', async () => {
		const schema = toTypedSchema(z.object({
			value: z.string().refine(async value => value !== 'bad', { error: 'invalid' }).transform(Number),
		}))
		expectTypeOf(schema).toEqualTypeOf<TypedSchema<{ value?: string }, { value: number }>>()
		expect(await schema.parse({ value: 'bad' })).toEqual({
			errors: [{ path: 'value', errors: ['invalid'] }],
		})
		expect(await schema.parse({ value: '12' })).toEqual({ value: { value: 12 }, errors: [] })
	})
})


describe('совместимость с контрактом toTypedSchema vee-validate', () => {
	it('cast применяет coercion, defaults, transforms и удаляет неизвестные поля', () => {
		const schema = toTypedSchema(z.object({
			count: z.coerce.number(),
			label: z.string().trim().transform(value => value.toUpperCase()),
			mode: z.string().default('auto'),
		}))
		expect(schema.cast?.({ count: '12', label: ' hello ', extra: true } as never))
			.toEqual({ count: 12, label: 'HELLO', mode: 'auto' })
	})

	it('cast подставляет вложенные defaults и prefault, сохраняя неверный пользовательский ввод', () => {
		const schema = toTypedSchema(z.object({
			required: z.number(),
			settings: z.object({
				label: z.string().trim().prefault(' default '),
				mode: z.string().default('auto'),
				tags: z.array(z.string()).default(['default']),
			}),
		}))
		const values = { required: 'broken', settings: { mode: undefined, tags: ['custom'] }, extra: true }
		const before = structuredClone(values)
		expect(schema.cast?.(values as never)).toEqual({
			required: 'broken',
			settings: { label: 'default', mode: undefined, tags: ['custom'] },
			extra: true,
		})
		expect(values).toEqual(before)
	})

	it('вызывает default-фабрики при каждом cast и не мутирует defaults', () => {
		let counter = 0
		const initial = { a: 1, b: 2 }
		const schema = toTypedSchema(z.object({
			id: z.number().default(() => ++counter),
			required: z.string(),
			settings: z.object({ a: z.number(), b: z.number() }).default(initial),
		}))
		const first = schema.cast?.({ settings: { a: 5 } } as never)
		const second = schema.cast?.({ settings: { a: 6 } } as never)
		expect(first).toMatchObject({ id: expect.any(Number), settings: { a: 5, b: 2 } })
		expect(second).toMatchObject({ id: expect.any(Number), settings: { a: 6, b: 2 } })
		expect(second?.id).not.toBe(first?.id)
		expect(initial).toEqual({ a: 1, b: 2 })
	})

	it('cast сохраняет неверный скаляр и массив, корневой default применяется при успешном parse', () => {
		expect(toTypedSchema(z.string().default('hello')).cast?.(undefined as never)).toBe('hello')
		expect(toTypedSchema(z.string().default('hello')).cast?.(12 as never)).toBe(12)
		const values = [12]
		expect(toTypedSchema(z.array(z.string())).cast?.(values as never)).toBe(values)
	})

	it('при ошибке cast извлекает только defaults, не синтезирует значения через coercion', () => {
		const schema = toTypedSchema(z.object({
			required: z.number(),
			text: z.coerce.string(),
			fallback: z.string().default('default'),
		}))
		expect(schema.cast?.({ required: 'bad' } as never)).toEqual({
			required: 'bad',
			text: undefined,
			fallback: 'default',
		})
	})

	it('обрабатывает рекурсивные схемы без зацикливания при cast и describe', () => {
		const node = z.object({
			name: z.string().default('node'),
			get child() { return node.optional() },
		})
		const schema: TypedSchema = toTypedSchema(node)
		expect(schema.cast?.({ name: 12 })).toEqual({ name: 12 })
		expect(schema.describe?.('child.child.name')).toEqual({ exists: true, required: false })
		expect(schema.describe?.('child.child.absent')).toEqual({ exists: false, required: false })
	})

	it('cast сохраняет данные async-схемы и подставляет синхронные defaults', async () => {
		const schema = toTypedSchema(z.object({
			name: z.string().transform(async value => value.toUpperCase()),
			mode: z.string().default('auto'),
		}))
		expect(schema.cast?.({ name: 'hello' })).toEqual({ name: 'hello', mode: 'auto' })
		expect(await schema.parse({ name: 'hello' })).toEqual({
			value: { name: 'HELLO', mode: 'auto' },
			errors: [],
		})
	})

	it('передаёт параметры Zod 4 при валидации', async () => {
		const schema = toTypedSchema(z.object({ value: z.number() }), {
			error: issue => issue.code === 'invalid_type' ? 'Введите число' : undefined,
		})
		expect(await schema.parse({ value: 'bad' } as never)).toEqual({
			errors: [{ path: 'value', errors: ['Введите число'] }],
		})
	})

	it('описывает required, optional, nullable, defaults и отсутствующие поля', () => {
		const schema: TypedSchema = toTypedSchema(z.object({
			required: z.string(),
			optional: z.string().optional(),
			nullable: z.string().nullable(),
			defaulted: z.string().default('default'),
			prefaulted: z.string().prefault('default'),
			exact: z.string().exactOptional(),
			forced: z.string().optional().nonoptional(),
			anything: z.unknown(),
		}))
		for (const path of [undefined, 'required', 'nullable', 'forced', 'exact'])
			expect(schema.describe?.(path)).toEqual({ exists: true, required: true })
		for (const path of ['optional', 'defaulted', 'prefaulted', 'anything'])
			expect(schema.describe?.(path)).toEqual({ exists: true, required: false })
		for (const path of ['absent', 'required.child', 'toString'])
			expect(schema.describe?.(path)).toEqual({ exists: false, required: false })
	})

	it('описывает вложенные объекты, массивы и буквальные имена полей', () => {
		const schema: TypedSchema = toTypedSchema(z.object({
			'items': z.array(z.object({ name: z.string(), optional: z.number().optional() })),
			'some.name': z.string(),
		}))
		for (const path of ['items[0].name', 'items.0.name', '[some.name]'])
			expect(schema.describe?.(path)).toEqual({ exists: true, required: true })
		expect(schema.describe?.('items[9].optional')).toEqual({ exists: true, required: false })
		for (const path of ['items[0].absent', 'items.name', 'some.name'])
			expect(schema.describe?.(path)).toEqual({ exists: false, required: false })
	})

	it('описывает объекты под обёртками Zod 4, tuple и record', () => {
		const schema: TypedSchema = toTypedSchema(z.object({
			nested: z.object({ value: z.string() }).optional().readonly(),
			piped: z.object({ value: z.string() }).transform(value => value),
			preprocessed: z.preprocess(value => value, z.object({ value: z.string() })),
			tuple: z.tuple([z.string(), z.number().optional()], z.boolean()),
			record: z.record(z.string(), z.object({ value: z.string() })),
		}))
		for (const path of ['nested.value', 'piped.value', 'preprocessed.value', 'tuple[0]', 'tuple[9]', 'record.key.value'])
			expect(schema.describe?.(path)).toEqual({ exists: true, required: true })
		expect(schema.describe?.('tuple[1]')).toEqual({ exists: true, required: false })
	})

	it('describe безопасен для асинхронных проверок', () => {
		const schema: TypedSchema = toTypedSchema(z.string().optional().refine(async () => true))
		expect(schema.describe?.()).toEqual({ exists: false, required: false })
	})

	it('детализирует вложенные union-ошибки с относительными путями Zod 4', async () => {
		const schema = toTypedSchema(z.object({
			items: z.array(z.union([
				z.object({ a: z.string({ error: 'a string' }) }),
				z.object({ b: z.union([z.string({ error: 'b string' }), z.number({ error: 'b number' })], { error: 'b union' }) }),
			], { error: 'item union' })),
		}))
		expect(await schema.parse({ items: [{ a: null, b: null }] } as never)).toEqual({
			errors: [
				{ path: 'items[0].a', errors: ['a string'] },
				{ path: 'items[0].b', errors: ['b string', 'b number', 'b union'] },
				{ path: 'items[0]', errors: ['item union'] },
			],
		})
	})

	it('не добавляет общую ошибку для корневого union, нормализует числовые ключи', async () => {
		const union = toTypedSchema(z.union([
			z.object({ a: z.string({ error: 'a' }) }),
			z.object({ b: z.string({ error: 'b' }) }),
		]))
		expect(await union.parse({})).toEqual({ errors: [
			{ path: 'a', errors: ['a'] },
			{ path: 'b', errors: ['b'] },
		] })
		const record = toTypedSchema(z.object({ values: z.record(z.string(), z.string({ error: 'text' })) }))
		expect(await record.parse({ values: { 0: 12 } } as never)).toEqual({
			errors: [{ path: 'values[0]', errors: ['text'] }],
		})
	})

	it('поддерживает codecs в cast и parse', async () => {
		const schema = toTypedSchema(z.object({
			date: z.codec(z.iso.datetime(), z.date(), {
				decode: value => new Date(value),
				encode: value => value.toISOString(),
			}),
		}))
		const value = { date: '2026-11-18T00:00:00Z' }
		const parsed = { date: new Date(value.date) }
		expect(schema.cast?.(value)).toEqual(parsed)
		expect(await schema.parse(value)).toEqual({ value: parsed, errors: [] })
	})

	it('выводит частичный тип формы и полный тип результата, позволяет переопределить generics', () => {
		const source = z.object({ nested: z.object({ count: z.string().transform(Number) }) })
		const schema = toTypedSchema(source)
		expectTypeOf(schema).toEqualTypeOf<TypedSchema<
			{ nested?: { count?: string } },
			{ nested: { count: number } }
		>>()
		const explicit = toTypedSchema<typeof source, { result: number }, { input: string }>(source)
		expectTypeOf(explicit).toEqualTypeOf<TypedSchema<{ input: string }, { result: number }>>()
	})
})
