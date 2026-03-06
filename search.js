// Global Search System
// Provides search functionality across batches, herbs, farmers, and blockchain data

// Search configuration
const SEARCH_CONFIG = {
  debounceDelay: 300,
  minQueryLength: 2,
  maxResults: 20
};

// Search index
let searchIndex = {
  batches: [],
  farmers: [],
  herbs: [],
  products: []
};

// Initialize search
function initSearch() {
  // Initialize search listeners
  setupSearchListeners();
  
  // Build initial search index
  buildSearchIndex();
  
  // Set up real-time updates
  setupRealTimeUpdates();
}

// Setup search event listeners
function setupSearchListeners() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results-container');
  
  if (searchInput && searchResults) {
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (query.length >= SEARCH_CONFIG.minQueryLength) {
          performSearch(query);
        } else {
          searchResults.innerHTML = '';
        }
      }, SEARCH_CONFIG.debounceDelay);
    });
  }
}

// Build search index from available data
function buildSearchIndex() {
  // This would populate the search index with actual data from Firestore
  // For now, we'll use sample data
  
  searchIndex.batches = [
    { id: 'BATCH-001', herb: 'Ashwagandha', farmer: 'Ramesh Patel', quantity: '50kg', date: '2024-03-01' },
    { id: 'BATCH-002', herb: 'Tulsi', farmer: 'Sita Devi', quantity: '30kg', date: '2024-03-02' },
    { id: 'BATCH-003', herb: 'Neem', farmer: 'Amit Singh', quantity: '40kg', date: '2024-03-03' },
    { id: 'BATCH-004', herb: 'Turmeric', farmer: 'Priya Sharma', quantity: '25kg', date: '2024-03-04' }
  ];
  
  searchIndex.farmers = [
    { name: 'Ramesh Patel', location: 'Madhya Pradesh', batches: 5 },
    { name: 'Sita Devi', location: 'Uttar Pradesh', batches: 3 },
    { name: 'Amit Singh', location: 'Rajasthan', batches: 4 },
    { name: 'Priya Sharma', location: 'Gujarat', batches: 2 }
  ];
  
  searchIndex.herbs = [
    { name: 'Ashwagandha', scientific: 'Withania somnifera', uses: 'Stress relief, immunity' },
    { name: 'Tulsi', scientific: 'Ocimum sanctum', uses: 'Respiratory health' },
    { name: 'Neem', scientific: 'Azadirachta indica', uses: 'Skin health, immunity' },
    { name: 'Turmeric', scientific: 'Curcuma longa', uses: 'Anti-inflammatory' }
  ];
  
  searchIndex.products = [
    { id: 'PROD-001', name: 'Ashwagandha Premium Extract', type: 'Extract', batch: 'BATCH-001' },
    { id: 'PROD-002', name: 'Tulsi Capsules', type: 'Capsule', batch: 'BATCH-002' }
  ];
}

// Perform search across all indexes
function performSearch(query) {
  const results = {
    batches: [],
    farmers: [],
    herbs: [],
    products: []
  };
  
  const lowercaseQuery = query.toLowerCase();
  
  // Search batches
  results.batches = searchIndex.batches.filter(batch => 
    batch.id.toLowerCase().includes(lowercaseQuery) ||
    batch.herb.toLowerCase().includes(lowercaseQuery) ||
    batch.farmer.toLowerCase().includes(lowercaseQuery)
  );
  
  // Search farmers
  results.farmers = searchIndex.farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(lowercaseQuery) ||
    farmer.location.toLowerCase().includes(lowercaseQuery)
  );
  
  // Search herbs
  results.herbs = searchIndex.herbs.filter(herb => 
    herb.name.toLowerCase().includes(lowercaseQuery) ||
    herb.scientific.toLowerCase().includes(lowercaseQuery)
  );
  
  // Search products
  results.products = searchIndex.products.filter(product => 
    product.id.toLowerCase().includes(lowercaseQuery) ||
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.type.toLowerCase().includes(lowercaseQuery)
  );
  
  // Render results
  renderSearchResults(results, query);
}

