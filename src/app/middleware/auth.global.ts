export default defineNuxtRouteMiddleware(async to => {
	return // remove this line after setup auth
	const { status } = useAuth()

	if (status.value === 'loading')
		await until(status).not.toBe('loading')

	if (status.value === 'authenticated' || to.meta.auth === false)
		return

	return navigateTo({
		path: '/auth',
		query: { callbackUrl: to.fullPath },
	})
})
