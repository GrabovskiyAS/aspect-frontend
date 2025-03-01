import type { AxiosResponse } from 'axios'
import { AxiosInstanceReductors } from './axiosInstance'

export async function updateDataReductors(url: string, formData: any): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceReductors.put(url, formData)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function patchDataReductors(url: string, formData: any): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceReductors.patch(url, formData)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function insertDataReductors(url: string, formData: any): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceReductors.post(url, formData)
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export async function deleteDataReductors(url: string): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    AxiosInstanceReductors.delete(url, {})
      .then(function (response) {
        resolve(response)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}
