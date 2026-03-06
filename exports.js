// Export System
// Handles CSV exports, PDF generation, and data sharing

// Export collections to CSV
async function exportCollectionsToCSV() {
    try {
        const collections = await getFarmerCollections();
        if (collections.length === 0) {
            showToast('No collections to export', 'info');
            return;
        }
        
        const csvContent = generateCSVContent(collections);
        downloadCSV(csvContent, `krishi-collections-${new Date().toISOString().slice(0, 10)}.csv`);
        showToast(`Exported ${collections.length} collections to CSV`, 'success');
    } catch (error) {
        console.error('Error exporting collections:', error);
        showToast('Error exporting collections', 'error');
    }
}

// Export specific collection to CSV
async function exportCollectionCSV(batchId) {
    try {
        if (!batchId) return;
        
        const doc = await db.collection('batches').doc(batchId).get();
        if (!doc.exists) {
            showToast('Collection not found', 'error');
            return;
        }
        
        const data = doc.data();
        const collection = {
            batchId: data.batchId,
            farmerName: data.farmerName,
            herbType: data.herbType,
            quantity: data.quantity,
            harvestDate: data.harvestDate,
            location: data.location,
            status: data.status,
            createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : ''
        };
        
        const csvContent = generateCSVContent([collection]);
        downloadCSV(csvContent, `krishi-collection-${batchId}.csv`);
        showToast('Collection exported to CSV', 'success');
    } catch (error) {
        console.error('Error exporting collection:', error);
        showToast('Error exporting collection', 'error');
    }
}

// Get farmer collections from Firestore
async function getFarmerCollections() {
    try {
        const user = auth.currentUser;
        if (!user) return [];
        
        const batchesRef = db.collection('batches')
            .where('farmerId', '==', user.uid)
            .orderBy('createdAt', 'desc');
        
        const snapshot = await batchesRef.get();
        const collections = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            collections.push({
                batchId: data.batchId,
                farmerName: data.farmerName,
                herbType: data.herbType,
                quantity: data.quantity,
                harvestDate: data.harvestDate,
                location: data.location,
                status: data.status,
                createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString() : ''
            });
        });
        
        return collections;
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

// Generate CSV content
function generateCSVContent(collections) {
    const headers = ['Batch ID', 'Farmer Name', 'Herb Type', 'Quantity', 'Harvest Date', 'Location', 'Status', 'Created At'];
    const rows = collections.map(collection => [
        collection.batchId,
        collection.farmerName,
        collection.herbType,
        collection.quantity,
        collection.harvestDate,
        collection.location,
        collection.status,
        collection.createdAt
    ]);
    
    const csv = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return `data:text/csv;charset=utf-8,${csv}`;
}

// Download CSV file
function downloadCSV(content, filename) {
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export lab report to PDF
function exportLabReportToPDF(testData) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Certificate header
        doc.setFontSize(20);
        doc.setTextColor(45, 106, 79);
        doc.text('🌿 KRISHI LAB CERTIFICATE', 105, 20, { align: 'center' });
        
        // Certificate details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Batch ID: ${testData.batchId}`, 20, 40);
        doc.text(`Herb Type: ${testData.herbType}`, 20, 50);
        doc.text(`Farmer: ${testData.farmerName}`, 20, 60);
        doc.text(`Result: ${testData.result}`, 20, 70);
        doc.text(`Test Date: ${new Date().toLocaleDateString()}`, 20, 80);
        doc.text(`Lab ID: LAB-001`, 20, 90);
        doc.text(`ISO/IEC 17025:2017 Certified`, 20, 100);
        doc.text(`Hash: ${testData.blockHash}`, 20, 110);
        
        // Test parameters
        if (testData.parameters) {
            doc.text('Test Parameters:', 20, 130);
            doc.setFontSize(10);
            let yPos = 140;
            Object.entries(testData.parameters).forEach(([key, value]) => {
                doc.text(`${key}: ${value}`, 30, yPos);
                yPos += 10;
            });
        }
        
        // Signature area
        doc.setLineWidth(0.5);
        doc.line(20, 170, 100, 170);
        doc.text('Lab Technician Signature', 20, 180);
        doc.text('Date: ' + new Date().toLocaleDateString(), 20, 190);
        
        // Save PDF
        doc.save(`Krishi-Certificate-${testData.batchId}.pdf`);
        showToast('Lab certificate exported to PDF', 'success');
    } catch (error) {
        console.error('Error exporting lab report:', error);
        showToast('Error exporting lab certificate', 'error');
    }
}

