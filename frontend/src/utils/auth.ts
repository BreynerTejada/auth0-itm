import api from './api'

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
