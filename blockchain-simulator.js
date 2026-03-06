// Enhanced blockchain simulator for demo purposes
class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        // Simple hash function for demo
        return String(this.timestamp + JSON.stringify(this.data) + this.previousHash).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.batchIndex = {}; // New index for quick batch lookup
    }

    createGenesisBlock() {
        return new Block('01/01/2023', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);

        // Index batch IDs for quick lookup
        if (newBlock.data.batchId) {
            if (!this.batchIndex[newBlock.data.batchId]) {
                this.batchIndex[newBlock.data.batchId] = [];
            }
            this.batchIndex[newBlock.data.batchId].push(newBlock);
        }

        // Save to localStorage for persistence
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem('vaidyachain', JSON.stringify(this.chain));
        localStorage.setItem('vaidyachainBatchIndex', JSON.stringify(this.batchIndex));
    }

    loadFromStorage() {
        const chainData = localStorage.getItem('vaidyachain');
        const indexData = localStorage.getItem('vaidyachainBatchIndex');

        if (chainData) {
            this.chain = JSON.parse(chainData);
        }
        if (indexData) {
            this.batchIndex = JSON.parse(indexData);
        }
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // Find all transactions for a specific batch
    findBatchTransactions(batchId) {
        return this.batchIndex[batchId] || [];
    }

    // Find the latest status of a batch
    findBatchStatus(batchId) {
        const transactions = this.findBatchTransactions(batchId);
        if (transactions.length === 0) return null;

        // Return the latest transaction (last in array)
        return transactions[transactions.length - 1].data;
    }
}

// Initialize or load blockchain
let vaidyachain = new Blockchain();
vaidyachain.loadFromStorage();

// Function to add a new herb transaction
function addHerbTransaction(herbData) {
    const newBlock = new Block(new Date().toLocaleString(), herbData);
    vaidyachain.addBlock(newBlock);
    return newBlock;
}

// Function to get all herb transactions
function getAllHerbTransactions() {
    return vaidyachain.chain.filter(block => block.data.herbType || block.data.batchId || block.data.wasteBatchId);
}

// Function to find a herb by batch ID
function findHerbByBatchId(batchId) {
    const transactions = vaidyachain.findBatchTransactions(batchId);
    return transactions.length > 0 ? transactions[0] : null;
}

// Function to get all transactions for a batch
function getBatchHistory(batchId) {
    return vaidyachain.findBatchTransactions(batchId);
}

// Function to check if batch exists
function doesBatchExist(batchId) {
    return vaidyachain.findBatchTransactions(batchId).length > 0;
}

// Function to check if batch passed lab tests
function didBatchPassLabTests(batchId) {
    const transactions = vaidyachain.findBatchTransactions(batchId);
    const labTest = transactions.find(tx => tx.data.type === 'lab-test');
    return labTest && labTest.data.testResult === 'pass';
}

// ========== SMART CONTRACTS INTEGRATION ==========

class SmartContract {
    constructor(contractName, code) {
        this.contractName = contractName;
        this.code = code; // Contract logic as function
        this.state = {}; // Contract storage
        this.events = []; // Event log
    }

    execute(functionName, params = {}, caller = 'system') {
        const result = this.code[functionName](this.state, params, caller);
        if (result.event) {
            this.events.push({
                event: result.event,
                data: result.data,
                timestamp: new Date().toISOString(),
                caller: caller
            });
        }
        return result;
    }

    getEvents() {
        return this.events;
    }
}

// Smart Contract Registry
let smartContracts = {};