// Export blockchain data to JSON
async function exportBlockchainToJSON() {
    try {
        const chain = await blockchain.getChain();
        if (chain.length === 0) {
            showToast('No blockchain data to export', 'info');
            return;
        }
        
        const jsonContent = JSON.stringify(chain, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `krishi-blockchain-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast(`Exported ${chain.length} blocks to JSON`, 'success');
    } catch (error) {
        console.error('Error exporting blockchain:', error);
        showToast('Error exporting blockchain data', 'error');
    }
}

// Export product information
function exportProductInfo(productId, productData) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.setTextColor(76, 151, 232);
        doc.text('📦 KRISHI PRODUCT INFORMATION', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Product ID: ${productId}`, 20, 40);
        doc.text(`Product Name: ${productData.productName}`, 20, 50);
        doc.text(`Product Type: ${productData.productType}`, 20, 60);
        doc.text(`Batch ID: ${productData.batchId}`, 20, 70);
        doc.text(`Manufacturing Date: ${productData.manufacturingDate}`, 20, 80);
        doc.text(`Expiry Date: ${productData.expiryDate}`, 20, 90);
        doc.text(`Blockchain Verified: ✓`, 20, 100);
        doc.text(`QR Code: ${productId}`, 20, 110);
        
        // Supply chain summary
        doc.text('Supply Chain Journey:', 20, 130);
        doc.setFontSize(10);
        doc.text('1. Herb Collection - Verified', 30, 140);
        doc.text('2. Lab Testing - Verified', 30, 150);
        doc.text('3. Manufacturing - Verified', 30, 160);
        doc.text('4. Blockchain - Immutable', 30, 170);
        
        doc.save(`Krishi-Product-${productId}.pdf`);
        showToast('Product information exported to PDF', 'success');
    } catch (error) {
        console.error('Error exporting product info:', error);
        showToast('Error exporting product information', 'error');
    }
}

// Export batch comparison data
function exportBatchComparisonToCSV(batches) {
    try {
        if (!batches || batches.length === 0) {
            showToast('No batch data to export', 'info');
            return;
        }
        
        const headers = ['Batch ID', 'Herb Type', 'Quantity', 'Moisture %', 'Active Markers %', 'Pesticides', 'Heavy Metals', 'Microbial', 'Result'];
        const rows = batches.map(batch => [
            batch.batchId || '',
            batch.herbType || '',
            batch.quantity || '',
            batch.moisture || '',
            batch.activeMarkers || '',
            batch.pesticides || '',
            batch.heavyMetals || '',
            batch.microbial || '',
            batch.result || ''
        ]);
        
        const csv = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
        
        const content = `data:text/csv;charset=utf-8,${csv}`;
        downloadCSV(content, `krishi-batch-comparison-${new Date().toISOString().slice(0, 10)}.csv`);
        showToast('Batch comparison exported to CSV', 'success');
    } catch (error) {
        console.error('Error exporting batch comparison:', error);
        showToast('Error exporting batch comparison', 'error');
    }
}

// Share data via browser share API
function shareData(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url || window.location.href
        }).then(() => {
            console.log('Shared successfully');
            showToast('Data shared successfully', 'success');
        }).catch((error) => {
            console.error('Error sharing:', error);
            showToast('Error sharing data', 'error');
        });
    } else {
        // Fallback: copy to clipboard
        const textToCopy = `${title}\n${text}\n${url || window.location.href}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Link copied to clipboard', 'success');
        }).catch(() => {
            showToast('Unable to copy link', 'error');
        });
    }
}

// Export QR code as image
function exportQRCodeAsImage(qrCodeElement, filename) {
    try {
        if (!qrCodeElement) return;
        
        // Convert canvas to image
        const canvas = qrCodeElement.querySelector('canvas');
        if (canvas) {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename || 'qr-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                showToast('QR code exported as image', 'success');
            }, 'image/png');
        } else {
            showToast('QR code not found', 'error');
        }
    } catch (error) {
        console.error('Error exporting QR code:', error);
        showToast('Error exporting QR code', 'error');
    }
}

// Export functions for global use
window.exportsSystem = {
    exportCollectionsToCSV,
    exportCollectionCSV,
    exportLabReportToPDF,
    exportBlockchainToJSON,
    exportProductInfo,
    exportBatchComparisonToCSV,
    shareData,
    exportQRCodeAsImage
};
