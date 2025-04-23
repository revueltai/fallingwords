import { useSoundStore } from '@/stores/sounds.store'
import { useUserStore } from '@/stores/user.store'

export function subscribeToStores() {
  const userStore = useUserStore()
  const soundStore = useSoundStore()

  userStore.$subscribe(() => {
    userStore.updateUserData()
  })

  soundStore.$subscribe(() => {
    userStore.updateUserData()
  })
}
