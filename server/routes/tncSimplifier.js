import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'
import OpenAI from 'openai'

const router = express.Router()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function scrapeUrl(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 15000,
    maxRedirects: 5,
  })

  const contentType = response.headers['content-type'] || ''
  if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
    throw new Error('The URL does not point to a readable web page.')
  }

  const $ = load(response.data)
  $('script, style, nav, header, footer, aside, iframe, noscript').remove()

  const selectors = ['main', 'article', '.content', '#content', '.terms', '#terms', '.legal', '.tos', '#tos', '.policy']
  for (const selector of selectors) {
    const text = $(selector).text().replace(/\s+/g, ' ').trim()
    if (text.split(/\s+/).length >= 100) return text
  }

  return $('body').text().replace(/\s+/g, ' ').trim()
}

function truncateToWords(text, maxWords = 10000) {
  const words = text.split(/\s+/)
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(' ')
}

async function analyzeWithDO(text) {
  const apiKey = process.env.DO_AGENT_ACCESS_KEY?.trim()
  const baseURL = process.env.OPENAI_BASE_URL?.trim()

  if (!apiKey) throw new Error('DO_AGENT_ACCESS_KEY is not set in .env')
  if (!baseURL) throw new Error('OPENAI_BASE_URL is not set in .env')

  const client = new OpenAI({ apiKey, baseURL })

  const prompt = `You are a JSON API. Respond with ONLY a valid JSON object. No markdown, no code fences, no text before or after. Start with { and end with }

Analyze these Terms and Conditions and return exactly this structure:
{
  "overallRisk": "low" or "medium" or "high",
  "summary": "2-3 plain English sentences about the main risks",
  "flaggedClauses": [
    {
      "category": "short label like Data collection or Arbitration",
      "severity": "danger" or "warn" or "pass",
      "clause": "the actual clause text",
      "consequence": "plain English explanation of what this means for the user",
      "realCase": { "name": "company name", "detail": "what happened" } or null
    }
  ]
}

Include 3 to 7 flaggedClauses. Focus on: data collection, third-party sharing, AI training data usage, cancellation traps, data retention, arbitration, liability waivers.

T&Cs text:
${text}`

  let lastError

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'n/a',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 4096,
      })

      const rawText = completion.choices[0]?.message?.content ?? ''
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Could not parse AI response. Please try again.')
      return JSON.parse(jsonMatch[0].trim())

    } catch (err) {
      lastError = err
      const status = err.status || err.response?.status
      if (status === 401) throw new Error('DigitalOcean authentication failed (401). Check DO_AGENT_ACCESS_KEY.')
      if (status !== 429 || attempt === 2) break
      await sleep(Math.min(15000, 1500 * 2 ** attempt))
    }
  }

  throw lastError || new Error('AI request failed.')
}

router.post('/tnc-simplify', async (req, res) => {
  const { url, text, mode } = req.body

  if (!url && !text) {
    return res.status(400).json({ error: 'Provide either a URL or text to analyse.' })
  }

  let tncText = text

  if (mode === 'url' || (url && !text)) {
    try {
      tncText = await scrapeUrl(url)
    } catch (err) {
      return res.status(422).json({ error: `Could not fetch the page: ${err.message}` })
    }
  }

  if (!tncText || tncText.split(/\s+/).length < 30) {
    return res.status(422).json({ error: 'Not enough text to analyse. Paste the T&C text directly.' })
  }

  tncText = truncateToWords(tncText)

  try {
    const result = await analyzeWithDO(tncText)
    res.json(result)
  } catch (err) {
    const status = err.status || err.response?.status
    if (status === 429) return res.status(429).json({ error: 'Rate limit reached. Wait a moment and retry.' })
    console.error('[TnC Simplifier]', err.message)
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' })
  }
})

export default router