// Initialize Smart Contracts
function initializeSmartContracts() {
    // 1. Payment Contract - Handles automatic farmer payments
    smartContracts.paymentContract = new SmartContract('PaymentContract', {
        deposit: function (state, params) {
            const { farmerId, amount, productId } = params;
            if (!state.balances) state.balances = {};
            if (!state.balances[farmerId]) state.balances[farmerId] = 0;
            state.balances[farmerId] += amount;

            return {
                success: true,
                event: 'PaymentDeposited',
                data: { farmerId, amount, productId, newBalance: state.balances[farmerId] }
            };
        },

        releasePayment: function (state, params) {
            const { farmerId, batchId, percentage = 100 } = params;
            if (!state.balances || !state.balances[farmerId]) {
                return { success: false, error: 'No balance available' };
            }

            // Check if batch passed all quality tests
            if (!didBatchPassLabTests(batchId)) {
                return { success: false, error: 'Batch failed quality tests' };
            }

            const amount = (state.balances[farmerId] * percentage) / 100;
            state.balances[farmerId] -= amount;

            return {
                success: true,
                amount: amount,
                event: 'PaymentReleased',
                data: { farmerId, batchId, amount, remainingBalance: state.balances[farmerId] }
            };
        },

        getBalance: function (state, params) {
            const { farmerId } = params;
            return {
                success: true,
                balance: state.balances?.[farmerId] || 0
            };
        }
    });

    // 2. Insurance Contract - Handles crop failure claims
    smartContracts.insuranceContract = new SmartContract('InsuranceContract', {
        purchaseInsurance: function (state, params) {
            const { farmerId, batchId, premium, coverage } = params;
            if (!state.policies) state.policies = {};
            if (!state.claims) state.claims = {};

            state.policies[batchId] = {
                farmerId,
                premium,
                coverage,
                purchaseDate: new Date().toISOString(),
                status: 'active'
            };

            return {
                success: true,
                event: 'InsurancePurchased',
                data: { farmerId, batchId, premium, coverage }
            };
        },

        fileClaim: function (state, params) {
            const { batchId, claimType, evidence, lossAmount } = params;
            if (!state.policies[batchId] || state.policies[batchId].status !== 'active') {
                return { success: false, error: 'No active insurance policy' };
            }

            const policy = state.policies[batchId];
            const claimId = 'CLAIM-' + Date.now();

            state.claims[claimId] = {
                batchId,
                claimType,
                evidence,
                lossAmount,
                status: 'pending',
                filedDate: new Date().toISOString()
            };

            return {
                success: true,
                claimId,
                event: 'ClaimFiled',
                data: { claimId, batchId, claimType, lossAmount }
            };
        },

        processClaim: function (state, params) {
            const { claimId, approved, payoutAmount } = params;
            if (!state.claims[claimId]) {
                return { success: false, error: 'Claim not found' };
            }

            const claim = state.claims[claimId];
            const policy = state.policies[claim.batchId];

            if (approved && payoutAmount <= policy.coverage) {
                claim.status = 'approved';
                claim.payoutAmount = payoutAmount;
                claim.processedDate = new Date().toISOString();

                // Transfer payment to farmer via payment contract
                try {
                    const paymentResult = smartContracts.paymentContract.execute('deposit', {
                        farmerId: policy.farmerId,
                        amount: payoutAmount,
                        productId: claimId
                    });

                    console.log(`✅ Insurance payout SUCCESS: ₹${payoutAmount} transferred to farmer ${policy.farmerId}`);
                    console.log('Payment contract result:', paymentResult);

                    // Verify the payment was actually deposited
                    const paymentState = getContractState('paymentContract');
                    console.log('Payment contract state after deposit:', paymentState);

                } catch (error) {
                    console.error(`❌ Insurance payout FAILED:`, error);
                }

                return {
                    success: true,
                    event: 'ClaimApproved',
                    data: { claimId, payoutAmount, farmerId: policy.farmerId }
                };
            } else {
                claim.status = 'rejected';
                claim.processedDate = new Date().toISOString();

                return {
                    success: true,
                    event: 'ClaimRejected',
                    data: { claimId, reason: 'Insufficient evidence or coverage' }
                };
            }
        }
    });

    // 3. Quality Assurance Contract - Automated quality checks
    smartContracts.qualityContract = new SmartContract('QualityContract', {
        setQualityThresholds: function (state, params) {
            const { herbType, thresholds } = params;
            if (!state.thresholds) state.thresholds = {};
            state.thresholds[herbType] = thresholds;

            return {
                success: true,
                event: 'ThresholdsUpdated',
                data: { herbType, thresholds }
            };
        },

        checkQuality: function (state, params) {
            const { batchId, testResults } = params;
            const transactions = vaidyachain.findBatchTransactions(batchId);
            const collectionTx = transactions.find(tx => tx.data.type === 'collection');

            if (!collectionTx) {
                return { success: false, error: 'Batch not found' };
            }

            const herbType = collectionTx.data.herbType;
            const thresholds = state.thresholds?.[herbType];

            if (!thresholds) {
                return { success: false, error: 'No quality thresholds set for this herb type' };
            }

            const passed = Object.keys(thresholds).every(param => {
                const threshold = thresholds[param];
                const result = testResults[param];

                switch (threshold.operator) {
                    case '<': return result < threshold.value;
                    case '<=': return result <= threshold.value;
                    case '>': return result > threshold.value;
                    case '>=': return result >= threshold.value;
                    case '=': return result === threshold.value;
                    default: return false;
                }
            });

            if (passed) {
                // Auto-release payment to farmer
                smartContracts.paymentContract.execute('releasePayment', {
                    farmerId: collectionTx.data.farmer.id,
                    batchId: batchId
                });
            }

            return {
                success: true,
                passed,
                event: passed ? 'QualityCheckPassed' : 'QualityCheckFailed',
                data: { batchId, herbType, testResults, passed }
            };
        }
    });

    // 4. Supply Chain Tracking Contract
    smartContracts.supplyChainContract = new SmartContract('SupplyChainContract', {
        registerStakeholder: function (state, params) {
            const { stakeholderId, type, name, location, credentials } = params;
            if (!state.stakeholders) state.stakeholders = {};

            state.stakeholders[stakeholderId] = {
                type, // farmer, lab, manufacturer, distributor
                name,
                location,
                credentials,
                registeredDate: new Date().toISOString(),
                reputation: 100, // Starting reputation score
                verified: false
            };

            return {
                success: true,
                event: 'StakeholderRegistered',
                data: { stakeholderId, type, name }
            };
        },

        updateReputation: function (state, params) {
            const { stakeholderId, change, reason } = params;
            if (!state.stakeholders?.[stakeholderId]) {
                return { success: false, error: 'Stakeholder not found' };
            }

            state.stakeholders[stakeholderId].reputation += change;
            state.stakeholders[stakeholderId].reputation = Math.max(0, Math.min(100, state.stakeholders[stakeholderId].reputation));

            return {
                success: true,
                event: 'ReputationUpdated',
                data: { stakeholderId, change, newReputation: state.stakeholders[stakeholderId].reputation, reason }
            };
        },

        verifyBatchTransfer: function (state, params) {
            const { batchId, fromStakeholder, toStakeholder, transferType } = params;

            // Verify both stakeholders exist and are verified
            if (!state.stakeholders[fromStakeholder]?.verified || !state.stakeholders[toStakeholder]?.verified) {
                return { success: false, error: 'Unverified stakeholders cannot transfer batches' };
            }

            // Check batch ownership
            const transactions = vaidyachain.findBatchTransactions(batchId);
            const latestTx = transactions[transactions.length - 1];

            if (latestTx.data.currentOwner !== fromStakeholder) {
                return { success: false, error: 'Stakeholder does not own this batch' };
            }

            // Record transfer
            addHerbTransaction({
                type: 'batch-transfer',
                batchId,
                fromStakeholder,
                toStakeholder,
                transferType,
                timestamp: new Date().toISOString(),
                currentOwner: toStakeholder
            });

            return {
                success: true,
                event: 'BatchTransferred',
                data: { batchId, fromStakeholder, toStakeholder, transferType }
            };
        }
    });
}

