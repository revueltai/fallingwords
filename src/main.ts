import App from '@/App.vue'
import Badge from '@/components/shared/Badge.vue'
import Breadcrumbs from '@/components/shared/Breadcrumbs.vue'
import Button from '@/components/shared/Button.vue'
import Flag from '@/components/shared/Flag.vue'
import Icon from '@/components/shared/Icon.vue'
import Input from '@/components/shared/Input.vue'
import Label from '@/components/shared/Label.vue'
import Modal from '@/components/shared/Modal.vue'
import ProgressBar from '@/components/shared/ProgressBar.vue'
import Select from '@/components/shared/Select.vue'
import Switch from '@/components/shared/Switch.vue'
import TextBlock from '@/components/shared/TextBlock.vue'
import Toast from '@/components/shared/Toast.vue'
import en from '@/configs/locales/en.json'
import { setupRouter } from '@/router'
import { detectBrowserLanguage, setupI18n } from '@/services/I18nService'
import { subscribeToUserStore } from '@/services/UserStoreSubscriber'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import '@/assets/main.css'

const locale = detectBrowserLanguage()

const i18n = setupI18n({
  legacy: false,
  globalInjection: true,
  locale,
  fallbackLocale: 'en',
  messages: { en },
})

const router = setupRouter(i18n)

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.component('TextBlock', TextBlock)
app.component('Breadcrumbs', Breadcrumbs)
app.component('Modal', Modal)
app.component('Flag', Flag)
app.component('Toast', Toast)
app.component('Label', Label)
app.component('Switch', Switch)
app.component('Input', Input)
app.component('Select', Select)
app.component('Icon', Icon)
app.component('Button', Button)
app.component('Badge', Badge)
app.component('ProgressBar', ProgressBar)

subscribeToUserStore()

router.isReady()
  .then(() => app.mount('#app'))
