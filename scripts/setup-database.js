const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/greenpanda",
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })

  try {
    console.log("🐼 Setting up Green Panda database...")

    // Read and execute schema - fix the path
    const schemaPath = path.join(__dirname, "database-schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    await pool.query(schema)
    console.log("✅ Database schema created successfully!")

    // Read and execute seed data - fix the path
    const seedPath = path.join(__dirname, "seed-data.sql")
    const seedData = fs.readFileSync(seedPath, "utf8")

    await pool.query(seedData)
    console.log("✅ Seed data inserted successfully!")

    console.log("🌿 Green Panda database is ready for zen shopping!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

setupDatabase()
