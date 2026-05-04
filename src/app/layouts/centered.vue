<template>
	<NAppShell>
		<NAppShellMain :class='$style.root'>
			<slot />
		</NAppShellMain>
	</NAppShell>
</template>

<style module>
.root {
	display: grid;
	place-content: center;

	min-height: 100dvh;
}
</style>
