const PRODUCTS = [
  { id: 1, name: "Coffee", price: 45, img: "images/coffee.jpg", image: "images/coffee.jpg" },
  { id: 2, name: "Sandwich", price: 50, img: "images/sandwich.jpg", image: "images/sandwich.jpg" },
  { id: 3, name: "Soft Drink", price: 35, img: "images/softdrinks.jpg", image: "images/softdrinks.jpg" },
  { id: 4, name: "Cookies", price: 25, img: "images/cookies.jpg", image: "images/cookies.jpg" },
  { id: 5, name: "Bottled Water", price: 20, img: "images/bottledwater.jpg", image: "images/bottledwater.jpg" },
  { id: 6, name: "Chocolate", price: 25, img: "images/chocolate.jpg", image: "images/chocolate.jpg" }
];

const MAXQ = 99;
let S = { screen: "order", cart: {}, method: null, cash: "", err: "", txn: null, busy: false };
let counter = 0;

try {
  counter = parseInt(localStorage.getItem("kiosk_txn") || "0", 10) || 0;
} catch(e) {}

const $ = s => document.querySelector(s);
const money = n => "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const items = () => PRODUCTS.filter(p => S.cart[p.id]).map(p => ({ ...p, qty: S.cart[p.id], sub: p.price * S.cart[p.id] }));
const total = () => items().reduce((a, i) => a + i.sub, 0);
const count = () => items().reduce((a, i) => a + i.qty, 0);

let tt;
function toast(m, bad) {
  const t = $("#toast");
  t.textContent = m;
  t.className = "show" + (bad ? " err" : "");
  clearTimeout(tt);
  tt = setTimeout(() => t.className = "", 1800);
}

let qrInterval = null;
let qrSeconds = 300;

