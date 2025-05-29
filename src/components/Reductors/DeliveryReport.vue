<script lang="ts" setup>
import { ref, onBeforeMount, watch } from 'vue'
import DisplayPrice from '@/components/Common/DisplayPrice.vue'
import type { OutputAdapter, IGearMass, ILogistic } from '@/Interfaces/reductors'
import type { IDocument } from '@/Interfaces/invertors'
import { useFetch } from '@/api/useFetch'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useUserStore } from '@/stores/user'

const model = defineModel()
const user = useUserStore()

const findDeliveryValue = (data: ILogistic[], mass: number) => {
  if (data && mass)
    return data.reduce((prev, curr) => {
      return (Math.abs(Number(curr.name) - mass) < Math.abs(Number(prev.name) - mass) ? curr : prev);
    });
  else
    return {id: 0, name: '', value: 0}
}

const props = defineProps(['red'])
const loading = ref<boolean>(true)
const redDiscount = 0.5
const exchangeRate = props.red.rate_rub_cny;
const adapter = ref<IDocument<OutputAdapter>>({ data: [], error: [], loading: true })
const adapterPrice = ref<IDocument<any>>({ data: [], error: [], loading: true })
const mass = ref<IDocument<IGearMass>>({ data: [], error: [], loading: true })
const deliveryToChinaLogistics = ref<IDocument<ILogistic>>({ data: [], error: [], loading: true })
const deliveryToChinaBorders = ref<IDocument<ILogistic>>({ data: [], error: [], loading: true })
const deliveryRussias = ref<IDocument<ILogistic>>({ data: [], error: [], loading: true })
const taxes1 = ref<IDocument<ILogistic>>({ data: [], error: [], loading: true })
const taxes2 = ref<IDocument<ILogistic>>({ data: [], error: [], loading: true })
const options = ref()
const gearOptionsPrice = ref<number>(0)

const total1 = ref<number>(0)
const totalMass = ref<number>(0)
const deliveryToChinaLogistic = ref<ILogistic>()
const deliveryToChinaBorder = ref<ILogistic>()
const deliveryRussia = ref<ILogistic>()
const tax1 = ref<ILogistic>()
const tax1CNY = ref<number>(0)
const tax2 = ref<ILogistic>()
const tax2value = ref<number>(0)
const priceOnChinaBorderCNY = ref<number>(0)
const priceOnChinaBorderR = ref<number>(0)
const NDS = ref<number>(0)
const total = ref<number>(0)
const warrantyPrice = ref<number>(0)
const totalAndWarranty = ref<number>(0)

const getWarrantyPrice = (options: any) => {
    if (options) {
      switch (options.warranty_options.name) {
        case 'WR24': return total.value * 0.05;
        case 'WR36': return total.value * 0.07;
        default: return 0;
      }
    } else return 0;
  }

