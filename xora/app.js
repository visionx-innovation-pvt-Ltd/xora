// ========================================================
// 🚀 XORA ENTERPRISE APPLICATION & BESPOKE ATELIER ENGINE
// ========================================================

// --- SAFE LOCAL STATE ---
function readStoredValue(key, fallback = null) {
  try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch (error) { return fallback; }
}
function readStoredArray(key, fallback = []) {
  try { const value = JSON.parse(readStoredValue(key, 'null')); return Array.isArray(value) ? value : fallback; } catch (error) { return fallback; }
}
function saveStoredValue(key, value) {
  try { localStorage.setItem(key, value); return true; } catch (error) { showNotification('Could not save in this browser. Check storage settings and try again.', 'error'); return false; }
}
function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll(String.fromCharCode(39), '&#39;');
}
function csvCell(value) {
  let text = String(value ?? '');
  if (/^[=+@\\-\\t\\r]/.test(text)) text = String.fromCharCode(39) + text;
  return String.fromCharCode(34) + text.replaceAll(String.fromCharCode(34), String.fromCharCode(34,34)) + String.fromCharCode(34);
}
const VALID_TIERS = ['Silver', 'Gold', 'Platinum', 'Obsidian'];
const savedTier = readStoredValue('xoraUserTier', 'Silver');
const initialTier = VALID_TIERS.includes(savedTier) ? savedTier : 'Silver';
const defaultBespokeQueue = [
  { id: 'XR-DEMO-8042', customer: 'Sample Customer A', phone: 'Not provided', garment: 'Tech Corporate Suit', measurements: { height: 178, chest: 40, waist: 34, length: 32, shoulder: 18, fit: 'Athletic Smart Desk Tapered' }, fabric: 'Italian Poly-Wool Tech Stretch', color: 'Obsidian Navy', monogram: 'SAMPLE-A', notes: 'Demo order only. No real customer details.', designer: 'Demo Designer', stage: 'Master Tailoring' },
  { id: 'XR-DEMO-8043', customer: 'Sample Customer B', phone: 'Not provided', garment: 'Executive Power Suit', measurements: { height: 165, chest: 36, waist: 29, length: 30, shoulder: 15.5, fit: 'Modern Slim Fit' }, fabric: 'Bamboo-Silk Anti-Odor Twill', color: 'Graphite Charcoal', monogram: 'SAMPLE-B', notes: 'Demo order only. No real customer details.', designer: 'Demo Designer', stage: 'Laser Precision Cutting' },
  { id: 'XR-DEMO-8044', customer: 'Sample Customer C', phone: 'Not provided', garment: 'Bespoke Shirt', measurements: { height: 172, chest: 42, waist: 36, length: 31, shoulder: 18.5, fit: 'Classic Regular Comfort' }, fabric: 'Royal Egyptian Giza Cotton', color: 'Pearl Crisp White', monogram: 'SAMPLE-C', notes: 'Demo order only. No real customer details.', designer: 'Demo Designer', stage: '15-Point Quality QC' }
];
const storedCart = readStoredArray('xoraCart').filter(item => item && typeof item === 'object' && typeof item.name === 'string' && Number.isFinite(Number(item.price)) && Number(item.price) >= 0).map(item => ({ id: String(item.id || ''), name: item.name.slice(0, 160), price: Number(item.price), meta: String(item.meta || '').slice(0, 500), size: String(item.size || '').slice(0, 30), isCustom: Boolean(item.isCustom), quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1))) }));
const XORA_STATE = { currentTier: initialTier, cart: storedCart, wishlist: readStoredArray('xoraWishlist'), bespokeQueue: readStoredArray('xoraBespokeQueue', defaultBespokeQueue).filter(order => order && typeof order === 'object' && order.measurements && typeof order.measurements === 'object').slice(0, 500) };

