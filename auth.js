// auth.js
// Firebase Auth Integration for vaidyachain with Google Sign-In

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDh5cV49WlNazPCGBK5R52LTTwKG7xk1tE",
    authDomain: "vaidyachain.firebaseapp.com",
    projectId: "vaidyachain",
    storageBucket: "vaidyachain.firebasestorage.app",
    messagingSenderId: "211911202172",
    appId: "1:211911202172:web:24e547f43185744c8c40f9",
    measurementId: "G-JXJTMQKPKG"
};

// Firestore database reference
let db = null;

// User roles configuration
const USER_ROLES = {
    ADMIN: 'admin',
    FARMER: 'farmer',
    MANUFACTURER: 'manufacturer',
    CONSUMER: 'consumer'
};

// Role-based sidebar visibility
const ROLE_SIDEBAR_CONFIG = {
    [USER_ROLES.ADMIN]: [
        'nav-farmer', 'nav-lab', 'nav-manufacturer', 'nav-purchased-batches', 'nav-waste-management',
        'nav-smart-contracts', 'nav-sustainability', 'nav-inventory', 'nav-circular-sourcing',
        'nav-insurance', 'nav-dna-banking', 'nav-consumer'
    ],
    [USER_ROLES.FARMER]: [
        'nav-farmer', 'nav-smart-contracts', 'nav-insurance', 'nav-waste-management'
    ],
    [USER_ROLES.MANUFACTURER]: [
        'nav-lab', 'nav-manufacturer', 'nav-purchased-batches', 'nav-inventory', 'nav-circular-sourcing', 'nav-dna-banking'
    ],
    [USER_ROLES.CONSUMER]: [
        'nav-consumer'
    ]
};

// Current user state
let currentUser = null;
let currentUserRole = null;

// Initialize Firebase Auth
document.addEventListener("DOMContentLoaded", () => {
    initializeFirebase();
});

async function initializeFirebase() {
    try {
        // Initialize Firebase app
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Initialize Firestore
        db = firebase.firestore();
        console.log('Firestore initialized successfully');

        // Start blockchain real-time sync
        if (typeof vaidyachain !== 'undefined' && vaidyachain.startFirebaseSync) {
            vaidyachain.startFirebaseSync();
        }

        // Listen for auth state changes
        firebase.auth().onAuthStateChanged(async (user) => {
            console.log('Auth state changed:', user ? user.email : 'null');

            // Remove initial loading state from body
            document.body.classList.remove('auth-loading');

            if (user) {
                // User is signed in
                currentUser = user;

                // FIRST: Try to get user role from Firestore (source of truth)
                let role = await getUserRoleFromFirestore(user.uid);
                console.log('Role from Firestore:', role);

                if (role) {
                    // Found role in Firestore, use it
                    console.log('Using Firestore role:', role);
                } else {
                    // No role in Firestore, check localStorage
                    const storedData = localStorage.getItem('vaidyachain_user');
                    console.log('Stored data:', storedData);

                    if (storedData) {
                        const parsed = JSON.parse(storedData);
                        console.log('Parsed stored data:', parsed);

                        // Check if this is the same user
                        if (parsed.email === user.email && parsed.role) {
                            role = parsed.role;
                            console.log('Using localStorage role for same user:', role);

                            // Migrate to Firestore
                            await saveUserRoleToFirestore(user.uid, user.email, user.displayName, role);
                            console.log('Migrated user data to Firestore');
                        } else {
                            // Different user or no role, assign default
                            role = USER_ROLES.CONSUMER;
                            console.log('Different user or no role, using default:', role);
                        }
                    } else {
                        // No stored data, assign default role
                        role = USER_ROLES.CONSUMER;
                        console.log('No stored data, using default role:', role);
                    }
                }

                currentUserRole = role;
                console.log('Final role assigned:', role);

                // Update localStorage for quick access
                const userData = {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    role: role
                };
                localStorage.setItem('vaidyachain_user', JSON.stringify(userData));

                // Update UI for logged in user
                updateUIForLoggedInUser(user, currentUserRole);
                applyRoleBasedSidebar(currentUserRole);

                // Check if a specific dashboard was requested in the URL
                const urlParams = new URLSearchParams(window.location.search);
                const requestedDashboard = urlParams.get('dashboard');

                // Hide home page, show dashboard
                showAppDashboard();

                if (requestedDashboard) {
                    if (typeof showDashboard === 'function') {
                        showDashboard(requestedDashboard);
                    }
                }

                if (window.showNotification) {
                    window.showNotification(`Welcome, ${user.displayName || user.email}!`, 'success');
                }
            } else {
                // User is signed out
                currentUser = null;
                currentUserRole = null;
                updateUIForLoggedOutUser();
                applyRoleBasedSidebar(null);

                // Show home page
                showHomePage();
            }
        });

        // Setup login buttons
        setupLoginButtons();

    } catch (error) {
        console.error("Firebase Initialization Error:", error);
    }
}

