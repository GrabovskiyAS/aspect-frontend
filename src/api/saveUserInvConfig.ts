import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useWebSocketStore } from '@/stores/ws'
import type {
  IInvertor,
  IInvOption,
  IInvOptionDiscount,
  IInvSerieDiscount,
  IUserInvConfig,
} from '@/Interfaces/invertors'
import { getDiscountOption, getDiscountSerie } from './utils'
import { saveLog } from './log'
import { insertData } from './dataActionsInvertors'

const user = useUserStore()
const ws = useWebSocketStore()

export async function addUserInvConfig(
  invertor: IInvertor,
  selectedOptions: IInvOption[],
  serieDiscounts: IInvSerieDiscount[],
  optionDiscounts: IInvOptionDiscount[],
): Promise<number> {
  const selectedOptionsStr = ref<string[]>([])
  const selectedOptionsPricesStr = ref<string[]>([])
  const selectedOptionsDiscountStr = ref<string[]>([])

  if (selectedOptions) {
    selectedOptions.map((item) => {
      selectedOptionsStr.value.push(item.id!.toString())
      if (item.price) selectedOptionsPricesStr.value.push(item.price.toString())
      selectedOptionsDiscountStr.value.push(getDiscountOption(item.option_id, optionDiscounts))
    })
  }
  const payload: IUserInvConfig = {
    user_id: user.getUser().userId.value,
    invertor_id: invertor.id!,
    invertor_price: invertor.price!,
    invertor_discount: getDiscountSerie(invertor.serie_id, serieDiscounts),
    options: JSON.stringify(selectedOptionsStr.value.map((item) => item)),
    options_prices: JSON.stringify(selectedOptionsPricesStr.value.map((item) => item)),
    options_discounts: JSON.stringify(selectedOptionsDiscountStr.value.map((item) => item)),
    info: '',
    staff_opened: false,
  }

  return new Promise((resolve, reject) => {
    insertData('/data/UserInvConfg', payload)
      .then((response) => {
        console.log(response.data)
        saveLog(4, String(response.data.id))
        ws.sendMessage({
          username: user.getUser().userId.value.toString(),
          message: response.data.id.toString(),
          timestamp: 1,
        }) // отправка сообщения о новой конфигурации
        resolve(response.data.id)
      })
      .catch((error) => {
        console.log(error)
        reject(0)
      })
  })
}
