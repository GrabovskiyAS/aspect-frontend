<script setup lang="ts">
import UniversalDelete from '@/components/Common/UniversalDelete.vue'
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <UniversalDelete url="/data/currency" :id="props.id" title="Валюта" />
</template>
