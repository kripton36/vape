#!/usr/bin/env node

const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/greenpanda",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

async function setupDatabase() {
  try {
    console.log('🐼 Setting up Green Panda Cannabis Store database...')
    
    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, 'init-database.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📊 Creating database schema and seed data...')
    await pool.query(sql)
    
    console.log('✅ Database setup completed successfully!')
    console.log('')
    console.log('🎉 You can now start the application with: npm run dev')
    console.log('')
    console.log('Default admin credentials:')
    console.log('  Email: admin@greenpanda.com')
    console.log('  Password: admin123')
    console.log('')
    console.log('⚠️  Remember to change the default admin password in production!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    
    if (error.code === 'ECONNREFUSED') {
      console.log('')
      console.log('📝 Troubleshooting:')
      console.log('1. Make sure PostgreSQL is running')
      console.log('2. Check your DATABASE_URL in .env.local')
      console.log('3. Ensure the database exists: createdb greenpanda')
    }
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the setup
setupDatabase()
