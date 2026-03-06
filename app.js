// app.js
// Main Application Logic for Krishi

// ═══════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════

const AppState = {
  batches: [],
  labTests: [],
  products: [],
  currentBatch: null,
  farmerMap: null,
  charts: {}
};

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  KrishiSearch.init();
  blockchain.renderBlockchainVisual();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('✅ Krishi PWA ready'))
      .catch(err => console.error('SW registration failed:', err));
  }
});

function initEventListeners() {
  // Login Modal
  document.getElementById('btn-login')?.addEventListener('click', () => {
    document.getElementById('login-modal').style.display = 'flex';
  });

  document.getElementById('close-login-modal')?.addEventListener('click', () => {
    document.getElementById('login-modal').style.display = 'none';
  });

  // Auth tabs
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-panel').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).style.display = 'block';
    });
  });

  // Google Login
  document.getElementById('btn-google-login')?.addEventListener('click', () => {
    KrishiAuth.signInWithGoogle();
  });

  // Email Login
  document.getElementById('form-email-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    KrishiAuth.signInWithEmail(email, password);
  });

  // Register
  document.getElementById('form-register')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    KrishiAuth.registerWithEmail(email, password, role);
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    KrishiAuth.signOut();
  });

  // Sidebar Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      if (target) showDashboard(target);
    });
  });

  // Language Switcher
  document.getElementById('language-select')?.addEventListener('change', (e) => {
    KrishiI18n.setLanguage(e.target.value);
    showToast(`Language changed to ${e.target.options[e.target.selectedIndex].text}`, 'info');
  });

  // Chatbot Toggle
  document.getElementById('chatbot-toggle')?.addEventListener('click', () => {
    KrishiChatbot.toggle();
  });

  // Chatbot Send
  document.getElementById('chatbot-send')?.addEventListener('click', () => {
    KrishiChatbot.sendMessage();
  });
  document.getElementById('chatbot-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') KrishiChatbot.sendMessage();
  });

  // ─── FARMER DASHBOARD ───
  document.getElementById('farmer-batch-form')?.addEventListener('submit', handleFarmerSubmit);
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    KrishiExports.exportBatchesToCSV(AppState.batches);
  });

  // ─── LAB DASHBOARD ───
  document.getElementById('lab-batch-select')?.addEventListener('change', handleBatchSelect);
  document.getElementById('lab-test-form')?.addEventListener('submit', handleLabSubmit);

  // ─── MANUFACTURER DASHBOARD ───
  document.getElementById('mfg-product-form')?.addEventListener('submit', handleMfgSubmit);

  // ─── CONSUMER PORTAL ───
  document.getElementById('btn-trace-product')?.addEventListener('click', handleProductTrace);
  document.getElementById('btn-start-scanner')?.addEventListener('click', startQRScanner);

  // ─── WASTE DASHBOARD ───
  document.getElementById('waste-form')?.addEventListener('submit', handleWasteSubmit);

  // ─── INSURANCE DASHBOARD ───
  document.getElementById('insurance-form')?.addEventListener('submit', handleInsuranceSubmit);

  // ─── DNA DASHBOARD ───
  document.getElementById('dna-form')?.addEventListener('submit', handleDNASubmit);

  // ─── ORDERS DASHBOARD ───
  document.getElementById('order-form')?.addEventListener('submit', handleOrderSubmit);

  // ─── BLOCKCHAIN EXPLORER ───
  document.getElementById('btn-verify-chain')?.addEventListener('click', () => {
    const result = blockchain.validateChain();
    if (result.valid) {
      showToast(`✅ Blockchain is valid! ${result.length} blocks verified.`, 'success');
    } else {
      showToast(`❌ Chain broken at block #${result.brokenAt}: ${result.reason}`, 'error');
    }
  });

  document.getElementById('btn-export-chain')?.addEventListener('click', () => {
    KrishiExports.exportBlockchainJSON();
  });

  document.getElementById('btn-sync-chain')?.addEventListener('click', () => {
    blockchain.syncToFirestore();
  });
}

function initDashboard(dashboardId) {
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
      break;
    case 'admin-dashboard':
      initAdminDashboard();
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
    case 'insurance-dashboard':
      initInsuranceDashboard();
      break;
    case 'orders-dashboard':
      initOrdersDashboard();
      break;
    case 'dna-dashboard':
      initDNADashboard();
      break;
    case 'blockchain-explorer':
      blockchain.renderBlockchainVisual();
      break;
  }
}

// ═══════════════════════════════════════════
// FARMER DASHBOARD
// ═══════════════════════════════════════════

function initFarmerDashboard() {
  initFarmerMap();
  loadFarmerBatches();
  renderMarketRates();
  renderWeatherWidget();
}

function initFarmerMap() {
  if (AppState.farmerMap) return;

  const mapEl = document.getElementById('farmer-map');
  if (!mapEl || typeof L === 'undefined') return;

  AppState.farmerMap = L.map('farmer-map').setView([20.5937, 78.9629], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(AppState.farmerMap);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      L.marker([latitude, longitude])
        .addTo(AppState.farmerMap)
        .bindPopup('📍 Your Farm Location')
        .openPopup();
      AppState.farmerMap.setView([latitude, longitude], 13);

      document.getElementById('farmer-gps').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }, () => {
      document.getElementById('farmer-gps').value = '20.5937, 78.9629';
    });
  }

  setTimeout(() => AppState.farmerMap.invalidateSize(), 300);
}

