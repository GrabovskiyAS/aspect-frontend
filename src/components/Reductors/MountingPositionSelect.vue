<script setup lang="ts">
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedGearType, IRedMountingPosition } from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import RadioButton from 'primevue/radiobutton'
import { useBaseUrl } from '@/stores/baseUrl'
import { ProgressSpinner } from 'primevue'

const model = defineModel<number>()
const props = defineProps(['gearTypeId', 'showTitle'])
const baseUrl = useBaseUrl()
const mountingPositions = ref<IDocument<IRedMountingPosition>>({
  data: [],
  error: null,
  loading: true,
})
const mountingPosition = ref<IRedMountingPosition>()
const gearType = ref<IDocument<IRedGearType>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

const loadData = async () => {
  mountingPositions.value = await useFetch('/data/RedMountingPositions', 'reductors')
  mountingPosition.value = model.value ? mountingPositions.value.data.find((item) => item.id == model.value) : mountingPositions.value.data[0]
  gearType.value = await useFetch(`/data/RedGearTypes/${props.gearTypeId}`, 'reductors')
  loading.value = false
}

onBeforeMount(() => {
  loadData()
})

watch(mountingPosition, () => {
  if (mountingPosition.value) model.value = mountingPosition.value.id
})
</script>

<template>
  <template v-if="!loading && props.gearTypeId">
    <div class="grid mt-5">
      <div class="col-4">
        <span class="text-2xl font-semibold mt-5 text-primary" v-if="props.showTitle">Монтажное положение редуктора</span>

        <div
          v-for="position in mountingPositions.data"
          :key="position.id"
          class="flex items-center gap-2 mt-1"
        >
          <RadioButton
            v-model="mountingPosition"
            :inputId="position.id?.toString()"
            name="dynamic"
            :value="position"
          />
          <label :for="position.id?.toString()">{{ position.code }}</label>
        </div>
      </div>
      <div class="col-6">
        <img
          v-bind:src="`${baseUrl.s3Storage}/${gearType.data[0].mount_position_image}`" width="400"
        />
      </div>
      <div class="col-2"></div>
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
