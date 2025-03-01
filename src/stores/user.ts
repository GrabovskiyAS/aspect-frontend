import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'
import type { ILog } from '@/Interfaces/invertors'
import { useBaseUrl } from './baseUrl'
import { useLoginStore } from '@/stores/login'
import axios from 'axios'
// import { jwtDecode } from 'jwt-decode'
import moment from 'moment'

export const useUserStore = defineStore('user', () => {
  const userId = ref<number>(0)
  const userName = ref<string>('')
  const userIsStaff = ref<boolean>(false)
  const userIsSuperadmin = ref<boolean>(false)
  const token = ref<string>('')
  const refreshToken = ref<string>('')
  const errorMsg = ref<string>('')
  const tokenExpireDate = ref<string>('')

  const baseUrl = useBaseUrl()
  const login = useLoginStore()
  const { cookies } = useCookies()

  // -----------------------------------------------------------------  загружает пользователя по установленному userId  ----------------------------------------------
  async function loadUser() {
    if (userId.value)
      await axios
        .get(`${baseUrl.baseUrlInvertors}/data/users/${String(userId.value)}`, {}) // django `${baseUrl.baseUrlInvertors}/Users/${String(userId.value)}`
        .then((response) => {
          userId.value = response.data.id
          userName.value = response.data.first_name
          const roles = response.data.roles
          if (roles.includes('STAFF')) userIsStaff.value = true
          if (roles.includes('ADMIN')) userIsSuperadmin.value = true
        })
  }
  // -----------------------------------------------------------------  проверяет был ли пользователь авторизован  ----------------------------------------------
  async function checkIsAuth(): Promise<number> {
    const token_exists = () => {
      const c = cookies.isKey('token')
      let t: string = ''
      if (c) {
        t = cookies.get('token')
      }
      if (c && t != 'null') return true
      else return false
    }
    return new Promise((resolve, reject) => {
      if (!token_exists()) {
        reject(0) // Если токена нет в куки, сразу возвращаем отказ
      } else {
        if (!getToken()) {
          // Если в приложении нет Access Token
          setRefreshToken(cookies.get('token')) // берём рефреш токен из куки
          loadUser()
          refreshTokens() // обновляем access token и refresh token на бэкенде
            .then(() => {
              loadUser() // Загружаем данные по пользователю
              resolve(userId.value) // возращаем промис
            }) // Обновляем Access Token
        } else {
          resolve(userId.value)
        }
      }
    })
  }

  // -----------------------------------------------------------------  аутентификация ----------------------------------------------
  const extractValuesFromResponse = (response: any) => {
    setToken(response.data.accessToken)
    setRefreshToken(response.data.refreshToken)
    userId.value = response.data.user_id
    tokenExpireDate.value = response.data.expire_date
  }

  // -----------------------------------------------------------------  аутентификация ----------------------------------------------
  async function auth(username: string, password: string) {
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'

    const payload = {
      username: username,
      password: password,
    }

    const url = `${baseUrl.baseUrlInvertors}/auth/login`

    await axios
      .post(url, payload)
      .then((response) => {
        extractValuesFromResponse(response)
        login.visible = false // закрываем модал
        loadUser() // загружаем пользователя по установленному userId
        saveLog(1, '') // записываем, что авторизовались
      })
      .catch((error) => {
        errorMsg.value = 'Неверный логин или пароль'
        console.log('error', error)
        // console.debug(error);
        // console.dir(error);
      })
  }
  // ----------------------------------------------------------------- Запись в журнал действия пользователя ----------------------------------------------
  async function saveLog(action: number, params: string) {
    if (isUser()) {
      const date = moment().format('YYYY-MM-DD HH:mm:ss')

      const logData: ILog = { date: date, action_id: action, user_id: userId.value, params: params }
      const config = { headers: { 'content-type': 'application/json' } }
      const url = `${baseUrl.baseUrlInvertors}/data/log` // `${baseUrl.baseUrlInvertors}/logs/Logs/`
      axios
        .post(url, logData, config)
        .then(() => {
          /*console.log(response);*/
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
  // ----------------------------------------------------------------- Выход ----------------------------------------------
  async function logout() {
    saveLog(2, '')
    // await axios.post(`${baseUrl.baseUrlInvertors}/user/logout/${userId.value}`, {})
    userId.value = 0
    userName.value = ''
    userIsStaff.value = false
    userIsSuperadmin.value = false
    token.value = ''
    refreshToken.value = ''
    cookies.remove('token')
  }

  function getUser() {
    return { userId, userName, userIsStaff, userIsSuperadmin }
  }
  function isUser() {
    return userId.value ? true : false
  }
  function isStaff() {
    return userIsStaff.value
  }
  function isSuperadmin() {
    return userIsSuperadmin.value
  }
  function getName() {
    return userName.value
  }

  function getToken(): string {
    return token.value
  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function getRefreshToken(): string {
    return refreshToken.value
  }
  function setRefreshToken(newRefreshToken: string) {
    refreshToken.value = newRefreshToken
    cookies.set('token', newRefreshToken) // сохраняем в куки значение токена
  }

  function getAccessTokenExpDate(): number {
    return Number(tokenExpireDate.value)
  }

  function hasRefreshToken() {
    return Boolean(getRefreshToken())
  }

  function isAccessTokenExpired() {
    const accessTokenExpDate = getAccessTokenExpDate() - 10
    const nowTime = Math.floor(new Date().getTime() / 1000)
    return accessTokenExpDate <= nowTime
  }

  async function refreshTokens() {
    const header = {
      baseURL: baseUrl.baseUrlInvertors,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }

    try {
      await axios
        .post(
          `${baseUrl.baseUrlInvertors}/auth/refresh-tokens`,
          { refreshToken: getRefreshToken() },
          header,
        )
        .then((response) => {
          extractValuesFromResponse(response)
          return response
        })
        .catch((error) => {
          console.log('error:', error)
        })
    } catch (error) {
      // await axios.post(`${baseUrl.baseUrlInvertors}/user/logout/${userId.value}`, header)
      console.log(error)
      await logout()
      // throw new Error(error)
    }
  }

  return {
    errorMsg,
    userId,
    auth,
    logout,
    getUser,
    isUser,
    isStaff,
    isSuperadmin,
    loadUser,
    getName,
    checkIsAuth,
    getToken,
    getRefreshToken,
    setToken,
    setRefreshToken,
    getAccessTokenExpDate,
    hasRefreshToken,
    isAccessTokenExpired,
    refreshTokens,
  }
})
