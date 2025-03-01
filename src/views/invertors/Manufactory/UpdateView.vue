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
  <UniversalUpdate url="/data/Manufactory" :id="props.id" title="Производитель" />
</template>
