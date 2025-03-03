import axios from 'axios'
import { useBaseUrl } from '@/stores/baseUrl'
import { useUserStore } from '@/stores/user'
import type { AxiosRequestConfig } from 'axios'

const user = useUserStore()
const baseUrl = useBaseUrl()

const getBaseUrl = (source: string = '') => {
  switch (source) {
    case 'auth':
      return baseUrl.baseUrlInvertors
    case 'invertors':
      return baseUrl.baseUrlInvertors
    case 'reductors':
      return baseUrl.baseUrlReductors
    default:
      return baseUrl.baseUrlInvertors
  }
}

export const getHeader = (source: string = '') => {
  const header: AxiosRequestConfig = {
    baseURL: getBaseUrl(source),
    timeout: 100000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  if (user.isUser()) {
    header.headers!['Authorization'] = 'Token ' + user.getToken()
  }
  console.log('header', header)

  return header
}

const getAuthHeader = () => {
  console.log('qqq1')
  return `Token ${user.getToken()}`
}

const AxiosInstanceReductors = axios.create(getHeader('reductors'))
const AxiosInstanceAuth = axios.create(getHeader('auth'))
const AxiosInstanceInvertors = axios.create(getHeader('invertors'))

const debounceRefreshTokens = _debounce(() => {
  return user.refreshTokens()
}, 100)

/**
 * https://stackoverflow.com/questions/35228052/debounce-function-implemented-with-promises
 * @param inner
 * @param ms
 * @returns {function(...[*]): Promise<unknown>}
 * @private
 */
function _debounce(inner: any, ms = 0) {
  let timer: any = null
  let resolves: any = []

  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      const result = inner()
      resolves.forEach((r: any) => r(result))
      resolves = []
    }, ms)

    return new Promise((resolve) => resolves.push(resolve))
  }
}

/**
 * Перехватичк запроса axios
 * Если пользователь не авторизован, запрос отпарвляется без изменений
 * Если пользователь авторизован с неистёкшим Access Token, то запрос отправляется как есть
 * Если пользователь авторизован, но с истёкшим Access Token, то обновляем Access Token, тобавляем его в запрос
 */
AxiosInstanceAuth.interceptors.request.use(
  (request) => {
    if (user.isUser()) {
      request.headers.authorization = getAuthHeader()

      // if access token expired and refreshToken is exist >> go to API and get new access token
      if (user.isAccessTokenExpired() && user.hasRefreshToken()) {
        return debounceRefreshTokens()
          .then(() => {
            request.headers.authorization = getAuthHeader()
            return request
          })
          .catch((error) => Promise.reject(error))
      } else {
        // console.log('Пользователь авторизован', request)
        return request // Если токен не истёк
      }
    } else {
      // console.log('Пользователь не авторизован', request)
      return request // Если пользователь не авторизован
    }
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

AxiosInstanceInvertors.interceptors.request.use(
  (request) => {
    if (user.isUser()) {
      request.headers.authorization = getAuthHeader()

      // if access token expired and refreshToken is exist >> go to API and get new access token
      if (user.isAccessTokenExpired() && user.hasRefreshToken()) {
        return debounceRefreshTokens()
          .then(() => {
            request.headers.authorization = getAuthHeader()
            return request
          })
          .catch((error) => Promise.reject(error))
      } else {
        // console.log('Пользователь авторизован', request)
        return request // Если токен не истёк
      }
    } else {
      // console.log('Пользователь не авторизован', request)
      return request // Если пользователь не авторизован
    }
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

AxiosInstanceReductors.interceptors.request.use(
  (request) => {
    if (user.isUser()) {
      request.headers.authorization = getAuthHeader()

      // if access token expired and refreshToken is exist >> go to API and get new access token
      if (user.isAccessTokenExpired() && user.hasRefreshToken()) {
        return debounceRefreshTokens()
          .then(() => {
            request.headers.authorization = getAuthHeader()
            return request
          })
          .catch((error) => Promise.reject(error))
      } else {
        // console.log('Пользователь авторизован', request)
        return request // Если токен не истёк
      }
    } else {
      // console.log('Пользователь не авторизован', request)
      return request // Если пользователь не авторизован
    }
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

export { AxiosInstanceAuth, AxiosInstanceInvertors, AxiosInstanceReductors }