function startQrTimer() {
  clearInterval(qrInterval);
  qrSeconds = 300;
  qrInterval = setInterval(() => {
    if (S.screen !== "qr") {
      clearInterval(qrInterval);
      return;
    }
    qrSeconds--;
    const el = document.getElementById("qr-countdown");
    if (el) {
      const m = Math.floor(qrSeconds / 60);
      const s = qrSeconds % 60;
      el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    if (qrSeconds <= 0) {
      clearInterval(qrInterval);
      toast("QR Code renewed", 0);
      qrSeconds = 300;
    }
  }, 1000);
}

function go(s) {
  S.screen = s;
  S.err = "";
  if (s === "qr") startQrTimer();
  else clearInterval(qrInterval);
  render();
}

function add(id) {
  const q = S.cart[id] || 0;
  if (q >= MAXQ) return toast("Invalid quantity – maximum is " + MAXQ, 1);
  S.cart[id] = q + 1;
  toast("Added " + PRODUCTS.find(p => p.id === id).name);
  render();
}

function dec(id) {
  const q = S.cart[id] || 0;
  if (q <= 1) {
    delete S.cart[id];
    toast("Item removed");
  } else {
    S.cart[id] = q - 1;
  }
  render();
}

function rem(id) {
  delete S.cart[id];
  toast("Item removed");
  render();
}

function stepIdx() {
  return { order: 0, review: 1, method: 2, cash: 2, qr: 2, card: 2, success: 3, receipt: 3 }[S.screen];
}

function head() {
  const steps = ["Order", "Review", "Payment", "Receipt"];
  const a = stepIdx();
  return `
    <header>
      <div class="brand">
        <div class="brand-icon">🌅</div>
        <div class="brand-info">
          <span class="brand-title">Sunrise Kiosk</span>
          <span class="brand-tag">Express Self-Service POS</span>
        </div>
      </div>
      <div class="steps">
        ${steps.map((x, i) => `
          <div class="st ${i <= a ? "on" : ""} ${i === a ? "cur" : ""}">
            <span class="st-num">${i < a ? "✓" : i + 1}</span>
            <span class="st-lbl">${x}</span>
          </div>
          ${i < steps.length - 1 ? `<div class="st-line"></div>` : ""}
        `).join("")}
      </div>
    </header>
  `;
}

function lineRows() {
  const L = items();
  if (!L.length) {
    return `<div class="empty"><span>Your tray is empty — tap any item above to add.</span></div>`;
  }
  return L.map(i => `
    <div class="ln">
      <div class="ln-info">
        <div class="ln-thumb-wrap">
          <img src="${i.img}" alt="${i.name}" class="ln-thumb" loading="lazy">
        </div>
        <div>
          <div class="ln-name">${i.name}</div>
          <div class="ln-unit">${money(i.price)} each</div>
        </div>
      </div>
      <div class="q">
        <button class="rb" data-a="dec" data-id="${i.id}" aria-label="Decrease quantity">−</button>
        <b>${i.qty}</b>
        <button class="rb p" data-a="add" data-id="${i.id}" aria-label="Increase quantity">+</button>
      </div>
      <div class="ln-unit">${i.qty} × ${money(i.price)}</div>
      <div class="sb">${money(i.sub)}</div>
      <button class="xb" data-a="rem" data-id="${i.id}" aria-label="Remove item" title="Remove">✕</button>
    </div>
  `).join("");
}

function vOrder() {
  return `
    <main>
      <div class="page-head">
        <h1>What would you like?</h1>
        <p class="sub">Tap an item to add it to your order.</p>
      </div>
      <div class="grid">
        ${PRODUCTS.map(p => {
          const q = S.cart[p.id] || 0;
          return `
            <div class="pc ${q ? "sel" : ""}" data-a="add" data-id="${p.id}">
              ${q ? `<div class="badge">${q}</div>` : ""}
              <div class="pc-img-wrap">
                <img src="${p.img}" alt="${p.name}" class="pc-img" loading="lazy">
              </div>
              <div class="nm">${p.name}</div>
              <div class="pr">${money(p.price)}</div>
              <div class="pc-btn">${q ? "Added (" + q + ")" : "+ Add"}</div>
            </div>
          `;
        }).join("")}
      </div>
    </main>
    <div class="dock">
      <div class="dock-top">
        <span class="dock-title">Your Order Tray</span>
        <span class="dock-items-count">${count()} item${count() === 1 ? "" : "s"}</span>
      </div>
      <div class="lines">${lineRows()}</div>
      <div class="bar">
        <div class="tot">
          <span class="tot-lbl">Total (${count()} items)</span>
          <span class="tot-val">${money(total())}</span>
        </div>
        <button class="btn" data-a="review" ${count() ? "" : "disabled"}>
          Proceed to Payment →
        </button>
      </div>
    </div>
  `;
}

function vReview() {
  return `
    <main>
      <div class="wrap">
        <div class="page-head">
          <h1>Review your order</h1>
          <p class="sub">Check your items before selecting a payment method.</p>
        </div>
        <div class="panel">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th class="r">Qty</th>
                <th class="r">Unit price</th>
                <th class="r">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${items().map(i => `
                <tr>
                  <td>
                    <div class="review-item">
                      <div class="review-thumb-wrap">
                        <img src="${i.img}" alt="${i.name}" class="review-thumb" loading="lazy">
                      </div>
                      <span>${i.name}</span>
                    </div>
                  </td>
                  <td class="r">${i.qty}</td>
                  <td class="r">${money(i.price)}</td>
                  <td class="r">${money(i.sub)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total-row">
            <span>Total Amount</span>
            <span>${money(total())}</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn ghost" data-a="order">← Back to Menu</button>
          <button class="btn" data-a="method">Continue to Payment →</button>
        </div>
      </div>
    </main>
  `;
}

// High-Fidelity SVG Illustrations for Payment Channels
function svgCashIcon() {
  return `
    <svg class="pm-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="46" height="28" rx="5" fill="#10b981" stroke="#059669" stroke-width="2"/>
      <rect x="10" y="20" width="38" height="20" rx="3" fill="#34d399" fill-opacity="0.25"/>
      <circle cx="29" cy="30" r="7" fill="#ffffff" fill-opacity="0.95"/>
      <text x="29" y="34.5" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="800" fill="#047857" text-anchor="middle">₱</text>
      <circle cx="14" cy="24" r="2" fill="#047857" fill-opacity="0.4"/>
      <circle cx="44" cy="36" r="2" fill="#047857" fill-opacity="0.4"/>
      <!-- Stack of Gold Coins -->
      <ellipse cx="48" cy="46" rx="10" ry="4" fill="#d97706"/>
      <ellipse cx="48" cy="44" rx="10" ry="4" fill="#fbbf24"/>
      <ellipse cx="48" cy="40" rx="10" ry="4" fill="#d97706"/>
      <ellipse cx="48" cy="38" rx="10" ry="4" fill="#fde68a"/>
      <ellipse cx="48" cy="34" rx="10" ry="4" fill="#d97706"/>
      <ellipse cx="48" cy="32" rx="10" ry="4" fill="#fbbf24"/>
    </svg>
  `;
}

function svgQRIcon() {
  return `
    <svg class="pm-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Modern Smartphone Frame -->
      <rect x="15" y="6" width="34" height="52" rx="7" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
      <rect x="18" y="12" width="28" height="40" rx="3" fill="#f0f9ff"/>
      <rect x="27" y="9" width="10" height="2" rx="1" fill="#94a3b8"/>
      <!-- Inner QR Code Matrix -->
      <rect x="21" y="16" width="8" height="8" rx="1" fill="#0369a1"/>
      <rect x="23" y="18" width="4" height="4" fill="#ffffff"/>
      <rect x="35" y="16" width="8" height="8" rx="1" fill="#0369a1"/>
      <rect x="37" y="18" width="4" height="4" fill="#ffffff"/>
      <rect x="21" y="30" width="8" height="8" rx="1" fill="#0369a1"/>
      <rect x="23" y="32" width="4" height="4" fill="#ffffff"/>
      <rect x="35" y="30" width="4" height="4" fill="#ea580c"/>
      <rect x="39" y="34" width="4" height="4" fill="#0369a1"/>
      <!-- Scanning Laser Line -->
      <line x1="18" y1="26" x2="46" y2="26" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="18" cy="26" r="1.5" fill="#38bdf8"/>
      <circle cx="46" cy="26" r="1.5" fill="#38bdf8"/>
      <!-- Home Indicator -->
      <rect x="28" y="48" width="8" height="2" rx="1" fill="#94a3b8"/>
    </svg>
  `;
}

function svgCardIcon() {
  return `
    <svg class="pm-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="52" height="36" rx="6" fill="#312e81" stroke="#4338ca" stroke-width="2"/>
      <rect x="6" y="21" width="52" height="6" fill="#1e1b4b"/>
      <!-- Gold EMV Chip -->
      <rect x="12" y="30" width="10" height="8" rx="1.5" fill="#fbbf24" stroke="#d97706" stroke-width="1"/>
      <line x1="17" y1="30" x2="17" y2="38" stroke="#b45309" stroke-width="0.8"/>
      <line x1="12" y1="34" x2="22" y2="34" stroke="#b45309" stroke-width="0.8"/>
      <!-- Contactless NFC Wave -->
      <path d="M28 31C29 32.5 29 35.5 28 37" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M31 29C33 31.5 33 36.5 31 39" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M34 27C37 30.5 37 37.5 34 41" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Dual Card Network Discs -->
      <circle cx="45" cy="38" r="5" fill="#ef4444" fill-opacity="0.95"/>
      <circle cx="51" cy="38" r="5" fill="#f59e0b" fill-opacity="0.95"/>
    </svg>
  `;
}

function vMethod() {
  const cartItems = items();
  return `
    <main>
      <div class="wrap">
        <div class="page-head">
          <div class="page-badge"><span class="badge-dot"></span>Step 3 of 4 • Payment Method</div>
          <h1>How would you like to pay?</h1>
          <p class="sub">Choose your preferred payment channel below to complete your order.</p>
        </div>

        <div class="pay-overview-card">
          <div class="pay-overview-left">
            <span class="pay-overview-tag">Total Amount Due</span>
            <div class="pay-overview-amount">${money(total())}</div>
            <div class="pay-overview-sub">
              <span class="pay-sub-pill">${count()} item${count() === 1 ? "" : "s"} in tray</span>
              <span class="pay-sub-dot">•</span>
              <span class="pay-sub-tax">VAT Inclusive</span>
            </div>
          </div>
          <div class="pay-overview-right">
            <div class="pay-items-preview">
              <span class="pay-preview-title">Order Items:</span>
              <div class="pay-thumbs-row">
                ${cartItems.slice(0, 4).map(i => `
                  <div class="pay-mini-thumb" title="${i.name} (x${i.qty})">
                    <img src="${i.img}" alt="${i.name}">
                    <span class="pay-mini-badge">${i.qty}</span>
                  </div>
                `).join("")}
                ${cartItems.length > 4 ? `<div class="pay-mini-more">+${cartItems.length - 4}</div>` : ""}
              </div>
            </div>
            <div class="pay-security-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Instant Thermal Receipt • Official BIR Registered POS</span>
            </div>
          </div>
        </div>

        <div class="pm-grid">
          <!-- Option 1: Cash -->
          <div class="pm-card pm-card-cash" data-a="pay-cash">
            <div class="pm-card-badge">Cash Register</div>
            <div class="pm-card-icon-wrap">
              ${svgCashIcon()}
            </div>
            <div class="pm-card-content">
              <div class="pm-card-title">Cash Payment</div>
              <p class="pm-card-desc">Pay using exact cash bills or coins with instant automatic change calculator.</p>
              <div class="pm-denoms-preview">
                <span class="pm-chip">₱20</span>
                <span class="pm-chip">₱50</span>
                <span class="pm-chip">₱100</span>
                <span class="pm-chip">₱500</span>
                <span class="pm-chip">₱1,000</span>
              </div>
            </div>
            <div class="pm-card-footer">
              <span class="pm-action-text">Pay with Cash</span>
              <span class="pm-action-arrow">→</span>
            </div>
          </div>

          <!-- Option 2: QR Payment -->
          <div class="pm-card pm-card-qr" data-a="pay-qr">
            <div class="pm-card-badge">Instant E-Wallet</div>
            <div class="pm-card-icon-wrap">
              ${svgQRIcon()}
            </div>
            <div class="pm-card-content">
              <div class="pm-card-title">QR Ph & E-Wallets</div>
              <p class="pm-card-desc">Scan dynamic QR via GCash, Maya, ShopeePay, or any mobile bank app.</p>
              <div class="pm-brand-row">
                <span class="badge-brand brand-gcash">GCash</span>
                <span class="badge-brand brand-maya">Maya</span>
                <span class="badge-brand brand-qrph">QR Ph</span>
                <span class="badge-brand brand-bank">Any Bank</span>
              </div>
            </div>
            <div class="pm-card-footer">
              <span class="pm-action-text">Scan QR Code</span>
              <span class="pm-action-arrow">→</span>
            </div>
          </div>

          <!-- Option 3: Card -->
          <div class="pm-card pm-card-credit" data-a="pay-card">
            <div class="pm-card-badge">NFC & EMV Chip</div>
            <div class="pm-card-icon-wrap">
              ${svgCardIcon()}
            </div>
            <div class="pm-card-content">
              <div class="pm-card-title">Credit / Debit Card</div>
              <p class="pm-card-desc">Tap contactless card or insert EMV chip into the smart POS reader.</p>
              <div class="pm-brand-row">
                <span class="badge-brand brand-visa">VISA</span>
                <span class="badge-brand brand-mastercard">Mastercard</span>
                <span class="badge-brand brand-jcb">JCB</span>
                <span class="badge-brand brand-bancnet">BancNet</span>
              </div>
            </div>
            <div class="pm-card-footer">
              <span class="pm-action-text">Tap or Insert Card</span>
              <span class="pm-action-arrow">→</span>
            </div>
          </div>
        </div>

        <div class="actions" style="margin-top:24px">
          <button class="btn ghost" data-a="review">← Back to Order Summary</button>
        </div>
      </div>
    </main>
  `;
}

function cashInfo() {
  const v = parseFloat(S.cash);
  const ok = S.cash !== "" && !isNaN(v) && v >= total();
  return { v, ok };
}

function vCash() {
  const { v, ok } = cashInfo();
  const currentTotal = total();
  const isShort = S.cash !== "" && !isNaN(v) && v < currentTotal;

  return `
    <main>
      <div class="wrap two">
        <div class="cash-left-col">
          <div class="page-head">
            <div class="page-badge"><span class="badge-dot"></span>Payment Channel: Cash</div>
            <h1>Cash Payment</h1>
            <p class="sub">Enter the amount received from customer or tap quick bills.</p>
          </div>

          <div class="cash-summary-card">
            <div class="cash-due-row">
              <div>
                <span class="cash-due-label">Total Amount Due</span>
                <div class="cash-items-tag">${count()} item${count() === 1 ? "" : "s"} to settle</div>
              </div>
              <div class="cash-due-value">${money(currentTotal)}</div>
            </div>
          </div>

          <div class="disp-wrap">
            <div class="disp-header">
              <span class="disp-lbl">Cash Tendered</span>
              ${S.cash ? `<button class="disp-quick-clear" data-a="k" data-v="clr">✕ Clear</button>` : ""}
            </div>
            <div class="disp ${S.err ? "err" : S.cash ? "has-val" : ""}">
              <span class="disp-curr">₱</span>
              <span class="disp-num">${S.cash === "" ? "0.00" : S.cash}</span>
              ${S.cash ? `<span class="disp-caret"></span>` : ""}
            </div>
          </div>

          ${S.err ? `
            <div class="msg bad">
              <span class="msg-icon">⚠</span>
              <span>${S.err}</span>
            </div>
          ` : ""}

          <!-- Quick Cash Bill Presets -->
          <div class="quick-cash-section">
            <span class="quick-sec-title">Quick Cash Presets:</span>
            <div class="quick">
              <button class="q-btn exact" data-a="q" data-v="exact">
                <span class="q-tag">Exact</span>
                <span class="q-amt">${money(currentTotal)}</span>
              </button>
              <button class="q-btn b100" data-a="q" data-v="100">
                <span class="q-tag">Bill</span>
                <span class="q-amt">₱100</span>
              </button>
              <button class="q-btn b200" data-a="q" data-v="200">
                <span class="q-tag">Bill</span>
                <span class="q-amt">₱200</span>
              </button>
              <button class="q-btn b500" data-a="q" data-v="500">
                <span class="q-tag">Bill</span>
                <span class="q-amt">₱500</span>
              </button>
              <button class="q-btn b1000" data-a="q" data-v="1000">
                <span class="q-tag">Bill</span>
                <span class="q-amt">₱1,000</span>
              </button>
            </div>

            <!-- Quick Add Increment Chips -->
            <div class="quick-add-row">
              <span class="quick-add-lbl">Add Bill:</span>
              <button class="add-chip" data-a="q-add" data-v="20">+₱20</button>
              <button class="add-chip" data-a="q-add" data-v="50">+₱50</button>
              <button class="add-chip" data-a="q-add" data-v="100">+₱100</button>
              <button class="add-chip" data-a="q-add" data-v="500">+₱500</button>
              <button class="add-chip" data-a="q-add" data-v="1000">+₱1,000</button>
            </div>
          </div>

          <!-- Dynamic Change Feedback -->
          <div class="change-box ${ok ? "ok" : isShort ? "short" : ""}">
            ${ok ? `
              <div class="change-status-left">
                <span class="change-lbl">Change to Return</span>
                <span class="change-pill ok">✓ Ready to Complete</span>
              </div>
              <div class="change-val">${money(v - currentTotal)}</div>
            ` : isShort ? `
              <div class="change-status-left">
                <span class="change-lbl">Remaining Balance Due</span>
                <span class="change-pill short">Need more cash</span>
              </div>
              <div class="change-val short">-${money(currentTotal - v)}</div>
            ` : `
              <div class="change-status-left">
                <span class="change-lbl">Change Calculator</span>
                <small style="color:var(--mute)">Awaiting cash tendered input</small>
              </div>
              <div class="change-val empty">—</div>
            `}
          </div>

          <div class="bill-slot-guide">
            <div class="bill-slot-graphic">
              <span class="bill-slot-slit"></span>
              <span class="bill-slot-arrow">↓</span>
            </div>
            <div class="bill-slot-text">
              <strong>Kiosk Cash Acceptor</strong>
              <small>Insert Philippine Peso banknotes flat and unfolded into the slot below.</small>
            </div>
          </div>
        </div>

        <div class="cash-right-col">
          <div class="keys-wrapper">
            <div class="keys">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
                <button class="numpad-key" data-a="k" data-v="${n}">${n}</button>
              `).join("")}
              <button class="numpad-key dot" data-a="k" data-v=".">.</button>
              <button class="numpad-key zero" data-a="k" data-v="0">0</button>
              <button class="numpad-key backspace" data-a="k" data-v="bk" aria-label="Backspace" title="Backspace">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                  <line x1="18" y1="9" x2="12" y2="15"/>
                  <line x1="12" y1="9" x2="18" y2="15"/>
                </svg>
              </button>
            </div>

            <div class="actions cash-actions">
              <button class="btn ghost clear-btn" data-a="k" data-v="clr">Clear</button>
              <button class="btn pay-btn" data-a="paycash">
                <span>Complete Cash Payment</span>
                <span style="font-size:18px">→</span>
              </button>
            </div>

            <div class="actions" style="margin-top:12px">
              <button class="btn ghost" data-a="method" style="width:100%">← Change Payment Method</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function vQR() {
  const currentTotal = total();
  const d = new Date();
  const refCode = `QRPH-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${String(counter + 1).padStart(4, "0")}`;

  return `
    <main>
      <div class="wrap two" style="align-items:center">
        <div class="qr-presentation-col">
          <div class="qr-terminal-stand">
            <!-- Authentic Philippine QR Ph Header Banner -->
            <div class="qr-stand-header">
              <div class="qrph-logo-badge">
                <div class="qrph-tri-emblem">
                  <span class="qrph-blue"></span>
                  <span class="qrph-red"></span>
                  <span class="qrph-yellow"></span>
                </div>
                <span class="qrph-text">QR Ph</span>
              </div>
              <div class="qr-stand-tag">NATIONAL QR CODE STANDARD</div>
            </div>

            <div class="qr-merchant-info">
              <div class="qr-merchant-name">SUNRISE KIOSK</div>
              <div class="qr-merchant-sub">Touchscreen Self-Service • Terminal #01</div>
            </div>

            <div class="qr-code-box">
              <!-- Corner Scanner Reticles -->
              <div class="qr-reticle tl"></div>
              <div class="qr-reticle tr"></div>
              <div class="qr-reticle bl"></div>
              <div class="qr-reticle br"></div>

              <!-- Animated Scan Laser Bar -->
              <div class="qr-scan-laser"></div>

              <div class="qr-svg-wrapper">
                <svg viewBox="0 0 160 160" width="180" height="180" style="display:block">
                  <!-- Finder 1 TL -->
                  <rect x="0" y="0" width="48" height="48" rx="8" fill="#0f172a"/>
                  <rect x="8" y="8" width="32" height="32" rx="5" fill="#ffffff"/>
                  <rect x="16" y="16" width="16" height="16" rx="3" fill="#0f172a"/>
                  <!-- Finder 2 TR -->
                  <rect x="112" y="0" width="48" height="48" rx="8" fill="#0f172a"/>
                  <rect x="120" y="8" width="32" height="32" rx="5" fill="#ffffff"/>
                  <rect x="128" y="16" width="16" height="16" rx="3" fill="#0f172a"/>
                  <!-- Finder 3 BL -->
                  <rect x="0" y="112" width="48" height="48" rx="8" fill="#0f172a"/>
                  <rect x="8" y="120" width="32" height="32" rx="5" fill="#ffffff"/>
                  <rect x="16" y="128" width="16" height="16" rx="3" fill="#0f172a"/>
                  <!-- Data Dots & Alignment Patterns -->
                  <rect x="60" y="8" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="76" y="8" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="92" y="8" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="60" y="24" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="92" y="24" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="60" y="40" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="76" y="40" width="10" height="10" rx="2" fill="#0f172a"/>
                  
                  <rect x="8" y="60" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="24" y="60" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="40" y="60" width="10" height="10" rx="2" fill="#0f172a"/>

                  <!-- Central Sunrise Kiosk Badge -->
                  <rect x="58" y="58" width="44" height="44" rx="10" fill="#fff7ed" stroke="#fed7aa" stroke-width="2.5"/>
                  <circle cx="80" cy="80" r="16" fill="#f97316"/>
                  <text x="80" y="86" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" text-anchor="middle" fill="#ffffff" font-weight="800">🌅</text>
                  
                  <rect x="112" y="60" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="128" y="60" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="144" y="60" width="10" height="10" rx="2" fill="#ea580c"/>
                  
                  <rect x="8" y="76" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="40" y="76" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="112" y="76" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="144" y="76" width="10" height="10" rx="2" fill="#0f172a"/>
                  
                  <rect x="8" y="92" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="24" y="92" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="40" y="92" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="112" y="92" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="128" y="92" width="10" height="10" rx="2" fill="#0f172a"/>
                  
                  <rect x="60" y="112" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="76" y="112" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="92" y="112" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="112" y="112" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="128" y="112" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="144" y="112" width="10" height="10" rx="2" fill="#0f172a"/>
                  
                  <rect x="60" y="128" width="10" height="10" rx="2" fill="#ea580c"/>
                  <rect x="92" y="128" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="112" y="128" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="144" y="128" width="10" height="10" rx="2" fill="#ea580c"/>
                  
                  <rect x="60" y="144" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="76" y="144" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="92" y="144" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="128" y="144" width="10" height="10" rx="2" fill="#0f172a"/>
                  <rect x="144" y="144" width="10" height="10" rx="2" fill="#0f172a"/>
                </svg>
              </div>
            </div>

            <div class="qr-stand-footer">
              <div class="qr-timer-pill">
                <span class="qr-timer-icon">⏱</span>
                <span>Session expires in: <strong id="qr-countdown">04:59</strong></span>
              </div>
              <div class="qr-ref-code">${refCode}</div>
            </div>

            <div class="qr-supported-badges">
              <span class="badge-brand brand-gcash">GCash</span>
              <span class="badge-brand brand-maya">Maya</span>
              <span class="badge-brand brand-qrph">QR Ph</span>
              <span class="badge-brand brand-shopee">ShopeePay</span>
              <span class="badge-brand brand-bank">All Bank Apps</span>
            </div>
          </div>
        </div>

        <div class="qr-instructions-col">
          <div class="page-head">
            <div class="page-badge"><span class="badge-dot"></span>Payment Channel: QR Ph</div>
            <h1>Scan with E-Wallet or Bank</h1>
            <p class="sub">Open your GCash, Maya, ShopeePay, or mobile bank app and scan the QR code.</p>
          </div>

          <div class="qr-amount-card">
            <div>
              <span class="qr-amt-label">Exact Amount to Pay</span>
              <div class="qr-amt-sub">Instant verification upon scanning</div>
            </div>
            <div class="qr-amt-val">${money(currentTotal)}</div>
          </div>

          <div class="qr-steps-list">
            <div class="qr-step-card">
              <div class="qr-step-num">1</div>
              <div class="qr-step-body">
                <strong>Open your e-Wallet or Bank App</strong>
                <p>Launch GCash, Maya, ShopeePay, BDO, BPI, UnionBank, or any QRPh app.</p>
              </div>
            </div>

            <div class="qr-step-card">
              <div class="qr-step-num">2</div>
              <div class="qr-step-body">
                <strong>Tap "Scan QR" and align camera</strong>
                <p>Aim your camera at the screen. The merchant and amount will automatically load.</p>
              </div>
            </div>

            <div class="qr-step-card">
              <div class="qr-step-num">3</div>
              <div class="qr-step-body">
                <strong>Verify & Confirm Payment</strong>
                <p>Check the amount <b>${money(currentTotal)}</b> and tap Pay Now on your phone.</p>
              </div>
            </div>
          </div>

          <div class="actions qr-action-row">
            <button class="btn ghost" data-a="method">← Back</button>
            <button class="btn" data-a="confirmqr" style="flex:1.4">
              <span>✓ I Have Paid (Confirm)</span>
            </button>
          </div>

          <div class="qr-demo-row">
            <button class="btn-demo-scan" data-a="sim-qr">
              <span>📱 Simulate Instant App Scan & Pay</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `;
}

function vCard() {
  const currentTotal = total();

  return `
    <main>
      <div class="wrap two" style="align-items:center">
        <div class="card-terminal-col">
          <!-- Sleek Interactive POS Smart Terminal -->
          <div class="smart-pos-terminal ${S.busy ? "is-processing" : ""}">
            <!-- Terminal Top Bezel with 4 EMV Contactless Status LEDs -->
            <div class="pos-top-bezel">
              <div class="pos-emv-leds">
                <span class="emv-led ${S.busy ? 'active' : 'idle'}"></span>
                <span class="emv-led ${S.busy ? 'active delay-1' : ''}"></span>
                <span class="emv-led ${S.busy ? 'active delay-2' : ''}"></span>
                <span class="emv-led ${S.busy ? 'active delay-3' : ''}"></span>
              </div>
              <div class="pos-model-label">SUNRISE SMART POS • CONTACTLESS</div>
            </div>

            <!-- Terminal Screen / Status Banner -->
            <div class="pos-screen">
              <div class="pos-screen-amount">${money(currentTotal)}</div>
              <div class="pos-screen-prompt">
                ${S.busy ? "AUTHORIZING TRANSACTION..." : "TAP CARD • INSERT CHIP • SWIPE"}
              </div>
            </div>

            <!-- Interactive Virtual EMV Card Container -->
            <div class="pos-card-stage">
              <div class="virtual-card ${S.busy ? "card-tapping" : ""}">
                <div class="card-chip-row">
                  <div class="emv-chip">
                    <span class="chip-line horizontal"></span>
                    <span class="chip-line vertical"></span>
                  </div>
                  <div class="nfc-wave-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                      <path d="M8.5 16.5a5 5 0 0 1 0-7"/>
                      <path d="M12 19a8.5 8.5 0 0 1 0-14"/>
                      <path d="M15.5 21.5a12 12 0 0 1 0-19"/>
                    </svg>
                  </div>
                </div>

                <div class="card-number-row">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>4242</span>
                </div>

                <div class="card-meta-row">
                  <div>
                    <span class="card-meta-label">CARDHOLDER</span>
                    <span class="card-meta-val">SUNRISE VALUED GUEST</span>
                  </div>
                  <div>
                    <span class="card-meta-label">EXPIRES</span>
                    <span class="card-meta-val">12/28</span>
                  </div>
                  <div class="card-network-logo">
                    <span class="mc-disc red"></span>
                    <span class="mc-disc gold"></span>
                  </div>
                </div>
              </div>

              <!-- NFC Radiating Waves from Terminal Sensor -->
              <div class="nfc-sensor-waves ${S.busy ? 'anim-pulse' : ''}">
                <span class="wave w1"></span>
                <span class="wave w2"></span>
                <span class="wave w3"></span>
              </div>
            </div>

            <div class="pos-terminal-bottom">
              <div class="pos-chip-slot">
                <span class="slot-arrow">▲</span>
                <span>EMV Chip Card Insertion Slot</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-instructions-col">
          <div class="page-head">
            <div class="page-badge"><span class="badge-dot"></span>Payment Channel: Card</div>
            <h1>Credit / Debit Card</h1>
            <p class="sub">Tap your contactless card/phone or insert chip into reader.</p>
          </div>

          <div class="card-amount-card">
            <div>
              <span class="card-amt-label">Payable Amount</span>
              <div class="card-amt-sub">Protected with 256-bit EMV Encryption</div>
            </div>
            <div class="card-amt-val">${money(currentTotal)}</div>
          </div>

          ${S.busy ? `
            <div class="card-busy-box">
              <div class="busy-header">
                <div class="busy-spinner"></div>
                <div>
                  <strong>Processing Payment…</strong>
                  <div style="font-size:13px;color:var(--mute)">Connecting to acquiring bank host</div>
                </div>
              </div>
              <div class="card-prog-bar">
                <div class="card-prog-fill"></div>
              </div>
              <div class="busy-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Please do not remove your card or touch the screen until authorized.</span>
              </div>
            </div>
          ` : `
            <div class="card-methods-guide">
              <div class="card-method-item">
                <div class="card-method-ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a6 6 0 0 0-6 6h2a4 4 0 0 1 4-4z"/></svg>
                </div>
                <div>
                  <strong>Contactless Tap & Go (NFC)</strong>
                  <p>Hold your Visa, Mastercard, Apple Pay, or Google Wallet near the terminal sensor.</p>
                </div>
              </div>

              <div class="card-method-item">
                <div class="card-method-ic">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="16" rx="3"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
                </div>
                <div>
                  <strong>Insert EMV Chip</strong>
                  <p>Insert your card chip-first into the slot at the base of the terminal.</p>
                </div>
              </div>
            </div>

            <div class="card-accepted-networks">
              <span class="net-lbl">Accepted Cards:</span>
              <div class="net-pills">
                <span class="badge-brand brand-visa">VISA</span>
                <span class="badge-brand brand-mastercard">Mastercard</span>
                <span class="badge-brand brand-jcb">JCB</span>
                <span class="badge-brand brand-bancnet">BancNet</span>
                <span class="badge-brand brand-amex">AMEX</span>
              </div>
            </div>
          `}

          <div class="actions card-actions-row">
            <button class="btn ghost" data-a="method" ${S.busy ? "disabled" : ""}>← Back</button>
            <button class="btn" data-a="proccard" ${S.busy ? "disabled" : ""} style="flex:1.4">
              <span>${S.busy ? "Processing…" : "💳 Tap Card to Pay"}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `;
}

function vSuccess() {
  const t = S.txn;
  const vatAmount = Math.round((t.total * 12 / 112) * 100) / 100;
  const netAmount = Math.round((t.total - vatAmount) * 100) / 100;
  const totalQty = t.items.reduce((a, i) => a + i.qty, 0);

  return `
    <main>
      <div class="wrap success-wrap">
        <!-- Animated Success Hero Header -->
        <div class="success-hero">
          <div class="success-check-bubble">
            <svg class="success-check-svg" viewBox="0 0 52 52">
              <circle class="success-circle" cx="26" cy="26" r="23" fill="none"/>
              <path class="success-check" fill="none" d="M15 27l8 8 16-16"/>
            </svg>
          </div>
          <div class="page-badge success-badge">
            <span class="badge-dot-green"></span>Payment Approved • BIR Registered POS
          </div>
          <h1 class="success-title">Payment Successful!</h1>
          <p class="success-sub">Thank you for your order! Your payment has been received and confirmed.</p>
        </div>

        <!-- Modern Transaction Card -->
        <div class="success-card">
          <!-- Card Header / Meta Bar -->
          <div class="success-card-meta">
            <div class="success-meta-item">
              <span class="success-meta-label">TRANSACTION NUMBER</span>
              <strong class="success-meta-code">${t.no}</strong>
            </div>
            <div class="success-meta-item r">
              <span class="success-meta-label">DATE & TIME</span>
              <span class="success-meta-val">${t.date}</span>
            </div>
          </div>

          <!-- Items Ordered Mini Tray -->
          <div class="success-items-preview">
            <div class="success-items-header">
              <span>Items Purchased (${totalQty} item${totalQty === 1 ? "" : "s"})</span>
              <span class="success-items-tag">Verified</span>
            </div>
            <div class="success-items-scroll">
              ${t.items.map(i => `
                <div class="success-item-chip">
                  <div class="success-item-thumb">
                    <img src="${i.img}" alt="${i.name}">
                  </div>
                  <div class="success-item-info">
                    <span class="success-item-name">${i.name}</span>
                    <span class="success-item-detail">${i.qty}× • ${money(i.sub)}</span>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Financial Breakdown Table -->
          <div class="success-table">
            <div class="success-row">
              <span class="row-label">Payment Channel</span>
              <span class="row-val">
                ${t.method === "Cash" 
                  ? `<span class="badge-brand brand-cash-pay">💵 Cash Register</span>`
                  : t.method === "QR Payment"
                  ? `<span class="badge-brand brand-qrph">📱 QR Ph / E-Wallet</span>`
                  : `<span class="badge-brand brand-card-pay">💳 Credit / Debit Card</span>`
                }
              </span>
            </div>
            <div class="success-row">
              <span class="row-label">VATable Sales (Net of VAT)</span>
              <span class="row-val">${money(netAmount)}</span>
            </div>
            <div class="success-row">
              <span class="row-label">12% VAT Included</span>
              <span class="row-val">${money(vatAmount)}</span>
            </div>
            <div class="success-row highlight">
              <span class="row-label">Total Amount Paid</span>
              <span class="row-val total-highlight">${money(t.total)}</span>
            </div>
            <div class="success-row">
              <span class="row-label">Amount Tendered</span>
              <span class="row-val font-semibold">${money(t.paid)}</span>
            </div>
          </div>

          <!-- Dynamic Change Callout Banner -->
          ${t.change > 0 ? `
            <div class="success-change-card has-change">
              <div class="change-info-left">
                <div class="change-icon-circle">₱</div>
                <div>
                  <strong>Change to Collect: ${money(t.change)}</strong>
                  <p>Please take your change bills/coins from the dispenser tray.</p>
                </div>
              </div>
              <div class="change-badge-pill">Dispensed</div>
            </div>
          ` : `
            <div class="success-change-card exact">
              <div class="change-info-left">
                <div class="change-icon-circle exact">✓</div>
                <div>
                  <strong>Exact Payment Settled (${money(t.total)})</strong>
                  <p>No change required for this transaction.</p>
                </div>
              </div>
              <div class="change-badge-pill exact">Settled</div>
            </div>
          `}
        </div>

        <!-- Action Buttons -->
        <div class="success-actions-row">
          <button class="btn success-receipt-btn" data-a="receipt">
            <span class="btn-icon">🧾</span>
            <span>View Official Thermal Receipt</span>
            <span class="btn-arrow">→</span>
          </button>
          <button class="btn ghost success-new-btn" data-a="newtxn">
            <span>+ Start New Order</span>
          </button>
        </div>
      </div>
    </main>
  `;
}

function vReceipt() {
  const t = S.txn;
  const vatAmount = Math.round((t.total * 12 / 112) * 100) / 100;
  const netAmount = Math.round((t.total - vatAmount) * 100) / 100;
  const totalQty = t.items.reduce((a, i) => a + i.qty, 0);

  return `
    <main>
      <div class="wrap two" style="align-items:flex-start">
        <!-- Authentic Thermal Receipt Paper Slip -->
        <div class="thermal-receipt-stage">
          <div class="receipt-slot-header">
            <span class="printer-slot-light"></span>
            <span>OFFICIAL THERMAL PRINTER • TAPE OUTPUT</span>
          </div>

          <div class="thermal-paper">
            <div class="thermal-sawtooth-top"></div>

            <div class="thermal-content">
              <!-- Store Header -->
              <div class="rc-header">
                <div class="rc-brand-logo">🌅</div>
                <h2 class="rc-store-title">SUNRISE KIOSK</h2>
                <div class="rc-store-sub">TOUCHSCREEN SELF-SERVICE POS</div>
                <div class="rc-store-meta">
                  <div>Terminal #01 • Kiosk ID: KSK-001</div>
                  <div>VAT REG TIN: 987-654-321-000</div>
                  <div>Official BIR Reg. No: BIR-2026-POS-415</div>
                </div>
              </div>

              <div class="rc-divider"></div>

              <!-- Transaction Information -->
              <div class="rc-meta-grid">
                <div class="rc-line"><span>Invoice/TXN:</span> <strong>${t.no}</strong></div>
                <div class="rc-line"><span>Date/Time:</span> <span>${t.date}</span></div>
                <div class="rc-line"><span>Payment Mode:</span> <span>${t.method}</span></div>
                <div class="rc-line"><span>Cashier/Operator:</span> <span>SELF-SERVICE</span></div>
              </div>

              <div class="rc-divider"></div>

              <!-- Items Breakdown Table -->
              <div class="rc-items-table">
                <div class="rc-col-head">
                  <span class="col-item">ITEM DESCRIPTION</span>
                  <span class="col-qty">QTY</span>
                  <span class="col-price">TOTAL</span>
                </div>
                ${t.items.map(i => `
                  <div class="rc-item-line">
                    <span class="col-item">${i.name}</span>
                    <span class="col-qty">${i.qty}</span>
                    <span class="col-price">${money(i.sub)}</span>
                  </div>
                  <div class="rc-item-subline">${i.qty} × ${money(i.price)}</div>
                `).join("")}
              </div>

              <div class="rc-divider"></div>

              <!-- Financial Summary -->
              <div class="rc-summary">
                <div class="rc-line"><span>Total Items:</span> <span>${totalQty}</span></div>
                <div class="rc-line"><span>VATable Sales (Net):</span> <span>${money(netAmount)}</span></div>
                <div class="rc-line"><span>VAT Amount (12%):</span> <span>${money(vatAmount)}</span></div>
                <div class="rc-divider heavy"></div>
                <div class="rc-line grand-total">
                  <strong>TOTAL AMOUNT DUE</strong>
                  <strong>${money(t.total)}</strong>
                </div>
                <div class="rc-divider heavy"></div>
                <div class="rc-line"><span>Payment Mode:</span> <span>${t.method}</span></div>
                <div class="rc-line"><span>Amount Tendered:</span> <span>${money(t.paid)}</span></div>
                <div class="rc-line"><span>Change Given:</span> <strong>${money(t.change)}</strong></div>
              </div>

              <div class="rc-divider"></div>

              <!-- Status & Barcode -->
              <div class="rc-footer">
                <div class="rc-status-pill">PAID & APPROVED</div>
                <div class="rc-barcode-visual">
                  <div class="barcode-lines">
                    ||||| ||| ||||||| || ||||| |||||| ||| ||||||| |||| |||
                  </div>
                  <span class="barcode-num">${t.no}</span>
                </div>
                <div class="rc-farewell">
                  <p>THANK YOU FOR YOUR VISIT!</p>
                  <small>THIS SERVES AS YOUR OFFICIAL INVOICE</small>
                </div>
              </div>
            </div>

            <div class="thermal-sawtooth-bottom"></div>
          </div>
        </div>

        <!-- Receipt Screen Action & Guidance Column -->
        <div class="receipt-actions-col">
          <div class="page-head">
            <div class="page-badge success-badge">
              <span class="badge-dot-green"></span>Receipt Generated
            </div>
            <h1>Your Official Receipt</h1>
            <p class="sub">Your transaction has been finalized and recorded in the database. You may print a copy or begin a new order.</p>
          </div>

          <div class="receipt-info-card">
            <div class="info-icon">🖨️</div>
            <div>
              <strong>Thermal Receipt Dispensed</strong>
              <p>Your printed physical receipt has been cut and is ready at the kiosk dispenser tray below.</p>
            </div>
          </div>

          <div class="receipt-buttons">
            <button class="btn print-slip-btn" data-a="print">
              <span>🖨️ Print Receipt Copy</span>
            </button>
            <button class="btn success-new-large" data-a="newtxn">
              <span>+ Start New Order</span>
              <span style="font-size:18px">→</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  `;
}

const V = {
  order: vOrder,
  review: vReview,
  method: vMethod,
  cash: vCash,
  qr: vQR,
  card: vCard,
  success: vSuccess,
  receipt: vReceipt
};

function render() {
  $("#app").innerHTML = head() + V[S.screen]();
}

function complete(method, paid) {
  if (!count()) return toast("Your order is empty", 1);
  counter++;
  try {
    localStorage.setItem("kiosk_txn", String(counter));
  } catch(e) {}
  const d = new Date();
  S.txn = {
    no: `TXN-${d.getFullYear()}-${String(counter).padStart(5, "0")}`,
    date: d.toLocaleString("en-PH", { dateStyle: "long", timeStyle: "short" }),
    items: items(),
    total: total(),
    method,
    paid,
    change: paid - total()
  };
  S.busy = false;
  toast("Transaction completed successfully");
  go("success");
}

function payCash() {
  const raw = S.cash, v = parseFloat(raw), T = total();
  if (raw === "") {
    S.err = "Please enter the amount paid.";
    toast("Invalid payment", 1);
  } else if (isNaN(v) || v <= 0) {
    S.err = "Invalid amount. Please enter a valid payment.";
    toast("Invalid payment", 1);
  } else if (v < T) {
    S.err = `Insufficient payment. Please enter at least ${money(T)}.`;
    toast("Insufficient payment", 1);
  } else {
    return complete("Cash", Math.round(v * 100) / 100);
  }
  render();
}

function key(v) {
  S.err = "";
  let c = S.cash;
  if (v === "clr") c = "";
  else if (v === "bk") c = c.slice(0, -1);
  else if (v === ".") {
    if (!c.includes(".")) c = (c || "0") + ".";
  } else if (c.length < 9) {
    if (c.includes(".") && c.split(".")[1].length >= 2) return;
    c = (c === "0") ? v : c + v;
  }
  S.cash = c;
  render();
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-a]");
  if (!b || b.disabled) return;
  const a = b.dataset.a, id = +b.dataset.id, v = b.dataset.v;
  switch (a) {
    case "add": add(id); break;
    case "dec": dec(id); break;
    case "rem": rem(id); break;
    case "order": go("order"); break;
    case "review":
      if (!count()) return toast("Please add at least one item", 1);
      go("review");
      break;
    case "method": S.cash = ""; go("method"); break;
    case "pay-cash": S.method = "Cash"; S.cash = ""; go("cash"); break;
    case "pay-qr": S.method = "QR Payment"; go("qr"); break;
    case "pay-card": S.method = "Credit/Debit Card"; S.busy = false; go("card"); break;
    case "k": key(v); break;
    case "q":
      S.err = "";
      S.cash = v === "exact" ? String(total()) : v;
      render();
      break;
    case "q-add":
      S.err = "";
      const curVal = parseFloat(S.cash) || 0;
      S.cash = String(Math.round((curVal + parseFloat(v)) * 100) / 100);
      render();
      break;
    case "sim-qr":
      toast("📱 QR Code Scanned via Mobile App", 0);
      setTimeout(() => {
        if (S.screen === "qr") complete("QR Payment", total());
      }, 900);
      break;
    case "paycash": payCash(); break;
    case "confirmqr": complete("QR Payment", total()); break;
    case "proccard":
      S.busy = true;
      render();
      setTimeout(() => {
        if (S.screen === "card" && S.busy) complete("Credit/Debit Card", total());
      }, 2000);
      break;
    case "receipt": go("receipt"); break;
    case "print": window.print(); break;
    case "newtxn":
      S = { screen: "order", cart: {}, method: null, cash: "", err: "", txn: null, busy: false };
      render();
      toast("New order started");
      break;
  }
});

render();
