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
  <UniversalUpdate url="/data/Inv_DC_drossel" :id="props.id" title="DC дроссель" />
</template>
