import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'


export default defineNuxtPlugin(nuxt => {
	const client = new QueryClient({
		defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
	})

	nuxt.vueApp.use(VueQueryPlugin, {
		queryClient: client,
		enableDevtoolsV6Plugin: true,
	})

	// @ts-ignore
	window.__TANSTACK_QUERY_CLIENT__ = client
})
