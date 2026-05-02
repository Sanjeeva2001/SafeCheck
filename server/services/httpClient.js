import axios from 'axios'

// proxy: false stops axios from picking up HTTP_PROXY / HTTPS_PROXY / ALL_PROXY
// from the environment. Without this, a dead proxy in the environment blocks all outbound calls.
const httpClient = axios.create({ proxy: false })

export default httpClient
