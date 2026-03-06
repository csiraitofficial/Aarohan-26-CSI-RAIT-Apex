// exports.js
// CSV, PDF, JSON export utilities

const KrishiExports = {

  exportBatchesToCSV(batches) {
    if (!batches || batches.length === 0) {
      showToast('No batches to export', 'warning');
      return;
    }

    const headers = ['Batch ID', 'Farmer', 'Herb Type', 'Quantity (kg)',
      'Harvest Date', 'Status', 'GPS Latitude', 'GPS Longitude', 'Created'];

    const rows = batches.map(b => [
      b.batchId, b.farmerName, b.herbType, b.quantity,
      b.harvestDate, b.status,
      b.gps?.lat || '', b.gps?.lng || '',
      new Date(b.timestamp).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    this.downloadFile(csv, `krishi-batches-${Date.now()}.csv`, 'text/csv');
    showToast('📄 CSV exported successfully', 'success');
  },

  exportLabReportPDF(testData, batchData) {
    if (typeof window.jspdf === 'undefined') {
      showToast('PDF library not loaded', 'error');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFillColor(45, 106, 79);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('KRISHI LAB CERTIFICATE', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Blockchain-Powered Quality Assurance', 105, 28, { align: 'center' });

    // Body
    doc.setTextColor(27, 27, 47);
    doc.setFontSize(12);
    let y = 55;

    const addLine = (label, value) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont(undefined, 'normal');
      doc.text(String(value), 80, y);
      y += 10;
    };

    addLine('Batch ID', batchData.batchId);
    addLine('Herb Type', batchData.herbType);
    addLine('Farmer', batchData.farmerName);
    addLine('Quantity', `${batchData.quantity} kg`);
    addLine('Test Date', new Date(testData.timestamp).toLocaleDateString());

    y += 5;
    doc.setDrawColor(45, 106, 79);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('TEST PARAMETERS', 20, y);
    y += 10;

    doc.setFontSize(11);
    if (testData.details) {
      testData.details.forEach(detail => {
        const status = detail.status === 'PASS' ? '✓ PASS' : '✗ FAIL';
        doc.setFont(undefined, 'normal');
        doc.text(`${detail.param}: ${detail.value}`, 25, y);
        const [r, g, b] = detail.status === 'PASS' ? [87, 204, 153] : [230, 57, 70];
        doc.setTextColor(r, g, b);
        doc.text(status, 160, y);
        doc.setTextColor(27, 27, 47);
        y += 8;
      });
    }

    y += 10;
    doc.setDrawColor(45, 106, 79);
    doc.line(20, y, 190, y);
    y += 10;

    // Result
    const resultColor = testData.result === 'PASS' ? [87, 204, 153] : [230, 57, 70];
    doc.setFillColor(...resultColor);
    doc.roundedRect(60, y, 90, 20, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`RESULT: ${testData.result}`, 105, y + 13, { align: 'center' });

    y += 35;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('ISO/IEC 17025:2017 Certified Laboratory', 105, y, { align: 'center' });
    doc.text(`Block Hash: ${testData.blockHash || 'N/A'}`, 105, y + 6, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, y + 12, { align: 'center' });

    doc.save(`Krishi-Certificate-${batchData.batchId}.pdf`);
    showToast('📄 PDF certificate generated', 'success');
  },

  exportBlockchainJSON() {
    const chainData = localStorage.getItem('krishi-blockchain');
    if (!chainData) {
      showToast('No blockchain data to export', 'warning');
      return;
    }

    const formatted = JSON.stringify(JSON.parse(chainData), null, 2);
    this.downloadFile(formatted, `krishi-blockchain-${Date.now()}.json`, 'application/json');
    showToast('⛓️ Blockchain exported as JSON', 'success');
  },

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

console.log('📤 Export system ready');