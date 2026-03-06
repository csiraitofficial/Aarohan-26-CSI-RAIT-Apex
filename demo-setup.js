// Demo Setup Script
// Comprehensive setup for hackathon demo environment

class DemoSetup {
    constructor() {
        this.isSetupComplete = false;
        this.setupSteps = [
            'Initialize Firebase',
            'Create Demo Accounts',
            'Seed Demo Data',
            'Setup Demo Environment',
            'Verify Demo Flow'
        ];
    }

    async setupDemoEnvironment() {
        console.log('🚀 Starting Krishi Demo Setup...');

        try {
            // Step 1: Initialize Firebase
            await this.initializeFirebase();

            // Step 2: Create demo accounts
            await this.createDemoAccounts();

            // Step 3: Seed demo data
            await this.seedDemoData();

            // Step 4: Setup demo environment
            await this.setupDemoEnvironmentConfig();

            // Step 5: Verify demo flow
            await this.verifyDemoFlow();

            this.isSetupComplete = true;
            console.log('✅ Demo setup completed successfully!');

            return true;

        } catch (error) {
            console.error('❌ Demo setup failed:', error);
            return false;
        }
    }

    async initializeFirebase() {
        console.log('📡 Initializing Firebase...');

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // Wait for Firebase to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✅ Firebase initialized');
    }

