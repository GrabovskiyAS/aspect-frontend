import './assets/main.css'
import '../node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// import Nora from '@primevue/themes/nora'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import FocusTrap from 'primevue/focustrap'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('focustrap', FocusTrap)
app.mount('#app')
