import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { timingSafeEqual } from "node:crypto";
import { pool } from "./db.js";
import { calculateOrderTotal } from "./money.js";

const app = express();
const currency = (process.env.CURRENCY || "SAR").toUpperCase();
const jwtSecret = process.env.JWT_SECRET || "";
const appUrl = process.env.PUBLIC_APP_URL || "";
const apiUrl = process.env.API_PUBLIC_URL || "";
const moyasarUrl = (process.env.MOYASAR_API_URL || "https://api.moyasar.com/v1").replace(/\/+$/, "");
if (jwtSecret.length < 32) throw new Error("JWT_SECRET must be at least 32 characters.");
if (!["SAR", "INR", "AED", "USD"].includes(currency)) throw new Error("Unsupported CURRENCY.");

const origins = (process.env.CORS_ORIGINS || "http://localhost:8080").split(",").map(x => x.trim()).filter(Boolean);
app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);
app.use(helmet());
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) return callback(null, true); return callback(new Error("Origin is not allowed by CORS.")); }, methods: ["GET", "POST", "PATCH"], allowedHeaders: ["Content-Type", "Authorization"], maxAge: 600 }));
app.use(express.json({ limit: "100kb" }));
const authLimit = rateLimit({ windowMs: 900000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false });
const checkoutLimit = rateLimit({ windowMs: 900000, limit: 15, standardHeaders: "draft-8", legacyHeaders: false });
function fail(status, message) { const error = new Error(message); error.status = status; throw error; }
function route(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
function parse(schema, value) { const result = schema.safeParse(value); if (!result.success) { const error = new Error("Request validation failed."); error.status = 400; error.details = result.error.issues.map(x => ({ field: x.path.join("."), message: x.message })); throw error; } return result.data; }
function tokenFor(user) { return jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || "2h", issuer: "xora-api", audience: "xora-web" }); }
function auth(req, res, next) { const header = req.get("authorization") || ""; if (!header.startsWith("Bearer ")) return res.status(401).json({ error: "Authentication required." }); try { req.user = jwt.verify(header.slice(7), jwtSecret, { issuer: "xora-api", audience: "xora-web" }); return next(); } catch { return res.status(401).json({ error: "Invalid or expired access token." }); } }
function admin(req, res, next) { return req.user && req.user.role === "admin" ? next() : res.status(403).json({ error: "Administrator access required." }); }
function equalSecret(a, b) { if (typeof a !== "string" || typeof b !== "string") return false; const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
async function provider(path, payload) {
  const key = process.env.MOYASAR_SECRET_KEY;
  if (!key) fail(503, "Online payments are not configured. No payment was taken.");
  const response = await fetch(moyasarUrl + path, { method: payload ? "POST" : "GET", headers: { Authorization: "Basic " + Buffer.from(key + ":").toString("base64"), "Content-Type": "application/json", Accept: "application/json" }, ...(payload ? { body: JSON.stringify(payload) } : {}), signal: AbortSignal.timeout(12000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) fail(502, "Payment provider request failed.");
  return data;
}

app.get("/health", route(async (req, res) => { await pool.query("SELECT 1"); res.json({ status: "ok", database: "connected", paymentsConfigured: Boolean(process.env.MOYASAR_SECRET_KEY) }); }));

app.post("/api/auth/register", authLimit, route(async (req, res) => {
  const body = parse(z.object({ name: z.string().trim().min(2).max(100), email: z.email().transform(v => v.toLowerCase()).max(254), password: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/) }).strict(), req.body);
  const hash = await bcrypt.hash(body.password, 12);
  try {
    const result = await pool.query("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,'customer') RETURNING id,name,email,role,created_at", [body.name, body.email, hash]);
    const user = result.rows[0]; res.status(201).json({ user, accessToken: tokenFor(user), tokenType: "Bearer" });
  } catch (error) { if (error.code === "23505") return res.status(409).json({ error: "An account with this email already exists." }); throw error; }
}));
app.post("/api/auth/login", authLimit, route(async (req, res) => {
  const body = parse(z.object({ email: z.email().transform(v => v.toLowerCase()).max(254), password: z.string().min(1).max(128) }).strict(), req.body);
  const result = await pool.query("SELECT id,name,email,role,password_hash,created_at FROM users WHERE email=$1", [body.email]); const row = result.rows[0];
  if (!row || !(await bcrypt.compare(body.password, row.password_hash))) return res.status(401).json({ error: "Email or password is incorrect." });
  const { password_hash, ...user } = row; res.json({ user, accessToken: tokenFor(user), tokenType: "Bearer" });
}));
app.get("/api/auth/me", auth, route(async (req, res) => { const r = await pool.query("SELECT id,name,email,role,created_at FROM users WHERE id=$1", [req.user.sub]); if (!r.rowCount) return res.status(401).json({ error: "Account no longer exists." }); res.json({ user: r.rows[0] }); }));

app.get("/api/products", route(async (req, res) => {
  const q = parse(z.object({ category: z.string().trim().max(100).optional(), search: z.string().trim().max(100).optional(), limit: z.coerce.number().int().min(1).max(100).default(24), offset: z.coerce.number().int().min(0).max(10000).default(0) }), req.query);
  const values = [], where = ["active=TRUE"];
  if (q.category) { values.push(q.category); where.push("category=$" + values.length); }
  if (q.search) { values.push("%" + q.search + "%"); where.push("(name ILIKE $" + values.length + " OR description ILIKE $" + values.length + ")"); }
  values.push(q.limit); const limitIndex = values.length; values.push(q.offset); const offsetIndex = values.length;
  const r = await pool.query("SELECT id,slug,name,description,category,image_url,price_minor,currency,stock FROM products WHERE " + where.join(" AND ") + " ORDER BY created_at DESC LIMIT $" + limitIndex + " OFFSET $" + offsetIndex, values);
  res.json({ products: r.rows, currency, limit: q.limit, offset: q.offset });
}));
app.get("/api/products/:slug", route(async (req, res) => { const r = await pool.query("SELECT id,slug,name,description,category,image_url,price_minor,currency,stock FROM products WHERE slug=$1 AND active=TRUE", [req.params.slug]); if (!r.rowCount) return res.status(404).json({ error: "Product not found." }); res.json({ product: r.rows[0] }); }));

app.post("/api/orders", auth, checkoutLimit, route(async (req, res) => {
  const body = parse(z.object({ items: z.array(z.object({ productId: z.uuid(), quantity: z.number().int().min(1).max(20) }).strict()).min(1).max(30), shippingAddress: z.object({ fullName: z.string().trim().min(2).max(100), phone: z.string().trim().min(7).max(24), addressLine1: z.string().trim().min(4).max(180), addressLine2: z.string().trim().max(180).optional().default(""), city: z.string().trim().min(2).max(100), region: z.string().trim().min(2).max(100), postalCode: z.string().trim().min(3).max(16), country: z.string().trim().length(2).transform(v => v.toUpperCase()) }).strict() }).strict(), req.body);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const ids = [...new Set(body.items.map(i => i.productId))];
    const products = await client.query("SELECT id,name,price_minor,currency,stock FROM products WHERE id=ANY($1::uuid[]) AND active=TRUE FOR UPDATE", [ids]);
    const map = new Map(products.rows.map(p => [p.id, p]));
    if (map.size !== ids.length) fail(400, "One or more products are unavailable.");
    const items = body.items.map(i => { const p = map.get(i.productId); if (p.currency !== currency) fail(409, "Product currency does not match store currency."); if (p.stock < i.quantity) fail(409, "Insufficient stock for " + p.name + "."); return { ...i, product: p }; });
    const total = calculateOrderTotal(items.map(i => ({ priceMinor: i.product.price_minor, quantity: i.quantity })));
    for (const i of items) await client.query("UPDATE products SET stock=stock-$1,updated_at=NOW() WHERE id=$2", [i.quantity, i.product.id]);
    const number = "XOR-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const inserted = await client.query("INSERT INTO orders(order_number,user_id,subtotal_minor,total_minor,currency,shipping_address) VALUES($1,$2,$3,$3,$4,$5) RETURNING id,order_number,status,payment_status,subtotal_minor,total_minor,currency,created_at", [number, req.user.sub, total, currency, JSON.stringify(body.shippingAddress)]);
    const order = inserted.rows[0];
    for (const i of items) await client.query("INSERT INTO order_items(order_id,product_id,product_name,unit_price_minor,quantity,line_total_minor) VALUES($1,$2,$3,$4,$5,$6)", [order.id, i.product.id, i.product.name, i.product.price_minor, i.quantity, i.product.price_minor * i.quantity]);
    await client.query("COMMIT"); res.status(201).json({ order, message: "Order created. Payment remains pending until the provider confirms it." });
  } catch (error) { await client.query("ROLLBACK").catch(() => {}); throw error; } finally { client.release(); }
}));
app.get("/api/orders", auth, route(async (req, res) => { const r = await pool.query("SELECT id,order_number,status,payment_status,payment_provider,payment_reference,total_minor,currency,created_at,paid_at FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100", [req.user.sub]); res.json({ orders: r.rows }); }));
app.get("/api/orders/:id", auth, route(async (req, res) => { const r = await pool.query("SELECT id,order_number,status,payment_status,total_minor,currency,shipping_address,created_at,paid_at FROM orders WHERE id=$1 AND user_id=$2", [req.params.id, req.user.sub]); if (!r.rowCount) return res.status(404).json({ error: "Order not found." }); const items = await pool.query("SELECT product_name,unit_price_minor,quantity,line_total_minor FROM order_items WHERE order_id=$1", [req.params.id]); res.json({ order: { ...r.rows[0], items: items.rows } }); }));

app.post("/api/orders/:id/payment", auth, checkoutLimit, route(async (req, res) => {
  if (!appUrl.startsWith("https://") || !apiUrl.startsWith("https://")) fail(503, "Payments require HTTPS storefront and API URLs.");
  const r = await pool.query("SELECT id,order_number,user_id,status,payment_status,total_minor,currency,payment_reference FROM orders WHERE id=$1 AND user_id=$2", [req.params.id, req.user.sub]); const order = r.rows[0];
  if (!order) return res.status(404).json({ error: "Order not found." });
  if (order.payment_status === "paid" || order.status === "cancelled") return res.status(409).json({ error: "This order cannot start a payment." });
  if (order.payment_reference) return res.status(409).json({ error: "A payment session already exists. Check order status before retrying." });
  const invoice = await provider("/invoices", { amount: order.total_minor, currency: order.currency, description: "XORA order " + order.order_number, success_url: appUrl + "/?payment=return", back_url: appUrl + "/?payment=cancelled", callback_url: apiUrl + "/api/webhooks/moyasar", metadata: { order_id: order.id, order_number: order.order_number } });
  if (!invoice.id || !invoice.url || !Number.isSafeInteger(invoice.amount) || invoice.amount !== order.total_minor || invoice.currency !== order.currency) fail(502, "Unexpected payment invoice. Order was not marked paid.");
  await pool.query("UPDATE orders SET payment_provider='moyasar',payment_reference=$1,payment_url=$2,updated_at=NOW() WHERE id=$3", [invoice.id, invoice.url, order.id]);
  res.status(201).json({ orderId: order.id, paymentUrl: invoice.url, paymentStatus: invoice.status, message: "Complete payment on the hosted provider page; order status updates only after a verified notification." });
}));
app.post("/api/webhooks/moyasar", route(async (req, res) => {
  const secret = process.env.MOYASAR_WEBHOOK_SECRET || "";
  if (!secret) return res.status(503).json({ error: "Payment webhook is not configured." });
  if (!equalSecret(req.body?.secret_token, secret)) return res.status(401).json({ error: "Invalid webhook secret." });
  const data = req.body?.data && typeof req.body.data === "object" ? req.body.data : req.body;
  const eventId = String(req.body?.id || data?.id || "");
  if (!eventId || !data?.id) return res.status(400).json({ error: "Missing provider event identifier." });
  const duplicate = await pool.query("SELECT id FROM payment_events WHERE provider_event_id=$1", [eventId]); if (duplicate.rowCount) return res.json({ received: true, duplicate: true });
  const invoiceId = data.invoice_id || data.id;
  const invoice = await provider("/invoices/" + encodeURIComponent(invoiceId));
  const orderId = invoice?.metadata?.order_id; if (!orderId) return res.json({ received: true, ignored: true });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const rr = await client.query("SELECT id,total_minor,currency,payment_status,payment_reference FROM orders WHERE id=$1 FOR UPDATE", [orderId]); const order = rr.rows[0];
    if (!order) { await client.query("INSERT INTO payment_events(provider_event_id,event_type) VALUES($1,$2) ON CONFLICT DO NOTHING", [eventId, String(req.body?.type || "invoice_callback")]); await client.query("COMMIT"); return res.json({ received: true, ignored: true }); }
    if (order.payment_reference && order.payment_reference !== invoice.id) fail(409, "Provider invoice does not match order.");
    const paid = ["paid", "captured"].includes(invoice.status), matches = invoice.amount === order.total_minor && invoice.currency === order.currency;
    if (paid && !matches) fail(409, "Provider amount/currency does not match stored order.");
    if (paid && matches && order.payment_status !== "paid") await client.query("UPDATE orders SET payment_status='paid',status='processing',paid_at=NOW(),updated_at=NOW() WHERE id=$1", [order.id]);
    else if (!paid && ["failed", "expired", "canceled", "voided"].includes(invoice.status) && order.payment_status !== "paid") await client.query("UPDATE orders SET payment_status='failed',status='payment_failed',updated_at=NOW() WHERE id=$1", [order.id]);
    await client.query("INSERT INTO payment_events(provider_event_id,order_id,event_type) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [eventId, order.id, String(req.body?.type || "invoice_callback")]);
    await client.query("COMMIT"); res.json({ received: true, orderUpdated: paid && matches });
  } catch (error) { await client.query("ROLLBACK").catch(() => {}); throw error; } finally { client.release(); }
}));

app.get("/api/admin/orders", auth, admin, route(async (req, res) => { const r = await pool.query("SELECT o.id,o.order_number,o.status,o.payment_status,o.total_minor,o.currency,o.created_at,o.paid_at,u.name AS customer_name,u.email AS customer_email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 200"); res.json({ orders: r.rows }); }));
app.post("/api/admin/products", auth, admin, route(async (req, res) => {
  const b = parse(z.object({ slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: z.string().trim().min(2).max(180), description: z.string().max(5000).default(""), category: z.string().trim().min(2).max(100).default("Fashion"), imageUrl: z.url().max(2000).optional().nullable(), priceMinor: z.number().int().min(0).max(100000000), stock: z.number().int().min(0).max(100000).default(0), active: z.boolean().default(true) }).strict(), req.body);
  const r = await pool.query("INSERT INTO products(slug,name,description,category,image_url,price_minor,currency,stock,active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,slug,name,description,category,image_url,price_minor,currency,stock,active", [b.slug,b.name,b.description,b.category,b.imageUrl||null,b.priceMinor,currency,b.stock,b.active]); res.status(201).json({ product: r.rows[0] });
}));
app.patch("/api/admin/orders/:id/status", auth, admin, route(async (req, res) => {
  const b = parse(z.object({ status: z.enum(["processing","shipped","delivered","cancelled"]) }).strict(), req.body);
  const r = await pool.query("UPDATE orders SET status=$1,updated_at=NOW() WHERE id=$2 AND (payment_status='paid' OR $1='cancelled') RETURNING id,order_number,status,payment_status", [b.status,req.params.id]);
  if (!r.rowCount) return res.status(409).json({ error: "Order not found or cannot move before payment." }); res.json({ order: r.rows[0] });
}));
app.use((req,res)=>res.status(404).json({error:"Endpoint not found."}));
app.use((error,req,res,next)=>{if(res.headersSent)return next(error);const status=Number.isInteger(error.status)?error.status:500;if(status>=500)console.error("API error:",error.message);res.status(status).json({error:status>=500?"An internal error occurred.":error.message,...(error.details?{details:error.details}:{})});});
export default app;
