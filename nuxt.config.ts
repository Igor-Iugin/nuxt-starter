import { fileURLToPath } from 'node:url'

import { defineNuxtConfig } from 'nuxt/config'
import readableClassnames from 'vite-plugin-readable-classnames'


export default defineNuxtConfig({
	ssr: false,
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }],
		},
	},
	dir: {
		pages: 'src/app/routes/',
		layouts: 'src/app/layouts/',
		middleware: 'src/app/middleware/',
		plugins: 'src/app/plugins/',
		assets: 'src/shared/assets/',
	},
	alias: {
		'@app': fileURLToPath(new URL('./src/app', import.meta.url)),
		'@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
		'@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
		'@features': fileURLToPath(new URL('./src/features', import.meta.url)),
		'@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
		'@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
	},
	modules: [
		'@nuxtjs/stylelint-module',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@vee-validate/nuxt',
		'nuance-ui',
		'@sidebase/nuxt-auth',
		'nuxt-i18n-micro',
	],
	icon: {
		clientBundle: { scan: true },
	},
	i18n: {
		defaultLocale: 'ru',
		locales: [
			{ code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' },
		],
		strategy: 'no_prefix',
		translationDir: './src/app/i18n',
		plural: (key, count, _params, _locale, t) => {
			const translation = t(key)
			if (!translation)
				return key

			// eslint-disable-next-line prefer-arrow-callback, style/max-statements-per-line
			const forms = translation.toString().split('|').map(function (s) { return s.trim() })
			let idx

			if (count === 0) {
				idx = 0
			}
			else {
				const mod10 = count % 10
				const mod100 = count % 100
				if (mod10 === 1 && mod100 !== 11)
					idx = 1
				else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
					idx = 2
				else
					idx = 3
			}

			if (idx >= forms.length)
				idx = forms.length - 1
			return (forms[idx] || '').replace('{count}', String(count))
		},
	},
	auth: {
		provider: {
			type: 'local',
			pages: { login: '/auth' },
			token: {
				signInResponseTokenPointer: '/id',
				maxAgeInSeconds: 60 * 60 * 24 * 6, // 6 дней жизни токена
			},
			endpoints: {
				signIn: { path: '/account/signin', method: 'post' },
				signOut: { path: '/account/signout', method: 'post' },
				getSession: { path: '/account/me', method: 'get' },
				signUp: false,
			},
		},
	},
	vite: {
		plugins: [readableClassnames() as any],
		optimizeDeps: {
			include: [
				'@tanstack/vue-query',
				'@nui/modals',
				'@nui/components',
				'@nui/composables',
				'@nui/utils',
				'@nui/notifications',
				'zod',
				'@lukemorales/query-key-factory',
				'@vee-validate/zod',
				'es-toolkit',
			],
		},
	},
	compatibilityDate: '2026-10-08',
})
