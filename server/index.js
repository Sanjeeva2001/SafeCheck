import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import urlCheckRouter from './routes/urlCheck.js'
import scamStatsRouter from './routes/scamStats.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.join(__dirname, '../src/.env') })

const app = express()
const PORT = process.env.PORT || 3000
const allowedOrigins = [
  'http://localhost:5173',
  'https://safetychecker.app',
  'https://www.safetychecker.app',
].filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

// register more specific route before the generic /api route
app.use('/api/scam-stats', scamStatsRouter)
app.use('/api', urlCheckRouter)

// basic health check so you can ping /api/health to confirm server is up
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
