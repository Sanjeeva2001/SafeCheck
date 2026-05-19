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

export async function simplifyTnC({ url, text, file, mode }) {
  try {
    const payload = mode === 'file'
      ? (() => {
          const formData = new FormData()
          formData.append('mode', mode)
          formData.append('file', file)
          return formData
        })()
      : { url, text, mode }

    const response = await api.post('/tnc-simplify', payload)
    return response.data
  } catch (err) {
    const retryAfterHeader = err?.response?.headers?.['retry-after']
    const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10)
    if (Number.isFinite(retryAfterSeconds)) {
      err.retryAfterSeconds = retryAfterSeconds
    }
    throw err
  }
}
