# 🚀 XORA ENTERPRISE FASHION & BESPOKE ATELIER APP

## வணக்கம்! (Welcome to XORA Enterprise)

Ungaloda request-ku aetra mari, **XORA** brand oru full **Enterprise Web & Mobile App**-a create panna pattullathu.

---

## 🌟 Key Highlights (Enna Ellam Ready Panni Irukkom):

### 1. 👔 Casual & Formal for Men & Women (100% Unique Xora In-House Designs)
- Third-party brands illama, ellamea **XORA Master Designers** mulama create panna pattulla unique collections.
- Categories: Men Formal, Men Casual, Women Formal, Women Casual.

### 2. 💻 IT Professionals Special Collection (Techwear)
- Software Engineers, Tech Leads & Executives-ku 10-12 hours desk work-ku yeatha mari:
  - **4-Way Ergonomic Active Stretch**
  - **Zero-Iron Anti-Wrinkle** Bamboo micro-twill fabric
  - **Anti-Odor & Breathable**
  - Convertible Blazers with concealed pockets for earbuds & smartphone.

### 3. 🌟 Middle-Class Value Luxury (Honest Indian Pricing)
- Exorbitant designer markups illama, direct factory honest pricing:
  - Pure Egyptian-blend formal shirts starting at **₹799**
  - Festive Anarkali & Kurti sets from **₹699 to ₹1,199**
  - **Buy 2 Get 1 Free** bundles & **Zero-Cost 3-Month EMI** options.

### 4. ✂️ Signature 1-of-1 Bespoke Made-to-Measure Studio (`bespoke.html`)
- **"Customer-ku yeatha size details kuduthangana avangaluku mattum thaniya design panni kudupom":**
  - Customer avangalaoda **Height, Weight, Chest, Waist, Shoulder, Inseam & Fit style** enter pannalam.
  - **⚡ AI Smart Fit Estimator:** Tape measure illana kooda, Height & Weight vachi AI auto-calculate pannidum!
  - **Live CAD Interactive Visualizer:** Suit/Blazer silhouette, Color swatch, and Personal Embroidered Monogram (eg: `J.K.` or `XR-VIP`) real-time-la update aagum.
  - Senior Master Designer (Aisha Varman / K. Ramanathan) direct-a assign aagi, paper pattern cut panni hand-stitch panni anupuvom.

### 5. 👑 XORA Privilege Membership Club (`membership.html`)
- **Silver Explorer (Free):** 5% welcome discount.
- **Gold Club (₹999/yr):** Flat 15% OFF + IT Corporate Employees (TCS, Zoho, Infosys, Cognizant, etc.)-ku free corporate upgrade!
- **Platinum Elite (₹2,499/yr):** Flat 20% OFF + **1 Free 1-of-1 Bespoke Tailored Garment / Year**.
- **Obsidian VIP (₹4,999/yr):** Flat 25% OFF + **3 Free 1-of-1 Bespoke Tailored Outfits / Year** + Chief Designer video consultation.

### 6. 💼 Enterprise Operations & Designer Studio Portal (`enterprise.html`)
- Designers & Store Admin-ku thani dashboard:
  - Real-time **Bespoke Production Pipeline** (CAD Blueprint -> Laser Cutting -> Tailoring -> 15-Point QC -> Dispatched).
  - Single-click-la **Next Stage-ku advance panna mudiyum**.
  - **CAD Cutting Blueprint Sheet** print panni tailors-ku kudukalam.
  - Export CSV Manifest.

### 7. 📱 App & Web Dual Capability (Mobile PWA + Responsive Web)
- Phone-la open pannum pothu **Mobile App Bottom Navigation Bar** varum (Home, Shop, Bespoke, Club, Ops).
- Top-la **"📲 Install App"** button click panna Android/Windows/iOS-la standalone app-a install aagum.
- Offline support via Service Worker (`sw.js`).
- Interactive Slide-Out Shopping Bag with dynamic membership discount calculation.
- **AI Fashion Stylist Chatbot & Voice Search** included.

### 8. 🛍️ Product Images, Cart & Checkout
- Catalog cards show product-specific vector garment illustrations, INR price, member price and size choices.
- Cart supports item quantities and recalculates the member discount and checkout total.
- Checkout collects delivery details in the browser form, but does not send or store those personal details.
- **This repository is a storefront demo, not a live order/payment service.** Cash-on-delivery creates a demo order record in the current browser only; it is not sent to a seller.
- Checkout is in demo mode: UPI (GPay/PhonePe/Paytm), net banking and cash-on-delivery only simulate a selection. No UPI ID is configured, no app/bank is contacted, and no money is transferred. Demo orders are saved in the current browser only and are not sent to a seller.
- A live store needs a merchant payment-gateway account and a backend to create orders, safely handle delivery/order records, and verify payment callbacks before confirming or dispatching. Never put bank credentials, card data, PINs, OTPs or gateway secrets in browser code.

---

## 🏃 How to Run the Application:

### Option 1: Direct Double Click
Double click `index.html` inside `d:\visionx innovation\xora` folder!

### Option 2: Browser URL
Copy and paste this path in Chrome or Edge:
```
file:///d:/visionx innovation/xora/index.html
```

### Option 3: Local Server (VS Code / Live Server / PowerShell)
VS Code-la right-click `index.html` -> "Open with Live Server" or run:
```powershell
python -m http.server 8080
```
Then visit `http://localhost:8080`.

---

## 🗺️ Quick Links to All Modules:
- 🏠 **Home Page & Storefront:** [`index.html`](file:///d:/visionx%20innovation/xora/index.html)
- ✂️ **Bespoke 1-of-1 Customizer:** [`bespoke.html`](file:///d:/visionx%20innovation/xora/bespoke.html)
- 👔 **IT & Value Collections:** [`collections.html`](file:///d:/visionx%20innovation/xora/collections.html)
- 👑 **Privilege Club Memberships:** [`membership.html`](file:///d:/visionx%20innovation/xora/membership.html)
- 💼 **Enterprise Designer Dashboard:** [`enterprise.html`](file:///d:/visionx%20innovation/xora/enterprise.html)
- 🏷️ **Value Deals & Sale:** [`sale.html`](file:///d:/visionx%20innovation/xora/sale.html)
- 🎨 **Designer Houses:** [`brands.html`](file:///d:/visionx%20innovation/xora/brands.html)