    async createDemoAccounts() {
        console.log('👥 Creating demo accounts...');

        const demoAccounts = [
            {
                email: 'admin@krishi.com',
                password: 'admin123',
                displayName: 'Admin User',
                role: 'admin'
            },
            {
                email: 'farmer@krishi.com',
                password: 'farmer123',
                displayName: 'Ramesh Patel',
                role: 'farmer'
            },
            {
                email: 'lab@krishi.com',
                password: 'lab123',
                displayName: 'Dr. Anjali Sharma',
                role: 'lab'
            },
            {
                email: 'manufacturer@krishi.com',
                password: 'manufacturer123',
                displayName: 'Aarogya Herbs Pvt Ltd',
                role: 'manufacturer'
            },
            {
                email: 'consumer@krishi.com',
                password: 'consumer123',
                displayName: 'Priya Kumar',
                role: 'consumer'
            }
        ];

        for (const account of demoAccounts) {
            try {
                // Check if user already exists
                const userExists = await this.checkUserExists(account.email);

                if (!userExists) {
                    // Create user
                    const userCredential = await firebase.auth().createUserWithEmailAndPassword(
                        account.email,
                        account.password
                    );

                    // Update profile
                    await userCredential.user.updateProfile({
                        displayName: account.displayName
                    });

                    // Save to Firestore
                    await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
                        email: account.email,
                        displayName: account.displayName,
                        role: account.role,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        isDemo: true
                    });

                    console.log(`✅ Created account: ${account.email}`);
                } else {
                    console.log(`ℹ️ Account already exists: ${account.email}`);
                }

            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    console.log(`ℹ️ Account already exists: ${account.email}`);
                } else {
                    console.error(`❌ Failed to create account ${account.email}:`, error.message);
                }
            }
        }

        console.log('✅ Demo accounts created');
    }

    async checkUserExists(email) {
        try {
            const usersRef = firebase.firestore().collection('users');
            const snapshot = await usersRef.where('email', '==', email).limit(1).get();
            return !snapshot.empty;
        } catch (error) {
            return false;
        }
    }

    async seedDemoData() {
        console.log('🌱 Seeding demo data...');

        // Use the existing demo seeder
        if (typeof DemoSeeder !== 'undefined') {
            const seeder = new DemoSeeder();
            await seeder.seedAll();
        } else {
            console.warn('DemoSeeder not found, using manual seeding');
            await this.manualSeedData();
        }

        console.log('✅ Demo data seeded');
    }

    async manualSeedData() {
        // Manual seeding as fallback
        const demoData = {
            batches: [
                {
                    batchId: 'BATCH-DEMO-001',
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
                        testedAt: firebase.firestore.Timestamp.fromDate(new Date('2026-03-02T10:30:00Z')),
                        parameters: {
                            moisture: 8.5,
                            activeMarkers: 1.8,
                            pesticides: 'none',
                            adulterants: 'none',
                            heavyMetals: 'within-limits',
                            microbial: 'within-limits'
                        }
                    }
                }
            ],
            products: [
                {
                    productId: 'PROD-DEMO-001',
                    productName: 'Ashwagandha Root Powder',
                    productType: 'Herbal Supplement',
                    batchId: 'BATCH-DEMO-001',
                    manufacturingDate: '2026-03-03',
                    expiryDate: '2027-03-03',
                    manufacturerId: 'demo-manufacturer-001',
                    status: 'available'
                }
            ]
        };

        // Save to Firestore
        for (const batch of demoData.batches) {
            await firebase.firestore().collection('batches').doc(batch.batchId).set({
                ...batch,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date(batch.harvestDate)),
                updatedAt: firebase.firestore.Timestamp.now()
            });
        }

        for (const product of demoData.products) {
            await firebase.firestore().collection('products').doc(product.productId).set({
                ...product,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date(product.manufacturingDate)),
                updatedAt: firebase.firestore.Timestamp.now()
            });
        }
    }

    async setupDemoEnvironmentConfig() {
        console.log('⚙️ Setting up demo environment configuration...');

        // Set demo configuration
        const demoConfig = {
            isDemoMode: true,
            demoAccounts: [
                'admin@krishi.com',
                'farmer@krishi.com',
                'lab@krishi.com',
                'manufacturer@krishi.com',
                'consumer@krishi.com'
            ],
            demoFeatures: {
                autoLogin: true,
                demoData: true,
                mockBlockchain: true,
                mockPayments: true
            },
            createdAt: firebase.firestore.Timestamp.now()
        };

        await firebase.firestore().collection('config').doc('demo').set(demoConfig, { merge: true });

        // Set localStorage flags
        localStorage.setItem('krishi-demo-mode', 'true');
        localStorage.setItem('krishi-demo-config', JSON.stringify(demoConfig));

        console.log('✅ Demo environment configured');
    }

    async verifyDemoFlow() {
        console.log('🔍 Verifying demo flow...');

        const checks = [
            await this.verifyFirebaseConnection(),
            await this.verifyDemoAccounts(),
            await this.verifyDemoData(),
            await this.verifyBlockchain(),
            await this.verifyUIComponents()
        ];

        const allPassed = checks.every(check => check.passed);

        if (allPassed) {
            console.log('✅ All demo flow checks passed');
        } else {
            console.warn('⚠️ Some demo flow checks failed:', checks.filter(c => !c.passed));
        }

        return allPassed;
    }

    async verifyFirebaseConnection() {
        try {
            const testDoc = await firebase.firestore().collection('test').doc('connection').get();
            return { passed: true, message: 'Firebase connection verified' };
        } catch (error) {
            return { passed: false, message: 'Firebase connection failed: ' + error.message };
        }
    }

    async verifyDemoAccounts() {
        try {
            const usersRef = firebase.firestore().collection('users');
            const snapshot = await usersRef.where('isDemo', '==', true).get();

            const demoAccounts = [
                'admin@krishi.com',
                'farmer@krishi.com',
                'lab@krishi.com',
                'manufacturer@krishi.com',
                'consumer@krishi.com'
            ];

            const foundAccounts = snapshot.docs.map(doc => doc.data().email);
            const allFound = demoAccounts.every(email => foundAccounts.includes(email));

            return {
                passed: allFound,
                message: allFound ? 'All demo accounts found' : 'Some demo accounts missing'
            };
        } catch (error) {
            return { passed: false, message: 'Failed to verify demo accounts: ' + error.message };
        }
    }

    async verifyDemoData() {
        try {
            const batchesSnapshot = await firebase.firestore().collection('batches').get();
            const productsSnapshot = await firebase.firestore().collection('products').get();

            const hasBatches = !batchesSnapshot.empty;
            const hasProducts = !productsSnapshot.empty;

            return {
                passed: hasBatches && hasProducts,
                message: `Demo data: ${batchesSnapshot.size} batches, ${productsSnapshot.size} products`
            };
        } catch (error) {
            return { passed: false, message: 'Failed to verify demo data: ' + error.message };
        }
    }

    async verifyBlockchain() {
        try {
            if (typeof blockchain !== 'undefined' && blockchain.chain.length > 0) {
                return { passed: true, message: `Blockchain has ${blockchain.chain.length} blocks` };
            } else {
                return { passed: false, message: 'Blockchain not initialized or empty' };
            }
        } catch (error) {
            return { passed: false, message: 'Failed to verify blockchain: ' + error.message };
        }
    }

    async verifyUIComponents() {
        try {
            const requiredElements = [
                '#landing-page',
                '#login-modal',
                '#app-container',
                '#farmer-dashboard',
                '#lab-dashboard',
                '#manufacturer-dashboard',
                '#consumer-portal',
                '#admin-dashboard'
            ];

            const allElementsExist = requiredElements.every(selector =>
                document.querySelector(selector) !== null
            );

            return {
                passed: allElementsExist,
                message: allElementsExist ? 'All UI components loaded' : 'Some UI components missing'
            };
        } catch (error) {
            return { passed: false, message: 'Failed to verify UI components: ' + error.message };
        }
    }

    // Demo helper functions
    static async loginDemoUser(role) {
        const emailMap = {
            admin: 'admin@krishi.com',
            farmer: 'farmer@krishi.com',
            lab: 'lab@krishi.com',
            manufacturer: 'manufacturer@krishi.com',
            consumer: 'consumer@krishi.com'
        };

        const passwordMap = {
            admin: 'admin123',
            farmer: 'farmer123',
            lab: 'lab123',
            manufacturer: 'manufacturer123',
            consumer: 'consumer123'
        };

        const email = emailMap[role];
        const password = passwordMap[role];

        if (!email || !password) {
            throw new Error(`Invalid role: ${role}`);
        }

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log(`✅ Logged in as ${role}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to login as ${role}:`, error.message);
            return false;
        }
    }

    static async runDemoFlow() {
        console.log('🎬 Running complete demo flow...');

        try {
            // 1. Farmer creates collection
            await this.loginDemoUser('farmer');
            await this.simulateFarmerCollection();

            // 2. Lab tests batch
            await this.loginDemoUser('lab');
            await this.simulateLabTest();

            // 3. Manufacturer creates product
            await this.loginDemoUser('manufacturer');
            await this.simulateProductCreation();

            // 4. Consumer traces product
            await this.loginDemoUser('consumer');
            await this.simulateConsumerTrace();

            console.log('✅ Complete demo flow finished!');
            return true;

        } catch (error) {
            console.error('❌ Demo flow failed:', error);
            return false;
        }
    }

    static async simulateFarmerCollection() {
        console.log('🌱 Simulating farmer collection...');

        // Simulate herb collection
        const collectionData = {
            batchId: 'BATCH-DEMO-' + Date.now(),
            farmerName: 'Ramesh Patel',
            herbType: 'Ashwagandha',
            quantity: 25,
            harvestDate: new Date().toISOString().split('T')[0],
            location: '22.3000°N, 73.1999°E',
            coordinates: { latitude: 22.3, longitude: 73.1999 },
            farmerId: 'demo-farmer-001'
        };

        // Add to blockchain
        if (typeof blockchain !== 'undefined') {
            await blockchain.addBlock('collection', collectionData);
        }

        // Save to Firestore
        await firebase.firestore().collection('batches').doc(collectionData.batchId).set({
            ...collectionData,
            status: 'pending',
            createdAt: firebase.firestore.Timestamp.now(),
            updatedAt: firebase.firestore.Timestamp.now()
        });

        console.log('✅ Farmer collection simulated');
    }

    static async simulateLabTest() {
        console.log('🧪 Simulating lab test...');

        // Get pending batch
        const snapshot = await firebase.firestore().collection('batches')
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
        if (typeof blockchain !== 'undefined') {
            await blockchain.addBlock('lab-test', testResult);
        }

        // Update batch status
        await batch.ref.update({
            status: 'tested',
            testResult: 'PASS',
            labResults: testResult,
            testedAt: firebase.firestore.Timestamp.now()
        });

        console.log('✅ Lab test simulated');
    }

    static async simulateProductCreation() {
        console.log('🏭 Simulating product creation...');

        // Get passed batch
        const snapshot = await firebase.firestore().collection('batches')
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
            productId: 'PROD-DEMO-' + Date.now(),
            productName: 'Ashwagandha Capsules',
            productType: 'Herbal Supplement',
            batchId: batchData.batchId,
            manufacturingDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            manufacturerId: 'demo-manufacturer-001',
            status: 'available'
        };

        // Add to blockchain
        if (typeof blockchain !== 'undefined') {
            await blockchain.addBlock('manufacturing', productData);
        }

        // Save product
        await firebase.firestore().collection('products').doc(productData.productId).set({
            ...productData,
            createdAt: firebase.firestore.Timestamp.now(),
            updatedAt: firebase.firestore.Timestamp.now()
        });

        // Update batch status
        await batch.ref.update({
            status: 'manufactured',
            productId: productData.productId,
            manufacturedAt: firebase.firestore.Timestamp.now()
        });

        console.log('✅ Product creation simulated');
    }

    static async simulateConsumerTrace() {
        console.log('👤 Simulating consumer trace...');

        // Get product to trace
        const snapshot = await firebase.firestore().collection('products').limit(1).get();

        if (snapshot.empty) {
            console.log('No products found');
            return;
        }

        const product = snapshot.docs[0];
        const productData = product.data();

        // Trace product
        if (typeof blockchain !== 'undefined') {
            const journey = await blockchain.getBlocksByBatchId(productData.batchId);

            console.log('📦 Product trace journey:');
            journey.forEach((block, index) => {
                console.log(`  ${index + 1}. ${block.data.type} - ${new Date(block.timestamp).toLocaleString()}`);
            });
        }

        console.log('✅ Consumer trace simulated');
    }
}

// Auto-setup on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('krishi-demo-mode') !== 'true') {
        const setup = new DemoSetup();
        setup.setupDemoEnvironment().then(success => {
            if (success) {
                console.log('🎉 Demo environment ready!');

                // Show demo ready message
                const toast = document.createElement('div');
                toast.className = 'toast toast-success';
                toast.textContent = 'Demo environment ready! Use demo accounts to test all features.';
                document.getElementById('toast-container').appendChild(toast);

                setTimeout(() => toast.remove(), 5000);
            }
        });
    }
});

// Export for global use
window.DemoSetup = DemoSetup;