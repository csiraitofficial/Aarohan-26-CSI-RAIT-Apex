// Main Application Logic
// Handles dashboard interactions and UI state management

// Global state
let currentDashboard = null;
let notifications = [];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌿 Krishi Application Initialized');
  
  // Initialize role-based navigation
  initRoleBasedNavigation();
  
  // Initialize dashboard event listeners
  initDashboardListeners();
  
  // Initialize search functionality
  initSearch();
  
  // Initialize notifications
  initNotifications();
  
  // Initialize chatbot
  initChatbot();
  
  // Initialize exports
  initExports();
  
  // Initialize blockchain viewer
  initBlockchainViewer();
  
  // Initialize Farmer Dashboard
  initFarmerDashboard();
  
  // Initialize Lab Dashboard
  initLabDashboard();
  
  // Initialize Manufacturer Dashboard
  initManufacturerDashboard();
  
  // Initialize Consumer Portal
  initConsumerPortal();
  
  // Initialize Admin Dashboard
  initAdminDashboard();
  
  // Initialize user interface
  initUserInterface();
});

// Dashboard Navigation - Enhanced
function initDashboardListeners() {
  // Navigation links with role-based visibility
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').substring(1);
      navigateToDashboard(target);
    });
  });
  
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }
  
  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    });
  }
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('active') && 
        !e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-toggle')) {
      sidebar.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
    }
  });
  
  // Language switcher
  const languageSwitcher = document.getElementById('language-switcher');
  const languageIndicator = document.getElementById('language-indicator');
  
  if (languageSwitcher) {
    languageSwitcher.addEventListener('click', () => {
      const modal = document.getElementById('language-modal');
      if (modal) modal.style.display = 'flex';
    });
  }
  
  if (languageIndicator) {
    languageIndicator.addEventListener('click', () => {
      const modal = document.getElementById('language-modal');
      if (modal) modal.style.display = 'flex';
    });
  }
  
  // Close language modal
  const languageModal = document.getElementById('language-modal');
  if (languageModal) {
    languageModal.addEventListener('click', (e) => {
      if (e.target === languageModal) {
        languageModal.style.display = 'none';
      }
    });
  }
}

function navigateToDashboard(dashboardId) {
  // Update page title and icon
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const pageIcon = document.getElementById('page-icon');
  
  const dashboardConfig = {
    'farmer-dashboard': {
      title: 'Farmer Dashboard',
      subtitle: 'Tag new herb collections and manage your farm data',
      icon: '🌱'
    },
    'lab-dashboard': {
      title: 'Lab Testing Dashboard',
      subtitle: 'Quality testing and certification for herb batches',
      icon: '🧪'
    },
    'manufacturer-dashboard': {
      title: 'Manufacturer Dashboard',
      subtitle: 'Product creation and supply chain management',
      icon: '🏭'
    },
    'consumer-portal': {
      title: 'Consumer Portal',
      subtitle: 'Trace your Ayurvedic products from farm to formula',
      icon: '👤'
    },
    'admin-dashboard': {
      title: 'Admin Dashboard',
      subtitle: 'System management and oversight',
      icon: '⚙️'
    },
    'blockchain-viewer': {
      title: 'Blockchain Explorer',
      subtitle: 'View and verify the complete blockchain chain',
      icon: '⛓️'
    }
  };
  
  const config = dashboardConfig[dashboardId] || {
    title: 'Dashboard',
    subtitle: 'Welcome to Krishi Platform',
    icon: '📊'
  };
  
  if (pageTitle) pageTitle.textContent = config.title;
  if (pageSubtitle) pageSubtitle.textContent = config.subtitle;
  if (pageIcon) pageIcon.textContent = config.icon;
  
  // Show appropriate dashboard
  hideAllDashboards();
  showDashboard(dashboardId);
  
  // Update active navigation
  const navItems = document.querySelectorAll('.nav-menu li');
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.querySelector(`a[href="#${dashboardId}"]`)) {
      item.classList.add('active');
    }
  });
  
  // Update page icon color based on dashboard
  if (pageIcon) {
    const dashboardColors = {
      'farmer-dashboard': 'var(--color-primary)',
      'lab-dashboard': 'var(--color-info)',
      'manufacturer-dashboard': 'var(--color-accent)',
      'consumer-portal': 'var(--color-success)',
      'admin-dashboard': 'var(--color-blockchain)',
      'blockchain-viewer': 'var(--color-blockchain)'
    };
    
    const color = dashboardColors[dashboardId] || 'var(--color-primary)';
    pageIcon.style.background = `linear-gradient(135deg, ${color}, ${color})`;
  }
  
  currentDashboard = dashboardId;
  
  // Add dashboard-specific initialization
  switch (dashboardId) {
    case 'farmer-dashboard':
      initFarmerDashboard();
      break;
    case 'lab-dashboard':
      initLabDashboard();
      break;
    case 'manufacturer-dashboard':
      initManufacturerDashboard();
      break;
    case 'consumer-portal':
      initConsumerPortal();
      break;
    case 'admin-dashboard':
      initAdminDashboard();
      break;
    case 'blockchain-viewer':
      initBlockchainViewer();
      break;
  }
}

