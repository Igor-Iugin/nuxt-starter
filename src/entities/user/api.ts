import type { ApiResponse } from '@shared/api'
import type { PartialExcept } from '@shared/types'

import { createQueryKeys } from '@lukemorales/query-key-factory'
import { $api } from '@shared/api'
import { infiniteQueryOptions, queryOptions, useMutation, useQueryClient } from '@tanstack/vue-query'

import type { UserEntity } from './model'


interface ListParams {
	email?: string
	id?: string
	limit?: number
	offset?: number
}

type PartialUser = PartialExcept<UserEntity, 'id'>

interface CreateUser extends Omit<UserEntity, 'id' | 'created_at' | 'updated_at'> {
	password: string
}

// ─── Keys ───

const userKeys = createQueryKeys('user', {
	me: null,
	detail: (id: MaybeRefOrGetter<string>) => [id],
	list: (params: MaybeRefOrGetter<ListParams>) => [params],
})

// ─── API ───

const userApi = {
	getMe: () => $api<UserEntity>('account/me'),

	getById: (id: string) => $api<UserEntity>(`/account/users/${id}`),

	getList: (params: ListParams) => $api<ApiResponse<UserEntity>>('/account/users', {
		query: params,
	}),

	create: (payload: CreateUser) => $api<UserEntity>('account/users', {
		method: 'POST',
		body: payload,
	}),

	update: ({ id, ...body }: PartialUser) => $api<UserEntity>(`/account/users/${id}`, {
		method: 'PATCH',
		body,
	}),

	remove: (id: string) => $api(`/account/users/${id}`, { method: 'DELETE' }),
}

// ─── Queries ───

export const userQueries = {
	/** Get data about the current user */
	me: queryOptions({
		queryKey: userKeys.me.queryKey,
		queryFn: userApi.getMe,
	}),

	/** Get data about a user by id */
	detail: (id: MaybeRefOrGetter<string>) => queryOptions({
		// @ts-ignore
		queryKey: userKeys.detail(id).queryKey,
		queryFn: () => userApi.getById(toValue(id)),
	}),

	/** Get paginated list of users with optional filters */
	list: (params: MaybeRefOrGetter<ListParams>) => infiniteQueryOptions({
		queryKey: userKeys.list(params).queryKey,
		queryFn: ({ pageParam = 0 }) => userApi.getList({
			...toValue(params),
			offset: pageParam * (toValue(params)?.limit ?? 20),
		}),
		initialPageParam: 0,
		getNextPageParam: (last, all) => {
			const loaded = all.flatMap(p => p.items).length
			return loaded < last.total ? loaded : undefined
		},
	}),
}

// ─── Mutations ───

export function useCreateUser() {
	const client = useQueryClient()
	return useMutation({
		mutationFn: userApi.create,
		onSuccess: () => client.invalidateQueries({ queryKey: userKeys.list._def }),
	})
}

export function useUpdateUser() {
	const client = useQueryClient()
	return useMutation({
		mutationFn: userApi.update,
		onSuccess: data => {
			client.setQueryData(userKeys.detail(data.id).queryKey, data)
			client.invalidateQueries({ queryKey: userKeys.list._def })
		},
	})
}

export function useRemoveUser() {
	const client = useQueryClient()
	return useMutation({
		mutationFn: userApi.remove,
		onSuccess: (_, id) => {
			client.removeQueries(userKeys.detail(id))
			client.invalidateQueries({ queryKey: userKeys.list._def })
		},
	})
}
