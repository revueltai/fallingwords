import Badge from '@/components/shared/Badge.vue'
import Button from '@/components/shared/Button.vue'
import Icon from '@/components/shared/Icon.vue'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('Icon', Icon)
app.component('Button', Button)
app.component('Badge', Badge)

router.isReady()
  .then(() => app.mount('#app'))