// Save user role to Firestore
async function saveUserRoleToFirestore(uid, email, displayName, role) {
    try {
        if (!db) {
            console.error('Firestore not initialized');
            return false;
        }

        const userRef = db.collection('users').doc(uid);
        await userRef.set({
            email: email,
            displayName: displayName || email,
            role: role,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log('User role saved to Firestore:', { uid, email, role });
        return true;
    } catch (error) {
        console.error('Error saving user role to Firestore:', error);
        return false;
    }
}

// Get user role from Firestore
async function getUserRoleFromFirestore(uid) {
    try {
        if (!db) {
            console.error('Firestore not initialized');
            return null;
        }

        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (doc.exists) {
            const data = doc.data();
            console.log('User data from Firestore:', data);
            return data.role || null;
        } else {
            console.log('No user document found in Firestore for uid:', uid);
            return null;
        }
    } catch (error) {
        console.error('Error getting user role from Firestore:', error);
        return null;
    }
}

// Setup login buttons
function setupLoginButtons() {
    // Sidebar login button
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", showLoginModal);
    }

    // Sidebar logout button - keep as fallback if it exists
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    // New Topbar logout button
    const logoutBtnTopbar = document.getElementById("logout-btn");
    if (logoutBtnTopbar) {
        logoutBtnTopbar.addEventListener("click", handleLogout);
    }

    // Profile Dropdown Toggle
    setupProfileDropdown();
}

function setupProfileDropdown() {
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = profileDropdown.style.display === 'block';
            profileDropdown.style.display = isVisible ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }
}

// Get user role from email pattern
function getUserRole(email) {
    const userEmail = (email || '').toLowerCase();

    if (userEmail.includes('admin')) return USER_ROLES.ADMIN;
    if (userEmail.includes('farmer')) return USER_ROLES.FARMER;
    if (userEmail.includes('manufacturer') || userEmail.includes('manufacture')) return USER_ROLES.MANUFACTURER;
    if (userEmail.includes('consumer')) return USER_ROLES.CONSUMER;
    if (userEmail.includes('lab') || userEmail.includes('test')) return USER_ROLES.MANUFACTURER;

    return USER_ROLES.CONSUMER;
}

