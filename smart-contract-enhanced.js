// ═══════════════════════════════════════════════════════════════
// 📜 KRISHI — Smart Contracts Engine
// ═══════════════════════════════════════════════════════════════

// ─── Quality Contract ──────────────────────────────────────────
class QualityContract {
  constructor() {
    this.THRESHOLDS = {
      Ashwagandha: { maxMoisture: 10, minActiveMarkers: 1.5, maxPesticides: 0.5, maxHeavyMetals: 1.0 },
      Tulsi: { maxMoisture: 12, minActiveMarkers: 0.8, maxPesticides: 0.3, maxHeavyMetals: 0.5 },
      Neem: { maxMoisture: 11, minActiveMarkers: 1.0, maxPesticides: 0.4, maxHeavyMetals: 0.8 },
      Turmeric: { maxMoisture: 9, minActiveMarkers: 3.0, maxPesticides: 0.3, maxHeavyMetals: 0.5 },
      Brahmi: { maxMoisture: 12, minActiveMarkers: 0.5, maxPesticides: 0.2, maxHeavyMetals: 0.5 },
      Shatavari: { maxMoisture: 10, minActiveMarkers: 1.2, maxPesticides: 0.4, maxHeavyMetals: 0.8 },
      Guduchi: { maxMoisture: 11, minActiveMarkers: 0.8, maxPesticides: 0.3, maxHeavyMetals: 0.6 },
      Amla: { maxMoisture: 10, minActiveMarkers: 2.0, maxPesticides: 0.3, maxHeavyMetals: 0.5 }
    };
  }

  evaluate(herbType, testParams) {
    const threshold = this.THRESHOLDS[herbType];
    if (!threshold) {
      return { result: 'FAIL', reason: `Unknown herb type: ${herbType}`, score: 0 };
    }

    const checks = [];
    let score = 100;

    // Moisture check
    if (testParams.moisture > threshold.maxMoisture) {
      checks.push(`Moisture ${testParams.moisture}% exceeds max ${threshold.maxMoisture}%`);
      score -= 25;
    }

    // Active markers check
    if (testParams.activeMarkers < threshold.minActiveMarkers) {
      checks.push(`Active markers ${testParams.activeMarkers}% below min ${threshold.minActiveMarkers}%`);
      score -= 30;
    }

    // Pesticides check
    if (testParams.pesticides > threshold.maxPesticides) {
      checks.push(`Pesticides ${testParams.pesticides}ppm exceeds max ${threshold.maxPesticides}ppm`);
      score -= 25;
    }

    // Heavy metals check
    if (testParams.heavyMetals > threshold.maxHeavyMetals) {
      checks.push(`Heavy metals ${testParams.heavyMetals}ppm exceeds max ${threshold.maxHeavyMetals}ppm`);
      score -= 20;
    }

    // Adulterants check
    if (testParams.adulterants === 'significant') {
      checks.push('Significant adulterants detected');
      score -= 50;
    } else if (testParams.adulterants === 'minor') {
      score -= 10;
    }

    score = Math.max(0, score);
    const result = score >= 60 ? 'PASS' : 'FAIL';

    return {
      result,
      score,
      reason: checks.length > 0 ? checks.join('; ') : 'All parameters within limits',
      threshold,
      herbType,
      checkedAt: new Date().toISOString()
    };
  }
}

