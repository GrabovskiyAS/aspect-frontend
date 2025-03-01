import type { ICSVRow } from '@/api/Parsing/interfaces'
import type { IItem } from '@/Interfaces/invertors'

// Ищет ид в Items по Артикулу в исходных данных
export function getItemId(items: IItem[], csv_id: string): IItem | null {
  const item = items.find((item: IItem) => Number(csv_id) == Number(item.name))
  if (item) return item
  else return null
}

// Устанавливает ID и action в таблице данных для разбора
export function setID(items: IItem[], CSVData: ICSVRow[], columnIdIndex: number) {
  const result: ICSVRow[] = []
  CSVData.forEach((item: ICSVRow, index: number) => {
    result.push(item)
    const itemReturn: IItem | null = getItemId(items, item.data[columnIdIndex])
    if (itemReturn && itemReturn.id) {
      result[index].item_name = itemReturn.name
      result[index].item_id = itemReturn.id
      result[index].waiting_period_id = itemReturn.waiting_period_id
      result[index].type_id = itemReturn.type_id
      result[index].action = 'UPDATE'
    } else {
      result[index].action = 'IGNORE'
    }
  })
  return result
}

// Переключатель действий
export function getSeverity(action: string) {
  switch (action) {
    case 'UPDATE':
      return 'info'
    case 'INSERT':
      return 'success'
    default:
      return 'danger'
  }
}
