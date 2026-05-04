import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

import { auth, authRuntime } from './config/auth'
import { icon } from './config/icon'


export default defineNuxtConfig({
	srcDir: 'src/',
	app: {
		head: {
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }],
		},
	},
	dir: {
		pages: 'app/routes/',
		layouts: 'app/layouts/',
		middleware: 'app/middleware/',
		plugins: 'app/plugins',
	},
	alias: {
		'@app': fileURLToPath(new URL('src/app', import.meta.url)),
		'@pages': fileURLToPath(new URL('src/pages', import.meta.url)),
		'@widgets': fileURLToPath(new URL('src/widgets', import.meta.url)),
		'@features': fileURLToPath(new URL('src/features', import.meta.url)),
		'@entities': fileURLToPath(new URL('src/entities', import.meta.url)),
		'@shared': fileURLToPath(new URL('src/shared', import.meta.url)),
	},
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/stylelint-module',
		'@vueuse/nuxt',
		'@vee-validate/nuxt',
		'@nuxt/icon',
		'nuance-ui',
		'@nuxtjs/color-mode',
		'@sidebase/nuxt-auth',
		'nuxt-i18n-micro',
	],
	icon,
	auth,
	i18n: {
		defaultLocale: 'ru',
		locales: [
			{ code: 'ru', name: 'Русский', file: 'ru.json' },
		],
		strategy: 'no_prefix',
		translationDir: './src/app/i18n',
	},
	typescript: {
		typeCheck: true,
	},
	eslint: {
		config: { standalone: false },
	},
	ssr: false,
	// fix for error: https://github.com/nuxt/nuxt/issues/34957
	experimental: { viteEnvironmentApi: true },
	vite: {
		define: {
			__API__: JSON.stringify(process.env.NODE_ENV === 'development'
				? 'http://localhost:3001/api/v1'
				: '/api/v1'),
		},
		optimizeDeps: {
			include: [
				'@tanstack/vue-query',
				'@nui/modals',
				'@nui/components',
				'@nui/composables',
				'@nui/utils',
				'zod',
				'@lukemorales/query-key-factory',
				'@formkit/tempo',
				'@tanstack/vue-table',
				'@vee-validate/zod',
				'es-toolkit',
			],
		},
		css: {
			modules: {
				generateScopedName: (name, filename, css) => {
					const hash = crypto.createHash('md5').update(css).digest('hex').substring(0, 5)
					const componentName = filename.split('/').pop()?.split('.')[0] ?? ''
					const parsedName = componentName.split('-').map(i => `${i[0]?.toUpperCase()}${i.slice(1)}`).join('')

					return `${parsedName}__${name}_${hash}`
				},
			},
		},
	},

	$development: {
		auth: authRuntime.$development,
	},
	$production: {
		auth: authRuntime.$production,
	},
})
