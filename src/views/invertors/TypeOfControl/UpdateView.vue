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
  <UniversalUpdate url="/data/Type_of_control" :id="props.id" title="Тип управления" />
</template>
