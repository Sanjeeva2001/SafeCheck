import express from 'express'
import { checkGoogleSafeBrowsing } from '../services/safeBrowsing.js'
import { checkVirusTotal } from '../services/virusTotal.js'

const router = express.Router()

const SUSPICIOUS_KEYWORDS = [
  'free-prize', 'claim-now', 'verify-account', 'login-update',
  'secure-bank', 'paypa1', 'arnazon', 'g00gle', 'micros0ft',
]
const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.cf', '.ml', '.ga', '.click', '.top']

function normalizeUrl(rawUrl) {
  let url = rawUrl.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  return url
}

function inspectDomain(normalized) {
  let hostname
  try {
    hostname = new URL(normalized).hostname.toLowerCase()
  } catch {
    return null
  }

  return {
    hostname,
    normalized,
    hasSuspiciousKeyword: SUSPICIOUS_KEYWORDS.some(k => hostname.includes(k)),
    hasSuspiciousTld:     SUSPICIOUS_TLDS.some(t => hostname.endsWith(t)),
    hasExcessiveDashes:   (hostname.match(/-/g) || []).length >= 3,
    hasIpAddress:         /^\d+\.\d+\.\d+\.\d+$/.test(hostname),
    isHttp:               normalized.startsWith('http://'),
  }
}

function buildChecks(local, googleData, vtData) {
  return [
    {
      label: 'Google Safe Browsing',
      status: googleData.error ? 'warn' : googleData.isThreat ? 'danger' : 'pass',
      detail: googleData.error
        ? 'Could not reach Google Safe Browsing - skipped'
        : googleData.isThreat
        ? `Threat detected: ${googleData.threatType}`
        : 'No threats found in Google database',
    },
    {
      label: 'VirusTotal',
      status: vtData.error ? 'warn' : vtData.malicious > 2 ? 'danger' : vtData.malicious > 0 ? 'warn' : 'pass',
      detail: vtData.error
        ? 'Could not reach VirusTotal - skipped'
        : vtData.malicious > 2
        ? `${vtData.malicious} security vendors flagged this URL as dangerous`
        : vtData.malicious > 0
        ? `${vtData.malicious} vendor flagged this - likely a false positive, but worth noting`
        : `Clean across ${vtData.harmless} security vendors`,
    },
    {
      label: 'HTTPS / Encryption',
      status: local.isHttp ? 'warn' : 'pass',
      detail: local.isHttp
        ? 'Site does not use HTTPS - your data is not encrypted'
        : 'Connection is encrypted with HTTPS',
    },
    {
      label: 'Domain Structure',
      status: (local.hasExcessiveDashes || local.hasIpAddress || local.hasSuspiciousKeyword || local.hasSuspiciousTld) ? 'warn' : 'pass',
      detail: local.hasIpAddress        ? 'Uses a raw IP address - legitimate sites rarely do this'
            : local.hasSuspiciousKeyword ? 'Domain contains suspicious words'
            : local.hasSuspiciousTld     ? 'Uses a high-risk domain extension'
            : local.hasExcessiveDashes   ? 'Unusual number of hyphens in domain'
                                         : 'Domain structure looks normal',
    },
  ]
}

