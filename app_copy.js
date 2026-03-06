// Main application logic
document.addEventListener('DOMContentLoaded', function () {
    // Check if we have a dashboard parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const dashboard = urlParams.get('dashboard');

    if (dashboard) {
        showDashboard(dashboard);
    }
});

// Function to show different dashboards
function showDashboard(type) {
    const container = document.getElementById('dashboard-container');
    const hero = document.getElementById('hero');

    // Hide hero section when showing a dashboard
    if (hero) {
        hero.style.display = 'none';
    }

    // Update URL without reloading page
    const url = new URL(window.location);
    url.searchParams.set('dashboard', type);
    window.history.pushState({}, '', url);

    // Load the appropriate dashboard
    switch (type) {
        case 'farmer':
            loadFarmerDashboard();
            break;
        case 'lab':
            loadLabDashboard();
            break;
        case 'manufacturer':
            loadManufacturerDashboard();
            break;
        case 'sustainability':
            loadSustainabilityDashboard();
            break;
        case 'waste-management':
            loadWasteManagementDashboard();
            break;
        case 'inventory':
            loadInventoryDashboard();
            break;
        case 'orders':
            loadOrdersDashboard();
            break;
        case 'consumer':
            loadConsumerPortal();
            break;
        case 'recent-collections':
            loadRecentCollections();
            break;
        case 'recent-tests':
            loadRecentTests();
            break;
        case 'recent-manufactured':
            loadRecentManufactured();
            break;
        case 'smart-contracts':
            loadSmartContractsDashboard();
            break;
        case 'dna-banking':
            loadDNABankingDashboard();
            break;
        default:
            container.innerHTML = '<div class="dashboard"><h2>Welcome to vaidyachain</h2><p>Select a dashboard from the navigation menu.</p></div>';
    }
}
// Farmer Dashboard
function loadFarmerDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2>Farmer Dashboard</h2>
            <div class="herb-card">
                <h3>Tag New Herb Collection</h3>
                <form id="herb-collection-form">
                    <div class="form-group">
                        <label for="herb-type">Herb Type:</label>
                        <select id="herb-type" required>
                            <option value="">Select Herb</option>
                            <option value="ashwagandha">Ashwagandha</option>
                            <option value="turmeric">Turmeric</option>
                            <option value="tulsi">Tulsi</option>
                            <option value="amla">Amla</option>
                            <option value="brahmi">Brahmi</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="collection-date">Collection Date:</label>
                        <input type="date" id="collection-date" required>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Quantity (kg):</label>
                        <input type="number" id="quantity" min="1" required>
                    </div>
                    <div class="form-group">
                        <label>Location:</label>
                        <div id="farmer-map" class="map-container" style="height: 250px;">
                            GPS Location will be captured automatically
                        </div>
                        <small>Note: Using Leaflet map to capture/display location</small>
                    </div>
                    <button type="submit">Tag Location & Submit to Blockchain</button>
                </form>
            </div>
            
            <div class="herb-card">
                <button class="add-btn" onclick="showDashboard('recent-collections')">View Recent Collections</button>
                <button class="add-btn outline" style="margin-top:10px" onclick="if(window.DataExporter) window.DataExporter.exportTransactions('collection', 'collections')">
                    <i class="ph ph-download-simple"></i> Export Collections CSV
                </button>
            </div>
        </div>
    `;

    // Initialize Map after rendering DOM
    setTimeout(() => {
        const farmerMapEl = document.getElementById('farmer-map');
        if (farmerMapEl && window.L && !farmerMapEl._leaflet_id) {
            farmerMapEl.innerHTML = ''; // clear text
            const map = L.map('farmer-map').setView([23.2599, 77.4126], 5); // Default to India roughly
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            let marker;

            // Try to get actual geolocation
            if ("geolocation" in navigator) {
                // Show loading state
                farmerMapEl.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%;">Locating...</div>';

                navigator.geolocation.getCurrentPosition((position) => {
                    farmerMapEl.innerHTML = '';
                    map.invalidateSize();
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    map.setView([lat, lng], 13);
                    marker = L.marker([lat, lng]).addTo(map)
                        .bindPopup('Your Current Location').openPopup();

                    // Save to hidden fields
                    document.getElementById('farmer-map').dataset.lat = lat;
                    document.getElementById('farmer-map').dataset.lng = lng;
                }, (err) => {
                    farmerMapEl.innerHTML = '';
                    map.invalidateSize();
                    console.warn("Geolocation denied or error, using default marker");
                    if (window.showNotification) window.showNotification('Geolocation unavailable, using simulated location.', 'info');
                    // Random location in MP, India for demo
                    const lat = 23.25 + (Math.random() - 0.5);
                    const lng = 77.41 + (Math.random() - 0.5);
                    marker = L.marker([lat, lng]).addTo(map).bindPopup('Simulated Farm Location').openPopup();
                    document.getElementById('farmer-map').dataset.lat = lat;
                    document.getElementById('farmer-map').dataset.lng = lng;
                }, { timeout: 10000 });
            } else {
                // Random location
                const lat = 23.25 + (Math.random() - 0.5);
                const lng = 77.41 + (Math.random() - 0.5);
                marker = L.marker([lat, lng]).addTo(map).bindPopup('Simulated Farm Location').openPopup();
                document.getElementById('farmer-map').dataset.lat = lat;
                document.getElementById('farmer-map').dataset.lng = lng;
            }
        }
    }, 100);

    // Form submission handler
    document.getElementById('herb-collection-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const herbType = document.getElementById('herb-type').value;
        const collectionDate = document.getElementById('collection-date').value;
        const quantity = document.getElementById('quantity').value;

        // Generate a batch ID
        const batchId = 'BATCH-' + Date.now();

        const mapEl = document.getElementById('farmer-map');
        const latitude = mapEl ? (mapEl.dataset.lat || (Math.random() * 180 - 90).toFixed(6)) : (Math.random() * 180 - 90).toFixed(6);
        const longitude = mapEl ? (mapEl.dataset.lng || (Math.random() * 360 - 180).toFixed(6)) : (Math.random() * 360 - 180).toFixed(6);

        // Document upload simulation
        const reportFile = document.getElementById('lab-report') ? document.getElementById('lab-report').files[0] : null;
        const reportHash = reportFile ? 'ipfs://Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) : null;

        // Create herb data object
        const herbData = {
            type: 'collection',
            herbType: herbType,
            collectionDate: collectionDate,
            quantity: quantity,
            location: {
                latitude: latitude,
                longitude: longitude
            },
            farmer: {
                id: 'FARMER-001',
                name: 'Rajesh Kumar',
                region: 'Madhya Pradesh'
            },
            batchId: batchId,
            status: 'collected'
        };

        // Add to blockchain
        addHerbTransaction(herbData);
        if (typeof updateBlockchainVisualization === 'function') updateBlockchainVisualization();

        // Show success message
        if (window.showNotification) {
            window.showNotification(`Herb collection recorded! Batch ID: ${batchId}`, 'success');
        } else {
            alert(`Herb collection recorded successfully! Batch ID: ${batchId}`);
        }

        // Reset form
        this.reset();

        // Update recent collections
        updateRecentCollections();
    });

    // Load recent collections
    updateRecentCollections();
}

function updateRecentCollections() {
    const recentCollectionsContainer = document.getElementById('recent-collections');
    if (!recentCollectionsContainer) return;

    const allTransactions = getAllHerbTransactions();
    const collectionTransactions = allTransactions.filter(tx => tx.data.type === 'collection');

    if (collectionTransactions.length === 0) {
        recentCollectionsContainer.innerHTML = '<p>No collections recorded yet.</p>';
        return;
    }

    let html = '';
    collectionTransactions.slice(-5).reverse().forEach(tx => {
        html += `
            <div class="herb-card">
                <h4>${tx.data.herbType} (Batch: ${tx.data.batchId})</h4>
                <p><strong>Date:</strong> ${tx.data.collectionDate}</p>
                <p><strong>Quantity:</strong> ${tx.data.quantity} kg</p>
                <p><strong>Location:</strong> ${tx.data.location.latitude}, ${tx.data.location.longitude}</p>
                <p><strong>Status:</strong> ${tx.data.status}</p>
            </div>
        `;
    });

    recentCollectionsContainer.innerHTML = html;
}

// Testing Lab Dashboard
// Testing Lab Dashboard - Updated version
function loadLabDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2>Testing Lab Dashboard</h2>
            <div class="herb-card">
                <h3>Test Herb Batch</h3>
                <form id="lab-test-form">
                    <div class="form-group">
                        <label for="batch-id">Batch ID:</label>
                        <input type="text" id="batch-id" required placeholder="Enter batch ID">
                        <button type="button" id="check-batch-btn">Check Batch</button>
                    </div>
                    <div id="batch-info" style="display: none; margin: 15px 0; padding: 10px; background: #f0f8ff; border-radius: 5px;">
                        <h4>Batch Information</h4>
                        <p id="batch-details"></p>
                    </div>
                    <div class="form-group">
                        <label for="moisture">Moisture Content (%):</label>
                        <input type="number" id="moisture" step="0.1" min="0" max="100" required>
                    </div>
                    <div class="form-group">
                        <label for="pesticides">Pesticides:</label>
                        <select id="pesticides" required>
                            <option value="none">None Detected</option>
                            <option value="detected">Detected</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="heavy-metals">Heavy Metals:</label>
                        <select id="heavy-metals" required>
                            <option value="within-limits">Within Safe Limits</option>
                            <option value="exceeded">Exceeded Limits</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="microbial">Microbial Count:</label>
                        <select id="microbial" required>
                            <option value="within-limits">Within Safe Limits</option>
                            <option value="exceeded">Exceeded Limits</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="lab-report">Upload Lab Report (PDF/Img):</label>
                        <input type="file" id="lab-report" accept=".pdf,image/*">
                    </div>
                    <div class="form-group">
                        <label for="lab-notes">Notes:</label>
                        <textarea id="lab-notes" rows="3"></textarea>
                    </div>
                    <button type="submit" id="verify-btn" disabled>Verify and Sign to Blockchain</button>
                </form>
            </div>
            
            <div class="herb-card">
                <button class="add-btn" onclick="showDashboard('recent-tests')">View Recent Tests</button>
                <button class="add-btn outline" style="margin-top:10px" onclick="if(window.DataExporter) window.DataExporter.exportTransactions('lab-test', 'lab_tests')">
                    <i class="ph ph-download-simple"></i> Export Tests CSV
                </button>
            </div>
        </div>
    `;

    // Add event listener for Check Batch button
    document.getElementById('check-batch-btn').addEventListener('click', function () {
        const batchId = document.getElementById('batch-id').value;
        if (!batchId) {
            alert('Please enter a Batch ID');
            return;
        }

        if (doesBatchExist(batchId)) {
            const batchInfo = document.getElementById('batch-info');
            const batchDetails = document.getElementById('batch-details');
            const verifyBtn = document.getElementById('verify-btn');

            const transactions = getBatchHistory(batchId);
            const collectionData = transactions.find(tx => tx.data.type === 'collection');

            if (collectionData) {
                batchDetails.innerHTML = `
                    <strong>Herb Type:</strong> ${collectionData.data.herbType}<br>
                    <strong>Collection Date:</strong> ${collectionData.data.collectionDate}<br>
                    <strong>Quantity:</strong> ${collectionData.data.quantity} kg<br>
                    <strong>Farmer:</strong> ${collectionData.data.farmer.name}
                `;
                batchInfo.style.display = 'block';
                verifyBtn.disabled = false;
            }
        } else {
            // Show available batch IDs for debugging
            const allTransactions = getAllHerbTransactions();
            const collectionTransactions = allTransactions.filter(tx => tx.data.type === 'collection');
            const availableBatchIds = collectionTransactions.map(tx => tx.data.batchId);

            let debugMessage = 'Batch ID not found! Please check the ID and try again.\n\n';
            debugMessage += 'Available batch IDs:\n';
            if (availableBatchIds.length > 0) {
                debugMessage += availableBatchIds.join('\n');
                debugMessage += '\n\nCopy and paste one of the above batch IDs to test it.';
            } else {
                debugMessage += 'No batches have been created yet. Please create a batch in the farmer dashboard first.';
            }

            alert(debugMessage);
        }
    });

    // Form submission handler
    document.getElementById('lab-test-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const batchId = document.getElementById('batch-id').value;
        const moisture = document.getElementById('moisture').value;
        const pesticides = document.getElementById('pesticides').value;
        const heavyMetals = document.getElementById('heavy-metals').value;
        const microbial = document.getElementById('microbial').value;
        const notes = document.getElementById('lab-notes').value;
        const reportFile = document.getElementById('lab-report').files[0];

        if (!doesBatchExist(batchId)) {
            if (window.showNotification) window.showNotification('Batch ID not found!', 'error');
            else alert('Batch ID not found!');
            return;
        }

        // Determine if the batch passes all tests
        const passesTests = pesticides === 'none' &&
            heavyMetals === 'within-limits' &&
            microbial === 'within-limits' &&
            parseFloat(moisture) <= 10; // Assuming <= 10% moisture is good

        // Simulate IPFS upload for document
        const reportHash = reportFile ? 'ipfs://Qm' + Math.random().toString(36).substring(2, 15) : null;

        // Create test data object
        const testData = {
            type: 'lab-test',
            batchId: batchId,
            moisture: moisture,
            pesticides: pesticides,
            heavyMetals: heavyMetals,
            microbial: microbial,
            notes: notes,
            testResult: passesTests ? 'pass' : 'fail',
            status: passesTests ? 'lab-approved' : 'lab-rejected',
            reportHash: reportHash,
            lab: {
                id: 'LAB-001',
                name: 'Ayurvedic Quality Control Lab',
                technician: 'Dr. Priya Sharma'
            }
        };

        // Add to blockchain
        addHerbTransaction(testData);
        if (typeof updateBlockchainVisualization === 'function') updateBlockchainVisualization();

        // Show success message
        const msg = `Lab test results recorded! Batch ${batchId} ${passesTests ? 'PASSED' : 'FAILED'}.`;
        if (window.showNotification) {
            window.showNotification(msg, passesTests ? 'success' : 'error');
            if (reportHash) window.showNotification(`Report uploaded payload: ${reportHash}`, 'info', 'IPFS Sync');
        } else {
            alert(msg);
        }

        // Reset form
        this.reset();
        document.getElementById('batch-info').style.display = 'none';
        document.getElementById('verify-btn').disabled = true;

        // Update recent tests
        updateRecentTests();
    });

    // Load recent tests
    updateRecentTests();
}
function updateRecentTests() {
    const recentTestsContainer = document.getElementById('recent-tests');
    if (!recentTestsContainer) return;

    const allTransactions = getAllHerbTransactions();
    const testTransactions = allTransactions.filter(tx => tx.data.type === 'lab-test');

    if (testTransactions.length === 0) {
        recentTestsContainer.innerHTML = '<p>No tests recorded yet.</p>';
        return;
    }

    let html = '';
    testTransactions.slice(-5).reverse().forEach(tx => {
        html += `
            <div class="herb-card">
                <h4>Batch: ${tx.data.batchId}</h4>
                <p><strong>Result:</strong> <span style="color: ${tx.data.testResult === 'pass' ? 'green' : 'red'}">${tx.data.testResult.toUpperCase()}</span></p>
                <p><strong>Moisture:</strong> ${tx.data.moisture}%</p>
                <p><strong>Pesticides:</strong> ${tx.data.pesticides}</p>
                <p><strong>Heavy Metals:</strong> ${tx.data.heavyMetals}</p>
                <p><strong>Microbial:</strong> ${tx.data.microbial}</p>
            </div>
        `;
    });

    recentTestsContainer.innerHTML = html;
}

function loadManufacturerDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2>Manufacturer Dashboard</h2>
            <div class="herb-card">
                <h3>Create Product from Batch</h3>
                <form id="manufacturing-form">
                    <div class="form-group">
                        <label for="manufacturing-batch-id">Batch ID:</label>
                        <input type="text" id="manufacturing-batch-id" required placeholder="Enter approved batch ID">
                        <button type="button" id="check-batch-status">Check Batch Status</button>
                    </div>
                    <div id="batch-status-message" style="margin: 10px 0; padding: 10px; border-radius: 5px; display: none;"></div>
                    <div class="form-group">
                        <label for="product-name">Product Name:</label>
                        <input type="text" id="product-name" required placeholder="e.g., Ashwagandha Premium Extract">
                    </div>
                    <div class="form-group">
                        <label for="product-type">Product Type:</label>
                        <select id="product-type" required>
                            <option value="">Select Type</option>
                            <option value="powder">Powder</option>
                            <option value="capsule">Capsule</option>
                            <option value="tablet">Tablet</option>
                            <option value="extract">Liquid Extract</option>
                            <option value="oil">Oil</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="manufacturing-date">Manufacturing Date:</label>
                        <input type="date" id="manufacturing-date" required>
                    </div>
                    <div class="form-group">
                        <label for="expiry-date">Expiry Date:</label>
                        <input type="date" id="expiry-date" required>
                    </div>
                    <div class="form-group">
                        <label for="manufacturer-info">Manufacturer Info:</label>
                        <textarea id="manufacturer-info" rows="2" required>Ayurveda Essentials Pvt. Ltd., Haridwar, India</textarea>
                    </div>
                    <div class="form-group">
                        <label for="manufacturing-cert">Upload Certification (PDF/Img):</label>
                        <input type="file" id="manufacturing-cert" accept=".pdf,image/*">
                    </div>
                    <button type="submit" id="manufacture-btn">Record Manufacturing & Generate QR Code</button>
                </form>
            </div>
            
            <div class="herb-card" id="qr-result" style="display: none;">
                <h3>QR Code Generated</h3>
                <div id="qr-code-container"></div>
                <p>This QR code can now be printed on the product packaging.</p>
            </div>
            
            <div class="herb-card">
                <button class="add-btn" onclick="showDashboard('recent-manufactured')">View Recent Products</button>
                <button class="add-btn outline" style="margin-top:10px" onclick="if(window.DataExporter) window.DataExporter.exportTransactions('manufacturing', 'products')">
                    <i class="ph ph-download-simple"></i> Export Products CSV
                </button>
            </div>
        </div>
    `;

    // Add batch status check functionality
    document.getElementById('check-batch-status').addEventListener('click', function () {
        const batchId = document.getElementById('manufacturing-batch-id').value;
        const statusMessage = document.getElementById('batch-status-message');

        if (!batchId) {
            alert('Please enter a Batch ID');
            return;
        }

        if (!doesBatchExist(batchId)) {
            // Show available batch IDs for debugging
            const allTransactions = getAllHerbTransactions();
            const collectionTransactions = allTransactions.filter(tx => tx.data.type === 'collection');
            const availableBatchIds = collectionTransactions.map(tx => tx.data.batchId);

            let debugMessage = '<p style="color: red;">Batch ID not found!</p>';
            debugMessage += '<p><strong>Available batch IDs:</strong></p>';
            if (availableBatchIds.length > 0) {
                debugMessage += '<ul>';
                availableBatchIds.forEach(id => {
                    debugMessage += `<li>${id} (copy and paste this)</li>`;
                });
                debugMessage += '</ul>';
                debugMessage += '<p><em>Create a batch in the farmer dashboard first, then test it in the lab.</em></p>';
            } else {
                debugMessage += '<p><em>No batches have been created yet. Go to the farmer dashboard first.</em></p>';
            }

            statusMessage.innerHTML = debugMessage;
            statusMessage.style.display = 'block';
            return;
        }

        const batchTransactions = getBatchHistory(batchId);
        const labTests = batchTransactions.filter(tx => tx.data.type === 'lab-test');

        if (labTests.length === 0) {
            statusMessage.innerHTML = '<p style="color: orange;">This batch has not been tested yet.</p>';
            statusMessage.style.display = 'block';
            return;
        }

        const latestTest = labTests[labTests.length - 1];
        if (latestTest.data.testResult === 'pass') {
            statusMessage.innerHTML = `<p style="color: green;">✓ This batch PASSED lab tests and can be used for manufacturing!</p>`;
            statusMessage.style.display = 'block';
        } else {
            statusMessage.innerHTML = `
                <p style="color: red;">✗ This batch FAILED lab tests.</p>
                <p>Reasons for failure:</p>
                <ul>
                    <li>Moisture: ${latestTest.data.moisture}%</li>
                    <li>Pesticides: ${latestTest.data.pesticides}</li>
                    <li>Heavy Metals: ${latestTest.data.heavyMetals}</li>
                    <li>Microbial: ${latestTest.data.microbial}</li>
                </ul>
            `;
            statusMessage.style.display = 'block';
        }
    });

    // Form submission handler
    document.getElementById('manufacturing-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const batchId = document.getElementById('manufacturing-batch-id').value;
        const productName = document.getElementById('product-name').value;
        const productType = document.getElementById('product-type').value;
        const manufacturingDate = document.getElementById('manufacturing-date').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const manufacturerInfo = document.getElementById('manufacturer-info').value;

        // Find the original batch
        const originalTx = findHerbByBatchId(batchId);

        if (!originalTx) {
            if (window.showNotification) window.showNotification('Batch ID not found!', 'error');
            else alert('Batch ID not found!');
            return;
        }

        // Check if batch passed lab tests
        const batchTransactions = getBatchHistory(batchId);
        const labTests = batchTransactions.filter(tx => tx.data.type === 'lab-test');

        // Check if there's at least one passing test
        const hasPassingTest = labTests.some(test => test.data.testResult === 'pass');

        if (labTests.length === 0) {
            if (window.showNotification) window.showNotification('This batch has not been tested yet and cannot be used for manufacturing!', 'error');
            else alert('This batch has not been tested yet and cannot be used for manufacturing!');
            return;
        }

        if (!hasPassingTest) {
            if (window.showNotification) window.showNotification('Batch has not passed lab tests!', 'error');
            else alert('This batch has not passed lab tests and cannot be used for manufacturing!');

            // Show details of why it failed
            const latestTest = labTests[labTests.length - 1];
            if (latestTest && !window.showNotification) {
                alert(`Latest test failed because:\n- Moisture: ${latestTest.data.moisture}%\n- Pesticides: ${latestTest.data.pesticides}\n- Heavy Metals: ${latestTest.data.heavyMetals}\n- Microbial: ${latestTest.data.microbial}`);
            }

            return;
        }

        // Generate a product ID
        const productId = 'PROD-' + Date.now();
        const certFile = document.getElementById('manufacturing-cert').files[0];
        const certHash = certFile ? 'ipfs://Qm' + Math.random().toString(36).substring(2, 15) : null;

        // Create manufacturing data object
        const manufacturingData = {
            type: 'manufacturing',
            batchId: batchId,
            productId: productId,
            productName: productName,
            productType: productType,
            manufacturingDate: manufacturingDate,
            expiryDate: expiryDate,
            manufacturerInfo: manufacturerInfo,
            certHash: certHash,
            status: 'manufactured'
        };

        // Add to blockchain
        addHerbTransaction(manufacturingData);
        if (typeof updateBlockchainVisualization === 'function') updateBlockchainVisualization();

        // Generate functional QR code
        document.getElementById('qr-result').style.display = 'block';

        // Create a URL that points to the consumer portal with the product ID
        const productUrl = `${window.location.origin}${window.location.pathname}?dashboard=consumer&product=${productId}`;

        // Generate QR code using a service (for demo purposes)
        document.getElementById('qr-code-container').innerHTML = `
    <div style="text-align: center;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(productUrl)}" 
             alt="QR Code" style="max-width: 200px; border-radius: 8px;">
        <p>Product ID: ${productId}</p>
        <p>Scan this QR code to view the full history of this product</p>
        <p><small>Or visit: <a href="${productUrl}" target="_blank">${productUrl}</a></small></p>
    </div>
`;
        // Show success message
        if (window.showNotification) {
            window.showNotification(`Product manufactured! Product ID: ${productId}`, 'success');
            if (certHash) window.showNotification(`Certificate uploaded: ${certHash}`, 'info', 'IPFS Sync');
        } else {
            alert(`Product manufacturing recorded successfully! Product ID: ${productId}`);
        }

        // Update recent products
        updateRecentProducts();
    });

    // Load recent products
    updateRecentProducts();
}
function updateRecentProducts() {
    const recentProductsContainer = document.getElementById('recent-products');
    if (!recentProductsContainer) return;

    const allTransactions = getAllHerbTransactions();
    const manufacturingTransactions = allTransactions.filter(tx => tx.data.type === 'manufacturing');

    if (manufacturingTransactions.length === 0) {
        recentProductsContainer.innerHTML = '<p>No products manufactured yet.</p>';
        return;
    }

    let html = '';
    manufacturingTransactions.slice(-5).reverse().forEach(tx => {
        html += `
            <div class="herb-card">
                <h4>${tx.data.productName}</h4>
                <p><strong>Product ID:</strong> ${tx.data.productId}</p>
                <p><strong>Type:</strong> ${tx.data.productType}</p>
                <p><strong>Manufactured:</strong> ${tx.data.manufacturingDate}</p>
                <p><strong>Expiry:</strong> ${tx.data.expiryDate}</p>
            </div>
        `;
    });

    recentProductsContainer.innerHTML = html;
}
// Example for farmer dashboard form - Only add if form exists
const herbForm = document.getElementById('herb-collection-form');
if (herbForm) {
    herbForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;

        // Your existing code here...

        // After successful submission, restore button
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Herb collection recorded successfully!';
            this.parentNode.insertBefore(successMsg, this.nextSibling);

            // Remove message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        }, 1000);
    });
}
// Sustainability Dashboard
// Sustainability Dashboard - Improved UI
function loadSustainabilityDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2>Sustainability Dashboard</h2>
            <p class="dashboard-subtitle">Track environmental impact and supply chain transparency</p>
            
            <div class="herb-card">
                <h3>🌿 Environmental Impact Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">🌱</div>
                        <div class="metric-value" id="total-herbs">0</div>
                        <div class="metric-label">Herbs Tracked</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">✅</div>
                        <div class="metric-value" id="organic-herbs">0</div>
                        <div class="metric-label">Organic Certified</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">💧</div>
                        <div class="metric-value" id="avg-moisture">0%</div>
                        <div class="metric-label">Avg Moisture</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">⭐</div>
                        <div class="metric-value" id="success-rate">100%</div>
                        <div class="metric-label">Quality Pass Rate</div>
                    </div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="herb-card">
                    <h3>📊 Quality Analytics</h3>
                    <div class="stat-item">
                        <span class="stat-label">Total Tests Conducted:</span>
                        <span class="stat-value" id="total-tests">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Passed Tests:</span>
                        <span class="stat-value" id="passed-tests">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Failed Tests:</span>
                        <span class="stat-value" id="failed-tests">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Success Rate:</span>
                        <span class="stat-value" id="success-rate-display">100%</span>
                    </div>
                </div>
                
                <div class="herb-card">
                    <h3>📍 Source Locations</h3>
                    <div class="stat-item">
                        <span class="stat-label">Farmers Registered:</span>
                        <span class="stat-value" id="total-farmers">5</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Regions Covered:</span>
                        <span class="stat-value" id="total-regions">3</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Collection Size:</span>
                        <span class="stat-value" id="avg-collection">0 kg</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Sustainable Practices:</span>
                        <span class="stat-value" id="sustainable-practices">100%</span>
                    </div>
                </div>
            </div>
            
            <div class="herb-card">
                <h3>🗺️ Geographical Distribution</h3>
                <div class="map-visualization">
                    <div id="sustainability-map" class="map-container" style="height: 350px; width: 100%; border-radius:8px;">
                        Loading map...
                    </div>
                </div>
                <div class="map-legend" style="margin-top:1rem; display:flex; gap:1rem; justify-content:center;">
                    <div class="legend-item" style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="legend-color" style="background: #4CAF50; width:12px; height:12px; border-radius:50%; display:inline-block;"></span>
                        <span>Ashwagandha</span>
                    </div>
                    <div class="legend-item" style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="legend-color" style="background: #FF9800; width:12px; height:12px; border-radius:50%; display:inline-block;"></span>
                        <span>Turmeric</span>
                    </div>
                    <div class="legend-item" style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="legend-color" style="background: #9C27B0; width:12px; height:12px; border-radius:50%; display:inline-block;"></span>
                        <span>Tulsi</span>
                    </div>
                </div>
            </div>
            
            <div class="herb-card">
                <h3>📈 Monthly Performance</h3>
                <div class="chart-container" style="position: relative; height:300px; width:100%">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
            
            <div class="herb-card" style="text-align:center;">
                <button class="add-btn outline" onclick="if(window.DataExporter) window.DataExporter.exportTransactions(null, 'all_data')">
                    <i class="ph ph-download-simple"></i> Export All Supply Chain Data (CSV)
                </button>
            </div>
        </div>
    `;

    setTimeout(() => {
        updateSustainabilityMetrics();
        initSustainabilityMap();
        initSustainabilityChart();
    }, 100);
}

function updateSustainabilityMetrics() {
    const allTransactions = getAllHerbTransactions();
    const collectionTransactions = allTransactions.filter(tx => tx.data.type === 'collection');
    const labTransactions = allTransactions.filter(tx => tx.data.type === 'lab-test');
    const wasteCollections = allTransactions.filter(tx => tx.data.type === 'waste-collection');
    const wasteConversions = allTransactions.filter(tx => tx.data.type === 'waste-conversion');

    // Update metrics
    if (document.getElementById('total-herbs')) {
        document.getElementById('total-herbs').textContent = collectionTransactions.length;
    }

    // Calculate pass rate
    if (labTransactions.length > 0 && document.getElementById('success-rate')) {
        const passCount = labTransactions.filter(tx => tx.data.testResult === 'pass').length;
        const passRate = Math.round((passCount / labTransactions.length) * 100);
        document.getElementById('success-rate').textContent = `${passRate}%`;
        document.getElementById('success-rate-display').textContent = `${passRate}%`;
    }

    // Calculate average moisture
    if (labTransactions.length > 0 && document.getElementById('avg-moisture')) {
        const totalMoisture = labTransactions.reduce((sum, tx) => sum + parseFloat(tx.data.moisture || 0), 0);
        const avgMoisture = Math.round(totalMoisture / labTransactions.length);
        document.getElementById('avg-moisture').textContent = `${avgMoisture}%`;
    }

    // Update test statistics
    if (document.getElementById('total-tests')) {
        document.getElementById('total-tests').textContent = labTransactions.length;
        const passCount = labTransactions.filter(tx => tx.data.testResult === 'pass').length;
        document.getElementById('passed-tests').textContent = passCount;
        document.getElementById('failed-tests').textContent = labTransactions.length - passCount;
    }

    // Calculate average collection size
    if (collectionTransactions.length > 0 && document.getElementById('avg-collection')) {
        const totalQuantity = collectionTransactions.reduce((sum, tx) => sum + parseFloat(tx.data.quantity || 0), 0);
        const avgQuantity = Math.round(totalQuantity / collectionTransactions.length);
        document.getElementById('avg-collection').textContent = `${avgQuantity} kg`;
    }

    // For demo purposes
    if (document.getElementById('organic-herbs')) {
        document.getElementById('organic-herbs').textContent = collectionTransactions.length;
    }

    // Update waste management metrics in sustainability dashboard
    if (document.getElementById('total-waste-sus')) {
        const totalWaste = wasteCollections.reduce((sum, tx) => sum + parseFloat(tx.data.quantity || 0), 0);
        document.getElementById('total-waste-sus').textContent = totalWaste.toFixed(1);
    }

    if (document.getElementById('waste-utilization-rate')) {
        const utilizationRate = wasteCollections.length > 0 ?
            Math.round((wasteConversions.length / wasteCollections.length) * 100) : 0;
        document.getElementById('waste-utilization-rate').textContent = `${utilizationRate}%`;
    }

    if (document.getElementById('carbon-offset')) {
        const totalCarbon = wasteConversions.reduce((sum, tx) => sum + parseFloat(tx.data.carbonSaved || 0), 0);
        document.getElementById('carbon-offset').textContent = totalCarbon.toFixed(1);
    }
}
// Blockchain visualization
function updateBlockchainVisualization() {
    const blockCounter = document.getElementById('block-counter');
    const transactionCounter = document.getElementById('transaction-counter');
    const visualization = document.getElementById('blockchain-visualization');

    if (blockCounter && transactionCounter) {
        const totalBlocks = vaidyachain.chain.length;
        const totalTransactions = totalBlocks - 1; // Subtract genesis block

        blockCounter.textContent = `Blocks: ${totalBlocks}`;
        transactionCounter.textContent = `Transactions: ${totalTransactions}`;
        visualization.style.display = 'block';

        // Add animation for new block
        visualization.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            visualization.style.animation = '';
        }, 500);
    }
}

