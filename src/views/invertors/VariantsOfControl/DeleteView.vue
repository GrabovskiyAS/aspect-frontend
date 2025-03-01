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
  <UniversalDelete url="/data/Variants_of_control" :id="props.id" title="Способ управления" />
</template>