// --- XORA DESIGNER CATALOG ---
const XORA_CATALOG = [
  // 💻 IT PROFESSIONALS TECH-WEAR
  {
    id: "it-1",
    name: "XORA Cyber-Stretch Tech-Oxford Shirt",
    category: "it",
    gender: "men",
    ageGroup: "adult",
    type: "formal",
    price: 1699,
    originalPrice: 2499,
    fabric: "4-Way Ergonomic Stretch • Bamboo Micro-Twill",
    features: "Anti-Wrinkle, Moisture Wicking, 12H Desk Comfort",
    svgColor: "#1e293b",
    badge: "💻 IT Executive",
    badgeClass: "badge-it"
  },
  {
    id: "it-2",
    name: "XORA Boardroom Hybrid Knit Blazer",
    category: "it",
    gender: "men",
    ageGroup: "adult",
    type: "formal",
    price: 3499,
    originalPrice: 4999,
    fabric: "Tech-Poly Wool Blend with Lycra Gussets",
    features: "Concealed Earbud/Phone Pocket, Uncrushable",
    svgColor: "#0f172a",
    badge: "💻 IT Essential",
    badgeClass: "badge-it"
  },
  {
    id: "it-3",
    name: "XORA Tech-Knit 12H Desk Chinos",
    category: "it",
    gender: "men",
    ageGroup: "adult",
    type: "casual",
    price: 1899,
    originalPrice: 2699,
    fabric: "Wrinkle-Free Flex-Cotton Twill",
    features: "Expandable Smart Waistband, Liquid Repellent",
    svgColor: "#334155",
    badge: "💻 Desk Ergonomics",
    badgeClass: "badge-it"
  },
  {
    id: "it-4",
    name: "XORA Women's Executive Power Trouser Suit",
    category: "it",
    gender: "women",
    ageGroup: "adult",
    type: "formal",
    price: 3999,
    originalPrice: 5999,
    fabric: "Structured Breathable Tech-Modal",
    features: "Tailored Hourglass Cut, Crease-Free Travel",
    svgColor: "#1e1b4b",
    badge: "💻 Women Tech Lead",
    badgeClass: "badge-it"
  },
  {
    id: "it-5",
    name: "XORA Bamboo-Silk Anti-Odor Desk Blouse",
    category: "it",
    gender: "women",
    ageGroup: "adult",
    type: "formal",
    price: 1299,
    originalPrice: 1999,
    fabric: "Pure Organic Bamboo Micro-Silk",
    features: "Ultra-Soft Breathability, Zero-Iron",
    svgColor: "#312e81",
    badge: "💻 IT Smart Casual",
    badgeClass: "badge-it"
  },
  {
    id: "it-6",
    name: "XORA Pleated Ergonomic Tech Culottes",
    category: "it",
    gender: "women",
    ageGroup: "adult",
    type: "casual",
    price: 1499,
    originalPrice: 2199,
    fabric: "Comfort Stretch Poly-Viscose",
    features: "All-Day Meeting Ease, Deep Functional Pockets",
    svgColor: "#18181b",
    badge: "💻 Tech Workplace",
    badgeClass: "badge-it"
  },

  // 🌟 MIDDLE-CLASS SMART VALUE LUXURY (HONEST INDIAN PRICING)
  {
    id: "val-1",
    name: "XORA Pure Egyptian-Blend Daily Shirt",
    category: "value",
    gender: "men",
    ageGroup: "adult",
    type: "formal",
    price: 799,
    originalPrice: 1499,
    fabric: "100% Long-Staple Cotton",
    features: "Color-Lock 100 Washes, Master Tailor Cut",
    svgColor: "#0284c7",
    badge: "🌟 Value Luxury ₹799",
    badgeClass: "badge-value"
  },
  {
    id: "val-2",
    name: "XORA Classic Pleated Formal Trousers",
    category: "value",
    gender: "men",
    ageGroup: "adult",
    type: "formal",
    price: 899,
    originalPrice: 1599,
    fabric: "Durable Poly-Cotton Twill",
    features: "Sturdy Belt Loops, Double Stitch Reinforcement",
    svgColor: "#27272a",
    badge: "🌟 Value Luxury ₹899",
    badgeClass: "badge-value"
  },
  {
    id: "val-3",
    name: "XORA Silk-Touch Anarkali Kurti Set",
    category: "value",
    gender: "women",
    ageGroup: "adult",
    type: "formal",
    price: 1199,
    originalPrice: 2299,
    fabric: "Artisan Poly-Silk with Zari Borders",
    features: "Festive & Office Versatility, Hand-Embroidered Yoke",
    svgColor: "#831843",
    badge: "🌟 Festive Value ₹1,199",
    badgeClass: "badge-value"
  },
  {
    id: "val-4",
    name: "XORA Daily Relaxed Bio-Wash Denims",
    category: "value",
    gender: "men",
    ageGroup: "adult",
    type: "casual",
    price: 999,
    originalPrice: 1899,
    fabric: "12oz Stretch Ring-Spun Cotton Denim",
    features: "Fade-Resistant Indigo, Comfort Waist",
    svgColor: "#1d4ed8",
    badge: "🌟 Everyday Value",
    badgeClass: "badge-value"
  },
  {
    id: "val-5",
    name: "XORA Hand-Block Printed Designer Kurta",
    category: "value",
    gender: "women",
    ageGroup: "adult",
    type: "casual",
    price: 699,
    originalPrice: 1299,
    fabric: "100% Breathable Jaipur Cotton",
    features: "Cooling All-Day Comfort, Eco-Friendly Dyes",
    svgColor: "#047857",
    badge: "🌟 Budget Essential ₹699",
    badgeClass: "badge-value"
  },
  {
    id: "val-6",
    name: "XORA Festive Jacquard Bundi Jacket",
    category: "value",
    gender: "men",
    ageGroup: "adult",
    type: "formal",
    price: 1399,
    originalPrice: 2499,
    fabric: "Woven Silk-Blend Jacquard with Mandarin Collar",
    features: "Celebration Wear, Antique Brass Buttons",
    svgColor: "#b45309",
    badge: "🌟 Celebration ₹1,399",
    badgeClass: "badge-value"
  },
  {
    id: "junior-kid-1",
    name: "XORA Junior Cotton Everyday Shirt",
    category: "value",
    gender: "boys",
    ageGroup: "kids",
    type: "casual",
    price: 599,
    originalPrice: 899,
    fabric: "Soft Breathable Cotton",
    features: "Easy-Care Fabric, Comfortable Everyday Fit",
    svgColor: "#0891b2",
    badge: "🌟 Kids Everyday",
    badgeClass: "badge-value"
  },
  {
    id: "junior-kid-2",
    name: "XORA Junior Printed Cotton Dress",
    category: "value",
    gender: "girls",
    ageGroup: "kids",
    type: "casual",
    price: 699,
    originalPrice: 999,
    fabric: "Lightweight Cotton Voile",
    features: "Soft Lining, Play-Friendly Comfort",
    svgColor: "#db2777",
    badge: "🌟 Kids Everyday",
    badgeClass: "badge-value"
  },
  {
    id: "junior-teen-1",
    name: "XORA Teen Stretch Denim",
    category: "value",
    gender: "boys",
    ageGroup: "teens",
    type: "casual",
    price: 899,
    originalPrice: 1299,
    fabric: "Stretch Ring-Spun Cotton Denim",
    features: "Flexible Movement, Durable Everyday Finish",
    svgColor: "#2563eb",
    badge: "🌟 Teen Essential",
    badgeClass: "badge-value"
  },
  {
    id: "junior-teen-2",
    name: "XORA Teen Printed Kurti",
    category: "value",
    gender: "girls",
    ageGroup: "teens",
    type: "casual",
    price: 799,
    originalPrice: 1199,
    fabric: "Breathable Cotton Blend",
    features: "Comfort Fit, Colorfast Everyday Print",
    svgColor: "#9333ea",
    badge: "🌟 Teen Essential",
    badgeClass: "badge-value"
  }
];

// --- INITIALIZATION ---
window.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initTheme();
  initPWA();
  initNavTierBadge();
  initCartListeners();
  renderCatalogProducts();
  initBespokeCustomizer();
  initEnterprisePortal();
  initVoiceAndSearch();
  initChatbot();
});

