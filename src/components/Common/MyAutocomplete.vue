<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import FloatLabel from 'primevue/floatlabel'

const props = defineProps(['options', 'label', 'value', 'disabled', 'optionLabel'])
const model = defineModel()
const innermodel = ref<any>(null)
const oLabel = ref<string>('name')

const filteredOptions = ref<[]>([])

const search = (event: any) => {
  filteredOptions.value = props.options.filter((item: any) =>
    item[oLabel.value]
      .toString()
      .toUpperCase()
      .includes(event.query.toUpperCase().replace(',', '.')),
  )
}

watch(innermodel, () => {
  if (innermodel.value) {
    model.value = innermodel.value.id
  }
})

onMounted(() => {
  if (props.value && props.options) {
    innermodel.value = props.options.find((item: any) => item.id == props.value)
    if (props.optionLabel) oLabel.value = props.optionLabel
    else oLabel.value = 'name'
  }

})
</script>

<template>
  <FloatLabel>
    <AutoComplete
      v-model="innermodel"
      :optionLabel="optionLabel"
      :suggestions="filteredOptions"
      @complete="search"
      dropdown
      :disabled="disabled"
      class="w-full md:w-56"
    />
    <label>{{ props.label }}</label>
  </FloatLabel>
</template>