// Render search results
function renderSearchResults(results, query) {
  const container = document.getElementById('search-results-container');
  if (!container) return;
  
  let html = `<h4>Search Results for: "${query}"</h4>`;
  
  // Batches section
  if (results.batches.length > 0) {
    html += `<div class="search-section">
      <h5>Herb Batches</h5>
      ${results.batches.map(batch => `
        <div class="search-result-item" onclick="selectSearchResult('batch', '${batch.id}')">
          <div class="result-header">
            <span class="result-title">${batch.id}</span>
            <span class="result-type">Batch</span>
          </div>
          <div class="result-details">
            <span class="result-meta">${batch.herb} • ${batch.quantity} • ${batch.farmer}</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  }
  
  // Farmers section
  if (results.farmers.length > 0) {
    html += `<div class="search-section">
      <h5>Farmers</h5>
      ${results.farmers.map(farmer => `
        <div class="search-result-item" onclick="selectSearchResult('farmer', '${farmer.name}')">
          <div class="result-header">
            <span class="result-title">${farmer.name}</span>
            <span class="result-type">Farmer</span>
          </div>
          <div class="result-details">
            <span class="result-meta">${farmer.location} • ${farmer.batches} batches</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  }
  
  // Herbs section
  if (results.herbs.length > 0) {
    html += `<div class="search-section">
      <h5>Herbs</h5>
      ${results.herbs.map(herb => `
        <div class="search-result-item" onclick="selectSearchResult('herb', '${herb.name}')">
          <div class="result-header">
            <span class="result-title">${herb.name}</span>
            <span class="result-type">Herb</span>
          </div>
          <div class="result-details">
            <span class="result-meta">${herb.scientific}</span><br>
            <span class="result-meta">${herb.uses}</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  }
  
  // Products section
  if (results.products.length > 0) {
    html += `<div class="search-section">
      <h5>Products</h5>
      ${results.products.map(product => `
        <div class="search-result-item" onclick="selectSearchResult('product', '${product.id}')">
          <div class="result-header">
            <span class="result-title">${product.name}</span>
            <span class="result-type">Product</span>
          </div>
          <div class="result-details">
            <span class="result-meta">${product.type} • ${product.batch}</span>
          </div>
        </div>
      `).join('')}
    </div>`;
  }
  
  if (Object.values(results).flat().length === 0) {
    html += `<p class="text-muted">No results found for "${query}". Try searching for batch IDs, herb names, or farmer names.</p>`;
  }
  
  container.innerHTML = html;
}

// Handle search result selection
function selectSearchResult(type, value) {
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  
  if (searchModal) {
    searchModal.style.display = 'none';
  }
  
  if (searchInput) {
    searchInput.value = value;
  }
  
  // Navigate to relevant dashboard based on type
  switch (type) {
    case 'batch':
      navigateToDashboard('blockchain-viewer');
      // Pre-fill blockchain search
      const batchSearchInput = document.getElementById('search-batch-id');
      if (batchSearchInput) {
        batchSearchInput.value = value;
        searchBlockchainByBatch(value);
      }
      break;
    case 'farmer':
      navigateToDashboard('farmer-dashboard');
      break;
    case 'herb':
      navigateToDashboard('lab-dashboard');
      break;
    case 'product':
      navigateToDashboard('consumer-portal');
      // Pre-fill product trace
      const productInput = document.getElementById('product-id-input');
      if (productInput) {
        productInput.value = value;
        traceProduct({ preventDefault: () => {} });
      }
      break;
  }
}

// Setup real-time updates for search index
function setupRealTimeUpdates() {
  // This would listen for Firestore changes and update the search index
  // For now, we'll use a simple interval to simulate real-time updates
  
  setInterval(() => {
    // In a real implementation, this would fetch updated data from Firestore
    // and rebuild the search index
  }, 30000); // Update every 30 seconds
}

// Advanced search with filters
function advancedSearch(query, filters = {}) {
  // This would implement advanced search with filters
  // For now, it falls back to basic search
  return performSearch(query);
}

// Export functions for global use
window.searchSystem = {
  init: initSearch,
  perform: performSearch,
  select: selectSearchResult,
  advanced: advancedSearch
};