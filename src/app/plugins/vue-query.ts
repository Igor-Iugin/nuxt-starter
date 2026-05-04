import type { DehydratedState } from '@tanstack/vue-query'

import { dehydrate, hydrate, QueryClient, VueQueryPlugin } from '@tanstack/vue-query'


export default defineNuxtPlugin(nuxt => {
	const state = useState<DehydratedState | null>('vue-query')

	const client = new QueryClient({
		defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
	})

	nuxt.vueApp.use(VueQueryPlugin, {
		queryClient: client,
		enableDevtoolsV6Plugin: true,
	})

	if (import.meta.server) {
		nuxt.hooks.hook('app:rendered', () => {
			state.value = dehydrate(client)
		})
	}

	if (import.meta.client) {
		hydrate(client, state.value)
		// @ts-ignore
		window.__TANSTACK_QUERY_CLIENT__ = client
	}
})