// Call this after each transaction
// Add to addHerbTransaction function or after each form submission
updateBlockchainVisualization();
// Consumer Portal
function loadConsumerPortal() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2>Consumer Portal</h2>

            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="total-herb-products">0</div>
                    <div class="stat-label">Herb Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-waste-products">0</div>
                    <div class="stat-label">Waste Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-carbon-saved">0</div>
                    <div class="stat-label">Carbon Saved (kg CO₂)</div>
                </div>
            </div>

            <div class="herb-card">
                <h3>Trace Your Product</h3>
                <p>Enter your product ID or scan the QR code to view the complete history of your Ayurvedic product.</p>
                <form id="trace-product-form">
                    <div class="form-group">
                        <label for="trace-input">Product ID or QR Code:</label>
                        <input type="text" id="trace-input" required placeholder="Enter product ID">
                    </div>
                    <button type="submit">Trace Product</button>
                </form>
            </div>

            <div class="herb-card" id="trace-results" style="display: none;">
                <h3>Product History</h3>
                <div id="product-history"></div>
            </div>

            <div class="herb-card">
                <h3>🏭 Manufactured Products (From Herbs)</h3>
                <div id="herb-products-list" class="products-grid">
                    <!-- Herb products will be loaded here -->
                </div>
            </div>

            <div class="herb-card">
                <h3>♻️ Converted Products (From Waste)</h3>
                <div id="waste-products-list" class="products-grid">
                    <!-- Waste products will be loaded here -->
                </div>
            </div>
        </div>
    `;

    loadConsumerStats();
    loadConsumerProducts();

    // Check if we have a product ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');

    if (productId) {
        document.getElementById('trace-input').value = productId;
        traceProduct(productId);
    }

    // Form submission handler
    document.getElementById('trace-product-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const productId = document.getElementById('trace-input').value;
        traceProduct(productId);
    });
}

function traceProduct(productId) {
    const traceResults = document.getElementById('trace-results');
    const productHistory = document.getElementById('product-history');

    // Find the product record (can be manufacturing or waste conversion)
    const allTransactions = getAllHerbTransactions();
    const productRecord = allTransactions.find(tx =>
        (tx.data.type === 'manufacturing' || tx.data.type === 'waste-conversion') &&
        (tx.data.productId === productId || tx.data.batchId === productId)
    );

    if (!productRecord) {
        traceResults.style.display = 'block';
        productHistory.innerHTML = '<p class="error-message">Product not found. Please check the ID and try again.</p>';
        return;
    }

    const batchId = productRecord.data.batchId;
    const batchTransactions = getBatchHistory(batchId);

    // Build interactive timeline
    let html = `
        <div class="product-header">
            <h4>${productRecord.data.productName}</h4>
            <div class="product-details">
                <p><strong>Product ID:</strong> ${productRecord.data.productId}</p>
                <p><strong>Type:</strong> ${productRecord.data.productType}</p>
                <p><strong>Manufactured:</strong> ${productRecord.data.conversionDate || productRecord.data.manufacturingDate}</p>
                <p><strong>Manufacturer:</strong> ${productRecord.data.manufacturerInfo}</p>
                <p><strong>Batch ID:</strong> ${productRecord.data.batchId}</p>
                <p><strong>Origin:</strong> ${productRecord.data.type === 'waste-conversion' ? 'Waste Conversion' : 'Herb Manufacturing'}</p>
            </div>
        </div>

        <h4 style="margin: 30px 0 20px 0; color: var(--primary-dark);">Supply Chain Journey</h4>
        <div class="timeline">
    `;

    // Add each step to timeline
    batchTransactions.forEach((tx, index) => {
        let stepIcon = '📦';
        let stepTitle = 'Transaction';
        let stepContent = '';
        let stepType = 'general';

        switch (tx.data.type) {
            case 'collection':
                stepIcon = '🌱';
                stepTitle = 'Harvested';
                stepType = 'collection';
                stepContent = `
                    <p><strong>Herb Type:</strong> ${tx.data.herbType}</p>
                    <p><strong>Quantity:</strong> ${tx.data.quantity} kg</p>
                    <p><strong>Collection Date:</strong> ${tx.data.collectionDate}</p>
                    <p><strong>Location:</strong> ${tx.data.location.latitude}, ${tx.data.location.longitude}</p>
                    <p><strong>Farmer:</strong> ${tx.data.farmer.name}, ${tx.data.farmer.region}</p>
                    <p><strong>Status:</strong> <span class="test-result pass">COLLECTED</span></p>
                `;
                break;
            case 'lab-test':
                stepIcon = '🔬';
                stepTitle = 'Quality Testing';
                stepType = 'lab-test';
                const testResultClass = tx.data.testResult === 'pass' ? 'pass' : 'fail';
                stepContent = `
                    <p><strong>Result:</strong> <span class="test-result ${testResultClass}">${tx.data.testResult.toUpperCase()}</span></p>
                    <p><strong>Moisture Content:</strong> ${tx.data.moisture}%</p>
                    <p><strong>Pesticides:</strong> ${tx.data.pesticides}</p>
                    <p><strong>Heavy Metals:</strong> ${tx.data.heavyMetals}</p>
                    <p><strong>Microbial Count:</strong> ${tx.data.microbial}</p>
                    <p><strong>Lab:</strong> ${tx.data.lab.name}</p>
                    <p><strong>Technician:</strong> ${tx.data.lab.technician}</p>
                    ${tx.data.notes ? `<p><strong>Notes:</strong> ${tx.data.notes}</p>` : ''}
                `;
                break;
            case 'manufacturing':
                stepIcon = '🏭';
                stepTitle = 'Manufactured';
                stepType = 'manufacturing';
                stepContent = `
                    <p><strong>Product Name:</strong> ${tx.data.productName}</p>
                    <p><strong>Product Type:</strong> ${tx.data.productType}</p>
                    <p><strong>Manufacturing Date:</strong> ${tx.data.manufacturingDate}</p>
                    <p><strong>Expiry Date:</strong> ${tx.data.expiryDate}</p>
                    <p><strong>Manufacturer:</strong> ${tx.data.manufacturerInfo}</p>
                    <p><strong>Status:</strong> <span class="test-result pass">MANUFACTURED</span></p>
                `;
                break;
        }

        html += `
            <div class="timeline-step ${stepType}">
                <div class="timeline-icon">${stepIcon}</div>
                <div class="timeline-content">
                    <h5>${stepTitle}</h5>
                    <div class="timeline-date">${tx.timestamp}</div>
                    ${stepContent}
                </div>
            </div>
        `;

        // Add waste collection step for waste-conversion products
        if (productRecord.data.type === 'waste-conversion' && stepType === 'general') {
            const wasteBatch = batchTransactions.find(tx => tx.data.type === 'waste-collection' && tx.data.wasteBatchId === productRecord.data.wasteBatchId);
            if (wasteBatch) {
                html += `
                    <div class="timeline-step collection">
                        <div class="timeline-icon">🌾</div>
                        <div class="timeline-content">
                            <h5>Waste Collected</h5>
                            <div class="timeline-date">${wasteBatch.timestamp}</div>
                            <p><strong>Waste Type:</strong> ${wasteBatch.data.wasteSource}</p>
                            <p><strong>Quantity:</strong> ${wasteBatch.data.quantity} kg</p>
                            <p><strong>Collection Date:</strong> ${wasteBatch.data.collectionDate}</p>
                            <p><strong>Farmer:</strong> ${wasteBatch.data.farmer.name}, ${wasteBatch.data.farmer.region}</p>
                            <p><strong>Status:</strong> <span class="test-result pass">COLLECTED</span></p>
                        </div>
                    </div>
                `;
            }
        }
    });

    html += `</div>`;

    productHistory.innerHTML = html;
    traceResults.style.display = 'block';

    // Add animation to timeline steps
    setTimeout(() => {
        const timelineSteps = document.querySelectorAll('.timeline-step');
        timelineSteps.forEach((step, index) => {
            step.style.animationDelay = `${index * 0.2}s`;
        });
    }, 100);



    // Add some CSS for the supply chain display
    const style = document.createElement('style');
    style.textContent = `
        .supply-chain {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 15px;
        }
        .supply-chain-step {
            border-left: 4px solid #4caf50;
            padding-left: 15px;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 0 8px 8px 0;
        }
        .supply-chain-step h5 {
            margin: 0 0 10px 0;
            color: #2e7d32;
        }
    `;
    document.head.appendChild(style);
}

// Recent Collections Page
function loadRecentCollections() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard shadcn-style">
            <div class="page-header">
                <button class="back-btn" onclick="showDashboard('farmer')">← Back to Farmer Dashboard</button>
                <h1>Recent Collections</h1>
                <p class="page-description">View all herb collections recorded in the blockchain</p>
            </div>

            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="total-collections">0</div>
                    <div class="stat-label">Total Collections</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-quantity">0 kg</div>
                    <div class="stat-label">Total Quantity</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="active-batches">0</div>
                    <div class="stat-label">Active Batches</div>
                </div>
            </div>

            <div class="collections-grid" id="collections-grid">
                <!-- Collections will be loaded here -->
            </div>
        </div>
    `;

    loadAllCollections();
}

