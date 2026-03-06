// Firebase Configuration
// Generated for Krishi Herb Traceability project

const firebaseConfig = {
  apiKey: "AIzaSyCmYYYyjTpWQ3jp8t_AjMsYb4zEggkM11M",
  authDomain: "krishi-herb-traceability.firebaseapp.com",
  projectId: "krishi-herb-traceability",
  storageBucket: "krishi-herb-traceability.firebasestorage.app",
  messagingSenderId: "215810749439",
  appId: "1:215810749439:web:d929cc30bc1400856badca"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Export for use in other modules
window.firebaseConfig = firebaseConfig;
window.db = db;
window.auth = auth;
window.storage = storage;

// Enable Firestore offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all features of Firestore offline persistence.');
    }
  });

console.log('✅ Firebase initialized successfully');