// Show login modal with Google Sign-In
function showLoginModal() {
    let modal = document.getElementById('login-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'login-modal';
        modal.className = 'login-modal-overlay';
        modal.innerHTML = `
            <div class="login-modal-content">
                <button class="login-modal-close" onclick="closeLoginModal()">
                    <i class="ph ph-x"></i>
                </button>
                
                <div class="login-modal-header">
                    <div class="login-logo">
                        <img src="https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" alt="vaidyachain">
                    </div>
                    <h2 id="modal-title">Welcome to vaidyachain</h2>
                    <p id="modal-subtitle">Sign in to access your dashboard</p>
                </div>
                
                <div class="login-modal-body">
                    <!-- Toggle between Login and Register -->
                    <div class="auth-toggle">
                        <button type="button" class="toggle-btn active" id="login-toggle" onclick="switchAuthMode('login')">
                            Already Registered
                        </button>
                        <button type="button" class="toggle-btn" id="register-toggle" onclick="switchAuthMode('register')">
                            Register
                        </button>
                    </div>
                    
                    <!-- Login Form -->
                    <div id="login-form" class="auth-form active">
                        <!-- Email/Password Fields -->
                        <div class="form-group" style="margin-bottom: 0.6rem;">
                            <label for="login-email" style="font-size: 0.8rem; font-weight: 600; color: var(--foreground); display:block; margin-bottom:0.25rem;">Email Address</label>
                            <input type="email" id="login-email" placeholder="your@email.com"
                                   style="width:100%; padding:0.45rem 0.75rem; border:1.5px solid var(--border); border-radius:var(--radius); font-size:0.85rem; outline:none; transition:border-color 0.2s; box-sizing:border-box;"
                                   onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                        </div>
                        <div class="form-group" style="margin-bottom: 0.75rem;">
                            <label for="login-password" style="font-size: 0.8rem; font-weight: 600; color: var(--foreground); display:block; margin-bottom:0.25rem;">Password</label>
                            <div style="position:relative;">
                                <input type="password" id="login-password" placeholder="Enter your password"
                                       style="width:100%; padding:0.45rem 2.2rem 0.45rem 0.75rem; border:1.5px solid var(--border); border-radius:var(--radius); font-size:0.85rem; outline:none; transition:border-color 0.2s; box-sizing:border-box;"
                                       onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'"
                                       onkeydown="if(event.key==='Enter') handleEmailSignIn()">
                                <button type="button" onclick="const i=document.getElementById('login-password'); i.type=i.type==='password'?'text':'password'; this.innerHTML=i.type==='password'?'<i class=\'ph ph-eye\'></i>':'<i class=\'ph ph-eye-slash\'></i>';"
                                        style="position:absolute; right:0.6rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--muted-foreground); padding:0; font-size:0.95rem; line-height:1;">
                                    <i class="ph ph-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" id="email-signin-btn" class="primary-btn" onclick="handleEmailSignIn()" style="width:100%; padding:0.5rem; font-size:0.875rem; font-weight:600; margin-bottom:0.75rem;">
                            <i class="ph ph-sign-in" style="margin-right:0.3rem;"></i> Sign In
                        </button>
                        <div style="display:flex; align-items:center; gap:0.6rem; margin:0.5rem 0 0.75rem;">
                            <span style="flex:1; height:1px; background:var(--border);"></span>
                            <span style="font-size:0.75rem; color:var(--muted-foreground); white-space:nowrap;">or continue with</span>
                            <span style="flex:1; height:1px; background:var(--border);"></span>
                        </div>
                        <button type="button" id="google-signin-btn" class="google-signin-btn" onclick="handleGoogleSignIn()" style="padding:0.45rem 1rem; font-size:0.85rem;">
                            <svg class="google-icon" viewBox="0 0 24 24" style="width:16px;height:16px;">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Continue with Google</span>
                        </button>
                    </div>
                    
                    <!-- Register Form -->
                    <div id="register-form" class="auth-form" style="display: none;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem 0.75rem; margin-bottom:0.5rem;">
                            <div style="grid-column:1/-1;">
                                <label style="font-size:0.8rem; font-weight:600; display:block; margin-bottom:0.2rem;">Full Name</label>
                                <input type="text" id="register-name" placeholder="Your full name"
                                       style="width:100%; padding:0.45rem 0.75rem; border:1.5px solid var(--border); border-radius:var(--radius); font-size:0.85rem; outline:none; box-sizing:border-box;"
                                       onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                            </div>
                            <div style="grid-column:1/-1;">
                                <label style="font-size:0.8rem; font-weight:600; display:block; margin-bottom:0.2rem;">Email Address</label>
                                <input type="email" id="register-email" placeholder="your@email.com"
                                       style="width:100%; padding:0.45rem 0.75rem; border:1.5px solid var(--border); border-radius:var(--radius); font-size:0.85rem; outline:none; box-sizing:border-box;"
                                       onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                            </div>
                            <div>
                                <label style="font-size:0.8rem; font-weight:600; display:block; margin-bottom:0.2rem;">Password</label>
                                <input type="password" id="register-password" placeholder="Min. 6 characters"
                                       style="width:100%; padding:0.45rem 0.75rem; border:1.5px solid var(--border); border-radius:var(--radius); font-size:0.85rem; outline:none; box-sizing:border-box;"
                                       onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                            </div>
                            <div>
                                <label style="font-size:0.8rem; font-weight:600; display:block; margin-bottom:0.2rem;">I am a</label>
                                <select id="register-role"
                                        style="width:100%; padding:0.45rem 0.75rem; border:1.5px solid var(--border); border-radius:var(--radius); font-size:0.85rem; outline:none; box-sizing:border-box; background:white;"
                                        onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
                                    <option value="consumer">Consumer</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="manufacturer">Manufacturer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" class="primary-btn" onclick="handleRegister()" style="width:100%; padding:0.5rem; font-size:0.875rem; font-weight:600; margin-top:0.5rem;">
                            <i class="ph ph-user-plus" style="margin-right:0.3rem;"></i> Create Account
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Switch between login and register modes
function switchAuthMode(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');

    if (mode === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
        modalTitle.textContent = 'Welcome to vaidyachain';
        modalSubtitle.textContent = 'Sign in to access your dashboard';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginToggle.classList.remove('active');
        registerToggle.classList.add('active');
        modalTitle.textContent = 'Create Your Account';
        modalSubtitle.textContent = 'Join vaidyachain to get started';
    }
}

// Selected login role
let selectedLoginRole = 'consumer';

// Select login role
function selectLoginRole(role) {
    selectedLoginRole = role;

    // Update UI
    document.querySelectorAll('.role-select-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.role === role) {
            btn.classList.add('selected');
        }
    });
}

// Handle Email/Password Sign-In
async function handleEmailSignIn() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const signInBtn = document.getElementById('email-signin-btn');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        if (window.showNotification) window.showNotification('Please enter both email and password.', 'error');
        else alert('Please enter both email and password.');
        return;
    }

    if (signInBtn) {
        signInBtn.disabled = true;
        signInBtn.innerHTML = '<div class="loading-spinner" style="width:16px;height:16px;display:inline-block;margin-right:0.5rem;"></div> Signing in…';
    }

    try {
        const result = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = result.user;

        console.log('Email Sign-In successful for:', user.email);

        // Get role from Firestore (source of truth)
        let userRole = await getUserRoleFromFirestore(user.uid);

        if (!userRole) {
            // Fallback: check localStorage
            const stored = localStorage.getItem('vaidyachain_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.email === user.email && parsed.role) {
                    userRole = parsed.role;
                    await saveUserRoleToFirestore(user.uid, user.email, user.displayName, userRole);
                }
            }
        }

        if (!userRole) {
            // Final fallback: derive from email pattern
            userRole = getUserRole(user.email);
            await saveUserRoleToFirestore(user.uid, user.email, user.displayName, userRole);
        }

        const userData = {
            email: user.email,
            displayName: user.displayName || email.split('@')[0],
            photoURL: user.photoURL,
            uid: user.uid,
            role: userRole
        };
        localStorage.setItem('vaidyachain_user', JSON.stringify(userData));

        currentUser = user;
        currentUserRole = userRole;

        closeLoginModal();
        updateUIForLoggedInUser(user, userRole);
        applyRoleBasedSidebar(userRole);
        showAppDashboard();

        if (window.showNotification) {
            window.showNotification(`Welcome back, ${user.displayName || user.email}!`, 'success');
        }

    } catch (error) {
        console.error('Email Sign-In Error:', error);

        let msg = 'Sign-in failed. Please try again.';
        if (error.code === 'auth/user-not-found') msg = 'No account found with this email. Please register first.';
        else if (error.code === 'auth/wrong-password') msg = 'Incorrect password. Please try again.';
        else if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
        else if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password. Please check and try again.';
        else if (error.code === 'auth/too-many-requests') msg = 'Too many failed attempts. Please try again later or reset your password.';
        else if (error.code === 'auth/network-request-failed') msg = 'Network error. Please check your connection.';

        if (window.showNotification) window.showNotification(msg, 'error');
        else alert(msg);

    } finally {
        if (signInBtn) {
            signInBtn.disabled = false;
            signInBtn.innerHTML = '<i class="ph ph-sign-in" style="margin-right:0.4rem;"></i> Sign In';
        }
    }
}

// Handle Google Sign-In
async function handleGoogleSignIn() {
    const googleBtn = document.getElementById('google-signin-btn');
    googleBtn.disabled = true;
    googleBtn.innerHTML = '<div class="loading-spinner"></div><span>Signing in...</span>';

    try {
        // Create Google provider
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');

        // Sign in with popup
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;

        console.log('Google Sign-In successful for:', user.email);

        // FIRST: Check if user exists in Firestore (SOURCE OF TRUTH)
        let userRole = await getUserRoleFromFirestore(user.uid);
        console.log('Role from Firestore:', userRole);

        if (userRole) {
            // User exists in Firestore, use their stored role
            console.log('Existing user found in Firestore with role:', userRole);
        } else {
            // User not found in Firestore by UID, try to find by email
            // This handles the case where user registered with email/password first
            // and then signs in with Google using the same email
            userRole = await findUserByEmailInFirestore(user.email);
            console.log('Role found by email search:', userRole);

            if (userRole) {
                // Found user by email, update Firestore with correct UID
                await saveUserRoleToFirestore(user.uid, user.email, user.displayName, userRole);
                console.log('Updated Firestore with existing role for Google user');
            } else {
                // Truly a new user - use selected role or default
                userRole = selectedLoginRole || USER_ROLES.CONSUMER;
                console.log('New user, assigning role:', userRole);

                // Save new user to Firestore
                await saveUserRoleToFirestore(user.uid, user.email, user.displayName, userRole);
            }
        }

        // Update localStorage for quick access
        const userData = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            role: userRole
        };

        localStorage.setItem('vaidyachain_user', JSON.stringify(userData));
        console.log('Google Sign-In - Final user data:', userData);

        currentUser = user;
        currentUserRole = userRole;

        // Close modal
        closeLoginModal();

        // Update UI
        updateUIForLoggedInUser(user, userRole);
        applyRoleBasedSidebar(userRole);
        showAppDashboard();

        if (window.showNotification) {
            window.showNotification(`Welcome, ${user.displayName || user.email}!`, 'success');
        }

    } catch (error) {
        console.error('Google Sign-In Error:', error);

        let errorMessage = 'Sign-in failed. Please try again.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in cancelled. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Popup blocked. Please allow popups for this site.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection.';
        }

        if (window.showNotification) {
            window.showNotification(errorMessage, 'error');
        } else {
            alert(errorMessage);
        }
    } finally {
        googleBtn.disabled = false;
        googleBtn.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
        `;
    }
}

