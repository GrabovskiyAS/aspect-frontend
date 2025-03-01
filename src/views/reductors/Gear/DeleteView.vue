<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type {
  IRedGearEfficiency,
  IRedGearSize,
  IRedGear,
  IRedRatioCode,
} from '@/Interfaces/reductors'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

import FloatLabel from 'primevue/floatlabel'
import MySelect from '@/components/Common/MySelect.vue'
import { deleteDataReductors } from '@/api/dataActionsReductors'
import { useRouter } from 'vue-router'

const data = ref<IDocument<IRedGear>>({ data: [], error: null, loading: true })
const efficiencies = ref<IDocument<IRedGearEfficiency>>({ data: [], error: null, loading: true })
const sizes = ref<IDocument<IRedGearSize>>({ data: [], error: null, loading: true })
const ratio = ref<IDocument<IRedRatioCode>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  deleteDataReductors(`/data/RedGears/${props.id}`)
    .then(() => {
      router.push('/reductors/RedGear/List')
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch(`/data/RedGears/${props.id}`, 'reductors')
  efficiencies.value = await useFetch('/data/RedGearEfficiencies', 'reductors')
  sizes.value = await useFetch('/data/RedGearSizes', 'reductors')
  ratio.value = await useFetch('/data/RedRatioCodes', 'reductors')
  loading.value = false
}

loadData()
</script>

<template>
  <h1 class="pt-5">RedGear. Удаление</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="id" v-model="data.data[0].id" disabled class="w-full" />
        <label for="id">id</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputText id="item_name" v-model="data.data[0].item_name" disabled class="w-full" />
        <label for="item_name">item_name</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="t2n" v-model="data.data[0].t2n" disabled class="w-full" />
        <label for="t2n">t2n</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="p1n" v-model="data.data[0].p1n" disabled class="w-full" />
        <label for="p1n">p1n</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <FloatLabel>
        <InputNumber id="ex_ratio" v-model="data.data[0].ex_ratio" disabled class="w-full" />
        <label for="p1n">ex_ratio</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <MySelect
        v-model="data.data[0].gear_size_id"
        :value="data.data[0].gear_size_id"
        :options="sizes.data"
        label="code_size_manuf"
        optionLabel="code_size_manuf"
        disabled
        class="w-full"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        v-model="data.data[0].ratio_code_id"
        :value="data.data[0].ratio_code_id"
        :options="ratio.data"
        label="ratio_code_id"
        optionLabel="code_name"
        disabled
        class="w-full"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        v-model="data.data[0].gear_efficiency_id"
        :value="data.data[0].gear_efficiency_id"
        :options="efficiencies.data"
        label="gear_efficiency_id"
        optionLabel="description"
        disabled
        class="w-full"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedGear/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Удалить"
        severity="danger"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
