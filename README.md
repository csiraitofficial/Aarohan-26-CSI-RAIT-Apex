# Krishi - Ayurvedic Herb Traceability Platform

A blockchain-powered Ayurvedic herb traceability platform connecting farmers, testing labs, manufacturers, and consumers to ensure transparent, quality-verified, and tamper-proof herb tracking from farm to formula.

## 🌿 Features

### Dashboard System
- **10 Comprehensive Dashboards**: Farmer, Testing Lab, Manufacturer, Waste Management, Sustainability, Inventory, Orders, Insurance, DNA Banking, and Consumer Portal
- **Role-Based Access**: Admin, Farmer, Manufacturer, and Consumer roles with appropriate permissions
- **Multi-language Support**: English, Hindi, and Gujarati

### Blockchain Technology
- **Immutable Records**: Blockchain-based transaction tracking
- **Smart Contracts**: 4 smart contracts for payment, insurance, quality assurance, and supply chain management
- **Real-time Tracking**: Live updates throughout the supply chain

### Advanced Features
- **QR Code Generation**: Product tracking and verification
- **PDF Certificate Generation**: Quality certification documents
- **Progressive Web App**: Offline functionality and mobile optimization
- **Interactive Charts**: Data visualization with Recharts

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Hook Form** for form management
- **Zustand** for state management

### Backend & Database
- **Firebase Authentication** (Google OAuth, Email/Password)
- **Firebase Firestore** for data storage
- **Firebase Cloud Functions** (for future smart contract integration)

### Additional Libraries
- **React Leaflet** for GPS mapping
- **Recharts** for data visualization
- **jsPDF** for PDF generation
- **react-qr-code** for QR code functionality
- **next-i18next** for internationalization

## 🚀 Quick Start

### Prerequisites
- Node.js (latest version)
- Firebase project with Auth and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/csiraitofficial/Aarohan-26-CSI-RAIT-Apex.git
   cd Aarohan-26-CSI-RAIT-Apex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase configuration**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication and Firestore services
   - Create `.env.local` file with your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Krishi/
├── app/                    → Next.js App Router directory
│   ├── layout.tsx          → Root layout with providers
│   ├── page.tsx            → Landing page
│   ├── dashboard/          → Dashboard pages
│   │   ├── layout.tsx      → Dashboard shell
│   │   ├── page.tsx        → Main dashboard
│   │   ├── farmer/         → Farmer dashboard
│   │   ├── lab/            → Testing lab dashboard
│   │   ├── manufacturer/   → Manufacturer dashboard
│   │   ├── waste/          → Waste management
│   │   ├── sustainability/ → Sustainability dashboard
│   │   ├── inventory/      → Inventory dashboard
│   │   ├── orders/         → Orders dashboard
│   │   ├── insurance/      → Insurance dashboard
│   │   ├── dna/            → DNA banking dashboard
│   │   └── consumer/       → Consumer portal
│   └── components/         → Shared components
├── components/             → React components
│   ├── ui/                 → shadcn/ui components
│   ├── dashboard/          → Dashboard-specific components
│   ├── blockchain/         → Blockchain visualization
│   ├── maps/               → Map components
│   └── charts/             → Chart components
├── lib/                    → Utility functions
│   ├── firebase.ts         → Firebase configuration
│   ├── blockchain.ts       → Blockchain logic
│   ├── auth.ts             → Authentication utilities
│   ├── contracts.ts        → Smart contract logic
│   └── utils.ts            → General utilities
├── hooks/                  → Custom React hooks
│   ├── useAuth.ts          → Authentication hook
│   ├── useBlockchain.ts    → Blockchain hook
│   ├── useDashboard.ts     → Dashboard data hook
│   └── useNotifications.ts → Notification hook
├── styles/                 → Global styles
│   ├── globals.css         → Tailwind imports
│   └── theme.css           → Custom styles
├── public/                 → Static assets
│   ├── images/             → Project images
│   ├── icons/              → App icons
│   └── manifest.json       → PWA manifest
├── next.config.js          → Next.js configuration
├── tailwind.config.js      → Tailwind CSS config
├── tsconfig.json           → TypeScript configuration
└── package.json            → Dependencies
```

## 🎯 Implementation Status

### ✅ Phase 1: Foundation Setup (In Progress)
- [x] Next.js project initialization with TypeScript and App Router
- [x] Tailwind CSS configuration
- [x] shadcn/ui component library setup
- [x] Basic project structure with app directory
- [x] Firebase integration configuration
- [x] Core dependencies installation
- [x] ESLint and TypeScript configuration
- [x] Basic layout and routing structure
- [ ] Firebase project creation and service enablement
- [ ] Firebase Authentication configuration
- [ ] Firebase Firestore setup for user roles and data storage

### 🚧 Phase 2: Blockchain Core (Next)
- [ ] Create blockchain hooks using React Context API with Firebase Firestore integration
- [ ] Implement block structure with timestamp, data, previousHash, hash stored in Firestore
- [ ] Build hash linking mechanism for immutability using Firestore transactions
- [ ] Create blockchain data persistence in Firebase Firestore collections
- [ ] Build blockchain visualization components with shadcn/ui

### 📋 Upcoming Phases
- Phase 3: Authentication & User Management
- Phase 4: Dashboard Development - Core Modules
- Phase 5: Advanced Dashboards
- Phase 6: Consumer Portal & Integration
- Phase 7: Advanced Features
- Phase 8: Testing & Optimization
- Phase 9: Documentation & Demo Preparation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding New Dashboards

1. Create a new directory in `app/dashboard/`
2. Add `page.tsx` for the main dashboard content
3. Update the navigation in `app/dashboard/layout.tsx`
4. Add any specific components to `components/dashboard/`

### Adding Smart Contracts

1. Define contract logic in `lib/contracts.ts`
2. Create UI components for contract management
3. Integrate with Firebase Firestore for data persistence
4. Add contract interactions to relevant dashboards

## 📱 PWA Features

The application is configured as a Progressive Web App with:
- Offline functionality
- App manifest for installation
- Service worker for caching
- Mobile-optimized interface

## 🔒 Security

- Firebase Authentication for secure user management
- Role-based access control
- Firestore security rules for data protection
- Input validation and sanitization

## 🌐 Multi-language Support

The application supports:
- English (default)
- Hindi
- Gujarati

Language files are located in `locales/` directory and can be extended for additional languages.

## 📊 Data Visualization

Interactive charts and graphs powered by Recharts:
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Doughnut charts for proportions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and Firebase
- UI components from shadcn/ui
- Charts powered by Recharts
- Blockchain logic inspired by Bitcoin protocol

## 📞 Contact

For questions and support, please contact the CSI RAIT team.

---

**Krishi** - Bringing transparency to Ayurvedic herb supply chains 🌿