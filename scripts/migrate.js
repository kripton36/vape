const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function runMigrations() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Starting database migrations...')
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    const migrationsDir = path.join(__dirname, '..', 'lib', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()
    
    for (const file of migrationFiles) {
      // Check if migration has already been run
      const { rows } = await client.query(
        'SELECT id FROM migrations WHERE filename = $1',
        [file]
      )
      
      if (rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`)
        continue
      }
      
      console.log(`📝 Running migration: ${file}`)
      
      // Read and execute migration file
      const migrationSQL = fs.readFileSync(
        path.join(migrationsDir, file),
        'utf8'
      )
      
      await client.query('BEGIN')
      
      try {
        await client.query(migrationSQL)
        
        // Mark migration as completed
        await client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        )
        
        await client.query('COMMIT')
        console.log(`✅ Completed migration: ${file}`)
      } catch (error) {
        await client.query('ROLLBACK')
        console.error(`❌ Failed migration: ${file}`)
        throw error
      }
    }
    
    console.log('🎉 All migrations completed successfully!')
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    throw error
  } finally {
    client.release()
  }
}

async function main() {
  try {
    await runMigrations()
    console.log('✨ Database setup complete!')
  } catch (error) {
    console.error('Failed to run migrations:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

if (require.main === module) {
  main()
}

module.exports = { runMigrations }