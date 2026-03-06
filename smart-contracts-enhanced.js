// Smart Contracts System
// Enhanced smart contracts for Krishi blockchain platform

// Smart Contract Base Class
class SmartContract {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.events = [];
  }

  async execute(data) {
    throw new Error('Execute method must be implemented by subclass');
  }

  logEvent(eventType, data) {
    const event = {
      contract: this.name,
      type: eventType,
      data: data,
      timestamp: Date.now()
    };
    this.events.push(event);
    
    // Add to blockchain
    return blockchain.addBlock(BLOCK_TYPES.SMART_CONTRACT_EVENT, event);
  }
}

// 1. Payment Contract
class PaymentContract extends SmartContract {
  constructor() {
    super('PaymentContract', 'Auto-pays farmers when products pass quality tests');
  }

  async execute(batchData, testResult) {
    if (testResult.result === 'PASS') {
      const paymentData = {
        type: 'payment_release',
        batchId: batchData.batchId,
        farmerId: batchData.farmerId,
        amount: this.calculatePayment(batchData),
        timestamp: Date.now()
      };
      
      await this.logEvent('payment_released', paymentData);
      return { success: true, message: `Payment of ₹${paymentData.amount} released to farmer` };
    }
    
    return { success: false, message: 'Batch failed quality test, payment withheld' };
  }

  calculatePayment(batchData) {
    // Simple payment calculation based on herb type and quantity
    const herbRates = {
      'Ashwagandha': 450,
      'Tulsi': 200,
      'Neem': 150,
      'Turmeric': 300,
      'Amla': 250,
      'Ginseng': 800,
      'Brahmi': 350,
      'Shatavari': 400
    };
    
    const rate = herbRates[batchData.herbType] || 200;
    return batchData.quantity * rate;
  }
}

// 2. Insurance Contract
class InsuranceContract extends SmartContract {
  constructor() {
    super('InsuranceContract', 'Auto-files claims when batches fail lab tests');
  }

  async execute(batchData, testResult) {
    if (testResult.result === 'FAIL') {
      const claimData = {
        type: 'insurance_claim',
        batchId: batchData.batchId,
        farmerId: batchData.farmerId,
        reason: this.getFailureReason(testResult),
        amount: this.calculateClaimAmount(batchData),
        timestamp: Date.now()
      };
      
      await this.logEvent('claim_submitted', claimData);
      return { success: true, message: `Insurance claim of ₹${claimData.amount} submitted` };
    }
    
    return { success: false, message: 'No claim needed, batch passed quality test' };
  }

  getFailureReason(testResult) {
    const params = testResult.parameters;
    if (params.pesticides !== 'none') return 'Pesticide contamination';
    if (params.adulterants !== 'none') return 'Adulteration detected';
    if (params.heavyMetals !== 'within-limits') return 'Heavy metal contamination';
    if (params.microbial !== 'within-limits') return 'Microbial contamination';
    return 'Unknown quality issue';
  }

  calculateClaimAmount(batchData) {
    // Calculate 70% of potential payment as insurance
    const paymentContract = new PaymentContract();
    const fullPayment = paymentContract.calculatePayment(batchData);
    return Math.floor(fullPayment * 0.7);
  }
}

// 3. Quality Contract
class QualityContract extends SmartContract {
  constructor() {
    super('QualityContract', 'Sets herb-specific quality thresholds and auto-approves/rejects');
  }

