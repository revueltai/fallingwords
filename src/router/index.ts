import { createRouter, createMemoryHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Splash',
    component: () => import('@/views/Splash.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/Game.vue')
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  strict: true,
  routes
})

export default router
