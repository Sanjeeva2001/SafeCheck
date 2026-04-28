import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api'

const api = axios.create({
  baseURL: apiBaseUrl,
})

export { api }

export async function checkUrl(url) {
  const response = await api.post('/check-url', { url })
  return response.data
}

export async function getOnlineSeniorStats() {
  const response = await api.get('/scam-stats/online-seniors')
  return response.data
}

/**
 * Fetch Terms & Conditions content from a URL
 * @param {string} url - The URL to fetch T&C content from
 * @returns {Promise<{success: boolean, content?: string, error?: string}>}
 */
export async function fetchTncFromUrl(url) {
  const response = await api.post('/fetch-tnc', { url })
  return response.data
}