  // Herb-specific quality thresholds
  THRESHOLDS = {
    Ashwagandha: {
      maxMoisture: 10,
      minActiveMarkers: 1.5,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Tulsi: {
      maxMoisture: 12,
      minActiveMarkers: 0.8,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Neem: {
      maxMoisture: 15,
      minActiveMarkers: 0.5,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Turmeric: {
      maxMoisture: 12,
      minActiveMarkers: 2.0,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Amla: {
      maxMoisture: 10,
      minActiveMarkers: 1.0,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Ginseng: {
      maxMoisture: 8,
      minActiveMarkers: 3.0,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Brahmi: {
      maxMoisture: 10,
      minActiveMarkers: 0.5,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    },
    Shatavari: {
      maxMoisture: 10,
      minActiveMarkers: 1.0,
      maxPesticides: 0,
      maxHeavyMetals: 0,
      maxMicrobial: 0
    }
  };

  async execute(herbType, testParams) {
    const thresholds = this.THRESHOLDS[herbType];
    if (!thresholds) {
      return { result: 'FAIL', reason: 'Unknown herb type' };
    }

    // Check each parameter
    const checks = {
      moisture: testParams.moisture <= thresholds.maxMoisture,
      activeMarkers: testParams.activeMarkers >= thresholds.minActiveMarkers,
      pesticides: testParams.pesticides === 'none',
      heavyMetals: testParams.heavyMetals === 'within-limits',
      microbial: testParams.microbial === 'within-limits'
    };

    const allPassed = Object.values(checks).every(check => check);

    const result = {
      result: allPassed ? 'PASS' : 'FAIL',
      herbType: herbType,
      parameters: testParams,
      thresholds: thresholds,
      checks: checks,
      timestamp: Date.now()
    };

    await this.logEvent('quality_evaluation', result);
    return result;
  }
}

// 4. Supply Chain Contract
class SupplyChainContract extends SmartContract {
  constructor() {
    super('SupplyChainContract', 'Manages stakeholder reputation scores');
  }

  // Reputation scores for stakeholders
  reputationScores = new Map();

  async execute(stakeholderId, event) {
    const currentScore = this.reputationScores.get(stakeholderId) || 100;
    let newScore = currentScore;

    // Update score based on event type
    switch (event.type) {
      case 'collection':
        newScore += 5; // Positive for contributing to supply chain
        break;
      case 'lab_test_pass':
        newScore += 10; // Positive for quality assurance
        break;
      case 'lab_test_fail':
        newScore -= 20; // Negative for quality issues
        break;
      case 'manufacturing':
        newScore += 8; // Positive for processing
        break;
      case 'payment_released':
        newScore += 3; // Positive for financial transactions
        break;
      case 'claim_submitted':
        newScore -= 5; // Slight negative for claims
        break;
      default:
        newScore += 0; // No change for unknown events
    }

    // Ensure score stays within bounds
    newScore = Math.max(0, Math.min(100, newScore));
    this.reputationScores.set(stakeholderId, newScore);

    const reputationData = {
      stakeholderId: stakeholderId,
      previousScore: currentScore,
      newScore: newScore,
      event: event,
      timestamp: Date.now()
    };

    await this.logEvent('reputation_updated', reputationData);
    return { stakeholderId, previousScore: currentScore, newScore };
  }

  getReputationScore(stakeholderId) {
    return this.reputationScores.get(stakeholderId) || 100;
  }

  getReputationStatus(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Very Poor';
  }
}

// Contract Registry
class ContractRegistry {
  constructor() {
    this.contracts = new Map();
    this.registerContracts();
  }

  registerContracts() {
    this.register('PaymentContract', new PaymentContract());
    this.register('InsuranceContract', new InsuranceContract());
    this.register('QualityContract', new QualityContract());
    this.register('SupplyChainContract', new SupplyChainContract());
  }

  register(name, contract) {
    this.contracts.set(name, contract);
  }

  async executeContract(name, data) {
    const contract = this.contracts.get(name);
    if (!contract) {
      throw new Error(`Contract ${name} not found`);
    }
    
    return await contract.execute(data);
  }

  getContract(name) {
    return this.contracts.get(name);
  }

  getAllContracts() {
    return Array.from(this.contracts.values());
  }
}

// Initialize contracts
const contractRegistry = new ContractRegistry();

// Auto-execution triggers
class ContractTriggers {
  static async onLabTest(batchData, testResult) {
    try {
      // Execute Quality Contract
      const qualityContract = contractRegistry.getContract('QualityContract');
      const qualityResult = await qualityContract.execute(batchData.herbType, testResult.parameters);
      
      // Update test result with quality evaluation
      testResult.qualityEvaluation = qualityResult;
      
      // Execute Payment Contract if quality passes
      if (qualityResult.result === 'PASS') {
        const paymentContract = contractRegistry.getContract('PaymentContract');
        await paymentContract.execute(batchData, testResult);
      }
      
      // Execute Insurance Contract if quality fails
      if (qualityResult.result === 'FAIL') {
        const insuranceContract = contractRegistry.getContract('InsuranceContract');
        await insuranceContract.execute(batchData, testResult);
      }
      
      // Update Supply Chain Contract
      const supplyChainContract = contractRegistry.getContract('SupplyChainContract');
      await supplyChainContract.execute(batchData.farmerId, {
        type: qualityResult.result === 'PASS' ? 'lab_test_pass' : 'lab_test_fail',
        batchId: batchData.batchId,
        result: qualityResult.result
      });
      
      return { success: true, qualityResult };
    } catch (error) {
      console.error('Contract execution error:', error);
      return { success: false, error: error.message };
    }
  }

  static async onCollection(batchData) {
    try {
      const supplyChainContract = contractRegistry.getContract('SupplyChainContract');
      await supplyChainContract.execute(batchData.farmerId, {
        type: 'collection',
        batchId: batchData.batchId,
        herbType: batchData.herbType
      });
      
      return { success: true };
    } catch (error) {
      console.error('Collection trigger error:', error);
      return { success: false, error: error.message };
    }
  }

  static async onManufacturing(batchData) {
    try {
      const supplyChainContract = contractRegistry.getContract('SupplyChainContract');
      await supplyChainContract.execute(batchData.manufacturerId, {
        type: 'manufacturing',
        batchId: batchData.batchId,
        productId: batchData.productId
      });
      
      return { success: true };
    } catch (error) {
      console.error('Manufacturing trigger error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export for global use
window.SmartContracts = {
  PaymentContract,
  InsuranceContract,
  QualityContract,
  SupplyChainContract,
  ContractRegistry,
  ContractTriggers
};

window.contractRegistry = contractRegistry;