import type { UserEntity } from '@entities/user'

import { $modals } from 'nuance-ui/modals'

import type { UserModalProps } from './edit-user-drawer.vue'

import EditUserDrawer from './edit-user-drawer.vue'


export const openUserModal = $modals.create<UserModalProps, UserEntity>('user', EditUserDrawer)
