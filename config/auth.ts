import type { NuxtModule } from '@nuxt/schema'
import type IconModule from '@sidebase/nuxt-auth'

// @ts-expect-error
type Config = typeof IconModule extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false

export const auth: Config = {
	provider: {
		type: 'local',
		endpoints: {
			signIn: { path: '/account/signin', method: 'post' },
			signOut: { path: '/account/signout', method: 'post' },
			getSession: { path: '/account/me', method: 'get' },
			signUp: false,
		},
		token: {
			signInResponseTokenPointer: '/id',
			maxAgeInSeconds: 60 * 60 * 24 * 6, // 6 дней жизни токена
		},
		pages: {
			login: '/auth',
		},
	},
}
