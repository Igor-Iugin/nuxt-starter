<script lang='ts' setup>
useHead({
	title: 'Home',
})
</script>

<template>
	<div :class='$style.root'>
	</div>
</template>

<style module>
.root {
	overflow: hidden;
	display: grid;
	grid-template-rows: 1fr 1fr;
	gap: var(--spacing-lg);

	height: 100%;
	min-height: 0;
}
</style>
