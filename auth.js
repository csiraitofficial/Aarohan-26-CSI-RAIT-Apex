// Authentication System
// Handles Firebase Auth with role-based access control

// Role mapping based on email patterns
const ROLE_MAP = {
  'admin': ['admin@krishi.com', 'harshnpc21@gmail.com'],
  'farmer': ['farmer'],
  'lab': ['lab'],
  'manufacturer': ['manufacturer'],
  'consumer': [] // default role
};

// Global variables
let currentUser = null;
let userRole = null;

// Initialize authentication
function initAuth() {
  // Initialize blockchain first
  initBlockchainSystem();
  
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      userRole = await getUserRole(user.uid);
      
      // Show app container and hide landing page
      document.getElementById('landing-page').style.display = 'none';
      document.getElementById('app-container').style.display = 'flex';
      document.getElementById('loading-overlay').style.display = 'none';
      
      // Update UI with user info
      updateUserInterface();
      
      // Route to appropriate dashboard
      routeByRole(userRole);
      
      // Initialize blockchain viewer for all users
      if (typeof initBlockchainViewer === 'function') {
        initBlockchainViewer();
      }
    } else {
      // Show landing page and login modal
      document.getElementById('landing-page').style.display = 'flex';
      document.getElementById('app-container').style.display = 'none';
      document.getElementById('loading-overlay').style.display = 'none';
      
      // Show login modal
      showLoginModal();
    }
  });
}

// Initialize blockchain system
async function initBlockchainSystem() {
  try {
    // Load blockchain from localStorage
    if (typeof blockchain !== 'undefined') {
      blockchain.loadChain();
      console.log('✅ Blockchain loaded from localStorage');
    }
    
    // Load blockchain from Firestore
    if (typeof blockchain !== 'undefined') {
      await blockchain.loadFromFirestore();
      console.log('✅ Blockchain loaded from Firestore');
    }
    
    // Initialize smart contracts
    if (typeof contractRegistry !== 'undefined') {
      console.log('✅ Smart contracts initialized');
    }
    
  } catch (error) {
    console.error('Error initializing blockchain system:', error);
  }
}

// Get user role from Firestore
async function getUserRole(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data().role;
    } else {
      // Determine role based on email
      const role = determineRoleFromEmail(currentUser.email);
      await db.collection('users').doc(uid).set({
        email: currentUser.email,
        role: role,
        displayName: currentUser.displayName || currentUser.email.split('@')[0],
        photoURL: currentUser.photoURL,
        createdAt: new Date()
      });
      return role;
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'consumer'; // fallback role
  }
}

// Determine role based on email
function determineRoleFromEmail(email) {
  const emailLower = email.toLowerCase();
  
  // Check for exact matches first
  for (const [role, emails] of Object.entries(ROLE_MAP)) {
    if (emails.includes(emailLower)) {
      return role;
    }
  }
  
  // Check for partial matches
  for (const [role, patterns] of Object.entries(ROLE_MAP)) {
    for (const pattern of patterns) {
      if (emailLower.includes(pattern)) {
        return role;
      }
    }
  }
  
  return 'consumer'; // default role
}