// Find user by email in Firestore (for users who registered with email/password first)
async function findUserByEmailInFirestore(email) {
    try {
        if (!db) {
            console.error('Firestore not initialized');
            return null;
        }

        const usersRef = db.collection('users');
        const querySnapshot = await usersRef.where('email', '==', email).get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            console.log('Found user by email in Firestore:', data);
            return data.role || null;
        }

        console.log('No user found with email:', email);
        return null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
    }
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = '';
}

// Handle registration with email/password
async function handleRegister() {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    // Validation
    if (!name || !email || !password) {
        if (window.showNotification) {
            window.showNotification('Please fill in all fields', 'error');
        } else {
            alert('Please fill in all fields');
        }
        return;
    }

    if (password.length < 6) {
        if (window.showNotification) {
            window.showNotification('Password must be at least 6 characters long', 'error');
        } else {
            alert('Password must be at least 6 characters long');
        }
        return;
    }

    try {
        // Create user with email/password
        const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = result.user;

        // Update display name
        await user.updateProfile({
            displayName: name
        });

        // Save user role to Firestore (PRIMARY STORAGE)
        await saveUserRoleToFirestore(user.uid, email, name, role);
        console.log('Registration - Role saved to Firestore:', role);

        // Store user data with selected role in localStorage (for quick access)
        const userData = {
            email: user.email,
            displayName: name,
            photoURL: user.photoURL,
            uid: user.uid,
            role: role
        };

        localStorage.setItem('vaidyachain_user', JSON.stringify(userData));
        console.log('Registration - Stored user data:', userData);

        currentUser = user;
        currentUserRole = role;

        // Close modal
        closeLoginModal();

        // Update UI
        updateUIForLoggedInUser(user, role);
        applyRoleBasedSidebar(role);
        showAppDashboard();

        if (window.showNotification) {
            window.showNotification(`Welcome, ${name}! Account created successfully.`, 'success');
        }

    } catch (error) {
        console.error('Registration Error:', error);

        let errorMessage = 'Registration failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists. Please log in instead.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use at least 6 characters.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection.';
        }

        if (window.showNotification) {
            window.showNotification(errorMessage, 'error');
        } else {
            alert(errorMessage);
        }
    }
}

