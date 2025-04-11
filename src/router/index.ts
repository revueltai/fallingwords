import type { I18n } from 'vue-i18n'
import type { RouteLocationNormalized, Router, RouteRecordRaw } from 'vue-router'
import { APP_LOCALES } from '@/configs/constants'
import { getLocale, isI18nInitialized, loadLocaleMessages, setI18nLanguage } from '@/services/I18nService'
import { useModalStore } from '@/stores/modal.store'
import { useUserStore } from '@/stores/user.store'
import { createRouter, createWebHistory } from 'vue-router'

const publicRoutes = ['Splash', 'Welcome']

async function validateUser(to: RouteLocationNormalized): Promise<{ name: string } | undefined> {
  const userStore = useUserStore()
  const isPublicRoute = publicRoutes.includes(to.name as string)

  if (!userStore.isAuthenticated) {
    // console.log(1, 'load')
    await userStore.loadUserAccount()
  }

  // console.log(2, userStore.isAuthenticated, isPublicRoute, to.name)

  if (userStore.isAuthenticated) {
    // console.log(3, 'isAuthenticated', to.name)
    if (isPublicRoute) {
      return { name: 'Dashboard' }
    }
  } else if (!isPublicRoute) {
    // console.log(5, 'notPublicRoute', to.name)
    return { name: 'Welcome' }
  }

  // console.log(6)

  return undefined
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
    const modalStore = useModalStore()
    modalStore.closeModal()

    setI18nAppLanguage(i18n)

    const route = await validateUser(to)
    if (route) {
      next(route)
    } else {
      next()
    }
  })

  return router
}
