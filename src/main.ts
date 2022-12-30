import { createApp } from 'vue'

import { store } from './store'
import router from './router'

import App from './App.vue'
import CIcon from './components/core/CIcon.vue'
import CButton from './components/core/CButton.vue'
import CBadge from './components/core/CBadge.vue'

import './assets/styles.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.component('cicon', CIcon)
app.component('cbutton', CButton)
app.component('cbadge', CBadge)

router.isReady()
  .then(() => app.mount('#app'))
