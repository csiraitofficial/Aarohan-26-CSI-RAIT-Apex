import crypto from 'crypto'

export interface Block {
  index: number
  timestamp: string
  data: any
  previousHash: string
  hash: string
  nonce: number
}

export interface Blockchain {
  chain: Block[]
  difficulty: number
}

class BlockchainManager {
  private chain: Block[]
  private difficulty: number

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2
  }

  createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: new Date().toISOString(),
      data: { message: 'Genesis Block' },
      previousHash: '0',
      hash: this.calculateHash(0, '0', new Date().toISOString(), { message: 'Genesis Block' }, 0),
      nonce: 0
    }
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  calculateHash(index: number, previousHash: string, timestamp: string, data: any, nonce: number): string {
    const dataString = index + previousHash + timestamp + JSON.stringify(data) + nonce
    return crypto.createHash('sha256').update(dataString).digest('hex')
  }

  proofOfWork(block: Block): string {
    let nonce = 0
    let hash = this.calculateHash(block.index, block.previousHash, block.timestamp, block.data, nonce)
    
    while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      nonce++
      hash = this.calculateHash(block.index, block.previousHash, block.timestamp, block.data, nonce)
    }
    
    return hash
  }

  addBlock(data: any): Block {
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      data: data,
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0
    }

    newBlock.hash = this.proofOfWork(newBlock)
    this.chain.push(newBlock)
    return newBlock
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.timestamp, currentBlock.data, currentBlock.nonce)) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  getChain(): Block[] {
    return this.chain
  }

  getBlockchainInfo() {
    return {
      length: this.chain.length,
      difficulty: this.difficulty,
      isValid: this.isChainValid(),
      latestBlock: this.getLatestBlock()
    }
  }
}

// Export singleton instance
export const blockchain = new BlockchainManager()

// Utility functions for blockchain operations
export const createHerbTransaction = (herbData: {
  farmerId: string
  herbType: string
  quantity: number
  location: { lat: number; lng: number }
  timestamp: string
}) => {
  return {
    type: 'HERB_COLLECTION',
    ...herbData,
    transactionId: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  }
}

export const createLabTestTransaction = (testData: {
  batchId: string
  labId: string
  testResults: any
  qualityScore: number
}) => {
  return {
    type: 'LAB_TEST',
    ...testData,
    transactionId: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  }
}

export const createManufacturingTransaction = (manufacturingData: {
  batchId: string
  manufacturerId: string
  productId: string
  quantity: number
}) => {
  return {
    type: 'MANUFACTURING',
    ...manufacturingData,
    transactionId: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  }
}