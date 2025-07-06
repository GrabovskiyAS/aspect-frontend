<script setup lang="ts">
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedMountTypeView } from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import RadioButton from 'primevue/radiobutton'
import { useBaseUrl } from '@/stores/baseUrl'
import { ProgressSpinner } from 'primevue'

const mountTypes = ref<IDocument<IRedMountTypeView>>({ data: [], error: null, loading: true })
const model = defineModel<number>()
const mountTypeName =  defineModel<string>('mountTypeName')
const props = defineProps(['id_gear', 'gear_type_id', "showTitle"])
const selectedMountType = ref<IRedMountTypeView>()
const baseUrl = useBaseUrl()

const loadData = async () => {
  mountTypes.value = await useFetch(`/data/RedMountTypesView?id_gear=${props.id_gear}`, 'reductors')
  selectedMountType.value = model.value ? mountTypes.value.data.find((item) => item.id == model.value) :mountTypes.value.data[0]
}

onBeforeMount(() => {
  loadData()
})

watch(selectedMountType, () => {
  if (selectedMountType.value) {
    model.value = selectedMountType.value!.id!
    mountTypeName.value = selectedMountType.value!.description!
  }
})
</script>

<template>
  <template v-if="!mountTypes.loading">
    <div class="mt-5">
      <!-- <span class="text-2xl font-semibold mt-5 text-primary">Способ монтажа редуктора</span> -->

      <div class="grid">
      <div class="col-4">
        <span class="text-2xl font-semibold mt-5 text-primary" v-if="props.showTitle">Монтажное положение редуктора</span>
        <div
          v-for="position in mountTypes.data"
          :key="position.id"
          class="flex items-center gap-2 mt-1"
        >
          <RadioButton
            v-model="selectedMountType"
            :inputId="position.id?.toString()"
            name="dynamic"
            :value="position"
          />
          <label :for="position.id?.toString()">{{ position.description }}</label>
        </div>
      </div>
      <div class="col-6 flex justify-content-center flex-wrap">
        <div>
            <img
              :src="`${baseUrl.s3Storage}/${selectedMountType?.K}`"
              style="height: 300px"
              v-if="props.gear_type_id == 10"
            />
            <img
              :src="`${baseUrl.s3Storage}/${selectedMountType?.C}`"
              style="height: 300px"
              v-if="props.gear_type_id == 20"
            />
            <img
              :src="`${baseUrl.s3Storage}/${selectedMountType?.S}`"
              style="height: 300px"
              v-if="props.gear_type_id == 30"
            />
            <img
              :src="`${baseUrl.s3Storage}/${selectedMountType?.F}`"
              style="height: 300px"
              v-if="props.gear_type_id == 40"
            />
        </div>
      </div>
      <div class="col-2"></div>
    </div>
    </div>
  </template>
  <template v-else>
    <div class="w-full flex flex-wrap justify-content-center align-content-center" style="height: 500px">
      <ProgressSpinner
        style="width: 200px; height: 200px"
        strokeWidth="8"
        fill="transparent"
        animationDuration="2s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
  </template>

</template>
