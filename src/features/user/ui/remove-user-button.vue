<script lang='ts' setup>
import type { UserEntity } from '@entities/user'

import { useRemoveUser } from '@entities/user'
import { openConfirmModal } from 'nuance-ui/modals'


const { user } = defineProps<{ user: UserEntity }>()

const { mutate: removeUser, isPending } = useRemoveUser()

function handleRemove() {
	openConfirmModal({
		title: 'Удалить пользователя',
		description: `Вы уверены, что хотите удалить пользователя «${user.email}»? Это действие нельзя отменить.`,
		labels: { confirm: 'Удалить', cancel: 'Отмена' },
		onConfirm: () => removeUser(user.id),
		variant: 'danger',
	})
}
</script>

<template>
	<NActionIcon
		icon='gravity-ui:trash-bin'
		color='red'
		variant='subtle'
		:loading='isPending'
		title='Удалить'
		@click='handleRemove'
	/>
</template>
