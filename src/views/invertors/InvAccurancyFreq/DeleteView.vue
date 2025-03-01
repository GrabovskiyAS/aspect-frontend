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
  <UniversalDelete
    url="/data/Inv_accurancy_freq"
    :id="props.id"
    title="Точность регулирования частоты"
  />
</template>
