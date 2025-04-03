import App from '@/App.vue'
import Badge from '@/components/shared/Badge.vue'
import Breadcrumbs from '@/components/shared/Breadcrumbs.vue'
import Button from '@/components/shared/Button.vue'
import Flag from '@/components/shared/Flag.vue'
import Icon from '@/components/shared/Icon.vue'
import Input from '@/components/shared/Input.vue'
import Label from '@/components/shared/Label.vue'
import Modal from '@/components/shared/Modal.vue'
import PageWrapper from '@/components/shared/PageWrapper.vue'
import ProgressBar from '@/components/shared/ProgressBar.vue'
import Select from '@/components/shared/Select.vue'
import Switch from '@/components/shared/Switch.vue'

import TextBlock from '@/components/shared/TextBlock.vue'
import Toast from '@/components/shared/Toast.vue'
import router from '@/router'

import { subscribeToUserStore } from '@/stores/services/user.store.subscriber'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import '@/assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('PageWrapper', PageWrapper)
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
