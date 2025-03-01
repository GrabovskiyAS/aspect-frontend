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
  <UniversalDelete url="/data/Inv_sizes" :id="props.id" title="Размер" />
</template>
