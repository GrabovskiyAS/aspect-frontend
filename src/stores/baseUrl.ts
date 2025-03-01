import { defineStore } from 'pinia'

export const useBaseUrl = defineStore('baseUrl', () => {
  const baseUrlAuth = import.meta.env.VITE_BACKEND_AUTH
  const baseUrlInvertors = import.meta.env.VITE_BACKEND_INVERTORS
  const baseUrlReductors = import.meta.env.VITE_BACKEND_REDUCTORS
  const s3url = import.meta.env.VITE_BACKEND_S3
  const s3Storage = import.meta.env.VITE_S3_STORAGE

  return { baseUrlAuth, baseUrlInvertors, baseUrlReductors, s3url, s3Storage }
})
