import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useBaseUrl } from './baseUrl'

interface ICount {
  _count: {
    staff_opened: number
  }
}

export const useUnreadInvConfigs = defineStore('unreadInvConfigs', () => {
  const unreadInvConfigs = ref<number>(1)
  const baseUrl = useBaseUrl()

  async function count() {
    const data = ref<ICount>()

    try {
      const res = await fetch(`${baseUrl.baseUrlInvertors}/interface/countUnread`, {})
      data.value = await res.json()
    } catch (e) {
      console.log(e)
    }
    if (data.value) unreadInvConfigs.value = data.value._count.staff_opened
  }
  return { unreadInvConfigs, count }
})
