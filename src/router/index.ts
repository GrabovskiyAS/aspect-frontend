import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useLoginStore } from '@/stores/login'
import { routesInvertors } from './routesInvertors'
import { routesReductors } from './routesReductors'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routesInvertors, ...routesReductors],
})

router.beforeEach(async (to) => {
  const user = useUserStore()
  const loginModal = useLoginStore()
  await user
    .checkIsAuth()
    .then(() => {})
    .catch(() => {
      if (to.name !== 'home' && to.name !== 'contacts') loginModal.visible = true
    })
})

export default router
