# XORA Commerce API

Backend foundation: PostgreSQL persistence, customer registration/login, role-based admin routes, server-calculated order totals, inventory checks, Moyasar hosted invoices and payment notifications.

**Not live until PostgreSQL, HTTPS URLs, Moyasar credentials/webhook and deployment are configured and end-to-end tested.** Do not accept real orders until those steps are complete.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- Moyasar merchant account for Saudi SAR payments
- HTTPS storefront and API origins for production

## Local setup
1. Create a PostgreSQL database and least-privileged database user.
2. Apply schema using: psql "$DATABASE_URL" -f server/db/schema.sql
3. Copy server/.env.example to server/.env; set a strong random JWT secret (32+ chars), database URL and local origins.
4. Run: cd server && npm install
5. Run: npm run check && npm test
6. Start with: npm run dev. Health check: GET http://localhost:4000/health

Never commit .env, database credentials, JWT secrets or payment keys.

## API
- POST /api/auth/register — creates customer only; role cannot be supplied.
- POST /api/auth/login, GET /api/auth/me
- GET /api/products, GET /api/products/:slug
- POST /api/orders — authenticated; client submits product IDs/quantities only; price comes from DB.
- GET /api/orders, GET /api/orders/:id — users see only their own orders.
- POST /api/orders/:id/payment — creates hosted invoice; returns checkout URL.
- POST /api/webhooks/moyasar — configured webhook secret plus provider API reconciliation before paid status.
- /api/admin/* — admin role required; product management and order status/listing.

Prices are integer minor units (halalas for SAR). The browser cannot set product prices, totals, order status or roles. Browser redirects never prove payment.

## First administrator
Set ADMIN_EMAIL and a one-time ADMIN_PASSWORD (16+ chars) in the private server environment and run npm run admin:create. Existing accounts are not promoted/reset by this script. Remove the one-time password from the environment after setup.

## Moyasar setup
1. Get test credentials from the provider dashboard.
2. Store MOYASAR_SECRET_KEY and a long random MOYASAR_WEBHOOK_SECRET only in server secrets.
3. Set PUBLIC_APP_URL and API_PUBLIC_URL to HTTPS origins.
4. Configure provider callbacks to POST https://YOUR_API_HOST/api/webhooks/moyasar and confirm the provider/account supports the shared secret field used by this endpoint.
5. Test payments and verify invoice amount/currency against stored order before switching to live keys.

Never put payment secrets in frontend JavaScript. Confirm the current provider callback authentication and payload contract against the merchant documentation before going live.

## Production checklist
- [ ] Managed PostgreSQL, TLS, automated backups and least-privilege DB user.
- [ ] HTTPS hosting, secret manager, exact CORS origins, correct proxy configuration.
- [ ] Provider sandbox payment and webhook end-to-end test.
- [ ] Catalogue seeded with correct product IDs, variants/sizes, stock/prices/images.
- [ ] Shipping, returns, tax/VAT, privacy notice, terms and customer support.
- [ ] Email verification, password reset, session revocation, audit logs and monitoring.
- [ ] Inventory release/reservation flow for abandoned/failed orders.
- [ ] Dependency/security scan and independent review.
- [ ] Integrate storefront only after API deployment and testing.

## Remaining work
This is a backend foundation, not a complete commerce deployment. It does not include an admin UI, email verification/password reset, carrier integration, tax calculation, refund UI, or automatic stock release for abandoned payments. Webhook authentication must be verified with your account before accepting live payments.
