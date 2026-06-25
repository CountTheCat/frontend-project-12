import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('🔑 Токен в запросе:', token ? 'есть' : 'нет')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log('✅ Ответ:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.log('❌ Ошибка ответа:', error.response?.status, error.response?.config?.url)
    return Promise.reject(error)
  }
)

export default api