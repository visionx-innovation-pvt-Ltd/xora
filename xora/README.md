# XORA Web App

This directory contains the XORA fashion storefront prototype built with HTML, CSS, and vanilla JavaScript.

## Run locally

From the repository root, run:

```bash
python -m http.server 8080
```

Then open [http://localhost:8080/xora/](http://localhost:8080/xora/).

## Pages

- `index.html` — storefront
- `collections.html` — collections
- `bespoke.html` — made-to-measure studio demo
- `membership.html` — membership demo
- `enterprise.html` — studio operations demo
- `sale.html` — offers
- `brands.html` — designer sub-labels

## Demo and safety notes

This is a front-end prototype. Cart and membership state are browser-side, and checkout/payment options are simulated only. No order is sent to a merchant and no money is transferred. Do not enter real customer or payment information. A production store needs a secure backend, authentication/authorization, and a server-verified payment-gateway integration.

For full setup, limitations, and production-readiness guidance, see the repository-root [README](../README.md).