// Initialize contracts on load
initializeSmartContracts();

// Smart Contract API Functions
function executeSmartContract(contractName, functionName, params = {}, caller = 'system') {
    if (!smartContracts[contractName]) {
        throw new Error(`Contract ${contractName} not found`);
    }

    const result = smartContracts[contractName].execute(functionName, params, caller);

    // Log to blockchain for transparency
    if (result.event) {
        addHerbTransaction({
            type: 'smart-contract-event',
            contract: contractName,
            function: functionName,
            event: result.event,
            data: result.data,
            caller: caller,
            timestamp: new Date().toISOString()
        });
    }

    return result;
}

function getContractState(contractName) {
    return smartContracts[contractName]?.state || null;
}

function getContractEvents(contractName) {
    return smartContracts[contractName]?.getEvents() || [];
}

// Real-time Smart Contract Triggers (Simulated)
function checkSmartContractTriggers() {
    const allTx = getAllHerbTransactions();
    const insuranceState = getContractState('insuranceContract');

    // 1. Auto-release payments when products are sold
    const manufacturingTx = allTx.filter(tx => tx.data.type === 'manufacturing');

    manufacturingTx.forEach(tx => {
        const batchId = tx.data.batchId;
        const farmerId = getBatchHistory(batchId).find(t => t.data.type === 'collection')?.data.farmer.id;

        if (farmerId) {
            // Simulate product sale - in real system this would be triggered by actual sales
            const paymentResult = executeSmartContract('paymentContract', 'releasePayment', {
                farmerId,
                batchId,
                percentage: 80 // Release 80% on manufacturing
            });

            if (paymentResult.success) {
                console.log(`Auto-payment released: ₹${paymentResult.amount} to farmer ${farmerId}`);
            }
        }
    });

    // 2. Auto-file insurance claims for failed batches (only once per batch)
    const failedLabTests = allTx.filter(tx => tx.data.type === 'lab-test' && tx.data.testResult === 'fail');

    failedLabTests.forEach(tx => {
        const batchId = tx.data.batchId;
        const farmerId = getBatchHistory(batchId).find(t => t.data.type === 'collection')?.data.farmer.id;

        // Check if insurance policy exists for this batch
        if (insuranceState?.policies?.[batchId]) {
            // Check if claim already exists for this batch
            const existingClaims = insuranceState.claims ? Object.values(insuranceState.claims) : [];
            const hasExistingClaim = existingClaims.some(claim => claim.batchId === batchId);

            if (!hasExistingClaim) {
                // File new claim
                const claimResult = executeSmartContract('insuranceContract', 'fileClaim', {
                    batchId: batchId,
                    claimType: 'quality-failure',
                    evidence: tx.data,
                    lossAmount: 5000
                });

                if (claimResult.success) {
                    // Immediately process and approve the claim
                    const processResult = executeSmartContract('insuranceContract', 'processClaim', {
                        claimId: claimResult.claimId,
                        approved: true,
                        payoutAmount: 5000
                    });

                    console.log(`Insurance claim filed and approved for batch ${batchId}: ₹5000 paid to farmer ${farmerId}`);
                }
            }
        }
    });
}

