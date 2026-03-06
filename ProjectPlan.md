

# 🌿 Krishi — Hackathon Round 2 Complete Guide

> **Congratulations on making Top 20 out of 220 groups! 🎉**
This guide covers EVERYTHING about your project so you can demo it perfectly tomorrow.
> 

---

## 🧠 What is Krishi? (Your 1-Line Pitch)

> **"Krishi is a blockchain-powered Ayurvedic herb traceability platform that connects farmers, testing labs, manufacturers, and consumers — ensuring every herb batch is transparent, quality-verified, and tamper-proof from farm to formula."**
> 

---

## 🏗️ Project Architecture Overview

```
Krishi/
├── index.html              → Landing Page + Full App Shell (SPA)
├── app.js                  → All 10 dashboard UIs + logic (2911 lines!)
├── auth.js                 → Firebase Auth (Google Sign-In + Email/Password + Role System)
├── blockchain-simulator.js → Blockchain + Smart Contracts simulation
├── styles.css              → Full design system
├── chatbot.js              → AI Chatbot assistant
├── i18n.js                 → Multi-language (English / Hindi / Gujarati)
├── exports.js              → CSV/PDF export functionality
├── notifications.js        → Toast notification system
├── search.js               → Global search across batches/herbs
├── smart-contracts-enhanced.js → Advanced smart contract UI
└── sw.js                   → Service Worker (PWA offline support)
```

---

## 🔑 Technology Stack (Tell the Judges This!)

| Layer | Technology |
| --- | --- |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (SPA), NEXT.js, shdcn.ui |
| **Blockchain** | Custom JavaScript blockchain simulator with SHA-like hashing , Next.js |
| **Authentication** | Firebase Auth (Google OAuth + Email/Password) |
| **Database** | Firebase Firestore (user roles, persistent data) |
| **Maps** | Leaflet.js + OpenStreetMap (GPS farm location) |
| **Charts** | Chart.js (analytics, lab comparisons) |
| **QR Codes** | html5-qrcode + QR Server API |
| **PDF** | jsPDF (lab certificates) |
| **Offline** | PWA with Service Worker |
| **Multilingual** | i18next (English, Hindi, Gujarati,Marathi) |

---

## 👥 User Roles (4 Types)

| Role | What They Can Access | Login As |
| --- | --- | --- |
| **Admin** | ALL dashboards | `admin@...` |
| **Farmer** | Farmer Dashboard, Insurance, Waste Mgmt | `farmer@...` |
| **Manufacturer** | Manufacturer, Inventory, Orders, DNA Banking | `manufacturer@...` |
| **Consumer** | Consumer Portal only | `consumer@...` |

> **⚠️ DEMO TIP:** Login with Google — the email determines your role. Use an admin email for demos to show ALL features.
> 

---

## 📋 All 10 Dashboards — What Each One Does

### 1. 🌱 Farmer Dashboard

**What it does:**

- **Tag New Herb Collection** form → Registers a new herb batch on the blockchain
- Fields: Farmer Name, Herb Type (8 herbs: Ashwagandha, Tulsi, Neem, etc.), Quantity (kg), Harvest Date
- **Live GPS Map** (Leaflet) → Captures farm location automatically
- **Weather Widget** → Shows weather alerts (simulated: "Rain in 2 days, harvest Tulsi before Sunday")
- **Market Rates Widget** → Shows current herb prices (₹450/kg for Ashwagandha, etc.)
- **SMS Verification** → Prompts for phone number, sends OTP simulation
- **View Recent Collections** → Lists last 5 batch submissions
- **Export Collections CSV** button

**Blockchain Action:** Creates a `collection` block with batchId, GPS coordinates, herbType, quantity, farmer info

---

### 2. 🧪 Testing Lab Dashboard

**What it does:**

- **Spectroscopy Analysis** → Visual bar simulation (purity 98.4%, wavelength 540-700nm)
- **Lab Credentials** → Shows ISO/IEC 17025:2017 certification badge
- **Test Herb Batch form:**
    - Select Batch dropdown (shows all batches from farmers)
    - Check Batch → Displays farmer name, herb, quantity, location
    - Test Parameters: Moisture %, Active Markers, Pesticides, Adulterants, Heavy Metals, Microbial Count
    - Upload Lab Report (PDF/Image)
    - Submit → Records `lab-test` block with PASS/FAIL result
