// Demo Data Seeding System
// Comprehensive demo data initialization for hackathon presentation

// Demo data from demo-data.js
const DEMO_ACCOUNTS = {
    admin: {
        email: 'admin@krishi.com',
        password: 'admin123',
        displayName: 'Admin User',
        role: 'admin'
    },
    farmer: {
        email: 'farmer@krishi.com',
        password: 'farmer123',
        displayName: 'Ramesh Patel',
        role: 'farmer'
    },
    lab: {
        email: 'lab@krishi.com',
        password: 'lab123',
        displayName: 'Dr. Anjali Sharma',
        role: 'lab'
    },
    manufacturer: {
        email: 'manufacturer@krishi.com',
        password: 'manufacturer123',
        displayName: 'Aarogya Herbs Pvt Ltd',
        role: 'manufacturer'
    },
    consumer: {
        email: 'consumer@krishi.com',
        password: 'consumer123',
        displayName: 'Priya Kumar',
        role: 'consumer'
    }
};

const DEMO_BATCHES = [
    {
        batchId: 'BATCH-1741234567890',
        farmerName: 'Ramesh Patel',
        herbType: 'Ashwagandha',
        quantity: 50,
        harvestDate: '2026-03-01',
        location: '22.3000°N, 73.1999°E',
        coordinates: { latitude: 22.3, longitude: 73.1999 },
        status: 'tested',
        testResult: 'PASS',
        farmerId: 'demo-farmer-001',
        labResults: {
            result: 'PASS',
            testedAt: new Date('2026-03-02T10:30:00Z'),
            parameters: {
                moisture: 8.5,
                activeMarkers: 1.8,
                pesticides: 'none',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        }
    },
    {
        batchId: 'BATCH-1741234567891',
        farmerName: 'Ramesh Patel',
        herbType: 'Tulsi',
        quantity: 30,
        harvestDate: '2026-03-05',
        location: '22.3000°N, 73.1999°E',
        coordinates: { latitude: 22.3, longitude: 73.1999 },
        status: 'tested',
        testResult: 'PASS',
        farmerId: 'demo-farmer-001',
        labResults: {
            result: 'PASS',
            testedAt: new Date('2026-03-06T14:20:00Z'),
            parameters: {
                moisture: 10.2,
                activeMarkers: 0.9,
                pesticides: 'none',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        }
    },
    {
        batchId: 'BATCH-1741234567892',
        farmerName: 'Ramesh Patel',
        herbType: 'Neem',
        quantity: 40,
        harvestDate: '2026-03-08',
        location: '22.3000°N, 73.1999°E',
        coordinates: { latitude: 22.3, longitude: 73.1999 },
        status: 'failed',
        testResult: 'FAIL',
        farmerId: 'demo-farmer-001',
        labResults: {
            result: 'FAIL',
            testedAt: new Date('2026-03-09T11:45:00Z'),
            parameters: {
                moisture: 16.5,
                activeMarkers: 0.3,
                pesticides: 'traces',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        }
    }
];

const DEMO_PRODUCTS = [
    {
        productId: 'PROD-1741234567890',
        productName: 'Ashwagandha Root Powder',
        productType: 'Herbal Supplement',
        batchId: 'BATCH-1741234567890',
        manufacturingDate: '2026-03-03',
        expiryDate: '2027-03-03',
        manufacturerId: 'demo-manufacturer-001',
        status: 'available'
    },
    {
        productId: 'PROD-1741234567891',
        productName: 'Holy Basil Capsules',
        productType: 'Herbal Supplement',
        batchId: 'BATCH-1741234567891',
        manufacturingDate: '2026-03-07',
        expiryDate: '2027-03-07',
        manufacturerId: 'demo-manufacturer-001',
        status: 'available'
    }
];

const DEMO_BLOCKCHAIN = [
    {
        timestamp: 1741234567000,
        data: {
            type: 'collection',
            batchId: 'BATCH-1741234567890',
            farmerName: 'Ramesh Patel',
            herbType: 'Ashwagandha',
            quantity: 50,
            harvestDate: '2026-03-01',
            location: '22.3000°N, 73.1999°E',
            farmerId: 'demo-farmer-001'
        },
        previousHash: '0',
        hash: 'demo-hash-001',
        nonce: 0
    },
    {
        timestamp: 1741234568000,
        data: {
            type: 'collection',
            batchId: 'BATCH-1741234567891',
            farmerName: 'Ramesh Patel',
            herbType: 'Tulsi',
            quantity: 30,
            harvestDate: '2026-03-05',
            location: '22.3000°N, 73.1999°E',
            farmerId: 'demo-farmer-001'
        },
        previousHash: 'demo-hash-001',
        hash: 'demo-hash-002',
        nonce: 0
    },
    {
        timestamp: 1741234569000,
        data: {
            type: 'collection',
            batchId: 'BATCH-1741234567892',
            farmerName: 'Ramesh Patel',
            herbType: 'Neem',
            quantity: 40,
            harvestDate: '2026-03-08',
            location: '22.3000°N, 73.1999°E',
            farmerId: 'demo-farmer-001'
        },
        previousHash: 'demo-hash-002',
        hash: 'demo-hash-003',
        nonce: 0
    },
    {
        timestamp: 1741234570000,
        data: {
            type: 'lab-test',
            batchId: 'BATCH-1741234567890',
            testResult: 'PASS',
            parameters: {
                moisture: 8.5,
                activeMarkers: 1.8,
                pesticides: 'none',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        },
        previousHash: 'demo-hash-003',
        hash: 'demo-hash-004',
        nonce: 0
    },
    {
        timestamp: 1741234571000,
        data: {
            type: 'lab-test',
            batchId: 'BATCH-1741234567891',
            testResult: 'PASS',
            parameters: {
                moisture: 10.2,
                activeMarkers: 0.9,
                pesticides: 'none',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        },
        previousHash: 'demo-hash-004',
        hash: 'demo-hash-005',
        nonce: 0
    },
    {
        timestamp: 1741234572000,
        data: {
            type: 'lab-test',
            batchId: 'BATCH-1741234567892',
            testResult: 'FAIL',
            parameters: {
                moisture: 16.5,
                activeMarkers: 0.3,
                pesticides: 'traces',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        },
        previousHash: 'demo-hash-005',
        hash: 'demo-hash-006',
        nonce: 0
    },
    {
        timestamp: 1741234573000,
        data: {
            type: 'payment_released',
            batchId: 'BATCH-1741234567890',
            farmerId: 'demo-farmer-001',
            amount: 22500,
            herbType: 'Ashwagandha'
        },
        previousHash: 'demo-hash-006',
        hash: 'demo-hash-007',
        nonce: 0
    },
    {
        timestamp: 1741234574000,
        data: {
            type: 'payment_released',
            batchId: 'BATCH-1741234567891',
            farmerId: 'demo-farmer-001',
            amount: 6000,
            herbType: 'Tulsi'
        },
        previousHash: 'demo-hash-007',
        hash: 'demo-hash-008',
        nonce: 0
    },
    {
        timestamp: 1741234575000,
        data: {
            type: 'claim_submitted',
            batchId: 'BATCH-1741234567892',
            farmerId: 'demo-farmer-001',
            reason: 'Pesticide contamination',
            amount: 4200
        },
        previousHash: 'demo-hash-008',
        hash: 'demo-hash-009',
        nonce: 0
    },
    {
        timestamp: 1741234576000,
        data: {
            type: 'manufacturing',
            batchId: 'BATCH-1741234567890',
            productId: 'PROD-1741234567890',
            productName: 'Ashwagandha Root Powder',
            productType: 'Herbal Supplement',
            manufacturingDate: '2026-03-03',
            expiryDate: '2027-03-03'
        },
        previousHash: 'demo-hash-009',
        hash: 'demo-hash-010',
        nonce: 0
    },
    {
        timestamp: 1741234577000,
        data: {
            type: 'manufacturing',
            batchId: 'BATCH-1741234567891',
            productId: 'PROD-1741234567891',
            productName: 'Holy Basil Capsules',
            productType: 'Herbal Supplement',
            manufacturingDate: '2026-03-07',
            expiryDate: '2027-03-07'
        },
        previousHash: 'demo-hash-010',
        hash: 'demo-hash-011',
        nonce: 0
    }
];

// Demo seeder class
class DemoSeeder {
    constructor() {
        this.isSeeded = false;
    }

    async seedAll() {
        if (this.isSeeded) {
            console.log('✅ Demo data already seeded');
            return;
        }

        try {
            console.log('🌱 Seeding Krishi demo data...');

            // Seed blockchain data
            await this.seedBlockchain();

            // Seed Firestore data
            await this.seedFirestore();

            // Seed local storage
            this.seedLocalStorage();

            // Mark as seeded
            this.isSeeded = true;

            console.log('✅ Demo data seeding complete!');
            return true;

        } catch (error) {
            console.error('❌ Demo data seeding failed:', error);
            return false;
        }
    }

    async seedBlockchain() {
        console.log('🔗 Seeding blockchain data...');

        // Clear existing blockchain
        blockchain.chain = [];

        // Add genesis block
        const genesisBlock = await blockchain.getGenesisBlock();
        blockchain.chain.push(genesisBlock);

        // Add demo blocks
        for (const blockData of DEMO_BLOCKCHAIN) {
            const block = new Block(blockData.timestamp, blockData.data, blockData.previousHash);
            block.hash = blockData.hash;
            block.nonce = blockData.nonce;
            blockchain.chain.push(block);
        }

        // Persist to localStorage
        blockchain.persistChain();

        console.log(`✅ Added ${blockchain.chain.length} blocks to blockchain`);
    }

    async seedFirestore() {
        console.log('📊 Seeding Firestore data...');

        // Seed users
        for (const [role, userData] of Object.entries(DEMO_ACCOUNTS)) {
            try {
                await db.collection('users').doc(`demo-${role}-001`).set({
                    email: userData.email,
                    displayName: userData.displayName,
                    role: userData.role,
                    createdAt: new Date(),
                    isDemo: true
                });
            } catch (error) {
                console.warn(`User ${role} already exists or error:`, error.message);
            }
        }

        // Seed batches
        for (const batch of DEMO_BATCHES) {
            try {
                await db.collection('batches').doc(batch.batchId).set({
                    ...batch,
                    createdAt: new Date(batch.harvestDate),
                    updatedAt: new Date()
                });
            } catch (error) {
                console.warn(`Batch ${batch.batchId} already exists or error:`, error.message);
            }
        }

        // Seed products
        for (const product of DEMO_PRODUCTS) {
            try {
                await db.collection('products').doc(product.productId).set({
                    ...product,
                    createdAt: new Date(product.manufacturingDate),
                    updatedAt: new Date()
                });
            } catch (error) {
                console.warn(`Product ${product.productId} already exists or error:`, error.message);
            }
        }

        // Seed blockchain blocks
        for (const block of DEMO_BLOCKCHAIN) {
            try {
                await db.collection('blockchain').doc(block.hash).set({
                    timestamp: block.timestamp,
                    data: block.data,
                    previousHash: block.previousHash,
                    hash: block.hash,
                    nonce: block.nonce
                });
            } catch (error) {
                console.warn(`Blockchain block ${block.hash} already exists or error:`, error.message);
            }
        }

        console.log('✅ Firestore data seeded');
    }

    seedLocalStorage() {
        console.log('💾 Seeding localStorage data...');

        // Store demo accounts
        localStorage.setItem('krishi-demo-accounts', JSON.stringify(DEMO_ACCOUNTS));

        // Store demo batches
        localStorage.setItem('krishi-demo-batches', JSON.stringify(DEMO_BATCHES));

        // Store demo products
        localStorage.setItem('krishi-demo-products', JSON.stringify(DEMO_PRODUCTS));

        // Mark as demo seeded
        localStorage.setItem('krishi-demo-seeded', 'true');

        console.log('✅ LocalStorage data seeded');
    }

    // Demo account login helper
    static async loginDemoAccount(role) {
        const accounts = JSON.parse(localStorage.getItem('krishi-demo-accounts') || '{}');
        const account = accounts[role];

        if (!account) {
            throw new Error(`Demo account for ${role} not found`);
        }

        try {
            await auth.signInWithEmailAndPassword(account.email, account.password);
            console.log(`✅ Logged in as ${role}: ${account.displayName}`);
        } catch (error) {
            console.error(`❌ Failed to login as ${role}:`, error.message);
            throw error;
        }
    }

    // Get demo account info
    static getDemoAccount(role) {
        const accounts = JSON.parse(localStorage.getItem('krishi-demo-accounts') || '{}');
        return accounts[role];
    }

    // Check if demo data is seeded
    static isSeeded() {
        return localStorage.getItem('krishi-demo-seeded') === 'true';
    }

    // Reset demo data
    static async resetDemoData() {
        try {
            // Clear Firestore collections
            const collections = ['users', 'batches', 'products', 'blockchain'];

            for (const collection of collections) {
                const snapshot = await db.collection(collection).get();
                snapshot.forEach(async (doc) => {
                    await doc.ref.delete();
                });
            }

            // Clear localStorage
            localStorage.removeItem('krishi-demo-accounts');
            localStorage.removeItem('krishi-demo-batches');
            localStorage.removeItem('krishi-demo-products');
            localStorage.removeItem('krishi-demo-seeded');
            localStorage.removeItem('krishi-blockchain');

            // Clear blockchain
            blockchain.chain = [];
            blockchain.persistChain();

            console.log('✅ Demo data reset complete');
            return true;

        } catch (error) {
            console.error('❌ Failed to reset demo data:', error);
            return false;
        }
    }
}

// Demo flow helper functions
const DemoFlow = {
    // Complete demo flow from farmer to consumer
    async runCompleteDemo() {
        console.log('🎬 Running complete demo flow...');

        try {
            // 1. Farmer logs in and tags collection
            await DemoSeeder.loginDemoAccount('farmer');
            await this.farmerDemoFlow();

            // 2. Lab technician tests batch
            await DemoSeeder.loginDemoAccount('lab');
            await this.labDemoFlow();

            // 3. Manufacturer creates product
            await DemoSeeder.loginDemoAccount('manufacturer');
            await this.manufacturerDemoFlow();

            // 4. Consumer traces product
            await DemoSeeder.loginDemoAccount('consumer');
            await this.consumerDemoFlow();

            console.log('✅ Complete demo flow finished!');

        } catch (error) {
            console.error('❌ Demo flow failed:', error);
        }
    },

    async farmerDemoFlow() {
        console.log('🌱 Farmer demo flow...');

        // Simulate herb collection
        const collectionData = {
            batchId: 'BATCH-DEMO-001',
            farmerName: 'Ramesh Patel',
            herbType: 'Ashwagandha',
            quantity: 25,
            harvestDate: new Date().toISOString().split('T')[0],
            location: '22.3000°N, 73.1999°E',
            coordinates: { latitude: 22.3, longitude: 73.1999 },
            farmerId: 'demo-farmer-001'
        };

        // Add to blockchain
        await blockchain.addBlock('collection', collectionData);

        // Save to Firestore
        await db.collection('batches').doc(collectionData.batchId).set({
            ...collectionData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('✅ Farmer collection completed');
    },

    async labDemoFlow() {
        console.log('🧪 Lab demo flow...');

        // Get pending batch
        const snapshot = await db.collection('batches')
            .where('status', '==', 'pending')
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('No pending batches found');
            return;
        }

        const batch = snapshot.docs[0];
        const batchData = batch.data();

        // Simulate lab test
        const testResult = {
            batchId: batchData.batchId,
            testResult: 'PASS',
            parameters: {
                moisture: 9.2,
                activeMarkers: 1.6,
                pesticides: 'none',
                adulterants: 'none',
                heavyMetals: 'within-limits',
                microbial: 'within-limits'
            }
        };

        // Add to blockchain
        await blockchain.addBlock('lab-test', testResult);

        // Update batch status
        await batch.ref.update({
            status: 'tested',
            testResult: 'PASS',
            labResults: testResult,
            testedAt: new Date()
        });

        console.log('✅ Lab test completed');
    },

    async manufacturerDemoFlow() {
        console.log('🏭 Manufacturer demo flow...');

        // Get passed batch
        const snapshot = await db.collection('batches')
            .where('status', '==', 'tested')
            .where('testResult', '==', 'PASS')
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('No passed batches found');
            return;
        }

        const batch = snapshot.docs[0];
        const batchData = batch.data();

        // Create product
        const productData = {
            productId: 'PROD-DEMO-001',
            productName: 'Ashwagandha Capsules',
            productType: 'Herbal Supplement',
            batchId: batchData.batchId,
            manufacturingDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            manufacturerId: 'demo-manufacturer-001',
            status: 'available'
        };

        // Add to blockchain
        await blockchain.addBlock('manufacturing', productData);

        // Save product
        await db.collection('products').doc(productData.productId).set({
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Update batch status
        await batch.ref.update({
            status: 'manufactured',
            productId: productData.productId,
            manufacturedAt: new Date()
        });

        console.log('✅ Product creation completed');
    },

    async consumerDemoFlow() {
        console.log('👤 Consumer demo flow...');

        // Get product to trace
        const snapshot = await db.collection('products').limit(1).get();

        if (snapshot.empty) {
            console.log('No products found');
            return;
        }

        const product = snapshot.docs[0];
        const productData = product.data();

        // Trace product
        const journey = await blockchain.getBlocksByBatchId(productData.batchId);

        console.log('📦 Product trace journey:');
        journey.forEach((block, index) => {
            console.log(`  ${index + 1}. ${block.data.type} - ${new Date(block.timestamp).toLocaleString()}`);
        });

        console.log('✅ Product trace completed');
    }
};

// Export for global use
window.DemoSeeder = DemoSeeder;
window.DemoFlow = DemoFlow;

// Auto-seed on page load if needed
document.addEventListener('DOMContentLoaded', () => {
    if (typeof db !== 'undefined' && typeof blockchain !== 'undefined') {
        const seeder = new DemoSeeder();
        seeder.seedAll();
    }
});