<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import OverlayBadge from 'primevue/overlaybadge'
import Tag from 'primevue/tag'
import { useUserStore } from '@/stores/user'
import { priceFormat, getDiscountPrice } from '@/api/priceFormat'

const width = new Map([
  ['L', 200],
  ['M', 180],
  ['S', 150],
])
const height = new Map([
  ['L', 40],
  ['M', 35],
  ['S', 30],
])
const text = new Map([
  ['L', 'xl'],
  ['M', 'lg'],
  ['S', 'base'],
])
const m = new Map([
  ['L', 2],
  ['M', 2],
  ['S', 1],
])

const innerSize = ref<string>('L')

const props = defineProps([
  'price',
  'discount',
  'currencyId',
  'currencySymbol',
  'notDisplay0',
  'size',
])
const user = useUserStore()

onBeforeMount(() => {
  if (props.size) innerSize.value = props.size
})
</script>

<template>
  <span v-if="props.notDisplay0"><Tag value="По запросу" severity="danger" /></span>
  <span v-else>
    <div v-if="user.isUser() && props.discount > 0" :style="`width: ${width.get(innerSize)}px`">
      <OverlayBadge :value="`- ${props.discount} %`" severity="warn" class="mr-4">
        <div
          :class="`surface-700 text-white font-bold text-${text.get(innerSize)} line-through border-round m-${m.get(innerSize)} flex align-items-center justify-content-center`"
          :style="`min-width: 80px; min-height: ${height.get(innerSize)}px`"
        >
          {{ priceFormat(props.price) }} {{ currencySymbol }}
        </div>
      </OverlayBadge>
      <div
        :class="`bg-primary font-bold text-${text.get(innerSize)} border-round m-${m.get(innerSize)} flex align-items-center justify-content-center mr-5`"
        :style="`min-width: 80px; min-height: ${height.get(innerSize)}px`"
      >
        {{ priceFormat(getDiscountPrice(props.price, props.discount)) }} {{ currencySymbol }}
      </div>
    </div>
    <div v-else :style="`width: ${width.get(innerSize)}px`">
      <div
        :class="`font-bold text-${text.get(innerSize)} border-round m-${m.get(innerSize)} flex align-items-center justify-content-center`"
      >
        {{ priceFormat(props.price) }} {{ currencySymbol }}
      </div>
    </div>
  </span>
</template>