- **Generate PDF Certificate** → Creates downloadable Krishi Test Certificate (jsPDF)
- **Batch Comparison Chart** → Line chart comparing moisture % and active markers across 5 batches
- **Batch Comparison** button

**Blockchain Action:** Creates `lab-test` block with testResult: 'pass' or 'fail'

---

### 3. 🏭 Manufacturer Dashboard

**What it does:**

- **Available Batch History** → Lists all farmer batches ready for testing
- **Send to Testing Lab** → Select a batch, sends it to lab (creates `send-to-lab` block)
- **Create Product** form:
    - Enter approved Batch ID → Check Status (verifies lab passed)
    - Product Name, Type (Powder/Capsule/Tablet/Extract/Oil), Mfg Date, Expiry Date
    - Submit → Creates product ID, **generates QR code** (via QR Server API)
- **Supplier Management** toggle → Shows 3 verified suppliers with ratings
- **Production Analytics** toggle → Bar chart (monthly batches) + Doughnut chart (quality ratio)
- **View Recent Products** button

**Blockchain Action:** Creates `manufacturing` block + generates scannable QR code linking to Consumer Portal

---

### 4. ♻️ Waste Management Dashboard

**What it does:**

- Register herb waste batches (Failed batches, expired herbs, processing waste)
- Types: Failed Quality, Expired, Processing Waste
- Disposal methods: Compost, Biogas, Submit to CPCB
- Track waste volume by category
- Integration with smart contracts

---

### 5. 🌿 Sustainability Dashboard

**What it does:**

- Carbon footprint tracking per herb batch
- Sustainable sourcing score per farmer
- Environmental impact metrics
- Sustainability trends charts

---

### 6. 📦 Inventory Dashboard

**What it does:**

- Track herb stock levels
- Low stock alerts
- Inventory value reports
- Batch status overview

---

### 7. 🚚 Orders Dashboard

**What it does:**

- Order management for manufactured products
- Order status tracking
- Delivery management

---

### 8. 🛡️ Insurance Dashboard

**What it does:**

- **Purchase crop insurance** for herb batches
- **File claims** when batches fail lab tests
- **Auto-claim processing** via smart contracts
- Policy management

---

### 9. 🧬 DNA Banking Dashboard

**What it does:**

- Register DNA profiles of herb varieties
- Authenticity verification via genetic markers
- Prevents herb adulteration at source level

---

### 10. 👤 Consumer Portal

**What it does:**

- **Scan QR code** or enter Product ID to trace history
- Shows **complete supply chain journey**: Farm → Lab → Manufacturing
- Timeline view of all blockchain transactions
- Verification seal showing blockchain security

---

## ⛓️ Blockchain System (How to Explain It)

### How Your Blockchain Works:

```jsx
// Each action creates a new BLOCK with:
{
  timestamp: "when it happened",
  data: { type, batchId, herbType, ...allDetails },
  previousHash: "links to previous block",
  hash: "unique fingerprint of this block"
}
```

### The Journey of One Herb Batch:

```
Block 1: collection
  → Farmer: "Ramesh Kumar"
  → Herb: Ashwagandha
  → Location: 23.25°N, 77.41°E
  → Quantity: 50kg
  → BatchID: "BATCH-1709123456789"

Block 2: send-to-lab
  → Manufacturer sends batch to testing

Block 3: lab-test
  → Moisture: 8.5%
  → Pesticides: None Detected
  → Result: PASS ✅

Block 4: manufacturing
  → Product: "Ashwagandha Premium Extract"
  → Type: Capsule
  → ProductID: "PROD-1709123456999"
  → QR Code generated

Block 5: smart-contract-event
  → Auto-payment released to farmer ✅
```

### Smart Contracts (4 built-in):

