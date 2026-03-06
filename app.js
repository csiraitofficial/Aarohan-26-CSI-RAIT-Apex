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
  
  // Initialize Secondary Dashboards
  initWasteDashboard();
  initSustainabilityDashboard();
  initInventoryDashboard();
  initOrdersDashboard();
  initInsuranceDashboard();
  initDnaDashboard();
  
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
    },
    'waste-dashboard': {
      title: 'Waste Management',
      subtitle: 'Track and manage failed batches and production waste',
      icon: '🗑️'
    },
    'sustainability-dashboard': {
      title: 'Sustainability Dashboard',
      subtitle: 'Track environmental impact and carbon footprint',
      icon: '🍃'
    },
    'inventory-dashboard': {
      title: 'Inventory Dashboard',
      subtitle: 'Monitor raw herbs and finished products',
      icon: '📦'
    },
    'orders-dashboard': {
      title: 'Orders Dashboard',
      subtitle: 'Manage incoming consumer and retailer orders',
      icon: '🛒'
    },
    'insurance-dashboard': {
      title: 'Insurance Dashboard',
      subtitle: 'Manage crop and transit insurance policies',
      icon: '🛡️'
    },
    'dna-dashboard': {
      title: 'DNA Banking',
      subtitle: 'Verify botanical authenticity using genetic markers',
      icon: '🧬'
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
      'blockchain-viewer': 'var(--color-blockchain)',
      'waste-dashboard': '#ef4444',
      'sustainability-dashboard': '#10b981',
      'inventory-dashboard': '#f59e0b',
      'orders-dashboard': '#3b82f6',
      'insurance-dashboard': '#3b82f6',
      'dna-dashboard': '#8b5cf6'
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
    case 'waste-dashboard':
      initWasteDashboard();
      break;
    case 'sustainability-dashboard':
      initSustainabilityDashboard();
      break;
    case 'inventory-dashboard':
      initInventoryDashboard();
      break;
    case 'orders-dashboard':
      initOrdersDashboard();
      break;
    case 'insurance-dashboard':
      initInsuranceDashboard();
      break;
    case 'dna-dashboard':
      initDnaDashboard();
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
  const searchResultsContainer = document.getElementById('search-results-container');
  if (!query || query.length < 2) {
    searchResultsContainer.innerHTML = '';
    return;
  }
  
  // Search through local known data arrays and Firestore
  const results = [];
  const lowerQuery = query.toLowerCase();

  // Search batches in memory
  Object.values(availableBatches || {}).forEach(batch => {
    if(
      batch.id.toLowerCase().includes(lowerQuery) ||
      batch.farmerName?.toLowerCase().includes(lowerQuery) ||
      batch.herbType?.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        title: `Batch: ${batch.id}`,
        desc: `${batch.herbType} from ${batch.farmerName}`,
        icon: '🌱',
        action: `navigateToDashboard('lab-dashboard')`
      });
    }
  });

  // Example additional results matching keywords
  if('ashwagandha'.includes(lowerQuery) || 'tulsi'.includes(lowerQuery)) {
     results.push({ title: 'Inventory Stock', desc: 'View herb stock levels', icon: '📦', action: `navigateToDashboard('inventory-dashboard')` });
  }

  if(lowerQuery.startsWith('prod-')) {
     results.push({ title: `Product: ${query.toUpperCase()}`, desc: 'Trace this product', icon: '🏭', action: `navigateToDashboard('consumer-portal'); document.getElementById('product-id-input').value='${query}';` });
  }

  // Render results
  if(results.length === 0) {
    searchResultsContainer.innerHTML = `
      <div class="search-result-item" style="text-align:center; color:#6b7280;">
        <p>No results found for "${query}"</p>
      </div>
    `;
  } else {
    searchResultsContainer.innerHTML = results.map(r => `
      <div class="search-result-item" onclick="document.getElementById('search-modal').style.display='none'; ${r.action}" style="cursor:pointer; display:flex; align-items:center; gap:15px; padding:15px; border-bottom:1px solid #eee;">
        <div style="font-size:24px;">${r.icon}</div>
        <div>
          <h4 style="margin:0 0 5px 0;">${r.title}</h4>
          <p style="margin:0; font-size:14px; color:#6b7280;">${r.desc}</p>
        </div>
      </div>
    `).join('');
  }
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

async function exportCollectionsToCSV() {
  // Export farmer collections from Firestore to CSV
  try {
    const snapshot = await db.collection('batches').get();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Batch ID,Farmer,Herb Type,Quantity,Location,Status\n";
    
    snapshot.forEach(doc => {
      const data = doc.data();
      csvContent += `${doc.id},"${data.farmerName}","${data.herbType}",${data.quantity},"${data.location}","${data.status}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `krishi-collections-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV exported successfully', 'success');
  } catch(error) {
    console.error('Export CSV error', error);
    showToast('Failed to export CSV', 'error');
  }
}

window.exportLabReportPDF = async function(batchId) {
  if(!window.jspdf) {
    showToast('PDF Library not loaded', 'error');
    return;
  }
  
  try {
    const doc = await db.collection('batches').doc(batchId).get();
    if(!doc.exists) return showToast('Batch not found', 'error');
    
    const data = doc.data();
    if(!data.labResults) return showToast('No lab results available for this batch', 'warning');
    
    // AutoTable isn't loaded by default, so we'll do manual drawing
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    pdf.setFontSize(22);
    pdf.setTextColor(16, 185, 129); // Green
    pdf.text("Krishi - Certified Lab Report", 20, 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0,0,0);
    pdf.text(`Batch ID: ${batchId}`, 20, 40);
    pdf.text(`Herb Type: ${data.herbType}`, 20, 50);
    pdf.text(`Testing Date: ${data.labResults.testedAt ? new Date(data.labResults.testedAt.toDate()).toLocaleString() : new Date().toLocaleString()}`, 20, 60);
    pdf.text(`Overall Result: ${data.labResults.result}`, 20, 70);
    
    pdf.setFontSize(16);
    pdf.text("Detailed Parameters", 20, 90);
    pdf.setFontSize(12);
    
    let y = 100;
    for(const [key, val] of Object.entries(data.labResults.parameters)) {
      pdf.text(`${key}: ${val}`, 20, y);
      y += 10;
    }
    
    pdf.setFontSize(10);
    pdf.setTextColor(150,150,150);
    pdf.text("This report is cryptographically verified on the Krishi Blockchain.", 20, y+20);
    
    pdf.save(`Krishi-Lab-Report-${batchId}.pdf`);
    showToast('Lab Report PDF downloaded', 'success');
  } catch(error) {
    console.error("PDF export error", error);
    showToast('Failed to generate PDF', 'error');
  }
};

window.exportBlockchainJSON = async function() {
  try {
    const chain = await blockchain.getChain();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chain, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", `krishi-blockchain-dump-${new Date().toISOString().slice(0,10)}.json`);
    dlAnchorElem.click();
    showToast('Blockchain ledger downloaded', 'success');
  } catch (error) {
    console.error('Blockchain JSON export error', error);
    showToast('Failed to export blockchain', 'error');
  }
};
// Blockchain Viewer
function initBlockchainViewer() {
  // Initialize blockchain visualization
  const blockchainVisualization = document.getElementById('blockchain-visualization');
  if (blockchainVisualization) {
    renderBlockchainChain();
  }
  
  // Initialize blockchain stats
  updateBlockchainStats();
  
  // Search form
  const searchForm = document.getElementById('blockchain-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const batchId = document.getElementById('search-batch-id').value;
      searchBlockchainByBatch(batchId);
    });
  }
  
  // Auto-refresh blockchain every 5 seconds
  setInterval(() => {
    renderBlockchainChain();
    updateBlockchainStats();
  }, 5000);
}