function buildScoreCategories(local, googleData, vtData) {
  return [
    {
      label: 'Google Safe Browsing',
      maxDeduction: 40,
      deduction: googleData.isThreat ? 40 : 0,
      passed: !googleData.isThreat,
      detail: googleData.error     ? 'Could not reach API'
            : googleData.isThreat  ? `Flagged as: ${googleData.threatType}`
                                   : 'No known threats found',
    },
    {
      label: 'VirusTotal Scan',
      maxDeduction: 30,
      deduction: vtData.malicious > 2 ? 30 : vtData.malicious > 0 ? 10 : 0,
      passed: vtData.malicious === 0,
      detail: vtData.error           ? 'Could not reach API'
            : vtData.malicious > 2   ? `${vtData.malicious} vendors flagged this URL`
            : vtData.malicious > 0   ? `${vtData.malicious} vendor flagged it (possible false positive)`
                                     : `Clean across ${vtData.harmless} security vendors`,
    },
    {
      label: 'HTTPS Encryption',
      maxDeduction: 10,
      deduction: local.isHttp ? 10 : 0,
      passed: !local.isHttp,
      detail: local.isHttp ? 'Site uses HTTP - connection is not encrypted' : 'Site uses HTTPS - connection is encrypted',
    },
    {
      label: 'Suspicious Keywords',
      maxDeduction: 20,
      deduction: local.hasSuspiciousKeyword ? 20 : 0,
      passed: !local.hasSuspiciousKeyword,
      detail: local.hasSuspiciousKeyword ? 'Domain contains known phishing keywords' : 'No suspicious keywords in domain',
    },
    {
      label: 'Domain Extension',
      maxDeduction: 15,
      deduction: local.hasSuspiciousTld ? 15 : 0,
      passed: !local.hasSuspiciousTld,
      detail: local.hasSuspiciousTld ? 'Uses a high-risk TLD (.xyz, .tk, etc.)' : 'Domain extension looks normal',
    },
    {
      label: 'IP Address Usage',
      maxDeduction: 15,
      deduction: local.hasIpAddress ? 15 : 0,
      passed: !local.hasIpAddress,
      detail: local.hasIpAddress ? 'URL points to a raw IP - legitimate sites rarely do this' : 'Uses a proper domain name',
    },
    {
      label: 'Domain Structure',
      maxDeduction: 10,
      deduction: local.hasExcessiveDashes ? 10 : 0,
      passed: !local.hasExcessiveDashes,
      detail: local.hasExcessiveDashes ? 'Unusual number of hyphens - common in fake domains' : 'Domain structure looks normal',
    },
  ]
}

router.post('/check-url', async (req, res) => {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please provide a URL to check.' })
  }

  const local = inspectDomain(normalizeUrl(url))
  if (!local) {
    return res.status(400).json({ error: "That doesn't look like a valid URL." })
  }

  // run both API checks at the same time so we don't wait twice
  const [googleResult, vtResult] = await Promise.allSettled([
    checkGoogleSafeBrowsing(local.normalized),
    checkVirusTotal(local.normalized),
  ])

  const googleData = googleResult.status === 'fulfilled' ? googleResult.value : { error: true }
  const vtData     = vtResult.status    === 'fulfilled' ? vtResult.value    : { error: true }

  const scoreCategories = buildScoreCategories(local, googleData, vtData)
  const trustScore = Math.max(0, 100 - scoreCategories.reduce((sum, c) => sum + c.deduction, 0))

  const isDefinitelyUnsafe = googleData.isThreat || vtData.malicious > 2 || local.hasSuspiciousKeyword || local.hasIpAddress || local.hasSuspiciousTld
  const hasWarnings        = !isDefinitelyUnsafe && (local.hasExcessiveDashes || local.isHttp || vtData.malicious > 1)

  const riskFactors = []
  if (local.hasSuspiciousKeyword) riskFactors.push('Domain contains suspicious words')
  if (local.hasSuspiciousTld)     riskFactors.push('Uses a high-risk domain extension')
  if (local.hasExcessiveDashes)   riskFactors.push('Unusual number of hyphens in domain')
  if (local.hasIpAddress)         riskFactors.push('URL uses a raw IP address instead of a domain name')
  if (local.isHttp)               riskFactors.push('Connection is not encrypted (HTTP, not HTTPS)')
  if (googleData.isThreat)        riskFactors.push(`Google flagged this as: ${googleData.threatType}`)
  if (vtData.malicious > 1)       riskFactors.push(`${vtData.malicious} antivirus vendors flagged this URL`)

  res.json({
    hostname: local.hostname,
    verdict: isDefinitelyUnsafe ? 'unsafe' : hasWarnings ? 'warning' : 'safe',
    trustScore,
    scoreCategories,
    riskFactors,
    checks: buildChecks(local, googleData, vtData),
  })
})

export default router
