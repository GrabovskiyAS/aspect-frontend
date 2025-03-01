<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Select from 'primevue/select'
import FloatLabel from 'primevue/floatlabel'

const props = defineProps(['options', 'label', 'value', 'disabled', 'optionLabel'])
const model = defineModel()
const innermodel = ref<any>(null)
const oLabel = ref<string>('name')

watch(innermodel, () => {
  if (innermodel.value) {
    model.value = innermodel.value.id
  }
})

onMounted(() => {
  innermodel.value = props.options.find((item: any) => item.id == props.value)

  if (props.optionLabel) oLabel.value = props.optionLabel
  else oLabel.value = 'name'
})
</script>

<template>
  <FloatLabel>
    <Select
      v-model="innermodel"
      :optionLabel="optionLabel"
      :options="options"
      :disabled="disabled"
      class="w-full md:w-56"
    />
    <label>{{ props.label }}</label>
  </FloatLabel>
</template>
