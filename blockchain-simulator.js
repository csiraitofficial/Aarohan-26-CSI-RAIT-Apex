// ═══════════════════════════════════════════════════════════════
// 🔗 KRISHI — Blockchain Simulator Engine
// ═══════════════════════════════════════════════════════════════

const BLOCK_TYPES = {
  COLLECTION: 'collection',
  SEND_TO_LAB: 'send-to-lab',
  LAB_TEST: 'lab-test',
  MANUFACTURING: 'manufacturing',
  SMART_CONTRACT_EVENT: 'smart-contract-event',
  INSURANCE_CLAIM: 'insurance-claim',
  DNA_REGISTRATION: 'dna-registration'
};

// ─── Block Class ───────────────────────────────────────────────
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const str = this.index + this.previousHash + this.timestamp +
      JSON.stringify(this.data) + this.nonce;
    return simpleHash(str);
  }
}

// ─── Simple Hash Function ──────────────────────────────────────
function simpleHash(str) {
  let hash = 0;
  const salt = 'krishi-blockchain-2026';
  const input = salt + str;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Create a hex-like string
  let hex = Math.abs(hash).toString(16);
  // Pad and extend to look like a real hash
  while (hex.length < 64) {
    hash = ((hash << 5) - hash) + hex.charCodeAt(hex.length % hex.length);
    hex += Math.abs(hash).toString(16);
  }
  return hex.substring(0, 64);
}

// ─── Krishi Blockchain Class ───────────────────────────────────
class KrishiBlockchain {
  constructor() {
    this.chain = [];
    this.loadChain();
    if (this.chain.length === 0) {
      this.chain.push(this.createGenesisBlock());
      this.persistChain();
    }
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), {
      type: 'genesis',
      message: '🌿 Krishi Blockchain Genesis — Trace Every Herb',
      creator: 'Krishi Platform',
      version: '1.0.0'
    }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(type, data) {
    const newData = { type, ...data, addedAt: new Date().toISOString() };
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      newData,
      previousBlock.hash
    );
    this.chain.push(newBlock);
    this.persistChain();
    this.syncToFirestore(newBlock);
    return newBlock;
  }

  validateChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // Recalculate hash
      const recalculated = simpleHash(
        current.index + current.previousHash + current.timestamp +
        JSON.stringify(current.data) + current.nonce
      );

      if (current.hash !== recalculated) {
        return { valid: false, error: `Block ${i} hash mismatch`, blockIndex: i };
      }
      if (current.previousHash !== previous.hash) {
        return { valid: false, error: `Block ${i} previous hash mismatch`, blockIndex: i };
      }
    }
    return { valid: true, blocks: this.chain.length };
  }

  getBlocksByBatchId(batchId) {
    return this.chain.filter(block =>
      block.data && (
        block.data.batchId === batchId ||
        block.data.productId === batchId
      )
    );
  }

  getBlocksByType(type) {
    return this.chain.filter(block => block.data && block.data.type === type);
  }

  persistChain() {
    try {
      localStorage.setItem('krishi-blockchain', JSON.stringify(this.chain));
    } catch (e) {
      console.warn('Failed to persist blockchain:', e);
    }
  }

  loadChain() {
    try {
      const saved = localStorage.getItem('krishi-blockchain');
      if (saved) {
        this.chain = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load blockchain:', e);
      this.chain = [];
    }
  }

  syncToFirestore(block) {
    if (typeof db !== 'undefined' && auth.currentUser) {
      db.collection('blockchain').add({
        blockIndex: block.index,
        hash: block.hash,
        previousHash: block.previousHash,
        data: block.data,
        timestamp: block.timestamp,
        syncedAt: firebase.firestore.FieldValue.serverTimestamp(),
        syncedBy: auth.currentUser.uid
      }).catch(err => console.warn('Blockchain sync failed:', err));
    }
  }

  getChainLength() {
    return this.chain.length;
  }

  getFullChain() {
    return [...this.chain];
  }

  clearChain() {
    this.chain = [this.createGenesisBlock()];
    this.persistChain();
  }
}

// ─── Initialize Global Blockchain ──────────────────────────────
const blockchain = new KrishiBlockchain();

console.log(`🔗 Blockchain loaded — ${blockchain.getChainLength()} blocks`);