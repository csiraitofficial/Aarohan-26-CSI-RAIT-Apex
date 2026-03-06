// Initialization of i18next
document.addEventListener('DOMContentLoaded', () => {
    i18next.init({
        lng: localStorage.getItem('krishi-lang') || 'en',
        resources: {
            en: { translation: { 
                "app_title": "Krishi Platform",
                "nav_farmer": "Farmer",
                "nav_lab": "Lab",
                "nav_manufacturer": "Manufacturer",
                "nav_consumer": "Consumer",
                "nav_admin": "Admin",
                "nav_blockchain": "Blockchain",
                "search_placeholder": "Search batches, herbs, etc..."
            }},
            hi: { translation: { 
                "app_title": "कृषि मंच",
                "nav_farmer": "किसान",
                "nav_lab": "प्रयोगशाला",
                "nav_manufacturer": "निर्माता",
                "nav_consumer": "उपभोक्ता",
                "nav_admin": "प्रशासक",
                "nav_blockchain": "ब्लॉकचेन",
                "search_placeholder": "बैच, जड़ी-बूटियाँ खोजें..."
            }},
            gu: { translation: { 
                "app_title": "કૃષિ પ્લેટફોર્મ",
                "nav_farmer": "ખેડૂત",
                "nav_lab": "પ્રયોગશાળા",
                "nav_manufacturer": "ઉત્પાદક",
                "nav_consumer": "ગ્રાહક",
                "nav_admin": "વહીવટકર્તા",
                "nav_blockchain": "બ્લોકચેન",
                "search_placeholder": "બેચ, જડીબુટ્ટીઓ શોધો..."
            }},
            mr: { translation: { 
                "app_title": "कृषी प्लॅटफॉर्म",
                "nav_farmer": "शेतकरी",
                "nav_lab": "प्रयोगशाळा",
                "nav_manufacturer": "उत्पादक",
                "nav_consumer": "ग्राहक",
                "nav_admin": "प्रशासक",
                "nav_blockchain": "ब्लॉकचेन",
                "search_placeholder": "बॅचेस, औषधी वनस्पती शोधा..."
            }}
        }
    }, (err, t) => {
        if (err) return console.error('i18next init error', err);
        applyTranslations();
    });
});

function applyTranslations() {
    // Update simple text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(key) el.textContent = i18next.t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if(key) el.setAttribute('placeholder', i18next.t(key));
    });

    // Update document title
    document.title = i18next.t('app_title');
}

// Function to handle language switching globally
window.changeLanguage = function(langCode) {
    if (i18next) {
        i18next.changeLanguage(langCode, (err, t) => {
            if (err) return console.error('change language error', err);
            localStorage.setItem('krishi-lang', langCode);
            applyTranslations();
            
            // Also trigger the app.js specific visual update
            if(window.krishiApp && typeof window.krishiApp.updateLanguageIndicator === 'function') {
               window.krishiApp.updateLanguageIndicator();
            }

            // Reload the page to ensure third party modules like chartjs labels re-render properly if needed
            // location.reload();
        });
    }
};