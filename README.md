# XORA — Fashion Storefront & Bespoke Atelier

XORA is a responsive, dark-themed fashion storefront prototype for designer collections, made-to-measure experiences, membership tiers, and internal studio workflows. The front end is built with HTML, CSS, and vanilla JavaScript, with a lightweight Progressive Web App (PWA) setup.

> **Prototype notice:** This repository is a front-end demo. Checkout and payment choices are simulated in the browser; orders are not transmitted to a merchant, and no payment is collected or verified. Do not use it to accept real customer orders or payments without a secure backend and payment-provider integration.

## Features

- **Storefront and collections** — browse fashion categories and filter/search product cards.
- **Bespoke studio** — explore made-to-measure options and a browser-side fit estimator.
- **Membership demo** — preview membership tiers and their example discounts.
- **Studio operations demo** — view the enterprise/designer workflow interface.
- **Cart and checkout prototype** — adjust cart quantities and see estimated totals; checkout actions are simulated.
- **Responsive navigation** — desktop navigation and mobile bottom navigation.
- **PWA foundation** — web app manifest and service worker for installability and cached assets when served in a supported environment.

## Project structure

The application lives in the `xora/` directory.

```text
.
├── README.md
├── LICENSE
├── .gitignore
└── xora/
    ├── index.html
    ├── collections.html
    ├── bespoke.html
    ├── membership.html
    ├── enterprise.html
    ├── sale.html
    ├── brands.html
    ├── styles.css
    ├── app.js
    ├── manifest.json
    ├── sw.js
    └── assets/
```

## Run locally

A local HTTP server is recommended, especially for service-worker/PWA testing.

1. Clone or download this repository.
2. Open a terminal in the repository root.
3. Start a local server:

   **Python**
   ```bash
   python -m http.server 8080
   ```

4. Open [http://localhost:8080/xora/](http://localhost:8080/xora/) in your browser.

You can also open `xora/index.html` directly for a quick visual preview, but some PWA features require localhost or HTTPS.

## Important limitations

- **No production backend:** cart, membership, and demo workflow state are browser-side.
- **No real payments:** UPI, net banking, and cash-on-delivery options do not contact a bank, payment app, or merchant.
- **No real order fulfillment:** checkout details and demo orders are not sent to a seller.
- **Fit estimates are not tailoring guarantees:** measurements should be verified by a qualified tailor before making a garment.
- **Demo data:** replace sample names, contact details, prices, offers, and business claims with verified information before public or commercial use.
- **Privacy:** do not enter real customer measurements, contact information, or payment details into this prototype.

## Before production launch

- Build a secure backend for accounts, products, inventory, orders, and customer data.
- Integrate a payment gateway server-side and verify payment callbacks before confirming orders.
- Add authentication and role-based authorization to internal operations screens.
- Validate and protect all user-submitted data; keep secrets out of browser code and Git.
- Add automated tests, accessibility checks, and cross-browser/mobile testing.
- Configure production hosting over HTTPS and review the service-worker cache/update strategy.
- Review all sample content, pricing, terms, privacy notices, and licensing before launch.

## Main pages

| Page | Purpose |
| --- | --- |
| `xora/index.html` | Storefront home |
| `xora/collections.html` | Product collections |
| `xora/bespoke.html` | Made-to-measure studio demo |
| `xora/membership.html` | Membership tier demo |
| `xora/enterprise.html` | Designer and operations portal demo |
| `xora/sale.html` | Offers and sale page |
| `xora/brands.html` | Designer sub-labels |

## Contributing

Keep changes focused, test all affected pages locally, and make sure documentation reflects actual behavior. Never commit API keys, passwords, payment secrets, or real customer data.

## License

See the repository's `LICENSE` file. Confirm that its terms and any required copyright details are correct before redistributing the project.
