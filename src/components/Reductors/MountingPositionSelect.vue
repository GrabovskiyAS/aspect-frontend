<script setup lang="ts">
import type { IDocument } from '@/Interfaces/invertors'
import type { IRedGearType, IRedMountingPosition } from '@/Interfaces/reductors'
import { ref, onBeforeMount, watch } from 'vue'
import { useFetch } from '@/api/useFetch'
import RadioButton from 'primevue/radiobutton'
import { useBaseUrl } from '@/stores/baseUrl'

const model = defineModel<number>()
const props = defineProps(['gearTypeId'])
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
  mountingPosition.value = mountingPositions.value.data[0]
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
    <div class="grid">
      <div class="col">
        <span class="text-2xl font-semibold mt-5 text-primary">Монтажное положение</span>

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
      <div class="col">
        <img
          v-bind:src="`${baseUrl.s3Storage}/${gearType.data[0].mount_position_image}`"
          height="300"
        />
      </div>
    </div>
  </template>
</template>