async function handleFarmerSubmit(e) {
  e.preventDefault();

  const farmerName = document.getElementById('farmer-name-input').value.trim();
  const herbType = document.getElementById('herb-type-select').value;
  const quantity = parseFloat(document.getElementById('quantity-input').value);
  const harvestDate = document.getElementById('harvest-date-input').value;
  const gpsVal = document.getElementById('farmer-gps').value;

  if (!farmerName || !herbType || !quantity || !harvestDate) {
    showToast('Please fill in all fields', 'warning');
    return;
  }

  const [lat, lng] = gpsVal.split(',').map(s => parseFloat(s.trim()));

  const batchId = `BATCH-${Date.now()}`;

  const batchData = {
    batchId,
    farmerName,
    farmerId: KrishiAuth.currentUser?.uid || 'demo',
    herbType,
    quantity,
    harvestDate,
    gps: { lat: lat || 20.5937, lng: lng || 78.9629 },
    status: 'pending',
    timestamp: Date.now(),
    createdBy: KrishiAuth.currentUser?.email || 'demo@krishi.com'
  };

  // Add to blockchain
  blockchain.addBlock(BLOCK_TYPES.COLLECTION, batchData);

  // Save to Firestore
  try {
    await db.collection('batches').doc(batchId).set(batchData);
  } catch (err) {
    console.error('Firestore save failed:', err);
  }

  // Update local state
  AppState.batches.unshift(batchData);
  renderRecentBatches();

  // Update reputation
  supplyChainContract.updateReputation(
    batchData.farmerId, batchData.farmerName, 'ON_TIME'
  );

  showToast(`🌾 Batch ${batchId} created successfully!`, 'success');
  e.target.reset();
}

