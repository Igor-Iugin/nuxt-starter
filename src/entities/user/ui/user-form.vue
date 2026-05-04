<script lang='ts' setup generic='Mode extends FormMode = "edit"'>
import type { FormMode } from '@shared/types'

import { capitalize } from 'es-toolkit'

import type { CreateUserForm, UserEntity } from '../model'

import { useCreateUser, useUpdateUser } from '../api'
import { createUserSchema, editUserSchema } from '../model'


export interface UserFormProps {
	/** @default 'edit' */
	mode?: FormMode
	user?: UserEntity | Partial<UserEntity>
}

const {
	mode = 'edit',
	user,
} = defineProps<UserFormProps>()

const emit = defineEmits<{ submit: [data: UserEntity] }>()

const isEdit = computed(() => mode === 'edit')

const { handleSubmit, isSubmitting } = useForm<CreateUserForm>({
	validationSchema: toTypedSchema(isEdit.value ? editUserSchema : createUserSchema),
	initialValues: {
		email: '',
		password: '',
	},
})

const {
	value: email,
	errorMessage: emailError,
} = useField<string>('email')
const {
	value: password,
	errorMessage: passwordError,
} = useField<string>('password')

const {
	value: isActive,
	errorMessage: isActiveError,
} = useField<boolean>('is_active')

const { mutateAsync: create } = useCreateUser()
const { mutateAsync: update } = useUpdateUser()

const submit = handleSubmit(async data => {
	try {
		if (isEdit.value)
			emit('submit', await update({ id: user!.id!, ...data }))
		else
			emit('submit', await create(data))
	}
	catch (error) {
		console.error(`${capitalize(mode)} user errror: ${error}`)
	}
})
</script>

<template>
	<form :class='$style.form' @submit='submit'>
		<template v-if='isEdit'>
			<NTextInput
				:model-value='user?.email'
				label='Email'
				:readonly='isEdit'
			/>
		</template>

		<template v-else>
			<NTextInput
				v-model='email'
				:error='emailError'
				label='Email'
				autocomplete='new-login'
			/>
			<NTextInput
				v-model='password'
				:error='passwordError'
				label='Пароль'
				type='password'
				autocomplete='new-password'
			/>
		</template>

		<NSwitch
			v-model='isActive'
			:error='isActiveError'
			label='Активен'
		/>

		<slot :submitting='isSubmitting'>
			<NButton
				type='submit'
				variant='filled'
				:loading='isSubmitting'
			>
				Сохранить
			</NButton>
		</slot>
	</form>
</template>

<style module>
.form {
	display: grid;
	gap: var(--spacing-sm);

	padding: var(--spacing-md);
}

.roles {
	display: grid;
	gap: .5rem;
}

.submit {
	justify-content: center;
}
</style>
