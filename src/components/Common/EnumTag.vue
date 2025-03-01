<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import Tag from 'primevue/tag'
const props = defineProps(['enum','value'])
const display = ref()

onBeforeMount(() => {
  display.value = props.enum.find((item: any) => item.key == props.value)
})
</script>

<template>
  <Tag :value="display.name" :severity="display.severity"/>
</template>
