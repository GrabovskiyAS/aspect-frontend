import { ref } from 'vue'
import type { ICSVRow } from '@/api/Parsing/interfaces'
import { updateData, insertData } from '../dataActionsInvertors'
import type { IPrice, IItem } from '@/Interfaces/invertors'

export async function upload(
  CSVDataInput: ICSVRow[],
  columnQuantityIndex: number,
  columnPriceIndex: number,
): Promise<ICSVRow[] | null> {
  let itemData: IItem
  let itemPrice: string

  const CSVData = ref<ICSVRow[]>([])

  CSVData.value = CSVDataInput

  try {
    CSVData.value.forEach((item, index) => {
      switch (item.action) {
        case 'UPDATE':
          // --- формируем данные для UPDATE таблицы Items для обновления колонки quantity
          itemData = {
            quantity: Number(item.data[columnQuantityIndex]), // Количество из источника данных
            name: item.item_name,
            type_id: item.type_id,
            waiting_period_id: item.waiting_period_id,
          }

          updateData(`/data/Items/${item.item_id}`, itemData)
            .then(() => {
              CSVData.value[index].uploaded = true

              itemPrice = item.data[columnPriceIndex].replace(/[^+\d]/g, '')

              if (Number(itemPrice)) {
                // Если цена отлична от 0
                const formPriceData: IPrice = {
                  item_id: item.item_id,
                  price: Number(itemPrice),
                  currency_id: 1, // Рубль
                }

                insertData('/data/Prices/', formPriceData).then((response) => {
                  console.log(response)
                  CSVData.value[index].price_uploaded = 2
                }) // Отмечаем, что строка загружена
              }
            })
            .catch((error) => {
              console.log(error)
            })

          return CSVData.value

        case 'INSERT':
          break
        default:
          return null
      } // switch action
    }) // map

    return CSVData.value
  } catch {
    return null
  }
}