const loadData = async () => {
  const gear_type_id = props.red.gear.gear_size.gear_type.id
  const gear_size_id = props.red.gear.gear_size.gear_box_list_size_id

  adapter.value = await useFetch(`/data/OutputAdapters/${props.red.flange_adapter.id}`, 'reductors')
  adapterPrice.value = await useFetch(`/data/PriceByName/${adapter.value.data[0].item_name}`, 'reductors')
  mass.value = await useFetch(`/data/RedGearMass?gear_type_id=${gear_type_id}&gearbox_size_id=${gear_size_id}&mount_type_id=${props.red.mount_type.id}`, 'reductors')
  deliveryToChinaLogistics.value = await useFetch(`/data/DeliveryToChinaLogistics`, 'reductors')
  deliveryToChinaBorders.value = await useFetch(`/data/DeliveryToChinaBorders`, 'reductors')
  deliveryRussias.value = await useFetch(`/data/DeliveryRussias`, 'reductors')
  taxes1.value = await useFetch(`/data/Taxes1s`, 'reductors')
  taxes2.value = await useFetch(`/data/Taxes2s`, 'reductors')
  options.value = JSON.parse(props.red.options)


  total1.value = (Number(props.red.gear_price) + Number(adapterPrice.value.data[0].price) + Number(gearOptionsPrice.value) + Number(options.value.oil_options.price));
  totalMass.value = (Number(mass?.value?.data[0]?.mass || 0 ) + Number(props.red.flange_adapter.mass));
  deliveryToChinaLogistic.value = findDeliveryValue(deliveryToChinaLogistics.value.data, totalMass.value); // стоимость доставки до логистимческого центра в Китае
  deliveryToChinaBorder.value = findDeliveryValue(deliveryToChinaBorders.value.data, totalMass.value);// стоимость доставки до границы КИтая
  tax1.value = findDeliveryValue(taxes1.value.data, total1.value * redDiscount );
  tax1CNY.value = tax1.value.value / exchangeRate;
  tax2.value  = taxes2.value.data.find((item) => item.name == props.red.gear.gear_size.gear_type.name )! // Не работает для К
  priceOnChinaBorderCNY.value = (Number(deliveryToChinaLogistic.value.value) + Number(deliveryToChinaBorder.value.value)) * Number(totalMass.value) + Number(total1.value) * redDiscount * 1.01;

  tax2value.value = priceOnChinaBorderCNY.value * Number(tax2.value.value) * 0.01;
  priceOnChinaBorderR.value = priceOnChinaBorderCNY.value * exchangeRate;
  NDS.value = (priceOnChinaBorderCNY.value + tax2value.value)*0.2;
  deliveryRussia.value = findDeliveryValue(deliveryRussias.value.data, totalMass.value);
  total.value = Number(priceOnChinaBorderCNY.value)
              + Number(tax1.value.value)
              + Number(tax2value.value)
              + Number(NDS.value)
              + Number(deliveryRussia.value.value) * Number(totalMass.value)
              + Number((options?.value?.color_options?.price || 0) / exchangeRate)
              + Number(options.value.oil_options.price / exchangeRate);

  warrantyPrice.value = getWarrantyPrice(options.value);
  totalAndWarranty.value = total.value + warrantyPrice.value;

  loading.value = false;
}

const displayDiscount = (discount: number) => {
  return discount * 100;
}

watch(totalAndWarranty, () => {
  model.value = totalAndWarranty.value
})

onBeforeMount(async () => {
  await loadData()
  gearOptionsPrice.value = options.value.gear_options.reduce((sum: number, item: any) => sum + Number(item.price), 0);
})
</script>

