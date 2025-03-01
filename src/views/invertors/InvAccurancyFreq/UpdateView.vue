<script setup lang="ts">
import UniversalUpdate from '@/components/Common/UniversalUpdate.vue'
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <UniversalUpdate
    url="/data/Inv_accurancy_freq"
    :id="props.id"
    title="Точность регулирования частоты"
  />
</template>
