const PRODUCTS = [
  { id: 1, name: "Coffee", price: 45, em: "☕" },
  { id: 2, name: "Sandwich", price: 50, em: "🥪" },
  { id: 3, name: "Soft Drink", price: 35, em: "🥤" },
  { id: 4, name: "Cookies", price: 25, em: "🍪" },
  { id: 5, name: "Bottled Water", price: 20, em: "💧" },
  { id: 6, name: "Chocolate", price: 25, em: "🍫" }
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

function go(s) {
  S.screen = s;
  S.err = "";
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
      <div>
        <div class="ln-name">${i.name}</div>
        <div class="ln-unit">${money(i.price)} each</div>
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
              <div class="em-wrap">
                <div class="em">${p.em}</div>
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
                  <td>${i.name}</td>
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

function vMethod() {
  return `
    <main>
      <div class="wrap">
        <div class="page-head">
          <h1>How would you like to pay?</h1>
          <p class="sub">Select your preferred payment method below.</p>
        </div>
        <div class="due-card">
          <div>
            <small>Amount Due</small>
            <div style="font-weight:700;color:var(--ink-secondary)">Total to pay for ${count()} item${count()===1?'':'s'}</div>
          </div>
          <div class="due">${money(total())}</div>
        </div>
        <div class="pm">
          <button class="pm-btn" data-a="pay-cash">
            <span class="ic">💵</span>
            <span class="name">Cash</span>
            <small>Pay with bills & coins, get change</small>
          </button>
          <button class="pm-btn" data-a="pay-qr">
            <span class="ic">📱</span>
            <span class="name">QR Payment</span>
            <small>Scan via GCash, Maya, or any QRPh app</small>
          </button>
          <button class="pm-btn" data-a="pay-card">
            <span class="ic">💳</span>
            <span class="name">Credit / Debit Card</span>
            <small>Tap, insert, or swipe with POS reader</small>
          </button>
        </div>
        <div class="actions">
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
  return `
    <main>
      <div class="wrap two">
        <div>
          <div class="page-head">
            <h1>Cash Payment</h1>
            <p class="sub">Enter the cash tendered by the customer.</p>
          </div>
          <div class="kv">
            <span>Total Amount Due</span>
            <b style="font-size:24px;color:var(--or)">${money(total())}</b>
          </div>
          <div class="disp-wrap">
            <span class="disp-lbl">Amount Tendered</span>
            <div class="disp ${S.err ? "err" : ""}">
              ${S.cash === "" ? `<span style="color:var(--mute)">₱0.00</span>` : "₱" + S.cash}
            </div>
          </div>
          ${S.err ? `<div class="msg bad">⚠ ${S.err}</div>` : ""}
          <div class="quick">
            <button data-a="q" data-v="exact">Exact</button>
            <button data-a="q" data-v="200">₱200</button>
            <button data-a="q" data-v="500">₱500</button>
            <button data-a="q" data-v="1000">₱1,000</button>
          </div>
          <div class="change-box ${ok ? "ok" : ""}">
            <span>Change</span>
            <b>${ok ? money(v - total()) : "—"}</b>
          </div>
        </div>
        <div>
          <div class="keys">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button data-a="k" data-v="${n}">${n}</button>`).join("")}
            <button data-a="k" data-v=".">.</button>
            <button data-a="k" data-v="0">0</button>
            <button data-a="k" data-v="bk">⌫</button>
          </div>
          <div class="actions">
            <button class="btn ghost" data-a="k" data-v="clr" style="flex:0.6">Clear</button>
            <button class="btn" data-a="paycash">Complete Payment →</button>
          </div>
          <div class="actions" style="margin-top:10px">
            <button class="btn ghost" data-a="method">← Change payment method</button>
          </div>
        </div>
      </div>
    </main>
  `;
}

function vQR() {
  return `
    <main>
      <div class="wrap two" style="align-items:center">
        <div class="qr-card">
          <div class="qr-frame">
            <svg viewBox="0 0 160 160" width="160" height="160" style="display:block">
              <!-- Finder 1 TL -->
              <rect x="0" y="0" width="48" height="48" rx="6" fill="#0f172a"/>
              <rect x="8" y="8" width="32" height="32" rx="4" fill="#ffffff"/>
              <rect x="16" y="16" width="16" height="16" rx="2" fill="#0f172a"/>
              <!-- Finder 2 TR -->
              <rect x="112" y="0" width="48" height="48" rx="6" fill="#0f172a"/>
              <rect x="120" y="8" width="32" height="32" rx="4" fill="#ffffff"/>
              <rect x="128" y="16" width="16" height="16" rx="2" fill="#0f172a"/>
              <!-- Finder 3 BL -->
              <rect x="0" y="112" width="48" height="48" rx="6" fill="#0f172a"/>
              <rect x="8" y="120" width="32" height="32" rx="4" fill="#ffffff"/>
              <rect x="16" y="128" width="16" height="16" rx="2" fill="#0f172a"/>
              <!-- Data Dots & Alignment -->
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
              <rect x="60" y="60" width="42" height="42" rx="8" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
              <text x="81" y="86" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" text-anchor="middle">🌅</text>
              
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
          <div class="qr-badge-row">
            <span class="qr-badge-pill">GCash</span>
            <span class="qr-badge-pill">Maya</span>
            <span class="qr-badge-pill">QRPh</span>
          </div>
        </div>
        <div>
          <div class="page-head">
            <h1>QR Code Payment</h1>
            <p class="sub">Scan using your mobile banking or e-wallet application.</p>
          </div>
          <div class="kv">
            <span>Amount to Pay</span>
            <b class="due" style="font-size:28px">${money(total())}</b>
          </div>
          <div class="step-list">
            <div class="step-item">
              <span class="step-badge">1</span>
              <span>Open your GCash, Maya, or any banking app that supports QRPh.</span>
            </div>
            <div class="step-item">
              <span class="step-badge">2</span>
              <span>Scan the QR code on screen and verify that the amount is <b>${money(total())}</b>.</span>
            </div>
            <div class="step-item">
              <span class="step-badge">3</span>
              <span>Confirm payment in your app, then tap the button below.</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn ghost" data-a="method">← Back</button>
            <button class="btn" data-a="confirmqr">✓ Confirm Payment</button>
          </div>
        </div>
      </div>
    </main>
  `;
}

function vCard() {
  return `
    <main>
      <div class="wrap two" style="align-items:center">
        <div class="card-terminal">
          <div class="card-icon-art">💳</div>
          <div style="font-weight:800;font-size:18px;color:var(--ink);margin-bottom:4px">POS Contactless Terminal</div>
          <small style="color:var(--mute)">Supports Visa, Mastercard, JCB & Apple/Google Pay</small>
        </div>
        <div>
          <div class="page-head">
            <h1>Credit / Debit Card</h1>
            <p class="sub">Tap, insert, or swipe your card on the payment terminal.</p>
          </div>
          <div class="kv">
            <span>Amount Due</span>
            <b class="due" style="font-size:28px">${money(total())}</b>
          </div>
          ${S.busy ? `
            <div class="msg good" style="background:var(--or-light);color:var(--or);border-color:var(--or-border);display:block">
              <div style="font-weight:700">⏳ Communicating with card terminal…</div>
              <div class="bar-prog"><i></i></div>
              <small style="display:block;margin-top:4px">Please do not remove your card until payment completes.</small>
            </div>
          ` : `
            <div class="step-list">
              <div class="step-item">
                <span class="step-badge">1</span>
                <span>Present your card near the contactless sensor or insert into slot.</span>
              </div>
              <div class="step-item">
                <span class="step-badge">2</span>
                <span>Follow prompts on the PIN pad if prompted for your PIN.</span>
              </div>
            </div>
          `}
          <div class="actions">
            <button class="btn ghost" data-a="method" ${S.busy ? "disabled" : ""}>← Back</button>
            <button class="btn" data-a="proccard" ${S.busy ? "disabled" : ""}>Process Payment</button>
          </div>
        </div>
      </div>
    </main>
  `;
}

function vSuccess() {
  const t = S.txn;
  return `
    <main>
      <div class="wrap" style="max-width:540px">
        <div class="center" style="margin-bottom:24px">
          <div class="ok-ic">✓</div>
          <h1>Payment Successful</h1>
          <p class="sub">Transaction completed successfully. Thank you for your order!</p>
        </div>
        <div class="panel">
          <div class="kv" style="border:0"><span>Transaction No.</span><b>${t.no}</b></div>
          <div class="kv"><span>Payment Method</span><b>${t.method}</b></div>
          <div class="kv"><span>Total Amount</span><b>${money(t.total)}</b></div>
          <div class="kv"><span>Amount Paid</span><b>${money(t.paid)}</b></div>
          <div class="kv"><span>Change Returned</span><b style="color:var(--ok)">${money(t.change)}</b></div>
        </div>
        <div class="actions">
          <button class="btn" data-a="receipt" style="width:100%">🧾 View Official Receipt</button>
        </div>
      </div>
    </main>
  `;
}

function vReceipt() {
  const t = S.txn;
  return `
    <main>
      <div class="wrap two" style="align-items:center">
        <div class="rc-wrap">
          <div class="rc">
            <h2>SUNRISE KIOSK</h2>
            <div class="center" style="font-size:12px;color:#64748b">Touchscreen Point of Sale</div>
            <hr>
            <div class="row"><span>Transaction No.</span><b>${t.no}</b></div>
            <div class="row"><span>Date & Time</span><span>${t.date}</span></div>
            <hr>
            ${t.items.map(i => `
              <div class="row">
                <span>${i.name}</span>
                <span>${money(i.sub)}</span>
              </div>
              <div class="row-sub">${i.qty} × ${money(i.price)}</div>
            `).join("")}
            <hr>
            <div class="row" style="font-size:18px">
              <b>TOTAL</b>
              <b>${money(t.total)}</b>
            </div>
            <hr>
            <div class="row"><span>Payment Method</span><span>${t.method}</span></div>
            <div class="row"><span>Amount Paid</span><span>${money(t.paid)}</span></div>
            <div class="row"><span>Change</span><span>${money(t.change)}</span></div>
            <div class="row"><span>Status</span><b style="color:#059669">Paid • Approved</b></div>
            <div class="rc-barcode">
              ||| | | |||| || | ||||| ||| |||| | ||
              <div style="margin-top:4px">THANK YOU FOR YOUR VISIT!</div>
            </div>
          </div>
        </div>
        <div>
          <div class="page-head">
            <h1>Your Official Receipt</h1>
            <p class="sub">Your payment has been recorded. Tap Start New Order when you are ready to serve the next customer.</p>
          </div>
          <button class="btn" style="width:100%;margin-top:14px" data-a="newtxn">+ Start New Order</button>
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
    case "newtxn":
      S = { screen: "order", cart: {}, method: null, cash: "", err: "", txn: null, busy: false };
      render();
      toast("New order started");
      break;
  }
});

render();
