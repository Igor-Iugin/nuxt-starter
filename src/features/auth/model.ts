import { z } from 'zod'


export const loginFormSchema = z.object({
	email: z.string(),
	password: z.string(),
})
export type LoginFormSchema = z.infer<typeof loginFormSchema>

/** Тип обозначающий данные пользователя получаемые в useAuth */
declare module '#auth' {
	interface SessionData {
		// @ts-expect-error
		id: string
		email: string
		created_at: string
		updated_at: string
	}
}
