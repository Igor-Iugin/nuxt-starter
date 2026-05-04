<script lang='ts' setup>
import type { LoginFormSchema } from '@features/auth'

import { LoginForm } from '@features/auth'


useHead({ title: 'Авторизация' })
definePageMeta({ layout: 'centered', auth: false })

const { signIn } = useAuth()
const route = useRoute()

const error = ref<string | null>(null)
async function onSubmit(data: LoginFormSchema) {
	try {
		const callbackUrl = route.query.callbackUrl as string ?? '/'
		await signIn(data, { callbackUrl })
		error.value = null
	}
	catch {
		error.value = 'Пользователь не найден или пароль некорректный'
	}
}
</script>

<template>
	<NCard is='section' :class='$style.card' with-border>
		<div :class='$style.wrapper'>
			<img
				:class='$style.image'
				alt='Логотип'
				src='@shared/assets/logo.svg'
				width='140'
				height='140'
			>
		</div>
		<LoginForm :on-submit>
			<template #default='{ submitting: loading }'>
				<NText c='red'>
					{{ error }}
				</NText>
				<NButton :loading type='submit' variant='filled'>
					Войти
				</NButton>
			</template>
		</LoginForm>
	</NCard>
</template>

<style module>
.card {
	width: rem(368px);

	box-shadow: var(--shadow-md);
}

.wrapper {
	display: grid;
	justify-content: center;
}

.image {
	width: rem(140px);
}
</style>
