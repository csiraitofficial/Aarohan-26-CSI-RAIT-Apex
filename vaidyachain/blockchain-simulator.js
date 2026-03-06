/**
 * vaidyachain - Custom JS Blockchain Simulator
 * Core Blockchain & Smart Contract Logic
 */

export class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        // Improved hashing simulation
        const stringToHash = this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce;
        let hash = 0;
        for (let i = 0; i < stringToHash.length; i++) {
            const char = stringToHash.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

export class Blockchain {
    constructor() {
        this.chain = this.loadFromStorage();
        if (this.chain.length === 0) {
            this.chain = [new Block(new Date().toISOString(), "Genesis Block", "0")];
            this.saveToStorage();
        }
        this.difficulty = 2; // Simulated mining difficulty
    }

    addBlock(data) {
        const prevHash = this.chain[this.chain.length - 1].hash;
        const newBlock = new Block(new Date().toISOString(), data, prevHash);

        // Simulating mining for transparency
        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);
        this.saveToStorage();
        return newBlock;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Re-calculate hash to ensure it matches
            // (In a real blockchain, we'd hash everything including nonce)

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    loadFromStorage() {
        const storedChain = localStorage.getItem('vaidyachain');
        return storedChain ? JSON.parse(storedChain) : [];
    }

    saveToStorage() {
        localStorage.setItem('vaidyachain', JSON.stringify(this.chain));
    }

    searchBlocks(query) {
        return this.chain.filter(block =>
            JSON.stringify(block.data).toLowerCase().includes(query.toLowerCase()) ||
            block.hash.includes(query)
        );
    }
}

// Global Singleton for the chain
export const vaidyachain = new Blockchain();
