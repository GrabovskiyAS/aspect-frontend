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
  <UniversalUpdate url="/data/Waiting_period" :id="props.id" title="Срок ожидания" />
</template>