async function loadFarmerBatches() {
  try {
    const uid = KrishiAuth.currentUser?.uid;
    if (!uid) return;

    const snapshot = await db.collection('batches')
      .where('farmerId', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    AppState.batches = snapshot.docs.map(doc => doc.data());
    renderRecentBatches();
  } catch (err) {
    // Fallback to blockchain data
    const blocks = blockchain.getBlocksByType(BLOCK_TYPES.COLLECTION);
    AppState.batches = blocks.map(b => b.data);
    renderRecentBatches();
  }
}

function renderRecentBatches() {
  const list = document.getElementById('recent-batches-list');
  if (!list) return;

  if (AppState.batches.length === 0) {
    list.innerHTML = '<p class="no-data">No batches yet. Tag your first herb collection!</p>';
    return;
  }

  list.innerHTML = AppState.batches.slice(0, 5).map(b => `
    <div class="batch-card">
      <div class="batch-card-header">
        <span class="batch-id">${b.batchId}</span>
        <span class="batch-status status-${b.status}">${b.status.toUpperCase()}</span>
      </div>
      <div class="batch-card-body">
        <span>🌿 ${b.herbType}</span>
        <span>⚖️ ${b.quantity} kg</span>
        <span>📅 ${b.harvestDate || new Date(b.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');
}

function renderMarketRates() {
  const container = document.getElementById('market-rates-widget');
  if (!container) return;

  const rates = {
    'Ashwagandha': { price: 450, change: '+2.3%' },
    'Tulsi': { price: 320, change: '-1.1%' },
    'Neem': { price: 280, change: '+0.5%' },
    'Turmeric': { price: 200, change: '+3.8%' },
    'Brahmi': { price: 550, change: '+1.2%' },
    'Shatavari': { price: 480, change: '-0.3%' },
    'Amla': { price: 180, change: '+4.1%' },
    'Guduchi': { price: 400, change: '+0.9%' }
  };

  container.innerHTML = Object.entries(rates).map(([herb, data]) => {
    const isUp = data.change.startsWith('+');
    return `
      <div class="market-rate-item">
        <span class="herb-name">🌿 ${herb}</span>
        <span class="herb-price">₹${data.price}/kg</span>
        <span class="herb-change ${isUp ? 'up' : 'down'}">${data.change}</span>
      </div>
    `;
  }).join('');
}

function renderWeatherWidget() {
  const container = document.getElementById('weather-widget');
  if (!container) return;

  container.innerHTML = `
    <div class="weather-card">
      <div class="weather-icon">🌤️</div>
      <div class="weather-info">
        <h4>28°C — Partly Cloudy</h4>
        <p>Humidity: 65% | Wind: 12 km/h NE</p>
        <p class="weather-alert">✅ Good harvesting conditions</p>
      </div>
    </div>
  `;
}

// ═══════════════════════════════════════════
// LAB DASHBOARD
// ═══════════════════════════════════════════

async function initLabDashboard() {
  await loadPendingBatches();
  renderSpectroscopy();
  renderBatchComparisonChart();
}

async function loadPendingBatches() {
  const select = document.getElementById('lab-batch-select');
  if (!select) return;

  select.innerHTML = '<option value="">-- Select a batch --</option>';

  try {
    const snapshot = await db.collection('batches')
      .where('status', '==', 'pending')
      .orderBy('timestamp', 'desc')
      .get();

    snapshot.docs.forEach(doc => {
      const d = doc.data();
      const option = document.createElement('option');
      option.value = d.batchId;
      option.textContent = `${d.batchId} — ${d.herbType} (${d.farmerName})`;
      option.dataset.batch = JSON.stringify(d);
      select.appendChild(option);
    });
  } catch (err) {
    // Fallback
    const blocks = blockchain.getBlocksByType(BLOCK_TYPES.COLLECTION);
    blocks.forEach(b => {
      if (b.data.status === 'pending') {
        const option = document.createElement('option');
        option.value = b.data.batchId;
        option.textContent = `${b.data.batchId} — ${b.data.herbType} (${b.data.farmerName})`;
        option.dataset.batch = JSON.stringify(b.data);
        select.appendChild(option);
      }
    });
  }
}

function handleBatchSelect(e) {
  const selectedOption = e.target.selectedOptions[0];
  const panel = document.getElementById('batch-info-panel');
  if (!panel || !selectedOption?.dataset?.batch) {
    if (panel) panel.style.display = 'none';
    return;
  }

  const batch = JSON.parse(selectedOption.dataset.batch);
  AppState.currentBatch = batch;
  panel.style.display = 'block';

  panel.innerHTML = `
    <h4>📋 Batch Details</h4>
    <div class="batch-details-grid">
      <div><strong>Batch ID:</strong> ${batch.batchId}</div>
      <div><strong>Farmer:</strong> ${batch.farmerName}</div>
      <div><strong>Herb:</strong> ${batch.herbType}</div>
      <div><strong>Quantity:</strong> ${batch.quantity} kg</div>
      <div><strong>Harvest Date:</strong> ${batch.harvestDate}</div>
      <div><strong>GPS:</strong> ${batch.gps?.lat?.toFixed(4)}, ${batch.gps?.lng?.toFixed(4)}</div>
    </div>
  `;

  // Add send-to-lab block
  blockchain.addBlock(BLOCK_TYPES.SEND_TO_LAB, {
    batchId: batch.batchId,
    herbType: batch.herbType,
    sentBy: KrishiAuth.currentUser?.email || 'lab@krishi.com',
    sentAt: Date.now()
  });
}

async function handleLabSubmit(e) {
  e.preventDefault();

  if (!AppState.currentBatch) {
    showToast('Please select a batch first', 'warning');
    return;
  }

  const testParams = {
    moisture: parseFloat(document.getElementById('test-moisture').value),
    activeMarkers: parseFloat(document.getElementById('test-active-markers').value),
    pesticides: parseFloat(document.getElementById('test-pesticides').value),
    heavyMetals: parseFloat(document.getElementById('test-heavy-metals').value),
    microbialCount: parseInt(document.getElementById('test-microbial').value),
    adulterants: document.getElementById('test-adulterants').value
  };

  // Run Quality Smart Contract
  const evaluation = qualityContract.evaluate(AppState.currentBatch.herbType, testParams);

  // Create lab test block
  const labBlock = blockchain.addBlock(BLOCK_TYPES.LAB_TEST, {
    batchId: AppState.currentBatch.batchId,
    herbType: AppState.currentBatch.herbType,
    testParams,
    result: evaluation.result,
    details: evaluation.details,
    testedBy: KrishiAuth.currentUser?.email || 'lab@krishi.com',
    timestamp: Date.now()
  });

  evaluation.blockHash = labBlock.hash;

  // Update batch status in Firestore
  const newStatus = evaluation.result === 'PASS' ? 'passed' : 'failed';
  try {
    await db.collection('batches').doc(AppState.currentBatch.batchId).update({
      status: newStatus
    });
  } catch (err) {
    console.error('Firestore update failed:', err);
  }

  // Save lab test to Firestore
  try {
    await db.collection('labTests').doc(`TEST-${Date.now()}`).set({
      batchId: AppState.currentBatch.batchId,
      testParams,
      result: evaluation.result,
      details: evaluation.details,
      blockHash: labBlock.hash,
      testedBy: KrishiAuth.currentUser?.email || 'lab@krishi.com',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    console.error('Lab test save failed:', err);
  }

  // Trigger smart contracts
  if (evaluation.result === 'PASS') {
    paymentContract.execute(AppState.currentBatch, evaluation, blockchain);
    supplyChainContract.updateReputation(
      AppState.currentBatch.farmerId,
      AppState.currentBatch.farmerName,
      'PASS'
    );
  } else {
    insuranceContract.execute(AppState.currentBatch, evaluation, blockchain);
    supplyChainContract.updateReputation(
      AppState.currentBatch.farmerId,
      AppState.currentBatch.farmerName,
      'FAIL'
    );
  }

  // Display result
  const resultPanel = document.getElementById('lab-result-panel');
  if (resultPanel) {
    resultPanel.style.display = 'block';
    resultPanel.innerHTML = `
      <div class="test-result-card result-${evaluation.result.toLowerCase()}">
        <h3>${evaluation.result === 'PASS' ? '✅' : '❌'} Result: ${evaluation.result}</h3>
        <div class="test-details">
          ${evaluation.details.map(d => `
            <div class="test-detail-row ${d.status.toLowerCase()}">
              <span>${d.param}</span>
              <span>Value: ${d.value}</span>
              <span>Threshold: ${d.threshold}</span>
              <span class="status-badge">${d.status}</span>
            </div>
          `).join('')}
        </div>
        <div class="test-actions">
          <button onclick="generateCertificate()" class="btn btn-primary">
            📄 Generate Certificate
          </button>
        </div>
      </div>
    `;
  }

  showToast(`Lab test complete: ${evaluation.result}`, evaluation.result === 'PASS' ? 'success' : 'error');
  e.target.reset();
  loadPendingBatches();
}

function generateCertificate() {
  if (!AppState.currentBatch) return;

  const blocks = blockchain.getBlocksByBatchId(AppState.currentBatch.batchId);
  const labBlock = blocks.find(b => b.type === BLOCK_TYPES.LAB_TEST);

  if (labBlock) {
    KrishiExports.exportLabReportPDF(labBlock.data, AppState.currentBatch);
  } else {
    showToast('No lab test data found for this batch', 'warning');
  }
}

function renderSpectroscopy() {
  const canvas = document.getElementById('spectroscopy-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (AppState.charts.spectroscopy) AppState.charts.spectroscopy.destroy();

  const wavelengths = Array.from({ length: 20 }, (_, i) => 400 + i * 20);
  const purity = wavelengths.map(() => 60 + Math.random() * 35);

  AppState.charts.spectroscopy = new Chart(canvas, {
    type: 'line',
    data: {
      labels: wavelengths.map(w => `${w}nm`),
      datasets: [{
        label: 'Purity % (Spectroscopy)',
        data: purity,
        borderColor: '#2D6A4F',
        backgroundColor: 'rgba(45,106,79,0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

function renderBatchComparisonChart() {
  const canvas = document.getElementById('batch-comparison-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (AppState.charts.batchComparison) AppState.charts.batchComparison.destroy();

  AppState.charts.batchComparison = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 5'],
      datasets: [
        {
          label: 'Moisture %',
          data: [8.2, 9.1, 7.5, 11.3, 8.8],
          backgroundColor: '#52B788'
        },
        {
          label: 'Active Markers %',
          data: [2.1, 1.8, 2.5, 0.9, 2.3],
          backgroundColor: '#6C63FF'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}

// ═══════════════════════════════════════════
// MANUFACTURER DASHBOARD
// ═══════════════════════════════════════════

async function initManufacturerDashboard() {
  await loadPassedBatches();
  renderSupplierManagement();
  renderProductionAnalytics();
}

async function loadPassedBatches() {
  const list = document.getElementById('available-batches-list');
  const select = document.getElementById('mfg-batch-select');
  if (!list) return;

  try {
    const snapshot = await db.collection('batches')
      .where('status', '==', 'passed')
      .orderBy('timestamp', 'desc')
      .get();

    const batches = snapshot.docs.map(doc => doc.data());
    renderAvailableBatches(batches);

    if (select) {
      select.innerHTML = '<option value="">-- Select batch --</option>';
      batches.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.batchId;
        opt.textContent = `${b.batchId} — ${b.herbType}`;
        opt.dataset.batch = JSON.stringify(b);
        select.appendChild(opt);
      });
    }
  } catch (err) {
    const blocks = blockchain.getBlocksByType(BLOCK_TYPES.COLLECTION);
    const passed = blocks.filter(b => b.data.status === 'passed');
    renderAvailableBatches(passed.map(b => b.data));
  }
}

function renderAvailableBatches(batches) {
  const list = document.getElementById('available-batches-list');
  if (!list) return;

  list.innerHTML = batches.map(b => `
    <div class="batch-card passed">
      <div class="batch-card-header">
        <span class="batch-id">${b.batchId}</span>
        <span class="batch-status status-passed">✅ PASSED</span>
      </div>
      <div class="batch-card-body">
        <span>🌿 ${b.herbType}</span>
        <span>⚖️ ${b.quantity} kg</span>
        <span>👨‍🌾 ${b.farmerName}</span>
      </div>
    </div>
  `).join('') || '<p class="no-data">No passed batches available</p>';
}

async function handleMfgSubmit(e) {
  e.preventDefault();

  const selectEl = document.getElementById('mfg-batch-select');
  const selectedOption = selectEl?.selectedOptions[0];
  if (!selectedOption?.dataset?.batch) {
    showToast('Please select a batch', 'warning');
    return;
  }

  const batch = JSON.parse(selectedOption.dataset.batch);
  const productName = document.getElementById('product-name-input').value.trim();
  const productType = document.getElementById('product-type-select').value;
  const mfgDate = document.getElementById('mfg-date-input').value;
  const expiryDate = document.getElementById('expiry-date-input').value;

  if (!productName || !productType || !mfgDate || !expiryDate) {
    showToast('Please fill all product fields', 'warning');
    return;
  }

  const productId = `PROD-${Date.now()}`;

  const productData = {
    productId,
    productName,
    productType,
    batchId: batch.batchId,
    herbType: batch.herbType,
    farmerName: batch.farmerName,
    manufacturerId: KrishiAuth.currentUser?.uid || 'demo',
    manufacturerEmail: KrishiAuth.currentUser?.email || 'manufacturer@krishi.com',
    mfgDate,
    expiryDate,
    status: 'manufactured',
    timestamp: Date.now()
  };

  // Add manufacturing block
  blockchain.addBlock(BLOCK_TYPES.MANUFACTURING, productData);

  // Save to Firestore
  try {
    await db.collection('products').doc(productId).set(productData);
  } catch (err) {
    console.error('Product save failed:', err);
  }

  // Generate QR code
  generateQRCode(productId);

  showToast(`🏭 Product ${productId} created!`, 'success');
  e.target.reset();
}

function generateQRCode(productId) {
  const container = document.getElementById('qr-container');
  const img = document.getElementById('qr-code-img');
  const idDisplay = document.getElementById('qr-product-id');

  if (!container || !img) return;

  const qrData = `${window.location.origin}?product=${productId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  img.src = qrUrl;
  if (idDisplay) idDisplay.textContent = productId;
  container.style.display = 'block';
}

function renderSupplierManagement() {
  const container = document.getElementById('supplier-list');
  if (!container) return;

  const suppliers = [
    { name: 'Ramesh Herb Farms', location: 'Gujarat', rating: 4.8, batches: 156, status: 'Verified' },
    { name: 'Kisan Organic Co-op', location: 'Rajasthan', rating: 4.5, batches: 98, status: 'Verified' },
    { name: 'Himalayan Herbs Ltd', location: 'Uttarakhand', rating: 4.9, batches: 234, status: 'Premium' }
  ];

  container.innerHTML = suppliers.map(s => `
    <div class="supplier-card">
      <div class="supplier-header">
        <h4>👨‍🌾 ${s.name}</h4>
        <span class="supplier-badge ${s.status.toLowerCase()}">${s.status}</span>
      </div>
      <div class="supplier-body">
        <span>📍 ${s.location}</span>
        <span>⭐ ${s.rating}/5.0</span>
        <span>📦 ${s.batches} batches</span>
      </div>
    </div>
  `).join('');
}

function renderProductionAnalytics() {
  const barCanvas = document.getElementById('production-bar-chart');
  const doughnutCanvas = document.getElementById('quality-doughnut-chart');
  if (typeof Chart === 'undefined') return;

  if (barCanvas) {
    if (AppState.charts.productionBar) AppState.charts.productionBar.destroy();
    AppState.charts.productionBar = new Chart(barCanvas, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Batches Processed',
          data: [12, 19, 8, 15, 22, 18],
          backgroundColor: '#2D6A4F'
        }]
      },
      options: { responsive: true }
    });
  }

  if (doughnutCanvas) {
    if (AppState.charts.qualityDoughnut) AppState.charts.qualityDoughnut.destroy();
    AppState.charts.qualityDoughnut = new Chart(doughnutCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Pending'],
        datasets: [{
          data: [78, 12, 10],
          backgroundColor: ['#57CC99', '#E63946', '#F4A261']
        }]
      },
      options: { responsive: true }
    });
  }
}

