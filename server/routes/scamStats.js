import express from 'express'
import db from '../db.js'

const router = express.Router()

router.get('/online-seniors', async (req, res) => {
  try {
    const [topScamTypes] = await db.query(`
      SELECT
        scam_type,
        SUM(reports) AS total_reports,
        SUM(amount_lost) AS total_lost
      FROM scam_reports
      WHERE age_group = '65 and over'
        AND contact_method = 'Online'
      GROUP BY scam_type
      ORDER BY total_reports DESC
      LIMIT 6
    `)

    const [summaryRows] = await db.query(`
      SELECT
        SUM(reports) AS total_reports,
        SUM(amount_lost) AS total_lost
      FROM scam_reports
      WHERE age_group = '65 and over'
        AND contact_method = 'Online'
    `)

    res.json({
      topScamTypes,
      summary: summaryRows[0],
    })
  } catch (err) {
    console.error('Error fetching scam stats:', err)
    res.status(500).json({ error: 'Could not load scam data' })
  }
})

export default router
