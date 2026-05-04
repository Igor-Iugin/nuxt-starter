<script lang='ts' setup>
import type { LoginFormSchema } from '../model'

import { loginFormSchema } from '../model'


const { onSubmit } = defineProps<{
	onSubmit: (data: LoginFormSchema) => Promise<void>
}>()

const { defineField, handleSubmit, isSubmitting } = useForm({
	initialValues: {
		email: '',
		password: '',
	},
	validationSchema: toTypedSchema(loginFormSchema),
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')

const submit = handleSubmit(onSubmit)
</script>

<template>
	<form :class='$style.root' @submit='submit'>
		<NTextInput
			v-model='email'
			autocomplete='username'
			label='Логин'
			v-bind='emailProps'
		/>
		<NPasswordInput
			v-model='password'
			autocomplete='current-password'
			label='Пароль'
			v-bind='passwordProps'
		/>
		<slot :submitting='isSubmitting' />
	</form>
</template>

<style module>
.root {
	display: grid;
	gap: var(--spacing-sm);
}
</style>