// Search Functionality
function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results-container');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchModal.style.display = 'flex';
      searchInput.focus();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      performSearch(query);
    });
  }
  
  // Close search modal
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.style.display = 'none';
    }
  });
}

function performSearch(query) {
  if (!query || query.length < 2) {
    document.getElementById('search-results-container').innerHTML = '';
    return;
  }
  
  // Search through blockchain data
  const results = [];
  
  // This would be implemented with actual search logic
  // For now, show placeholder results
  const searchResultsContainer = document.getElementById('search-results-container');
  searchResultsContainer.innerHTML = `
    <div class="search-result-item">
      <h4>Search Results for: "${query}"</h4>
      <p>Implementing search functionality...</p>
    </div>
  `;
}

// Notifications System
function initNotifications() {
  const notificationsBtn = document.getElementById('notifications-btn');
  const notificationsModal = document.getElementById('notifications-modal');
  const notificationsList = document.getElementById('notifications-list');
  const clearBtn = document.getElementById('clear-notifications-btn');
  
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', () => {
      notificationsModal.style.display = 'flex';
      updateNotificationsList();
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      notifications = [];
      updateNotificationsList();
      updateNotificationBadge();
      notificationsModal.style.display = 'none';
    });
  }
  
  // Close notifications modal
  notificationsModal.addEventListener('click', (e) => {
    if (e.target === notificationsModal) {
      notificationsModal.style.display = 'none';
    }
  });
}

function addNotification(message, type = 'info') {
  const notification = {
    id: Date.now(),
    message: message,
    type: type,
    timestamp: new Date(),
    read: false
  };
  
  notifications.unshift(notification);
  updateNotificationBadge();
  showToast(message, type);
}

function updateNotificationsList() {
  const notificationsList = document.getElementById('notifications-list');
  if (!notificationsList) return;
  
  if (notifications.length === 0) {
    notificationsList.innerHTML = '<p class="text-muted">No notifications</p>';
    return;
  }
  
  notificationsList.innerHTML = notifications.map(notification => `
    <div class="notification-item ${notification.read ? 'read' : 'unread'}">
      <div class="notification-content">
        <span class="notification-message">${notification.message}</span>
        <span class="notification-time">${formatTime(notification.timestamp)}</span>
      </div>
      <button class="btn-icon mark-read-btn" onclick="markNotificationRead(${notification.id})">
        <span class="ph ph-check"></span>
      </button>
    </div>
  `).join('');
}

function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  const unreadCount = notifications.filter(n => !n.read).length;
  
  if (badge) {
    badge.textContent = unreadCount > 0 ? unreadCount.toString() : '';
    badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
  }
}

