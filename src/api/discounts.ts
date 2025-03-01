import type {
  IInvSerie,
  IInvSerieDiscount,
  ISimpleDictionary,
  IInvOptionDiscount,
} from '@/Interfaces/invertors'
import { insertData, deleteData } from './dataActionsInvertors'

export async function createSeries(
  id: string,
  series: IInvSerie[],
  seriesDiscount: IInvSerieDiscount[],
) {
  // удаление имеющихся скидок на серии группы
  seriesDiscount.map((item: IInvSerieDiscount) => {
    deleteData(`/data/InvSerieDiscount/${item.id}`)
  })
  // создание новых скидок на серии
  for (const i in series) {
    const payload = {
      serie_id: series[i].id,
      group_id: Number(id),
      discount: 0,
    }
    await insertData('/data/InvSerieDiscount', payload)
  }
}

export async function createOptions(
  id: string,
  options: ISimpleDictionary[],
  optionsDiscount: IInvOptionDiscount[],
) {
  // удаление имеющихся скидок на опции группы
  optionsDiscount.map((item: IInvOptionDiscount) => {
    const url: string = `/data/InvOptionDiscount/${item.id}`
    deleteData(url)
  })

  // создание новых скидок на опции
  for (const i in options) {
    const payload = {
      option_id: options[i].id,
      group_id: Number(id),
      discount: 0,
    }
    await insertData('/data/InvOptionDiscount', payload)
  }
}

export const isPositiveInteger = (val: number) => {
  let str = String(val)

  str = str.trim()

  if (!str) {
    return false
  }

  str = str.replace(/^0+/, '') || '0'
  const n = Math.floor(Number(str))

  return n !== Infinity && String(n) === str && n >= 0
}

export const onCellEditComplete = (event: any) => {
  const { data, newValue, field } = event
  if (isPositiveInteger(newValue)) data[field] = newValue
  else event.preventDefault()
}
