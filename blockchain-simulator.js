// Blockchain Simulator
// Custom JavaScript blockchain implementation for Krishi

// Block Types
const BLOCK_TYPES = {
  COLLECTION: 'collection',
  SEND_TO_LAB: 'send-to-lab',
  LAB_TEST: 'lab-test',
  MANUFACTURING: 'manufacturing',
  SMART_CONTRACT_EVENT: 'smart-contract-event',
  INSURANCE_CLAIM: 'insurance-claim',
  DNA_REGISTRATION: 'dna-registration'
};

// Block Class
class Block {
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    // Simple SHA-like hash using built-in crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(
      this.timestamp + 
      JSON.stringify(this.data) + 
      this.previousHash + 
      this.nonce
    );
    
    return crypto.subtle.digest('SHA-256', data).then(buffer => {
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
  }

  mineBlock(difficulty) {
    return new Promise((resolve) => {
      const target = '0'.repeat(difficulty);
      let hashPromise = this.calculateHash();
      
      const mine = async () => {
        const hash = await hashPromise;
        if (hash.substring(0, difficulty) === target) {
          resolve(hash);
        } else {
          this.nonce++;
          hashPromise = this.calculateHash();
          mine();
        }
      };
      
      mine();
    });
  }
}

// Blockchain Class
class KrishiBlockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 2; // Mining difficulty
    this.pendingTransactions = [];
    this.chainName = 'Krishi Herb Traceability';
  }

  async getGenesisBlock() {
    const genesisBlock = new Block(Date.now(), {
      type: 'genesis',
      data: 'Genesis Block - Krishi Blockchain',
      chainName: this.chainName
    });
    genesisBlock.previousHash = '0';
    genesisBlock.hash = await genesisBlock.calculateHash();
    return genesisBlock;
  }

  async getLatestBlock() {
    if (this.chain.length === 0) {
      const genesis = await this.getGenesisBlock();
      this.chain.push(genesis);
    }
    return this.chain[this.chain.length - 1];
  }

  async addBlock(type, data) {
    const previousBlock = await this.getLatestBlock();
    const newBlock = new Block(Date.now(), { type, ...data }, previousBlock.hash);
    
    // Mine the block
    await newBlock.mineBlock(this.difficulty);
    
    // Add to chain
    this.chain.push(newBlock);
    
    // Persist to localStorage
    this.persistChain();
    
    // Sync to Firestore
    this.syncToFirestore(newBlock);
    
    return newBlock;
  }

  async validateChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if current block hash is valid
      const currentHash = await currentBlock.calculateHash();
      if (currentHash !== currentBlock.hash) {
        return false;
      }

      // Check if previous hash matches
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  async getBlocksByBatchId(batchId) {
    return this.chain.filter(block => {
      return block.data.batchId === batchId || 
             block.data.batchId === undefined; // Include genesis block
    });
  }

  async getBlocksByType(type) {
    return this.chain.filter(block => block.data.type === type);
  }

  async getBlockByHash(hash) {
    return this.chain.find(block => block.hash === hash);
  }

  async getChainLength() {
    return this.chain.length;
  }

  async getChain() {
    return this.chain;
  }

  // Persistence methods
  persistChain() {
    localStorage.setItem('krishi-blockchain', JSON.stringify(this.chain));
  }

  loadChain() {
    const savedChain = localStorage.getItem('krishi-blockchain');
    if (savedChain) {
      this.chain = JSON.parse(savedChain);
    }
  }

  async syncToFirestore(block) {
    try {
      await db.collection('blockchain').doc(block.hash).set({
        timestamp: block.timestamp,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        nonce: block.nonce
      });
    } catch (error) {
      console.error('Error syncing block to Firestore:', error);
    }
  }

  async loadFromFirestore() {
    try {
      const snapshot = await db.collection('blockchain').orderBy('timestamp').get();
      this.chain = [];
      snapshot.forEach(doc => {
        const blockData = doc.data();
        const block = new Block(blockData.timestamp, blockData.data, blockData.previousHash);
        block.hash = blockData.hash;
        block.nonce = blockData.nonce;
        this.chain.push(block);
      });
    } catch (error) {
      console.error('Error loading blockchain from Firestore:', error);
    }
  }
}

// Initialize blockchain
const blockchain = new KrishiBlockchain();

// Load existing chain
blockchain.loadChain();

// Export for global use
window.blockchain = blockchain;
window.BLOCK_TYPES = BLOCK_TYPES;