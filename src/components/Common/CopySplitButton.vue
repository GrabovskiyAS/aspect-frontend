<template>
  <SplitButton icon="pi pi-link" @click="copyLink(props.url1)" :model="items">
  </SplitButton>
</template>

<script setup lang="ts">
import SplitButton from 'primevue/splitbutton'

const items = [
    {
        label: 'С ценами',
        command: () => copyLink(props.url1)
    },
    {
        label: 'Без цен',
        command: () => copyLink(props.url2)
    },
  ]

const props = defineProps({
  url1: { type: String, default: () => window.location.href },
  url2: { type: String, default: () => window.location.href }
})

async function copyLink(url: string) {

  try {
    await navigator.clipboard.writeText(url)
  } catch (e) {
    const textarea = document.createElement('textarea')
    textarea.value = url
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}
</script>
