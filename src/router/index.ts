import type { I18n } from 'vue-i18n'
import type { Router, RouteRecordRaw } from 'vue-router'
import { APP_LOCALES } from '@/configs/constants'
import { useAppStore } from '@/stores/app.store'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { getLocale, isI18nInitialized, loadLocaleMessages, setI18nLanguage } from '@/utils/i18n'
import { createRouter, createWebHistory } from 'vue-router'

async function validateUser(to: any): Promise<{ name: string, params?: Record<string, any> } | undefined> {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated) {
    await userStore.loadUserAccount()

    if (userStore.isFirstSession && to.name !== 'Welcome') {
      return { name: 'Welcome' }
    }
  }

  // if (!userStore.isFirstSession && !userStore.isAuthenticated) {
  //   return { name: 'Login' }
  // }

  return undefined
}

function isAppScreen(to: any): boolean {
  return !['/game', '/welcome', '/'].includes(to.path)
}

async function setI18nAppLanguage(i18n: I18n) {
  const appCurrentLocale = getLocale(i18n)

  if (!isI18nInitialized) {
    if (APP_LOCALES.includes(appCurrentLocale)) {
      if (!i18n.global.availableLocales.includes(appCurrentLocale)) {
        await loadLocaleMessages(i18n, appCurrentLocale)
      }

      setI18nLanguage(i18n, appCurrentLocale)
    }
  }
}

export function setupRouter(i18n: I18n): Router {
  const routes: RouteRecordRaw[] = [
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
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/streak',
      name: 'Streak',
      component: () => import('../views/StreakView.vue'),
    },
    {
      path: '/shop',
      name: 'Shop',
      component: () => import('../views/ShopView.vue'),
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
  ]

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    strict: true,
    routes,
  })

  router.beforeEach(async (to, from, next) => {
    const route = await validateUser(to)
    const appStore = useAppStore()
    const modalStore = useModalStore()

    appStore.setAppMenu(isAppScreen(to))
    modalStore.closeModal()

    setI18nAppLanguage(i18n)

    if (route) {
      next(route)
    } else {
      next()
    }
  })

  return router
}
