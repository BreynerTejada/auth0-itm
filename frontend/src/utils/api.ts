import axios from 'axios'

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${DJANGO_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getCsrfToken = (): string => {
  const match = document.cookie.split('; ').find((row) => row.startsWith('csrftoken='))
  return match ? match.split('=')[1] : ''
}

api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = `${DJANGO_URL}/auth0/login/`
    }
    return Promise.reject(error)
  }
)

export default api
