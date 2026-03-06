// search.js
// Global search system

const KrishiSearch = {
  searchIndex: [],

  buildIndex() {
    this.searchIndex = [];

    // Index batches from localStorage
    try {
      const chainData = localStorage.getItem('krishi-blockchain');
      if (chainData) {
        const chain = JSON.parse(chainData);
        chain.forEach(block => {
          if (block.data) {
            this.searchIndex.push({
              type: 'block',
              blockType: block.type,
              batchId: block.data.batchId || '',
              farmerName: block.data.farmerName || '',
              herbType: block.data.herbType || '',
              productId: block.data.productId || '',
              productName: block.data.productName || '',
              timestamp: block.timestamp,
              hash: block.hash
            });
          }
        });
      }
    } catch (e) { /* ignore */ }
  },

  search(query) {
    if (!query || query.length < 2) return [];
    this.buildIndex();

    const q = query.toLowerCase().trim();

    return this.searchIndex.filter(item => {
      return (
        (item.batchId && item.batchId.toLowerCase().includes(q)) ||
        (item.farmerName && item.farmerName.toLowerCase().includes(q)) ||
        (item.herbType && item.herbType.toLowerCase().includes(q)) ||
        (item.productId && item.productId.toLowerCase().includes(q)) ||
        (item.productName && item.productName.toLowerCase().includes(q)) ||
        (item.blockType && item.blockType.toLowerCase().includes(q))
      );
    }).slice(0, 10);
  },

  renderResults(results) {
    const panel = document.getElementById('search-results');
    if (!panel) return;

    if (results.length === 0) {
      panel.innerHTML = '<div class="search-no-results">No results found</div>';
      panel.style.display = 'block';
      return;
    }

    const icons = {
      'collection': '🌾', 'lab-test': '🧪', 'manufacturing': '🏭',
      'send-to-lab': '📦', 'smart-contract-event': '📜',
      'insurance-claim': '🛡️', 'genesis': '🌱'
    };

    panel.innerHTML = results.map(item => `
      <div class="search-result-item" 
           onclick="KrishiSearch.handleResultClick('${item.batchId || item.productId}')">
        <span class="search-icon">${icons[item.blockType] || '📦'}</span>
        <div class="search-item-info">
          <strong>${item.batchId || item.productId || item.blockType}</strong>
          <small>${item.farmerName || ''} ${item.herbType || ''} ${item.productName || ''}</small>
          <small class="search-time">${new Date(item.timestamp).toLocaleDateString()}</small>
        </div>
      </div>
    `).join('');
    panel.style.display = 'block';
  },

  handleResultClick(id) {
    const panel = document.getElementById('search-results');
    if (panel) panel.style.display = 'none';
    const searchInput = document.getElementById('global-search');
    if (searchInput) searchInput.value = '';

    if (id && id.startsWith('BATCH')) {
      showToast(`Found batch: ${id}`, 'info');
    } else if (id && id.startsWith('PROD')) {
      showToast(`Found product: ${id}`, 'info');
    }
  },

  init() {
    const searchInput = document.getElementById('global-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      if (q.length >= 2) {
        const results = this.search(q);
        this.renderResults(results);
      } else {
        const panel = document.getElementById('search-results');
        if (panel) panel.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-wrapper')) {
        const panel = document.getElementById('search-results');
        if (panel) panel.style.display = 'none';
      }
    });

    console.log('🔍 Search system initialized');
  }
};