// --- LOADER LOGIC ---
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      showNotification("Welcome to XORA Atelier & Techwear 👔", "success");
    }, 400);
  }, 1200);
}

// --- NOTIFICATION SYSTEM ---
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">×</button>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.classList.add("show"), 50);

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  });

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// --- MEMBERSHIP PRIVILEGE ENGINE ---
function initNavTierBadge() {
  const badge = document.getElementById("nav-tier-name");
  const current = XORA_STATE.currentTier;
  const discounts = { Silver: 5, Gold: 15, Platinum: 20, Obsidian: 25 };
  if (badge) {
    badge.textContent = `👑 ${current} (${discounts[current]}% OFF)`;
  }
  const statusIndicator = document.getElementById("active-tier-status-text");
  if (statusIndicator) {
    statusIndicator.textContent = `${current.toUpperCase()} PRIVILEGE ACTIVE (${discounts[current]}% OFF)`;
  }
  updateTierButtons(current);
}

function activateTier(tierName) {
  XORA_STATE.currentTier = tierName;
  saveStoredValue("xoraUserTier", tierName);
  initNavTierBadge();
  renderCart();
  const discounts = { Silver: 5, Gold: 15, Platinum: 20, Obsidian: 25 };
  showNotification(`🎉 ${tierName} Tier activated! You now receive ${discounts[tierName]}% OFF site-wide!`, "success");
}

function updateTierButtons(current) {
  document.querySelectorAll(".tier-select-btn").forEach(btn => {
    if (btn.id === `btn-tier-${current}`) {
      btn.textContent = "Active Tier ✓";
      btn.classList.add("active");
    } else if (btn.id) {
      btn.textContent = btn.id.replace("btn-tier-", "Upgrade to ");
      btn.classList.remove("active");
    }
  });
}

// IT Corporate Tie-Up Demo: company names alone do not verify employment.
const verifyBtn = document.getElementById('verify-it-corp-btn');
if (verifyBtn) {
  verifyBtn.addEventListener('click', () => {
    const input = document.getElementById('it-company-input');
    const value = input ? input.value.trim() : '';
    if (!value) { showNotification('Enter your company name. This demo cannot verify employment.', 'error'); return; }
    showNotification('Corporate verification is not connected yet. No membership tier was changed.', 'info');
  });
}

// --- PRODUCT CATALOG RENDERING & FILTERING ---
function renderCatalogProducts() {
  const mainGrid = document.getElementById("main-product-grid");
  const collectionsGrid = document.getElementById("collections-product-grid");
  const targetGrid = mainGrid || collectionsGrid;
  if (!targetGrid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const availableFilters = new Set(
    Array.from(document.querySelectorAll(".catalog-filters .filter-btn"), btn => btn.dataset.filter)
  );
  const requestedCategory = urlParams.get("cat") || "all";
  const selectedCategory = availableFilters.has(requestedCategory) ? requestedCategory : "all";
  const controls = {
    category: selectedCategory,
    gender: "all",
    ageGroup: "all",
    search: ""
  };
  const searchInput = document.getElementById("catalog-search-input");
  const genderSelect = document.getElementById("catalog-gender-filter");
  const ageSelect = document.getElementById("catalog-age-filter");

  document.querySelectorAll(".catalog-filters .filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === selectedCategory);
  });
  const updateCatalog = () => renderFiltered(controls, targetGrid);
  updateCatalog();

  // Filter Buttons
  document.querySelectorAll(".catalog-filters .filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".catalog-filters .filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      controls.category = btn.dataset.filter;
      updateCatalog();
      targetGrid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      controls.search = e.target.value.trim().toLowerCase();
      updateCatalog();
    });
  }
  if (genderSelect) {
    genderSelect.addEventListener("change", () => {
      controls.gender = genderSelect.value;
      updateCatalog();
    });
  }
  if (ageSelect) {
    ageSelect.addEventListener("change", () => {
      controls.ageGroup = ageSelect.value;
      updateCatalog();
    });
  }
}

function renderFiltered(controls, container) {
  const list = XORA_CATALOG.filter(product => {
    const { category, gender, ageGroup, search } = controls;
    const categoryMatches = category === "all" ||
      product.category === category ||
      product.gender === category ||
      (category === "men-formal" && product.gender === "men" && product.type === "formal") ||
      (category === "men-casual" && product.gender === "men" && product.type === "casual") ||
      (category === "women-formal" && product.gender === "women" && product.type === "formal") ||
      (category === "women-casual" && product.gender === "women" && product.type === "casual");
    const genderMatches = gender === "all" || product.gender === gender;
    const ageMatches = ageGroup === "all" || product.ageGroup === ageGroup;
    const searchMatches = !search || [product.name, product.fabric, product.features]
      .some(value => value.toLowerCase().includes(search));
    return categoryMatches && genderMatches && ageMatches && searchMatches;
  });
  const resultCount = document.getElementById("catalog-results-count");
  if (resultCount) resultCount.textContent = `Showing ${list.length} of ${XORA_CATALOG.length} products`;
  renderList(list, container);
}

