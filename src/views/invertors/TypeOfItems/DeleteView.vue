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
  <UniversalDelete url="/data/Type_of_items" :id="props.id" title="Тип элемента" />
</template>