// Route user to appropriate dashboard based on role
function routeByRole(role) {
  // Show/hide navigation items based on role
  const navItems = document.querySelectorAll('.nav-menu li');
  navItems.forEach(item => {
    const roles = item.getAttribute('data-role');
    if (roles === 'all' || roles.includes(role)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Set page title
  document.getElementById('page-title').textContent = `${getRoleDisplayName(role)} Dashboard`;
  
  // Show appropriate dashboard
  hideAllDashboards();
  showDashboard(`${role}-dashboard`);
  
  // Update user info in sidebar
  updateUserInterface();
}

// Update user interface with current user info
function updateUserInterface() {
  if (!currentUser) return;
  
  const userNameEl = document.getElementById('user-name');
  const userRoleEl = document.getElementById('user-role');
  const userAvatarEl = document.getElementById('user-avatar');
  
  if (userNameEl) userNameEl.textContent = currentUser.displayName || currentUser.email.split('@')[0];
  if (userRoleEl) userRoleEl.textContent = getRoleDisplayName(userRole);
  if (userAvatarEl) {
    if (currentUser.photoURL) {
      userAvatarEl.style.backgroundImage = `url(${currentUser.photoURL})`;
      userAvatarEl.style.backgroundSize = 'cover';
      userAvatarEl.style.backgroundPosition = 'center';
    } else {
      userAvatarEl.textContent = (currentUser.displayName || currentUser.email.split('@')[0]).charAt(0).toUpperCase();
    }
  }
}

// Get display name for role
function getRoleDisplayName(role) {
  const roleNames = {
    'admin': 'Administrator',
    'farmer': 'Farmer',
    'lab': 'Lab Technician',
    'manufacturer': 'Manufacturer',
    'consumer': 'Consumer'
  };
  return roleNames[role] || role;
}

// Show/hide dashboards
function hideAllDashboards() {
  const dashboards = ['farmer-dashboard', 'lab-dashboard', 'manufacturer-dashboard', 'consumer-portal', 'admin-dashboard', 'blockchain-viewer'];
  dashboards.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.style.display = 'none';
  });
}

function showDashboard(dashboardId) {
  const element = document.getElementById(dashboardId);
  if (element) element.style.display = 'block';
}

// Google OAuth Sign In
async function signInWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch (error) {
    console.error('Google sign in error:', error);
    showAuthMessage('Google sign in failed. Please try again.', 'error');
  }
}

// Email/Password Sign In
async function signInWithEmail(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Email sign in error:', error);
    showAuthMessage('Invalid email or password. Please try again.', 'error');
  }
}

// Email/Password Registration
async function registerWithEmail(email, password, displayName) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({
      displayName: displayName
    });
  } catch (error) {
    console.error('Registration error:', error);
    showAuthMessage('Registration failed. Email might already be in use.', 'error');
  }
}

// Sign Out
async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Show auth message
function showAuthMessage(message, type = 'error') {
  const messageEl = document.getElementById('auth-message');
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize auth
  initAuth();
  
  // Get Started button
  const getStartedBtn = document.getElementById('get-started-btn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      showLoginModal();
    });
  }
  
  // Google Sign In button
  const googleSignInBtn = document.getElementById('google-signin-btn');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', signInWithGoogle);
  }
  
  // Email form submission
  const emailLoginForm = document.getElementById('email-login-form');
  if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
      await signInWithEmail(email, password);
    });
  }
  
  // Email registration button
  const emailRegisterBtn = document.getElementById('email-register-btn');
  if (emailRegisterBtn) {
    emailRegisterBtn.addEventListener('click', async () => {
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;
      const displayName = prompt('Enter your display name:');
      if (displayName) {
        await registerWithEmail(email, password, displayName);
      }
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', signOut);
  }
  
  // Language switcher
  const languageSwitcher = document.getElementById('language-switcher');
  if (languageSwitcher) {
    languageSwitcher.addEventListener('click', () => {
      document.getElementById('language-modal').style.display = 'flex';
    });
  }
  
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});

// Modal functions
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
}

function switchLoginTab(tab) {
  const googleSection = document.getElementById('google-login-section');
  const emailSection = document.getElementById('email-login-section');
  const googleTab = document.querySelector('.tab-btn[data-tab="google"]');
  const emailTab = document.querySelector('.tab-btn[data-tab="email"]');
  
  if (tab === 'google') {
    googleSection.style.display = 'block';
    emailSection.style.display = 'none';
    googleTab.classList.add('active');
    emailTab.classList.remove('active');
  } else {
    googleSection.style.display = 'none';
    emailSection.style.display = 'block';
    googleTab.classList.remove('active');
    emailTab.classList.add('active');
  }
}

// Export functions for global use
window.authSystem = {
  initAuth,
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  signOut,
  getUserRole,
  routeByRole
};