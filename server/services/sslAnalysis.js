import https from 'https'

// Points: valid cert 10, expiry 8, TLS version 4, trusted issuer 3 = 25 total.
export async function checkSslCertificate(hostname) {
  const cleanHostname = hostname.replace(/^https?:\/\//, '').split('/')[0]

  return new Promise((resolve) => {
    let score = 0
    const details = {}

    const timer = setTimeout(() => {
      resolve({
        category: 'SSL/TLS Analysis',
        score: 0,
        maxScore: 25,
        status: 'warn',
        details: { timeout: { status: 'warn', points: 0, message: 'SSL check timed out' } },
      })
    }, 6000)

    const req = https.request(
      { host: cleanHostname, port: 443, method: 'GET', rejectUnauthorized: false },
      (res) => {
        clearTimeout(timer)
        const cert = res.socket.getPeerCertificate()

        if (!cert || Object.keys(cert).length === 0) {
          return resolve({
            category: 'SSL/TLS Analysis',
            score: 0,
            maxScore: 25,
            status: 'danger',
            details: { noCert: { status: 'danger', points: 0, message: 'No SSL certificate was found on this site' } },
          })
        }

        const now = new Date()
        const validTo = new Date(cert.valid_to)
        const daysLeft = Math.floor((validTo - now) / (1000 * 60 * 60 * 24))
        const isAuthorized = res.socket.authorized

        // Valid and trusted cert: 10 points
        if (isAuthorized) {
          score += 10
          details.validity = { status: 'pass', points: 10, message: 'Certificate is valid and trusted' }
        } else {
          details.validity = {
            status: 'danger',
            points: 0,
            message: `Certificate problem: ${res.socket.authorizationError || 'not trusted'}`,
          }
        }

        // Certificate expiry: 8 points, 4 if expiring within 30 days
        if (daysLeft > 30) {
          score += 8
          details.expiry = { status: 'pass', points: 8, daysLeft, message: `Certificate is valid for another ${daysLeft} days` }
        } else if (daysLeft > 0) {
          score += 4
          details.expiry = { status: 'warn', points: 4, daysLeft, message: `Certificate expires in ${daysLeft} days -- renew soon` }
        } else {
          details.expiry = { status: 'danger', points: 0, daysLeft, message: 'Certificate has expired' }
        }

        // TLS version: 4 points for 1.2 or 1.3
        const tlsVersion = res.socket.getProtocol?.() || 'Unknown'
        if (tlsVersion === 'TLSv1.3' || tlsVersion === 'TLSv1.2') {
          score += 4
          details.tlsVersion = { status: 'pass', points: 4, version: tlsVersion, message: `Uses modern encryption (${tlsVersion})` }
        } else {
          details.tlsVersion = { status: 'warn', points: 0, version: tlsVersion, message: `Uses outdated encryption (${tlsVersion})` }
        }

        // Not self-signed and has a real issuer: 3 points
        const isSelfSigned = cert.issuer?.CN === cert.subject?.CN
        if (!isSelfSigned && cert.issuer?.O) {
          score += 3
          details.issuer = { status: 'pass', points: 3, name: cert.issuer.O, message: `Issued by ${cert.issuer.O}` }
        } else {
          details.issuer = {
            status: 'danger',
            points: 0,
            message: isSelfSigned ? 'Certificate is self-signed -- not trustworthy' : 'Certificate issuer is unknown',
          }
        }

        const statuses = [details.validity?.status, details.expiry?.status, details.tlsVersion?.status, details.issuer?.status]
        const categoryStatus = statuses.includes('danger') ? 'danger' : statuses.includes('warn') ? 'warn' : 'pass'

        resolve({
          category: 'SSL/TLS Analysis',
          score: Math.min(score, 25),
          maxScore: 25,
          status: categoryStatus,
          details,
        })
      }
    )

    req.on('error', (err) => {
      clearTimeout(timer)
      console.error('[sslAnalysis] connection error:', err.message)
      resolve({
        category: 'SSL/TLS Analysis',
        score: 0,
        maxScore: 25,
        status: 'danger',
        details: { connectionError: { status: 'danger', points: 0, message: 'Could not connect to check the SSL certificate' } },
      })
    })

    req.end()
  })
}
