import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../src/db.js";
const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
if (!email || !password || password.length < 16) {
  console.error("Set ADMIN_EMAIL and a one-time ADMIN_PASSWORD of at least 16 characters.");
  process.exitCode = 1;
} else {
  try {
    const hash = await bcrypt.hash(password, 12);
    await pool.query("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,'admin') ON CONFLICT(email) DO NOTHING", ["XORA Administrator", email, hash]);
    console.log("Admin bootstrap complete. Existing account role/password were not changed.");
  } catch (error) {
    console.error("Admin bootstrap failed:", error.message);
    process.exitCode = 1;
  } finally { await pool.end(); }
}
