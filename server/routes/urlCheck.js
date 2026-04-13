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
      label: 'Google check',
      status: googleData.error ? 'warn' : googleData.isThreat ? 'danger' : 'pass',
      detail: googleData.error
        ? 'We could not check Google, so we skipped this step.'
        : googleData.isThreat
        ? `Google thinks this site may be unsafe (${googleData.threatType}).`
        : 'Google did not flag this site.',
    },
    {
      label: 'Security scan',
      status: vtData.error ? 'warn' : vtData.malicious > 2 ? 'danger' : vtData.malicious > 0 ? 'warn' : 'pass',
      detail: vtData.error
        ? 'We could not run the security scan, so we skipped this step.'
        : vtData.malicious > 2
        ? 'Several security tools flagged this site.'
        : vtData.malicious > 0
        ? 'One security tool flagged this site.'
        : 'No issues were found by the security tools.',
    },
    {
      label: 'Secure connection',
      status: local.isHttp ? 'warn' : 'pass',
      detail: local.isHttp
        ? 'This site does not use HTTPS, so the connection is not protected.'
        : 'This site uses HTTPS, so the connection is protected.',
    },
    {
      label: 'Website name',
      status: (local.hasExcessiveDashes || local.hasIpAddress || local.hasSuspiciousKeyword || local.hasSuspiciousTld) ? 'warn' : 'pass',
      detail: local.hasIpAddress        ? 'This site uses an IP address instead of a normal website name.'
            : local.hasSuspiciousKeyword ? 'The website name includes words often used in scams.'
            : local.hasSuspiciousTld     ? 'This site uses a less common web address ending.'
            : local.hasExcessiveDashes   ? 'The website name has an unusual number of dashes.'
                                         : 'The website name looks normal.',
    },
  ]
}

function buildScoreCategories(local, googleData, vtData) {
  return [
    {
      label: 'Google check',
      maxDeduction: 40,
      deduction: googleData.isThreat ? 40 : 0,
      passed: !googleData.isThreat,
      detail: googleData.error     ? 'Could not check Google'
            : googleData.isThreat  ? 'Google flagged this site'
                                   : 'Google did not flag this site',
    },
    {
      label: 'Security scan',
      maxDeduction: 30,
      deduction: vtData.malicious > 2 ? 30 : vtData.malicious > 0 ? 10 : 0,
      passed: vtData.malicious === 0,
      detail: vtData.error           ? 'Could not run the scan'
            : vtData.malicious > 2   ? 'Several tools flagged this site'
            : vtData.malicious > 0   ? 'One tool flagged this site'
                                     : 'No issues found',
    },
    {
      label: 'Secure connection',
      maxDeduction: 10,
      deduction: local.isHttp ? 10 : 0,
      passed: !local.isHttp,
      detail: local.isHttp ? 'Site uses HTTP' : 'Site uses HTTPS',
    },
    {
      label: 'Scam words in name',
      maxDeduction: 20,
      deduction: local.hasSuspiciousKeyword ? 20 : 0,
      passed: !local.hasSuspiciousKeyword,
      detail: local.hasSuspiciousKeyword ? 'The website name includes words often seen in scams' : 'No scam words found',
    },
    {
      label: 'Website ending',
      maxDeduction: 15,
      deduction: local.hasSuspiciousTld ? 15 : 0,
      passed: !local.hasSuspiciousTld,
      detail: local.hasSuspiciousTld ? 'This ending is less common and can be risky' : 'The website ending looks normal',
    },
    {
      label: 'IP address used',
      maxDeduction: 15,
      deduction: local.hasIpAddress ? 15 : 0,
      passed: !local.hasIpAddress,
      detail: local.hasIpAddress ? 'This site uses an IP address instead of a website name' : 'A normal website name is used',
    },
    {
      label: 'Website name',
      maxDeduction: 10,
      deduction: local.hasExcessiveDashes ? 10 : 0,
      passed: !local.hasExcessiveDashes,
      detail: local.hasExcessiveDashes ? 'The website name has an unusual number of dashes' : 'The website name looks normal',
    },
  ]
}

router.post('/check-url', async (req, res) => {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please provide a website address to check.' })
  }

  const local = inspectDomain(normalizeUrl(url))
  if (!local) {
    return res.status(400).json({ error: 'That does not look like a valid website address.' })
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
  if (local.hasSuspiciousKeyword) riskFactors.push('The website name includes words often seen in scams.')
  if (local.hasSuspiciousTld)     riskFactors.push('This site uses a less common web address ending.')
  if (local.hasExcessiveDashes)   riskFactors.push('The website name has an unusual number of dashes.')
  if (local.hasIpAddress)         riskFactors.push('This site uses an IP address instead of a normal website name.')
  if (local.isHttp)               riskFactors.push('This site does not use HTTPS.')
  if (googleData.isThreat)        riskFactors.push(`Google thinks this site may be unsafe (${googleData.threatType}).`)
  if (vtData.malicious > 1)       riskFactors.push('Several security tools flagged this site.')

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
