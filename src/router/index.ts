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
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
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

export default router
