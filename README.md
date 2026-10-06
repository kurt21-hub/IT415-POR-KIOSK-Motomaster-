# IT415 POS Kiosk - MotoMaster

**Course:** IT415 – Kiosk System  
**Section:** BSIT 4G  
**Project:** Sunrise Kiosk Touchscreen POS System  

---

## Project Description

Sunrise Kiosk is an interactive, modern Touchscreen Point-of-Sale (POS) self-service application developed for **IT415 (Kiosk System)**. Designed for cafe, quick-service, and retail dining environments, the system streamlines customer self-ordering through an intuitive, visual front-end interface built with zero external framework dependencies.

### Key Capabilities & Workflow:
1. **Interactive Touchscreen Catalog:**
   - Visual product tiles with high-definition photography, item names, and pricing.
   - Single-tap item selection with real-time in-tray badges and quantity caps.
2. **Dynamic Order Tray (Dock):**
   - Live order tray summarizing selected items, miniature thumbnails, and itemized subtotal calculations.
   - Stepper controls (`+` / `−`) and instant removal actions.
3. **Order Verification & Review:**
   - Comprehensive pre-payment itemized summary table with item breakdown and VAT-inclusive calculations.
4. **Multi-Channel Payment Processing:**
   - **Cash Register:** Interactive 64px on-screen numpad, digital LCD display, 5 Philippine Peso banknote presets (*Exact*, *₱100*, *₱200*, *₱500*, *₱1,000*), quick increment chips (*+₱20* to *+₱1,000*), animated bill acceptor slot guide, and real-time change/shortfall calculation.
   - **QR Ph E-Wallets:** Compliant with the BSP National QR Code Standard, featuring the official tri-color emblem, scanning laser beam animation, live 5-minute session countdown timer with auto-renewal, unique reference codes, and multi-wallet badges (*GCash*, *Maya*, *ShopeePay*, *Bank Apps*).
   - **Contactless EMV Smart POS:** Contactless POS terminal casing with quad EMV status LEDs, realistic 3D virtual card with gold chip and NFC wave symbols, magnetic sensor waves, and animated payment authorization processing.
5. **Transaction Tracking & Official Thermal Receipt:**
   - Persistent transaction numbering (`TXN-YYYY-#####`) saved to `localStorage`.
   - Elevated Payment Success confirmation card with order recap and change pickup indicators.
   - Authentic digital thermal receipt slip featuring jagged paper tear-off sawtooth edges, BIR registration metadata, itemized sales, barcodes, and print integration.

---

## Technologies Used

* **HTML5 (Semantic Web):** Semantic document structure, accessible input states, and responsive viewport configuration.
* **CSS3 (Vanilla Styling):** 
  * Modern CSS Custom Properties (Theme tokens, harmonious color palette, amber accent `#ea580c`).
  * CSS Grid and Flexbox layouts.
  * Keyframe micro-animations (`@keyframes scanLaser`, `blinkCursor`, `pulseWave`, `popSuccess`, `strokeCircle`, `strokeCheck`).
  * Pure white background kiosk theme (`data-theme="light"` / `#ffffff`) optimized for self-service touch screens.
  * Media queries (`@media`) for responsive scaling on desktop, tablets, and vertical kiosk displays.
* **JavaScript (Vanilla ES6+):**
  * Reactive UI rendering and modular view functions (`vOrder`, `vReview`, `vMethod`, `vCash`, `vQR`, `vCard`, `vSuccess`, `vReceipt`).
  * Event delegation via custom data attributes (`data-a`, `data-id`, `data-v`).
  * Asynchronous session countdown timers and simulated network payment delays.
  * Browser `localStorage` API for persistent transaction sequence counting.
* **Inline Scalable Vector Graphics (SVG):**
  * Handcrafted, lightweight vector illustrations for cash stacks, QR terminal smartphone frames, EMV card chips, NFC waves, and animated checkmarks.
* **Typography:** Google Fonts (*Plus Jakarta Sans*).
* **Media Assets:** Optimized high-resolution product photography (`.jpg`).

---

## Installation

This application requires **no external dependencies, build tools, package managers, or server installations**.

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/kurt21-hub/IT415-POR-KIOSK-Motomaster-.git
   ```

2. **Navigate to the Project Folder:**
   ```bash
   cd IT415-POR-KIOSK-Motomaster-
   ```

3. **Verify File Structure:**
   Ensure the following files are present:
   ```text
   ├── images/
   │   ├── coffee.jpg
   │   ├── sandwich.jpg
   │   ├── softdrinks.jpg
   │   ├── cookies.jpg
   │   ├── bottledwater.jpg
   │   └── chocolate.jpg
   ├── index.html
   ├── Sunrise Kiosk – Touchscreen POS.html
   ├── style.css
   ├── script.js
   └── README.md
   ```

---

## How to Run

### Method 1: Direct Browser Launch (Recommended / Quickest)
* Double-click or open either [`index.html`](./index.html) or [`Sunrise Kiosk – Touchscreen POS.html`](./Sunrise%20Kiosk%20–%20Touchscreen%20POS.html) directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, or Safari).

### Method 2: Visual Studio Code Live Server
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The application will launch automatically at `http://127.0.0.1:5500/`.

### Method 3: Python Built-in HTTP Server
Run a lightweight local HTTP server from PowerShell or terminal:
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## Group Members

| Member Name | Degree & Year | Role |
| :--- | :--- | :--- |
| **Jazzine Joy Cabuyadao** | BSIT 4G | UI/UX Designer & System Architect |
| **Kurt Angelo Daquigan** | BSIT 4G | QA Specialist & Technical Documentor  |
| **Albea Pallado** | BSIT 4G | Lead Programmer & Frontend Developer |

---

## Member Contributions

### **Jazzine Joy Cabuyadao**
* Designed the overall UI/UX structure and visual direction of the POS kiosk system.
* Developed the system's color palette, typography, product card layout, and touchscreen-oriented interface design.
* Planned the arrangement and interaction flow of the product catalog, order summary, payment selection, and transaction screens.
* Ensured interface elements use appropriate sizing, spacing, and visual hierarchy for touchscreen usability.
* Reviewed the overall system interface to maintain a consistent and user-friendly design.

### **Kurt Angelo Daquigan**
* Conducted functional and usability testing of the POS kiosk system to verify that major features operate correctly.
* Tested product selection, quantity controls, item removal, subtotal and total calculations, payment methods, transaction completion, and receipt generation.
* Verified system validation, including insufficient cash handling, invalid payment input, and transaction reset behavior.
* Identified and documented bugs, inconsistencies, and areas requiring improvement during system testing.
* Prepared and maintained technical documentation, including setup instructions, system specifications, testing evidence, and member contribution records.
* Organized GitHub repository documentation and assisted in verifying commits, branches, pull requests, and development evidence.

### **Albea Pallado**
* Developed and maintained the core functionality of the POS kiosk application using HTML, CSS, and JavaScript.
* Implemented product selection, cart management, quantity controls, subtotal and total calculations, and dynamic interface updates.
* Developed the payment functionality, including cash payment calculations, insufficient cash validation, QR payment simulation, and card payment simulation.
* Implemented transaction processing, payment-success behavior, unique transaction references, receipt generation, and new-transaction reset functionality.
* Integrated the UI/UX designs into the functional frontend and ensured the interface responds correctly to user interactions.
* Debugged and refactored application code to improve functionality, maintainability, and overall system performance.
