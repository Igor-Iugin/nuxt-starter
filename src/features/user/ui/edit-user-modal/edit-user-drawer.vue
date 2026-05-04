<script lang='ts' setup generic='Mode extends FormMode = "edit"'>
import type { UserFormProps } from '@entities/user'
import type { FormMode } from '@shared/types'
import type { DrawerRootProps } from 'nuance-ui/components'

import { UserForm } from '@entities/user'
import { useModal } from 'nuance-ui/modals'


export interface UserModalProps extends UserFormProps {
	/** Drawer position @default 'right' */
	position?: DrawerRootProps['position']
}

const {
	user,
	mode = 'edit',
	position = 'right',
} = defineProps<UserModalProps>()

const { opened, resolve } = useModal('user')

const drawerTitle = computed(() => mode === 'edit' ? 'Информация о пользователе' : 'Новый пользователь')
</script>

<template>
	<NDrawerRoot v-model:open='opened' :position>
		<NDrawerHeader>
			<NDrawerTitle>{{ drawerTitle }}</NDrawerTitle>
			<NDrawerCloseButton />
		</NDrawerHeader>

		<UserForm :mode :user @submit='resolve' />
	</NDrawerRoot>
</template>
