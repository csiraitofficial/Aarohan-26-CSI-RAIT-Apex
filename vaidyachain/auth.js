/**
 * vaidyachain - Firebase Auth & RBAC
 * 
 * Roles:
 * - Admin (Full access)
 * - Farmer (Harvest, GPS, Insurance)
 * - Lab (Testing, PDF Certificates)
 * - Manufacturer (Production, QR Generation)
 * - Consumer (Search, Trace History)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyACUXNAOqbeM0011wKEAsZaxDT6_uxk_z0",
    authDomain: "kriti-c862c.firebaseapp.com",
    databaseURL: "https://kriti-c862c-default-rtdb.firebaseio.com",
    projectId: "kriti-c862c",
    storageBucket: "kriti-c862c.firebasestorage.app",
    messagingSenderId: "801041985002",
    appId: "1:801041985002:web:534c9e49435b6b20e75693",
    measurementId: "G-BN4Y46BK4Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export const AuthService = {
    user: null,
    role: 'guest',

    init(onUserFound) {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.user = user;
                this.role = await this.getUserRole(user.uid);
                onUserFound(user, this.role);
            } else {
                this.user = null;
                this.role = 'guest';
                onUserFound(null, null);
            }
        });
    },

    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            // Default new users to 'Farmer' for demo, Admin can change later
            await this.checkAndCreateUser(result.user);
            return result.user;
        } catch (error) {
            console.error("Auth Error:", error);
            throw error;
        }
    },

    async logout() {
        await signOut(auth);
        window.location.reload();
    },

    async checkAndCreateUser(user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            // New user registration
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photo: user.photoURL,
                role: 'Farmer', // Default role for demo purposes
                createdAt: new Date().toISOString()
            });
        }
    },

    async getUserRole(uid) {
        try {
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);
            return docSnap.exists() ? docSnap.data().role : 'Farmer';
        } catch (e) {
            console.warn("Firestore error, defaulting role to Farmer:", e);
            return 'Farmer';
        }
    }
};

export { auth, db };