function markNotificationRead(id) {
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    updateNotificationsList();
    updateNotificationBadge();
  }
}

// Chatbot
function initChatbot() {
  const chatbotFab = document.getElementById('chatbot-fab');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotMinimize = document.getElementById('chatbot-minimize');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');
  
  // Toggle chatbot
  [chatbotFab, chatbotToggle].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
      });
    }
  });
  
  // Minimize chatbot
  if (chatbotMinimize) {
    chatbotMinimize.addEventListener('click', () => {
      chatbotContainer.classList.remove('active');
    });
  }
  
  // Send message
  [chatbotSend, chatbotInput].forEach(element => {
    if (element) {
      element.addEventListener('click', sendMessage);
    }
  });
  
  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Close chatbot when clicking outside
  document.addEventListener('click', (e) => {
    if (!chatbotContainer.contains(e.target) && !chatbotFab.contains(e.target)) {
      chatbotContainer.classList.remove('active');
    }
  });
}

function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  
  if (!input || !messages) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  // Add user message
  addChatMessage(message, 'user');
  input.value = '';
  
  // Process message and respond
  setTimeout(() => {
    const response = getChatbotResponse(message);
    addChatMessage(response, 'bot');
  }, 1000);
}

function addChatMessage(text, sender) {
  const messages = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.innerHTML = `
    <div class="message-bubble">
      <span class="message-text">${text}</span>
      <span class="message-time">${formatTime(new Date())}</span>
    </div>
  `;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function getChatbotResponse(message) {
  const msg = message.toLowerCase();
  
  // Keyword-based responses
  if (msg.includes('help') || msg.includes('how')) {
    return "I can help you with:\n• Tagging herb collections\n• Understanding lab results\n• Creating products\n• Tracing supply chain\n• Using blockchain features\n\nWhat would you like to know more about?";
  }
  
  if (msg.includes('batch') || msg.includes('collection')) {
    return "To tag a new herb collection:\n1. Go to Farmer Dashboard\n2. Fill in the collection form\n3. Capture GPS location\n4. Submit to blockchain\n\nEach batch gets a unique ID and is permanently recorded!";
  }
  
  if (msg.includes('lab') || msg.includes('test')) {
    return "Lab testing process:\n1. Select a batch from the dropdown\n2. Check batch details\n3. Enter test parameters\n4. Upload lab report\n5. Submit result\n\nResults are stored immutably on the blockchain.";
  }
  
  if (msg.includes('product') || msg.includes('manufactur')) {
    return "To create a product:\n1. Go to Manufacturer Dashboard\n2. Check batch status (must pass lab test)\n3. Fill product details\n4. Generate QR code\n5. Product is ready for consumers to trace!";
  }
  
  if (msg.includes('trace') || msg.includes('qr') || msg.includes('scan')) {
    return "To trace a product:\n1. Go to Consumer Portal\n2. Enter product ID or scan QR code\n3. View complete supply chain journey\n4. See blockchain verification\n\nEvery step is transparent and verifiable!";
  }
  
  if (msg.includes('blockchain') || msg.includes('hash')) {
    return "Our blockchain:\n• Records every transaction permanently\n• Uses cryptographic hashing\n• Links blocks together securely\n• Provides full transparency\n• Cannot be altered or deleted\n\nEach block contains a unique hash that links to the previous block.";
  }
  
  if (msg.includes('thank')) {
    return "You're welcome! Is there anything else I can help you with today?";
  }
  
  return "I'm still learning about Krishi. For now, I can help with:\n• Herb collection process\n• Lab testing\n• Product creation\n• Supply chain tracing\n• Blockchain basics\n\nPlease ask about one of these topics!";
}

// Exports
function initExports() {
  const exportCsvBtn = document.getElementById('export-csv-btn');
  
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportCollectionsToCSV();
    });
  }
}