// ─── Payment Contract ──────────────────────────────────────────
class PaymentContract {
  execute(batchData, testResult) {
    if (testResult.result === 'PASS') {
      const marketRates = {
        Ashwagandha: 450, Tulsi: 280, Neem: 180, Turmeric: 320,
        Brahmi: 520, Shatavari: 380, Guduchi: 290, Amla: 150
      };

      const rate = marketRates[batchData.herbType] || 200;
      const amount = batchData.quantity * rate;
      const bonus = testResult.score >= 90 ? amount * 0.05 : 0;
      const totalPayment = amount + bonus;

      const block = blockchain.addBlock(BLOCK_TYPES.SMART_CONTRACT_EVENT, {
        contractType: 'PaymentContract',
        batchId: batchData.batchId,
        farmerId: batchData.farmerId,
        farmerName: batchData.farmerName,
        herbType: batchData.herbType,
        quantity: batchData.quantity,
        ratePerKg: rate,
        baseAmount: amount,
        qualityBonus: bonus,
        totalPayment: totalPayment,
        qualityScore: testResult.score,
        status: 'payment-released',
        message: `💰 Payment of ₹${totalPayment.toLocaleString()} released to ${batchData.farmerName}`
      });

      showToast(`💰 Smart Contract: ₹${totalPayment.toLocaleString()} payment released to ${batchData.farmerName}`, 'success', 5000);
      return { success: true, amount: totalPayment, block };
    }
    return { success: false, reason: 'Test did not pass' };
  }
}

// ─── Insurance Contract ────────────────────────────────────────
class InsuranceContract {
  execute(batchData, testResult) {
    if (testResult.result === 'FAIL') {
      const coverageAmount = batchData.quantity * 200; // Base coverage

      const block = blockchain.addBlock(BLOCK_TYPES.INSURANCE_CLAIM, {
        contractType: 'InsuranceContract',
        batchId: batchData.batchId,
        farmerId: batchData.farmerId,
        farmerName: batchData.farmerName,
        herbType: batchData.herbType,
        failureReason: testResult.reason,
        qualityScore: testResult.score,
        coverageAmount: coverageAmount,
        claimStatus: 'auto-filed',
        message: `🛡️ Insurance claim of ₹${coverageAmount.toLocaleString()} auto-filed for ${batchData.farmerName}`
      });

      // Also save to Firestore
      if (typeof db !== 'undefined' && auth.currentUser) {
        db.collection('insurance').add({
          type: 'auto-claim',
          batchId: batchData.batchId,
          farmerId: batchData.farmerId,
          farmerName: batchData.farmerName,
          coverageAmount,
          reason: testResult.reason,
          status: 'auto-filed',
          blockHash: block.hash,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      showToast(`🛡️ Insurance claim auto-filed: ₹${coverageAmount.toLocaleString()} for batch ${batchData.batchId}`, 'warning', 5000);
      return { success: true, coverageAmount, block };
    }
    return { success: false, reason: 'Test passed — no claim needed' };
  }
}

// ─── Supply Chain Contract ─────────────────────────────────────
class SupplyChainContract {
  constructor() {
    this.reputationScores = this.loadScores();
  }

  loadScores() {
    try {
      return JSON.parse(localStorage.getItem('krishi-reputation') || '{}');
    } catch { return {}; }
  }

  saveScores() {
    localStorage.setItem('krishi-reputation', JSON.stringify(this.reputationScores));
  }

  updateReputation(stakeholderId, event) {
    if (!this.reputationScores[stakeholderId]) {
      this.reputationScores[stakeholderId] = { score: 75, events: 0, passes: 0, fails: 0 };
    }

    const record = this.reputationScores[stakeholderId];
    record.events++;

    if (event === 'pass') {
      record.passes++;
      record.score = Math.min(100, record.score + 2);
    } else if (event === 'fail') {
      record.fails++;
      record.score = Math.max(0, record.score - 5);
    }

    this.saveScores();
    return record;
  }

  getReputationScore(stakeholderId) {
    return this.reputationScores[stakeholderId] || { score: 75, events: 0, passes: 0, fails: 0 };
  }

  getAllScores() {
    return { ...this.reputationScores };
  }
}

// ─── Initialize Smart Contracts ────────────────────────────────
const qualityContract = new QualityContract();
const paymentContract = new PaymentContract();
const insuranceContract = new InsuranceContract();
const supplyChainContract = new SupplyChainContract();

console.log('📜 Smart Contracts loaded — 4 contracts active');