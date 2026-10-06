# Sunrise Kiosk – Touchscreen POS System
**Course:** IT415 – Kiosk System  
**Section:** BSIT 4G  

---

## 👥 Group Members

| Name | Role / Program |
| :--- | :--- |
| **Jazzine Joy Cabuyadao** | BSIT 4G |
| **Kurt Angelo Daquigan** | BSIT 4G |
| **Albea Pallado** | BSIT 4G |

---

## 📖 Project Overview

**Sunrise Kiosk** is an interactive, modern Touchscreen Point-of-Sale (POS) application designed for fast, seamless, and user-friendly self-service ordering. Built entirely with clean front-end web standards (HTML5, CSS3, and vanilla JavaScript), the system delivers an intuitive touchscreen experience for cafe and food-service environments.

---

## ✨ Key Features

1. **Product Menu & Touchscreen Catalog:**
   - Visual catalog cards with clear pricing, item names, and high-resolution product photography matched to each item.
   - Real-time in-cart badges and quantity indicators.
   - Quick `+ Add` action directly on product tiles.

2. **Interactive Order Tray (Dock):**
   - Live order tray displaying selected item thumbnails, names, unit prices, and subtotals.
   - Quantity stepper controls (`+` / `−`) with instant price recalculation.
   - Single-tap item removal.
   - Total item counter and live total amount.

3. **Order Review & Verification:**
   - Itemized order summary table detailing items, quantities, unit prices, and subtotals.
   - Highlighted payable amount box.
   - Easy navigation to return to menu without losing selections.

4. **Revamped Multi-Channel Payment Experience:**
   - **Payment Channel Selection:**
     - Interactive Payment Overview card displaying total due, item count pill, VAT-inclusive badge, and live thumbnails of ordered items.
     - 3 rich, high-fidelity payment cards with bespoke vector SVG illustrations, channel badges, accepted network pills, and hover lift effects:
       - **Cash Register** (Philippine Peso banknotes & coins)
       - **QR Ph & E-Wallets** (Instant dynamic QR with BSP QR Ph standard)
       - **Credit / Debit Card** (Contactless EMV chip & NFC tap)
   - **Cash Payment Screen:**
     - Digital cash register LCD display with blinking cursor and quick clear button.
     - 5 Philippine banknote presets (*Exact*, *₱100*, *₱200*, *₱500*, *₱1,000*).
     - Quick bill increment chips (*+₱20*, *+₱50*, *+₱100*, *+₱500*, *+₱1,000*) for fast bill stacking.
     - Real-time change and shortfall balance calculation with color-coded feedback.
     - Physical kiosk bill acceptor slot visual guide with animated entry indicator.
     - Tactile 64px touchscreen numpad with backspace icon and dedicated action buttons.
   - **National QR Ph Code Screen:**
     - Authentic Philippine QR Ph standard terminal stand featuring the official tri-color emblem and merchant header.
     - Scanning reticles and animated laser beam sweep across the dynamic QR code matrix.
     - Live 5-minute session countdown timer (`04:59`) with auto-renewal and unique reference code.
     - Compatible e-wallet badges (*GCash*, *Maya*, *ShopeePay*, *QR Ph*, *All Bank Apps*).
     - Step-by-step customer scan instructions and one-tap "Simulate Instant App Scan & Pay" demo button.
   - **Smart POS Contactless Card Terminal Screen:**
     - Interactive smart POS terminal casing featuring 4 EMV contactless indicator LEDs and digital prompt screen.
     - Realistic virtual 3D EMV card with metallic gold chip, NFC wave symbol, masked number (`•••• 4242`), and card network emblem.
     - Radiating NFC sensor wave animations simulating real-world contactless detection.
     - Real-time transaction processing simulation with animated card tap motion, bank authorization spinner, and live progress bar.

5. **Revamped Payment Success & Authentic Thermal Receipt:**
   - **Payment Success Screen (`vSuccess`):**
     - Animated SVG checkmark bubble with smooth pop-in and stroke draw animations.
     - Official status pill badge (`Payment Approved • BIR Registered POS`).
     - Modern Transaction Card featuring clear key-value alignments with distinct labels and values (no cramped text).
     - Live order items preview strip displaying miniature product thumbnails and quantities purchased.
     - Itemized financial summary detailing VATable Sales (Net of VAT), 12% VAT amount, and highlighted total.
     - Dynamic Change callout card: color-coded green dispenser alert when change is due, or blue settled indicator for exact payments.
     - Dual touchscreen actions: direct access to `"View Official Thermal Receipt"` and `"Start New Order"`.
   - **Authentic Thermal Receipt Slip (`vReceipt`):**
     - Simulated thermal paper slip emerging from a POS hardware dispenser slot with animated printer status LED.
     - Realistic jagged paper tear-off sawtooth top and bottom edges.
     - Authentic store header with BIR registration details, tax breakdown, itemized quantities, and totals.
     - Crisp barcode graphic with transaction identifier and official customer invoice disclaimer.
     - Built-in `"🖨️ Print Receipt Copy"` action integrating with native browser thermal printing.

6. **Modern, Eye-Friendly UI Design:**
   - Clean, professional color palette with warm sunrise accents (`#ea580c`) and neutral slates.
   - Clean, bright white background kiosk theme designed for optimal self-service touchscreen clarity and readability.
   - Modern typography powered by Google Fonts (*Plus Jakarta Sans*).
   - Generous touch targets (min. 44px–56px) optimized for kiosk touchscreens.

---

## 🚀 How to Run the Application

1. **Prerequisites:**
   - Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
   - No web server, database, or dependencies required.

2. **Launching the Kiosk:**
   - Simply double-click or open [`Sunrise Kiosk – Touchscreen POS.html`](./Sunrise%20Kiosk%20–%20Touchscreen%20POS.html) or [`index.html`](./index.html) in your browser.

---

## 📁 Project Architecture

- **[`images/`](./images/)**: High-quality product images mapped to each catalog item (`coffee.jpg`, `sandwich.jpg`, `softdrinks.jpg`, `cookies.jpg`, `bottledwater.jpg`, `chocolate.jpg`).
- **[`Sunrise Kiosk – Touchscreen POS.html`](./Sunrise%20Kiosk%20–%20Touchscreen%20POS.html)** / **[`index.html`](./index.html)**: Clean HTML5 semantic layout, viewport setup, font imports, and external asset links.
- **[`style.css`](./style.css)**: Pure CSS3 styling, custom properties, white background theme, responsive layout, and transitions.
- **[`script.js`](./script.js)**: Vanilla JavaScript engine managing catalog data, order tray state, multi-channel payment flows, change calculations, and receipt generation.

---

## 🛠️ Tech Stack

- **Markup:** HTML5 (Semantic Structure)
- **Styling:** Vanilla CSS3 (`style.css` – Custom Properties, CSS Grid, Flexbox, Safe Area insets, Smooth Transitions)
- **Scripting:** Vanilla JavaScript (`script.js` – ES6+, DOM Manipulation, Event Delegation, LocalStorage API)
- **Typography:** Google Fonts (*Plus Jakarta Sans*)