function exportCollectionsToCSV() {
  // This would export farmer collections to CSV
  const csvContent = "data:text/csv;charset=utf-8,";
  const header = "Batch ID,Farmer,Herb Type,Quantity,Harvest Date,Location\n";
  
  // Sample data - would be replaced with actual data
  const data = "BATCH-001,Ramesh Patel,Ashwagandha,50kg,2024-03-01,23.25°N,77.41°E\n";
  
  const encodedUri = encodeURI(csvContent + header + data);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "krishi-collections.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Blockchain Viewer
function initBlockchainViewer() {
  // Initialize blockchain visualization
  const blockchainVisualization = document.getElementById('blockchain-visualization');
  if (blockchainVisualization) {
    // This would render the blockchain chain visualization
    blockchainVisualization.innerHTML = `
      <div class="blockchain-info">
        <p>Blockchain visualization will be displayed here.</p>
        <p>Current chain length: <span id="chain-length-display">0</span></p>
      </div>
    `;
  }
  
  // Search form
  const searchForm = document.getElementById('blockchain-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const batchId = document.getElementById('search-batch-id').value;
      searchBlockchainByBatch(batchId);
    });
  }
}

async function searchBlockchainByBatch(batchId) {
  if (!batchId) return;
  
  const results = await blockchain.getBlocksByBatchId(batchId);
  const searchResults = document.getElementById('search-results');
  
  if (results.length === 0) {
    searchResults.innerHTML = '<p>No blocks found for this batch ID.</p>';
    return;
  }
  
  searchResults.innerHTML = `
    <h4>Found ${results.length} blocks for batch: ${batchId}</h4>
    <div class="blockchain-results">
      ${results.map(block => `
        <div class="block-result">
          <strong>Type:</strong> ${block.data.type}<br>
          <strong>Hash:</strong> ${block.hash.substring(0, 20)}...<br>
          <strong>Timestamp:</strong> ${new Date(block.timestamp).toLocaleString()}
        </div>
      `).join('')}
    </div>
  `;
}

// Dashboard Initializers
function initFarmerDashboard() {
  // Farmer dashboard specific initialization
  const herbForm = document.getElementById('herb-collection-form');
  if (herbForm) {
    herbForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitHerbCollection();
    });
  }
  
  // GPS location capture
  const captureLocationBtn = document.getElementById('capture-location-btn');
  if (captureLocationBtn) {
    captureLocationBtn.addEventListener('click', captureLocation);
  }
}

async function submitHerbCollection() {
  const farmerName = document.getElementById('farmer-name').value;
  const herbType = document.getElementById('herb-type').value;
  const quantity = document.getElementById('quantity').value;
  const harvestDate = document.getElementById('harvest-date').value;
  
  // Generate batch ID
  const batchId = `BATCH-${Date.now()}`;
  
  // Create blockchain block
  const block = await blockchain.addBlock(BLOCK_TYPES.COLLECTION, {
    batchId: batchId,
    farmerName: farmerName,
    herbType: herbType,
    quantity: quantity,
    harvestDate: harvestDate,
    location: getCurrentLocation() // Would be captured from GPS
  });
  
  showToast(`Herb collection tagged successfully! Batch ID: ${batchId}`, 'success');
  addNotification(`New herb collection added: ${herbType} (${quantity}kg)`, 'success');
  
  // Update recent collections display
  updateRecentCollections();
}

function captureLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = `${position.coords.latitude.toFixed(4)}°N, ${position.coords.longitude.toFixed(4)}°E`;
      const locationDisplay = document.getElementById('location-display');
      if (locationDisplay) {
        locationDisplay.textContent = `Location captured: ${location}`;
      }
      showToast('GPS location captured successfully!', 'success');
    }, (error) => {
      console.error('Error capturing location:', error);
      showToast('Unable to capture location. Please enable GPS.', 'error');
    });
  } else {
    showToast('Geolocation is not supported by this browser.', 'error');
  }
}

