# 🌿 Krishi — Blockchain-Powered Ayurvedic Herb Traceability Platform

A comprehensive supply chain management and traceability solution for Ayurvedic herbs using blockchain technology, smart contracts, and cross-platform verification.

**Live Demo:** https://krishi-herb-traceability.firebaseapp.com

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- **🌾 Herb Batch Tagging** - Farmers register herb batches with GPS location, variety, and harvest date
- **🧪 Lab Testing System** - Quality evaluation with automated smart contract assessment
- **🏭 Manufacturing Dashboard** - Create products from tested batches with QR code generation
- **👤 Consumer Portal** - Trace product authenticity with complete supply chain verification
- **⛓️ Blockchain Explorer** - Visual representation and validation of immutable supply chain records

### Advanced Features
- **📜 Smart Contracts** - 4 integrated smart contracts for quality, payments, insurance, and reputation
- **🧬 DNA Banking** - Genetic profile registration for herb authenticity verification
- **♻️ Waste Management** - Track and log herb waste disposal with environmental compliance
- **🛡️ Insurance System** - Automatic claim filing for failed batches
- **📦 Inventory Management** - Real-time tracking of stock across supply chain
- **🛒 Order Management** - B2B and B2C order processing
- **🌍 Sustainability Dashboard** - Carbon footprint tracking and environmental metrics
- **📱 QR Code Verification** - Instant product authentication via mobile scanner
- **🌐 Multilingual Support** - English, Hindi, Gujarati, Marathi

---

## 📁 Project Structure

```
Aarohan-26-CSI-RAIT-Apex/
├── index.html                    # Main application shell
├── styles.css                    # Complete design system (1600+ lines)
├── app.js                        # Core application logic
├── auth.js                       # Firebase authentication & role management
├── blockchain-simulator.js       # Blockchain engine & hash calculations
├── smart-contract-enhanced.js    # Smart contracts for quality, payments, insurance
├── chatbot.js                    # AI chatbot with knowledge base
├── i18n.js                       # Internationalization system
├── search.js                     # Global search functionality
├── notifications.js              # Toast notification system
├── exports.js                    # CSV/PDF export utilities
├── firebase-config.js            # Firebase initialization
├── firebase.json                 # Firebase hosting configuration
├── firestore.rules               # Security rules (role-based access)
├── storage.rules                 # Cloud Storage security rules
├── database.rules.json           # Realtime Database rules
├── manifest.json                 # PWA manifest
├── sw.js                         # Service worker for offline support
├── locales/                      # Translation files
│   ├── en/translation.json       # English
│   ├── hi/translation.json       # Hindi
│   ├── gu/translation.json       # Gujarati
│   └── mr/translation.json       # Marathi
├── assets/
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   ├── images/                   # Promotional images
│   └── fonts/                    # Custom fonts
└── .firebaserc                   # Firebase project configuration
```

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Advanced design system with CSS variables and animations
- **JavaScript (ES6+)** - Vanilla JS for modularity and performance
- **Leaflet.js** - Interactive maps for farm location tracking
- **Chart.js** - Analytics visualizations
- **html5-qrcode** - QR code scanning
- **jsPDF** - PDF generation for lab reports
- **html5-qrcode** - QR code generation

### Backend & Services
- **Firebase Authentication** - Email, Google Sign-In
- **Firestore** - Real-time NoSQL database
- **Cloud Storage** - Lab reports & certificates storage
- **Firebase Hosting** - Production deployment

### Progressive Web App (PWA)
- Service Worker for offline functionality
- App manifest for installability
- Responsive design for mobile & desktop

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 14+ (for Firebase CLI)
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/Aarohan-26-CSI-RAIT-Apex.git
cd Aarohan-26-CSI-RAIT-Apex
```

### Step 2: Firebase Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select hosting, storage, firestore
# Choose your Firebase project: krishi-herb-traceability
```

### Step 3: Configure Firebase Credentials
Edit `firebase-config.js` with your Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "krishi-herb-traceability.firebaseapp.com",
  projectId: "krishi-herb-traceability",
  storageBucket: "krishi-herb-traceability.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Deploy to Firebase