function renderList(products, container) {
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 3rem;">No products found matching your filter.</div>`;
    return;
  }

  const currentTier = XORA_STATE.currentTier;
  const discounts = { Silver: 0.05, Gold: 0.15, Platinum: 0.20, Obsidian: 0.25 };
  const discountRate = discounts[currentTier] || 0.05;

  products.forEach(p => {
    const memberPrice = Math.round(p.price * (1 - discountRate));
    const card = document.createElement("div");
    card.className = "product-card scroll-reveal";
    const sizes = p.ageGroup === "kids"
      ? ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"]
      : p.ageGroup === "teens"
        ? ["XS", "S", "M", "L"]
        : ["XS", "S", "M", "L", "XL", "XXL"];
    card.innerHTML = `
      <div class="card-badge">
        <span class="badge-tag ${p.badgeClass}">${p.badge}</span>
      </div>
      <div class="product-card-visual">
        ${getGarmentIllustration(p)}
        <div class="card-actions-overlay">
          <button class="icon-action-btn" title="Add to Bag" onclick="addToCart('${p.id}', null, document.getElementById('size-${p.id}').value)">🛒</button>
          <a href="bespoke.html" class="icon-action-btn" title="Customize Made-to-Measure" style="text-decoration:none;">✂️</a>
        </div>
      </div>
      <div class="product-details">
        <div class="product-title">${p.name}</div>
        <div class="product-fabric-note">${p.gender.charAt(0).toUpperCase() + p.gender.slice(1)} · ${p.ageGroup === "kids" ? "Kids (3–12)" : p.ageGroup === "teens" ? "Teens (13–17)" : "Adults (18+)"}</div>
        <div class="product-fabric-note">${p.fabric}</div>
        <div style="font-size: 0.75rem; color: #888; margin-bottom: 0.5rem;">✦ ${p.features}</div>
        <label class="product-size-picker" for="size-${p.id}">Size
          <select id="size-${p.id}" aria-label="Choose size for ${p.name}">
            ${sizes.map(size => `<option value="${size}">${size}</option>`).join("")}
          </select>
        </label>
        <div class="product-pricing-row">
          <div>
            <span class="price-current">₹${p.price.toLocaleString("en-IN")}</span>
            <span class="price-original">₹${p.originalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div class="member-price-hint">₹${memberPrice.toLocaleString("en-IN")} (${currentTier})</div>
        </div>
        <button class="product-add-btn" type="button" onclick="addToCart('${p.id}', null, document.getElementById('size-${p.id}').value)">Add to bag · ₹${p.price.toLocaleString("en-IN")}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function getGarmentIllustration(product) {
  const name = product.name.toLowerCase();
  let garment;
  if (/trouser|chino|culotte|denim/.test(name)) {
    garment = `<path d="M48 38h64l-5 139-25 3-9-85-9 85-25-3z" fill="url(#fabric-${product.id})" stroke="#dbeafe" stroke-opacity=".55" stroke-width="2"/><path d="M80 40v54m-25-39h50M57 51l-7 28m53-28 7 28" stroke="#fff" stroke-opacity=".42" stroke-width="2"/>`;
  } else if (/kurti|kurta|dress|anarkali/.test(name)) {
    garment = `<path d="M64 30 80 42l16-12 16 20-12 22 23 103q-43 16-86 0L60 72 48 50z" fill="url(#fabric-${product.id})" stroke="#fce7f3" stroke-opacity=".65" stroke-width="2"/><path d="m64 30 16 34 16-34M80 64v80m-19-62h38" stroke="#fff" stroke-opacity=".48" stroke-width="2"/><circle cx="80" cy="82" r="2" fill="#ffd700"/><circle cx="80" cy="94" r="2" fill="#ffd700"/>`;
  } else if (/blazer|suit|jacket/.test(name)) {
    garment = `<path d="m58 27 22 15 22-15 29 20-14 37-10-9-4 90H57l-4-90-10 9-14-37z" fill="url(#fabric-${product.id})" stroke="#dbeafe" stroke-opacity=".65" stroke-width="2"/><path d="m58 27 22 45 22-45M80 72v93m-24-62h16m16 0h16" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><circle cx="86" cy="112" r="2" fill="#ffd700"/><circle cx="86" cy="129" r="2" fill="#ffd700"/>`;
  } else {
    garment = `<path d="m57 29 23 14 23-14 30 22-14 29-12-9-3 94H56l-3-94-12 9-14-29z" fill="url(#fabric-${product.id})" stroke="#dbeafe" stroke-opacity=".65" stroke-width="2"/><path d="m57 29 23 47 23-47M80 76v89m-23-71h46" stroke="#fff" stroke-opacity=".45" stroke-width="2"/><circle cx="86" cy="105" r="2" fill="#ffd700"/><circle cx="86" cy="120" r="2" fill="#ffd700"/>`;
  }
  return `<svg class="garment-svg-preview" role="img" aria-label="${product.name} product illustration" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fabric-${product.id}" x1="30" y1="30" x2="130" y2="170" gradientUnits="userSpaceOnUse"><stop stop-color="${product.svgColor}"/><stop offset="1" stop-color="#08080c"/></linearGradient></defs><ellipse cx="80" cy="177" rx="51" ry="8" fill="#000" fill-opacity=".35"/>${garment}</svg>`;
}

// --- CART & BAG MANAGEMENT ---
function initCartListeners() {
  const openBtn = document.getElementById("open-cart-btn");
  const closeBtn = document.getElementById("close-cart-btn");
  const backdrop = document.getElementById("cart-backdrop");

  if (openBtn) openBtn.addEventListener("click", openCart);
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  if (backdrop) backdrop.addEventListener("click", closeCart);

  initCheckout();
  renderCart();
}

function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  if (drawer) drawer.classList.add("active");
  if (backdrop) backdrop.classList.add("active");
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
}

function addToCart(productId, customItem = null, size = "") {
  if (customItem) {
    XORA_STATE.cart.push({ ...customItem, quantity: 1 });
  } else {
    const product = XORA_CATALOG.find(p => p.id === productId);
    if (!product) return;
    XORA_STATE.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      meta: `${product.fabric} • ${size || "Standard"} size`,
      size,
      isCustom: false,
      quantity: 1
    });
  }
  saveStoredValue("xoraCart", JSON.stringify(XORA_STATE.cart));
  renderCart();
  openCart();
  showNotification("Added to your Shopping Bag 🛍️", "success");
}

