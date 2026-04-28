import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') })
}

for (const [envName, label] of [
  ['URLHAUS_API_KEY', 'URLhaus'],
  ['OTX_API_KEY', 'OTX'],
  ['GOOGLE_SAFE_BROWSING_API_KEY', 'Google Safe Browsing'],
  ['VIRUSTOTAL_API_KEY', 'VirusTotal'],
]) {
  if (!process.env[envName]) {
    console.warn(`[SafeCheck] ${label} API key is missing. Related checks will fall back to safe defaults.`)
  }
}

const { default: urlCheckRouter } = await import('./routes/urlCheck.js')
const { default: scamStatsRouter } = await import('./routes/scamStats.js')
const { default: tncFetchRouter } = await import('./routes/tncFetch.js')

const app = express()
const PORT = process.env.PORT || 3000
const allowedOrigins = [
  'http://localhost:5173',
  'https://safetychecker.app',
  'https://www.safetychecker.app',
].filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())


app.post('/api/auth', (req, res) => {
  const { password } = req.body

  if (password === process.env.APP_PASSWORD) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false })
  }
})

app.use('/api/scam-stats', scamStatsRouter)
app.use('/api', urlCheckRouter)
app.use('/api', tncFetchRouter)


app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