```bash
# Build and deploy
firebase deploy

# Deploy specific resources
firebase deploy --only hosting         # Only frontend
firebase deploy --only firestore:rules # Only security rules
firebase deploy --only storage:rules   # Only storage rules
```

### Step 5: Local Development
```bash
# Start Firebase local emulator
firebase emulators:start

# Access local version at http://localhost:5000
```

---

## 🔧 Configuration

### Environment Variables
Create `.env.local` (not in repo):
```env
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Language Configuration
Edit `i18n.js` to add more languages:
```javascript
const langs = ['en', 'hi', 'gu', 'mr', 'ta', 'te']; // Add new codes
```

Add translation files in `locales/[lang]/translation.json`

### Firebase Collections Schema

```
users/
  └── {userId}
      ├── name: string
      ├── email: string
      ├── role: enum(farmer|lab|manufacturer|consumer|admin)
      ├── createdAt: timestamp
      └── uid: string

batches/
  └── {batchId}
      ├── batchId: string (BATCH-XXXX)
      ├── farmerName: string
      ├── herbType: enum
      ├── quantity: number (kg)
      ├── harvestDate: date
      ├── gps: {lat, lng}
      ├── status: enum(pending|passed|failed)
      ├── timestamp: timestamp
      └── createdBy: email

products/
  └── {productId}
      ├── productId: string (PROD-XXXX)
      ├── batchId: reference
      ├── productName: string
      ├── productType: enum
      ├── mfgDate: date
      ├── expiryDate: date
      ├── qrCode: string (base64)
      └── manufacturerEmail: string
```

---

## 🏗️ Architecture

### Authentication Flow
```
User Registration/Login
    ↓
Firebase Auth (Email/Google)
    ↓
Create/Fetch User Profile (Firestore)
    ↓
Detect Role from Email
    ↓
Show Role-Specific Dashboard
```

### Data Flow
```
Farmer Action (Tag Batch)
    ↓
Create Blockchain Block
    ↓
Save to Firestore
    ↓
Lab picks up Batch
    ↓
Run Quality Tests
    ↓
Smart Contract Evaluates Results
    ↓
Auto-payment OR Insurance Claim
    ↓
Manufacturer creates Product
    ↓
Generate QR Code
    ↓