// Auto-run triggers every 30 seconds (simulated real-time)
setInterval(checkSmartContractTriggers, 30000);

// Save/Load Smart Contracts
function saveSmartContracts() {
    const contractData = {};
    Object.keys(smartContracts).forEach(name => {
        contractData[name] = {
            state: smartContracts[name].state,
            events: smartContracts[name].events
        };
    });
    localStorage.setItem('vaidyaSmartContracts', JSON.stringify(contractData));
}

function loadSmartContracts() {
    const contractData = localStorage.getItem('vaidyaSmartContracts');
    if (contractData) {
        const data = JSON.parse(contractData);
        Object.keys(data).forEach(name => {
            if (smartContracts[name]) {
                smartContracts[name].state = data[name].state;
                smartContracts[name].events = data[name].events;
            }
        });
    }
}

// Load contracts on initialization
loadSmartContracts();

// Save contracts periodically
setInterval(saveSmartContracts, 10000);

// ========== GLOBAL EXPORTS FOR UI ACCESS ==========
// Make smart contract functions globally available
window.executeSmartContract = executeSmartContract;
window.getContractState = getContractState;
window.getContractEvents = getContractEvents;

// Define helper functions globally
window.getTimeAgo = function (date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

window.getEventIcon = function (eventType) {
    const icons = {
        'PaymentDeposited': '💰',
        'PaymentReleased': '✅',
        'InsurancePurchased': '🛡️',
        'ClaimFiled': '📋',
        'ClaimApproved': '🎉',
        'ClaimRejected': '❌',
        'QualityCheckPassed': '✅',
        'QualityCheckFailed': '❌',
        'StakeholderRegistered': '👤',
        'ReputationUpdated': '⭐',
        'BatchTransferred': '📦'
    };
    return icons[eventType] || '🔄';
};

window.getEventDescription = function (event) {
    switch (event.event) {
        case 'PaymentDeposited':
            return `₹${event.data.amount} deposited for farmer ${event.data.farmerId}`;
        case 'PaymentReleased':
            return `₹${event.data.amount} released to farmer ${event.data.farmerId}`;
        case 'InsurancePurchased':
            return `Insurance purchased for batch ${event.data.batchId}`;
        case 'ClaimFiled':
            return `Claim filed for ₹${event.data.lossAmount}`;
        case 'ClaimApproved':
            return `Claim approved: ₹${event.data.payoutAmount} paid`;
        case 'QualityCheckPassed':
            return `Quality check passed for batch ${event.data.batchId}`;
        case 'QualityCheckFailed':
            return `Quality check failed for batch ${event.data.batchId}`;
        default:
            return event.event;
    }
};

// Additional helper functions for UI
window.depositToPaymentContract = function () {
    const amount = prompt('Enter amount to deposit (₹):');
    if (amount && parseFloat(amount) > 0) {
        try {
            executeSmartContract('paymentContract', 'deposit', {
                farmerId: 'FARMER-DEMO',
                amount: parseFloat(amount),
                productId: 'DEMO-DEPOSIT'
            });
            alert(`₹${amount} deposited to payment contract!`);
            // Refresh dashboard if it exists
            if (typeof loadSmartContractData === 'function') {
                loadSmartContractData();
            }
            return true;
        } catch (error) {
            alert('Error depositing funds: ' + error.message);
            return false;
        }
    }
    return false;
};

window.purchaseInsurance = function () {
    const batchId = prompt('Enter batch ID to insure:');
    if (batchId) {
        try {
            executeSmartContract('insuranceContract', 'purchaseInsurance', {
                farmerId: 'FARMER-DEMO',
                batchId: batchId,
                premium: 500,
                coverage: 5000
            });
            alert(`Insurance purchased for batch ${batchId}!`);
            if (typeof loadSmartContractData === 'function') {
                loadSmartContractData();
            }
            return true;
        } catch (error) {
            alert('Error purchasing insurance: ' + error.message);
            return false;
        }
    }
    return false;
};

window.registerStakeholder = function () {
    const stakeholderId = prompt('Enter stakeholder ID:');
    const type = prompt('Enter type (farmer/lab/manufacturer):');
    const name = prompt('Enter name:');

    if (stakeholderId && type && name) {
        try {
            executeSmartContract('supplyChainContract', 'registerStakeholder', {
                stakeholderId,
                type,
                name,
                location: 'Demo Location',
                credentials: 'Verified'
            });
            alert(`Stakeholder ${name} registered successfully!`);
            if (typeof loadSmartContractData === 'function') {
                loadSmartContractData();
            }
            return true;
        } catch (error) {
            alert('Error registering stakeholder: ' + error.message);
            return false;
        }
    }
    return false;
};

// View functions
window.viewPaymentHistory = function () {
    const events = getContractEvents('paymentContract');
    let history = 'Payment Contract History:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No payment history yet.');
};

