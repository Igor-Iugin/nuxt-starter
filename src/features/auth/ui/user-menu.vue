<script setup lang='ts'>
import type { ButtonProps } from '@nui/components'


const {
	size = 'xs',
	classes,
	...rest
} = defineProps<ButtonProps>()
const { data } = useAuth()
</script>

<template>
	<NButton
		v-bind='rest'
		:size
		:classes='{ label: $style.label, ...classes ?? {} }'
	>
		<slot name='left-section'>
			<Icon name='gravity-ui:person' />
		</slot>
		{{ data?.email }}
	</NButton>
</template>

<style module>
.label {
	display: inline-flex;
	gap: .25rem;

	font-size: var(--font-size-sm);

	text-transform: capitalize;
}
</style>