function getCurrentLocation() {
  // This would return the captured GPS coordinates
  return '23.25°N, 77.41°E'; // Placeholder
}

function updateRecentCollections() {
  // Update the recent collections list
  const collectionsList = document.getElementById('recent-collections');
  if (collectionsList) {
    collectionsList.innerHTML = `
      <div class="collection-item">
        <div>
          <strong>BATCH-001</strong><br>
          <span class="text-muted">Ashwagandha • 50kg • Mar 1, 2024</span>
        </div>
        <span class="text-success">✓ Blockchain</span>
      </div>
    `;
  }
}

function initLabDashboard() {
  // Lab dashboard specific initialization
  const checkBatchBtn = document.getElementById('check-batch-btn');
  if (checkBatchBtn) {
    checkBatchBtn.addEventListener('click', checkBatchDetails);
  }
  
  const labTestForm = document.getElementById('lab-test-form');
  if (labTestForm) {
    labTestForm.addEventListener('submit', submitLabTest);
  }
}

function checkBatchDetails() {
  const batchSelect = document.getElementById('batch-select');
  const batchInfo = document.getElementById('batch-info');
  
  if (batchSelect.value) {
    batchInfo.style.display = 'block';
    // Update batch info with selected batch details
    document.getElementById('batch-farmer').textContent = 'Ramesh Patel';
    document.getElementById('batch-herb').textContent = 'Ashwagandha';
    document.getElementById('batch-quantity').textContent = '50';
    document.getElementById('batch-location').textContent = '23.25°N, 77.41°E';
  }
}

async function submitLabTest(e) {
  e.preventDefault();
  
  const batchId = document.getElementById('batch-select').value;
  const moisture = document.getElementById('moisture').value;
  const activeMarkers = document.getElementById('active-markers').value;
  const pesticides = document.getElementById('pesticides').value;
  const adulterants = document.getElementById('adulterants').value;
  const heavyMetals = document.getElementById('heavy-metals').value;
  const microbial = document.getElementById('microbial').value;
  
  // Determine result
  const result = (pesticides === 'none' && adulterants === 'none' && 
                 heavyMetals === 'within-limits' && microbial === 'within-limits') ? 'PASS' : 'FAIL';
  
  // Create blockchain block
  const block = await blockchain.addBlock(BLOCK_TYPES.LAB_TEST, {
    batchId: batchId,
    testResult: result,
    parameters: {
      moisture: moisture,
      activeMarkers: activeMarkers,
      pesticides: pesticides,
      adulterants: adulterants,
      heavyMetals: heavyMetals,
      microbial: microbial
    }
  });
  
  showToast(`Lab test completed! Result: ${result}`, result === 'PASS' ? 'success' : 'error');
  addNotification(`Lab test for batch ${batchId}: ${result}`, result === 'PASS' ? 'success' : 'error');
}

function initManufacturerDashboard() {
  // Manufacturer dashboard specific initialization
  const checkStatusBtn = document.getElementById('check-batch-status-btn');
  if (checkStatusBtn) {
    checkStatusBtn.addEventListener('click', checkBatchStatus);
  }
  
  const productForm = document.getElementById('product-creation-form');
  if (productForm) {
    productForm.addEventListener('submit', createProduct);
  }
}

function checkBatchStatus() {
  const batchId = document.getElementById('approved-batch-id').value;
  const batchStatus = document.getElementById('batch-status');
  
  if (batchId) {
    batchStatus.style.display = 'block';
    batchStatus.innerHTML = `
      <div class="status-item">
        <span class="status-label">Batch Status:</span>
        <span class="status-value text-success">✓ PASSED LAB TEST</span>
      </div>
      <div class="status-item">
        <span class="status-label">Herb Type:</span>
        <span class="status-value">Ashwagandha</span>
      </div>
      <div class="status-item">
        <span class="status-label">Quantity:</span>
        <span class="status-value">50kg</span>
      </div>
    `;
  }
}