Consumer Scans → Sees Full Chain
```

### Blockchain Structure
Each block contains:
- Block index
- Timestamp
- Block type (collection, lab-test, manufacturing, etc.)
- Transaction data
- Previous block hash
- Generated hash (SHA-256 style)
- Proof of work nonce

---

## 👥 User Roles

### 🌱 Farmer
- Register herb batches with GPS location
- View lab test results
- Receive payments on quality pass
- File insurance claims on failed batches

**Demo Account:**
- Email: `farmer@krishi.com`
- Password: `demo123`

### 🧪 Lab Technician
- Select pending batches for testing
- Input test parameters (moisture, pesticides, heavy metals, etc.)
- View automated quality assessment
- Generate lab certificates

**Demo Account:**
- Email: `lab@krishi.com`
- Password: `demo123`

### 🏭 Manufacturer
- View approved batches
- Create products with batch linking
- Generate QR codes for products
- Track production analytics

**Demo Account:**
- Email: `manufacturer@krishi.com`
- Password: `demo123`

### 👤 Consumer
- Search products by ID or scan QR code
- View complete supply chain journey
- Verify herb authenticity
- Access blockchain proof

**No Login Required** - Public access to verification portal

### ⚙️ Admin
- Full system access
- View all dashboards
- Manage users and roles
- Access analytics
- Seed demo data

**Demo Account:**
- Email: `admin@krishi.com`
- Password: `demo123`

---

## 🔒 Security

### Authentication & Authorization
- ✅ Role-based access control (RBAC)
- ✅ JWT tokens via Firebase Auth
- ✅ Secure password requirements
- ✅ Email verification
- ✅ Google OAuth 2.0 integration

### Data Security
- ✅ Strict Firestore security rules (role-based)
- ✅ Cloud Storage access control
- ✅ HTTPS only for all communications
- ✅ Encrypted customer data at rest

### Smart Contract Security
- ✅ Immutable blockchain records
- ✅ Cryptographic hash validation
- ✅ Transaction audit trails
- ✅ Prevents data tampering

### Best Practices
- Never commit `.env` files with real credentials
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor Firestore usage
- Enable MFA on admin accounts

---

## 📦 Deployment

### Firebase Hosting
```bash
firebase deploy
```

### Custom Domain
1. Go to Firebase Console → Hosting
2. Click "Connect Domain"
3. Update DNS records per Firebase instructions

### CI/CD (GitHub Actions)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] All dashboards load correctly
- [ ] Authentication works (email & Google)
- [ ] Batch submission creates blockchain entry
- [ ] Lab testing workflow functions
- [ ] QR code generation and scanning works
- [ ] Consumer portal displays supply chain
- [ ] Language switching (4 languages)
- [ ] Offline mode via Service Worker
- [ ] Responsive on mobile (480px+)
- [ ] Security rules enforce role access

---

## 📱 Mobile App (PWA)

Krishi works as a Progressive Web App:
- **Install on Phone Home Screen**
- **Offline Functionality** via Service Worker
- **Push Notifications** support
- **Responsive Design** for all screen sizes

Install: Open in Chrome → Menu → "Install Krishi"

---

## 🤖 Chatbot

KrishiBot is available 24/7 to help users understand:
- How to tag batches
- Lab testing procedures
- Blockchain verification
- Market rates for herbs
- Insurance coverage
- DNA banking services

Click the 🤖 button to open chatbot.

---

## 📊 Analytics & Monitoring

### Dashboard Metrics
- **Farmer Dashboard**: Batches submitted, test status, payments received
- **Lab Dashboard**: Batches tested, pass/fail ratio, testing time
- **Manufacturer Dashboard**: Products created, QR codes generated, sales
- **Admin Dashboard**: System-wide statistics, user reputation scores

### Firebase Monitoring
- Track real-time database usage
- Monitor authentication events
- Analyze Firestore queries
- Review error logs

---

## 🐛 Troubleshooting

### Firebase Connection Issues
```javascript
// Check in browser console
console.log(firebase.auth().currentUser);
console.log(db.enablePersistence);
```

### Blockchain Not Loading
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify blockchain data in Firestore

### CSS Not Applied
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check styles.css is linked in HTML head

### Service Worker Issues
- Unregister: Check DevTools → Application → Service Workers
- Clear cache: Storage → Clear site data
- Re-register on page reload

---

## 📈 Roadmap

### v2.0 (Q2 2026)
- [ ] Mobile app (React Native)
- [ ] Blockchain consensus algorithm
- [ ] Real crypto wallet integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (8+ languages)

### v3.0 (Q4 2026)
- [ ] AI-powered supply chain optimization
- [ ] IoT sensor integration for temp/humidity
- [ ] Decentralized verification network
- [ ] NFT certificates for premium herbs

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Coding Standards
- Use ES6+ syntax
- Follow existing code style
- Add comments for complex logic
- Test all new features
- Update README if needed

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Firebase** - Backend infrastructure
- **Leaflet.js** - Maps library
- **Chart.js** - Data visualization
- **Ayurveda Community** - Domain expertise
- **CSI-RAIT Team** - Project guidance

---

## 📞 Support & Contact

- **Email**: support@krishi.com
- **Twitter**: [@KrishiApp](https://twitter.com)
- **GitHub Issues**: [Report Bug](https://github.com/issues)
- **Discord**: [Join Community](https://discord.gg)

---

## 🌟 Show Your Support

If this project helps you, please:
- ⭐ Star this repository
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features
- 📢 Share with others

**Together, we're making Ayurvedic supply chains transparent and trustworthy!** 🌿

---

**Last Updated**: March 6, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
