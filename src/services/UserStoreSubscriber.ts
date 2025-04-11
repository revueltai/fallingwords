import { useUserStore } from '@/stores/user.store'

export function subscribeToUserStore() {
  const store = useUserStore()
  store.$subscribe(() => store.updateUserData())
}
