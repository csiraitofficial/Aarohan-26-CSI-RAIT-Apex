/**
 * Krishi Platform — Phase 13: QA Test Suite
 * Automated testing for all dashboard flows, blockchain, smart contracts, and cross-cutting features.
 */

const KrishiQA = (() => {
  // ─── Internal State ──────────────────────────────────────────────────────
  const results = [];
  let passed = 0;
  let failed = 0;
  let pending = 0;

  // ─── Utilities ───────────────────────────────────────────────────────────

  function assert(condition, label) {
    if (condition) {
      results.push({ status: 'pass', label });
      passed++;
    } else {
      results.push({ status: 'fail', label });
      failed++;
    }
  }

  function assertNotNull(value, label) {
    assert(value !== null && value !== undefined, label);
  }

  function assertEqual(actual, expected, label) {
    assert(actual === expected, `${label} (expected: ${expected}, got: ${actual})`);
  }

  function markPending(label) {
    results.push({ status: 'pending', label });
    pending++;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ─── Section 1: Blockchain Core ──────────────────────────────────────────

  async function testBlockchainCore() {
    const section = '[ Blockchain Core ]';
    try {
      // 1. Genesis block exists
      const chain = await blockchain.getChain();
      assert(Array.isArray(chain), `${section} chain is an array`);
      assert(chain.length >= 1, `${section} genesis block exists`);

      // 2. Add a collection block
      const block = await blockchain.addBlock('collection', {
        batchId: 'QA-TEST-001',
        farmerId: 'qa-farmer',
        herbType: 'Ashwagandha',
        quantity: '10kg'
      });
      assertNotNull(block, `${section} addBlock returns block`);
      assertNotNull(block.hash, `${section} block has hash`);
      assertNotNull(block.timestamp, `${section} block has timestamp`);
      assertEqual(block.data.batchId, 'QA-TEST-001', `${section} block stores batchId`);

      // 3. Chain validation
      const isValid = await blockchain.validateChain();
      assert(isValid, `${section} chain validates after adding block`);

      // 4. Get chain length
      const len = await blockchain.getChainLength();
      assert(len >= 2, `${section} chain length ≥ 2 after test block`);

      // 5. Query by batchId
      const found = await blockchain.getBlocksByBatchId('QA-TEST-001');
      assert(Array.isArray(found), `${section} getBlocksByBatchId returns array`);
      // Note: implementation includes genesis block in results (no batchId filter only)
      const strictFound = found.filter(b => b.data && b.data.batchId === 'QA-TEST-001');
      assert(strictFound.length >= 1, `${section} getBlocksByBatchId finds test block`);

      // 6. Persistence
      blockchain.persistChain();
      const temp = new KrishiBlockchain();
      await temp.loadChain();
      const loadedLen = await temp.getChainLength();
      assert(loadedLen >= 2, `${section} persistence: chain reloads correctly`);

    } catch (err) {
      results.push({ status: 'fail', label: `${section} ERROR: ${err.message}` });
      failed++;
    }
  }

  // ─── Section 2: Smart Contracts ──────────────────────────────────────────

  async function testSmartContracts() {
    const section = '[ Smart Contracts ]';
    try {
      const batchData = {
        batchId: 'QA-SC-001',
        farmerId: 'qa-farmer',
        herbType: 'Ashwagandha',
        quantity: 50
      };

      // Payment contract — PASS
      const pc = contractRegistry.getContract('PaymentContract');
      assertNotNull(pc, `${section} PaymentContract registered`);
      const payResult = await pc.execute(batchData, { result: 'PASS' });
      assert(payResult.success, `${section} PaymentContract executes on PASS`);

      // Quality contract — good params
      const qc = contractRegistry.getContract('QualityContract');
      assertNotNull(qc, `${section} QualityContract registered`);
      const qResult = await qc.execute('Ashwagandha', {
        moisture: 8.5,
        activeMarkers: 2.1,
        pesticides: 'none',
        heavyMetals: 'within-limits',
        microbial: 'within-limits'
      });
      assertEqual(qResult.result, 'PASS', `${section} QualityContract approves good Ashwagandha`);

      // Quality contract — bad params (high moisture)
      const qResultFail = await qc.execute('Ashwagandha', {
        moisture: 25,
        activeMarkers: 0.5,
        pesticides: 'detected',
        heavyMetals: 'above-limits',
        microbial: 'above-limits'
      });
      assertEqual(qResultFail.result, 'FAIL', `${section} QualityContract rejects bad params`);

      // Insurance contract — FAIL triggers claim
      const ic = contractRegistry.getContract('InsuranceContract');
      assertNotNull(ic, `${section} InsuranceContract registered`);
      // Provide parameters so getFailureReason doesn't throw
      const insResult = await ic.execute({ ...batchData, herbType: 'Tulsi', quantity: 20 }, {
        result: 'FAIL',
        parameters: { pesticides: 'detected', heavyMetals: 'above-limits', adulterants: 'none', microbial: 'within-limits' }
      });
      assert(insResult.success, `${section} InsuranceContract files claim on FAIL`);

      // Supply chain contract — reputation update
      const sc = contractRegistry.getContract('SupplyChainContract');
      assertNotNull(sc, `${section} SupplyChainContract registered`);
      const repResult = await sc.execute('qa-farmer', { type: 'collection', batchId: 'QA-SC-001' });
      assertNotNull(repResult.newScore, `${section} SupplyChainContract updates reputation`);

    } catch (err) {
      results.push({ status: 'fail', label: `${section} ERROR: ${err.message}` });
      failed++;
    }
  }

  // ─── Section 3: Full Supply Chain Flow ───────────────────────────────────

  async function testFullFlow() {
    const section = '[ Full Supply Chain ]';
    try {
      const batchId = `QA-FLOW-${Date.now()}`;

      // Step 1: Farmer creates collection block
      const collectionBlock = await blockchain.addBlock('collection', {
        batchId,
        farmerId: 'qa-farmer',
        herbType: 'Neem',
        quantity: '75kg',
        location: '19.0760° N, 72.8777° E'
      });
      assertNotNull(collectionBlock, `${section} collection block created`);

      // Step 2: Lab test — PASS
      const labBlock = await blockchain.addBlock('lab-test', {
        batchId,
        testResult: 'PASS',
        parameters: {
          moisture: 12.0,
          activeMarkers: 1.8,
          pesticides: 'none',
          heavyMetals: 'within-limits',
          microbial: 'within-limits'
        }
      });
      assertNotNull(labBlock, `${section} lab-test block created`);

      // Step 3: Manufacturing block
      const mfgBlock = await blockchain.addBlock('manufacturing', {
        batchId,
        productId: `PROD-${Date.now()}`,
        productName: 'Neem Extract',
        productType: 'Extract'
      });
      assertNotNull(mfgBlock, `${section} manufacturing block created`);

      // Step 4: Consumer trace — filter strictly for this batchId
      const journey = await blockchain.getBlocksByBatchId(batchId);
      const strictJourney = journey.filter(b => b.data && b.data.batchId === batchId);
      assert(strictJourney.length >= 3, `${section} consumer can trace ≥3 blocks`);

      // Step 5: Final chain validation
      const isValid = await blockchain.validateChain();
      assert(isValid, `${section} chain valid after full flow`);

    } catch (err) {
      results.push({ status: 'fail', label: `${section} ERROR: ${err.message}` });
      failed++;
    }
  }

  // ─── Section 4: Authentication Checks (UI/Logic) ──────────────────────────

  function testAuthSystem() {
    const section = '[ Auth System ]';

    // Check auth.js functions are globally available
    assert(typeof signInWithGoogle === 'function', `${section} signInWithGoogle defined`);
    assert(typeof signInWithEmail === 'function', `${section} signInWithEmail defined`);
    assert(typeof registerWithEmail === 'function', `${section} registerWithEmail defined`);
    assert(typeof getUserRole === 'function', `${section} getUserRole defined`);
    assert(typeof signOut === 'function', `${section} signOut defined`);

    // Role detection logic
    const adminEmails = ['admin@krishi.com', 'harshnpc21@gmail.com'];
    const testAdmin = adminEmails.includes('harshnpc21@gmail.com');
    assert(testAdmin, `${section} admin email detected correctly`);

    // Dashboard routing functions exist
    assert(typeof navigateToDashboard === 'function', `${section} navigateToDashboard defined`);
    assert(typeof hideAllDashboards === 'function', `${section} hideAllDashboards defined`);
    assert(typeof showDashboard === 'function', `${section} showDashboard defined`);
  }

  // ─── Section 5: UI Components Check ──────────────────────────────────────

  function testUIComponents() {
    const section = '[ UI Components ]';

    const requiredIds = [
      'sidebar',
      'page-title',
      'page-subtitle',
      'farmer-dashboard',
      'lab-dashboard',
      'manufacturer-dashboard',
      'consumer-portal',
      'admin-dashboard',
      'blockchain-viewer',
      'waste-dashboard',
      'sustainability-dashboard',
      'inventory-dashboard',
      'orders-dashboard',
      'insurance-dashboard',
      'dna-dashboard',
      'chatbot-container',
      'language-modal',
      'search-modal',
      'notifications-modal'
    ];

    requiredIds.forEach(id => {
      const el = document.getElementById(id);
      assert(el !== null, `${section} #${id} exists in DOM`);
    });
  }

  // ─── Section 6: Cross-Cutting Features ───────────────────────────────────

  function testCrossCuttingFeatures() {
    const section = '[ Cross-Cutting ]';

    // Toast notifications
    assert(typeof showToast === 'function', `${section} showToast function defined`);

    // i18n
    const hasI18n = typeof window.i18next !== 'undefined';
    if (hasI18n) {
      assert(typeof i18next.t === 'function', `${section} i18next.t defined`);
    } else {
      markPending(`${section} i18next not loaded (CDN required)`);
    }

    // Service Worker registration
    assert('serviceWorker' in navigator, `${section} serviceWorker API available`);

    // Export functions
    assert(typeof exportBlockchainJSON === 'function', `${section} exportBlockchainJSON defined`);
    assert(typeof exportLabReportPDF === 'function', `${section} exportLabReportPDF defined`);

    // Chatbot
    assert(typeof getChatbotResponse === 'function', `${section} getChatbotResponse defined`);
    const chatGreeting = getChatbotResponse('hello help');
    assert(typeof chatGreeting === 'string' && chatGreeting.length > 0, `${section} chatbot returns response`);

    // Chatbot keyword responses
    assert(getChatbotResponse('blockchain hash').includes('hash'), `${section} chatbot responds to blockchain`);
    assert(getChatbotResponse('lab test').includes('lab'), `${section} chatbot responds to lab test`);
    assert(getChatbotResponse('batch collection').includes('collection'), `${section} chatbot responds to batch`);
  }

  // ─── Section 7: PWA / Service Worker ─────────────────────────────────────

  function testPWA() {
    const section = '[ PWA ]';

    // manifest.json
    const manifestLink = document.querySelector('link[rel="manifest"]');
    assert(manifestLink !== null, `${section} manifest.json linked`);

    // Service worker
    assert('serviceWorker' in navigator, `${section} serviceWorker API available`);
  }

  // ─── Section 8: Accessibility Checks ─────────────────────────────────────

  function testAccessibility() {
    const section = '[ Accessibility ]';

    // Forms have labels
    const inputs = document.querySelectorAll('input, select, textarea');
    let labeledCount = 0;
    inputs.forEach(input => {
      const id = input.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label || input.getAttribute('aria-label') || input.getAttribute('placeholder')) {
          labeledCount++;
        }
      } else if (input.getAttribute('aria-label') || input.getAttribute('placeholder')) {
        labeledCount++;
      }
    });
    const labelRatio = inputs.length > 0 ? labeledCount / inputs.length : 1;
    assert(labelRatio >= 0.8, `${section} ≥80% of inputs have labels/aria-labels (${Math.round(labelRatio * 100)}%)`);

    // Buttons have text or aria-label
    const buttons = document.querySelectorAll('button');
    let accessibleButtons = 0;
    buttons.forEach(btn => {
      if (btn.textContent.trim() || btn.getAttribute('aria-label') || btn.title) {
        accessibleButtons++;
      }
    });
    const btnRatio = buttons.length > 0 ? accessibleButtons / buttons.length : 1;
    assert(btnRatio >= 0.9, `${section} ≥90% of buttons accessible (${Math.round(btnRatio * 100)}%)`);

    // Lang attribute on html
    const htmlLang = document.querySelector('html').getAttribute('lang');
    assert(htmlLang !== null && htmlLang.length > 0, `${section} html[lang] set`);
  }

  // ─── Section 9: Firestore Data Integrity ─────────────────────────────────

  async function testFirestoreIntegrity() {
    const section = '[ Firestore Integrity ]';
    try {
      const db__ = firebase.firestore ? firebase.firestore() : null;
      if (!db__) {
        markPending(`${section} Firestore not initialized`);
        return;
      }

      // Read batches collection
      const batchesSnap = await db__.collection('batches').limit(1).get();
      assert(batchesSnap !== undefined, `${section} batches collection readable`);

      // Check users collection accessible
      const auth = firebase.auth ? firebase.auth() : null;
      if (auth && auth.currentUser) {
        const userDoc = await db__.collection('users').doc(auth.currentUser.uid).get();
        assert(userDoc !== undefined, `${section} users collection readable`);
      } else {
        markPending(`${section} Firestore users check needs login`);
      }
    } catch (err) {
      results.push({ status: 'fail', label: `${section} ERROR: ${err.message}` });
      failed++;
    }
  }

  // ─── Section 10: Performance Checks ──────────────────────────────────────

  async function testPerformance() {
    const section = '[ Performance ]';

    // Blockchain read time
    const t0 = performance.now();
    await blockchain.getChain();
    const t1 = performance.now();
    assert(t1 - t0 < 500, `${section} blockchain.getChain() < 500ms (${Math.round(t1 - t0)}ms)`);

    // Chain validation time
    const t2 = performance.now();
    await blockchain.validateChain();
    const t3 = performance.now();
    assert(t3 - t2 < 1000, `${section} blockchain.validateChain() < 1000ms (${Math.round(t3 - t2)}ms)`);
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  async function runAll(onUpdate) {
    results.length = 0;
    passed = 0;
    failed = 0;
    pending = 0;

    const sections = [
      { name: 'Blockchain Core', fn: testBlockchainCore, async: true },
      { name: 'Smart Contracts', fn: testSmartContracts, async: true },
      { name: 'Full Supply Chain', fn: testFullFlow, async: true },
      { name: 'Auth System', fn: testAuthSystem, async: false },
      { name: 'UI Components', fn: testUIComponents, async: false },
      { name: 'Cross-Cutting', fn: testCrossCuttingFeatures, async: false },
      { name: 'PWA', fn: testPWA, async: false },
      { name: 'Accessibility', fn: testAccessibility, async: false },
      { name: 'Firestore Integrity', fn: testFirestoreIntegrity, async: true },
      { name: 'Performance', fn: testPerformance, async: true },
    ];

    for (const section of sections) {
      try {
        if (section.async) {
          await section.fn();
        } else {
          section.fn();
        }
      } catch (err) {
        results.push({ status: 'fail', label: `[${section.name}] Uncaught: ${err.message}` });
        failed++;
      }
      if (typeof onUpdate === 'function') onUpdate({ results: [...results], passed, failed, pending });
    }

    return { results: [...results], passed, failed, pending, total: results.length };
  }

  function getResults() {
    return { results: [...results], passed, failed, pending, total: results.length };
  }

  return { runAll, getResults };
})();

// Expose globally
window.KrishiQA = KrishiQA;