// Handle logout
async function handleLogout() {
    try {
        await firebase.auth().signOut();

        currentUser = null;
        currentUserRole = null;
        localStorage.removeItem('vaidyachain_user');

        updateUIForLoggedOutUser();
        applyRoleBasedSidebar(null);
        showHomePage();

        if (window.showNotification) {
            window.showNotification('Logged out successfully', 'info');
        }

    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Show home page
function showHomePage() {
    const homePage = document.getElementById('home-page');
    const appContainer = document.querySelector('.app-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const hero = document.getElementById('hero');

    if (homePage) homePage.style.display = 'block';
    if (appContainer) appContainer.style.display = 'none';
    if (hero) hero.style.display = 'none';
    if (dashboardContainer) dashboardContainer.innerHTML = '';
}

// Show app dashboard
function showAppDashboard() {
    const homePage = document.getElementById('home-page');
    const appContainer = document.querySelector('.app-container');
    const hero = document.getElementById('hero');

    if (homePage) homePage.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';
    if (hero) hero.style.display = 'block';
}

// Update UI when user is logged in
function updateUIForLoggedInUser(user, role) {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userEmailSpan = document.getElementById('user-email');
    const userPhotoImg = document.getElementById('user-photo');
    const authContainer = document.getElementById('auth-container');

    if (loginBtn) {
        loginBtn.style.display = 'none';
    }

    if (userInfo) {
        userInfo.style.display = 'flex';
        if (userEmailSpan) {
            userEmailSpan.textContent = user.displayName || user.email;
        }
        if (userPhotoImg && user.photoURL) {
            userPhotoImg.src = user.photoURL;
            userPhotoImg.parentElement.style.display = 'flex';
        }
    }

    // Ensure auth container is visible/hidden appropriately
    if (authContainer) {
        authContainer.style.display = 'none';
    }

    showRoleIndicator(role);
}

// Update UI when user is logged out
function updateUIForLoggedOutUser() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const authContainer = document.getElementById('auth-container');

    if (loginBtn) {
        loginBtn.style.display = 'block';
    }

    if (userInfo) {
        userInfo.style.display = 'none';
    }

    // Ensure auth container is visible when user is logged out
    if (authContainer) {
        authContainer.style.display = 'block';
    }

    hideRoleIndicator();
}

// Apply role-based sidebar visibility
function applyRoleBasedSidebar(role) {
    const allNavItems = document.querySelectorAll('.sidebar-nav li');

    if (!role) {
        allNavItems.forEach(item => {
            item.classList.add('show');
        });
        return;
    }

    // Hide all first
    allNavItems.forEach(item => {
        item.classList.remove('show');
    });

    // Get allowed nav items for this role
    const allowedNavIds = ROLE_SIDEBAR_CONFIG[role] || [];

    allowedNavIds.forEach(navId => {
        const navItem = document.getElementById(navId);
        if (navItem) {
            navItem.parentElement.classList.add('show');
        }
    });

    // Auto-redirect based on role
    if (typeof showDashboard === 'function') {
        if (role === USER_ROLES.FARMER) {
            showDashboard('farmer');
        } else if (role === USER_ROLES.MANUFACTURER) {
            showDashboard('manufacturer');
        } else if (role === USER_ROLES.ADMIN) {
            showDashboard('farmer');
        } else if (role === USER_ROLES.CONSUMER) {
            showDashboard('consumer');
        }
    }
}

// Show role indicator in topbar
function showRoleIndicator(role) {
    let indicator = document.getElementById('role-indicator');

    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'role-indicator';
        indicator.className = 'role-indicator';

        const topbarActions = document.querySelector('.topbar-actions');
        if (topbarActions) {
            topbarActions.insertBefore(indicator, topbarActions.firstChild);
        }
    }

    indicator.innerHTML = `<span class="role-badge role-${role}">${role.toUpperCase()}</span>`;
    indicator.classList.add('show');
}

// Hide role indicator
function hideRoleIndicator() {
    const indicator = document.getElementById('role-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Show login modal with pre-selected role
function showLoginModalWithRole(role) {
    selectedLoginRole = role;
    showLoginModal();

    // Set the role selection after modal is created
    setTimeout(() => {
        selectLoginRole(role);
    }, 100);
}

// Make functions globally available
window.showLoginModal = showLoginModal;
window.showLoginModalWithRole = showLoginModalWithRole;
window.closeLoginModal = closeLoginModal;
window.handleLogout = handleLogout;
window.handleGoogleSignIn = handleGoogleSignIn;
window.handleEmailSignIn = handleEmailSignIn;
window.selectLoginRole = selectLoginRole;
window.getCurrentUserRole = () => currentUserRole;
window.getCurrentUser = () => currentUser;
