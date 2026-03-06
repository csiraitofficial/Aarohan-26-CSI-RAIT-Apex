// exports.js
// Utility functions to export data to CSV

class DataExporter {
    /**
     * Convert an array of objects to a CSV string
     */
    static convertToCSV(data) {
        if (!data || !data.length) return '';

        // Flatten nested objects for CSV
        const flattenObject = (obj, prefix = '') => {
            return Object.keys(obj).reduce((acc, k) => {
                const pre = prefix.length ? prefix + '_' : '';
                if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
                    Object.assign(acc, flattenObject(obj[k], pre + k));
                } else {
                    acc[pre + k] = obj[k];
                }
                return acc;
            }, {});
        };

        const flatData = data.map(item => flattenObject(item));
        const headers = Object.keys(flatData[0]);

        const csvRows = [];
        // Add headers
        csvRows.push(headers.join(','));

        // Add rows
        for (const row of flatData) {
            const values = headers.map(header => {
                const val = row[header] === null || row[header] === undefined ? '' : row[header];
                // Escape quotes and commas
                const escaped = ('' + val).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    }

    /**
     * Trigger a file download in the browser
     */
    static downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Export blockchain transactions of a specific type
     */
    static exportTransactions(type, filenamePrefix) {
        // Find existing global function
        if (typeof getAllHerbTransactions !== 'function') {
            console.error("Blockchain simulator not loaded");
            if (window.showNotification) window.showNotification('Data not accessible', 'error');
            return;
        }

        const allTransactions = getAllHerbTransactions();
        let targetData = allTransactions.map(tx => {
            return {
                id: tx.id,
                timestamp: new Date(tx.timestamp).toISOString(),
                hash: tx.hash,
                previousHash: tx.previousHash,
                ...tx.data
            };
        });

        if (type) {
            targetData = targetData.filter(item => item.type === type);
        }

        if (targetData.length === 0) {
            if (window.showNotification) window.showNotification('No data to export', 'info');
            return;
        }

        const csv = this.convertToCSV(targetData);
        const filename = `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`;

        this.downloadCSV(csv, filename);
        if (window.showNotification) window.showNotification(`Exported ${targetData.length} records successfully`, 'success');
    }
}

// Attach globally for inline HTML handlers
window.DataExporter = DataExporter;
