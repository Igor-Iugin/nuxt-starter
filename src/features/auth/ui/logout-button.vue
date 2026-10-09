<script lang='ts' setup>
import type { ButtonProps } from '@nui/components'


const {
	icon = 'gravity-ui:arrow-right-from-square',
	square = true,
	...props
} = defineProps<ButtonProps>()

const { signOut } = useAuth()
const route = useRoute()
</script>

<template>
	<NButton
		:square
		:icon
		v-bind='props'
		@click='signOut({
			callbackUrl: `/auth?callbackUrl=${route.fullPath}`,
		})'
	/>
</template>
