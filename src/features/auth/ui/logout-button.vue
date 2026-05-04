<script lang='ts' setup>
import type { ActionIconProps } from '@nui/components'


const {
	icon = 'gravity-ui:arrow-right-from-square',
	...props
} = defineProps<ActionIconProps>()

const { signOut } = useAuth()
const route = useRoute()
</script>

<template>
	<NActionIcon
		:icon
		v-bind='props'
		@click='signOut({
			callbackUrl: `/auth?callbackUrl=${route.fullPath}`,
		})'
	/>
</template>