1. **PaymentContract** → Auto-pays farmers when product passes quality
2. **InsuranceContract** → Auto-files claims when batches fail
3. **QualityContract** → Sets herb-specific thresholds, auto-triggers payment
4. **SupplyChainContract** → Manages stakeholder reputation scores

---

## 🎭 DEMO SCRIPT — Step by Step

> Follow this exact flow for maximum impact. Do it in this order!
> 

### Step 1: Show the Landing Page (30 seconds)

- Open the website
- Highlight: "Transparency from Farm to Formula"
- Show the 4 steps: Farm Collection → Lab Testing → Manufacturing → Consumer Access
- Click "Get Started" to trigger login modal

### Step 2: Login (30 seconds)

- Click "Continue with Google"
- Show role-based access working
- If asked about roles, explain: "Email determines role — farmer@, manufacturer@, admin@ etc."

### Step 3: Farmer Dashboard — Register a Batch (2 minutes)

- Fill: Farmer Name = "Ramesh Patel"
- Select: Ashwagandha
- Quantity: 50 kg
- Date: today's date
- Show the GPS map auto-centering
- Click "Tag Location & Submit to Blockchain"
- **Say:** "This batch is now permanently recorded on the blockchain — immutable, timestamped"
- Show the batch ID generated (e.g., BATCH-1741234567)

### Step 4: Show Blockchain Visualization (30 seconds)

- Show how a new block was added to the chain
- Explain the hash linking previous blocks

### Step 5: Lab Dashboard — Test the Batch (2 minutes)

- Go to Lab Dashboard
- Select the batch you just created from the dropdown
- Click "Check Batch" → Show farmer details appearing
- Set: Moisture = 8.5, Pesticides = None, Heavy Metals = Within Limits, Microbial = Within Limits
- Submit → "Batch PASSED!"
- Click "Generate PDF Certificate" → Download the certificate
- **Say:** "This lab result is signed onto the blockchain — no one can alter it"

### Step 6: Manufacturer Dashboard (1.5 minutes)

- Show the batch appearing in the batch history
- Click "Send to Testing Lab" for another batch (optional)
- Go to "Create Product" → Enter the batch ID
- Check Status → Shows "PASSED" ✓
- Fill: Product Name = "Ashwagandha Premium Extract", Type = Capsule
- Submit → QR Code appears!
- **Say:** "This QR code contains the entire journey — anyone can scan it"

### Step 7: Consumer Portal — QR Scan (1 minute)

- Go to Consumer Portal
- Enter the Product ID
- Show the complete supply chain timeline
- **Say:** "Any consumer can verify their Ayurvedic product is authentic and quality-tested"

### Step 8: Show Smart Contracts (1 minute)

- Mention: "When the batch passed lab tests, the smart contract automatically released payment to the farmer — no middleman"
- Show insurance: "If a batch fails, insurance is automatically claimed"

### Step 9: Bonus Features (based on time available)

- **Language Switch** → Switch to Hindi or Gujarati to show multilingual support
- **Weather Widget** → Show crop advisory
- **Market Rates** → Show live herb prices
- **Sustainability Dashboard** → Carbon footprint tracking
- **DNA Banking** → Genetic authenticity verification

---

## 📊 Key Stats to Mention in Presentation

| Metric | Value |
| --- | --- |
| Lines of Code | ~4,500+ across all files |
| Dashboards Built | 10 complete role-based dashboards |
| Languages Supported | 3 (English, Hindi, Gujarati) |
| Smart Contracts | 4 (Payment, Insurance, Quality, Supply Chain) |
| Technologies Used | 10+ (Firebase, Leaflet, Chart.js, jsPDF, etc.) |
| Development Time | 5 months |
| Blockchain Type | Custom JS simulator with cryptographic hashing |
| Authentication | Firebase Google OAuth + Email/Password |

---

## 🎯 Problem Statement (For Judges)

### The Problem:

- India's Ayurvedic herb market is worth **₹30,000 crores**
- **70% of Ayurvedic products** have quality issues due to adulteration
- Farmers get **exploited** — no transparency on prices or payments
- No way for consumers to verify **authenticity** of herbs
- No digital trail from farm to product

### Our Solution — Krishi:

- ✅ **Blockchain traceability** — every herb batch tracked from GPS-tagged farm
- ✅ **Quality assurance** — lab testing recorded immutably on blockchain
- ✅ **Smart contracts** — automatic payments to farmers, no middlemen
- ✅ **Consumer trust** — QR code verification of any product's full history
- ✅ **Multilingual** — supports Hindi and Gujarati for rural farmer access
- ✅ **Multi-stakeholder** — unified platform for farmers, labs, manufacturers, consumers

---

## 🔥 WOW Moments for Judges

1. **Live GPS Map** — Show the actual map capturing farm location
2. **PDF Certificate** — Click generate, show professional lab certificate download
3. **QR Code** — Generate a QR code for a product, scan it on phone
4. **Language Switch** — Switch to Hindi mid-demo to show accessibility
5. **Smart Contract Auto-payment** — Explain automatic farmer payment on quality pass
6. **Blockchain Hash Chain** — Show the technical chain of linked blocks

---

## ⚠️ Common Questions Judges May Ask

**Q: Is this live blockchain or simulated?**

> "It uses a custom JavaScript blockchain simulator that implements real cryptographic hashing, block linking with previousHash verification, and immutability. For a production system, this would connect to Ethereum or Hyperledger Fabric."
> 

**Q: How is data stored?**

> "The blockchain data is stored in localStorage for demo purposes, user authentication and roles are stored in Firebase Firestore. In production, blockchain data would live on an actual distributed ledger."
> 

**Q: How do farmers access this — they may not have smartphones?**

> "Our UI supports Hindi and Gujarati. We designed for low-bandwidth use. In production, we'd add SMS-based batch tagging (already simulated in our SMS verification feature) and kiosk-based access at Farmer Producer Organizations."
> 

**Q: How do you prevent fake lab entries?**

> "Lab testers must be authenticated Firebase users with the 'lab' role. Their digital signature is recorded on every test. The hash chain makes any backdating or modification cryptographically detectable."
> 

**Q: What's the business model?**

> "SaaS subscription for large manufacturers (₹X per month), transaction fee on smart contract payments (1-2%), and a B2G (Government) licensing model where AYUSH Ministry requirements for traceability would make this mandatory infrastructure."
> 

---

## 🚀 Quick Setup If Something Goes Wrong

### If login doesn't work:

- Check internet connection (Firebase requires internet)
- Try incognito mode
- Firebase project: [Krishi.firebaseapp.com](http://Krishi.firebaseapp.com/)

### If map doesn't load:

- Allow location permission in browser
- If denied, it auto-generates a simulated location — that's fine for demo

### If QR code doesn't appear:

- Check internet (uses [api.qrserver.com](http://api.qrserver.com/))
- The Product ID still appears even if QR fails

### If fonts/icons don't load:

- Need internet for Google Fonts + Phosphor Icons CDN

### Offline mode:

- Service Worker is registered — if you've loaded once, it works offline

---

## 📝 1-Minute Elevator Pitch Script

> "Krishi solves a ₹30,000 crore problem in India's Ayurvedic sector. Currently, there's zero traceability — consumers can't verify their herbs are pure, farmers don't get paid fairly, and adulteration is rampant.
> 
> 
> We built a blockchain platform where farmers GPS-tag their herb collections, labs test and sign results on-chain, manufacturers create verified products with QR codes, and consumers scan to see the complete journey. Smart contracts automatically pay farmers when quality passes — no middlemen.
> 
> It supports Hindi and Gujarati for rural reach, generates PDF lab certificates, tracks sustainability metrics, and even has crop insurance built-in using smart contracts. 5 months of development, 10 dashboards, built on Firebase + custom blockchain."
> 

---

## 🌟 Good Luck Tomorrow!

You built something AMAZING in 5 months. The judges will see:

- A **real-world problem** with a **complete technical solution**
- **Professional UI/UX** with role-based access
- **Multiple technologies** integrated seamlessly
- **Rural India focus** with multilingual support
- **End-to-end workflow** — not just a concept but a working system

**You deserve to win. Go show them what Krishi can do! 💪🏽**