function removeFromCart(index) {
  XORA_STATE.cart.splice(index, 1);
  saveStoredValue("xoraCart", JSON.stringify(XORA_STATE.cart));
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items-container");
  const counter = document.getElementById("cart-counter");
  const drawerCounter = document.getElementById("cart-drawer-count");
  const subtotalEl = document.getElementById("cart-subtotal");
  const discountLabelEl = document.getElementById("cart-discount-label");
  const discountAmountEl = document.getElementById("cart-discount-amount");
  const totalEl = document.getElementById("cart-final-total");

  const items = XORA_STATE.cart;
  const itemCount = items.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  if (counter) counter.textContent = itemCount;
  if (drawerCounter) drawerCounter.textContent = itemCount;

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: #888; margin-top: 3rem;">Your shopping bag is empty.</div>`;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (discountAmountEl) discountAmountEl.textContent = "- ₹0";
    if (totalEl) totalEl.textContent = "₹0";
    return;
  }

  container.innerHTML = "";
  let subtotal = 0;

  items.forEach((item, index) => {
    const quantity = Math.max(1, Number(item.quantity) || 1);
    subtotal += item.price * quantity;
    const product = XORA_CATALOG.find(entry => entry.id === item.id);
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <div class="cart-item-thumb">
        ${product ? getGarmentIllustration(product) : `<span style="font-size: 1.5rem;">✂️</span>`}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-meta">${escapeHtml(item.meta)}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString("en-IN")}</div>
        <div class="cart-quantity-control" aria-label="Quantity controls">
          <button type="button" aria-label="Decrease quantity" onclick="changeCartQuantity(${index}, -1)">−</button>
          <span>${quantity}</span>
          <button type="button" aria-label="Increase quantity" onclick="changeCartQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove">&times;</button>
    `;
    container.appendChild(row);
  });

  const discounts = { Silver: 0.05, Gold: 0.15, Platinum: 0.20, Obsidian: 0.25 };
  const rate = discounts[XORA_STATE.currentTier] || 0.05;
  const discountVal = Math.round(subtotal * rate);
  const finalTotal = subtotal - discountVal;
  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  const checkoutDiscount = document.getElementById("checkout-discount");
  const checkoutTotal = document.getElementById("checkout-total");

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  if (discountLabelEl) discountLabelEl.textContent = `${XORA_STATE.currentTier} Member Discount (${Math.round(rate * 100)}%):`;
  if (discountAmountEl) discountAmountEl.textContent = `- ₹${discountVal.toLocaleString("en-IN")}`;
  if (totalEl) totalEl.textContent = `₹${finalTotal.toLocaleString("en-IN")}`;
  if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  if (checkoutDiscount) checkoutDiscount.textContent = `- ₹${discountVal.toLocaleString("en-IN")}`;
  if (checkoutTotal) checkoutTotal.textContent = `₹${finalTotal.toLocaleString("en-IN")}`;
}

function proceedToCheckout() {
  if (XORA_STATE.cart.length === 0) {
    showNotification("Your bag is empty! Add an item first.", "error");
    return;
  }
  const checkout = document.getElementById("checkout-dialog");
  if (!checkout) {
    showNotification("Checkout is unavailable on this page. Please use the Home or Collections page.", "error");
    return;
  }
  renderCart();
  checkout.showModal();
}

function changeCartQuantity(index, change) {
  const item = XORA_STATE.cart[index];
  if (!item) return;
  item.quantity = Math.max(1, (Number(item.quantity) || 1) + change);
  saveStoredValue("xoraCart", JSON.stringify(XORA_STATE.cart));
  renderCart();
}

function initCheckout() {
  if (document.getElementById("checkout-dialog")) return;
  const dialog = document.createElement("dialog");
  dialog.id = "checkout-dialog";
  dialog.className = "checkout-dialog";
  dialog.innerHTML = `
    <div class="checkout-dialog-header">
      <div><span class="badge-tag badge-designer">CHECKOUT</span><h2>Delivery & Payment</h2></div>
      <button type="button" class="checkout-close" aria-label="Close checkout">&times;</button>
    </div>
    <p class="checkout-demo-notice">Storefront demo: real orders and payments are not connected yet. Do not enter card details, PINs or OTPs.</p>
    <form id="checkout-form">
      <div class="checkout-fields">
        <label>Full name<input name="name" autocomplete="name" required maxlength="80"></label>
        <label>Mobile number<input name="phone" type="tel" inputmode="numeric" autocomplete="tel" pattern="[6-9][0-9]{9}" title="Enter a valid 10-digit Indian mobile number" required></label>
        <label class="checkout-wide">Email (optional)<input name="email" type="email" autocomplete="email" maxlength="120"></label>
        <label class="checkout-wide">Delivery address<textarea name="address" autocomplete="street-address" rows="3" maxlength="250" required></textarea></label>
        <label>City<input name="city" autocomplete="address-level2" maxlength="60" required></label>
        <label>State<input name="state" autocomplete="address-level1" maxlength="60" required></label>
        <label>PIN code<input name="pincode" inputmode="numeric" autocomplete="postal-code" pattern="[1-9][0-9]{5}" title="Enter a valid 6-digit PIN code" required></label>
      </div>
      <fieldset class="checkout-payment-options">
        <legend>Choose payment method</legend>
        <label class="payment-option"><input type="radio" name="payment" value="upi-demo" required><span><strong>UPI (demo)</strong><small>Simulated GPay · PhonePe · Paytm</small></span><span class="payment-state">Demo</span></label>
        <label class="payment-option"><input type="radio" name="payment" value="bank-demo"><span><strong>Net banking (demo)</strong><small>Simulated bank payment</small></span><span class="payment-state">Demo</span></label>
        <label class="payment-option"><input type="radio" name="payment" value="cod"><span><strong>Cash on delivery (demo)</strong><small>Demo only; order is not sent to a store</small></span></label>
      </fieldset>
      <p id="checkout-payment-note" class="checkout-payment-note" aria-live="polite"></p>
      <div class="checkout-total-box">
        <div><span>Subtotal</span><strong id="checkout-subtotal">₹0</strong></div>
        <div><span>Member discount</span><strong id="checkout-discount">- ₹0</strong></div>
        <div class="checkout-grand-total"><span>Payable total</span><strong id="checkout-total">₹0</strong></div>
      </div>
      <button type="submit" class="checkout-submit">Continue</button>
    </form>
  `;
  document.body.appendChild(dialog);

  const paymentNote = dialog.querySelector("#checkout-payment-note");
  paymentNote.textContent = "Demo checkout only: no UPI app or bank is contacted, no money is transferred, and this order is not sent to a store.";

  dialog.querySelector(".checkout-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector("#checkout-form").addEventListener("submit", handleCheckoutSubmit);
  dialog.querySelectorAll('input[name="payment"]').forEach(input => {
    input.addEventListener("change", () => {
      const method = input.value === "upi-demo"
        ? "UPI (GPay/PhonePe/Paytm)"
        : input.value === "bank-demo"
          ? "net banking"
          : "cash on delivery";
      paymentNote.textContent = `Demo simulation selected: ${method}. No payment is made, and this order is not sent to a store.`;
    });
  });
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const method = formData.get("payment");
  const orderId = `XR-${Date.now().toString(36).toUpperCase()}`;
  const subtotal = XORA_STATE.cart.reduce((total, item) => total + item.price * (Number(item.quantity) || 1), 0);
  const discounts = { Silver: 0.05, Gold: 0.15, Platinum: 0.20, Obsidian: 0.25 };
  const rate = discounts[XORA_STATE.currentTier] || 0.05;
  const amount = subtotal - Math.round(subtotal * rate);
  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    status: "demo-only",
    paymentMethod: method,
    paymentSimulation: true,
    amount,
    currency: "INR",
    items: XORA_STATE.cart.map(item => ({
      id: item.id,
      name: item.name,
      size: item.size || "",
      quantity: Number(item.quantity) || 1,
      unitPrice: item.price
    }))
  };

  if (!["upi-demo", "bank-demo", "cod"].includes(method)) {
    showNotification("Please choose an available payment method.", "error");
    return;
  }

  try {
    const orders = JSON.parse(localStorage.getItem("xoraDemoOrders") || "[]");
    orders.push(order);
    localStorage.setItem("xoraDemoOrders", JSON.stringify(orders));
  } catch (error) {
    showNotification("Could not save the demo order. Please try again.", "error");
    return;
  }
  XORA_STATE.cart = [];
  localStorage.setItem("xoraCart", JSON.stringify([]));
  renderCart();
  document.getElementById("checkout-dialog").close();
  closeCart();
  showNotification(`Demo order ${orderId} saved on this browser only. No payment was made and it was not sent to a store.`, "info");
}

// --- ✂️ BESPOKE 1-OF-1 CUSTOM DESIGN STUDIO ---
function initBespokeCustomizer() {
  const container = document.getElementById("visualizer-container");
  if (!container) return;

  let currentType = "Men's Tech Corporate Suit";
  let currentPrice = 4999;
  let currentFabric = "Italian Poly-Wool Tech Stretch";
  let currentColor = "#0f172a";
  let currentColorName = "Obsidian Navy";
  let currentMonogram = "XR • BESPOKE";

  // Garment silhouette selection
  document.querySelectorAll("#garment-type-options .option-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#garment-type-options .option-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentType = pill.dataset.name;
      currentPrice = parseInt(pill.dataset.price);
      document.getElementById("spec-garment-type").textContent = currentType;
      document.getElementById("bespoke-price-display").textContent = `₹${currentPrice.toLocaleString("en-IN")}`;
      showNotification(`Selected: ${currentType}`, "info");
    });
  });

  // Fabric selection
  document.querySelectorAll("#fabric-options .option-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#fabric-options .option-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFabric = pill.dataset.fabric;
      document.getElementById("spec-fabric").textContent = currentFabric;
    });
  });

  // Color Swatch Selection
  document.querySelectorAll("#color-swatches .color-swatch-circle").forEach(swatch => {
    swatch.addEventListener("click", () => {
      document.querySelectorAll("#color-swatches .color-swatch-circle").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      currentColor = swatch.dataset.color;
      currentColorName = swatch.dataset.name;
      
      const garmentBody = document.getElementById("svg-garment-body");
      if (garmentBody) garmentBody.setAttribute("fill", currentColor);
      document.getElementById("spec-color").textContent = `${currentColorName} (${currentColor})`;
    });
  });

  // Monogram Input
  const monogramInput = document.getElementById("bespoke-monogram-input");
  if (monogramInput) {
    monogramInput.addEventListener("input", (e) => {
      currentMonogram = e.target.value.toUpperCase() || "XR • BESPOKE";
      const previewTag = document.getElementById("preview-monogram-tag");
      const specMonogram = document.getElementById("spec-monogram");
      if (previewTag) previewTag.textContent = currentMonogram;
      if (specMonogram) specMonogram.textContent = currentMonogram;
    });
  }

  // AI Smart Body Fit Estimator
  const aiBtn = document.getElementById("run-ai-fit-btn");
  if (aiBtn) {
    aiBtn.addEventListener("click", () => {
      const h = parseFloat(document.getElementById("meas-height").value) || 175;
      const w = parseFloat(document.getElementById("meas-weight").value) || 70;

      // Smart Anthropometric Approximation Algorithm
      const chestEst = Math.round(w * 0.52 + 4);
      const waistEst = Math.round(w * 0.44 + 3);
      const shoulderEst = (h * 0.103).toFixed(1);
      const lengthEst = Math.round(h * 0.45 - 46);

      document.getElementById("meas-chest").value = chestEst;
      document.getElementById("meas-waist").value = waistEst;
      document.getElementById("meas-shoulder").value = shoulderEst;
      document.getElementById("meas-length").value = lengthEst;

      showNotification(`⚡ AI Calculated Tailor Metrics: Chest ${chestEst}", Waist ${waistEst}", Shoulder ${shoulderEst}"`, "success");
    });
  }

  // Fit select change
  const fitSelect = document.getElementById("meas-fit-preference");
  if (fitSelect) {
    fitSelect.addEventListener("change", (e) => {
      document.getElementById("spec-fit").textContent = e.target.value;
    });
  }

  // Submit Bespoke Commission
  const submitBtn = document.getElementById("submit-bespoke-order-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const height = document.getElementById("meas-height").value;
      const chest = document.getElementById("meas-chest").value;
      const waist = document.getElementById("meas-waist").value;
      const length = document.getElementById("meas-length").value;
      const shoulder = document.getElementById("meas-shoulder").value;
      const fit = fitSelect ? fitSelect.value : "Athletic Smart Desk Tapered";
      const notes = document.getElementById("bespoke-designer-notes") ? document.getElementById("bespoke-designer-notes").value : "N/A";

      const orderId = `XR-BESPOKE-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCommission = {
        id: orderId,
        customer: "Client (" + XORA_STATE.currentTier + " Member)",
        phone: "Not provided",
        garment: currentType,
        measurements: { height, chest, waist, length, shoulder, fit },
        fabric: currentFabric,
        color: currentColorName,
        monogram: currentMonogram,
        notes: notes || "1-of-1 Tailored commission",
        designer: "Aisha Varman",
        stage: "CAD Blueprint Approved"
      };

      XORA_STATE.bespokeQueue.unshift(newCommission);
      saveStoredValue("xoraBespokeQueue", JSON.stringify(XORA_STATE.bespokeQueue));

      // Add to cart with custom meta
      addToCart(null, {
        id: orderId,
        name: `Bespoke 1-of-1: ${currentType}`,
        price: currentPrice,
        meta: `Chest ${chest}" | Waist ${waist}" | Monogram: ${currentMonogram} | Fabric: ${currentFabric}`,
        isCustom: true
      });

      showNotification(`✂️ Bespoke commission #${orderId} submitted! Assigned to Master Couturier Aisha Varman.`, "success");
    });
  }
}