// Render blockchain chain visualization
async function renderBlockchainChain() {
  const blockchainVisualization = document.getElementById('blockchain-visualization');
  if (!blockchainVisualization) return;
  
  try {
    const chain = await blockchain.getChain();
    
    if (chain.length === 0) {
      blockchainVisualization.innerHTML = `
        <div class="blockchain-info">
          <h4>⛓️ Blockchain Chain</h4>
          <p>No blocks in the chain yet. Start by tagging a herb collection!</p>
        </div>
      `;
      return;
    }
    
    blockchainVisualization.innerHTML = chain.map((block, index) => {
      const blockType = block.data.type || 'unknown';
      const blockIcon = getBlockIcon(blockType);
      const blockClass = getBlockClass(blockType);
      const timestamp = new Date(block.timestamp).toLocaleString();
      
      return `
        <div class="blockchain-block ${blockClass} ${index === 0 ? 'genesis' : ''}">
          <div class="block-icon">${blockIcon}</div>
          <div class="block-content">
            <div class="block-header">
              <span class="block-type">${blockType.replace('-', ' ')}</span>
              <span class="block-timestamp">${timestamp}</span>
            </div>
            <div class="block-data">
              ${renderBlockData(block.data)}
            </div>
            <div class="block-hash">
              Hash: ${block.hash.substring(0, 40)}...
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Add pulsing animation to the latest block
    const blocks = blockchainVisualization.querySelectorAll('.blockchain-block');
    if (blocks.length > 0) {
      blocks[blocks.length - 1].classList.add('pulsing');
    }
    
  } catch (error) {
    console.error('Error rendering blockchain:', error);
    blockchainVisualization.innerHTML = `
      <div class="blockchain-info">
        <h4>❌ Error Loading Blockchain</h4>
        <p>Unable to load blockchain data. Please try again.</p>
      </div>
    `;
  }
}

// Get block icon based on type
function getBlockIcon(type) {
  const icons = {
    'genesis': '🌱',
    'collection': '🌱',
    'send-to-lab': '🧪',
    'lab-test': '🧪',
    'manufacturing': '🏭',
    'smart-contract-event': '⚡',
    'insurance-claim': '💰',
    'dna-registration': '🧬'
  };
  return icons[type] || '📦';
}

// Get block CSS class based on type
function getBlockClass(type) {
  const classes = {
    'genesis': 'genesis',
    'collection': 'collection',
    'send-to-lab': 'lab-test',
    'lab-test': 'lab-test',
    'manufacturing': 'manufacturing',
    'smart-contract-event': 'smart-contract',
    'insurance-claim': 'insurance',
    'dna-registration': 'dna'
  };
  return classes[type] || '';
}

// Render block data in a structured format
function renderBlockData(data) {
  const fields = [];
  
  // Common fields
  if (data.batchId) fields.push(`<div class="block-field"><strong>Batch ID:</strong> ${data.batchId}</div>`);
  if (data.farmerId) fields.push(`<div class="block-field"><strong>Farmer:</strong> ${data.farmerId}</div>`);
  if (data.herbType) fields.push(`<div class="block-field"><strong>Herb:</strong> ${data.herbType}</div>`);
  if (data.quantity) fields.push(`<div class="block-field"><strong>Quantity:</strong> ${data.quantity}</div>`);
  
  // Lab test specific
  if (data.testResult) fields.push(`<div class="block-field"><strong>Result:</strong> ${data.testResult}</div>`);
  if (data.parameters) {
    const params = data.parameters;
    if (params.moisture) fields.push(`<div class="block-field"><strong>Moisture:</strong> ${params.moisture}%</div>`);
    if (params.activeMarkers) fields.push(`<div class="block-field"><strong>Active Markers:</strong> ${params.activeMarkers}%</div>`);
    if (params.pesticides) fields.push(`<div class="block-field"><strong>Pesticides:</strong> ${params.pesticides}</div>`);
  }
  
  // Manufacturing specific
  if (data.productId) fields.push(`<div class="block-field"><strong>Product ID:</strong> ${data.productId}</div>`);
  if (data.productName) fields.push(`<div class="block-field"><strong>Product:</strong> ${data.productName}</div>`);
  
  // Smart contract specific
  if (data.contract) fields.push(`<div class="block-field"><strong>Contract:</strong> ${data.contract}</div>`);
  if (data.type) fields.push(`<div class="block-field"><strong>Event:</strong> ${data.type}</div>`);
  
  return fields.join('');
}

// Update blockchain statistics
async function updateBlockchainStats() {
  try {
    const chainLength = await blockchain.getChainLength();
    const chain = await blockchain.getChain();
    
    // Update stats in the admin dashboard
    const totalBlocksElement = document.getElementById('total-blocks');
    const chainLengthElement = document.getElementById('chain-length');
    const lastBlockHashElement = document.getElementById('last-block-hash');
    
    if (totalBlocksElement) totalBlocksElement.textContent = chainLength;
    if (chainLengthElement) chainLengthElement.textContent = chainLength;
    
    if (lastBlockHashElement && chain.length > 0) {
      lastBlockHashElement.textContent = chain[chain.length - 1].hash.substring(0, 12) + '...';
    }
    
    // Update blockchain info in viewer
    const blockchainInfo = document.querySelector('.blockchain-info');
    if (blockchainInfo) {
      blockchainInfo.innerHTML = `
        <h4>⛓️ Blockchain Chain</h4>
        <p>Current chain length: <strong>${chainLength}</strong> blocks</p>
        <p>Latest block: <strong>${chain.length > 0 ? chain[chain.length - 1].data.type : 'None'}</strong></p>
      `;
    }
    
  } catch (error) {
    console.error('Error updating blockchain stats:', error);
  }
}

async function searchBlockchainByBatch(batchId) {
  if (!batchId) return;
  
  try {
    const results = await blockchain.getBlocksByBatchId(batchId);
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="block-result">
          <h4>🔍 Search Results</h4>
          <p>No blocks found for batch ID: <strong>${batchId}</strong></p>
        </div>
      `;
      return;
    }
    
    searchResults.innerHTML = `
      <div class="block-result">
        <h4>Found ${results.length} blocks for batch: ${batchId}</h4>
        ${results.map(block => `
          <div style="margin-top: ${results.length > 1 ? '10px' : '0'}; padding-top: ${results.length > 1 ? '10px' : '0'}; border-top: ${results.length > 1 ? '1px solid var(--color-border)' : 'none'};">
            <strong>Type:</strong> <span style="text-transform: capitalize;">${block.data.type.replace('-', ' ')}</span><br>
            <strong>Hash:</strong> ${block.hash.substring(0, 20)}...<br>
            <strong>Timestamp:</strong> ${new Date(block.timestamp).toLocaleString()}
          </div>
        `).join('')}
      </div>
    `;
    
    // Add notification for successful search
    addNotification(`Found ${results.length} blocks for batch ${batchId}`, 'info');
    
  } catch (error) {
    console.error('Error searching blockchain:', error);
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = `
      <div class="block-result">
        <h4>❌ Search Error</h4>
        <p>Unable to search blockchain. Please try again.</p>
      </div>
    `;
  }
}

// Enhanced blockchain block creation with smart contract integration
async function createBlockchainBlock(type, data) {
  try {
    // Create the block
    const block = await blockchain.addBlock(type, data);
    
    // Execute smart contracts based on block type
    if (type === BLOCK_TYPES.LAB_TEST) {
      const contractResult = await SmartContracts.ContractTriggers.onLabTest(data.batchData, data.testResult);
      if (contractResult.success) {
        addNotification(`Smart contract executed: ${contractResult.qualityResult.result}`, 
                       contractResult.qualityResult.result === 'PASS' ? 'success' : 'warning');
      }
    } else if (type === BLOCK_TYPES.COLLECTION) {
      await SmartContracts.ContractTriggers.onCollection(data);
      addNotification('Herb collection recorded on blockchain', 'success');
    } else if (type === BLOCK_TYPES.MANUFACTURING) {
      await SmartContracts.ContractTriggers.onManufacturing(data);
      addNotification('Product manufacturing recorded on blockchain', 'success');
    }
    
    // Update visualization
    renderBlockchainChain();
    updateBlockchainStats();
    
    return block;
    
  } catch (error) {
    console.error('Error creating blockchain block:', error);
    addNotification('Error creating blockchain block', 'error');
    throw error;
  }
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
  
  // Initialize Leaflet map
  initFarmerMap();
  
  // Initialize weather widget
  initWeatherWidget();
  
  // Initialize market rates
  initMarketRates();
  
  // Initialize recent collections
  initRecentCollections();
  
  // Initialize SMS verification modal
  initSMSVerification();
  
  // Load existing data
  loadFarmerData();
}

// Initialize Leaflet Map for Farmer Dashboard
function initFarmerMap() {
  const mapContainer = document.getElementById('farmer-map');
  if (!mapContainer) return;
  
  // Initialize map
  const map = L.map('farmer-map').setView([20.5937, 78.9629], 5); // India center
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);
  
  // Add current location marker
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup("📍 Your Farm Location").openPopup();
      map.setView([latitude, longitude], 13);
      
      // Store location in global variable
      window.currentFarmerLocation = { latitude, longitude };
    }, (error) => {
      console.error('Error getting location for map:', error);
    });
  }
  
  // Add click event to set marker
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`📍 Selected Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`).openPopup();
    
    // Store selected location
    window.selectedFarmerLocation = { latitude: lat, longitude: lng };
    
    // Update location display
    const locationDisplay = document.getElementById('location-display');
    if (locationDisplay) {
      locationDisplay.textContent = `Location selected: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    }
  });
  
  // Store map reference
  window.farmerMap = map;
}

// Initialize Weather Widget
function initWeatherWidget() {
  const weatherWidget = document.querySelector('.weather-widget');
  if (!weatherWidget) return;
  
  // Simulate weather data (in real app, this would come from an API)
  const weatherData = {
    temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C
    condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
    windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
    alerts: [
      'Rain expected in 2 days. Harvest Tulsi before Sunday.',
      'High humidity detected. Monitor for fungal growth.',
      'Strong winds forecasted. Secure your crops.',
      'Clear skies ahead. Perfect for drying herbs.'
    ]
  };
  
  weatherWidget.innerHTML = `
    <div class="weather-info">
      <div class="weather-main">
        <span class="weather-temp">${weatherData.temperature}°C</span>
        <span class="weather-condition">${weatherData.condition}</span>
      </div>
      <div class="weather-details">
        <span class="weather-detail">Humidity: ${weatherData.humidity}%</span>
        <span class="weather-detail">Wind: ${weatherData.windSpeed} km/h</span>
      </div>
    </div>
    <div class="weather-alert">
      <span class="alert-icon">⚠️</span>
      <span>${weatherData.alerts[Math.floor(Math.random() * weatherData.alerts.length)]}</span>
    </div>
  `;
}

// Initialize Market Rates Widget
function initMarketRates() {
  const marketRatesContainer = document.querySelector('.market-rates');
  if (!marketRatesContainer) return;
  
  // Current market rates for different herbs
  const marketRates = [
    { herb: 'Ashwagandha', rate: 450, trend: 'up' },
    { herb: 'Tulsi', rate: 200, trend: 'stable' },
    { herb: 'Neem', rate: 150, trend: 'down' },
    { herb: 'Turmeric', rate: 300, trend: 'up' },
    { herb: 'Amla', rate: 250, trend: 'stable' },
    { herb: 'Ginseng', rate: 800, trend: 'up' },
    { herb: 'Brahmi', rate: 350, trend: 'stable' },
    { herb: 'Shatavari', rate: 400, trend: 'down' }
  ];
  
  marketRatesContainer.innerHTML = marketRates.map(item => `
    <div class="rate-item">
      <div class="rate-info">
        <span class="herb-name">${item.herb}</span>
        <span class="rate-trend ${item.trend}">
          ${item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'}
          ${item.trend}
        </span>
      </div>
      <span class="rate-value">₹${item.rate}/kg</span>
    </div>
  `).join('');
}

// Initialize SMS Verification Modal
function initSMSVerification() {
  const verifyBtn = document.getElementById('verify-phone-btn');
  const smsModal = document.getElementById('sms-verification-modal');
  const phoneInput = document.getElementById('phone-input');
  const otpInput = document.getElementById('otp-input');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      smsModal.style.display = 'flex';
    });
  }
  
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phone = phoneInput.value;
      if (phone && phone.length === 10) {
        // Simulate OTP sending
        const otp = Math.floor(100000 + Math.random() * 900000);
        window.currentOTP = otp;
        showToast(`OTP sent to ${phone}: ${otp}`, 'success');
        
        // Auto-fill OTP for demo purposes
        setTimeout(() => {
          otpInput.value = otp;
        }, 1000);
      } else {
        showToast('Please enter a valid 10-digit phone number', 'error');
      }
    });
  }
  
  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const enteredOtp = otpInput.value;
      if (enteredOtp == window.currentOTP) {
        showToast('Phone number verified successfully!', 'success');
        smsModal.style.display = 'none';
        document.getElementById('phone-verified').style.display = 'inline';
      } else {
        showToast('Invalid OTP. Please try again.', 'error');
      }
    });
  }
  
  // Close modal when clicking outside
  if (smsModal) {
    smsModal.addEventListener('click', (e) => {
      if (e.target === smsModal) {
        smsModal.style.display = 'none';
      }
    });
  }
}

// Enhanced Herb Collection Submission
async function submitHerbCollection() {
  const farmerName = document.getElementById('farmer-name').value;
  const herbType = document.getElementById('herb-type').value;
  const quantity = document.getElementById('quantity').value;
  const harvestDate = document.getElementById('harvest-date').value;
  const locationDisplay = document.getElementById('location-display');
  
  // Validation
  if (!farmerName || !herbType || !quantity || !harvestDate) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  if (!window.selectedFarmerLocation && !window.currentFarmerLocation) {
    showToast('Please capture or select your farm location', 'error');
    return;
  }
  
  // Generate batch ID
  const batchId = `BATCH-${Date.now()}`;
  
  // Get location data
  const location = window.selectedFarmerLocation || window.currentFarmerLocation;
  const locationString = `${location.latitude.toFixed(4)}°N, ${location.longitude.toFixed(4)}°E`;
  
  try {
    // Create blockchain block
    const block = await blockchain.addBlock(BLOCK_TYPES.COLLECTION, {
      batchId: batchId,
      farmerName: farmerName,
      herbType: herbType,
      quantity: quantity,
      harvestDate: harvestDate,
      location: locationString,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    
    // Save to Firestore
    await saveBatchToFirestore(batchId, {
      farmerName: farmerName,
      herbType: herbType,
      quantity: quantity,
      harvestDate: harvestDate,
      location: locationString,
      coordinates: location,
      batchId: batchId,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    
    showToast(`Herb collection tagged successfully! Batch ID: ${batchId}`, 'success');
    addNotification(`New herb collection added: ${herbType} (${quantity}kg) - Batch ${batchId}`, 'success');
    
    // Update recent collections display
    updateRecentCollections();
    
    // Clear form
    document.getElementById('herb-collection-form').reset();
    if (locationDisplay) {
      locationDisplay.textContent = '';
    }
    
    // Show batch ID modal
    showBatchIDModal(batchId, herbType, quantity);
    
  } catch (error) {
    console.error('Error submitting herb collection:', error);
    showToast('Error submitting collection. Please try again.', 'error');
  }
}

// Save batch to Firestore
async function saveBatchToFirestore(batchId, batchData) {
  try {
    await db.collection('batches').doc(batchId).set({
      ...batchData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('Batch saved to Firestore:', batchId);
  } catch (error) {
    console.error('Error saving batch to Firestore:', error);
    throw error;
  }
}

// Update Recent Collections with real data
async function updateRecentCollections() {
  const collectionsList = document.getElementById('recent-collections');
  if (!collectionsList) return;
  
  try {
    // Get recent collections from Firestore
    const user = auth.currentUser;
    if (!user) return;
    
    const batchesRef = db.collection('batches')
      .where('farmerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(5);
    
    const snapshot = await batchesRef.get();
    
    if (snapshot.empty) {
      collectionsList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🌱</span>
          <p>No collections yet. Tag your first herb collection!</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : data.harvestDate;
      
      html += `
        <div class="collection-item">
          <div class="collection-info">
            <div class="collection-header">
              <strong>${data.batchId}</strong>
              <span class="collection-status pending">Pending Lab Test</span>
            </div>
            <div class="collection-details">
              <span class="herb-type">${data.herbType}</span>
              <span class="quantity">${data.quantity}kg</span>
              <span class="date">${date}</span>
            </div>
            <div class="collection-location">
              <span class="ph ph-map-pin"></span>
              <span>${data.location}</span>
            </div>
          </div>
          <div class="collection-actions">
            <button class="btn-icon view-details" onclick="viewCollectionDetails('${doc.id}')">
              <span class="ph ph-eye"></span>
            </button>
            <button class="btn-icon export-csv" onclick="exportCollectionCSV('${doc.id}')">
              <span class="ph ph-download"></span>
            </button>
          </div>
        </div>
      `;
    });
    
    collectionsList.innerHTML = html;
    
  } catch (error) {
    console.error('Error loading recent collections:', error);
    collectionsList.innerHTML = `
      <div class="error-state">
        <p>Error loading collections. Please try again.</p>
      </div>
    `;
  }
}

// View Collection Details
async function viewCollectionDetails(batchId) {
  try {
    const doc = await db.collection('batches').doc(batchId).get();
    if (doc.exists) {
      const data = doc.data();
      const detailsHtml = `
        <div class="collection-details-modal">
          <h3>Collection Details</h3>
          <div class="detail-row">
            <span class="detail-label">Batch ID:</span>
            <span class="detail-value">${data.batchId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Herb Type:</span>
            <span class="detail-value">${data.herbType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Quantity:</span>
            <span class="detail-value">${data.quantity}kg</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Harvest Date:</span>
            <span class="detail-value">${data.harvestDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${data.location}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value status-${data.status}">${data.status}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Blockchain:</span>
            <span class="detail-value">✓ Verified</span>
          </div>
        </div>
      `;
      
      // Show modal (would need modal implementation)
      showToast('Collection details loaded', 'info');
      console.log('Collection details:', data);
    }
  } catch (error) {
    console.error('Error viewing collection details:', error);
    showToast('Error loading collection details', 'error');
  }
}

// Export Collection to CSV
function exportCollectionCSV(batchId) {
  // This would export specific collection data to CSV
  showToast('Exporting collection to CSV...', 'info');
  // Implementation would be in exports.js
}

// Show Batch ID Modal
function showBatchIDModal(batchId, herbType, quantity) {
  const modal = document.getElementById('batch-id-modal');
  const batchIdDisplay = document.getElementById('generated-batch-id');
  const herbTypeDisplay = document.getElementById('batch-herb-type');
  const quantityDisplay = document.getElementById('batch-quantity');
  
  if (modal && batchIdDisplay && herbTypeDisplay && quantityDisplay) {
    batchIdDisplay.textContent = batchId;
    herbTypeDisplay.textContent = herbType;
    quantityDisplay.textContent = quantity;
    modal.style.display = 'flex';
  }
}

// Load Farmer Data
async function loadFarmerData() {
  // Load user info
  const user = auth.currentUser;
  if (user) {
    document.getElementById('farmer-name').value = user.displayName || user.email.split('@')[0];
  }
  
  // Load recent collections
  await updateRecentCollections();
  
  // Load market rates
  initMarketRates();
  
  // Load weather
  initWeatherWidget();
}

// Enhanced GPS Location Capture
function captureLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const locationString = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
      
      const locationDisplay = document.getElementById('location-display');
      if (locationDisplay) {
        locationDisplay.innerHTML = `
          <div class="location-capture">
            <span class="location-icon">📍</span>
            <span class="location-text">Location captured: ${locationString}</span>
            <button type="button" class="btn-icon remove-location" onclick="removeLocation()">
              <span class="ph ph-x"></span>
            </button>
          </div>
        `;
      }
      
      // Store location
      window.currentFarmerLocation = { latitude, longitude };
      
      // Update map if exists
      if (window.farmerMap) {
        window.farmerMap.setView([latitude, longitude], 15);
        L.marker([latitude, longitude]).addTo(window.farmerMap)
          .bindPopup(`📍 Your Farm Location: ${locationString}`).openPopup();
      }
      
      showToast('GPS location captured successfully!', 'success');
    }, (error) => {
      console.error('Error capturing location:', error);
      let errorMessage = 'Unable to capture location.';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location services.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      showToast(errorMessage, 'error');
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });
  } else {
    showToast('Geolocation is not supported by this browser.', 'error');
  }
}

// Remove Location
function removeLocation() {
  window.currentFarmerLocation = null;
  window.selectedFarmerLocation = null;
  
  const locationDisplay = document.getElementById('location-display');
  if (locationDisplay) {
    locationDisplay.innerHTML = '';
  }
  
  showToast('Location removed', 'info');
}

// Export functions for global use
window.farmerDashboard = {
  initFarmerDashboard,
  submitHerbCollection,
  captureLocation,
  removeLocation,
  viewCollectionDetails,
  exportCollectionCSV,
  showBatchIDModal
};

// Global state for pending batches
let pendingBatches = {};

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

  // Compare Batches Button
  const compareBtn = document.getElementById('compare-batches-btn');
  if(compareBtn) {
    compareBtn.addEventListener('click', initBatchComparisonChart);
  }

  // Load pending batches into dropdown
  loadPendingBatches();
}

async function loadPendingBatches() {
  const batchSelect = document.getElementById('batch-select');
  if(!batchSelect) return;

  try {
    const batchesRef = db.collection('batches').where('status', '==', 'pending').orderBy('createdAt', 'desc');
    const snapshot = await batchesRef.get();
    
    batchSelect.innerHTML = '<option value="">Select a batch</option>';
    pendingBatches = {};
    
    if (snapshot.empty) {
      batchSelect.innerHTML += '<option value="" disabled>No pending batches available</option>';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      pendingBatches[data.batchId] = data;
      batchSelect.innerHTML += `<option value="${data.batchId}">${data.batchId} - ${data.herbType}</option>`;
    });
  } catch (error) {
    console.error('Error loading pending batches:', error);
    batchSelect.innerHTML = '<option value="">Error loading batches</option>';
  }
}

function checkBatchDetails() {
  const batchSelect = document.getElementById('batch-select');
  const batchInfo = document.getElementById('batch-info');
  const batchId = batchSelect.value;
  
  if (batchId && pendingBatches[batchId]) {
    const batch = pendingBatches[batchId];
    batchInfo.style.display = 'block';
    // Update batch info with selected batch details
    document.getElementById('batch-farmer').textContent = batch.farmerName || 'Unknown';
    document.getElementById('batch-herb').textContent = batch.herbType || 'Unknown';
    document.getElementById('batch-quantity').textContent = batch.quantity || '0';
    document.getElementById('batch-location').textContent = batch.location || 'Unknown';

    // Animate spectroscopy
    simulateSpectroscopy();
  } else {
    showToast('Please select a batch first', 'error');
  }
}

function simulateSpectroscopy() {
  const purityValue = document.querySelector('.purity-value');
  const wavelengthValue = document.querySelector('.wavelength-value');
  
  if(purityValue && wavelengthValue) {
    purityValue.textContent = 'Analyzing...';
    wavelengthValue.textContent = 'Scanning...';
    
    setTimeout(() => {
      const purity = (95 + Math.random() * 4.9).toFixed(1);
      purityValue.textContent = purity + '%';
      wavelengthValue.textContent = '540-700nm';
      showToast('Spectroscopy analysis complete', 'info');
    }, 1500);
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
  
  try {
    // Determine batch data
    const batchData = pendingBatches[batchId] || { batchId, herbType: 'Unknown', farmerName: 'Unknown' };

    // Create blockchain block
    const block = await blockchain.addBlock(BLOCK_TYPES.LAB_TEST, {
      batchId: batchId,
      testResult: result,
      batchData: batchData,
      parameters: {
        moisture: moisture,
        activeMarkers: activeMarkers,
        pesticides: pesticides,
        adulterants: adulterants,
        heavyMetals: heavyMetals,
        microbial: microbial
      }
    });

    // Invoke smart contract integration if defined
    if(window.SmartContracts && window.SmartContracts.ContractTriggers) {
      await window.SmartContracts.ContractTriggers.onLabTest(batchData, {
        result: result,
        blockHash: block.hash,
        parameters: { moisture, activeMarkers, pesticides, adulterants, heavyMetals, microbial }
      });
    }

    // Update batch status in Firestore
    await db.collection('batches').doc(batchId).update({
      status: result === 'PASS' ? 'tested' : 'failed',
      testResult: result,
      testedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Generate PDF Certificate
    generateLabCertificate(batchData, {
      result: result,
      blockHash: block.hash
    });
    
    showToast(`Lab test completed! Result: ${result}`, result === 'PASS' ? 'success' : 'error');
    addNotification(`Lab test for batch ${batchId}: ${result}`, result === 'PASS' ? 'success' : 'error');
    
    // Reload pending batches to remove the tested one
    loadPendingBatches();
    document.getElementById('lab-test-form').reset();
    document.getElementById('batch-info').style.display = 'none';
  } catch(error) {
    console.error('Error submitting lab test:', error);
    showToast('Error submitting lab test. Please try again.', 'error');
  }
}

function generateLabCertificate(batchData, testResult) {
  if(!window.jspdf) {
    console.error('jsPDF not loaded');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("🌿 KRISHI LAB CERTIFICATE", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.text("Batch Information", 20, 40);
  
  doc.setFontSize(12);
  doc.text(`Batch ID: ${batchData.batchId}`, 20, 50);
  doc.text(`Herb: ${batchData.herbType || 'Unknown'}`, 20, 60);
  doc.text(`Farmer: ${batchData.farmerName || 'Unknown'}`, 20, 70);
  doc.text(`Quantity: ${batchData.quantity || '0'} kg`, 20, 80);
  
  doc.setFontSize(14);
  doc.text("Test Results", 20, 100);
  doc.setFontSize(12);
  doc.text(`Status: ${testResult.result}`, 20, 110);
  if (testResult.blockHash) {
    doc.text(`Blockchain Hash: ${testResult.blockHash.substring(0,20)}...`, 20, 120);
  }

  doc.text(`Date of Testing: ${new Date().toLocaleDateString()}`, 20, 140);
  
  doc.setFontSize(10);
  doc.text(`ISO/IEC 17025:2017 Certified Lab`, 105, 280, { align: "center" });

  doc.save(`Krishi-Certificate-${batchData.batchId}.pdf`);
}

function initBatchComparisonChart() {
  const canvas = document.getElementById('batch-comparison-chart');
  if(!canvas) return;
  
  // if chart exists, destroy before re-initializing
  if(window.batchChart) {
    window.batchChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  
  const data = {
    labels: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5'],
    datasets: [
      {
        label: 'Active Markers %',
        data: [1.2, 1.5, 1.4, 0.9, 1.6],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      },
      {
        label: 'Moisture %',
        data: [8.5, 9.0, 7.8, 11.2, 8.1],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  window.batchChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Recent Batches Quality Trends'
        }
      }
    }
  });
  
  showToast('Batch comparison updated', 'success');
}

let availableBatches = {};

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

  const sendToLabBtn = document.getElementById('send-to-lab-btn');
  if(sendToLabBtn) {
    sendToLabBtn.addEventListener('click', sendToLab);
  }

  loadAvailableBatches();
  initProductionAnalytics();
}

async function loadAvailableBatches() {
  const batchesList = document.getElementById('available-batches');
  if(!batchesList) return;

  try {
    const batchesRef = db.collection('batches').where('status', '==', 'tested').where('testResult', '==', 'PASS').orderBy('testedAt', 'desc');
    const snapshot = await batchesRef.get();
    
    availableBatches = {};
    
    if (snapshot.empty) {
      batchesList.innerHTML = '<div class="empty-state"><p>No passed batches available</p></div>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      availableBatches[data.batchId] = data;
      html += `
        <div class="batch-item">
          <div class="batch-info">
            <h4>${data.batchId}</h4>
            <p>${data.herbType} - ${data.quantity}kg</p>
          </div>
          <div class="batch-status text-success">✓ PASSED</div>
        </div>
      `;
    });
    batchesList.innerHTML = html;
  } catch (error) {
    console.error('Error loading available batches:', error);
    batchesList.innerHTML = '<div class="error-state"><p>Error loading batches</p></div>';
  }
}

async function sendToLab() {
  const batchId = prompt("Enter Batch ID to send for re-testing:");
  if(!batchId) return;

  try {
    await blockchain.addBlock(BLOCK_TYPES.SEND_TO_LAB, {
      batchId: batchId,
      timestamp: new Date().toISOString()
    });
    showToast(`Batch ${batchId} sent to lab successfully`, 'success');
  } catch(error) {
    console.error('Error sending to lab:', error);
    showToast('Error sending to lab', 'error');
  }
}

function checkBatchStatus() {
  const batchId = document.getElementById('approved-batch-id').value;
  const batchStatus = document.getElementById('batch-status');
  
  if (batchId && availableBatches[batchId]) {
    const batch = availableBatches[batchId];
    batchStatus.style.display = 'block';
    batchStatus.innerHTML = `
      <div class="status-item">
        <span class="status-label">Batch Status:</span>
        <span class="status-value text-success">✓ PASSED LAB TEST</span>
      </div>
      <div class="status-item">
        <span class="status-label">Herb Type:</span>
        <span class="status-value">${batch.herbType}</span>
      </div>
      <div class="status-item">
        <span class="status-label">Quantity:</span>
        <span class="status-value">${batch.quantity}kg</span>
      </div>
    `;
    showToast('Batch verified as PASSED', 'success');
  } else {
    batchStatus.style.display = 'block';
    batchStatus.innerHTML = `
      <div class="status-item">
        <span class="status-label">Batch Status:</span>
        <span class="status-value text-danger">❌ INVALID OR NOT PASSED</span>
      </div>
    `;
    showToast('Invalid Batch ID or Batch has not passed testing', 'error');
  }
}

async function createProduct(e) {
  e.preventDefault();
  
  const batchId = document.getElementById('approved-batch-id').value;
  const productName = document.getElementById('product-name').value;
  const productType = document.getElementById('product-type').value;
  const mfgDate = document.getElementById('mfg-date').value;
  const expiryDate = document.getElementById('expiry-date').value;

  if(!availableBatches[batchId]) {
    showToast('Cannot create product: Invalid or unverified Batch ID', 'error');
    return;
  }
  
  // Generate product ID
  const productId = `PROD-${Date.now()}`;
  
  try {
    // Create blockchain block
    const block = await blockchain.addBlock(BLOCK_TYPES.MANUFACTURING, {
      batchId: batchId,
      productId: productId,
      productName: productName,
      productType: productType,
      manufacturingDate: mfgDate,
      expiryDate: expiryDate
    });

    // Invoke smart contract logic if defined
    if(window.SmartContracts && window.SmartContracts.ContractTriggers) {
      await window.SmartContracts.ContractTriggers.onManufacturing({
        batchId, productId, productName, productType, manufacturingDate: mfgDate, expiryDate
      });
    }

    // Update batch status in Firestore to 'manufactured'
    await db.collection('batches').doc(batchId).update({
      status: 'manufactured',
      productId: productId,
      manufacturedAt: firebase.firestore.FieldValue.serverTimestamp()
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

    // Reload available batches
    loadAvailableBatches();
    document.getElementById('batch-status').style.display = 'none';
  } catch(error) {
    console.error('Error creating product:', error);
    showToast('Error creating product. Please try again.', 'error');
  }
}

function initProductionAnalytics() {
  const canvas = document.getElementById('production-chart');
  if(!canvas) return;

  if(window.productionChart) {
    window.productionChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  
  // Render Bar chart by default (Monthly Batches)
  renderMonthlyBatchesChart(ctx);
}

function renderMonthlyBatchesChart(ctx) {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Products Manufactured',
      data: [12, 19, 15, 25, 22, 30],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  window.productionChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Monthly Production Volume' }
      }
    }
  });
}

function renderQualityRatioChart(ctx) {
  const data = {
    labels: ['Premium Quality', 'Standard Quality', 'Rejected'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ],
      hoverOffset: 4
    }]
  };

  window.productionChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Raw Material Quality Ratio' }
      }
    }
  });
}

window.switchAnalyticsTab = function(tabName) {
  // Update active button
  const tabs = document.querySelectorAll('.analytics-tabs .tab-btn');
  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  const canvas = document.getElementById('production-chart');
  if(!canvas) return;

  if(window.productionChart) {
    window.productionChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  
  if(tabName === 'monthly') {
    renderMonthlyBatchesChart(ctx);
  } else if (tabName === 'quality') {
    renderQualityRatioChart(ctx);
  }
};

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
  if(e) e.preventDefault();
  
  const productIdInput = document.getElementById('product-id-input').value.trim();
  if(!productIdInput) {
    showToast('Please enter a Product or Batch ID', 'error');
    return;
  }

  await loadProductTrace(productIdInput);
}

async function loadProductTrace(id) {
  document.getElementById('product-id-input').value = id;
  
  const timeline = document.getElementById('supply-chain-timeline');
  const verificationBadge = document.getElementById('verification-badge');
  const productDetails = document.getElementById('product-details');
  const labCertificate = document.getElementById('lab-certificate');
  
  timeline.innerHTML = '<div class="loading-spinner" style="margin:20px auto; display:block; width:30px; height:30px;"></div><p style="text-align:center;">Tracing product on blockchain...</p>';
  verificationBadge.style.display = 'none';
  productDetails.innerHTML = '';
  labCertificate.innerHTML = '';
  
  try {
    // Determine batchId if a productId was entered
    let targetBatchId = id;
    const mfgBlocks = await blockchain.getBlocksByType(BLOCK_TYPES.MANUFACTURING);
    const matchedMfg = mfgBlocks.find(b => b.data && b.data.productId === id);
    if(matchedMfg) {
      targetBatchId = matchedMfg.data.batchId;
    }

    // Get all blocks
    const chain = await blockchain.getChain();
    const journey = chain.filter(b => b.data && b.data.batchId === targetBatchId);

    if (journey.length === 0) {
      timeline.innerHTML = '<div class="error-state"><p>No traceability records found for this ID.</p></div>';
      return;
    }

    // Sort by timestamp
    journey.sort((a, b) => a.timestamp - b.timestamp);

    // Build timeline HTML
    let timelineHtml = '';
    journey.forEach(block => {
      const dateStr = new Date(block.timestamp).toLocaleString();
      let icon = '🔗';
      let title = block.data.type || 'Transaction';
      let details = '';

      if (block.data.type === BLOCK_TYPES.COLLECTION) {
        icon = '🌱'; title = 'Herb Collection';
        details = `<p>Farmer: ${block.data.farmerName}</p><p>Herb: ${block.data.herbType} (${block.data.quantity}kg)</p><p>Location: ${block.data.location}</p>`;
      } else if (block.data.type === BLOCK_TYPES.LAB_TEST) {
        icon = '🧪'; title = 'Lab Testing';
        details = `<p>Result: <strong class="${block.data.testResult === 'PASS' ? 'text-success' : 'text-danger'}">${block.data.testResult}</strong></p>
                   <p>Moisture: ${block.data.parameters?.moisture}% | Markers: ${block.data.parameters?.activeMarkers}%</p>`;
      } else if (block.data.type === BLOCK_TYPES.SEND_TO_LAB) {
        icon = '🚚'; title = 'Sent to Lab';
      } else if (block.data.type === BLOCK_TYPES.MANUFACTURING) {
        icon = '🏭'; title = 'Manufacturing';
        details = `<p>Product: ${block.data.productName} (${block.data.productType})</p><p>Mfg Date: ${block.data.manufacturingDate}</p><p>Expiry: ${block.data.expiryDate}</p>`;
      }
      
      timelineHtml += `
        <div class="timeline-step ${block.data.type}">
          <div class="step-icon">${icon}</div>
          <div class="step-content">
            <h4>${title}</h4>
            ${details}
            <p class="hash-preview" title="${block.hash}">Hash: #${block.hash.substring(0,16)}...</p>
            <p class="timestamp">${dateStr}</p>
          </div>
        </div>
      `;
    });

    timeline.innerHTML = timelineHtml;
    verificationBadge.style.display = 'flex';
    
    // Populate Product Details and Lab Certificate
    const mfgBlock = journey.find(b => b.data.type === BLOCK_TYPES.MANUFACTURING);
    const labBlock = journey.find(b => b.data.type === BLOCK_TYPES.LAB_TEST);
    const collBlock = journey.find(b => b.data.type === BLOCK_TYPES.COLLECTION);

    if(mfgBlock) {
      productDetails.innerHTML = `
        <div class="detail-row"><span class="detail-label">Product Name:</span><span class="detail-value">${mfgBlock.data.productName}</span></div>
        <div class="detail-row"><span class="detail-label">Product ID:</span><span class="detail-value">${mfgBlock.data.productId}</span></div>
        <div class="detail-row"><span class="detail-label">Type:</span><span class="detail-value">${mfgBlock.data.productType}</span></div>
        <div class="detail-row"><span class="detail-label">Origin:</span><span class="detail-value">${collBlock ? collBlock.data.location : 'Unknown'}</span></div>
      `;
    } else if (collBlock) {
      productDetails.innerHTML = `
        <div class="detail-row"><span class="detail-label">Herb Type:</span><span class="detail-value">${collBlock.data.herbType}</span></div>
        <div class="detail-row"><span class="detail-label">Batch ID:</span><span class="detail-value">${collBlock.data.batchId}</span></div>
        <div class="detail-row"><span class="detail-label">Farmer:</span><span class="detail-value">${collBlock.data.farmerName}</span></div>
        <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${collBlock.data.location}</span></div>
      `;
    } else {
      productDetails.innerHTML = '<p>No specific product details available.</p>';
    }

    if(labBlock && labBlock.data.testResult === 'PASS') {
      labCertificate.innerHTML = `
        <div class="certificate-preview" style="text-align: center; padding: 20px; border: 2px solid var(--success-color); border-radius: 8px; background: rgba(16, 185, 129, 0.05);">
          <div style="font-size: 40px; margin-bottom: 10px;">📜</div>
          <h4 style="color: var(--success-color); margin-bottom: 10px;">Verified Authentic & Safe</h4>
          <p>This product has passed all required ayurvedic safety and quality tests.</p>
          <p style="font-size: 0.85rem; margin-top: 10px; color: var(--text-muted);">Cert. Hash: ${labBlock.hash.substring(0,20)}...</p>
        </div>
      `;
    } else if (labBlock && labBlock.data.testResult === 'FAIL') {
      labCertificate.innerHTML = `
        <div class="certificate-preview" style="text-align: center; padding: 20px; border: 2px solid var(--danger-color); border-radius: 8px; background: rgba(239, 68, 68, 0.05);">
          <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
          <h4 style="color: var(--danger-color); margin-bottom: 10px;">Testing Failed</h4>
          <p>This batch did not pass safety parameters.</p>
        </div>
      `;
    } else {
      labCertificate.innerHTML = '<p>Laboratory testing records not found or pending.</p>';
    }

    showToast('Product trace completed successfully!', 'success');
  } catch(error) {
    console.error('Error tracing product:', error);
    timeline.innerHTML = '<div class="error-state"><p>Error retrieving blockchain records.</p></div>';
    showToast('Error tracing product', 'error');
  }
}

let html5QrCode;

function startQrScanner() {
  const qrReader = document.getElementById('qr-reader');
  if (qrReader) {
    qrReader.style.display = 'block';
    
    document.getElementById('start-qr-scan-btn').style.display = 'none';
    document.getElementById('stop-qr-scan-btn').style.display = 'inline-block';

    if(!window.Html5Qrcode) {
      showToast('QR Scanner library not loaded', 'error');
      return;
    }

    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        // Stop scanning once we get a result
        stopQrScanner();
        showToast('QR Code scannned successfully', 'success');
        
        // Sometimes our QR code data was: URL?product=PROD-XXX
        let idToTrace = decodedText;
        if(decodedText.includes('?product=')) {
          idToTrace = decodedText.split('?product=')[1];
        } else if (decodedText.includes('?batch=')) {
          idToTrace = decodedText.split('?batch=')[1];
        }
        
        loadProductTrace(idToTrace);
      },
      (errorMessage) => {
        // Ignored, continuous scanning
      }
    ).catch(err => {
      console.error("Error starting QR scanner", err);
      showToast('Camera access denied or unavailable', 'error');
      stopQrScanner();
    });
  }
}

function stopQrScanner() {
  const qrReader = document.getElementById('qr-reader');
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      resetQrUI();
    }).catch(err => {
      console.error("Error stopping QR scanner", err);
      resetQrUI();
    });
  } else {
    resetQrUI();
  }

  function resetQrUI() {
    if (qrReader) qrReader.style.display = 'none';
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
  const dashboards = [
    'farmer-dashboard', 'lab-dashboard', 'manufacturer-dashboard', 
    'consumer-portal', 'admin-dashboard', 'blockchain-viewer',
    'waste-dashboard', 'sustainability-dashboard', 'inventory-dashboard',
    'orders-dashboard', 'insurance-dashboard', 'dna-dashboard'
  ];
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

// --- Secondary Dashboards Initialization ---

function initWasteDashboard() {
  const form = document.getElementById('waste-registration-form');
  const batchSelect = document.getElementById('waste-batch-id');
  
  if(form && batchSelect) {
    // Populate failed batches
    db.collection('batches').where('status', '==', 'failed').get().then(snapshot => {
      batchSelect.innerHTML = '<option value="">Select a failed batch</option>';
      snapshot.forEach(doc => {
        batchSelect.innerHTML += `<option value="${doc.id}">${doc.id} - ${doc.data().herbType}</option>`;
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const batchId = document.getElementById('waste-batch-id').value;
      const method = document.getElementById('disposal-method').value;
      if(!batchId || !method) return showToast('Please select batch and method', 'error');
      
      showToast(`Waste registered for ${batchId} via ${method}`, 'success');
      form.reset();
    });
  }

  // Render Chart
  const canvas = document.getElementById('waste-chart');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Compost', 'Biogas', 'CPCB Disposal'],
        datasets: [{
          data: [45, 25, 30],
          backgroundColor: ['#22c55e', '#3b82f6', '#ef4444']
        }]
      }
    });
  }
}

function initSustainabilityDashboard() {
  const carbonEl = document.getElementById('total-carbon');
  if(carbonEl) carbonEl.textContent = '124.5 kg CO₂';

  const canvas = document.getElementById('sustainability-chart');
  if(canvas) {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Carbon Footprint Trend',
          data: [150, 140, 135, 128, 120, 124.5],
          borderColor: '#10b981',
          tension: 0.1
        }]
      }
    });
  }
}

function initInventoryDashboard() {
  const grid = document.getElementById('inventory-grid');
  if(grid) {
    const inventoryData = [
      { name: 'Ashwagandha', stock: 450, total: 500, status: 'good' },
      { name: 'Tulsi', stock: 80, total: 500, status: 'low' },
      { name: 'Neem', stock: 320, total: 500, status: 'good' }
    ];

    grid.innerHTML = inventoryData.map(item => `
      <div class="card ${item.status === 'low' ? 'border-danger' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3>${item.name}</h3>
          ${item.status === 'low' ? '<span class="badge badge-danger">Low Stock</span>' : ''}
        </div>
        <p>${item.stock} / ${item.total} kg available</p>
        <div style="background:#e5e7eb; border-radius:4px; height:8px; width:100%; margin-top:10px;">
          <div style="background:${item.status === 'low' ? '#ef4444' : '#10b981'}; height:100%; width:${(item.stock/item.total)*100}%; border-radius:4px;"></div>
        </div>
      </div>
    `).join('');
  }
}

function initOrdersDashboard() {
  const tbody = document.getElementById('orders-list-body');
  const filter = document.getElementById('order-status-filter');
  
  const dummyOrders = [
    { id: 'ORD-001', product: 'Ashwagandha Roots', qty: 5, status: 'Pending', date: '2026-03-01' },
    { id: 'ORD-002', product: 'Tulsi Extract', qty: 12, status: 'Shipped', date: '2026-03-03' },
    { id: 'ORD-003', product: 'Neem Powder', qty: 20, status: 'Delivered', date: '2026-02-28' }
  ];

  function renderOrders(filterStatus = 'All') {
    if(!tbody) return;
    tbody.innerHTML = dummyOrders
      .filter(o => filterStatus === 'All' || o.status === filterStatus)
      .map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.product}</td>
        <td>${o.qty} kg</td>
        <td><span class="badge ${o.status === 'Delivered' ? 'badge-success' : 'badge-primary'}">${o.status}</span></td>
        <td>${o.date}</td>
        <td><button class="btn btn-sm btn-secondary">Manage</button></td>
      </tr>
    `).join('');
  }

  if(filter) {
    filter.addEventListener('change', (e) => renderOrders(e.target.value));
    renderOrders();
  }
}

function initInsuranceDashboard() {
  const form = document.getElementById('insurance-form');
  const list = document.getElementById('insurance-list');
  const claimBtn = document.getElementById('file-claim-btn');

  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Insurance policy purchased successfully!', 'success');
      form.reset();
    });
  }

  if(claimBtn) {
    claimBtn.addEventListener('click', () => {
      showToast('Auto-claim initiated for all eligible failed batches.', 'info');
    });
  }

  if(list) {
    list.innerHTML = `
      <div style="padding:10px; border-left:4px solid #3b82f6; background:#f3f4f6; margin-bottom:10px;">
        <strong>Policy #POL-1029</strong> - Batch BATCH-123 (Active)
      </div>
      <div style="padding:10px; border-left:4px solid #ef4444; background:#fef2f2;">
        <strong>Claim #CLM-9281</strong> - Batch BATCH-091 (Processing)
      </div>
    `;
  }
}

function initDnaDashboard() {
  const regForm = document.getElementById('dna-register-form');
  const chkForm = document.getElementById('dna-check-form');
  const resultDiv = document.getElementById('dna-result');
  const list = document.getElementById('dna-profiles-list');

  if(regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('DNA profile registered on blockchain!', 'success');
      regForm.reset();
    });
  }

  if(chkForm) {
    chkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      resultDiv.innerHTML = '<span style="color:#10b981;">✅ DNA Match Confirmed! Botanical authenticity verified.</span>';
    });
  }

  if(list) {
    list.innerHTML = `
      <div style="padding:10px; border:1px solid #e5e7eb; margin-bottom:10px; border-radius:4px;">
        <strong>Ashwagandha Premium Root</strong><br>
        <small class="text-muted">Markers: GTGAC...GCT</small>
        <span style="float:right; color:#10b981;">Verified ✨</span>
      </div>
    `;
  }
}
