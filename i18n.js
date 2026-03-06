// i18n.js - Internationalization for vaidyachain
// Supports: English, Hindi, Gujarati

const translations = {
    en: {
        // General
        appName: "vaidyachain",
        tagline: "Ayurvedic Herb Traceability",

        // Navigation
        features: "Features",
        howItWorks: "How It Works",
        about: "About",
        login: "Login",

        // Hero Section
        heroTitle: "Transparency from Farm to Formula",
        heroDescription: "Track your Ayurvedic herbs through every step of the supply chain with blockchain technology. Ensure authenticity, quality, and sustainability from source to shelf.",
        getStarted: "Get Started",
        learnMore: "Learn More",

        // Features
        whyChoosevaidyachain: "Why Choose vaidyachain?",
        blockchainPowered: "Blockchain Powered",
        blockchainDesc: "Immutable records ensure complete transparency and trust in the supply chain.",
        qrTracking: "QR Code Tracking",
        qrDesc: "Scan to instantly trace the complete journey of any Ayurvedic product.",
        qualityAssurance: "Quality Assurance",
        qualityDesc: "Laboratory testing integration ensures every product meets quality standards.",
        geoTracking: "Geographic Tracking",
        geoDesc: "GPS-enabled tracking from farm collection to final delivery.",
        multiStakeholder: "Multi-Stakeholder",
        multiDesc: "Connect farmers, labs, manufacturers, and consumers on one platform.",
        sustainability: "Sustainability",
        sustainDesc: "Monitor and promote sustainable sourcing practices across the supply chain.",

        // How It Works
        howItWorksTitle: "How It Works",
        farmCollection: "Farm Collection",
        farmCollectionDesc: "Farmers register herb collections with GPS location and batch details on the blockchain.",
        labTesting: "Lab Testing",
        labTestingDesc: "Quality labs test herbs for purity, potency, and contaminants.",
        manufacturing: "Manufacturing",
        manufacturingDesc: "Approved herbs are processed into products with complete traceability.",
        consumerAccess: "Consumer Access",
        consumerAccessDesc: "Consumers scan QR codes to verify authenticity and view complete history.",

        // Dashboards
        farmerDashboard: "Farmer Dashboard",
        labDashboard: "Testing Lab",
        manufacturerDashboard: "Manufacturer",
        wasteManagement: "Waste Management",
        smartContracts: "Smart Contracts",
        sustainabilityDashboard: "Sustainability",
        inventory: "Inventory",
        orders: "Orders",
        insurance: "Insurance",
        dnaBanking: "DNA Banking",
        consumerPortal: "Consumer Portal",

        // Forms
        tagNewHerb: "Tag New Herb Collection",
        herbType: "Herb Type",
        collectionDate: "Collection Date",
        quantity: "Quantity (kg)",
        location: "Location",
        submit: "Submit",
        cancel: "Cancel",

        // Chatbot
        chatbotTitle: "vaidyachain Assistant",
        chatbotPlaceholder: "Ask me anything about vaidyachain...",
        chatbotWelcome: "Hello! I'm your vaidyachain assistant. How can I help you today?",
        chatbotThinking: "Thinking...",

        // Status
        collected: "Collected",
        labApproved: "Lab Approved",
        labRejected: "Lab Rejected",
        manufactured: "Manufactured",

        // Common
        viewDetails: "View Details",
        back: "Back",
        search: "Search",
        filter: "Filter",
        export: "Export",
        refresh: "Refresh",

        // Herbs
        herbAshwagandha: "Ashwagandha",
        herbShatavari: "Shatavari",
        herbTulsi: "Tulsi",
        herbNeem: "Neem",
        herbAmla: "Amla",
        herbTurmeric: "Turmeric",
        herbBrahmi: "Brahmi",
        herbGiloy: "Giloy",

        // Farmer Features
        weatherAlerts: "Weather Alerts",
        priceDiscovery: "Market Rates",
        smsVerification: "SMS Verification",
        marketRate: "Current Market Rate",
        forecast: "5-Day Forecast",

        // Lab Features
        activeMarkers: "Active Markers",
        adulterants: "Adulterants",
        labCertification: "Lab Credentials",
        spectroscopy: "Spectroscopy Analysis",
        batchComparison: "Batch Comparison",
        generatePDF: "Generate PDF Report",

        // Manufacturer Features
        supplierManagement: "Supplier Management",
        productCatalog: "Product Catalog",
        analyticsDashboard: "Production Analytics",
        supplierRating: "Supplier Ratings",
        verifiedAuthentic: "Verified Authentic",

        // Consumer Features
        scanQR: "Scan QR Code",
        storeLocator: "Store Locator",
        authenticityBadge: "Authenticity Certificate",
        productGallery: "Product Gallery",
        MRP: "MRP Price",
    },

    hi: {
        // General
        appName: "वैद्याचेन",
        tagline: "आयुर्वेदिक जड़ी-बूटी ट्रेसिबिलिटी",

        // Navigation
        features: "विशेषताएं",
        howItWorks: "यह कैसे काम करता है",
        about: "के बारे में",
        login: "लॉग इन करें",

        // Hero Section
        heroTitle: "खेत से फॉर्मूला तक पारदर्शिता",
        heroDescription: "ब्लॉकचेन तकनीक के साथ आपकी आयुर्वेदिक जड़ी-बूटियों को आपूर्ति श्रृंखला के हर चरण में ट्रैक करें। स्रोत से शेल्फ तक प्रामाणिकता, गुणवत्ता और स्थिरता सुनिश्चित करें।",
        getStarted: "शुरू करें",
        learnMore: "और जानें",

        // Features
        whyChoosevaidyachain: "वैद्याचेन क्यों चुनें?",
        blockchainPowered: "ब्लॉकचेन संचालित",
        blockchainDesc: "अपरिवर्तनीय रिकॉर्ड आपूर्ति श्रृंखला में पूर्ण पारदर्शिता और विश्वास सुनिश्चित करते हैं।",
        qrTracking: "QR कोड ट्रैकिंग",
        qrDesc: "किसी भी आयुर्वेदिक उत्पाद की पूरी यात्रा को तुरंत ट्रैक करने के लिए स्कैन करें।",
        qualityAssurance: "गुणवत्ता आश्वासन",
        qualityDesc: "प्रयोगशाला परीक्षण एकीकरण सुनिश्चित करता है कि प्रत्येक उत्पाद गुणवत्ता मानकों को पूरा करता है।",
        geoTracking: "भौगोलिक ट्रैकिंग",
        geoDesc: "खेत से अंतिम डिलीवरी तक GPS-सक्षम ट्रैकिंग।",
        multiStakeholder: "मल्टी-हितधारक",
        multiDesc: "किसानों, प्रयोगशालाओं, निर्माताओं और उपभोक्ताओं को एक मंच पर जोड़ें।",
        sustainability: "स्थिरता",
        sustainDesc: "आपूर्ति श्रृंखला में सतत स्रोतिंग प्रथाओं की निगरानी और बढ़ावा दें।",

        // How It Works
        howItWorksTitle: "यह कैसे काम करता है",
        farmCollection: "खेत संग्रह",
        farmCollectionDesc: "किसान ब्लॉकचेन पर GPS स्थान और बैच विवरण के साथ जड़ी-बूटी संग्रह दर्ज करते हैं।",
        labTesting: "प्रयोगशाला परीक्षण",
        labTestingDesc: "गुणवत्ता प्रयोगशालाएं शुद्धता, शक्ति और संदूषकों के लिए जड़ी-बूटियों का परीक्षण करती हैं।",
        manufacturing: "निर्माण",
        manufacturingDesc: "स्वीकृत जड़ी-बूटियों को पूर्ण ट्रेसिबिलिटी के साथ उत्पादों में संसाधित किया जाता है।",
        consumerAccess: "उपभोक्ता पहुंच",
        consumerAccessDesc: "उपभोक्ता प्रामाणिकता सत्यापित करने और पूर्ण इतिहास देखने के लिए QR कोड स्कैन करते हैं।",

        // Dashboards
        farmerDashboard: "किसान डैशबोर्ड",
        labDashboard: "परीक्षण प्रयोगशाला",
        manufacturerDashboard: "निर्माता",
        wasteManagement: "अपशिष्ट प्रबंधन",
        smartContracts: "स्मार्ट अनुबंध",
        sustainabilityDashboard: "स्थिरता",
        inventory: "इन्वेंटरी",
        orders: "आदेश",
        insurance: "बीमा",
        dnaBanking: "DNA बैंकिंग",
        consumerPortal: "उपभोक्ता पोर्टल",

        // Forms
        tagNewHerb: "नई जड़ी-बूटी संग्रह टैग करें",
        herbType: "जड़ी-बूटी का प्रकार",
        collectionDate: "संग्रह तिथि",
        quantity: "मात्रा (किलो)",
        location: "स्थान",
        submit: "जमा करें",
        cancel: "रद्द करें",

        // Chatbot
        chatbotTitle: "वैद्याचेन सहायक",
        chatbotPlaceholder: "वैद्याचेन के बारे में कुछ भी पूछें...",
        chatbotWelcome: "नमस्ते! मैं आपका वैद्याचेन सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
        chatbotThinking: "सोच रहा है...",

        // Status
        collected: "एकत्रित",
        labApproved: "प्रयोगशाला स्वीकृत",
        labRejected: "प्रयोगशाला अस्वीकृत",
        manufactured: "निर्मित",

        // Common
        viewDetails: "विवरण देखें",
        back: "वापस",
        search: "खोजें",
        filter: "फ़िल्टर",
        export: "निर्यात",
        refresh: "रीफ्रेश",

        // Herbs
        herbAshwagandha: "अश्वगंधा",
        herbShatavari: "शतावरी",
        herbTulsi: "तुलसी",
        herbNeem: "नीम",
        herbAmla: "आंवला",
        herbTurmeric: "हल्दी",
        herbBrahmi: "ब्राह्मी",
        herbGiloy: "गिलोय",

        // Farmer Features
        weatherAlerts: "मौसम अलर्ट",
        priceDiscovery: "बाजार दर",
        smsVerification: "SMS सत्यापन",
        marketRate: "वर्तमान बाजार दर",
        forecast: "5-दिन का पूर्वानुमान",

        // Lab Features
        activeMarkers: "सक्रिय मार्कर",
        adulterants: "मिलावट",
        labCertification: "लैब क्रेडेंशियल",
        spectroscopy: "स्पेक्ट्रोस्कोपी विश्लेषण",
        batchComparison: "बैच तुलना",
        generatePDF: "PDF रिपोर्ट जनरेट करें",

        // Manufacturer Features
        supplierManagement: "आपूर्तिकर्ता प्रबंधन",
        productCatalog: "उत्पाद सूची",
        analyticsDashboard: "उत्पादन विश्लेषण",
        supplierRating: "आपूर्तिकर्ता रेटिंग",
        verifiedAuthentic: "प्रमाणित प्रामाणिक",

        // Consumer Features
        scanQR: "QR कोड स्कैन करें",
        storeLocator: "स्टोर लोकेटर",
        authenticityBadge: "प्रामाणिकता प्रमाणपत्र",
        productGallery: "उत्पाद गैलरी",
        MRP: "MRP मूल्य",
    },

    gu: {
        // General
        appName: "વૈદ્યાચૈન",
        tagline: "આયુર્વેદિક જડીબુટી ટ્રેસેબિલિટી",

        // Navigation
        features: "સુવિધાઓ",
        howItWorks: "તે કેવી રીતે કામ કરે છે",
        about: "વિશે",
        login: "લૉગિન",

        // Hero Section
        heroTitle: "ખેતરથી ફોર્મ્યુલા સુધી પારદર્શકતા",
        heroDescription: "બ્લોકચેન ટેક્નોલોજી સાથે તમારી આયુર્વેદિક જડીબુટીને સપ્લાય ચેઇનના દરેક પગલામાં ટ્રૅક કરો. સ્રોતથી શેલ્ફ સુધી સત્યાંગ, ગુણવત્તા અને સુસ્તતા સુનિશ્ચિત કરો.",
        getStarted: "શરૂ કરો",
        learnMore: "વધુ જાણો",

        // Features
        whyChoosevaidyachain: "વૈદ્યાચૈન કેમ પસંદ કરવું?",
        blockchainPowered: "બ્લોકચેન સક્ષમ",
        blockchainDesc: "અપરિવર્તનીય રેકોર્ડ્સ સપ્લાય ચેઇનમાં સંપૂર્ણ પારદર્શકતા અને વિશ્વાસ સુનિશ્ચિત કરે છે.",
        qrTracking: "QR કોડ ટ્રૅકિંગ",
        qrDesc: "કોઈપણ આયુર્વેદિક ઉત્પાદનની સંપૂર્ણ યાત્રાને તુરંત ટ્રૅક કરવા માટે સ્કેન કરો.",
        qualityAssurance: "ગુણવત્તા ખાતરી",
        qualityDesc: "લેબોરેટરી ટેસ્ટિંગ એકીકરણ સુનિશ્ચિત કરે છે કે દરેક ઉત્પાદન ગુણવત્તાના ધોરણોને પૂર્ણ કરે છે.",
        geoTracking: "ભૌગોલિક ટ્રૅકિંગ",
        geoDesc: "ખેતર સંગ્રહથી અંતિમ ડિલિવરી સુધી GPS-સક્ષમ ટ્રૅકિંગ.",
        multiStakeholder: "મલ્ટી-સ્ટેકહોલ્ડર",
        multiDesc: "ખેતરો, લૈબ, ઉત્પાદકો અને ગ્રાહકોને એક પ્લેટફોર્મ પર જોડો.",
        sustainability: "સુસ્તતા",
        sustainDesc: "સપ્લાય ચેઇનમાં ટકાઉ સોર્સિંગ પ્રથાઓની નિગરાની અને પ્રોત્સાહન આપો.",

        // How It Works
        howItWorksTitle: "તે કેવી રીતે કામ કરે છે",
        farmCollection: "ખેતર સંગ્રહ",
        farmCollectionDesc: "ખેતરો GPS સ્થાન અને બેચ વિગતો સાથે જડીબુટી સંગ્રહને બ્લોકચેન પર નોંધે છે.",
        labTesting: "લેબોરેટરી ટેસ્ટિંગ",
        labTestingDesc: "ગુણવત્તા લૈબ શુદ્ધતા, શક્તિ અને પ્રદૂષકો માટે જડીબુટીનું પરીક્ષણ કરે છે.",
        manufacturing: "ઉત્પાદન",
        manufacturingDesc: "મંજૂર થયેલ જડીબુટીઓને સંપૂર્ણ ટ્રેસેબિલિટી સાથે ઉત્પાદનોમાં પ્રોસેસ કરવામાં આવે છે.",
        consumerAccess: "ગ્રાહક પ્રવેશ",
        consumerAccessDesc: "ગ્રાહકો QR કોડ સ્કેન કરીને પ્રમાણિતતા ચકાસે છે અને સંપૂર્ણ ઇતિહાસ જુએ છે.",

        // Dashboards
        farmerDashboard: "ખેતર ડૅશબોર્ડ",
        labDashboard: "ટેસ્ટિંગ લૈબ",
        manufacturerDashboard: "ઉત્પાદક",
        wasteManagement: "અપશિષ્ટ પ્રબંધન",
        smartContracts: "સ્માર્ટ કોન્ટ્રાક્ટ",
        sustainabilityDashboard: "સુસ્તતા",
        inventory: "ઈન્વેન્ટરી",
        orders: "ઓર્ડર",
        insurance: "વીમો",
        dnaBanking: "DNA બૅન્કિંગ",
        consumerPortal: "ગ્રાહક પોર્ટલ",

        // Forms
        tagNewHerb: "નવી જડીબુટી સંગ્રહ ટૅગ કરો",
        herbType: "જડીબુટીનો પ્રકાર",
        collectionDate: "સંગ્રહ તારીખ",
        quantity: "જથ્થો (કિ.ગ્રા.)",
        location: "સ્થાન",
        submit: "સબમિટ",
        cancel: "રદ કરો",

        // Chatbot
        chatbotTitle: "વૈદ્યાચૈન સહાયક",
        chatbotPlaceholder: "વૈદ્યાચૈન વિશે કંઈપણ પૂછો...",
        chatbotWelcome: "નમસ્તે! હું તમારો વૈદ્યાચૈન સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?",
        chatbotThinking: "વિચાર કરી રહ્યો છું...",

        // Status
        collected: "એકત્રિત",
        labApproved: "લૈબ મંજૂર",
        labRejected: "લૈબ નમંજૂર",
        manufactured: "ઉત્પાદિત",

        // Common
        viewDetails: "વિગતો જુઓ",
        back: "પાછું",
        search: "શોધ",
        filter: "ફિલ્ટર",
        export: "નિકાસ",
        refresh: "રિફ્રેશ",

        // Herbs
        herbAshwagandha: "અશ્વગંધા",
        herbShatavari: "શતાવરી",
        herbTulsi: "તુલસી",
        herbNeem: "લીમડો",
        herbAmla: "આમળા",
        herbTurmeric: "હળદર",
        herbBrahmi: "બ્રાહ્મી",
        herbGiloy: "ગિલોય",

        // Farmer Features
        weatherAlerts: "હવામાન ચેતવણીઓ",
        priceDiscovery: "બજારના ભાવ",
        smsVerification: "SMS વેરિફિકેશન",
        marketRate: "વર્તમાન બજાર ભાવ",
        forecast: "5-દિવસની આગાહી",

        // Lab Features
        activeMarkers: "સક્રિય માર્કર્સ",
        adulterants: "ભેળસેળ",
        labCertification: "લેબ પ્રમાણપત્રો",
        spectroscopy: "સ્પેક્ટ્રોસ્કોપી વિશ્લેષણ",
        batchComparison: "બેચ સરખામણી",
        generatePDF: "PDF રિપોર્ટ બનાવો",

        // Manufacturer Features
        supplierManagement: "સપ્લાયર મેનેજમેન્ટ",
        productCatalog: "પ્રોડક્ટ કેટલોગ",
        analyticsDashboard: "ઉત્પાદન વિશ્લેષણ",
        supplierRating: "સપ્લાયર રેટિંગ્સ",
        verifiedAuthentic: "ચકાસાયેલ અધિકૃત",

        // Consumer Features
        scanQR: "QR કોડ સ્કેન કરો",
        storeLocator: "સ્ટોર લોકેટર",
        authenticityBadge: "પ્રમાણિકતા પ્રમાણપત્ર",
        productGallery: "પ્રોડક્ટ ગેલેરી",
        MRP: "MRP કિંમત",
    }
};

// Current language
let currentLanguage = localStorage.getItem('vaidyachain_language') || 'en';

// Get translation
function t(key) {
    const lang = translations[currentLanguage] || translations.en;
    return lang[key] || translations.en[key] || key;
}

// Set language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('vaidyachain_language', lang);
        updatePageTranslations();
        return true;
    }
    return false;
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Update all translations on the page
function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    // Update titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.title = t(key);
    });

    // Dispatch custom event for components that need manual updates
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}

// Make functions available globally
window.t = t;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.translations = translations;