// --- 💼 ENTERPRISE PORTAL LOGIC ---
function initEnterprisePortal() {
  const tbody = document.getElementById("enterprise-queue-tbody");
  if (!tbody) return;
  renderEnterpriseQueue();
}

function renderEnterpriseQueue() {
  const tbody = document.getElementById("enterprise-queue-tbody");
  if (!tbody) return;

  const queue = XORA_STATE.bespokeQueue;
  const countEl = document.getElementById("kpi-bespoke-count");
  if (countEl) countEl.textContent = queue.length;

  tbody.innerHTML = "";
  queue.forEach((order, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="color:var(--accent-color);">${escapeHtml(order.id)}</strong></td>
      <td>
        <div><strong>${escapeHtml(order.customer)}</strong></div>
        <div style="font-size:0.75rem; color:#888;">${escapeHtml(order.phone)}</div>
      </td>
      <td>${escapeHtml(order.garment)} <br><small style="color:#aaa;">${escapeHtml(order.fabric)} (${escapeHtml(order.color)})</small></td>
      <td style="font-family:monospace; font-size:0.8rem;">
        H:${order.measurements.height}cm | C:${order.measurements.chest}" | W:${order.measurements.waist}" | L:${order.measurements.length}"
      </td>
      <td>
        <span style="color:#ffd700; font-weight:600;">[${escapeHtml(order.monogram)}]</span><br>
        <small style="color:#aaa;">${escapeHtml(order.notes)}</small>
      </td>
      <td><strong style="color:#fff;">${escapeHtml(order.designer)}</strong></td>
      <td><span class="status-pill status-tailoring" id="stage-badge-${index}">${escapeHtml(order.stage)}</span></td>
      <td>
        <button class="filter-btn" style="padding:4px 8px; font-size:0.75rem;" onclick="advanceStage(${index})">Next Stage ➔</button>
        <button class="filter-btn" style="padding:4px 8px; font-size:0.75rem; margin-top:4px;" onclick="viewCuttingSheet(${index})">CAD Sheet 📄</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function advanceStage(index) {
  const stages = [
    "CAD Blueprint Approved",
    "Laser Precision Cutting",
    "Master Tailoring",
    "15-Point Quality QC",
    "Dispatched to Customer"
  ];
  const order = XORA_STATE.bespokeQueue[index];
  const currIdx = stages.indexOf(order.stage);
  if (currIdx < stages.length - 1) {
    order.stage = stages[currIdx + 1];
  } else {
    order.stage = stages[0];
  }
  saveStoredValue("xoraBespokeQueue", JSON.stringify(XORA_STATE.bespokeQueue));
  renderEnterpriseQueue();
  showNotification(`Order ${escapeHtml(order.id)} moved to: ${escapeHtml(order.stage)}`, "info");
}

function viewCuttingSheet(index) {
  const order = XORA_STATE.bespokeQueue[index];
  const modal = document.getElementById("cutting-sheet-modal");
  const title = document.getElementById("modal-order-title");
  const details = document.getElementById("modal-cutting-details");
  if (!modal || !details) return;

  title.textContent = `${escapeHtml(order.id)} • CUTTING BLUEPRINT`;
  details.innerHTML = `
    <strong>CUSTOMER:</strong> ${escapeHtml(order.customer)} (${escapeHtml(order.phone)})<br>
    <strong>GARMENT:</strong> ${escapeHtml(order.garment)}<br>
    <strong>FABRIC:</strong> ${escapeHtml(order.fabric)} (${escapeHtml(order.color)})<br>
    ---------------------------------------------<br>
    <strong>ANTHROPOMETRIC MEASUREMENTS:</strong><br>
    - Total Height: ${order.measurements.height} cm<br>
    - Chest / Bust Circumference: ${order.measurements.chest} inches<br>
    - Natural Waistline: ${order.measurements.waist} inches<br>
    - Inseam / Finished Length: ${order.measurements.length} inches<br>
    - Across Shoulder Width: ${order.measurements.shoulder || 18} inches<br>
    - Silhouette Cut: ${escapeHtml(order.measurements.fit)}<br>
    ---------------------------------------------<br>
    <strong>EMBROIDERY MONOGRAM:</strong> [ ${escapeHtml(order.monogram)} ] in Metallic Thread<br>
    <strong>DESIGNER INSTRUCTIONS:</strong> ${escapeHtml(order.notes)}<br>
    <strong>ASSIGNED CHIEF COUTURIER:</strong> ${escapeHtml(order.designer)}<br>
    <strong>PRODUCTION STATUS:</strong> ${escapeHtml(order.stage)}
  `;
  modal.classList.add("active");
}

function closeCuttingModal() {
  const modal = document.getElementById("cutting-sheet-modal");
  if (modal) modal.classList.remove("active");
}

function exportCuttingManifest() {
  const queue = XORA_STATE.bespokeQueue;
  const rows = [['Order ID', 'Customer', 'Phone', 'Garment', 'Chest', 'Waist', 'Length', 'Monogram', 'Stage']];
  queue.forEach(order => rows.push([order.id, order.customer, order.phone, order.garment, order.measurements?.chest, order.measurements?.waist, order.measurements?.length, order.monogram, order.stage]));
  const csv = rows.map(row => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([String.fromCharCode(0xFEFF), csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'XORA_BESPOKE_MANIFEST_' + Date.now() + '.csv';
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  showNotification('Exported demo cutting manifest CSV.', 'success');
}

// --- PWA APPLICATION SUPPORT ---
let deferredPrompt;
function initPWA() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = document.getElementById("pwa-install-banner");
    if (banner) banner.style.display = "flex";
  });

  const installBtn = document.getElementById("install-app-btn");
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          showNotification("📱 XORA App installed successfully!", "success");
        }
        deferredPrompt = null;
      } else {
        showNotification("📱 To install on iOS/Android: Tap Share -> Add to Home Screen!", "info");
      }
    });
  }

  const closeBanner = document.getElementById("close-pwa-banner");
  if (closeBanner) {
    closeBanner.addEventListener("click", () => {
      const banner = document.getElementById("pwa-install-banner");
      if (banner) banner.style.display = "none";
    });
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(err => console.log(err));
  }
}