window.viewInsuranceClaims = function () {
    const events = getContractEvents('insuranceContract');
    let history = 'Insurance Claims History:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No insurance claims yet.');
};

window.viewQualityEvents = function () {
    const events = getContractEvents('qualityContract');
    let history = 'Quality Assurance Events:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No quality events yet.');
};

window.viewTransferHistory = function () {
    const events = getContractEvents('supplyChainContract');
    let history = 'Supply Chain Transfer History:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No transfer history yet.');
};

// Reset Smart Contracts Data
window.resetSmartContracts = function () {
    if (confirm('Are you sure you want to reset all smart contract data? This will clear all balances, policies, and events.')) {
        // Clear smart contract storage
        localStorage.removeItem('vaidyaSmartContracts');
        // Reset contract states
        Object.keys(smartContracts).forEach(name => {
            smartContracts[name].state = {};
            smartContracts[name].events = [];
        });
        // Reload the page to refresh UI
        location.reload();
    }
};

// Debug function to test insurance payment transfer
window.testInsurancePayment = function () {
    console.log('=== INSURANCE PAYMENT DEBUG ===');

    // Check insurance contract state
    const insuranceState = getContractState('insuranceContract');
    console.log('Insurance contract state:', insuranceState);

    // Check payment contract state
    const paymentState = getContractState('paymentContract');
    console.log('Payment contract state:', paymentState);

    // Test direct deposit
    console.log('Testing direct deposit...');
    const testResult = executeSmartContract('paymentContract', 'deposit', {
        farmerId: 'FARMER-DEMO',
        amount: 1000,
        productId: 'TEST-PAYMENT'
    });
    console.log('Direct deposit result:', testResult);

    // Check updated payment state
    const updatedPaymentState = getContractState('paymentContract');
    console.log('Updated payment contract state:', updatedPaymentState);

    alert('Check browser console (F12) for debug information!');
};
