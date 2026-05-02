import dns from 'dns/promises'
import httpClient from './httpClient.js'

// Points: domain age 8, DNS records 9 (A=2, MX=4, NS=3), blocklist 6, WHOIS data 2 = 25 total.
export async function checkDnsAnalysis(hostname) {
  let score = 0
  const details = {}

  const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0]

  // Check if the domain resolves at all. If not, return early with score 0.
  let aRecords = []
  try {
    aRecords = await dns.resolve4(cleanHostname)
  } catch (err) {
    const knownNoExist = ['ENOTFOUND', 'ENODATA', 'ESERVFAIL'].includes(err.code)
    return {
      category: 'DNS Analysis',
      score: 0,
      maxScore: 25,
      domainStatus: 'unregistered',
      status: 'danger',
      details: {
        domainExists: {
          status: 'danger',
          points: 0,
          message: knownNoExist
            ? 'This website address does not exist -- it has never been registered'
            : 'Could not look up this website address',
          errorCode: err.code,
        },
      },
    }
  }

  // A records confirmed: 2 points
  score += 2
  details.aRecords = { status: 'pass', points: 2, count: aRecords.length }

  // Domain age via WHOIS API: 8 points
  let domainStatus = 'established'
  const whoisKey = process.env.WHOIS_API_KEY

  if (whoisKey) {
    try {
      const whoisRes = await httpClient.get('https://www.whoisxmlapi.com/whoisserver/WhoisService', {
        params: { apiKey: whoisKey, domainName: cleanHostname, outputFormat: 'JSON' },
        timeout: 5000,
      })

      const record = whoisRes.data?.WhoisRecord

      // Only treat as unregistered when the API explicitly says there is no WHOIS data at all.
      // Other dataError values (partial data, privacy protection, etc) still have usable fields.
      if (!record || record.dataError === 'MISSING_WHOIS_DATA') {
        return {
          category: 'DNS Analysis',
          score: 0,
          maxScore: 25,
          domainStatus: 'unregistered',
          status: 'danger',
          details: {
            domainAge: {
              status: 'danger',
              points: 0,
              message: 'No registration record found for this domain',
            },
          },
        }
      }

      // Try the main record first, then fall back to registryData which some TLDs use.
      const createdDate = record?.createdDate
        || record?.registryData?.createdDate
        || record?.registryData?.creationDate

      if (createdDate) {
        const ageInDays = Math.floor((Date.now() - new Date(createdDate)) / 86400000)
        const ageInMonths = Math.floor(ageInDays / 30)

        if (ageInDays < 7)        domainStatus = 'brand_new'
        else if (ageInMonths < 3) domainStatus = 'new'
        else if (ageInMonths < 6) domainStatus = 'recent'
        else                      domainStatus = 'established'

        const ageScore =
          domainStatus === 'established' ? 8 :
          domainStatus === 'recent'      ? 4 :
          domainStatus === 'new'         ? 1 : 0

        score += ageScore

        details.domainAge = {
          status: domainStatus === 'established' ? 'pass' : domainStatus === 'recent' ? 'warn' : 'danger',
          points: ageScore,
          ageInDays,
          ageInMonths,
          domainStatus,
          createdDate,
          registrar: record?.registrarName || 'Unknown',
          message:
            domainStatus === 'brand_new'
              ? `Website was created only ${ageInDays} day(s) ago -- brand new sites are a common scammer tactic`
              : domainStatus === 'new'
              ? `Website is only ${ageInMonths} month(s) old -- be cautious`
              : domainStatus === 'recent'
              ? `Website is ${ageInMonths} months old -- fairly new`
              : `Website has been around for ${ageInMonths} months`,
        }
      } else {
        // WHOIS record exists but creation date is hidden
        domainStatus = 'unknown_age'
        score += 2
        details.domainAge = {
          status: 'warn',
          points: 2,
          domainStatus,
          registrar: record?.registrarName || 'Unknown',
          message: 'Website registration date is hidden',
        }
      }
    } catch (err) {
      console.error('[dnsAnalysis] WHOIS lookup failed:', err.message)
      score += 2
      details.domainAge = { status: 'warn', points: 2, message: 'Could not check domain age right now' }
    }
  } else {
    score += 2
    details.domainAge = { status: 'warn', points: 2, message: 'Domain age check is not configured' }
  }

  // MX records (mail servers): 4 points
  try {
    const mx = await dns.resolveMx(cleanHostname)
    if (mx?.length > 0) {
      score += 4
      details.mxRecords = { status: 'pass', points: 4, count: mx.length, message: 'Mail server records found' }
    } else {
      details.mxRecords = { status: 'warn', points: 0, message: 'No mail server records found' }
    }
  } catch {
    details.mxRecords = { status: 'warn', points: 0, message: 'No mail server records found' }
  }

  // NS records (nameservers): 3 points
  try {
    const ns = await dns.resolveNs(cleanHostname)
    if (ns?.length > 0) {
      score += 3
      details.nsRecords = { status: 'pass', points: 3, count: ns.length, message: 'Nameserver records found' }
    } else {
      details.nsRecords = { status: 'warn', points: 0, message: 'No nameserver records found' }
    }
  } catch {
    details.nsRecords = { status: 'warn', points: 0, message: 'No nameserver records found' }
  }

  // DNS blocklist check against Spamhaus, SpamCop, SORBS: 6 points.
  // Reverse the IP and query <reversed-ip>.<blocklist>.
  // If the DNS query resolves, the IP is listed (bad). If it throws NXDOMAIN, the IP is clean.
  try {
    const reversedIp = aRecords[0].split('.').reverse().join('.')
    const blocklists = ['zen.spamhaus.org', 'bl.spamcop.net', 'dnsbl.sorbs.net']
    let isListed = false
    let listedOn = null

    for (const bl of blocklists) {
      try {
        await dns.resolve4(`${reversedIp}.${bl}`)
        isListed = true
        listedOn = bl
        break
      } catch {
        // Not listed on this one
      }
    }

    if (!isListed) {
      score += 6
      details.blocklist = { status: 'pass', points: 6, message: 'Not found on any spam or malware blocklist' }
    } else {
      details.blocklist = { status: 'danger', points: 0, listedOn, message: `IP is on a blocklist (${listedOn})` }
    }
  } catch {
    score += 3
    details.blocklist = { status: 'warn', points: 3, message: 'Could not check blocklists right now' }
  }

  // WHOIS completeness: 2 points
  const registrar = details.domainAge?.registrar
  if (registrar && registrar !== 'Unknown') {
    score += 2
    details.whois = { status: 'pass', points: 2, message: `Registered through ${registrar}` }
  } else {
    details.whois = { status: 'warn', points: 0, message: 'Registrar information is hidden or missing' }
  }

  const statuses = Object.values(details).filter(d => d?.status).map(d => d.status)
  const categoryStatus = statuses.includes('danger') ? 'danger' : statuses.includes('warn') ? 'warn' : 'pass'

  return {
    category: 'DNS Analysis',
    score: Math.min(score, 25),
    maxScore: 25,
    domainStatus,
    status: categoryStatus,
    details,
  }
}
