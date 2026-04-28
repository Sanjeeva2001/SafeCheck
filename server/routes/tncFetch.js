import express from 'express'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

const router = express.Router()

/**
 * POST /api/fetch-tnc
 * Fetches Terms and Conditions content from a provided URL
 * 
 * Request: { url: string }
 * Response: { success: boolean, content: string, error?: string }
 */
router.post('/fetch-tnc', async (req, res) => {
  try {
    const { url } = req.body

    // Validation: Check if URL is provided
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input: URL is required',
      })
    }

    // Validation: Ensure URL has a protocol
    let urlToFetch = url.trim()
    if (!urlToFetch.startsWith('http://') && !urlToFetch.startsWith('https://')) {
      urlToFetch = `https://${urlToFetch}`
    }

    // Validation: Parse and validate URL format
    let parsedUrl
    try {
      parsedUrl = new URL(urlToFetch)
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format. Please provide a valid web address.',
      })
    }

    // Security: Only allow http/https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        error: 'Only HTTP and HTTPS URLs are supported.',
      })
    }

    // Fetch the page with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    let response
    try {
      response = await fetch(urlToFetch, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SafeCheck-TNC-Simplifier/1.0 (Educational purposes)',
        },
        redirect: 'follow',
      })
    } finally {
      clearTimeout(timeoutId)
    }

    // Check response status
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: `Failed to fetch URL. Server returned status ${response.status}. Please check the URL and try again.`,
      })
    }

    // Parse content type
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return res.status(400).json({
        success: false,
        error: 'URL does not return HTML content. Please provide a link to a web page.',
      })
    }

    // Get response body
    const html = await response.text()

    if (!html || html.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'The page returned no content. Please check the URL.',
      })
    }

    // Parse HTML and extract text
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Remove script and style tags to avoid extracting code
    document.querySelectorAll('script, style, noscript').forEach(el => el.remove())

    // Extract text content
    let textContent = document.body.textContent || document.documentElement.textContent || ''

    // Clean up the text
    textContent = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')

    // Check if we got meaningful content
    if (textContent.length < 100) {
      return res.status(400).json({
        success: false,
        error: 'The page returned very little text content. Please ensure this is a valid Terms & Conditions page.',
      })
    }

    // Limit content size to prevent overwhelming the analysis (e.g., 50KB)
    const MAX_CONTENT_SIZE = 50000
    if (textContent.length > MAX_CONTENT_SIZE) {
      textContent = textContent.substring(0, MAX_CONTENT_SIZE) + '\n\n[Content truncated...]'
    }

    return res.json({
      success: true,
      content: textContent,
    })
  } catch (error) {
    console.error('[TNC Fetch] Error:', error.message)

    if (error.name === 'AbortError') {
      return res.status(408).json({
        success: false,
        error: 'Request timed out. The URL took too long to respond. Please try again.',
      })
    }

    return res.status(500).json({
      success: false,
      error: `An error occurred while fetching the URL: ${error.message}`,
    })
  }
})

export default router
