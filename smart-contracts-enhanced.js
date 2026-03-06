// Enhanced Smart Contracts Dashboard Functions

// Generate deterministic contract address from batch/policy ID
function generateContractAddress(id) {
    if (!id) return '0x0000...0000';
    const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const addr = '0x' + Math.abs(hash).toString(16).padStart(8, '0') + Math.abs(hash).toString(16).padStart(8, '0').slice(-8);
    return addr.substring(0, 10) + '...' + addr.substring(addr.length - 6);
}

// Override the original loadSmartContractsDashboard with enhanced version
function loadSmartContractsDashboard() {
    const container = document.getElementById('dashboard-container');
    
    // Get real data from blockchain
    const allTransactions = getAllHerbTransactions();
    const collections = allTransactions.filter(tx => tx.data.type === 'collection');
    const labTests = allTransactions.filter(tx => tx.data.type === 'lab-test');
    const passedTests = labTests.filter(tx => tx.data.testResult === 'pass');
    const policies = allTransactions.filter(tx => tx.data.type === 'insurance-policy');
    const activePolicies = policies.filter(p => p.data.status === 'active');
    const claims = allTransactions.filter(tx => tx.data.type === 'insurance-claim');
    const approvedClaims = claims.filter(c => c.data.status === 'approved');
    const manufacturing = allTransactions.filter(tx => tx.data.type === 'manufacturing');
    
    // Calculate real stats
    const totalEarnings = passedTests.length * 5000;
    const pendingPayments = collections.filter(c => {
        return !labTests.some(l => l.data.batchId === c.data.batchId);
    }).length;
    
    // Generate dynamic contract addresses based on actual data
    const paymentContractAddress = collections.length > 0 ? generateContractAddress(collections[0].data.batchId || 'PAYMENT') : '0x1a2b...3c4d';
    const insuranceContractAddress = activePolicies.length > 0 ? generateContractAddress(activePolicies[0].data.policyId || 'INSURANCE') : '0x5e6f...7g8h';
    const qualityContractAddress = labTests.length > 0 ? generateContractAddress(labTests[0].data.batchId || 'QUALITY') : '0x9i0j...1k2l';
    const supplyChainContractAddress = manufacturing.length > 0 ? generateContractAddress(manufacturing[0].data.productId || 'SUPPLY') : '0x3m4n...5o6p';

    // Count unique entities
    const uniqueFarmers = new Set(collections.map(c => c.data.farmer?.id).filter(Boolean)).size;
    const uniqueLabs = new Set(labTests.map(l => l.data.lab?.id).filter(Boolean)).size;

    container.innerHTML = `
        <div class="dashboard">
            <h2>Smart Contracts Dashboard</h2>
            <p class="dashboard-subtitle">Real-time blockchain contract monitoring</p>
            
            <!-- Stats Overview -->
            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="active-contracts">${4 + activePolicies.length}</div>
                    <div class="stat-label">Active Contracts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-earnings">₹${totalEarnings.toLocaleString()}</div>
                    <div class="stat-label">Total Earnings</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="pending-payments">${pendingPayments}</div>
                    <div class="stat-label">Pending Payments</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="insurance-policies">${activePolicies.length}</div>
                    <div class="stat-label">Insurance Policies</div>
                </div>
            </div>

            <!-- Farmer's Payment Contract Section -->
            <div class="herb-card">
                <h3><i class="ph ph-currency-inr"></i> Payment Contract</h3>
                <p>Automatic payments triggered by quality approvals</p>
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Contract Address:</span>
                        <span style="font-family: monospace;">${paymentContractAddress}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Status:</span>
                        <span style="color: #22c55e; font-weight: bold;">Active</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Trigger:</span>
                        <span>Lab test approval</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Total Batches:</span>
                        <span>${collections.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Approved:</span>
                        <span style="color: #22c55e;">${passedTests.length}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="add-btn" onclick="viewPaymentHistory()">View Payment History</button>
                    <button class="add-btn outline" onclick="checkPendingPayments()">Check Pending Payments</button>
                </div>
            </div>

            <!-- Insurance Contract Section -->
            <div class="herb-card">
                <h3><i class="ph ph-shield-check"></i> Insurance Contract</h3>
                <p>Parametric insurance for weather and quality risks</p>
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Contract Address:</span>
                        <span style="font-family: monospace;">${insuranceContractAddress}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Status:</span>
                        <span style="color: #22c55e; font-weight: bold;">Active</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Active Policies:</span>
                        <span>${activePolicies.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Claims Filed:</span>
                        <span>${claims.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Approved Claims:</span>
                        <span style="color: #22c55e;">${approvedClaims.length}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="add-btn" onclick="showDashboard('insurance')">Manage Insurance</button>
                    <button class="add-btn outline" onclick="viewInsuranceClaims()">View Claims</button>
                </div>
            </div>

            <!-- Quality Assurance Contract Section -->
            <div class="herb-card">
                <h3><i class="ph ph-flask"></i> Quality Assurance Contract</h3>
                <p>Automated quality verification and certification</p>
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Contract Address:</span>
                        <span style="font-family: monospace;">${qualityContractAddress}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Status:</span>
                        <span style="color: #22c55e; font-weight: bold;">Active</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Total Tests:</span>
                        <span>${labTests.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Passed:</span>
                        <span style="color: #22c55e;">${passedTests.length}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Standards:</span>
                        <span>Ayush, FSSAI, WHO-GMP</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="add-btn" onclick="viewQualityEvents()">View Quality Events</button>
                </div>
            </div>

            <!-- Supply Chain Contract Section -->
            <div class="herb-card">
                <h3><i class="ph ph-truck"></i> Supply Chain Contract</h3>
                <p>Track and automate transfers along the supply chain</p>
                <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Contract Address:</span>
                        <span style="font-family: monospace;">${supplyChainContractAddress}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Status:</span>
                        <span style="color: #22c55e; font-weight: bold;">Active</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Farmers:</span>
                        <span>${uniqueFarmers}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">Labs:</span>
                        <span>${uniqueLabs}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Manufacturers:</span>
                        <span>${manufacturing.length}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="add-btn" onclick="viewTransferHistory()">View Transfers</button>
                </div>
            </div>

            <!-- Real-Time Events -->
            <div class="herb-card">
                <h3>Real-Time Contract Events</h3>
                <div id="events-list"></div>
            </div>

            <!-- Quick Stats for Farmers -->
            <div class="herb-card">
                <h3>Your Smart Contract Benefits</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
                        <div style="font-size: 24px; margin-bottom: 10px;">⏱️</div>
                        <h4 style="margin: 0 0 8px 0;">Instant Payments</h4>
                        <p style="margin: 0; opacity: 0.9; font-size: 14px;">Get paid automatically within 24 hours of quality approval</p>
                    </div>
                    <div style="padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white;">
                        <div style="font-size: 24px; margin-bottom: 10px;">🛡️</div>
                        <h4 style="margin: 0 0 8px 0;">Risk Protection</h4>
                        <p style="margin: 0; opacity: 0.9; font-size: 14px;">Automatic insurance claims when conditions are met</p>
                    </div>
                    <div style="padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white;">
                        <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                        <h4 style="margin: 0 0 8px 0;">Quality Certification</h4>
                        <p style="margin: 0; opacity: 0.9; font-size: 14px;">Blockchain-verified quality certificates for better prices</p>
                    </div>
                    <div style="padding: 20px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 12px; color: white;">
                        <div style="font-size: 24px; margin-bottom: 10px;">📈</div>
                        <h4 style="margin: 0 0 8px 0;">Market Access</h4>
                        <p style="margin: 0; opacity: 0.9; font-size: 14px;">Direct access to manufacturers without middlemen</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    loadSmartContractData();
    
    // Auto-refresh every 5 seconds
    window.smartContractsRefreshInterval = setInterval(loadSmartContractsDashboard, 5000);
}

// Function to update contract statistics
function updateContractStats() {
    // This is now handled in loadSmartContractsDashboard directly
    loadSmartContractsDashboard();
}

// Cleanup on dashboard change
const originalShowDashboard = window.showDashboard;
window.showDashboard = function(type) {
    if (window.smartContractsRefreshInterval) {
        clearInterval(window.smartContractsRefreshInterval);
    }
    if (originalShowDashboard) {
        originalShowDashboard(type);
    }
};
