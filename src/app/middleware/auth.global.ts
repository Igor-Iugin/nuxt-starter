export default defineNuxtRouteMiddleware(to => {
	return // remove this line after setup auth
	const { status } = useAuth()

	if (status.value === 'authenticated' || to.meta.auth === false)
		return

	return navigateTo({
		path: '/auth',
		query: { callbackUrl: to.fullPath },
	})
})
