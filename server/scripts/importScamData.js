import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import csv from 'csv-parser'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../src/.env') })

const FILES = [
  { file: 'nasc_cleaned.csv', source: 'NASC' },
  { file: 'scamwatch_cleaned.csv', source: 'Scamwatch' },
]

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  })

  console.log('Connected to Azure MySQL')

  for (const { file, source } of FILES) {
    const rows = []

    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(__dirname, '../../data', file))
        .pipe(csv())
        .on('data', row => {
          rows.push([
            row.date || null,
            row.state || null,
            row.contact_method || null,
            row.age_group || null,
            row.gender || null,
            row.scam_category || null,
            row.scam_type || null,
            parseFloat(row.amount_lost) || 0,
            parseInt(row.reports, 10) || 0,
            parseInt(row.year, 10) || null,
            parseInt(row.month, 10) || null,
            row.month_name || null,
            row.source || source,
          ])
        })
        .on('end', resolve)
        .on('error', reject)
    })

    const sql = `
      INSERT INTO scam_reports
        (report_date, state, contact_method, age_group, gender,
         scam_category, scam_type, amount_lost, reports,
         year, month, month_name, source)
      VALUES ?
    `

    const CHUNK = 500
    for (let i = 0; i < rows.length; i += CHUNK) {
      await db.query(sql, [rows.slice(i, i + CHUNK)])
    }

    console.log(`Imported ${rows.length} rows from ${file}`)
  }

  await db.end()
  console.log('Done!')
}

run().catch(console.error)
