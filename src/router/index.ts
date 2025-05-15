import type { I18n } from 'vue-i18n'
import type { RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'
import { getLocale, isI18nInitialized, loadLocaleMessages, setI18nLanguage } from '@/services/I18nService'
import { useModalStore } from '@/stores/modal.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useUserStore } from '@/stores/user.store'
import { isEmptyArray } from '@/utils'
import { createRouter, createWebHistory } from 'vue-router'

const publicRoutes = ['Splash', 'Welcome']

async function validateUser(to: RouteLocationNormalized): Promise<{ name: string } | undefined> {
  const userStore = useUserStore()
  const isPublicRoute = publicRoutes.includes(to.name as string)

  if (!userStore.isAuthenticated) {
    await userStore.loadUserAccount()
  }

  if (userStore.isAuthenticated) {
    if (isPublicRoute) {
      return { name: 'Dashboard' }
    }
  } else if (!isPublicRoute) {
    return { name: 'Welcome' }
  }

  return undefined
}

async function setI18nAppLanguage(i18n: I18n) {
  const settingsStore = useSettingsStore()
  const appCurrentLocale = getLocale(i18n) as AppLocaleCode

  if (!isI18nInitialized) {
    if (settingsStore.appLocales.includes(appCurrentLocale)) {
      if (!i18n.global.availableLocales.includes(appCurrentLocale)) {
        await loadLocaleMessages(i18n, appCurrentLocale)
      }

      setI18nLanguage(i18n, appCurrentLocale)
    }
  }
}

export function setupRouter(i18n: I18n, initialLocale: AppLocaleCode): Router {
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
    const modalStore = useModalStore()
    modalStore.closeModal()

    setI18nAppLanguage(i18n)

    const settingsStore = useSettingsStore()

    const validLocale = settingsStore.appLocales.includes(initialLocale)
      ? initialLocale
      : 'en'

    i18n.global.locale = validLocale

    const route = await validateUser(to)
    if (route) {
      next(route)
    } else {
      next()
    }
  })

  return router
}
