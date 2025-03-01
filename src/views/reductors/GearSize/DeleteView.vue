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
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import { deleteDataReductors } from '@/api/dataActionsReductors'
import MySelect from '@/components/Common/MySelect.vue'
import { useRouter } from 'vue-router'

const data = ref<IDocument<IRedGearSize>>({ data: [], error: null, loading: true })
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

  deleteDataReductors(`/data/RedGearTypes/${props.id}`)
    .then(() => {
      router.push('/reductors/RedGearSize/List')
    })
    .catch((error) => {
      console.log(error)
    })
  saving.value = false
}

async function loadData() {
  data.value = await useFetch('/data/RedGearSizes', 'reductors')
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
  <h1 class="pt-5">RedGearSize. Удалить?</h1>
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
        <InputText
          id="code_size_manuf"
          v-model="data.data[0].code_size_manuf"
          disabled
          class="w-full"
        />
        <label for="code_size_manuf">code_size_manuf</label>
      </FloatLabel>
    </div>

    <div class="field pt-5">
      <MySelect
        :options="gear_types.data"
        v-model="data.data[0].gear_type_id"
        :value="data.data[0].gear_type_id"
        label="gear_type"
        optionLabel="name"
        disabled
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="gear_steps.data"
        v-model="data.data[0].gear_steps_id"
        :value="data.data[0].gear_steps_id"
        label="gear_steps_id"
        optionLabel="id"
        disabled
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="list_of_aval_mounts.data"
        v-model="data.data[0].list_of_aval_mount_id"
        :value="data.data[0].list_of_aval_mount_id"
        label="list_of_aval_mount"
        optionLabel="description"
        disabled
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="red_item_types.data"
        v-model="data.data[0].red_item_type_id"
        :value="data.data[0].red_item_type_id"
        label="red_item_type"
        optionLabel="description"
        disabled
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="gear_box_list_sizes.data"
        v-model="data.data[0].gear_box_list_size_id"
        :value="data.data[0].gear_box_list_size_id"
        label="gear_box_list_size"
        optionLabel="description"
        disabled
      />
    </div>

    <div class="field pt-5">
      <MySelect
        :options="shaft_aval_lists.data"
        v-model="data.data[0].shaft_aval_list_id"
        :value="data.data[0].shaft_aval_list_id"
        label="shaft_aval_list"
        optionLabel="description"
        disabled
      />
    </div>

    <div class="flex flex-wrap justify-center gap-4 pt-5">
      <RouterLink :to="`/reductors/RedGearSize/List`" rel="noopener">
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
