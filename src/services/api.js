import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export async function checkUrl(url) {
  const response = await api.post('/check-url', { url })
  return response.data
}