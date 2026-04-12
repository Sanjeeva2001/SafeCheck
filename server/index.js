import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import urlCheckRouter from './routes/urlCheck.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// .env is sitting in src/ so we point dotenv there
dotenv.config({ path: path.join(__dirname, '../src/.env') })

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// all url-check requests go here
app.use('/api', urlCheckRouter)

// basic health check so you can ping /api/health to confirm server is up
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
