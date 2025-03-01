import type { AxiosResponse } from 'axios'
import { AxiosInstanceInvertors } from './axiosInstance'

export async function updateData(url: string, formData: any): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceInvertors.put(url, formData)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function insertData(url: string, formData: any): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceInvertors.post(url, formData)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function deleteData(url: string): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceInvertors.delete(url, {})
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
