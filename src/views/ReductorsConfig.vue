<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import type { IDocument } from '@/Interfaces/invertors'
import axios from 'axios'
import { useBaseUrl } from '@/stores/baseUrl'

interface RedGearType {
  id?: number
  name: string
  description: string
  mount_position_image: string
}

const baseUrl = useBaseUrl()
const gearTypes = ref<IDocument<RedGearType>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

const loadData = () => {
  axios
    .get(`${baseUrl.baseUrlReductors}/data/RedGearTypes`)
    .then((response) => (gearTypes.value.data = response.data))
  loading.value = false
}

onBeforeMount(() => {
  loadData()
})
</script>

<template>
  ййй
  <template v-if="!loading">
    {{ gearTypes.data }}
  </template>
</template>
