<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '@/api/useFetch'
import type { IDocument, IUser, ICompany } from '@/Interfaces/invertors.js'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import moment from 'moment'
import { useUserStore } from '@/stores/user'
import { FilterMatchMode } from '@primevue/core/api'
import Checkbox from 'primevue/checkbox'
// import InputText from 'primevue/inputtext'
import { saveLog } from '@/api/log'
import { getCompanyName } from '@/api/utils'
import { deleteDataReductors } from '@/api/dataActionsReductors'
import type { IUserRedConfig } from '@/Interfaces/reductors'

const user = useUserStore()
const data = ref<IDocument<IUserRedConfig>>({ data: [], error: null, loading: true })
const users = ref<IDocument<IUser>>({ data: [], error: null, loading: true })
const companies = ref<IDocument<ICompany>>({ data: [], error: null, loading: true })
const userNames = ref<string[]>([])
const loading = ref<boolean>(true)
const redConfigSelected = ref<any[]>([])

const confirm = useConfirm()
const toast = useToast()

async function loadData() {
  let url: string = '/data/UserRedConfigsListView'
  const userId = user.getUser().userId.value
  if (!user.isStaff()) url += `?user_id=${userId}` // если пользователь не сотрудник, то загружаем только конфигурации пользователя
  data.value = await useFetch(url, 'reductors')

  users.value = await useFetch('/data/Users')
  companies.value = await useFetch('/data/Companies')

  users.value.data.map((item) => userNames.value.push(item.first_name))

  loading.value = false

  saveLog(8, '')
}

loadData()

async function deleteSelectedConfigs() {
  const promises = redConfigSelected.value.map((item) => deleteDataReductors(`/data/UserRedConfigs/${item.id}`))
  await Promise.all(promises)
  .then(() => {
    toast.add({ severity: 'info', summary: 'Успешно', detail: 'Выделенные конфишурации удалены', life: 3000 })

  })
  .catch(() => {
    toast.add({ severity: 'error', summary: 'Тревога! Тревога!', detail: 'Волк унёс козлят!', life: 3000 })

  })
  await loadData()
}

function confirm_delete(id: number) {
  confirm.require({
    message: 'Удалить эту конфигурацию?',
    header: 'Удаление',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отменить',
    rejectProps: {
      label: 'Отменить',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Удалить',
      severity: 'danger',
    },
    accept: () => {
      deleteDataReductors(`/data/UserRedConfigs/${id}`).then(() => {
        loadData()
        toast.add({
          severity: 'info',
          summary: 'Подтверждено',
          detail: 'Конфигурация удалена',
          life: 3000,
        })
      })
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Отмена', detail: 'Действие отменено', life: 3000 })
    },
  })
}

const filters = ref({
  staff_opened: { value: null, matchMode: FilterMatchMode.EQUALS },
  id: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>

  <div v-if="loading">
    <h2>Загружаю данные...</h2>
  </div>
  <div v-else>
    <div class="grid">
      <div class="col-10">
        <h1 class="pt-5">Конфигурации редукторов с переходным фланцем ({{ data.data.length }})</h1>
        <Button
          label="Удалить выбранные конфикурации"
          severity="danger"
          icon="pi pi-cross"
          @click="deleteSelectedConfigs"
          v-if="redConfigSelected?.length > 0"
          class="ml-2"
        />
      </div>
    </div>
    <div v-if="data.data.length > 0">
      <DataTable
        :value="data.data"
        selectionMode="multiple"
        v-model:selection="redConfigSelected"
        sortField="date"
        :sortOrder="-1"
        stripedRows
        tableStyle="min-width: 50rem"
        removableSort
        :loading="data.loading"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        v-model:filters="filters"
        filterDisplay="row"
      >
        <Column selectionMode="multiple" headerStyle="width: 3rem" v-if="user.isStaff()"></Column>
        <Column header="" field="staff_opened" v-if="user.isStaff()" style="width: 5%">
          <template #body="{ data }">
            <i
              class="text-green-500 pi"
              :class="{
                'pi-eye text-green-500': data.staff_opened,
                'pi-eye-slash text-red-400': !data.staff_opened,
              }"
            ></i>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <Checkbox
              v-model="filterModel.value"
              :indeterminate="filterModel.value === null"
              binary
              @change="filterCallback()"
            />
          </template>
        </Column>

        <Column header="Номер" field="id" sortable style="width: 15%">
          <template #body="{ data }">
            <template v-if="user.isStaff()">
              {{ data.full_order_number }}-{{ data.user_id }}/{{ data.id }}
            </template>
            <template v-else>
              {{ data.short_order_number }}{{ data.user_id }}/{{ data.id }}
            </template>
          </template>
          <!-- <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              placeholder="Искать..."
            />
          </template> -->
        </Column>

        <Column header="Заказчик" sortable style="width: 15%" v-if="user.isStaff()">
          <template #body="{ data }">
            <div v-html="getCompanyName(companies.data, users.data, data.user_id, true)"></div>
          </template>
        </Column>

        <Column header="Дата конфигурации" field="date" sortable width="">
          <template #body="{ data }">
            {{ moment(data.date).format('DD.MM.YYYY') }}
          </template>
        </Column>
        <Column header="Комментарий" field="info" sortable width=""> </Column>

        <Column header="Действия">
          <template #body="slotProps">
            <div class="flex gap-2">
              <RouterLink :to="`/reductors/RedConfigs/Update/${slotProps.data.id}`">
                <Button icon="pi pi-folder-open" severity="info" />
              </RouterLink>
              <Button
                icon="pi pi-trash"
                severity="danger"
                @click="confirm_delete(slotProps.data.id)"
              />
            </div>
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
