import { useUserStore } from '@/stores/user'
import { AxiosInstanceInvertors } from './axiosInstance'
import type { ILog } from '@/Interfaces/invertors'
import moment from 'moment'

const user = useUserStore()

export async function saveLog(action: number, params: string) {
  if (user.isUser()) {
    const date = moment().format('YYYY-MM-DD HH:mm:ss')

    const logData: ILog = { date: date, user_id: user.userId, action_id: action, params: params }
    const config = { headers: { 'content-type': 'application/json' } }

    await AxiosInstanceInvertors.post('/data/log', logData, config).catch(function (error) {
      console.log(error)
    })
  }
}
