<script lang='ts' setup>
import { userQueries } from '@entities/user'
import { LogoutButton, UserMenu } from '@features/auth'
import { openUserModal } from '@features/user'
import { NModalsProvider } from '@nui/modals'
import { useQuery } from '@tanstack/vue-query'
import { noop } from '@vueuse/core'


const theme = useTheme()
const { data } = useQuery(userQueries.me)
</script>

<template>
	<NAppShell
		:class='$style.root'
		:date-config='{ locale: "ru-RU" }'
		aside
		footer
		with-border
	>
		<NAppShellHeader :class='$style.header'>
			logo

			<NTitle :class='$style.title'>
				Title
			</NTitle>

			<div :class='$style.actions'>
				<NActionIcon @click='theme.preference = theme.value === "light" ? "dark" : "light"'>
					<Icon :name='theme.value === "light" ? "gravity-ui:moon" : "gravity-ui:sun"' />
				</NActionIcon>
				<NButtonGroup :class='$style.logout'>
					<UserMenu @click='openUserModal({ user: data! }).catch(noop)' />
					<LogoutButton size='30px' />
				</NButtonGroup>
			</div>
		</NAppShellHeader>

		<NAppShellNavbar :class='$style.navbar'>
			Navigation
		</NAppShellNavbar>

		<NAppShellMain :class='$style.main'>
			<slot />
		</NAppShellMain>

		<NModalsProvider />
	</NAppShell>
</template>

<style module>
.root {
	--app-shell-navbar-width: rem(260px);
	--app-shell-footer-height: rem(30px);
	--app-shell-element-padding: .75rem;
}

.header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: var(--spacing-sm);
	align-items: center;
}

.navbar {
	display: grid;
	grid-template-rows: auto 1fr auto;
	gap: var(--spacing-sm);
	align-items: center;

	padding-inline: .5rem;
}

.main {
	height: 100dvh;
}

.title {
	text-align: center;
}

.logout {
	&>button:last-child {
		border-left-width: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
}

.actions {
	display: flex;
	gap: var(--spacing-lg);
	align-items: center;
}
</style>
