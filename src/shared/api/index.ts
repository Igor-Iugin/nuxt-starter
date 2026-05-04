import type { UseQueryOptions } from '@tanstack/vue-query'
import type { AsyncData, KeysOf, PickFrom } from '#app/composables/asyncData'
import type { UseFetchOptions } from 'nuxt/app'
import type { FetchError } from 'ofetch'


export interface ApiError {
	status_code: number
	detail: string
	extra: object | [] | null
}

export interface ApiResponse<T extends object> {
	items: T[]
	limit: number
	offset: number
	total: number
}

declare const __API__: string
export const $api = $fetch.create({
	baseURL: __API__,
	credentials: 'include',
	onResponseError({ response }) {
		if (response.status === 401)
			navigateTo('/auth')
	},
})

/** Replacement useFetch with configured $fetch instance */
export function useAppFetch<
	ResT,
	DataT = ResT,
	PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
	DefaultT = undefined,
>(
	url: string | (() => string),
	options?: UseFetchOptions<ResT, DataT, PickKeys, DefaultT>,
): AsyncData<PickFrom<DataT, PickKeys> | DefaultT, FetchError<ApiError> | undefined> {
	return useFetch(url, {
		$fetch: $api,
		...options,
	})
}

export type QuerySettings<Func extends (...args: any[]) => any, TData = Awaited<ReturnType<Func>>> = Omit<
	UseQueryOptions<Awaited<ReturnType<Func>>, any, TData, any>,
	'queryKey'
>
