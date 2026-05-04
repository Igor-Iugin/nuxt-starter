import z from 'zod'


export interface UserEntity {
	id: string
	email: string
	created_at: string
	updated_at: string
}

export const editUserSchema = z.object({
	is_active: z.boolean(),
})
export type EditUserForm = z.infer<typeof editUserSchema>

export const createUserSchema = z.object({
	email: z.string().min(1, 'Обязательное поле'),
	password: z.string().min(1, 'Обязательное поле'),
})
export type CreateUserForm = z.infer<typeof createUserSchema>