// --- VOICE & SEARCH ---
function initVoiceAndSearch() {
  let recognition;
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const query = event.results[0][0].transcript;
      showNotification(`🎤 Voice Search: "${query}"`, "info");
      const searchInput = document.getElementById("catalog-search-input");
      if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event("input"));
      }
    };
  }

  // Voice button in nav if exists
  const navIcons = document.querySelector(".nav-icons");
  if (navIcons && recognition && !document.querySelector(".voice-search-btn")) {
    const voiceBtn = document.createElement("button");
    voiceBtn.className = "voice-search-btn";
    voiceBtn.innerHTML = `🎤`;
    voiceBtn.title = "Voice Search";
    voiceBtn.style.cssText = "background:none; border:none; font-size:1.1rem; cursor:pointer;";
    voiceBtn.addEventListener("click", () => recognition.start());
    navIcons.insertBefore(voiceBtn, navIcons.firstChild);
  }
}

// --- AI FASHION STYLIST CHATBOT ---
function initChatbot() {
  if (document.getElementById("ai-chatbot")) return;

  const chatbotHTML = `
    <div id="ai-chatbot" class="chatbot-container">
      <div class="chatbot-icon" id="chatbot-toggle" title="Chat with Xora AI Stylist">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <div>
            <h4 style="margin:0;">XORA AI Fashion Stylist</h4>
            <small style="font-size:0.75rem; color:#ffd700;">Specialist in IT Workwear & Bespoke Fit</small>
          </div>
          <button id="chatbot-close">×</button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="bot-message">Vanakkam! I'm your XORA AI Fashion Stylist. Ask me about IT corporate dress codes, affordable middle-class luxury under ₹1,000, or how to measure for our 1-of-1 Bespoke Designer Studio! ✂️</div>
        </div>
        <div class="chatbot-input-area">
          <input type="text" id="chatbot-input" placeholder="e.g. Best shirt for 10h desk work?">
          <button id="chatbot-send">➤</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  const toggle = document.getElementById("chatbot-toggle");
  const win = document.getElementById("chatbot-window");
  const close = document.getElementById("chatbot-close");
  const send = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  if (!toggle) return;
  toggle.addEventListener("click", () => win.classList.toggle("active"));
  close.addEventListener("click", () => win.classList.remove("active"));

  function getAiResponse(text) {
    const q = text.toLowerCase();
    if (q.includes("it") || q.includes("desk") || q.includes("office") || q.includes("laptop")) {
      return "For IT Professionals, I highly recommend our 4-Way Cyber-Stretch Tech-Oxford Shirt and Tech-Knit 12H Chinos. They are anti-crease, sweat-wicking, and have hidden pockets for your earbuds!";
    }
    if (q.includes("middle class") || q.includes("budget") || q.includes("cheap") || q.includes("price") || q.includes("1000") || q.includes("rate")) {
      return "Our Smart-Value collection offers 100% Egyptian Giza shirts at just ₹799 and festive Kurtis from ₹699! Plus, check out our Buy 2 Get 1 combo and 0-Cost 3-month EMI options.";
    }
    if (q.includes("bespoke") || q.includes("custom") || q.includes("size") || q.includes("measure") || q.includes("thaniya")) {
      return "In our 1-of-1 Bespoke Studio, you submit your chest, waist, and length measurements. Our Master Couturiers cut individual paper blueprints, embroider your personal monogram initials, and deliver an exclusive single piece tailored only for you!";
    }
    if (q.includes("membership") || q.includes("gold") || q.includes("offer") || q.includes("discount")) {
      return "Our Privilege Club offers up to 25% OFF site-wide! Plus, IT employees from Zoho, TCS, Infosys, etc. get instant Gold Club access (15% OFF + Priority Bespoke slot).";
    }
    return "XORA brings you unique designer clothing for men & women. Would you like recommendations for IT techwear, middle-class value luxury, or our bespoke 1-of-1 custom tailored studio?";
  }

  function handleSend() {
    const val = input.value.trim();
    if (!val) return;
    const userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.textContent = val;
    messages.appendChild(userMsg);
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      const botMsg = document.createElement("div");
      botMsg.className = "bot-message";
      botMsg.textContent = getAiResponse(val);
      messages.appendChild(botMsg);
      messages.scrollTop = messages.scrollHeight;
    }, 600);
  }

  send.addEventListener("click", handleSend);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
  });
}

// --- THEME TOGGLE ---
function initTheme() {
  if (document.querySelector(".theme-toggle")) return;
  const themeBtn = document.createElement("button");
  themeBtn.className = "theme-toggle";
  themeBtn.innerHTML = `☀️`;
  themeBtn.title = "Toggle Theme";
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    showNotification(`${isLight ? "Light" : "Dark"} mode active`, "info");
  });
  document.body.appendChild(themeBtn);
}
