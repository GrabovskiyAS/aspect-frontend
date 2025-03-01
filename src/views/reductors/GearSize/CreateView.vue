<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument } from '@/Interfaces/invertors'
import type {
  IRedGearBoxListSize,
  IRedGearSize,
  IRedGearType,
  IRedItemType,
  IRedMountAvalList,
  IRedShaftTypeAvalList,
  IRedStep,
} from '@/Interfaces/reductors'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { updateDataReductors } from '@/api/dataActionsReductors'
import MySelect from '@/components/Common/MySelect.vue'
import { useRouter } from 'vue-router'

const data = ref<IRedGearSize>({
  code_size_manuf: '',
  gear_type_id: 0,
  gear_steps_id: 0,
  list_of_aval_mount_id: 0,
  red_item_type_id: 0,
  gear_box_list_size_id: 0,
  shaft_aval_list_id: 0,
})
const gear_types = ref<IDocument<IRedGearType>>({ data: [], error: null, loading: true })
const gear_steps = ref<IDocument<IRedStep>>({ data: [], error: null, loading: true })
const list_of_aval_mounts = ref<IDocument<IRedMountAvalList>>({
  data: [],
  error: null,
  loading: true,
})
const red_item_types = ref<IDocument<IRedItemType>>({ data: [], error: null, loading: true })
const gear_box_list_sizes = ref<IDocument<IRedGearBoxListSize>>({
  data: [],
  error: null,
  loading: true,
})
const shaft_aval_lists = ref<IDocument<IRedShaftTypeAvalList>>({
  data: [],
  error: null,
  loading: true,
})
const loading = ref<boolean>(true)

const props = defineProps(['id'])
const saving = ref<boolean>(false)
const router = useRouter()

const submission = async () => {
  saving.value = true

  updateDataReductors(`/data/RedGearTypes/${props.id}`, data.value)
    .then((response) => {
      router.push(`/reductors/RedGearSize/Update/${response.data.id}`)
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  gear_types.value = await useFetch('/data/RedGearTypes', 'reductors')
  gear_steps.value = await useFetch('/data/RedSteps', 'reductors')
  list_of_aval_mounts.value = await useFetch('/data/RedMountAvalLists', 'reductors')
  red_item_types.value = await useFetch('/data/RedItemTypes', 'reductors')
  gear_box_list_sizes.value = await useFetch('/data/RedGearBoxListSizes', 'reductors')
  shaft_aval_lists.value = await useFetch('/data/RedShaftTypeAvalLists', 'reductors')
  loading.value = false
}

loadData()
</script>

<template>
  <h1 class="pt-5">RedGearSize. Создание</h1>
  <div v-if="loading">loading ...</div>
  <div v-else class="pt-5">
    <div class="field pt-5">
      <FloatLabel>
        <InputText id="code_size_manuf" v-model="data.code_size_manuf" class="w-full" />
        <label for="code_size_manuf">code_size_manuf</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <MySelect
        :options="gear_types.data"
        v-model="data.gear_type_id"
        :value="data.gear_type_id"
        label="gear_type"
        optionLabel="name"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="gear_steps.data"
        v-model="data.gear_steps_id"
        :value="data.gear_steps_id"
        label="gear_steps_id"
        optionLabel="id"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="list_of_aval_mounts.data"
        v-model="data.list_of_aval_mount_id"
        :value="data.list_of_aval_mount_id"
        label="list_of_aval_mount"
        optionLabel="description"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="red_item_types.data"
        v-model="data.red_item_type_id"
        :value="data.red_item_type_id"
        label="red_item_type"
        optionLabel="description"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="gear_box_list_sizes.data"
        v-model="data.gear_box_list_size_id"
        :value="data.gear_box_list_size_id"
        label="gear_box_list_size"
        optionLabel="description"
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="shaft_aval_lists.data"
        v-model="data.shaft_aval_list_id"
        :value="data.shaft_aval_list_id"
        label="shaft_aval_list"
        optionLabel="description"
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedGearSize/List`" rel="noopener">
        <Button link label="Отменить" />
      </RouterLink>
      <Button
        label="Создать"
        severity="success"
        icon="pi pi-check"
        iconPos="right"
        @click="submission"
        :loading="saving"
      />
    </div>
  </div>
</template>
