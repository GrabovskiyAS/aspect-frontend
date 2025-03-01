<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import { RouterLink } from 'vue-router'
import { FilterMatchMode } from '@primevue/core/api'
import type { IDocument, IUser, ICompany, ISimpleDictionary } from '@/Interfaces/invertors.js'
import type { UserRedDiscount, RedDiscount } from '@/Interfaces/reductors'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { getValueFromDictionary } from '@/api/getValueFromDictionary'
import EnumTag from '@/components/Common/EnumTag.vue'
import { roles } from '@/assets/enums'

const data = ref<IDocument<IUser>>({ data: [], error: null, loading: true })
const companies = ref<IDocument<ICompany>>({ data: [], error: null, loading: true })
const discountGroups = ref<IDocument<ISimpleDictionary>>({ data: [], error: null, loading: true })
const redDiscounts = ref<IDocument<RedDiscount>>({ data: [], error: null, loading: true })
const userRedDiscounts = ref<IDocument<UserRedDiscount>>({ data: [], error: null, loading: true })
const loading = ref<boolean>(true)

const getRedDiscount = (userId: number) => {
  const userRedDiscount = userRedDiscounts.value.data.find((item) => item.user_id == userId)
  if (userRedDiscount) {
    const discount = redDiscounts.value.data.find((item) => item.id == userRedDiscount!.discount_id)
    return discount!.name
  } else {
    return 'Не задано'
  }
}

async function loadData() {
  data.value = await useFetch('/data/Users')
  companies.value = await useFetch('/data/Companies')
  discountGroups.value = await useFetch('/data/InvDiscountGroup')
  redDiscounts.value = await useFetch('/data/RedDiscounts', 'reductors')
  userRedDiscounts.value = await useFetch('/data/RedUserDiscounts', 'reductors')
  loading.value = false
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'company.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

loadData()
</script>

<template>
  <div v-if="loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Пользователи</h1>
      </div>
      <div class="col-2 flex justify-content-end flex-wrap">
        <RouterLink :to="`/invertors/Users/Create/`" rel="noopener">
          <Button label="Создать" severity="info"></Button>
        </RouterLink>
      </div>
    </div>
    <div v-if="data.data">
      <DataTable
        v-model:filters="filters"
        :value="data.data"
        stripedRows
        tableStyle="min-width: 50rem"
        :loading="data.loading"
        filterDisplay="row"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        :globalFilterFields="['name']"
      >
        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/invertors/Users/Update/${slotProps.data.id}`">
                <Button icon="pi pi-pencil" severity="info" />
              </RouterLink>
              <RouterLink :to="`/invertors/Users/Delete/${slotProps.data.id}`">
                <Button icon="pi pi-trash" severity="danger" />
              </RouterLink>
            </div>
          </template>
        </Column>

        <Column field="username" header="login" sortable style="width: 15%">
          <template #body="{ data }">
            {{ data.username }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Искать"
            />
          </template>
        </Column>

        <Column field="first_name" header="Имя" sortable style="width: 10%"></Column>

        <Column field="company.name" header="Организация" sortable style="width: 10%">
          <template #body="{ data }">
            <div v-if="data.companyId">
                {{ data.company.name }}
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Искать"
            />
          </template>
        </Column>

        <Column field="email" header="email" sortable style="width: 10%">
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Искать"
            />
          </template>
        </Column>

        <Column field="is_active" header="Активный" sortable style="width: 10%">
          <template #body="{ data }">
            <Tag value="Активный" severity="success" v-if="data.is_active"/>
          </template>
        </Column>

        <Column header="Группа скидок преобразователи частосты" style="width: 10%">
          <template #body="{ data }">
            <div v-if="data.discountGroupId">
              {{ getValueFromDictionary(discountGroups.data, data.discountGroupId, 'name') }}
            </div>
          </template>
        </Column>

        <Column header="Накрутка на редукторы" style="width: 10%">
          <template #body="{ data }">
            <div v-if="data.discountGroupId">
              {{ getRedDiscount(data.id) }}
            </div>
          </template>
        </Column>

        <Column field="roles" header="Роль" style="width: 10%">
          <template #body="{ data }">
            <template v-for="role in data.roles" v-bind:key="role">
              <EnumTag :enum="roles" :value="role" class="mt-1"/>
            </template>
          </template>
        </Column>


      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
}
</style>
