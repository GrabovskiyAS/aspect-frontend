<template>
  <Button @click="copyLink" :disabled="busy" icon="pi pi-link" :label="label">
  </Button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  url: { type: String, default: () => window.location.href }
})

const busy   = ref(false)
const copied = ref(false)
const label = computed(() => {
  if (!copied.value && !busy.value) { return 'Копировать ссылку' }
  else if (busy.value) { return 'Копируем...'}
  else return 'Скопировано!';
})

async function copyLink() {
  busy.value = true
  try {
    await navigator.clipboard.writeText(props.url)
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = props.url
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  busy.value = false
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<style scoped>
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
