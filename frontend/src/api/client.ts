import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = 'JWT ' + token
  } else {
    delete api.defaults.headers.common.Authorization
  }
}
