import express from 'express'
import fs from 'node:fs'
import { checkApiAggregation } from '../services/apiAggregator.js'
import { checkHttpSecurity } from '../services/httpSecurity.js'
import { checkSslCertificate } from '../services/sslAnalysis.js'
import { checkDnsAnalysis } from '../services/dnsAnalysis.js'

const sharedModuleCandidates = [
  new URL('../../shared/websiteValidation.js', import.meta.url),
  new URL('../shared/websiteValidation.js', import.meta.url),
]
const sharedModuleUrl = sharedModuleCandidates.find(c => fs.existsSync(c)) ?? sharedModuleCandidates[0]
const { WEBSITE_INPUT_ERROR, parseWebsiteInput } = await import(sharedModuleUrl)

const router = express.Router()

router.post('/check-url', async (req, res) => {
  const { url } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please provide a website address to check.' })
  }

  const parsed = parseWebsiteInput(url)
  if (!parsed) {
    return res.status(400).json({ error: WEBSITE_INPUT_ERROR })
  }

  const { normalized, hostname } = parsed

  // All 4 checks run in parallel. If one throws, the others still complete.
  const [apiResult, httpResult, sslResult, dnsResult] = await Promise.allSettled([
    checkApiAggregation(normalized, hostname),
    checkHttpSecurity(normalized),
    checkSslCertificate(hostname),
    checkDnsAnalysis(hostname),
  ])

  const fallback = (category, maxScore) => ({ category, score: 0, maxScore, status: 'warn', details: {} })

  const api      = apiResult.status  === 'fulfilled' ? apiResult.value  : fallback('API Verification', 25)
  const http     = httpResult.status === 'fulfilled' ? httpResult.value : fallback('HTTP Security',    25)
  const ssl      = sslResult.status  === 'fulfilled' ? sslResult.value  : fallback('SSL/TLS Analysis', 25)
  const dnsCheck = dnsResult.status  === 'fulfilled' ? dnsResult.value  : fallback('DNS Analysis',     25)

  const trustScore = api.score + http.score + ssl.score + dnsCheck.score

  // Unregistered and brand new domains are automatically unsafe regardless of total score.
  const domainStatus = dnsCheck.domainStatus || 'established'
  const isDefinitelyUnsafe = trustScore < 40 || domainStatus === 'unregistered' || domainStatus === 'brand_new'
  const hasWarnings = !isDefinitelyUnsafe && trustScore < 70

  const verdict = isDefinitelyUnsafe ? 'unsafe' : hasWarnings ? 'warning' : 'safe'

  // scoreCategories: read by TrustScoreCard.vue for the breakdown panel
  const scoreCategories = [
    { label: api.category,      score: api.score,      maxScore: api.maxScore,      status: api.status },
    { label: http.category,     score: http.score,     maxScore: http.maxScore,     status: http.status },
    { label: ssl.category,      score: ssl.score,      maxScore: ssl.maxScore,      status: ssl.status },
    { label: dnsCheck.category, score: dnsCheck.score, maxScore: dnsCheck.maxScore, status: dnsCheck.status },
  ]

  // checks: flat list for ChecksList.vue
  const checks = buildChecks(api.details, http.details, ssl.details, dnsCheck.details)

  // riskFactors: shown in VerdictBanner.vue
  const riskFactors = buildRiskFactors(api.details, http.details, ssl.details, dnsCheck.details, domainStatus)

  res.json({
    hostname,
    verdict,
    trustScore,
    maxScore: 100,
    scoreCategories,
    checks,
    riskFactors,
    domainStatus,
  })
})

function buildChecks(apiDetails, httpDetails, sslDetails, dnsDetails) {
  const checks = []

  if (apiDetails.google)        checks.push({ label: 'Google safety check',        status: apiDetails.google.status,        detail: apiDetails.google.message })
  if (apiDetails.virusTotal)    checks.push({ label: 'Antivirus scan',              status: apiDetails.virusTotal.status,    detail: apiDetails.virusTotal.message })
  if (apiDetails.urlhaus)       checks.push({ label: 'Malware list check',          status: apiDetails.urlhaus.status,       detail: apiDetails.urlhaus.message })
  if (apiDetails.phishStats)    checks.push({ label: 'Phishing list check',         status: apiDetails.phishStats.status,    detail: apiDetails.phishStats.message })

  if (httpDetails.https)        checks.push({ label: 'Secure connection (HTTPS)',   status: httpDetails.https.status,        detail: httpDetails.https.message })
  if (httpDetails.hsts)         checks.push({ label: 'HSTS protection',             status: httpDetails.hsts.status,         detail: httpDetails.hsts.message })
  if (httpDetails.xFrame)       checks.push({ label: 'Clickjacking protection',     status: httpDetails.xFrame.status,       detail: httpDetails.xFrame.message })
  if (httpDetails.xContentType) checks.push({ label: 'Content type protection',     status: httpDetails.xContentType.status, detail: httpDetails.xContentType.message })

  if (sslDetails.validity)      checks.push({ label: 'Security certificate',        status: sslDetails.validity.status,      detail: sslDetails.validity.message })
  if (sslDetails.expiry)        checks.push({ label: 'Certificate expiry',          status: sslDetails.expiry.status,        detail: sslDetails.expiry.message })
  if (sslDetails.tlsVersion)    checks.push({ label: 'Encryption strength',         status: sslDetails.tlsVersion.status,    detail: sslDetails.tlsVersion.message })
  if (sslDetails.issuer)        checks.push({ label: 'Certificate issuer',          status: sslDetails.issuer.status,        detail: sslDetails.issuer.message })

  if (dnsDetails.domainExists)  checks.push({ label: 'Website address exists',      status: dnsDetails.domainExists.status,  detail: dnsDetails.domainExists.message })
  if (dnsDetails.domainAge)     checks.push({ label: 'Website age',                 status: dnsDetails.domainAge.status,     detail: dnsDetails.domainAge.message })
  if (dnsDetails.blocklist)     checks.push({ label: 'Spam and malware blocklist',  status: dnsDetails.blocklist.status,     detail: dnsDetails.blocklist.message })
  if (dnsDetails.mxRecords)     checks.push({ label: 'Mail server records',         status: dnsDetails.mxRecords.status,     detail: dnsDetails.mxRecords.message })

  return checks
}

function buildRiskFactors(apiDetails, httpDetails, sslDetails, dnsDetails, domainStatus) {
  const factors = []

  if (domainStatus === 'unregistered')              factors.push('This website address does not exist anywhere on the internet')
  if (domainStatus === 'brand_new')                 factors.push('This website was only just created -- brand new sites are a common scammer tactic')
  if (apiDetails.google?.status     === 'danger')  factors.push('Google has flagged this site as unsafe')
  if (apiDetails.virusTotal?.status === 'danger')  factors.push(`${apiDetails.virusTotal.malicious} antivirus tools detected threats on this site`)
  if (apiDetails.urlhaus?.status    === 'danger')  factors.push('This site is on a known malware distribution list')
  if (apiDetails.phishStats?.status === 'danger')  factors.push('This site is on a known phishing list')
  if (httpDetails.https?.status     === 'danger')  factors.push('Site does not use HTTPS -- your connection is not secure')
  if (sslDetails.validity?.status   === 'danger')  factors.push('The SSL certificate is invalid or not trusted')
  if (sslDetails.expiry?.status     === 'danger')  factors.push('The SSL certificate has expired')
  if (dnsDetails.blocklist?.status  === 'danger')  factors.push("The site's IP address is on a security blocklist")

  return factors
}

export default router
