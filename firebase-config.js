// ═══════════════════════════════════════════════════════════════
// 🌿 KRISHI — Firebase Configuration
// ═══════════════════════════════════════════════════════════════

const firebaseConfig = {
  // ⚠️ REPLACE these with YOUR real Firebase config values
  apiKey: "YOUR_API_KEY",
  authDomain: "krishi-herb-traceability.firebaseapp.com",
  projectId: "krishi-herb-traceability",
  storageBucket: "krishi-herb-traceability.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not available in this browser');
  }
});

console.log('🌿 Firebase initialized for Krishi');