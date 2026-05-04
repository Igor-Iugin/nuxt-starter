import type IconModule from '@nuxt/icon'
import type { NuxtModule } from '@nuxt/schema'

// @ts-expect-error
type Config = typeof IconModule extends NuxtModule<infer O, unknown, boolean> ? Partial<O> | false : Record<string, any> | false

export const icon: Config = {
	provider: 'none',
	clientBundle: {
		icons: [
			'gravity-ui:sun',
			'gravity-ui:magnifier',
			'gravity-ui:pencil',
			'gravity-ui:chevrons-expand-vertical',
			'gravity-ui:persons',
			'gravity-ui:moon',
			'gravity-ui:terminal',
			'gravity-ui:calendar',
			'gravity-ui:chevron-up',
			'gravity-ui:chevron-down',
			'gravity-ui:chevron-left',
			'gravity-ui:chevron-right',
			'gravity-ui:clock',
			'gravity-ui:check',
			'gravity-ui:gear',
			'gravity-ui:xmark',
			'gravity-ui:trash-bin',
			'gravity-ui:minus',
			'gravity-ui:eye',
			'gravity-ui:eye-slash',
			'gravity-ui:plus',
			'gravity-ui:file',
			'gravity-ui:folder',
			'gravity-ui:folder-open',
			'gravity-ui:folders',
			'gravity-ui:folder-plus',
			'gravity-ui:play-fill',
			'gravity-ui:stop-fill',
			'gravity-ui:arrow-rotate-left',
			'gravity-ui:arrow-right-from-square',
			'gravity-ui:arrow-shape-up-from-line',
			'gravity-ui:arrow-down-to-line',
			'gravity-ui:bars-descending-align-left',
			'gravity-ui:bars-descending-align-left-arrow-up',
			'gravity-ui:bars-descending-align-left-arrow-down',
		],
		scan: {
			globExclude: ['src-tauri/**/*'],
		},
	},
	fallbackToApi: false,
}
