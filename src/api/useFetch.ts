import { ref } from 'vue'
import { AxiosInstanceInvertors, AxiosInstanceAuth, AxiosInstanceReductors } from './axiosInstance'

interface IFetch {
  data: []
  error: []
  loading: boolean
}

const AxiosInstance = async (source: string, url: string) => {
  switch (source) {
    case 'auth':
      return await AxiosInstanceAuth.get(url)
    case 'invertors':
      return await AxiosInstanceInvertors.get(url)
    case 'reductors':
      return await AxiosInstanceReductors.get(url)
    default:
      return await AxiosInstanceInvertors.get(url)
  }
}

export async function useFetch<T extends IFetch>(url: string, source: string = ''): Promise<T> {
  const res: any = ref<IFetch>({ data: [], error: [], loading: true })

  try {
    const result = await AxiosInstance(source, url)

    if (!Array.isArray(result.data) && Array.isArray(res.value.data)) {
      // Если тип принимающего элемента массив, а пришёл не массив
      res.value.data.push(result.data)
    } else {
      res.value.data = result.data
    }
  } catch (e: any) {
    res.value.error = e
  } finally {
    res.value.loading = false
  }
  return { data: res.value.data, loading: res.value.loading, error: res.value.error } as T
}
