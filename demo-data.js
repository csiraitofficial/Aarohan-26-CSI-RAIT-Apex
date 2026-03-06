// Demo Data Seeding System
// Pre-populates the platform with realistic demo data for hackathon presentation

// Demo accounts configuration
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

// Demo batches data
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

// Demo products data
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

// Demo blockchain data
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

// Demo reputation data
const DEMO_REPUTATION = {
    'demo-farmer-001': {
        stakeholderId: 'demo-farmer-001',
        name: 'Ramesh Patel',
        score: 126,
        status: 'Excellent',
        history: [
            { event: 'collection', change: +5, timestamp: 1741234567000 },
            { event: 'lab_test_pass', change: +10, timestamp: 1741234570000 },
            { event: 'collection', change: +5, timestamp: 1741234568000 },
            { event: 'lab_test_pass', change: +10, timestamp: 1741234571000 },
            { event: 'collection', change: +5, timestamp: 1741234569000 },
            { event: 'lab_test_fail', change: -20, timestamp: 1741234572000 },
            { event: 'payment_released', change: +3, timestamp: 1741234573000 },
            { event: 'payment_released', change: +3, timestamp: 1741234574000 },
            { event: 'claim_submitted', change: -5, timestamp: 1741234575000 }
        ]
    }
};

// Demo inventory data
const DEMO_INVENTORY = [
    { herb: 'Ashwagandha', stock: 150, total: 500, status: 'good' },
    { herb: 'Tulsi', stock: 80, total: 500, status: 'low' },
    { herb: 'Neem', stock: 320, total: 500, status: 'good' },
    { herb: 'Turmeric', stock: 200, total: 500, status: 'good' },
    { herb: 'Amla', stock: 450, total: 500, status: 'good' },
    { herb: 'Ginseng', stock: 50, total: 200, status: 'low' }
];

// Demo orders data
const DEMO_ORDERS = [
    {
        orderId: 'ORD-001',
        productId: 'PROD-1741234567890',
        productName: 'Ashwagandha Root Powder',
        quantity: 5,
        status: 'Pending',
        date: '2026-03-01',
        customer: 'Health Plus Retail'
    },
    {
        orderId: 'ORD-002',
        productId: 'PROD-1741234567891',
        productName: 'Holy Basil Capsules',
        quantity: 12,
        status: 'Shipped',
        date: '2026-03-03',
        customer: 'Ayurvedic Wellness Center'
    },
    {
        orderId: 'ORD-003',
        productId: 'PROD-1741234567890',
        productName: 'Ashwagandha Root Powder',
        quantity: 20,
        status: 'Delivered',
        date: '2026-02-28',
        customer: 'Natural Health Store'
    }
];

// Demo insurance policies
const DEMO_INSURANCE = [
    {
        policyId: 'POL-1029',
        batchId: 'BATCH-1741234567890',
        coverageAmount: 25000,
        duration: '1 year',
        status: 'Active',
        premium: 500
    },
    {
        policyId: 'POL-1030',
        batchId: 'BATCH-1741234567891',
        coverageAmount: 8000,
        duration: '6 months',
        status: 'Active',
        premium: 160
    },
    {
        policyId: 'CLM-9281',
        batchId: 'BATCH-1741234567892',
        claimAmount: 4200,
        status: 'Processing',
        filedDate: '2026-03-09'
    }
];

// Demo DNA profiles
const DEMO_DNA_PROFILES = [
    {
        profileId: 'DNA-ASH-001',
        herbType: 'Ashwagandha',
        variety: 'Winter Cherry',