async function createProduct(e) {
  e.preventDefault();
  
  const batchId = document.getElementById('approved-batch-id').value;
  const productName = document.getElementById('product-name').value;
  const productType = document.getElementById('product-type').value;
  const mfgDate = document.getElementById('mfg-date').value;
  const expiryDate = document.getElementById('expiry-date').value;
  
  // Generate product ID
  const productId = `PROD-${Date.now()}`;
  
  // Create blockchain block
  const block = await blockchain.addBlock(BLOCK_TYPES.MANUFACTURING, {
    batchId: batchId,
    productId: productId,
    productName: productName,
    productType: productType,
    manufacturingDate: mfgDate,
    expiryDate: expiryDate
  });
  
  // Generate QR code
  const qrCodeContainer = document.getElementById('qr-section');
  if (qrCodeContainer) {
    qrCodeContainer.style.display = 'block';
    const qrCodeImg = document.getElementById('qr-code-img');
    if (qrCodeImg) {
      qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(productId)}`;
    }
  }
  
  showToast(`Product created successfully! Product ID: ${productId}`, 'success');
  addNotification(`New product created: ${productName} (${productType})`, 'success');
}

function initConsumerPortal() {
  // Consumer portal specific initialization
  const productForm = document.getElementById('product-trace-form');
  if (productForm) {
    productForm.addEventListener('submit', traceProduct);
  }
  
  // QR scanner initialization
  const startQrBtn = document.getElementById('start-qr-scan-btn');
  const stopQrBtn = document.getElementById('stop-qr-scan-btn');
  
  if (startQrBtn) {
    startQrBtn.addEventListener('click', startQrScanner);
  }
  
  if (stopQrBtn) {
    stopQrBtn.addEventListener('click', stopQrScanner);
  }
}

async function traceProduct(e) {
  e.preventDefault();
  
  const productId = document.getElementById('product-id-input').value;
  const timeline = document.getElementById('supply-chain-timeline');
  const verificationBadge = document.getElementById('verification-badge');
  
  if (productId) {
    // Simulate fetching product journey
    timeline.innerHTML = `
      <div class="timeline-step collection">
        <div class="step-icon">🌱</div>
        <div class="step-content">
          <h4>Herb Collection</h4>
          <p>Batch: ${productId}</p>
          <p class="hash-preview">#a1b2c3d4...</p>
        </div>
      </div>
      <div class="timeline-step lab-test">
        <div class="step-icon">🧪</div>
        <div class="step-content">
          <h4>Lab Testing</h4>
          <p>Result: PASS</p>
          <p class="hash-preview">#e5f6g7h8...</p>
        </div>
      </div>
      <div class="timeline-step manufacturing">
        <div class="step-icon">🏭</div>
        <div class="step-content">
          <h4>Product Manufacturing</h4>
          <p>Product ID: ${productId}</p>
          <p class="hash-preview">#i9j0k1l2...</p>
        </div>
      </div>
    `;
    
    verificationBadge.style.display = 'flex';
    showToast('Product trace completed successfully!', 'success');
  }
}

function startQrScanner() {
  const qrReader = document.getElementById('qr-reader');
  if (qrReader) {
    qrReader.style.display = 'block';
    // QR scanner would be initialized here
    qrReader.innerHTML = '<p>QR Scanner Active - Point camera at QR code</p>';
    
    document.getElementById('start-qr-scan-btn').style.display = 'none';
    document.getElementById('stop-qr-scan-btn').style.display = 'inline-block';
  }
}

function stopQrScanner() {
  const qrReader = document.getElementById('qr-reader');
  if (qrReader) {
    qrReader.style.display = 'none';
    qrReader.innerHTML = '';
    
    document.getElementById('start-qr-scan-btn').style.display = 'inline-block';
    document.getElementById('stop-qr-scan-btn').style.display = 'none';
  }
}

function initAdminDashboard() {
  // Admin dashboard specific initialization
  // This would include system overview, user management, etc.
}

// Utility Functions
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

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Role-Based Navigation
function initRoleBasedNavigation() {
  // This function would be called after user authentication
  // For now, we'll set up the basic structure
  const userRole = getCurrentUserRole();
  updateNavigationForRole(userRole);
}

function getCurrentUserRole() {
  // This would get the role from Firebase auth or local storage
  // For demo purposes, we'll use a default role
  return localStorage.getItem('userRole') || 'consumer';
}

function updateNavigationForRole(userRole) {
  const navItems = document.querySelectorAll('.nav-menu li');
  
  navItems.forEach(item => {
    const roles = item.getAttribute('data-role');
    if (!roles) return;
    
    const isVisible = checkRoleVisibility(roles, userRole);
    item.style.display = isVisible ? 'block' : 'none';
  });
  
  // Update user interface
  updateUserInterface(userRole);
}

function checkRoleVisibility(roles, userRole) {
  if (roles === 'all') return true;
  if (roles === 'admin' && userRole === 'admin') return true;
  if (roles.includes(userRole)) return true;
  return false;
}

// User Interface Initialization
function initUserInterface() {
  // Update user info in sidebar
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const userRoleBadge = document.getElementById('user-role-badge');
  
  if (userAvatar) {
    userAvatar.textContent = '👤'; // Would be user's actual avatar
  }
  
  if (userName) {
    userName.textContent = 'User Name'; // Would be actual user name
  }
  
  if (userRoleBadge) {
    userRoleBadge.textContent = 'Role'; // Would be actual role
  }
  
  // Initialize language indicator
  updateLanguageIndicator();
  
  // Initialize dashboard based on role
  const userRole = getCurrentUserRole();
  const defaultDashboard = getDefaultDashboard(userRole);
  navigateToDashboard(defaultDashboard);
}

function updateUserInterface(userRole) {
  const userRoleBadge = document.getElementById('user-role-badge');
  const userRoleText = document.getElementById('user-role-text');
  
  if (userRoleBadge) {
    userRoleBadge.textContent = userRole.toUpperCase();
    userRoleBadge.className = `user-role-badge ${userRole}`;
  }
  
  if (userRoleText) {
    userRoleText.textContent = userRole.toUpperCase();
  }
  
  // Update navigation visibility
  updateNavigationForRole(userRole);
}

function getDefaultDashboard(userRole) {
  const dashboardMap = {
    'farmer': 'farmer-dashboard',
    'lab': 'lab-dashboard',
    'manufacturer': 'manufacturer-dashboard',
    'consumer': 'consumer-portal',
    'admin': 'admin-dashboard'
  };
  
  return dashboardMap[userRole] || 'consumer-portal';
}

// Language Support
function updateLanguageIndicator() {
  const languageIndicator = document.getElementById('language-indicator');
  const languageText = document.getElementById('language-text');
  const languageFlag = document.querySelector('.language-flag');
  
  if (!languageIndicator || !languageText || !languageFlag) return;
  
  const currentLang = localStorage.getItem('language') || 'en';
  
  const languageConfig = {
    'en': { text: 'English', flag: 'en' },
    'hi': { text: 'हिन्दी', flag: 'hi' },
    'gu': { text: 'ગુજરાતી', flag: 'gu' },
    'mr': { text: 'मराठी', flag: 'mr' }
  };
  
  const config = languageConfig[currentLang];
  if (config) {
    languageText.textContent = config.text;
    languageFlag.className = `language-flag ${config.flag}`;
  }
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Export for global use
window.krishiApp = {
  navigateToDashboard,
  addNotification,
  showToast,
  formatTime,
  initRoleBasedNavigation,
  updateNavigationForRole,
  getCurrentUserRole,
  updateUserInterface,
  getDefaultDashboard
};
