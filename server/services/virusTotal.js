import axios from 'axios'

const VT_BASE = 'https://www.virustotal.com/api/v3'

export async function checkVirusTotal(url) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY

  // VirusTotal needs the URL as base64url to do a lookup
  const urlId = Buffer.from(url).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

  const response = await axios.get(`${VT_BASE}/urls/${urlId}`, {
    headers: { 'x-apikey': apiKey },
  })

  const stats = response.data.data.attributes.last_analysis_stats

  return {
    malicious: stats.malicious ?? 0,
    suspicious: stats.suspicious ?? 0,
    harmless: stats.harmless ?? 0,
    undetected: stats.undetected ?? 0,
  }
}
