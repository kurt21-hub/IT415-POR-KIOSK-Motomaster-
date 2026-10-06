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
   - Visual catalog cards with clear pricing, item names, and custom-styled icon containers.
   - Real-time in-cart badges and quantity indicators.
   - Quick `+ Add` action directly on product tiles.

2. **Interactive Order Tray (Dock):**
   - Live order tray that displays selected items, unit prices, and subtotals.
   - Quantity stepper controls (`+` / `−`) with instant price recalculation.
   - Single-tap item removal.
   - Total item counter and live total amount.

3. **Order Review & Verification:**
   - Itemized order summary table detailing items, quantities, unit prices, and subtotals.
   - Highlighted payable amount box.
   - Easy navigation to return to menu without losing selections.

4. **Multi-Channel Payment Processing:**
   - **Cash Payment:**
     - Interactive on-screen numeric keypad (0–9, decimal, backspace, and clear).
     - Digital cash register display with currency formatting.
     - One-touch quick cash denomination buttons (*Exact*, *₱200*, *₱500*, *₱1,000*).
     - Real-time change calculation with positive visual confirmation.
     - Input validation and insufficient amount warnings.
   - **QR Code Payment:**
     - High-fidelity QR matrix display with GCash, Maya, and QRPh compatibility badges.
     - 3-step customer payment guidance.
   - **Credit / Debit Card Payment:**
     - Contactless card terminal simulation.
     - Processing feedback with animated progress bar and busy states.

5. **Transaction Tracking & Digital Receipt:**
   - Generates persistent transaction numbers (`TXN-YYYY-#####`) using browser `localStorage`.
   - Payment confirmation screen summarizing transaction details.
   - Authentic digital thermal receipt layout with store header, timestamp, itemized breakdown, payment summary, and barcode graphic.
   - One-tap "Start New Order" to reset the kiosk for the next customer.

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

- **[`Sunrise Kiosk – Touchscreen POS.html`](./Sunrise%20Kiosk%20–%20Touchscreen%20POS.html)** / **[`index.html`](./index.html)**: Clean HTML5 semantic layout, viewport setup, font imports, and external asset links.
- **[`style.css`](./style.css)**: Pure CSS3 styling, custom properties, white background theme, responsive layout, and transitions.
- **[`script.js`](./script.js)**: Vanilla JavaScript engine managing catalog data, order tray state, multi-channel payment flows, change calculations, and receipt generation.

---

## 🛠️ Tech Stack

- **Markup:** HTML5 (Semantic Structure)
- **Styling:** Vanilla CSS3 (`style.css` – Custom Properties, CSS Grid, Flexbox, Safe Area insets, Smooth Transitions)
- **Scripting:** Vanilla JavaScript (`script.js` – ES6+, DOM Manipulation, Event Delegation, LocalStorage API)
- **Typography:** Google Fonts (*Plus Jakarta Sans*)