// ═══════════════════════════════════════════
// CONSUMER PORTAL
// ═══════════════════════════════════════════

function handleProductTrace() {
  const input = document.getElementById('product-id-input');
  if (!input) return;

  const productId = input.value.trim();
  if (!productId) {
    showToast('Please enter a Product ID or Batch ID', 'warning');
    return;
  }

  renderSupplyChainTimeline(productId);
}

function renderSupplyChainTimeline(productId) {
  const timeline = document.getElementById('supply-chain-timeline');
  const verifyBadge = document.getElementById('verification-badge');
  if (!timeline) return;

  const journey = blockchain.getBlocksByBatchId(productId);

  if (journey.length === 0) {
    timeline.innerHTML = '<p class="no-data">No records found for this ID. Please check and try again.</p>';
    if (verifyBadge) verifyBadge.style.display = 'none';
    return;
  }

  timeline.innerHTML = journey.map((block, idx) => `
    <div class="timeline-step ${block.type}" style="animation-delay:${idx * 0.2}s">
      <div class="step-connector ${idx === 0 ? 'first' : ''}"></div>
      <div class="step-icon">${blockchain.getBlockIcon(block.type)}</div>
      <div class="step-content">
        <h4>${blockchain.getBlockLabel(block.type)}</h4>
        <p class="step-time">📅 ${new Date(block.timestamp).toLocaleString()}</p>
        ${block.data.farmerName ? `<p>👨‍🌾 ${block.data.farmerName}</p>` : ''}
        ${block.data.herbType ? `<p>🌿 ${block.data.herbType}</p>` : ''}
        ${block.data.quantity ? `<p>⚖️ ${block.data.quantity} kg</p>` : ''}
        ${block.data.result ? `<p>Result: <strong class="result-${block.data.result.toLowerCase()}">${block.data.result}</strong></p>` : ''}
        ${block.data.productName ? `<p>📦 ${block.data.productName}</p>` : ''}
        ${block.data.message ? `<p>💬 ${block.data.message}</p>` : ''}
        <p class="hash-preview">🔗 #${block.hash.substring(0, 16)}...</p>
      </div>
    </div>
  `).join('');

  if (verifyBadge) {
    const chainValid = blockchain.validateChain().valid;
    verifyBadge.style.display = 'flex';
    verifyBadge.innerHTML = `
      <div class="verify-seal ${chainValid ? 'valid' : 'invalid'}">
        <span class="seal-icon">${chainValid ? '🛡️' : '⚠️'}</span>
        <div>
          <strong>${chainValid ? 'Blockchain Verified' : 'Verification Failed'}</strong>
          <small>${journey.length} blocks traced • Chain integrity ${chainValid ? 'confirmed' : 'compromised'}</small>
        </div>
      </div>
    `;
  }
}

