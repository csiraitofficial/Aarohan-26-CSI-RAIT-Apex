// ═══════════════════════════════════════════════════════════════
// 🔐 KRISHI — Authentication System
// ═══════════════════════════════════════════════════════════════

let currentUser = null;
let currentRole = null;

// ─── Role Detection ────────────────────────────────────────────
const ADMIN_EMAILS = ['admin@krishi.com', 'harshnpc21@gmail.com'];

function detectRoleFromEmail(email) {
  if (!email) return 'consumer';
  const lower = email.toLowerCase();

  if (ADMIN_EMAILS.includes(lower)) return 'admin';
  if (lower.includes('farmer')) return 'farmer';
  if (lower.includes('lab')) return 'lab';
  if (lower.includes('manufacturer') || lower.includes('mfg')) return 'manufacturer';
  return 'consumer';
}

// ─── Google Sign-In ────────────────────────────────────────────
async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    showToast(`Welcome, ${result.user.displayName}!`, 'success');
  } catch (error) {
    console.error('Google sign-in error:', error);
    showToast(`Login failed: ${error.message}`, 'error');
  }
}

// ─── Email Login ───────────────────────────────────────────────
async function handleEmailLogin(emailOrEvent, passwordParam) {
  let email, password;
  
  // Support both form event and direct parameters
  if (typeof emailOrEvent === 'string') {
    email = emailOrEvent;
    password = passwordParam;
  } else {
    // Event object from form submission
    emailOrEvent.preventDefault?.();
    email = document.getElementById('login-email').value;
    password = document.getElementById('login-password').value;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showToast('Login successful!', 'success');
  } catch (error) {
    console.error('Email login error:', error);
    showToast(`Login failed: ${error.message}`, 'error');
  }
}

// ─── Registration ──────────────────────────────────────────────
async function handleRegister(emailOrEvent, passwordParam, roleParam) {
  let email, password, role;
  
  // Support both form event and direct parameters
  if (typeof emailOrEvent === 'string') {
    email = emailOrEvent;
    password = passwordParam;
    role = roleParam;
  } else {
    // Event object from form submission
    emailOrEvent.preventDefault?.();
    email = document.getElementById('register-email').value;
    password = document.getElementById('register-password').value;
    role = document.getElementById('register-role').value;
  }

  if (!role) {
    showToast('Please select a role', 'warning');
    return;
  }

  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const displayName = email.split('@')[0];
    await result.user.updateProfile({ displayName });

    // Save user profile with selected role
    await db.collection('users').doc(result.user.uid).set({
      name: displayName,
      email,
      role,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: result.user.uid
    });

    showToast(`Account created! Welcome, ${displayName}!`, 'success');
  } catch (error) {
    console.error('Registration error:', error);
    showToast(`Registration failed: ${error.message}`, 'error');
  }
}

// ─── Get User Role from Firestore ──────────────────────────────
async function getUserRole(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
      return doc.data().role;
    }
    return null;
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
}

// ─── Set User Role ─────────────────────────────────────────────
async function setUserRole(uid, user) {
  const role = detectRoleFromEmail(user.email);

  await db.collection('users').doc(uid).set({
    name: user.displayName || user.email.split('@')[0],
    email: user.email,
    role,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid
  }, { merge: true });

  return role;
}

// ─── Sign Out ──────────────────────────────────────────────────
async function handleSignOut() {
  try {
    await auth.signOut();
    currentUser = null;
    currentRole = null;
    showToast('Logged out successfully', 'info');
  } catch (error) {
    showToast('Logout failed', 'error');
  }
}

// ─── Auth State Observer ───────────────────────────────────────
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;

    // Get or set role
    let role = await getUserRole(user.uid);
    if (!role) {
      role = await setUserRole(user.uid, user);
    }
    currentRole = role;

    // Update UI
    hideLoginModal();
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    document.getElementById('chatbot-container').style.display = 'block';

    // Set header info
    const displayName = user.displayName || user.email.split('@')[0];
    document.getElementById('user-display-name').textContent = displayName;

    const badge = document.getElementById('user-role-badge');
    badge.textContent = role.toUpperCase();
    badge.className = `role-badge ${role}`;

    // Setup sidebar visibility
    setupSidebarForRole(role);

    // Route to default dashboard
    routeByRole(role);

    // Initialize app data
    if (typeof initializeAppData === 'function') {
      initializeAppData();
    }

    console.log(`✅ User authenticated: ${displayName} (${role})`);
  } else {
    // User signed out
    currentUser = null;
    currentRole = null;
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('chatbot-container').style.display = 'none';
  }
});

// ─── Sidebar Role Setup ────────────────────────────────────────
function setupSidebarForRole(role) {
  const navItems = document.querySelectorAll('#nav-links li[data-roles]');
  navItems.forEach(item => {
    const roles = item.getAttribute('data-roles');
    if (roles === 'all' || roles.includes(role)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// ─── Route by Role ─────────────────────────────────────────────
function routeByRole(role) {
  const routes = {
    admin: 'admin-dashboard',
    farmer: 'farmer-dashboard',
    lab: 'lab-dashboard',
    manufacturer: 'manufacturer-dashboard',
    consumer: 'consumer-portal'
  };
  showDashboard(routes[role] || 'consumer-portal');
}

// ─── Login Modal ───────────────────────────────────────────────
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
}

function hideLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
}

function switchLoginTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  if (tab === 'login') {
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('login-tab').classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    document.getElementById('register-tab').classList.add('active');
  }
}

// ─── Consumer Trace (Public Access) ────────────────────────────
function showConsumerTrace() {
  if (!currentUser) {
    // Allow consumer trace without login
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    showDashboard('consumer-portal');
  }
}

// ─── KrishiAuth Wrapper Object (for compatibility) ────────────
const KrishiAuth = {
  get currentUser() {
    return currentUser;
  },
  get currentRole() {
    return currentRole;
  },
  
  signInWithGoogle() {
    return signInWithGoogle();
  },
  
  signInWithEmail(email, password) {
    return handleEmailLogin(email, password);
  },
  
  registerWithEmail(email, password, role) {
    return handleRegister(email, password, role);
  },
  
  signOut() {
    return handleSignOut();
  }
};

console.log('🔐 Auth module loaded');