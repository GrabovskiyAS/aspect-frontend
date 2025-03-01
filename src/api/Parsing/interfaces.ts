export interface ICSVRow {
  data: string[]
  item_name: string
  item_id: number
  waiting_period_id: number
  type_id: number

  action: string
  uploaded: boolean
  price_uploaded: number
}

export interface IParseResult {
  data: any // array of parsed data
  errors: any // array of errors
  meta: any // object with extra info
}