function loadAllCollections() {
    const allTransactions = getAllHerbTransactions();
    const collectionTransactions = allTransactions.filter(tx => tx.data.type === 'collection');

    const totalCollections = collectionTransactions.length;
    const totalQuantity = collectionTransactions.reduce((sum, tx) => sum + parseFloat(tx.data.quantity || 0), 0);
    const activeBatches = new Set(collectionTransactions.map(tx => tx.data.batchId)).size;

    document.getElementById('total-collections').textContent = totalCollections;
    document.getElementById('total-quantity').textContent = `${totalQuantity.toFixed(1)} kg`;
    document.getElementById('active-batches').textContent = activeBatches;

    const grid = document.getElementById('collections-grid');

    if (collectionTransactions.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🌱</div>
                <h3>No Collections Yet</h3>
                <p>Start by recording your first herb collection in the farmer dashboard.</p>
                <button class="primary-btn" onclick="showDashboard('farmer')">Go to Farmer Dashboard</button>
            </div>
        `;
        return;
    }

    let html = '';
    collectionTransactions.reverse().forEach(tx => {
        html += `
            <div class="collection-card">
                <div class="card-header">
                    <div class="herb-icon">${getHerbIcon(tx.data.herbType)}</div>
                    <div class="card-title">
                        <h3>${tx.data.herbType.charAt(0).toUpperCase() + tx.data.herbType.slice(1)}</h3>
                        <span class="batch-id">Batch: ${tx.data.batchId}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="detail-row">
                        <span class="label">Quantity:</span>
                        <span class="value">${tx.data.quantity} kg</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Date:</span>
                        <span class="value">${tx.data.collectionDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Farmer:</span>
                        <span class="value">${tx.data.farmer.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Location:</span>
                        <span class="value">${tx.data.location.latitude}, ${tx.data.location.longitude}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span class="status-badge status-${tx.data.status}">${tx.data.status.toUpperCase()}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="secondary-btn" onclick="viewBatchHistory('${tx.data.batchId}')">View Batch History</button>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Recent Tests Page
function loadRecentTests() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard shadcn-style">
            <div class="page-header">
                <button class="back-btn" onclick="showDashboard('lab')">← Back to Testing Lab</button>
                <h1>Recent Tests</h1>
                <p class="page-description">View all quality test results recorded in the blockchain</p>
            </div>

            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="total-tests">0</div>
                    <div class="stat-label">Total Tests</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="passed-tests">0</div>
                    <div class="stat-label">Tests Passed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="pass-rate">0%</div>
                    <div class="stat-label">Success Rate</div>
                </div>
            </div>

            <div class="tests-grid" id="tests-grid">
                <!-- Tests will be loaded here -->
            </div>
        </div>
    `;

    loadAllTests();
}

function loadAllTests() {
    const allTransactions = getAllHerbTransactions();
    const testTransactions = allTransactions.filter(tx => tx.data.type === 'lab-test');

    const totalTests = testTransactions.length;
    const passedTests = testTransactions.filter(tx => tx.data.testResult === 'pass').length;
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    document.getElementById('total-tests').textContent = totalTests;
    document.getElementById('passed-tests').textContent = passedTests;
    document.getElementById('pass-rate').textContent = `${passRate}%`;

    const grid = document.getElementById('tests-grid');

    if (testTransactions.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔬</div>
                <h3>No Tests Yet</h3>
                <p>Start by testing herb batches in the lab dashboard.</p>
                <button class="primary-btn" onclick="showDashboard('lab')">Go to Lab Dashboard</button>
            </div>
        `;
        return;
    }

    let html = '';
    testTransactions.reverse().forEach(tx => {
        const resultClass = tx.data.testResult === 'pass' ? 'success' : 'danger';
        const resultIcon = tx.data.testResult === 'pass' ? '✓' : '✗';

        html += `
            <div class="test-card">
                <div class="card-header">
                    <div class="test-icon">${resultIcon}</div>
                    <div class="card-title">
                        <h3>Batch: ${tx.data.batchId}</h3>
                        <span class="result-badge result-${resultClass}">${tx.data.testResult.toUpperCase()}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="test-details">
                        <div class="detail-row">
                            <span class="label">Moisture:</span>
                            <span class="value">${tx.data.moisture}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Pesticides:</span>
                            <span class="value">${tx.data.pesticides}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Heavy Metals:</span>
                            <span class="value">${tx.data.heavyMetals}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Microbial:</span>
                            <span class="value">${tx.data.microbial}</span>
                        </div>
                        ${tx.data.notes ? `
                        <div class="detail-row">
                            <span class="label">Notes:</span>
                            <span class="value">${tx.data.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="card-footer">
                    <button class="secondary-btn" onclick="viewBatchHistory('${tx.data.batchId}')">View Batch History</button>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Recent Manufactured Products Page
function loadRecentManufactured() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard shadcn-style">
            <div class="page-header">
                <button class="back-btn" onclick="showDashboard('manufacturer')">← Back to Manufacturer</button>
                <h1>Recently Manufactured Products</h1>
                <p class="page-description">View all manufactured products recorded in the blockchain</p>
            </div>

            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="total-products">0</div>
                    <div class="stat-label">Total Products</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="unique-batches">0</div>
                    <div class="stat-label">Batches Used</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="product-types">0</div>
                    <div class="stat-label">Product Types</div>
                </div>
            </div>

            <div class="products-grid" id="products-grid">
                <!-- Products will be loaded here -->
            </div>
        </div>
    `;

    loadAllProducts();
}

function loadAllProducts() {
    const allTransactions = getAllHerbTransactions();
    const manufacturingTransactions = allTransactions.filter(tx => tx.data.type === 'manufacturing');

    const totalProducts = manufacturingTransactions.length;
    const uniqueBatches = new Set(manufacturingTransactions.map(tx => tx.data.batchId)).size;
    const productTypes = new Set(manufacturingTransactions.map(tx => tx.data.productType)).size;

    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('unique-batches').textContent = uniqueBatches;
    document.getElementById('product-types').textContent = productTypes;

    const grid = document.getElementById('products-grid');

    if (manufacturingTransactions.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏭</div>
                <h3>No Products Yet</h3>
                <p>Start by manufacturing products from approved batches.</p>
                <button class="primary-btn" onclick="showDashboard('manufacturer')">Go to Manufacturer Dashboard</button>
            </div>
        `;
        return;
    }

    let html = '';
    manufacturingTransactions.reverse().forEach(tx => {
        html += `
            <div class="product-card">
                <div class="card-header">
                    <div class="product-icon">💊</div>
                    <div class="card-title">
                        <h3>${tx.data.productName}</h3>
                        <span class="product-id">ID: ${tx.data.productId}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="detail-row">
                        <span class="label">Type:</span>
                        <span class="value">${tx.data.productType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Manufactured:</span>
                        <span class="value">${tx.data.manufacturingDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Expiry:</span>
                        <span class="value">${tx.data.expiryDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Batch:</span>
                        <span class="value">${tx.data.batchId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Manufacturer:</span>
                        <span class="value">${tx.data.manufacturerInfo.split(',')[0]}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="secondary-btn" onclick="viewBatchHistory('${tx.data.batchId}')">View Batch History</button>
                    <button class="primary-btn" onclick="viewProductTrace('${tx.data.productId}')">View Product Trace</button>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Helper functions
function getHerbIcon(herbType) {
    const icons = {
        'ashwagandha': '🌿',
        'turmeric': '🟡',
        'tulsi': '🌱',
        'amla': '🟢',
        'brahmi': '🌸'
    };
    return icons[herbType] || '🌿';
}

function viewBatchHistory(batchId) {
    // Navigate to consumer portal with batch ID
    window.location.href = `?dashboard=consumer&product=${batchId}`;
}

function viewProductTrace(productId) {
    // Navigate to consumer portal with product ID
    window.location.href = `?dashboard=consumer&product=${productId}`;
}

// Smart Contracts Dashboard
function loadSmartContractsDashboard() {
    // Ensure smart contract functions are available
    if (typeof window.executeSmartContract === 'undefined') {
        console.error('Smart contract functions not loaded. Please refresh the page.');
        alert('Smart contract functions not loaded. Please refresh the page.');
        return;
    }

    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard shadcn-style">
            <div class="page-header">
                <h1> Smart Contracts Dashboard</h1>
                <p class="page-description">Real-time automated payments and insurance claims powered by smart contracts</p>
            </div>

            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="active-contracts">4</div>
                    <div class="stat-label">Active Contracts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="auto-payments">0</div>
                    <div class="stat-label">Auto-Payments Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="insurance-claims">0</div>
                    <div class="stat-label">Insurance Claims</div>
                </div>
            </div>

            <div class="contracts-grid">
                <div class="contract-card">
                    <div class="card-header">
                        <div class="contract-icon">💰</div>
                        <div class="card-title">
                            <h3>Payment Contract</h3>
                            <span class="contract-status">Active</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>Automatically releases farmer payments when products are manufactured and quality tests pass.</p>
                        <div class="contract-stats">
                            <div class="stat-item">
                                <span class="label">Total Balance:</span>
                                <span class="value" id="payment-balance">₹0</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Payments Released:</span>
                                <span class="value" id="payments-released">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="primary-btn" onclick="depositToPaymentContract()">Deposit Funds</button>
                        <button class="secondary-btn" onclick="viewPaymentHistory()">View History</button>
                    </div>
                </div>

                <div class="contract-card">
                    <div class="card-header">
                        <div class="contract-icon">🛡️</div>
                        <div class="card-title">
                            <h3>Insurance Contract</h3>
                            <span class="contract-status">Active</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>Automatic crop failure insurance claims and payouts for quality test failures.</p>
                        <div class="contract-stats">
                            <div class="stat-item">
                                <span class="label">Active Policies:</span>
                                <span class="value" id="active-policies">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Claims Paid:</span>
                                <span class="value" id="claims-paid">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="primary-btn" onclick="purchaseInsurance()">Purchase Insurance</button>
                        <button class="secondary-btn" onclick="viewInsuranceClaims()">View Claims</button>
                    </div>
                </div>

                <div class="contract-card">
                    <div class="card-header">
                        <div class="contract-icon">✅</div>
                        <div class="card-title">
                            <h3>Quality Assurance Contract</h3>
                            <span class="contract-status">Active</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>Automated quality threshold checking and payment releases based on test results.</p>
                        <div class="contract-stats">
                            <div class="stat-item">
                                <span class="label">Quality Checks:</span>
                                <span class="value" id="quality-checks">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Auto-Releases:</span>
                                <span class="value" id="auto-releases">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="primary-btn" onclick="setQualityThresholds()">Set Thresholds</button>
                        <button class="secondary-btn" onclick="viewQualityEvents()">View Events</button>
                    </div>
                </div>

                <div class="contract-card">
                    <div class="card-header">
                        <div class="contract-icon">🔗</div>
                        <div class="card-title">
                            <h3>Supply Chain Contract</h3>
                            <span class="contract-status">Active</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>Manages stakeholder verification and batch transfers between supply chain participants.</p>
                        <div class="contract-stats">
                            <div class="stat-item">
                                <span class="label">Registered Stakeholders:</span>
                                <span class="value" id="registered-stakeholders">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="label">Batch Transfers:</span>
                                <span class="value" id="batch-transfers">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="primary-btn" onclick="registerStakeholder()">Register Stakeholder</button>
                        <button class="secondary-btn" onclick="viewTransferHistory()">Transfer History</button>
                    </div>
                </div>
            </div>

            <div class="real-time-events">
                <h3>📊 Real-Time Contract Events</h3>
                <div class="events-list" id="events-list">
                    <div class="event-item">
                        <span class="event-time">Just now</span>
                        <span class="event-message">🔄 Smart contract triggers running every 30 seconds...</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    loadSmartContractData();
}

// Load smart contract data
function loadSmartContractData() {
    // Get contract states
    const paymentState = getContractState('paymentContract');
    const insuranceState = getContractState('insuranceContract');

    // Update payment contract stats
    if (paymentState?.balances) {
        const totalBalance = Object.values(paymentState.balances).reduce((sum, bal) => sum + bal, 0);
        document.getElementById('payment-balance').textContent = `₹${totalBalance}`;
    }

    // Update insurance stats
    if (insuranceState?.policies) {
        const activePolicies = Object.values(insuranceState.policies).filter(p => p.status === 'active').length;
        document.getElementById('active-policies').textContent = activePolicies;
    }

    if (insuranceState?.claims) {
        const paidClaims = Object.values(insuranceState.claims).filter(c => c.status === 'approved').length;
        document.getElementById('claims-paid').textContent = paidClaims;
    }

    // Load events
    loadContractEvents();
}

// Load recent contract events
function loadContractEvents() {
    const eventsList = document.getElementById('events-list');
    if (!eventsList) return;

    const allEvents = [];
    ['paymentContract', 'insuranceContract', 'qualityContract', 'supplyChainContract'].forEach(contractName => {
        const events = getContractEvents(contractName);
        allEvents.push(...events);
    });

    // Sort by timestamp (newest first) and take last 10
    allEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentEvents = allEvents.slice(0, 10);

    let html = '';
    if (recentEvents.length === 0) {
        html = '<div class="event-item"><span class="event-time">Now</span><span class="event-message">⏳ Waiting for smart contract events...</span></div>';
    } else {
        recentEvents.forEach(event => {
            const timeAgo = getTimeAgo(new Date(event.timestamp));
            const icon = getEventIcon(event.event);
            html += `
                <div class="event-item">
                    <span class="event-time">${timeAgo}</span>
                    <span class="event-message">${icon} ${event.event}: ${getEventDescription(event)}</span>
                </div>
            `;
        });
    }

    eventsList.innerHTML = html;
}

// Helper functions for smart contracts UI
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function getEventIcon(eventType) {
    const icons = {
        'PaymentDeposited': '💰',
        'PaymentReleased': '✅',
        'InsurancePurchased': '🛡️',
        'ClaimFiled': '📋',
        'ClaimApproved': '🎉',
        'ClaimRejected': '❌',
        'QualityCheckPassed': '✅',
        'QualityCheckFailed': '❌',
        'StakeholderRegistered': '👤',
        'ReputationUpdated': '⭐',
        'BatchTransferred': '📦'
    };
    return icons[eventType] || '🔄';
}

function getEventDescription(event) {
    switch (event.event) {
        case 'PaymentDeposited':
            return `₹${event.data.amount} deposited for farmer ${event.data.farmerId}`;
        case 'PaymentReleased':
            return `₹${event.data.amount} released to farmer ${event.data.farmerId}`;
        case 'InsurancePurchased':
            return `Insurance purchased for batch ${event.data.batchId}`;
        case 'ClaimFiled':
            return `Claim filed for ₹${event.data.lossAmount}`;
        case 'ClaimApproved':
            return `Claim approved: ₹${event.data.payoutAmount} paid`;
        case 'QualityCheckPassed':
            return `Quality check passed for batch ${event.data.batchId}`;
        case 'QualityCheckFailed':
            return `Quality check failed for batch ${event.data.batchId}`;
        default:
            return event.event;
    }
}

// Interactive functions for smart contracts
function depositToPaymentContract() {
    const amount = prompt('Enter amount to deposit (₹):');
    if (amount && parseFloat(amount) > 0) {
        try {
            executeSmartContract('paymentContract', 'deposit', {
                farmerId: 'FARMER-DEMO',
                amount: parseFloat(amount),
                productId: 'DEMO-DEPOSIT'
            });
            alert(`₹${amount} deposited to payment contract!`);
            loadSmartContractData();
        } catch (error) {
            alert('Error depositing funds: ' + error.message);
        }
    }
}

function purchaseInsurance() {
    const batchId = prompt('Enter batch ID to insure:');
    if (batchId) {
        try {
            executeSmartContract('insuranceContract', 'purchaseInsurance', {
                farmerId: 'FARMER-DEMO',
                batchId: batchId,
                premium: 500,
                coverage: 5000
            });
            alert(`Insurance purchased for batch ${batchId}!`);
            loadSmartContractData();
        } catch (error) {
            alert('Error purchasing insurance: ' + error.message);
        }
    }
}

function setQualityThresholds() {
    alert('Quality thresholds are automatically set for demo purposes.\n\nAshwagandha: Moisture < 10%, No pesticides\nTurmeric: Moisture < 12%, No heavy metals\nTulsi: Moisture < 8%, Within microbial limits');
}

function registerStakeholder() {
    const stakeholderId = prompt('Enter stakeholder ID:');
    const type = prompt('Enter type (farmer/lab/manufacturer):');
    const name = prompt('Enter name:');

    if (stakeholderId && type && name) {
        try {
            executeSmartContract('supplyChainContract', 'registerStakeholder', {
                stakeholderId,
                type,
                name,
                location: 'Demo Location',
                credentials: 'Verified'
            });
            alert(`Stakeholder ${name} registered successfully!`);
            loadSmartContractData();
        } catch (error) {
            alert('Error registering stakeholder: ' + error.message);
        }
    }
}

// View functions
function viewPaymentHistory() {
    const events = getContractEvents('paymentContract');
    let history = 'Payment Contract History:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No payment history yet.');
}

function viewInsuranceClaims() {
    const events = getContractEvents('insuranceContract');
    let history = 'Insurance Claims History:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No insurance claims yet.');
}

function viewQualityEvents() {
    const events = getContractEvents('qualityContract');
    let history = 'Quality Assurance Events:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No quality events yet.');
}

function viewTransferHistory() {
    const events = getContractEvents('supplyChainContract');
    let history = 'Supply Chain Transfer History:\n\n';
    events.forEach(event => {
        history += `${new Date(event.timestamp).toLocaleString()}: ${event.event} - ${getEventDescription(event)}\n`;
    });
    alert(history || 'No transfer history yet.');
}

// Waste Management Dashboard
function loadWasteManagementDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2>Waste Management Dashboard</h2>
            <p class="dashboard-subtitle">Convert agricultural waste into sustainable products</p>

            <div class="herb-card">
                <h3>♻️ Waste-to-Product Conversion Metrics</h3>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">🌾</div>
                        <div class="metric-value" id="total-waste">0</div>
                        <div class="metric-label">Waste Recorded (kg)</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">🔄</div>
                        <div class="metric-value" id="waste-converted">0</div>
                        <div class="metric-label">Waste Converted</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">📦</div>
                        <div class="metric-value" id="reusable-products">0</div>
                        <div class="metric-label">Reusable Products</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">💚</div>
                        <div class="metric-value" id="carbon-saved">0</div>
                        <div class="metric-label">Carbon Saved (kg CO₂)</div>
                    </div>
                </div>
            </div>

            <div class="waste-management-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" onclick="showWasteTab('record')">Record Waste</button>
                    <button class="tab-btn" onclick="showWasteTab('convert')">Convert to Products</button>
                    <button class="tab-btn" onclick="showWasteTab('history')">Conversion History</button>
                </div>

                <div id="waste-tabs-content">
                    <!-- Tab content will be loaded here -->
                </div>
            </div>
        </div>
    `;

    showWasteTab('record');
    updateWasteMetrics();
}

function showWasteTab(tabName) {
    const container = document.getElementById('waste-tabs-content');

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    switch (tabName) {
        case 'record':
            container.innerHTML = `
                <div class="herb-card">
                    <h3>Record Agricultural Waste</h3>
                    <p>Record waste generated from your farming activities (e.g., corn leaves, stems, husks)</p>
                    <form id="waste-collection-form">
                        <div class="form-group">
                            <label for="waste-source">Waste Source:</label>
                            <select id="waste-source" required>
                                <option value="">Select Source</option>
                                <option value="corn-leaves">Corn Leaves</option>
                                <option value="corn-stems">Corn Stems</option>
                                <option value="corn-husks">Corn Husks</option>
                                <option value="wheat-straw">Wheat Straw</option>
                                <option value="rice-husks">Rice Husks</option>
                                <option value="other">Other Agricultural Waste</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="waste-date">Collection Date:</label>
                            <input type="date" id="waste-date" required>
                        </div>
                        <div class="form-group">
                            <label for="waste-quantity">Quantity (kg):</label>
                            <input type="number" id="waste-quantity" min="1" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label for="waste-description">Description:</label>
                            <textarea id="waste-description" rows="3" placeholder="Describe the waste material and condition"></textarea>
                        </div>
                        <button type="submit">Record Waste to Blockchain</button>
                    </form>
                </div>
            `;

            // Form submission handler
            document.getElementById('waste-collection-form').addEventListener('submit', function (e) {
                e.preventDefault();
                console.log('Waste collection form submitted!');

                const wasteSource = document.getElementById('waste-source').value;
                const wasteDate = document.getElementById('waste-date').value;
                const wasteQuantity = document.getElementById('waste-quantity').value;
                const wasteDescription = document.getElementById('waste-description').value;

                console.log('Form data:', { wasteSource, wasteDate, wasteQuantity, wasteDescription });

                // Generate waste batch ID
                const wasteBatchId = 'WASTE-' + Date.now();
                console.log('Generated waste batch ID:', wasteBatchId);

                // Simulate GPS coordinates
                const latitude = (Math.random() * 180 - 90).toFixed(6);
                const longitude = (Math.random() * 360 - 180).toFixed(6);

                // Create waste data object
                const wasteData = {
                    type: 'waste-collection',
                    wasteSource: wasteSource,
                    collectionDate: wasteDate,
                    quantity: wasteQuantity,
                    description: wasteDescription,
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    farmer: {
                        id: 'FARMER-001',
                        name: 'Rajesh Kumar',
                        region: 'Madhya Pradesh'
                    },
                    wasteBatchId: wasteBatchId,
                    status: 'collected',
                    availableForConversion: true
                };

                console.log('Waste data object:', wasteData);

                // Add to blockchain
                const result = addHerbTransaction(wasteData);
                console.log('Transaction added result:', result);

                updateBlockchainVisualization();

                // Verify it was added
                const allTx = getAllHerbTransactions();
                const wasteTx = allTx.find(tx => tx.data.wasteBatchId === wasteBatchId);
                console.log('Waste transaction in blockchain:', wasteTx);

                // Show success message
                alert(`Waste collection recorded successfully! Waste Batch ID: ${wasteBatchId}\n\nCheck browser console for debug info.`);

                // Reset form
                this.reset();

                // Update metrics
                updateWasteMetrics();
            });
            break;

        case 'convert':
            container.innerHTML = `
                <div class="herb-card">
                    <h3>Convert Waste to Reusable Products</h3>
                    <p>Manufacturers can collect waste and convert it into sustainable products</p>
                    <form id="waste-conversion-form">
                        <div class="form-group">
                            <label for="waste-batch-id">Waste Batch ID:</label>
                            <input type="text" id="waste-batch-id" required placeholder="Enter waste batch ID">
                            <button type="button" id="check-waste-batch">Check Waste Batch</button>
                        </div>
                        <div id="waste-batch-info" style="display: none; margin: 15px 0; padding: 10px; background: #f0f8ff; border-radius: 5px;">
                            <h4>Waste Batch Information</h4>
                            <p id="waste-batch-details"></p>
                        </div>
                        <div class="form-group">
                            <label for="product-type">Product Type:</label>
                            <select id="product-type" required>
                                <option value="">Select Product</option>
                                <option value="plastic-plates">Plastic Plates</option>
                                <option value="biodegradable-bags">Biodegradable Bags</option>
                                <option value="compost">Organic Compost</option>
                                <option value="animal-feed">Animal Feed</option>
                                <option value="biofuel">Biofuel</option>
                                <option value="paper-products">Paper Products</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="product-name">Product Name:</label>
                            <input type="text" id="product-name" required placeholder="e.g., Eco-Friendly Plates">
                        </div>
                        <div class="form-group">
                            <label for="conversion-date">Conversion Date:</label>
                            <input type="date" id="conversion-date" required>
                        </div>
                        <div class="form-group">
                            <label for="output-quantity">Output Quantity:</label>
                            <input type="number" id="output-quantity" min="1" step="0.1" required>
                            <select id="output-unit" style="margin-left: 10px;">
                                <option value="pieces">Pieces</option>
                                <option value="kg">kg</option>
                                <option value="liters">Liters</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="manufacturer-info">Manufacturer Info:</label>
                            <textarea id="manufacturer-info" rows="2" required>GreenTech Solutions Pvt. Ltd., Sustainable Manufacturing Division</textarea>
                        </div>
                        <button type="submit" id="convert-btn">Convert Waste & Record to Blockchain</button>
                    </form>
                </div>
            `;

            // Add waste batch check functionality
            document.getElementById('check-waste-batch').addEventListener('click', function () {
                const wasteBatchId = document.getElementById('waste-batch-id').value.trim();
                if (!wasteBatchId) {
                    alert('Please enter a Waste Batch ID');
                    return;
                }

                const allTransactions = getAllHerbTransactions();
                console.log('All transactions:', allTransactions);
                console.log('Looking for waste batch ID:', wasteBatchId);

                // First, find any transaction with this wasteBatchId regardless of type
                const allWasteTransactions = allTransactions.filter(tx =>
                    tx.data.wasteBatchId === wasteBatchId
                );
                console.log('All transactions with this wasteBatchId:', allWasteTransactions);

                // Then find available waste batches
                const wasteBatch = allTransactions.find(tx => {
                    console.log('Checking transaction:', tx.data);
                    return tx.data.type === 'waste-collection' &&
                        tx.data.wasteBatchId === wasteBatchId &&
                        tx.data.availableForConversion === true;
                });

                console.log('Found waste batch:', wasteBatch);

                const wasteBatchInfo = document.getElementById('waste-batch-info');
                const wasteBatchDetails = document.getElementById('waste-batch-details');
                const convertBtn = document.getElementById('convert-btn');

                if (wasteBatch) {
                    wasteBatchDetails.innerHTML = `
                        <strong>Waste Source:</strong> ${wasteBatch.data.wasteSource}<br>
                        <strong>Collection Date:</strong> ${wasteBatch.data.collectionDate}<br>
                        <strong>Quantity:</strong> ${wasteBatch.data.quantity} kg<br>
                        <strong>Farmer:</strong> ${wasteBatch.data.farmer.name}<br>
                        <strong>Description:</strong> ${wasteBatch.data.description || 'No description'}
                    `;
                    wasteBatchInfo.style.display = 'block';
                    convertBtn.disabled = false;
                } else {
                    // Show available waste batches for debugging
                    const availableWaste = allTransactions.filter(tx =>
                        tx.data.type === 'waste-collection' &&
                        tx.data.availableForConversion === true
                    );

                    console.log('Available waste batches:', availableWaste);

                    let debugInfo = `<p style="color: red;">Waste batch "${wasteBatchId}" not found or already converted!</p>`;

                    if (allWasteTransactions.length > 0) {
                        debugInfo += `<p><strong>Found ${allWasteTransactions.length} transaction(s) with this ID:</strong></p>`;
                        allWasteTransactions.forEach(tx => {
                            debugInfo += `<p>Type: ${tx.data.type}, Available: ${tx.data.availableForConversion}, Status: ${tx.data.status || 'N/A'}</p>`;
                        });
                    }

                    debugInfo += `<p><strong>Available waste batches (${availableWaste.length}):</strong></p>`;
                    if (availableWaste.length > 0) {
                        debugInfo += `<ul>${availableWaste.map(tx => `<li>${tx.data.wasteBatchId} - ${tx.data.wasteSource} (${tx.data.quantity}kg)</li>`).join('')}</ul>`;
                        debugInfo += `<p><em>Copy and paste one of the above batch IDs to convert it.</em></p>`;
                    } else {
                        debugInfo += `<p><em>No waste batches available for conversion. Please record some waste first.</em></p>`;
                    }

                    wasteBatchDetails.innerHTML = debugInfo;
                    wasteBatchInfo.style.display = 'block';
                    convertBtn.disabled = true;
                }
            });

            // Form submission handler
            document.getElementById('waste-conversion-form').addEventListener('submit', function (e) {
                e.preventDefault();

                const wasteBatchId = document.getElementById('waste-batch-id').value;
                const productType = document.getElementById('product-type').value;
                const productName = document.getElementById('product-name').value;
                const conversionDate = document.getElementById('conversion-date').value;
                const outputQuantity = document.getElementById('output-quantity').value;
                const outputUnit = document.getElementById('output-unit').value;
                const manufacturerInfo = document.getElementById('manufacturer-info').value;

                // Verify waste batch exists and is available
                const allTransactions = getAllHerbTransactions();
                const wasteBatch = allTransactions.find(tx =>
                    tx.data.type === 'waste-collection' &&
                    tx.data.wasteBatchId === wasteBatchId &&
                    tx.data.availableForConversion
                );

                if (!wasteBatch) {
                    alert('Waste batch not found or already converted!');
                    return;
                }

                // Generate product ID
                const productId = 'ECO-PROD-' + Date.now();

                // Create conversion data object
                const conversionData = {
                    type: 'waste-conversion',
                    wasteBatchId: wasteBatchId,
                    productId: productId,
                    productName: productName,
                    productType: productType,
                    conversionDate: conversionDate,
                    outputQuantity: outputQuantity,
                    outputUnit: outputUnit,
                    manufacturerInfo: manufacturerInfo,
                    status: 'converted',
                    carbonSaved: calculateCarbonSaved(wasteBatch.data.quantity, productType)
                };

                // Add to blockchain
                addHerbTransaction(conversionData);

                // Mark waste batch as converted
                const updateWasteData = {
                    type: 'waste-update',
                    wasteBatchId: wasteBatchId,
                    status: 'converted',
                    convertedTo: productId,
                    availableForConversion: false
                };
                addHerbTransaction(updateWasteData);

                updateBlockchainVisualization();

                // Show success message
                alert(`Waste conversion recorded successfully! Product ID: ${productId}\nCarbon saved: ${conversionData.carbonSaved} kg CO₂`);

                // Reset form
                this.reset();
                document.getElementById('waste-batch-info').style.display = 'none';
                document.getElementById('convert-btn').disabled = true;

                // Update metrics
                updateWasteMetrics();
            });
            break;

        case 'history':
            loadWasteConversionHistory();
            break;
    }
}

function calculateCarbonSaved(wasteQuantity, productType) {
    // Simplified carbon calculation - in real system this would be more sophisticated
    const carbonFactors = {
        'plastic-plates': 2.5, // kg CO2 saved per kg of waste
        'biodegradable-bags': 1.8,
        'compost': 3.2,
        'animal-feed': 1.5,
        'biofuel': 4.1,
        'paper-products': 2.8
    };

    return Math.round((wasteQuantity * (carbonFactors[productType] || 2.0)) * 100) / 100;
}

function updateWasteMetrics() {
    const allTransactions = getAllHerbTransactions();
    const wasteCollections = allTransactions.filter(tx => tx.data.type === 'waste-collection');
    const wasteConversions = allTransactions.filter(tx => tx.data.type === 'waste-conversion');

    // Update metrics
    if (document.getElementById('total-waste')) {
        const totalWaste = wasteCollections.reduce((sum, tx) => sum + parseFloat(tx.data.quantity || 0), 0);
        document.getElementById('total-waste').textContent = totalWaste.toFixed(1);
    }

    if (document.getElementById('waste-converted')) {
        document.getElementById('waste-converted').textContent = wasteConversions.length;
    }

    if (document.getElementById('reusable-products')) {
        document.getElementById('reusable-products').textContent = wasteConversions.length;
    }

    if (document.getElementById('carbon-saved')) {
        const totalCarbon = wasteConversions.reduce((sum, tx) => sum + parseFloat(tx.data.carbonSaved || 0), 0);
        document.getElementById('carbon-saved').textContent = totalCarbon.toFixed(1);
    }
}

function loadWasteConversionHistory() {
    const container = document.getElementById('waste-tabs-content');

    const allTransactions = getAllHerbTransactions();
    const wasteConversions = allTransactions.filter(tx => tx.data.type === 'waste-conversion');

    if (wasteConversions.length === 0) {
        container.innerHTML = `
            <div class="herb-card">
                <h3>Conversion History</h3>
                <div class="empty-state">
                    <div class="empty-icon">♻️</div>
                    <h3>No Conversions Yet</h3>
                    <p>Start by converting waste into sustainable products.</p>
                    <button class="primary-btn" onclick="showWasteTab('convert')">Convert Waste</button>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="herb-card">
            <h3>Conversion History</h3>
            <div class="waste-history-grid">
    `;

    wasteConversions.reverse().forEach(tx => {
        const wasteBatch = allTransactions.find(w =>
            w.data.type === 'waste-collection' &&
            w.data.wasteBatchId === tx.data.wasteBatchId
        );

        html += `
            <div class="waste-conversion-card">
                <div class="card-header">
                    <div class="product-icon">♻️</div>
                    <div class="card-title">
                        <h4>${tx.data.productName}</h4>
                        <span class="product-id">ID: ${tx.data.productId}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="detail-row">
                        <span class="label">From Waste:</span>
                        <span class="value">${wasteBatch ? wasteBatch.data.wasteSource : 'Unknown'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Waste Quantity:</span>
                        <span class="value">${wasteBatch ? wasteBatch.data.quantity + ' kg' : 'Unknown'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Product Type:</span>
                        <span class="value">${tx.data.productType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Output:</span>
                        <span class="value">${tx.data.outputQuantity} ${tx.data.outputUnit}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Carbon Saved:</span>
                        <span class="value">${tx.data.carbonSaved} kg CO₂</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Converted:</span>
                        <span class="value">${tx.data.conversionDate}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Consumer Portal Helper Functions
function loadConsumerStats() {
    const allTransactions = getAllHerbTransactions();
    const herbProducts = allTransactions.filter(tx => tx.data.type === 'manufacturing');
    const wasteProducts = allTransactions.filter(tx => tx.data.type === 'waste-conversion');
    const totalCarbon = wasteProducts.reduce((sum, tx) => sum + parseFloat(tx.data.carbonSaved || 0), 0);

    document.getElementById('total-herb-products').textContent = herbProducts.length;
    document.getElementById('total-waste-products').textContent = wasteProducts.length;
    document.getElementById('total-carbon-saved').textContent = totalCarbon.toFixed(1);
}

function loadConsumerProducts() {
    const allTransactions = getAllHerbTransactions();
    const herbProducts = allTransactions.filter(tx => tx.data.type === 'manufacturing');
    const wasteProducts = allTransactions.filter(tx => tx.data.type === 'waste-conversion');

    // Load herb products
    const herbList = document.getElementById('herb-products-list');
    if (herbProducts.length === 0) {
        herbList.innerHTML = '<p class="empty-state">No herb-based products manufactured yet.</p>';
    } else {
        let html = '';
        herbProducts.reverse().forEach(tx => {
            html += `
                <div class="product-card">
                    <div class="card-header">
                        <div class="product-icon">🌿</div>
                        <div class="card-title">
                            <h4>${tx.data.productName}</h4>
                            <span class="product-id">ID: ${tx.data.productId}</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="detail-row">
                            <span class="label">Type:</span>
                            <span class="value">${tx.data.productType}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Manufactured:</span>
                            <span class="value">${tx.data.manufacturingDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Origin:</span>
                            <span class="value">Herb Manufacturing</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="primary-btn" onclick="traceProduct('${tx.data.productId}')">View Full Trace</button>
                    </div>
                </div>
            `;
        });
        herbList.innerHTML = html;
    }

    // Load waste products
    const wasteList = document.getElementById('waste-products-list');
    if (wasteProducts.length === 0) {
        wasteList.innerHTML = '<p class="empty-state">No waste-converted products yet.</p>';
    } else {
        let html = '';
        wasteProducts.reverse().forEach(tx => {
            const wasteBatch = allTransactions.find(w =>
                w.data.type === 'waste-collection' &&
                w.data.wasteBatchId === tx.data.wasteBatchId
            );

            html += `
                <div class="product-card">
                    <div class="card-header">
                        <div class="product-icon">♻️</div>
                        <div class="card-title">
                            <h4>${tx.data.productName}</h4>
                            <span class="product-id">ID: ${tx.data.productId}</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="detail-row">
                            <span class="label">Type:</span>
                            <span class="value">${tx.data.productType}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">From Waste:</span>
                            <span class="value">${wasteBatch ? wasteBatch.data.wasteSource : 'Unknown'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Carbon Saved:</span>
                            <span class="value">${tx.data.carbonSaved} kg CO₂</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Origin:</span>
                            <span class="value">Waste Conversion</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="primary-btn" onclick="traceProduct('${tx.data.productId}')">View Full Trace</button>
                    </div>
                </div>
            `;
        });
        wasteList.innerHTML = html;
    }
}

// DNA Banking Dashboard - Revolutionary Herb Preservation System
function loadDNABankingDashboard() {
    const container = document.getElementById('dashboard-container');
    container.innerHTML = `
        <div class="dashboard">
            <h2> DNA Banking & Regeneration</h2>
            <p class="dashboard-subtitle">Preserve Ayurvedic herb genetics forever - The world's first Herb Ark</p>

            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-number" id="dna-samples-stored">0</div>
                    <div class="stat-label">DNA Samples Banked</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="herbs-preserved">0</div>
                    <div class="stat-label">Herb Varieties Preserved</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="regeneration-fund">₹0</div>
                    <div class="stat-label">Regeneration Fund</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="extinction-threats">0</div>
                    <div class="stat-label">Species at Risk</div>
                </div>
            </div>

            <div class="dna-banking-tabs">
                <div class="tab-buttons">
                    <button class="tab-btn active" onclick="showDNATab('sequence')">DNA Sequencing</button>
                    <button class="tab-btn" onclick="showDNATab('bank')">DNA Banking</button>
                    <button class="tab-btn" onclick="showDNATab('regenerate')">Regeneration</button>
                    <button class="tab-btn" onclick="showDNATab('herb-ark')">Herb Ark</button>
                </div>

                <div id="dna-tabs-content">
                    <!-- Tab content will be loaded here -->
                </div>
            </div>
        </div>
    `;

    showDNATab('sequence');
    updateDNAMetrics();
}

// DNA Tab Navigation
function showDNATab(tabName) {
    const container = document.getElementById('dna-tabs-content');

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    switch (tabName) {
        case 'sequence':
            container.innerHTML = `
                <div class="herb-card">
                    <h3>🧬 DNA Sequencing Lab</h3>
                    <p>Extract and sequence DNA from premium herb batches for eternal preservation</p>

                    <div class="workflow-guide" style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196F3;">
                        <h4 style="margin: 0 0 10px 0; color: #1976D2;">📋 How to Get Premium Batch ID:</h4>
                        <ol style="margin: 0; padding-left: 20px;">
                            <li><strong>Step 1:</strong> Go to <em>Farmer Dashboard</em> → Create herb collection</li>
                            <li><strong>Step 2:</strong> Go to <em>Testing Lab</em> → Test the batch with these premium settings:</li>
                            <ul style="margin: 5px 0; padding-left: 20px;">
                                <li>Moisture: <strong>< 8%</strong> (enter 5.0 or 7.5)</li>
                                <li>Pesticides: <strong>"None Detected"</strong></li>
                                <li>Heavy Metals: <strong>"Within Safe Limits"</strong></li>
                                <li>Microbial: <strong>"Within Safe Limits"</strong></li>
                            </ul>
                            <li><strong>Step 3:</strong> Come back here and use the batch ID</li>
                        </ol>
                        <p style="margin: 10px 0 0 0; font-style: italic; color: #1976D2;">💡 Tip: Only batches that pass premium quality tests can be used for DNA banking!</p>
                    </div>
                    <form id="dna-sequencing-form">
                        <div class="form-group">
                            <label for="herb-batch-id">Herb Batch ID:</label>
                            <input type="text" id="herb-batch-id" required placeholder="Enter premium batch ID">
                            <button type="button" id="check-batch-quality">Check Quality</button>
                        </div>
                        <div id="batch-quality-info" style="display: none; margin: 15px 0; padding: 10px; background: #f0f8ff; border-radius: 5px;">
                            <h4>Batch Quality Assessment</h4>
                            <p id="quality-assessment"></p>
                        </div>
                        <div class="form-group">
                            <label for="sequencing-method">Sequencing Method:</label>
                            <select id="sequencing-method" required>
                                <option value="ngs">Next-Generation Sequencing (NGS)</option>
                                <option value="sanger">Sanger Sequencing</option>
                                <option value="nanopore">Nanopore Sequencing</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="sample-weight">Sample Weight (mg):</label>
                            <input type="number" id="sample-weight" min="1" max="1000" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label for="sequencing-notes">Notes:</label>
                            <textarea id="sequencing-notes" rows="3" placeholder="Special characteristics, growing conditions, etc."></textarea>
                        </div>
                        <button type="submit" id="sequence-btn">Extract DNA & Sequence</button>
                    </form>

                    <div id="sequencing-progress" style="display: none; margin: 20px 0;">
                        <h4>DNA Sequencing in Progress...</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill" style="width: 0%;"></div>
                        </div>
                        <p id="progress-text">Initializing sequencing...</p>
                    </div>

                    <div id="sequencing-result" style="display: none; margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 5px;">
                        <h4>✅ DNA Sequencing Complete!</h4>
                        <div id="dna-sequence-display"></div>
                    </div>
                </div>
            `;

            // Add batch quality check functionality
            document.getElementById('check-batch-quality').addEventListener('click', function () {
                const batchId = document.getElementById('herb-batch-id').value;
                if (!batchId) {
                    alert('Please enter a Batch ID');
                    return;
                }

                const batchInfo = document.getElementById('batch-quality-info');
                const qualityAssessment = document.getElementById('quality-assessment');

                if (!doesBatchExist(batchId)) {
                    // Show available batch IDs for debugging
                    const allTransactions = getAllHerbTransactions();
                    const collectionTransactions = allTransactions.filter(tx => tx.data.type === 'collection');
                    const availableBatchIds = collectionTransactions.map(tx => tx.data.batchId);

                    let debugMessage = '<span style="color: red;">Batch ID not found!</span>';
                    debugMessage += '<p><strong>Available batch IDs:</strong></p>';
                    if (availableBatchIds.length > 0) {
                        debugMessage += '<ul>';
                        availableBatchIds.forEach(id => {
                            debugMessage += `<li>${id} (copy and paste this)</li>`;
                        });
                        debugMessage += '</ul>';
                        debugMessage += '<p><em>Create a batch in the farmer dashboard, test it in the lab (ensure it passes with moisture < 8%, no pesticides, heavy metals within limits), then come back here.</em></p>';
                    } else {
                        debugMessage += '<p><em>No batches have been created yet. Start by creating a batch in the farmer dashboard.</em></p>';
                    }

                    qualityAssessment.innerHTML = debugMessage;
                    batchInfo.style.display = 'block';
                    return;
                }

                const transactions = getBatchHistory(batchId);
                const labTests = transactions.filter(tx => tx.data.type === 'lab-test');
                const collectionData = transactions.find(tx => tx.data.type === 'collection');

                if (labTests.length === 0) {
                    qualityAssessment.innerHTML = '<span style="color: orange;">This batch has not been tested yet.</span>';
                    batchInfo.style.display = 'block';
                    return;
                }

                const latestTest = labTests[labTests.length - 1];
                const isPremium = latestTest.data.testResult === 'pass' &&
                    parseFloat(latestTest.data.moisture) < 8 &&
                    latestTest.data.pesticides === 'none' &&
                    latestTest.data.heavyMetals === 'within-limits';

                if (isPremium) {
                    qualityAssessment.innerHTML = `
                        <span style="color: green; font-weight: bold;">⭐ PREMIUM QUALITY BATCH DETECTED!</span><br>
                        <strong>Herb:</strong> ${collectionData.data.herbType}<br>
                        <strong>Moisture:</strong> ${latestTest.data.moisture}%<br>
                        <strong>Quality Score:</strong> Exceptional<br>
                        <em>This batch qualifies for DNA banking and eternal preservation.</em>
                    `;
                } else {
                    qualityAssessment.innerHTML = `
                        <span style="color: orange;">Standard quality batch.</span><br>
                        <strong>Herb:</strong> ${collectionData.data.herbType}<br>
                        <strong>Moisture:</strong> ${latestTest.data.moisture}%<br>
                        <em>DNA banking recommended only for premium batches.</em>
                    `;
                }

                batchInfo.style.display = 'block';
            });

            // Form submission handler
            document.getElementById('dna-sequencing-form').addEventListener('submit', function (e) {
                e.preventDefault();

                const batchId = document.getElementById('herb-batch-id').value;
                const sequencingMethod = document.getElementById('sequencing-method').value;
                const sampleWeight = document.getElementById('sample-weight').value;
                const notes = document.getElementById('sequencing-notes').value;

                // Verify batch exists and is premium quality
                if (!doesBatchExist(batchId)) {
                    alert('Batch ID not found!');
                    return;
                }

                const transactions = getBatchHistory(batchId);
                const labTests = transactions.filter(tx => tx.data.type === 'lab-test');
                const collectionData = transactions.find(tx => tx.data.type === 'collection');

                if (labTests.length === 0) {
                    alert('This batch has not been tested. Please test it first.');
                    return;
                }

                const latestTest = labTests[labTests.length - 1];
                const isPremium = latestTest.data.testResult === 'pass' &&
                    parseFloat(latestTest.data.moisture) < 8 &&
                    latestTest.data.pesticides === 'none' &&
                    latestTest.data.heavyMetals === 'within-limits';

                if (!isPremium) {
                    alert('This batch does not meet premium quality standards for DNA banking.');
                    return;
                }

                // Start sequencing animation
                const progressBar = document.getElementById('sequencing-progress');
                const progressFill = document.getElementById('progress-fill');
                const progressText = document.getElementById('progress-text');
                const resultDiv = document.getElementById('sequencing-result');
                const sequenceDisplay = document.getElementById('dna-sequence-display');

                progressBar.style.display = 'block';
                resultDiv.style.display = 'none';

                // Simulate sequencing progress
                let progress = 0;
                const sequencingSteps = [
                    'Extracting DNA from sample...',
                    'Purifying genetic material...',
                    'Amplifying DNA sequences...',
                    'Running sequencing analysis...',
                    'Analyzing genetic markers...',
                    'Encoding cultivation data...',
                    'Finalizing DNA profile...'
                ];

                const interval = setInterval(() => {
                    progress += Math.random() * 15 + 5;
                    if (progress > 100) progress = 100;

                    progressFill.style.width = progress + '%';
                    const stepIndex = Math.floor((progress / 100) * sequencingSteps.length);
                    progressText.textContent = sequencingSteps[Math.min(stepIndex, sequencingSteps.length - 1)];

                    if (progress >= 100) {
                        clearInterval(interval);

                        // Generate DNA sequence data
                        const dnaSequence = generateDNASequence(collectionData, latestTest);
                        const dnaId = 'DNA-' + Date.now();

                        // Create DNA banking record
                        const dnaData = {
                            type: 'dna-sequencing',
                            dnaId: dnaId,
                            batchId: batchId,
                            herbType: collectionData.data.herbType,
                            sequencingMethod: sequencingMethod,
                            sampleWeight: sampleWeight,
                            dnaSequence: dnaSequence,
                            qualityMetrics: {
                                moisture: latestTest.data.moisture,
                                pesticides: latestTest.data.pesticides,
                                heavyMetals: latestTest.data.heavyMetals,
                                microbial: latestTest.data.microbial
                            },
                            cultivationData: {
                                location: collectionData.data.location,
                                farmer: collectionData.data.farmer,
                                collectionDate: collectionData.data.collectionDate,
                                soilConditions: 'Encoded in DNA metadata',
                                weatherPatterns: 'Historical data preserved'
                            },
                            notes: notes,
                            status: 'sequenced',
                            preservationLevel: 'eternal'
                        };

                        // Add to blockchain
                        addHerbTransaction(dnaData);
                        updateBlockchainVisualization();

                        // Display results
                        sequenceDisplay.innerHTML = `
                            <div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                                <strong>DNA ID:</strong> ${dnaId}<br>
                                <strong>Sequence Length:</strong> ${dnaSequence.length} base pairs<br>
                                <strong>Sample:</strong> ${dnaSequence.substring(0, 50)}...<br>
                                <strong>Preservation:</strong> <span style="color: green;">ETERNAL</span><br>
                            </div>
                            <p><em>This DNA sample is now preserved forever in the blockchain and can be used to regenerate this exact herb variety if needed.</em></p>
                            <button class="primary-btn" onclick="showDNATab('bank')">Proceed to DNA Banking</button>
                        `;

                        progressBar.style.display = 'none';
                        resultDiv.style.display = 'block';

                        // Update metrics
                        updateDNAMetrics();

                        alert(`DNA sequencing completed successfully! DNA ID: ${dnaId}\n\nThis herb variety is now preserved for eternity.`);
                    }
                }, 500);
            });
            break;

        case 'bank':
            loadDNABankingInterface();
            break;

        case 'regenerate':
            loadRegenerationInterface();
            break;

        case 'herb-ark':
            loadHerbArkInterface();
            break;
    }
}

// Generate simulated DNA sequence based on herb characteristics
function generateDNASequence(collectionData, testData) {
    const herbSignatures = {
        'ashwagandha': 'ATCGATCGATCG',
        'turmeric': 'GCTAGCTAGCTA',
        'tulsi': 'TATCTATCTATC',
        'amla': 'CGATCGATCGAT',
        'brahmi': 'AGCTAGCTAGCT'
    };

    const baseSequence = herbSignatures[collectionData.data.herbType] || 'ATCGATCGATCG';
    const qualityModifier = testData.data.testResult === 'pass' ? 'PREMIUM' : 'STANDARD';

    // Create a realistic-looking DNA sequence
    let sequence = baseSequence;
    for (let i = 0; i < 100; i++) {
        sequence += ['A', 'T', 'C', 'G'][Math.floor(Math.random() * 4)];
    }

    // Add metadata encoding
    sequence += '|' + btoa(JSON.stringify({
        herb: collectionData.data.herbType,
        quality: qualityModifier,
        location: collectionData.data.location,
        farmer: collectionData.data.farmer.name
    }));

    return sequence;
}

// DNA Banking Interface
function loadDNABankingInterface() {
    const container = document.getElementById('dna-tabs-content');

    const allTransactions = getAllHerbTransactions();
    const dnaSamples = allTransactions.filter(tx => tx.data.type === 'dna-sequencing');

    if (dnaSamples.length === 0) {
        container.innerHTML = `
            <div class="herb-card">
                <h3>DNA Banking Vault</h3>
                <div class="empty-state">
                    <div class="empty-icon">🧬</div>
                    <h3>No DNA Samples Yet</h3>
                    <p>Sequence some premium herb batches first to start banking DNA.</p>
                    <button class="primary-btn" onclick="showDNATab('sequence')">Start Sequencing</button>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="herb-card">
            <h3> DNA Banking Vault</h3>
            <p>Secure storage of sequenced DNA samples with eternal preservation guarantee</p>
            <div class="dna-samples-grid">
    `;

    dnaSamples.reverse().forEach(tx => {
        html += `
            <div class="dna-sample-card">
                <div class="card-header">
                    <div class="dna-icon"></div>
                    <div class="card-title">
                        <h4>${tx.data.herbType.charAt(0).toUpperCase() + tx.data.herbType.slice(1)}</h4>
                        <span class="dna-id">DNA: ${tx.data.dnaId}</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="detail-row">
                        <span class="label">Batch ID:</span>
                        <span class="value">${tx.data.batchId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sequencing:</span>
                        <span class="value">${tx.data.sequencingMethod}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Sample Weight:</span>
                        <span class="value">${tx.data.sampleWeight} mg</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Status:</span>
                        <span class="status-badge status-eternal">ETERNALLY PRESERVED</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="secondary-btn" onclick="viewDNASequence('${tx.data.dnaId}')">View Sequence</button>
                    <button class="primary-btn" onclick="initiateRegeneration('${tx.data.dnaId}')">Regenerate if Needed</button>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Regeneration Interface
function loadRegenerationInterface() {
    const container = document.getElementById('dna-tabs-content');

    const allTransactions = getAllHerbTransactions();
    const dnaSamples = allTransactions.filter(tx => tx.data.type === 'dna-sequencing');
    const extinctionAlerts = allTransactions.filter(tx => tx.data.type === 'extinction-alert');

    let html = `
        <div class="herb-card">
            <h3>🌱 Regeneration Chamber</h3>
            <p>Activate regeneration protocols when herb varieties face extinction threats</p>

            <div class="regeneration-controls">
                <h4>Global Extinction Monitoring</h4>
                <div class="extinction-alerts" id="extinction-alerts">
    `;

    if (extinctionAlerts.length === 0) {
        html += `
            <div class="alert-card info">
                <div class="alert-icon">ℹ️</div>
                <div class="alert-content">
                    <h5>No Extinction Threats Detected</h5>
                    <p>All tracked herb varieties are currently stable.</p>
                </div>
            </div>
        `;
    } else {
        extinctionAlerts.forEach(alert => {
            html += `
                <div class="alert-card danger">
                    <div class="alert-icon">🚨</div>
                    <div class="alert-content">
                        <h5>EXTINCTION ALERT: ${alert.data.herbType}</h5>
                        <p>${alert.data.threatDescription}</p>
                        <button class="primary-btn" onclick="activateRegeneration('${alert.data.herbType}')">Start Regeneration</button>
                    </div>
                </div>
            `;
        });
    }

    html += `
                </div>

                <div class="regeneration-form" style="margin: 30px 0;">
                    <h4>Manual Regeneration Request</h4>
                    <form id="regeneration-request-form">
                        <div class="form-group">
                            <label for="regeneration-reason">Regeneration Reason:</label>
                            <select id="regeneration-reason" required>
                                <option value="">Select Reason</option>
                                <option value="extinction">Species Extinction</option>
                                <option value="climate-change">Climate Change Impact</option>
                                <option value="demand-surge">High Demand Surge</option>
                                <option value="research">Research Purposes</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="target-dna-id">DNA Sample ID:</label>
                            <input type="text" id="target-dna-id" required placeholder="Enter DNA ID from bank">
                        </div>
                        <div class="form-group">
                            <label for="regeneration-quantity">Regeneration Quantity (kg):</label>
                            <input type="number" id="regeneration-quantity" min="1" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label for="funding-source">Funding Source:</label>
                            <select id="funding-source" required>
                                <option value="regeneration-fund">Regeneration Fund</option>
                                <option value="emergency-fund">Emergency Fund</option>
                                <option value="research-grant">Research Grant</option>
                            </select>
                        </div>
                        <button type="submit">Initiate Regeneration Protocol</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Form submission handler
    document.getElementById('regeneration-request-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const reason = document.getElementById('regeneration-reason').value;
        const dnaId = document.getElementById('target-dna-id').value;
        const quantity = document.getElementById('regeneration-quantity').value;
        const funding = document.getElementById('funding-source').value;

        // Verify DNA sample exists
        const allTransactions = getAllHerbTransactions();
        const dnaSample = allTransactions.find(tx =>
            tx.data.type === 'dna-sequencing' && tx.data.dnaId === dnaId
        );

        if (!dnaSample) {
            alert('DNA sample not found in the bank!');
            return;
        }

        // Create regeneration request
        const regenerationId = 'REGEN-' + Date.now();
        const regenerationData = {
            type: 'regeneration-request',
            regenerationId: regenerationId,
            dnaId: dnaId,
            herbType: dnaSample.data.herbType,
            reason: reason,
            quantity: quantity,
            fundingSource: funding,
            status: 'initiated',
            estimatedCost: calculateRegenerationCost(quantity, reason),
            timeline: '6-12 months'
        };

        // Add to blockchain
        addHerbTransaction(regenerationData);
        updateBlockchainVisualization();

        alert(`Regeneration protocol initiated!\n\nRegeneration ID: ${regenerationId}\nEstimated Cost: ₹${regenerationData.estimatedCost}\nTimeline: ${regenerationData.timeline}\n\nThis herb variety will be brought back from extinction!`);

        // Reset form
        this.reset();

        // Update metrics
        updateDNAMetrics();
    });
}

// Calculate regeneration cost
function calculateRegenerationCost(quantity, reason) {
    const baseCostPerKg = 50000; // ₹50,000 per kg for regeneration
    const reasonMultiplier = {
        'extinction': 1.5,
        'climate-change': 1.3,
        'demand-surge': 1.0,
        'research': 0.8
    };

    return Math.round(quantity * baseCostPerKg * (reasonMultiplier[reason] || 1.0));
}

// Herb Ark Interface
function loadHerbArkInterface() {
    const container = document.getElementById('dna-tabs-content');

    const allTransactions = getAllHerbTransactions();
    const dnaSamples = allTransactions.filter(tx => tx.data.type === 'dna-sequencing');
    const regenerationRequests = allTransactions.filter(tx => tx.data.type === 'regeneration-request');

    let html = `
        <div class="herb-card">
            <h3>🏛️ The Herb Ark</h3>
            <p>The world's first blockchain-based biodiversity preservation system</p>

            <div class="ark-stats">
                <div class="ark-stat">
                    <div class="stat-value">${dnaSamples.length}</div>
                    <div class="stat-label">Species Preserved</div>
                </div>
                <div class="ark-stat">
                    <div class="stat-value">${regenerationRequests.length}</div>
                    <div class="stat-label">Regeneration Events</div>
                </div>
                <div class="ark-stat">
                    <div class="stat-value">∞</div>
                    <div class="stat-label">Preservation Duration</div>
                </div>
            </div>

            <div class="ark-features">
                <h4>🛡️ Preservation Technologies</h4>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🧬</div>
                        <h5>DNA Sequencing</h5>
                        <p>Complete genetic blueprint storage with cultivation metadata</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⛓️</div>
                        <h5>Blockchain Security</h5>
                        <p>Quantum-resistant encryption ensures eternal data integrity</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🌱</div>
                        <h5>Synthetic Biology</h5>
                        <p>Regeneration using CRISPR and advanced tissue culture</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🌍</div>
                        <h5>Global Network</h5>
                        <p>Connected herb arks worldwide for maximum biodiversity coverage</p>
                    </div>
                </div>
            </div>

            <div class="ark-timeline">
                <h4>📚 Ark History</h4>
                <div class="timeline" id="ark-timeline">
    `;

    // Add timeline events
    const arkEvents = allTransactions.filter(tx =>
        ['dna-sequencing', 'regeneration-request', 'extinction-alert'].includes(tx.data.type)
    ).slice(-10).reverse();

    if (arkEvents.length === 0) {
        html += `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h5>Ark Foundation</h5>
                    <p>The Herb Ark was established to preserve Ayurvedic biodiversity forever.</p>
                    <small>${new Date().toLocaleDateString()}</small>
                </div>
            </div>
        `;
    } else {
        arkEvents.forEach(event => {
            let icon = '🧬';
            let title = 'DNA Sample Added';
            let description = '';

            switch (event.data.type) {
                case 'dna-sequencing':
                    icon = '🧬';
                    title = `${event.data.herbType} DNA Banked`;
                    description = `Premium ${event.data.herbType} sample sequenced and preserved eternally.`;
                    break;
                case 'regeneration-request':
                    icon = '🌱';
                    title = `Regeneration Initiated`;
                    description = `${event.data.herbType} regeneration protocol started due to: ${event.data.reason}`;
                    break;
                case 'extinction-alert':
                    icon = '🚨';
                    title = 'Extinction Alert';
                    description = `${event.data.herbType} faces extinction threat: ${event.data.threatDescription}`;
                    break;
            }

            html += `
                <div class="timeline-item">
                    <div class="timeline-marker">${icon}</div>
                    <div class="timeline-content">
                        <h5>${title}</h5>
                        <p>${description}</p>
                        <small>${new Date(event.timestamp).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
        });
    }

    html += `
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// DNA Metrics Update
function updateDNAMetrics() {
    const allTransactions = getAllHerbTransactions();
    const dnaSamples = allTransactions.filter(tx => tx.data.type === 'dna-sequencing');
    const regenerationRequests = allTransactions.filter(tx => tx.data.type === 'regeneration-request');
    const extinctionAlerts = allTransactions.filter(tx => tx.data.type === 'extinction-alert');

    // Update metrics
    if (document.getElementById('dna-samples-stored')) {
        document.getElementById('dna-samples-stored').textContent = dnaSamples.length;
    }

    if (document.getElementById('herbs-preserved')) {
        const uniqueHerbs = new Set(dnaSamples.map(tx => tx.data.herbType)).size;
        document.getElementById('herbs-preserved').textContent = uniqueHerbs;
    }

    if (document.getElementById('regeneration-fund')) {
        const totalFunded = regenerationRequests.reduce((sum, tx) => sum + (tx.data.estimatedCost || 0), 0);
        document.getElementById('regeneration-fund').textContent = `₹${totalFunded.toLocaleString()}`;
    }

    if (document.getElementById('extinction-threats')) {
        document.getElementById('extinction-threats').textContent = extinctionAlerts.length;
    }
}

// DNA Helper Functions
function viewDNASequence(dnaId) {
    const allTransactions = getAllHerbTransactions();
    const dnaSample = allTransactions.find(tx =>
        tx.data.type === 'dna-sequencing' && tx.data.dnaId === dnaId
    );

    if (dnaSample) {
        const sequence = dnaSample.data.dnaSequence;
        const displaySequence = sequence.length > 200 ? sequence.substring(0, 200) + '...' : sequence;

        alert(`DNA Sequence for ${dnaSample.data.dnaId}:\n\n${displaySequence}\n\nLength: ${sequence.length} base pairs\nPreservation: ETERNAL\n\nThis genetic code can regenerate the exact same herb variety forever!`);
    }
}

function initiateRegeneration(dnaId) {
    const reason = prompt('Enter regeneration reason (extinction/climate-change/demand-surge/research):');
    if (reason) {
        showDNATab('regenerate');
        setTimeout(() => {
            document.getElementById('regeneration-reason').value = reason;
            document.getElementById('target-dna-id').value = dnaId;
        }, 100);
    }
}

function activateRegeneration(herbType) {
    alert(`Regeneration protocol activated for ${herbType}!\n\nThis herb variety will be brought back from the brink of extinction using our DNA banking technology. The regeneration process will take 6-12 months and cost approximately ₹2,50,000.`);
}

// Add DNA Banking smart contract
function initializeDNABankingContract() {
    smartContracts.dnaBankingContract = new SmartContract('DNABankingContract', {
        storeDNASample: function (state, params) {
            const { dnaId, herbType, dnaSequence, qualityMetrics } = params;
            if (!state.dnaVault) state.dnaVault = {};

            state.dnaVault[dnaId] = {
                herbType,
                dnaSequence,
                qualityMetrics,
                storedDate: new Date().toISOString(),
                preservationStatus: 'eternal'
            };

            return {
                success: true,
                event: 'DNASampleStored',
                data: { dnaId, herbType }
            };
        },

        requestRegeneration: function (state, params) {
            const { dnaId, reason, quantity } = params;

            if (!state.dnaVault?.[dnaId]) {
                return { success: false, error: 'DNA sample not found' };
            }

            const cost = calculateRegenerationCost(quantity, reason);

            return {
                success: true,
                cost: cost,
                event: 'RegenerationRequested',
                data: { dnaId, reason, quantity, cost }
            };
        }
    });
}

// Initialize DNA banking contract
initializeDNABankingContract();

// Add extinction alert simulation (for demo)
function simulateExtinctionAlert() {
    const extinctionData = {
        type: 'extinction-alert',
        herbType: 'ashwagandha',
        threatDescription: 'Climate change has reduced natural habitat by 70%. Only 3 wild populations remain.',
        riskLevel: 'critical',
        recommendedAction: 'immediate-regeneration'
    };

    addHerbTransaction(extinctionData);
}

// Uncomment to simulate extinction alert (for demo purposes)
// setTimeout(simulateExtinctionAlert, 10000);

// Auto-refresh DNA metrics every 5 seconds
setInterval(() => {
    if (document.getElementById('dna-samples-stored')) {
        updateDNAMetrics();
    }
}, 5000);

// Auto-refresh smart contract data every 10 seconds
setInterval(() => {
    if (document.getElementById('smart-contracts')) {
        loadSmartContractData();
    }
}, 10000);

 
 / /   - - -   N e w   P h a s e   3   F e a t u r e s :   I n v e n t o r y   &   O r d e r s   - - - 
 
 
 
 f u n c t i o n   l o a d I n v e n t o r y D a s h b o a r d ( )   { 
 
         c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' d a s h b o a r d - c o n t a i n e r ' ) ; 
 
         c o n t a i n e r . i n n e r H T M L   =   ` 
 
                 < d i v   c l a s s = " d a s h b o a r d   s h a d c n - s t y l e " > 
 
                         < d i v   c l a s s = " p a g e - h e a d e r " > 
 
                                 < h 1 > I n v e n t o r y   M a n a g e m e n t < / h 1 > 
 
                                 < p   c l a s s = " p a g e - d e s c r i p t i o n " > T r a c k   r e a l - t i m e   s t o c k   l e v e l s   o f   m a n u f a c t u r e d   p r o d u c t s < / p > 
 
                         < / d i v > 
 
 
 
                         < d i v   c l a s s = " s t a t s - c a r d s " > 
 
                                 < d i v   c l a s s = " s t a t - c a r d " > 
 
                                         < d i v   c l a s s = " s t a t - n u m b e r "   i d = " i n v - t o t a l - p r o d u c t s " > 0 < / d i v > 
 
                                         < d i v   c l a s s = " s t a t - l a b e l " > T o t a l   S K U s < / d i v > 
 
                                 < / d i v > 
 
                                 < d i v   c l a s s = " s t a t - c a r d " > 
 
                                         < d i v   c l a s s = " s t a t - n u m b e r "   i d = " i n v - l o w - s t o c k " > 0 < / d i v > 
 
                                         < d i v   c l a s s = " s t a t - l a b e l " > L o w   S t o c k   A l e r t s < / d i v > 
 
                                 < / d i v > 
 
                         < / d i v > 
 
 
 
                         < d i v   c l a s s = " p r o d u c t s - g r i d "   i d = " i n v e n t o r y - g r i d " > 
 
                                 < ! - -   I n v e n t o r y   w i l l   b e   l o a d e d   h e r e   - - > 
 
                         < / d i v > 
 
                 < / d i v > 
 
         ` ; 
 
 
 
         l o a d I n v e n t o r y D a t a ( ) ; 
 
 
} 
 
 
 
 f u n c t i o n   l o a d I n v e n t o r y D a t a ( )   { 
 
         c o n s t   a l l T r a n s a c t i o n s   =   g e t A l l H e r b T r a n s a c t i o n s ( ) ; 
 
         c o n s t   m a n u f a c t u r i n g T r a n s a c t i o n s   =   a l l T r a n s a c t i o n s . f i l t e r ( t x   = >   t x . d a t a . t y p e   = = =   ' m a n u f a c t u r i n g ' ) ; 
 
         c o n s t   o r d e r T r a n s a c t i o n s   =   a l l T r a n s a c t i o n s . f i l t e r ( t x   = >   t x . d a t a . t y p e   = = =   ' o r d e r ' ) ; 
 
 
 
         / /   S i m p l e   m o c k   i n v e n t o r y   l o g i c :   E a c h   m a n u f a c t u r e d   p r o d u c t   a d d s   1 0 0   u n i t s   t o   i n v e n t o r y .   
 
         / /   O r d e r s   s u b t r a c t   f r o m   t h i s . 
 
         c o n s t   i n v e n t o r y   =   {  } ; 
 
 
 
         / /   A d d   s t o c k 
 
         m a n u f a c t u r i n g T r a n s a c t i o n s . f o r E a c h ( t x   = >   { 
 
                 c o n s t   p r o d I d   =   t x . d a t a . p r o d u c t I d ; 
 
                 i f   ( ! i n v e n t o r y [ p r o d I d ] )   { 
 
                         i n v e n t o r y [ p r o d I d ]   =   { 
 
                                 i d :   p r o d I d , 
 
                                 n a m e :   t x . d a t a . p r o d u c t N a m e , 
 
                                 t y p e :   t x . d a t a . p r o d u c t T y p e , 
 
                                 e x p i r y :   t x . d a t a . e x p i r y D a t e , 
 
                                 s t o c k :   1 0 0   / /   M o c k   s t a r t i n g   s t o c k 
 
                         
            } ; 
 
                 
        } 
 
         
    } ) ; 
 
 
 
         / /   S u b t r a c t   s t o c k   b a s e d   o n   o r d e r s 
 
         o r d e r T r a n s a c t i o n s . f o r E a c h ( t x   = >   { 
 
                 c o n s t   p r o d I d   =   t x . d a t a . p r o d u c t I d ; 
 
                 i f   ( i n v e n t o r y [ p r o d I d ] )   { 
 
                         i n v e n t o r y [ p r o d I d ] . s t o c k   - =   p a r s e I n t ( t x . d a t a . q u a n t i t y   | |   0 ) ; 
 
                 
        } 
 
         
    } ) ; 
 
 
 
         c o n s t   g r i d   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' i n v e n t o r y - g r i d ' ) ; 
 
         c o n s t   i n v A r r a y   =   O b j e c t . v a l u e s ( i n v e n t o r y ) ; 
 
 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' i n v - t o t a l - p r o d u c t s ' ) . t e x t C o n t e n t   =   i n v A r r a y . l e n g t h ; 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' i n v - l o w - s t o c k ' ) . t e x t C o n t e n t   =   i n v A r r a y . f i l t e r ( i   = >   i . s t o c k   <   2 0 ) . l e n g t h ; 
 
 
 
         i f   ( i n v A r r a y . l e n g t h   = = =   0 )   { 
 
                 g r i d . i n n e r H T M L   =   ` 
 
                         < d i v   c l a s s = " e m p t y - s t a t e " > 
 
                                 < d i v   c l a s s = " e m p t y - i c o n " > � x � < / d i v > 
 
                                 < h 3 > N o   I n v e n t o r y   Y e t < / h 3 > 
 
                                 < p > M a n u f a c t u r e   p r o d u c t s   f i r s t   t o   s e e   t h e m   i n   i n v e n t o r y . < / p > 
 
                                 < b u t t o n   c l a s s = " p r i m a r y - b t n "   o n c l i c k = " s h o w D a s h b o a r d ( ' m a n u f a c t u r e r ' ) " > G o   t o   M a n u f a c t u r e r   D a s h b o a r d < / b u t t o n > 
 
                         < / d i v > 
 
                 ` ; 
 
                 r e t u r n ; 
 
         
    } 
 
 
 
         l e t   h t m l   =   ' ' ; 
 
         i n v A r r a y . f o r E a c h ( i t e m   = >   { 
 
                 c o n s t   s t o c k S t a t u s   =   i t e m . s t o c k   >   5 0   ?   ' s u c c e s s '   :   ( i t e m . s t o c k   >   2 0   ?   ' w a r n i n g '   :   ' d a n g e r ' ) ; 
 
                 h t m l   + =   ` 
 
                         < d i v   c l a s s = " p r o d u c t - c a r d " > 
 
                                 < d i v   c l a s s = " c a r d - h e a d e r " > 
 
                                         < d i v   c l a s s = " p r o d u c t - i c o n " > $ { g e t P r o d u c t I c o n ( i t e m . t y p e ) } < / d i v > 
 
                                         < d i v   c l a s s = " c a r d - t i t l e " > 
 
                                                 < h 3 > $ { i t e m . n a m e } < / h 3 > 
 
                                                 < s p a n   c l a s s = " p r o d u c t - i d " > $ { i t e m . i d } < / s p a n > 
 
                                         < / d i v > 
 
                                 < / d i v > 
 
                                 < d i v   c l a s s = " c a r d - c o n t e n t " > 
 
                                         < d i v   c l a s s = " d e t a i l - r o w " > 
 
                                                 < s p a n   c l a s s = " l a b e l " > C u r r e n t   S t o c k : < / s p a n > 
 
                                                 < s p a n   c l a s s = " s t a t u s - b a d g e   s t a t u s - $ { s t o c k S t a t u s } " > $ { i t e m . s t o c k }   U n i t s < / s p a n > 
 
                                         < / d i v > 
 
                                         < d i v   c l a s s = " d e t a i l - r o w " > 
 
                                                 < s p a n   c l a s s = " l a b e l " > T y p e : < / s p a n > 
 
                                                 < s p a n   c l a s s = " v a l u e " > $ { i t e m . t y p e . c h a r A t ( 0 ) . t o U p p e r C a s e ( )   +   i t e m . t y p e . s l i c e ( 1 ) } < / s p a n > 
 
                                         < / d i v > 
 
                                         < d i v   c l a s s = " d e t a i l - r o w " > 
 
                                                 < s p a n   c l a s s = " l a b e l " > E x p i r y   D a t e : < / s p a n > 
 
                                                 < s p a n   c l a s s = " v a l u e " > $ { i t e m . e x p i r y } < / s p a n > 
 
                                         < / d i v > 
 
                                 < / d i v > 
 
                                 < d i v   c l a s s = " c a r d - f o o t e r " > 
 
                                         < b u t t o n   c l a s s = " s e c o n d a r y - b t n "   o n c l i c k = " s h o w D a s h b o a r d ( ' o r d e r s ' ) " > C r e a t e   O r d e r < / b u t t o n > 
 
                                 < / d i v > 
 
                         < / d i v > 
 
                 ` ; 
 
         
    } ) ; 
 
 
 
         g r i d . i n n e r H T M L   =   h t m l ; 
 
 
} 
 
 
 
 f u n c t i o n   l o a d O r d e r s D a s h b o a r d ( )   { 
 
         c o n s t   c o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' d a s h b o a r d - c o n t a i n e r ' ) ; 
 
         c o n t a i n e r . i n n e r H T M L   =   ` 
 
                 < d i v   c l a s s = " d a s h b o a r d " > 
 
                         < h 2 > B 2 B   O r d e r   M a n a g e m e n t < / h 2 > 
 
                         < d i v   c l a s s = " h e r b - c a r d " > 
 
                                 < h 3 > C r e a t e   N e w   O r d e r < / h 3 > 
 
                                 < f o r m   i d = " o r d e r - f o r m " > 
 
                                         < d i v   c l a s s = " f o r m - g r o u p " > 
 
                                                 < l a b e l   f o r = " o r d e r - p r o d u c t - i d " > P r o d u c t   I D : < / l a b e l > 
 
                                                 < s e l e c t   i d = " o r d e r - p r o d u c t - i d "   r e q u i r e d > 
 
                                                         < o p t i o n   v a l u e = " " > S e l e c t   a   P r o d u c t < / o p t i o n > 
 
                                                 < / s e l e c t > 
 
                                         < / d i v > 
 
                                         < d i v   c l a s s = " f o r m - g r o u p " > 
 
                                                 < l a b e l   f o r = " o r d e r - q u a n t i t y " > Q u a n t i t y   ( U n i t s ) : < / l a b e l > 
 
                                                 < i n p u t   t y p e = " n u m b e r "   i d = " o r d e r - q u a n t i t y "   m i n = " 1 "   r e q u i r e d > 
 
                                         < / d i v > 
 
                                         < d i v   c l a s s = " f o r m - g r o u p " > 
 
                                                 < l a b e l   f o r = " o r d e r - d i s t r i b u t o r " > D i s t r i b u t o r   N a m e : < / l a b e l > 
 
                                                 < i n p u t   t y p e = " t e x t "   i d = " o r d e r - d i s t r i b u t o r "   r e q u i r e d   p l a c e h o l d e r = " e . g . ,   W e l l n e s s   R e t a i l e r s   I n c . " > 
 
                                         < / d i v > 
 
                                         < d i v   c l a s s = " f o r m - g r o u p " > 
 
                                                 < l a b e l   f o r = " o r d e r - d e s t i n a t i o n " > D e s t i n a t i o n : < / l a b e l > 
 
                                                 < i n p u t   t y p e = " t e x t "   i d = " o r d e r - d e s t i n a t i o n "   r e q u i r e d   p l a c e h o l d e r = " e . g . ,   M u m b a i   C e n t r a l   W a r e h o u s e " > 
 
                                         < / d i v > 
 
                                         < b u t t o n   t y p e = " s u b m i t " > C r e a t e   O r d e r   &   S u b m i t   t o   B l o c k c h a i n < / b u t t o n > 
 
                                 < / f o r m > 
 
                         < / d i v > 
 
                         
 
                         < d i v   c l a s s = " h e r b - c a r d " > 
 
                                 < h 3 > R e c e n t   O r d e r s   &   F u l f i l l m e n t < / h 3 > 
 
                                 < d i v   i d = " o r d e r s - l i s t " > < / d i v > 
 
                         < / d i v > 
 
                 < / d i v > 
 
         ` ; 
 
 
 
         / /   P o p u l a t e   p r o d u c t s   d r o p d o w n 
 
         c o n s t   a l l T r a n s a c t i o n s   =   g e t A l l H e r b T r a n s a c t i o n s ( ) ; 
 
         c o n s t   m a n u f a c t u r i n g T r a n s a c t i o n s   =   a l l T r a n s a c t i o n s . f i l t e r ( t x   = >   t x . d a t a . t y p e   = = =   ' m a n u f a c t u r i n g ' ) ; 
 
         c o n s t   p r o d u c t S e l e c t   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r - p r o d u c t - i d ' ) ; 
 
 
 
         / /   G e t   u n i q u e   p r o d u c t s   ( s i m p l e   m a p   b y   I D ) 
 
         c o n s t   u n i q u e P r o d u c t s   =   {  } ; 
 
         m a n u f a c t u r i n g T r a n s a c t i o n s . f o r E a c h ( t x   = >   { 
 
                 u n i q u e P r o d u c t s [ t x . d a t a . p r o d u c t I d ]   =   t x . d a t a . p r o d u c t N a m e ; 
 
         
    } ) ; 
 
 
 
         O b j e c t . k e y s ( u n i q u e P r o d u c t s ) . f o r E a c h ( i d   = >   { 
 
                 c o n s t   o p t   =   d o c u m e n t . c r e a t e E l e m e n t ( ' o p t i o n ' ) ; 
 
                 o p t . v a l u e   =   i d ; 
 
                 o p t . t e x t C o n t e n t   =   ` $ { u n i q u e P r o d u c t s [ i d ] }   ( $ { i d } ) ` ; 
 
                 p r o d u c t S e l e c t . a p p e n d C h i l d ( o p t ) ; 
 
         
    } ) ; 
 
 
 
         / /   F o r m   s u b m i s s i o n 
 
         d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r - f o r m ' ) . a d d E v e n t L i s t e n e r ( ' s u b m i t ' ,   f u n c t i o n   ( e )   { 
 
                 e . p r e v e n t D e f a u l t ( ) ; 
 
 
 
                 c o n s t   p r o d I d   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r - p r o d u c t - i d ' ) . v a l u e ; 
 
                 c o n s t   q t y   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r - q u a n t i t y ' ) . v a l u e ; 
 
                 c o n s t   d i s t r i b u t o r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r - d i s t r i b u t o r ' ) . v a l u e ; 
 
                 c o n s t   d e s t i n a t i o n   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r - d e s t i n a t i o n ' ) . v a l u e ; 
 
                 c o n s t   o r d e r I d   =   ' O R D - '   +   D a t e . n o w ( ) ; 
 
 
 
                 c o n s t   o r d e r D a t a   =   { 
 
                         t y p e :   ' o r d e r ' , 
 
                         o r d e r I d :   o r d e r I d , 
 
                         p r o d u c t I d :   p r o d I d , 
 
                         q u a n t i t y :   q t y , 
 
                         d i s t r i b u t o r :   d i s t r i b u t o r , 
 
                         d e s t i n a t i o n :   d e s t i n a t i o n , 
 
                         s t a t u s :   ' p e n d i n g ' , 
 
                         d a t e :   n e w   D a t e ( ) . t o I S O S t r i n g ( ) 
 
                 
        } ; 
 
 
 
                 a d d H e r b T r a n s a c t i o n ( o r d e r D a t a ) ; 
 
                 i f   ( t y p e o f   u p d a t e B l o c k c h a i n V i s u a l i z a t i o n   = = =   ' f u n c t i o n ' )   u p d a t e B l o c k c h a i n V i s u a l i z a t i o n ( ) ; 
 
 
 
                 i f   ( w i n d o w . s h o w N o t i f i c a t i o n )   { 
 
                         w i n d o w . s h o w N o t i f i c a t i o n ( ` O r d e r   $ { o r d e r I d }   c r e a t e d   s u c c e s s f u l l y ! ` ,   ' s u c c e s s ' ) ; 
 
                 
        }   e l s e   { 
 
                         a l e r t ( ` O r d e r   c r e a t e d !   I D :   $ { o r d e r I d } ` ) ; 
 
                 
        } 
 
 
 
                 t h i s . r e s e t ( ) ; 
 
                 l o a d O r d e r s L i s t ( ) ; 
 
         
    } ) ; 
 
 
 
         l o a d O r d e r s L i s t ( ) ; 
 
 
} 
 
 
 
 f u n c t i o n   l o a d O r d e r s L i s t ( )   { 
 
         c o n s t   l i s t C o n t a i n e r   =   d o c u m e n t . g e t E l e m e n t B y I d ( ' o r d e r s - l i s t ' ) ; 
 
         i f   ( ! l i s t C o n t a i n e r )   r e t u r n ; 
 
 
 
         c o n s t   a l l T r a n s a c t i o n s   =   g e t A l l H e r b T r a n s a c t i o n s ( ) ; 
 
         c o n s t   o r d e r s   =   a l l T r a n s a c t i o n s . f i l t e r ( t x   = >   t x . d a t a . t y p e   = = =   ' o r d e r ' ) ; 
 
 
 
         i f   ( o r d e r s . l e n g t h   = = =   0 )   { 
 
                 l i s t C o n t a i n e r . i n n e r H T M L   =   ' < p > N o   o r d e r s   c r e a t e d   y e t . < / p > ' ; 
 
                 r e t u r n ; 
 
         
    } 
 
 
 
         l e t   h t m l   =   ' ' ; 
 
         o r d e r s . r e v e r s e ( ) . f o r E a c h ( t x   = >   { 
 
                 h t m l   + =   ` 
 
                         < d i v   c l a s s = " o r d e r - i t e m "   s t y l e = " b o r d e r :   1 p x   s o l i d   # e e e ;   p a d d i n g :   1 5 p x ;   m a r g i n - b o t t o m :   1 0 p x ;   b o r d e r - r a d i u s :   8 p x ; " > 
 
                                 < d i v   s t y l e = " d i s p l a y : f l e x ;   j u s t i f y - c o n t e n t : s p a c e - b e t w e e n ;   a l i g n - i t e m s : c e n t e r ; " > 
 
                                         < d i v > 
 
                                                 < h 4 > O r d e r :   $ { t x . d a t a . o r d e r I d } < / h 4 > 
 
                                                 < p > < s t r o n g > P r o d u c t   I D : < / s t r o n g >   $ { t x . d a t a . p r o d u c t I d }   |   < s t r o n g > Q t y : < / s t r o n g >   $ { t x . d a t a . q u a n t i t y } < / p > 
 
                                                 < p > < s t r o n g > T o : < / s t r o n g >   $ { t x . d a t a . d i s t r i b u t o r }   ( $ { t x . d a t a . d e s t i n a t i o n } ) < / p > 
 
                                                 < p > < s t r o n g > S t a t u s : < / s t r o n g >   < s p a n   c l a s s = " s t a t u s - b a d g e   s t a t u s - $ { t x . d a t a . s t a t u s   = = =   ' p e n d i n g '   ?   ' w a r n i n g '   :   ' s u c c e s s ' } " > $ { t x . d a t a . s t a t u s . t o U p p e r C a s e ( ) } < / s p a n > < / p > 
 
                                         < / d i v > 
 
                                         < d i v > 
 
                                                 $ { t x . d a t a . s t a t u s   = = =   ' p e n d i n g '   ? 
 
                                 ` < b u t t o n   c l a s s = " s e c o n d a r y - b t n "   o n c l i c k = " s h i p O r d e r ( ' $ { t x . d a t a . o r d e r I d } ' ) " > M a r k   a s   S h i p p e d < / b u t t o n > ` 
 
                                 :   ' ' 
    } 
 
                                         < / d i v > 
 
                                 < / d i v > 
 
                         < / d i v > 
 
                 ` ; 
 
         } ) ; 
 
 
 
         l i s t C o n t a i n e r . i n n e r H T M L   =   h t m l ; 
 
 } 
 
 
 
 / /   G l o b a l   f u n c t i o n   t o   u p d a t e   o r d e r   s t a t u s 
 
 w i n d o w . s h i p O r d e r   =   f u n c t i o n   ( o r d e r I d )   { 
 
         / /   T o   k e e p   i t   s i m p l e ,   w e   j u s t   c r e a t e   a   n e w   t r a n s a c t i o n   t h a t   u p d a t e s   t h e   s t a t e 
 
         / /   I n   a   r e a l   b l o c k c h a i n ,   w e ' d   u p d a t e   t h e   s t a t e   o f   t h e   e x i s t i n g   s m a r t   c o n t r a c t 
 
         c o n s t   a l l T r a n s a c t i o n s   =   g e t A l l H e r b T r a n s a c t i o n s ( ) ; 
 
         c o n s t   o r i g i n a l O r d e r T x   =   a l l T r a n s a c t i o n s . f i n d ( t x   = >   t x . d a t a . t y p e   = = =   ' o r d e r '   & &   t x . d a t a . o r d e r I d   = = =   o r d e r I d ) ; 
 
 
 
         i f   ( o r i g i n a l O r d e r T x )   { 
 
                 c o n s t   u p d a t e D a t a   =   {   . . . o r i g i n a l O r d e r T x . d a t a ,   s t a t u s :   ' s h i p p e d ' ,   u p d a t e D a t e :   n e w   D a t e ( ) . t o I S O S t r i n g ( )   } ; 
 
                 a d d H e r b T r a n s a c t i o n ( u p d a t e D a t a ) ; 
 
                 i f   ( t y p e o f   u p d a t e B l o c k c h a i n V i s u a l i z a t i o n   = = =   ' f u n c t i o n ' )   u p d a t e B l o c k c h a i n V i s u a l i z a t i o n ( ) ; 
 
                 i f   ( w i n d o w . s h o w N o t i f i c a t i o n )   w i n d o w . s h o w N o t i f i c a t i o n ( ` O r d e r   $ { o r d e r I d  }   m a r k e d   a s   s h i p p e d . ` ,   ' s u c c e s s ' ) ; 
 
                 l o a d O r d e r s L i s t ( ) ; 
 
         } 
 
 } 
 
 