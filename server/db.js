import mysql from 'mysql2/promise'

const requiredDbEnv = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME']
const missingDbEnv = requiredDbEnv.filter((envName) => !process.env[envName])

const pool = missingDbEnv.length === 0
  ? mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
    })
  : null

if (!pool) {
  console.warn(`[SafeCheck] Database configuration is incomplete. Missing: ${missingDbEnv.join(', ')}`)
}

async function query(sql, params) {
  if (!pool) {
    throw new Error(`Database is not configured. Missing: ${missingDbEnv.join(', ')}`)
  }

  return pool.query(sql, params)
}

export default { query }