function startQRScanner() {
  const readerEl = document.getElementById('qr-reader');
  if (!readerEl || typeof Html5Qrcode === 'undefined') {
    showToast('QR scanner not available', 'error');
    return;
  }

  readerEl.style.display = 'block';
  const html5QrCode = new Html5Qrcode('qr-reader');

  html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      html5QrCode.stop().then(() => {
        readerEl.style.display = 'none';
        // Extract product ID from URL
        const url = new URL(decodedText);
        const productId = url.searchParams.get('product') || decodedText;
        document.getElementById('product-id-input').value = productId;
        renderSupplyChainTimeline(productId);
        showToast(`QR scanned: ${productId}`, 'success');
      });
    }
  ).catch(err => {
    showToast('Camera access denied or not available', 'error');
    readerEl.style.display = 'none';
  });
}

// ═══════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════

function initAdminDashboard() {
  const stats = blockchain.getStats();
  const container = document.getElementById('admin-stats');
  if (!container) return;

  container.innerHTML = `
    <div class="stat-card"><h3>${stats.totalBlocks}</h3><p>Total Blocks</p></div>
    <div class="stat-card"><h3>${stats.collections}</h3><p>Collections</p></div>
    <div class="stat-card"><h3>${stats.labTests}</h3><p>Lab Tests</p></div>
    <div class="stat-card"><h3>${stats.products}</h3><p>Products</p></div>
    <div class="stat-card"><h3>${stats.contracts}</h3><p>Smart Contracts</p></div>
    <div class="stat-card"><h3>${stats.isValid ? '✅' : '❌'}</h3><p>Chain Status</p></div>
  `;

  // Reputation table
  const repContainer = document.getElementById('reputation-table');
  if (repContainer) {
    const reps = supplyChainContract.getAllReputations();
    repContainer.innerHTML = reps.length ? `
      <table class="data-table">
        <thead><tr><th>Stakeholder</th><th>Score</th><th>Batches</th><th>Pass</th><th>Fail</th><th>Badge</th></tr></thead>
        <tbody>
          ${reps.map(r => {
            const badge = supplyChainContract.getReputationBadge(r.score);
            return `<tr>
              <td>${r.name}</td>
              <td>${r.score}</td>
              <td>${r.totalBatches}</td>
              <td>${r.passedBatches}</td>
              <td>${r.failedBatches}</td>
              <td>${badge.emoji} ${badge.label}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    ` : '<p class="no-data">No reputation data yet</p>';
  }
}

// ═══════════════════════════════════════════
// WASTE MANAGEMENT DASHBOARD
// ═══════════════════════════════════════════

function initWasteDashboard() {
  renderWasteChart();
  loadWasteRecords();
}

async function handleWasteSubmit(e) {
  e.preventDefault();

  const batchId = document.getElementById('waste-batch-id').value.trim();
  const category = document.getElementById('waste-category').value;
  const volume = parseFloat(document.getElementById('waste-volume').value);
  const method = document.getElementById('disposal-method').value;

  if (!batchId || !category || !volume || !method) {
    showToast('Fill all waste disposal fields', 'warning');
    return;
  }

  const wasteData = {
    wasteId: `WASTE-${Date.now()}`,
    batchId, category, volume, method,
    disposedBy: KrishiAuth.currentUser?.email || 'admin@krishi.com',
    timestamp: Date.now()
  };

  blockchain.addBlock(BLOCK_TYPES.WASTE_DISPOSAL, wasteData);

  try {
    await db.collection('waste').add(wasteData);
  } catch (err) { /* offline fallback */ }

  showToast('♻️ Waste disposal recorded', 'success');
  e.target.reset();
  renderWasteChart();
}

function renderWasteChart() {
  const canvas = document.getElementById('waste-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (AppState.charts.waste) AppState.charts.waste.destroy();

  AppState.charts.waste = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['Composted', 'Biogas', 'CPCB Disposed', 'Recycled'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: ['#57CC99', '#F4A261', '#E63946', '#6C63FF']
      }]
    },
    options: { responsive: true }
  });
}

function loadWasteRecords() {
  const list = document.getElementById('waste-records-list');
  if (!list) return;

  const blocks = blockchain.getBlocksByType(BLOCK_TYPES.WASTE_DISPOSAL);
  list.innerHTML = blocks.map(b => `
    <div class="waste-record">
      <span>${b.data.wasteId}</span>
      <span>📦 ${b.data.batchId}</span>
      <span>${b.data.category}</span>
      <span>${b.data.volume} kg</span>
      <span>${b.data.method}</span>
    </div>
  `).join('') || '<p class="no-data">No waste records</p>';
}

// ═══════════════════════════════════════════
// SUSTAINABILITY DASHBOARD
// ═══════════════════════════════════════════

function initSustainabilityDashboard() {
  const container = document.getElementById('sustainability-metrics');
  if (!container) return;

  const collections = blockchain.getBlocksByType(BLOCK_TYPES.COLLECTION);
  const totalQty = collections.reduce((sum, b) => sum + (b.data.quantity || 0), 0);
  const carbonFootprint = (totalQty * 0.8).toFixed(1);
  const waterSaved = (totalQty * 15).toFixed(0);

  container.innerHTML = `
    <div class="metric-card green">
      <h3>🌱 ${carbonFootprint} kg</h3>
      <p>CO₂ Footprint</p>
    </div>
    <div class="metric-card blue">
      <h3>💧 ${waterSaved} L</h3>
      <p>Water Usage</p>
    </div>
    <div class="metric-card amber">
      <h3>♻️ ${collections.length}</h3>
      <p>Sustainable Batches</p>
    </div>
    <div class="metric-card purple">
      <h3>🌿 ${totalQty} kg</h3>
      <p>Total Herbs Tracked</p>
    </div>
  `;

  const canvas = document.getElementById('sustainability-trend-chart');
  if (canvas && typeof Chart !== 'undefined') {
    if (AppState.charts.sustainability) AppState.charts.sustainability.destroy();
    AppState.charts.sustainability = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Carbon Footprint (kg CO₂)',
          data: [45, 38, 52, 41, 35, 28],
          borderColor: '#2D6A4F',
          backgroundColor: 'rgba(45,106,79,0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true }
    });
  }
}

// ═══════════════════════════════════════════
// INVENTORY DASHBOARD
// ═══════════════════════════════════════════

function initInventoryDashboard() {
  const container = document.getElementById('inventory-cards');
  if (!container) return;

  const herbs = ['Ashwagandha', 'Tulsi', 'Neem', 'Turmeric', 'Brahmi', 'Shatavari', 'Amla', 'Guduchi'];
  const collections = blockchain.getBlocksByType(BLOCK_TYPES.COLLECTION);

  const rates = {
    'Ashwagandha': 450, 'Tulsi': 320, 'Neem': 280, 'Turmeric': 200,
    'Brahmi': 550, 'Shatavari': 480, 'Amla': 180, 'Guduchi': 400
  };

  const inventory = herbs.map(herb => {
    const batches = collections.filter(b => b.data.herbType === herb);
    const total = batches.reduce((sum, b) => sum + (b.data.quantity || 0), 0);
    const maxStock = 500;
    const percentage = Math.min(100, (total / maxStock) * 100);
    return { herb, total, percentage, value: total * (rates[herb] || 300) };
  });

  container.innerHTML = inventory.map(item => `
    <div class="inventory-card ${item.percentage < 20 ? 'low-stock' : ''}">
      <div class="inv-header">
        <h4>🌿 ${item.herb}</h4>
        ${item.percentage < 20 ? '<span class="alert-badge">⚠️ Low Stock</span>' : ''}
      </div>
      <div class="inv-progress">
        <div class="progress-bar" style="width:${item.percentage}%"></div>
      </div>
      <div class="inv-details">
        <span>${item.total} kg</span>
        <span>₹${item.value.toLocaleString()}</span>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════
// ORDERS DASHBOARD
// ═══════════════════════════════════════════

function initOrdersDashboard() {
  renderOrdersTable();
}

async function handleOrderSubmit(e) {
  e.preventDefault();

  const productId = document.getElementById('order-product-id').value.trim();
  const quantity = parseInt(document.getElementById('order-quantity').value);
  const customerName = document.getElementById('order-customer').value.trim();

  if (!productId || !quantity || !customerName) {
    showToast('Fill all order fields', 'warning');
    return;
  }

  const orderData = {
    orderId: `ORD-${Date.now()}`,
    productId, quantity, customerName,
    status: 'pending',
    orderedBy: KrishiAuth.currentUser?.email || 'admin@krishi.com',
    timestamp: Date.now()
  };

  try {
    await db.collection('orders').add(orderData);
  } catch (err) { /* offline fallback */ }

  showToast(`📦 Order ${orderData.orderId} placed!`, 'success');
  e.target.reset();
  renderOrdersTable();
}

function renderOrdersTable() {
  const container = document.getElementById('orders-table-body');
  if (!container) return;

  const sampleOrders = [
    { orderId: 'ORD-001', productId: 'PROD-101', quantity: 50, customerName: 'Ayush Health', status: 'delivered', date: '2026-03-01' },
    { orderId: 'ORD-002', productId: 'PROD-102', quantity: 30, customerName: 'Vedic Store', status: 'shipped', date: '2026-03-03' },
    { orderId: 'ORD-003', productId: 'PROD-103', quantity: 100, customerName: 'Patanjali', status: 'processing', date: '2026-03-05' },
    { orderId: 'ORD-004', productId: 'PROD-104', quantity: 25, customerName: 'Dabur', status: 'pending', date: '2026-03-06' }
  ];

  container.innerHTML = sampleOrders.map(o => `
    <tr>
      <td>${o.orderId}</td>
      <td>${o.productId}</td>
      <td>${o.quantity}</td>
      <td>${o.customerName}</td>
      <td><span class="order-status status-${o.status}">${o.status}</span></td>
      <td>${o.date}</td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════
// INSURANCE DASHBOARD
// ═══════════════════════════════════════════

function initInsuranceDashboard() {
  renderInsurancePolicies();
  renderInsuranceClaims();
}

async function handleInsuranceSubmit(e) {
  e.preventDefault();

  const batchId = document.getElementById('insurance-batch-id').value.trim();
  const coverage = parseFloat(document.getElementById('insurance-coverage').value);
  const duration = document.getElementById('insurance-duration').value;

  if (!batchId || !coverage || !duration) {
    showToast('Fill all insurance fields', 'warning');
    return;
  }

  const policy = {
    policyId: `POL-${Date.now()}`,
    batchId, coverage, duration,
    premium: Math.round(coverage * 0.03),
    status: 'active',
    issuedBy: KrishiAuth.currentUser?.email || 'admin@krishi.com',
    timestamp: Date.now()
  };

  try {
    await db.collection('insurance').add(policy);
  } catch (err) { /* offline */ }

  showToast(`🛡️ Insurance policy ${policy.policyId} created`, 'success');
  e.target.reset();
  renderInsurancePolicies();
}

function renderInsurancePolicies() {
  const container = document.getElementById('insurance-policies-list');
  if (!container) return;

  const claims = blockchain.getBlocksByType(BLOCK_TYPES.INSURANCE_CLAIM);

  container.innerHTML = claims.length ? claims.map(c => `
    <div class="insurance-card">
      <div class="ins-header">
        <span class="ins-id">${c.data.claimId || 'N/A'}</span>
        <span class="ins-status status-${c.data.status?.toLowerCase()}">${c.data.status}</span>
      </div>
      <div class="ins-body">
        <span>📦 ${c.data.batchId}</span>
        <span>💰 ₹${c.data.claimAmount?.toLocaleString()}</span>
        <span>🌿 ${c.data.herbType}</span>
      </div>
    </div>
  `).join('') : '<p class="no-data">No insurance claims yet</p>';
}

function renderInsuranceClaims() {
  // Rendered as part of policies
}

// ═══════════════════════════════════════════
// DNA BANKING DASHBOARD
// ═══════════════════════════════════════════

function initDNADashboard() {
  renderDNAProfiles();
}

async function handleDNASubmit(e) {
  e.preventDefault();

  const herbVariety = document.getElementById('dna-herb-variety').value.trim();
  const geneticMarkers = document.getElementById('dna-markers').value.trim();
  const labId = document.getElementById('dna-lab-id').value.trim();

  if (!herbVariety || !geneticMarkers || !labId) {
    showToast('Fill all DNA profile fields', 'warning');
    return;
  }

  const dnaProfile = {
    profileId: `DNA-${Date.now()}`,
    herbVariety, geneticMarkers, labId,
    status: 'verified',
    registeredBy: KrishiAuth.currentUser?.email || 'admin@krishi.com',
    timestamp: Date.now()
  };

  blockchain.addBlock(BLOCK_TYPES.DNA_REGISTRATION, dnaProfile);

  try {
    await db.collection('dnaProfiles').add(dnaProfile);
  } catch (err) { /* offline */ }

  showToast(`🧬 DNA profile ${dnaProfile.profileId} registered`, 'success');
  e.target.reset();
  renderDNAProfiles();
}

function renderDNAProfiles() {
  const container = document.getElementById('dna-profiles-list');
  if (!container) return;

  const blocks = blockchain.getBlocksByType(BLOCK_TYPES.DNA_REGISTRATION);

  container.innerHTML = blocks.length ? blocks.map(b => `
    <div class="dna-card">
      <div class="dna-header">
        <span>🧬 ${b.data.profileId}</span>
        <span class="dna-status">${b.data.status}</span>
      </div>
      <div class="dna-body">
        <span>🌿 ${b.data.herbVariety}</span>
        <span>🔬 ${b.data.geneticMarkers}</span>
        <span>🏥 Lab: ${b.data.labId}</span>
      </div>
    </div>
  `).join('') : '<p class="no-data">No DNA profiles registered</p>';
}

// ═══════════════════════════════════════════
// DEMO DATA SEEDER
// ═══════════════════════════════════════════

async function seedDemoData() {
  showToast('🌱 Seeding demo data...', 'info');

  // Demo batches
  const demoBatches = [
    {
      batchId: 'BATCH-DEMO-001',
      farmerName: 'Ramesh Patel',
      farmerId: 'demo-farmer-1',
      herbType: 'Ashwagandha',
      quantity: 50,
      harvestDate: '2026-02-15',
      gps: { lat: 23.0225, lng: 72.5714 },
      status: 'pending',
      timestamp: Date.now() - 86400000 * 3
    },
    {
      batchId: 'BATCH-DEMO-002',
      farmerName: 'Sita Devi',
      farmerId: 'demo-farmer-2',
      herbType: 'Tulsi',
      quantity: 30,
      harvestDate: '2026-02-18',
      gps: { lat: 26.9124, lng: 75.7873 },
      status: 'pending',
      timestamp: Date.now() - 86400000 * 2
    },
    {
      batchId: 'BATCH-DEMO-003',
      farmerName: 'Vikram Singh',
      farmerId: 'demo-farmer-3',
      herbType: 'Neem',
      quantity: 75,
      harvestDate: '2026-02-20',
      gps: { lat: 28.6139, lng: 77.2090 },
      status: 'pending',
      timestamp: Date.now() - 86400000
    }
  ];

  for (const batch of demoBatches) {
    blockchain.addBlock(BLOCK_TYPES.COLLECTION, batch);
    try {
      await db.collection('batches').doc(batch.batchId).set(batch);
    } catch (err) { /* offline ok */ }
  }

  // Demo lab test (PASS)
  const passTest = {
    batchId: 'BATCH-DEMO-001',
    herbType: 'Ashwagandha',
    testParams: { moisture: 8.2, activeMarkers: 2.1, pesticides: 0.005, heavyMetals: 0.3, microbialCount: 5000 },
    result: 'PASS',
    details: [
      { param: 'Moisture', status: 'PASS', value: 8.2, threshold: 10 },
      { param: 'Active Markers', status: 'PASS', value: 2.1, threshold: 1.5 },
      { param: 'Pesticides', status: 'PASS', value: 0.005, threshold: 0.01 },
      { param: 'Heavy Metals', status: 'PASS', value: 0.3, threshold: 1.0 },
      { param: 'Microbial Count', status: 'PASS', value: 5000, threshold: 10000 }
    ],
    testedBy: 'lab@krishi.com'
  };
  blockchain.addBlock(BLOCK_TYPES.LAB_TEST, passTest);

  // Update batch status
  try {
    await db.collection('batches').doc('BATCH-DEMO-001').update({ status: 'passed' });
  } catch (err) { /* offline ok */ }

  // Trigger payment contract
  paymentContract.execute(demoBatches[0], passTest, blockchain);
  supplyChainContract.updateReputation('demo-farmer-1', 'Ramesh Patel', 'PASS');

  // Demo lab test (FAIL)
  const failTest = {
    batchId: 'BATCH-DEMO-002',
    herbType: 'Tulsi',
    testParams: { moisture: 15.0, activeMarkers: 0.3, pesticides: 0.05, heavyMetals: 2.0, microbialCount: 20000 },
    result: 'FAIL',
    details: [
      { param: 'Moisture', status: 'FAIL', value: 15.0, threshold: 12 },
      { param: 'Active Markers', status: 'FAIL', value: 0.3, threshold: 0.8 },
      { param: 'Pesticides', status: 'FAIL', value: 0.05, threshold: 0.01 },
      { param: 'Heavy Metals', status: 'FAIL', value: 2.0, threshold: 1.0 },
      { param: 'Microbial Count', status: 'FAIL', value: 20000, threshold: 10000 }
    ],
    testedBy: 'lab@krishi.com'
  };
  blockchain.addBlock(BLOCK_TYPES.LAB_TEST, failTest);
  try {
    await db.collection('batches').doc('BATCH-DEMO-002').update({ status: 'failed' });
  } catch (err) {}
  insuranceContract.execute(demoBatches[1], failTest, blockchain);
  supplyChainContract.updateReputation('demo-farmer-2', 'Sita Devi', 'FAIL');

  // Demo product
  const demoProduct = {
    productId: 'PROD-DEMO-001',
    productName: 'Ashwagandha Capsules',
    productType: 'Capsules',
    batchId: 'BATCH-DEMO-001',
    herbType: 'Ashwagandha',
    farmerName: 'Ramesh Patel',
    mfgDate: '2026-03-01',
    expiryDate: '2028-03-01',
    status: 'manufactured',
    timestamp: Date.now()
  };
  blockchain.addBlock(BLOCK_TYPES.MANUFACTURING, demoProduct);
  try {
    await db.collection('products').doc(demoProduct.productId).set(demoProduct);
  } catch (err) {}

  blockchain.syncToFirestore();
  showToast('✅ Demo data seeded successfully!', 'success');
}

// Check URL params for product trace
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');
  if (productId) {
    setTimeout(() => {
      showDashboard('consumer-portal');
      document.getElementById('product-id-input').value = productId;
      renderSupplyChainTimeline(productId);
    }, 1500);
  }
});