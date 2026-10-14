import pg from "pg";
const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required. Configure server/.env before starting the API.");
const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, ssl,
  max: Number(process.env.DB_POOL_MAX || 10), idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, application_name: "xora-commerce-api"
});
pool.on("error", (error) => console.error("Unexpected idle PostgreSQL client error:", error.message));
