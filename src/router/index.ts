import { useAppStore } from '@/stores/app.store'
import { useUserStore } from '@/stores/user.store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  strict: true,
  routes: [
    {
      path: '/',
      name: 'Splash',
      component: () => import('../views/SplashView.vue'),
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('../views/FirstSessionView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/streak',
      name: 'Streak',
      component: () => import('../views/StreakView.vue'),
    },
    {
      path: '/game-lobby',
      name: 'GameLobby',
      component: () => import('../views/GameLobbyView.vue'),
    },
    {
      path: '/collections',
      name: 'Collections',
      component: () => import('../views/CollectionsView.vue'),
    },
    {
      path: '/collection/:uid',
      name: 'Collection',
      component: () => import('../views/CollectionView.vue'),
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('../views/GameView.vue'),
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: () => import('../views/TutorialView.vue'),
    },
  ],
})

async function validateUser(to: any): Promise<{ name: string } | undefined> {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated) {
    console.log(111)

    await userStore.loadUserAccount()
  }

  if (userStore.isFirstSession && to.name !== 'Welcome') {
    console.log(222)
    return { name: 'Welcome' }
  }

  if (!userStore.isFirstSession && !userStore.isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }

  // if (userStore.isAuthenticated && to.name === 'Welcome') {
  //   return { name: 'Dashboard' }
  // }

  return undefined
}

function isAppScreen(to: any): boolean {
  return !['/game', '/welcome', '/'].includes(to.path)
}

router.beforeEach(async (to, from, next) => {
  const route = await validateUser(to)
  const appStore = useAppStore()
  appStore.setAppMenu(isAppScreen(to))

  if (route) {
    next(route)
  } else {
    next()
  }
})

export default router
