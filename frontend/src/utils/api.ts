import axios from 'axios'

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000'

let _getAccessToken: (() => Promise<string>) | null = null

export function initApiAuth(getToken: () => Promise<string>) {
  _getAccessToken = getToken
}

const api = axios.create({
  baseURL: `${DJANGO_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  if (_getAccessToken) {
    const token = await _getAccessToken()
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
