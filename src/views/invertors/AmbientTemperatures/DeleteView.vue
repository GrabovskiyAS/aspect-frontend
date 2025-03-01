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
    url="/data/Ambient_temperatures"
    :id="props.id"
    title="Температура окружающей среды"
  />
</template>