<template>
  <!-- Показываем расчёт только если это сотрудник -->
  <template v-if="!loading && user.isStaff()">
    <h1>0. Обменный курс</h1>
    <Tag value="Рублей за юань" severity="info"/> {{ props.red.rate_rub_cny }}
    <h1>1. Расчет входящей стоимости</h1>
    <table>
      <thead>
        <tr>
        <th>Наименование</th>
        <th>Цена L1</th>
        <th>Скидка</th>
        <th>Цена L2 со скидкой</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Редуктор</td>
          <td><DisplayPrice
                      :price="props.red.gear_price"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
          <td>{{ displayDiscount(redDiscount) }} %</td>
          <td><DisplayPrice
                      :price="(props.red.gear_price)*redDiscount"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
        </tr>

        <tr>
          <td>Переходный фланец</td>
          <td><DisplayPrice
                      :price="adapterPrice.data[0].price"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
          <td>{{ displayDiscount(redDiscount) }} %</td>
          <td><DisplayPrice
                      :price="adapterPrice.data[0].price * redDiscount"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
        </tr>

        <tr>
          <td>Опции редуктора</td>
          <td><DisplayPrice
                      :price="gearOptionsPrice"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
          <td>{{ displayDiscount(redDiscount) }} %</td>
          <td><DisplayPrice
                      :price="gearOptionsPrice * redDiscount"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
        </tr>

        <tr>
          <td>Опции масла</td>
          <td><DisplayPrice
                      :price="options.oil_options.price"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
          <td>{{ displayDiscount(redDiscount) }} %</td>
          <td><DisplayPrice
                      :price="options.oil_options.price * redDiscount"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td>Итого</td>
          <td><DisplayPrice
                      :price="total1"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
          <td></td>
          <td><DisplayPrice
                      :price="total1 * redDiscount"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></td>
        </tr>
      </tfoot>
    </table>

    <h1>2. Расчет суммарной массы</h1>
    <table>
      <thead>
        <tr>
        <th>Наименование</th>
        <th>Масса, кг</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Редуктор</td>
          <td>{{ mass?.data?.[0]?.mass ? mass?.data?.[0]?.mass : 'Не определено' }}</td>
        </tr>

        <tr>
          <td>Адаптер</td>
          <td>{{ props.red.flange_adapter.mass }}</td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td>Итого</td>
          <td>{{ totalMass }}</td>
        </tr>
      </tfoot>

    </table>

    <div class="grid">
      <div class="col">
        <h1>3. Расчет доставки (склад поставщика - консолидационный склад)</h1>
        <div class="bg-primary"><DisplayPrice
                      :price="deliveryToChinaLogistic.value * totalMass"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></div>
        <DataTable :value="deliveryToChinaLogistics.data" tableStyle="width: 20rem">
          <Column field="name" header="Масса">
            <template #body="{ data }">
              <div v-if="data.name == deliveryToChinaLogistic!.name!" class="font-bold text-primary">
                {{ data.name }}
              </div>
              <div v-else>
                {{ data.name }}
              </div>
            </template>
          </Column>
          <Column field="value" header="Цена">
            <template #body="{ data }">
              <div v-if="data.name == deliveryToChinaLogistic!.name" class="font-bold text-primary">
                {{ data.value }}
              </div>
              <div v-else>
                {{ data.value }}
              </div>
            </template>
          </Column>
       </DataTable>
      </div>

      <div class="col">
        <h1>4. Расчет доставки ( консолидационный склад - граница)</h1>
        <div class="bg-primary"><DisplayPrice
                      :price="deliveryToChinaBorder.value * totalMass"
                      :discount="0"
                      currency-symbol="&#165;"
                      size="S"
                    /></div>

        <DataTable :value="deliveryToChinaBorders.data" tableStyle="width: 20rem">
          <Column field="name" header="Масса">
            <template #body="{ data }">
              <div v-if="data.name == deliveryToChinaBorder!.name" class="font-bold text-primary">
                {{ data.name }}
              </div>
              <div v-else>
                {{ data.name }}
              </div>
            </template>
          </Column>
          <Column field="value" header="Цена">
            <template #body="{ data }">
              <div v-if="data.name == deliveryToChinaBorder!.name" class="font-bold text-primary">
                {{ data.value }}
              </div>
              <div v-else>
                {{ data.value }}
              </div>
            </template>
          </Column>
       </DataTable>
      </div>
    </div>

    <h1>5. Расчет цены на границе Китая</h1>
    <div class="bg-primary">
      <DisplayPrice :price="priceOnChinaBorderCNY" :discount="0" currency-symbol="&#165;" size="S" />
    </div>
    <div class="bg-primary">
      <DisplayPrice :price="priceOnChinaBorderR" :discount="0" currency-symbol="&#8381;" size="S" />
    </div>

    <div class="grid">
      <div class="col">
        <h1>6. Таможенный сбор</h1>
        <div class="bg-primary">
          <DisplayPrice :price="tax1!.value" :discount="0" currency-symbol="&#8381;" size="S" />
        </div>
        <div class="bg-primary">
          <DisplayPrice :price="tax1CNY" :discount="0" currency-symbol="&#165;" size="S" />
        </div>
        <DataTable :value="taxes1.data" tableStyle="width: 20rem">
          <Column field="name" header="Цена">
            <template #body="{ data }">
              <div v-if="data.name == tax1!.name" class="font-bold text-primary">
                {{ data.name }} &#8381;
              </div>
              <div v-else>
                {{ data.name }} &#8381;
              </div>
            </template>
          </Column>
          <Column field="value" header="Таможенный сбор">
            <template #body="{ data }">
              <div v-if="data.name == tax1!.name" class="font-bold text-primary">
                {{ data.value }} &#8381;
              </div>
              <div v-else>
                {{ data.value }} &#8381;
              </div>
            </template>
          </Column>
       </DataTable>
      </div>

      <div class="col">
        <h1>7. Пошлина</h1>
        <div class="bg-primary">
          <DisplayPrice :price="tax2value" :discount="0" currency-symbol="&#165;" size="S" />
        </div>

        <!-- <p>tax2: {{ tax2 }}</p>
        <p>taxes2: {{ taxes2.data }}</p>>
        <p>{{ props.red.gear.gear_size.gear_type.name }}</p> -->
        <DataTable :value="taxes2.data" tableStyle="width: 20rem">
          <Column field="name" header="Тип редуктора">
            <template #body="{ data }">
              <div v-if="data.name == tax2!.name" class="font-bold text-primary">
                {{ data.name }}
              </div>
              <div v-else>
                {{ data.name }}
              </div>
            </template>
          </Column>
          <Column field="value" header="Пошлина">
            <template #body="{ data }">
              <div v-if="data.name == tax2!.name" class="font-bold text-primary">
                {{ data.value }} %
              </div>
              <div v-else>
                {{ data.value }} %
              </div>
            </template>
          </Column>
       </DataTable>
       <h1>8. НДС</h1>
       <div class="bg-primary">
          <DisplayPrice :price="NDS" :discount="0" currency-symbol="&#165;" size="S" />
        </div>
      </div>
    </div>


    <h1>9. Расчет доставки по России</h1>
    <div class="bg-primary">
      <DisplayPrice :price="deliveryRussia.value * totalMass" :discount="0" currency-symbol="&#165;" size="S" />
    </div>

    <DataTable :value="deliveryRussias.data" tableStyle="width: 20rem">
      <Column field="name" header="Масса">
        <template #body="{ data }">
          <div v-if="data.name == deliveryRussia!.name" class="font-bold text-primary">
            {{ data.name }}
          </div>
          <div v-else>
            {{ data.name }}
          </div>
        </template>
      </Column>
      <Column field="value" header="Цена">
        <template #body="{ data }">
          <div v-if="data.name == deliveryRussia!.name" class="font-bold text-primary">
            {{ data.value }}
          </div>
          <div v-else>
            {{ data.value }}
          </div>
        </template>
      </Column>
    </DataTable>

    <h1>10. Доп опции (производимые на складе)</h1>
    <div class="mt-5" style="width: 100%">
      <Tag value="Покарска" severity="info" />
      {{ options?.color_options?.description }},
      <DisplayPrice
        :price="(options?.color_options?.price || 0)/ exchangeRate"
        :discount="0"
        currency-symbol="&#165;"
        size="S"
      />
    </div>

    <div class="mt-5" style="width: 100%">
      <Tag value="Масло" severity="info" />
      {{ options.oil_options.description }},
      <DisplayPrice
        :price="options.oil_options.price / exchangeRate"
        :discount="0"
        currency-symbol="&#165;"
        size="S"
      />
    </div>


    <h1>11. Итого</h1>
    <div class="bg-primary">
      <DisplayPrice :price="total" :discount="0" currency-symbol="&#165;" size="S" />
    </div>
    <Divider/>


    <div class="mt-5" style="width: 100%">
      <Tag value="Гарантия" severity="secondary" />
      {{ options.warranty_options.description }},
      <DisplayPrice
        :price="warrantyPrice"
        :discount="0"
        currency-symbol="&#165;"
        size="S"
      />
    </div>

    <h1>12. Итоговая себестоимость c гарантией</h1>
    <div class="bg-primary">
      <DisplayPrice :price="(totalAndWarranty)"  :discount="0" currency-symbol="&#165;" size="S" />
    </div>

  </template>
</template>

<style scoped>
table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

thead,
tfoot {
  background-color: rgb(228 240 245);
}

th,
td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
}

td:last-of-type {
  text-align: center;
}

tbody > tr:ntd-of-type(even) {
  background-color: rgb(237 238 242);
}

tfoot td {
  text-align: right;
}

tfoot td {
  font-weight: bold;
}

</style>
