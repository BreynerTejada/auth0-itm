import api from './api'

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL || 'http://localhost:8000'

export const checkAuth = async () => {
  try {
    const response = await fetch(`${DJANGO_URL}/auth0/user-info/`, {
      credentials: 'include',
    })
    if (response.ok) {
      return await response.json()
    }
    return { authenticated: false }
  } catch {
    return { authenticated: false }
  }
}

export const getUserProfile = async () => {
  const response = await api.get('/user/profile/')
  return response.data
}

export const getUserMetadata = async () => {
  const response = await api.get('/user/metadata/')
  return response.data
}

export const updateUserMetadata = async (metadata: Record<string, string>) => {
  const response = await api.post('/user/metadata/update/', metadata)
  return response.data
}
