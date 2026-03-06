// Internationalization System
// Provides multilingual support for the Krishi platform

// Language configuration
const I18N_CONFIG = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'hi', 'gu', 'mr'],
  currentLanguage: 'en'
};

// Translation dictionaries
const TRANSLATIONS = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.farmer': 'Farmer',
    'nav.lab': 'Lab',
    'nav.manufacturer': 'Manufacturer',
    'nav.consumer': 'Consumer',
    'nav.admin': 'Admin',
    'nav.blockchain': 'Blockchain',
    'nav.search': 'Search',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Dashboard titles
    'dashboard.farmer': 'Farmer Dashboard',
    'dashboard.lab': 'Lab Testing Dashboard',
    'dashboard.manufacturer': 'Manufacturer Dashboard',
    'dashboard.consumer': 'Consumer Portal',
    'dashboard.admin': 'Admin Dashboard',
    'dashboard.blockchain': 'Blockchain Explorer',
    
    // Forms
    'form.farmer_name': 'Farmer Name',
    'form.herb_type': 'Herb Type',
    'form.quantity': 'Quantity (kg)',
    'form.harvest_date': 'Harvest Date',
    'form.location': 'Location',
    'form.capture_location': 'Capture GPS Location',
    'form.submit': 'Submit',
    'form.batch_id': 'Batch ID',
    'form.select_batch': 'Select Batch',
    'form.moisture': 'Moisture (%)',
    'form.active_markers': 'Active Markers (%)',
    'form.pesticides': 'Pesticides',
    'form.adulterants': 'Adulterants',
    'form.heavy_metals': 'Heavy Metals',
    'form.microbial': 'Microbial Count',
    'form.product_name': 'Product Name',
    'form.product_type': 'Product Type',
    'form.mfg_date': 'Manufacturing Date',
    'form.expiry_date': 'Expiry Date',
    'form.product_id': 'Product ID',
    'form.trace_product': 'Trace Product',
    'form.scan_qr': 'Scan QR Code',
    
    // Herb types
    'herb.ashwagandha': 'Ashwagandha',
    'herb.tulsi': 'Tulsi',
    'herb.neem': 'Neem',
    'herb.turmeric': 'Turmeric',
    'herb.amla': 'Amla',
    'herb.ginseng': 'Ginseng',
    'herb.brahmi': 'Brahmi',
    'herb.shatavari': 'Shatavari',
    
    // Product types
    'product.powder': 'Powder',
    'product.capsule': 'Capsule',
    'product.tablet': 'Tablet',
    'product.extract': 'Extract',
    'product.oil': 'Oil',
    
    // Status
    'status.pass': 'PASS',
    'status.fail': 'FAIL',
    'status.pending': 'PENDING',
    'status.approved': 'APPROVED',
    'status.rejected': 'REJECTED',
    
    // Messages
    'msg.collection_success': 'Herb collection tagged successfully!',
    'msg.lab_test_completed': 'Lab test completed!',
    'msg.product_created': 'Product created successfully!',
    'msg.trace_completed': 'Product trace completed!',
    'msg.blockchain_verified': 'Verified on Krishi Blockchain',
    'msg.location_captured': 'GPS location captured successfully!',
    'msg.qr_generated': 'QR code generated successfully!',
    
    // Blockchain
    'blockchain.chain_length': 'Chain Length',
    'blockchain.block_type': 'Block Type',
    'blockchain.timestamp': 'Timestamp',
    'blockchain.hash': 'Hash',
    'blockchain.previous_hash': 'Previous Hash',
    'blockchain.data': 'Data',
    'blockchain.search': 'Search Blockchain',
    'blockchain.results': 'Search Results',
    
    // Smart contracts
    'contract.payment': 'Payment Contract',
    'contract.insurance': 'Insurance Contract',
    'contract.quality': 'Quality Contract',
    'contract.supply_chain': 'Supply Chain Contract',
    'contract.executed': 'Contract executed successfully',
    
    // Notifications
    'notification.new_collection': 'New herb collection added',
    'notification.lab_result': 'Lab test result available',
    'notification.payment_released': 'Payment released to farmer',
    'notification.claim_submitted': 'Insurance claim submitted',
    
    // Help
    'help.welcome': 'Welcome to Krishi Platform',
    'help.collection': 'Tag herb collections with GPS location',
    'help.lab': 'Perform quality testing on herb batches',
    'help.manufacturing': 'Create products from approved batches',
    'help.trace': 'Trace product journey from farm to formula',
    'help.blockchain': 'View immutable blockchain records'
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.farmer': 'किसान',
    'nav.lab': 'प्रयोगशाला',
    'nav.manufacturer': 'निर्माता',
    'nav.consumer': 'उपभोक्ता',
    'nav.admin': 'प्रशासक',
    'nav.blockchain': 'ब्लॉकचेन',
    'nav.search': 'खोज',
    'nav.notifications': 'सूचनाएं',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉग आउट',
    
    // Dashboard titles
    'dashboard.farmer': 'किसान डैशबोर्ड',
    'dashboard.lab': 'प्रयोगशाला परीक्षण डैशबोर्ड',
    'dashboard.manufacturer': 'निर्माता डैशबोर्ड',
    'dashboard.consumer': 'उपभोक्ता पोर्टल',
    'dashboard.admin': 'प्रशासक डैशबोर्ड',
    'dashboard.blockchain': 'ब्लॉकचेन एक्सप्लोरर',
    
    // Forms
    'form.farmer_name': 'किसान का नाम',
    'form.herb_type': 'जड़ी-बूटी का प्रकार',
    'form.quantity': 'मात्रा (किलो)',
    'form.harvest_date': 'कटाई की तारीख',
    'form.location': 'स्थान',
    'form.capture_location': 'जीपीएस स्थान पकड़ें',
    'form.submit': 'जमा करें',
    'form.batch_id': 'बैच आईडी',
    'form.select_batch': 'बैच चुनें',
    'form.moisture': 'नमी (%)',
    'form.active_markers': 'सक्रिय मार्कर (%)',
    'form.pesticides': 'कीटनाशक',
    'form.adulterants': 'मिलावट',
    'form.heavy_metals': 'भारी धातुएं',
    'form.microbial': 'सूक्ष्मजीव संख्या',
    'form.product_name': 'उत्पाद का नाम',
    'form.product_type': 'उत्पाद प्रकार',
    'form.mfg_date': 'निर्माण तिथि',
    'form.expiry_date': 'समाप्ति तिथि',
    'form.product_id': 'उत्पाद आईडी',
    'form.trace_product': 'उत्पाद ट्रेस करें',
    'form.scan_qr': 'क्यूआर कोड स्कैन करें',
    
    // Herb types
    'herb.ashwagandha': 'अश्वगंधा',
    'herb.tulsi': 'तुलसी',
    'herb.neem': 'नीम',
    'herb.turmeric': 'हल्दी',
    'herb.amla': 'आंवला',
    'herb.ginseng': 'जिनसेंग',
    'herb.brahmi': 'ब्राह्मी',
    'herb.shatavari': 'शतावरी',
    
    // Product types
    'product.powder': 'पाउडर',
    'product.capsule': 'कैप्सूल',
    'product.tablet': 'टैबलेट',
    'product.extract': 'एक्सट्रैक्ट',
    'product.oil': 'तेल',
    
    // Status
    'status.pass': 'पास',
    'status.fail': 'फेल',
    'status.pending': 'लंबित',
    'status.approved': 'स्वीकृत',
    'status.rejected': 'अस्वीकृत',
    
    // Messages
    'msg.collection_success': 'जड़ी-बूटी संग्रह सफलतापूर्वक टैग किया गया!',
    'msg.lab_test_completed': 'प्रयोगशाला परीक्षण पूरा हुआ!',
    'msg.product_created': 'उत्पाद सफलतापूर्वक बनाया गया!',
    'msg.trace_completed': 'उत्पाद ट्रेसिंग पूरी हुई!',
    'msg.blockchain_verified': 'कृषि ब्लॉकचेन पर सत्यापित',
    'msg.location_captured': 'जीपीएस स्थान सफलतापूर्वक पकड़ा गया!',
    'msg.qr_generated': 'क्यूआर कोड सफलतापूर्वक उत्पन्न हुआ!',
    
    // Blockchain
    'blockchain.chain_length': 'श्रृंखला लंबाई',
    'blockchain.block_type': 'ब्लॉक प्रकार',
    'blockchain.timestamp': 'टाइमस्टैम्प',
    'blockchain.hash': 'हैश',
    'blockchain.previous_hash': 'पिछला हैश',
    'blockchain.data': 'डेटा',
    'blockchain.search': 'ब्लॉकचेन खोजें',
    'blockchain.results': 'खोज परिणाम',
    
    // Smart contracts
    'contract.payment': 'भुगतान अनुबंध',
    'contract.insurance': 'बीमा अनुबंध',
    'contract.quality': 'गुणवत्ता अनुबंध',
    'contract.supply_chain': 'आपूर्ति श्रृंखला अनुबंध',
    'contract.executed': 'अनुबंध सफलतापूर्वक निष्पादित',
    
    // Notifications
    'notification.new_collection': 'नया जड़ी-बूटी संग्रह जोड़ा गया',
    'notification.lab_result': 'प्रयोगशाला परीक्षण परिणाम उपलब्ध',
    'notification.payment_released': 'किसान को भुगतान जारी किया गया',
    'notification.claim_submitted': 'बीमा दावा जमा किया गया',
    
    // Help
    'help.welcome': 'कृषि प्लेटफॉर्म में आपका स्वागत है',
    'help.collection': 'जीपीएस स्थान के साथ जड़ी-बूटी संग्रह टैग करें',
    'help.lab': 'जड़ी-बूटी बैच पर गुणवत्ता परीक्षण करें',
    'help.manufacturing': 'स्वीकृत बैच से उत्पाद बनाएं',
    'help.trace': 'खेत से फॉर्मूला तक उत्पाद यात्रा ट्रेस करें',
    'help.blockchain': 'अपरिवर्तनीय ब्लॉकचेन रिकॉर्ड देखें'
  },
  
  gu: {
    // Navigation
    'nav.home': 'હોમ',
    'nav.farmer': 'ખેડૂત',
    'nav.lab': 'પ્રયોગશાળા',
    'nav.manufacturer': 'ઉત્પાદક',
    'nav.consumer': 'ગ્રાહક',
    'nav.admin': 'વહીવટી',
    'nav.blockchain': 'બ્લોકચેન',
    'nav.search': 'શોધ',
    'nav.notifications': 'સૂચનાઓ',
    'nav.profile': 'પ્રોફાઇલ',
    'nav.logout': 'લૉગ આઉટ',
    
    // Dashboard titles
    'dashboard.farmer': 'ખેડૂત ડેશબોર્ડ',
    'dashboard.lab': 'પ્રયોગશાળા ટેસ્ટિંગ ડેશબોર્ડ',
    'dashboard.manufacturer': 'ઉત્પાદક ડેશબોર્ડ',
    'dashboard.consumer': 'ગ્રાહક પોર્ટલ',
    'dashboard.admin': 'વહીવટી ડેશબોર્ડ',
    'dashboard.blockchain': 'બ્લોકચેન એક્સપ્લોરર',
    
    // Forms
    'form.farmer_name': 'ખેડૂતનું નામ',
    'form.herb_type': 'જડીબુટ્ટીનો પ્રકાર',
    'form.quantity': 'જથો (કિલો)',
    'form.harvest_date': 'કાપણીની તારીખ',
    'form.location': 'સ્થાન',
    'form.capture_location': 'GPS સ્થાન પકડો',
    'form.submit': 'સબમિટ કરો',
    'form.batch_id': 'બેચ આઈડી',
    'form.select_batch': 'બેચ પસંદ કરો',
    'form.moisture': 'ભેજ (%)',
    'form.active_markers': 'સક્રિય માર્કર (%)',
    'form.pesticides': 'કીટનાશકો',
    'form.adulterants': 'ભેળસેળ',
    'form.heavy_metals': 'ભારે ધાતુઓ',
    'form.microbial': 'સૂક્ષ્મ જીવાણુ ગણતરી',
    'form.product_name': 'ઉત્પાદનનું નામ',
    'form.product_type': 'ઉત્પાદનનો પ્રકાર',
    'form.mfg_date': 'ઉત્પાદન તારીખ',
    'form.expiry_date': 'એક્સપાયરી તારીખ',
    'form.product_id': 'ઉત્પાદન આઈડી',
    'form.trace_product': 'ઉત્પાદન ટ્રેસ કરો',
    'form.scan_qr': 'QR કોડ સ્કેન કરો',
    
    // Herb types
    'herb.ashwagandha': 'અશ્વગંધા',
    'herb.tulsi': 'તુલસી',
    'herb.neem': 'નીમ',
    'herb.turmeric': 'હળદર',
    'herb.amla': 'આંબળો',
    'herb.ginseng': 'જિનસેંગ',
    'herb.brahmi': 'બ્રાહ્મી',
    'herb.shatavari': 'શતાવરી',
    
    // Product types
    'product.powder': 'પાઉડર',
    'product.capsule': 'કેપ્સ્યુલ',
    'product.tablet': 'ટેબ્લેટ',
    'product.extract': 'એક્સટ્રેક્ટ',
    'product.oil': 'તેલ',
    
    // Status
    'status.pass': 'પાસ',
    'status.fail': 'ફેલ',
    'status.pending': 'લંબિત',
    'status.approved': 'મંજૂર',
    'status.rejected': 'નકારી',
    
    // Messages
    'msg.collection_success': 'જડીબુટ્ટી સંગ્રહ સફળતાપૂર્વક ટેગ કરાયો!',
    'msg.lab_test_completed': 'પ્રયોગશાળા ટેસ્ટ પૂર્ણ થયું!',
    'msg.product_created': 'ઉત્પાદન સફળતાપૂર્વક બનાવાયું!',
    'msg.trace_completed': 'ઉત્પાદન ટ્રેસિંગ પૂર્ણ થઈ!',
    'msg.blockchain_verified': 'કૃષિ બ્લોકચેન પર સત્યાપિત',
    'msg.location_captured': 'GPS સ્થાન સફળતાપૂર્વક પકડાયું!',
    'msg.qr_generated': 'QR કોડ સફળતાપૂર્વક ઉત્પન્ન થયો!',
    
    // Blockchain
    'blockchain.chain_length': 'શૃંખલા લંબાઈ',
    'blockchain.block_type': 'બ્લોક પ્રકાર',
    'blockchain.timestamp': 'ટાઇમસ્ટેમ્પ',
    'blockchain.hash': 'હેશ',
    'blockchain.previous_hash': 'અગાઉનો હેશ',
    'blockchain.data': 'ડેટા',
    'blockchain.search': 'બ્લોકચેન શોધો',
    'blockchain.results': 'શોધ પરિણામો',
    
    // Smart contracts
    'contract.payment': 'ચુકવણી કરાર',
    'contract.insurance': 'વીમા કરાર',
    'contract.quality': 'ગુણવત્તા કરાર',
    'contract.supply_chain': 'સપ્લાય ચેઇન કરાર',
    'contract.executed': 'કરાર સફળતાપૂર્વક અમલમાં મૂકાયો',
    
    // Notifications
    'notification.new_collection': 'નવો જડીબુટ્ટી સંગ્રહ ઉમેરાયો',
    'notification.lab_result': 'પ્રયોગશાળા પરીક્ષણ પરિણામ ઉપલબ્ધ',
    'notification.payment_released': 'ખેડૂતને ચુકવણી જારી કરાઈ',
    'notification.claim_submitted': 'વીમા દાવો સબમિટ કરાયો',
    
    // Help
    'help.welcome': 'કૃષિ પ્લેટફોર્મમાં આપનું સ્વાગત છે',
    'help.collection': 'GPS સ્થાન સાથે જડીબુટ્ટી સંગ્રહ ટેગ કરો',
    'help.lab': 'જડીબુટ્ટી બેચ પર ગુણવત્તા પરીક્ષણ કરો',
    'help.manufacturing': 'મંજૂર બેચમાંથી ઉત્પાદનો બનાવો',
    'help.trace': 'ખેતરથી ફોર્મ્યુલા સુધી ઉત્પાદન મુસાફરી ટ્રેસ કરો',
    'help.blockchain': 'અવિનાશી બ્લોકચેન રેકોર્ડ જુઓ'
  },
  
  mr: {
    // Navigation
    'nav.home': 'होम',
    'nav.farmer': 'शेतकरी',
    'nav.lab': 'प्रयोगशाळा',
    'nav.manufacturer': 'उत्पादक',
    'nav.consumer': 'ग्राहक',
    'nav.admin': 'प्रशासक',
    'nav.blockchain': 'ब्लॉकचेन',
    'nav.search': 'शोध',
    'nav.notifications': 'सूचना',
    'nav.profile': 'प्रोफाइल',
    'nav.logout': 'लॉग आउट',
    
    // Dashboard titles
    'dashboard.farmer': 'शेतकरी डॅशबोर्ड',
    'dashboard.lab': 'प्रयोगशाळा चाचणी डॅशबोर्ड',
    'dashboard.manufacturer': 'उत्पादक डॅशबोर्ड',
    'dashboard.consumer': 'ग्राहक पोर्टल',
    'dashboard.admin': 'प्रशासक डॅशबोर्ड',
    'dashboard.blockchain': 'ब्लॉकचेन एक्सप्लोरर',
    
    // Forms
    'form.farmer_name': 'शेतकऱ्याचे नाव',
    'form.herb_type': 'जडीबुटीचा प्रकार',
    'form.quantity': 'प्रमाण (किलो)',
    'form.harvest_date': 'कापणीची तारीख',
    'form.location': 'स्थान',
    'form.capture_location': 'GPS स्थान पकडा',
    'form.submit': 'सबमिट करा',
    'form.batch_id': 'बॅच आयडी',
    'form.select_batch': 'बॅच निवडा',
    'form.moisture': 'आर्द्रता (%)',
    'form.active_markers': 'सक्रिय मार्कर (%)',
    'form.pesticides': 'कीटकनाशके',
    'form.adulterants': 'मिश्रण',
    'form.heavy_metals': 'भारी धातू',
    'form.microbial': 'सूक्ष्मजीव संख्या',
    'form.product_name': 'उत्पादनाचे नाव',
    'form.product_type': 'उत्पादनाचा प्रकार',
    'form.mfg_date': 'उत्पादन तारीख',
    'form.expiry_date': 'एक्सपायरी तारीख',
    'form.product_id': 'उत्पादन आयडी',
    'form.trace_product': 'उत्पादन ट्रेस करा',
    'form.scan_qr': 'QR कोड स्कॅन करा',
    
    // Herb types
    'herb.ashwagandha': 'अश्वगंधा',
    'herb.tulsi': 'तुलसी',
    'herb.neem': 'निम्ब',
    'herb.turmeric': 'हळद',
    'herb.amla': 'आंबा',
    'herb.ginseng': 'जिनसेंग',
    'herb.brahmi': 'ब्राह्मी',
    'herb.shatavari': 'शतावरी',
    
    // Product types
    'product.powder': 'पावडर',
    'product.capsule': 'कॅप्सूल',
    'product.tablet': 'टॅबलेट',
    'product.extract': 'एक्सट्रॅक्ट',
    'product.oil': 'तेल',
    
    // Status
    'status.pass': 'पास',
    'status.fail': 'फेल',
    'status.pending': 'बाकी',
    'status.approved': 'मंजूर',
    'status.rejected': 'नाकारले',
    
    // Messages
    'msg.collection_success': 'जडीबुटी संग्रह यशस्वीरित्या टॅग केला!',
    'msg.lab_test_completed': 'प्रयोगशाळा चाचणी पूर्ण झाली!',
    'msg.product_created': 'उत्पादन यशस्वीरित्या तयार केले!',
    'msg.trace_completed': 'उत्पादन ट्रेसिंग पूर्ण झाली!',
    'msg.blockchain_verified': 'कृषी ब्लॉकचेनवर सत्यापित',
    'msg.location_captured': 'GPS स्थान यशस्वीरित्या पकडले!',
    'msg.qr_generated': 'QR कोड यशस्वीरित्या तयार केला!',
    
    // Blockchain
    'blockchain.chain_length': 'साखळी लांबी',
    'blockchain.block_type': 'ब्लॉक प्रकार',
    'blockchain.timestamp': 'टाइमस्टॅम्प',
    'blockchain.hash': 'हॅश',
    'blockchain.previous_hash': 'मागील हॅश',
    'blockchain.data': 'डेटा',
    'blockchain.search': 'ब्लॉकचेन शोधा',
    'blockchain.results': 'शोध परिणाम',
    
    // Smart contracts
    'contract.payment': 'पेमेंट करार',
    'contract.insurance': 'विमा करार',
    'contract.quality': 'गुणवत्ता करार',
    'contract.supply_chain': 'सप्लाय चेन करार',
    'contract.executed': 'करार यशस्वीरित्या कार्यान्वित',
    
    // Notifications
    'notification.new_collection': 'नवीन जडीबुटी संग्रह जोडला',
    'notification.lab_result': 'प्रयोगशाळा चाचणी परिणाम उपलब्ध',
    'notification.payment_released': 'शेतकऱ्याला पेमेंट जारी केले',
    'notification.claim_submitted': 'विमा दावा सबमिट केला',
    
    // Help
    'help.welcome': 'कृषी प्लॅटफॉर्ममध्ये आपले स्वागत आहे',
    'help.collection': 'GPS स्थानासह जडीबुटी संग्रह टॅग करा',
    'help.lab': 'जडीबुटी बॅचवर गुणवत्ता चाचणी करा',
    'help.manufacturing': 'मंजूर बॅचमधून उत्पादने तयार करा',
    'help.trace': 'शेतापासून फॉर्म्युलापर्यंत उत्पादन प्रवास ट्रेस करा',
    'help.blockchain': 'अविनाशी ब्लॉकचेन रेकॉर्ड्स पहा'
  }
};

// Current language state
let currentLanguage = I18N_CONFIG.defaultLanguage;

// Initialize i18n
function initI18n() {
  // Set default language
  setLanguage(I18N_CONFIG.defaultLanguage);
  
  // Add language switcher event listeners
  setupLanguageSwitcher();
}

// Set language
function setLanguage(language) {
  if (!TRANSLATIONS[language]) {
    console.warn(`Language ${language} not supported, falling back to ${I18N_CONFIG.defaultLanguage}`);
    language = I18N_CONFIG.defaultLanguage;
  }
  
  currentLanguage = language;
  I18N_CONFIG.currentLanguage = language;
  
  // Update all text elements
  updateTextElements();
  
  // Save to localStorage
  localStorage.setItem('krishi-language', language);
  
  // Update language switcher active state
  updateLanguageSwitcher();
  
  showToast(`Language changed to ${getLanguageName(language)}`, 'info');
}

// Get translation
function t(key, language = currentLanguage) {
  const translation = TRANSLATIONS[language][key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found for language "${language}"`);
    return key; // Return key as fallback
  }
  return translation;
}

// Update all text elements
function updateTextElements() {
  // Update navigation
  updateElementText('.nav-home', t('nav.home'));
  updateElementText('.nav-farmer', t('nav.farmer'));
  updateElementText('.nav-lab', t('nav.lab'));
  updateElementText('.nav-manufacturer', t('nav.manufacturer'));
  updateElementText('.nav-consumer', t('nav.consumer'));
  updateElementText('.nav-admin', t('nav.admin'));
  updateElementText('.nav-blockchain', t('nav.blockchain'));
  updateElementText('.nav-search', t('nav.search'));
  updateElementText('.nav-notifications', t('nav.notifications'));
  updateElementText('.nav-profile', t('nav.profile'));
  updateElementText('.nav-logout', t('nav.logout'));
  
  // Update dashboard titles
  updateElementText('.dashboard-title', t(`dashboard.${getCurrentDashboard()}`));
  
  // Update forms
  updateElementText('[data-i18n="form.farmer_name"]', t('form.farmer_name'));
  updateElementText('[data-i18n="form.herb_type"]', t('form.herb_type'));
  updateElementText('[data-i18n="form.quantity"]', t('form.quantity'));
  updateElementText('[data-i18n="form.harvest_date"]', t('form.harvest_date'));
  updateElementText('[data-i18n="form.location"]', t('form.location'));
  updateElementText('[data-i18n="form.capture_location"]', t('form.capture_location'));
  updateElementText('[data-i18n="form.submit"]', t('form.submit'));
  
  // Update herb types
  updateElementText('[data-i18n="herb.ashwagandha"]', t('herb.ashwagandha'));
  updateElementText('[data-i18n="herb.tulsi"]', t('herb.tulsi'));
  updateElementText('[data-i18n="herb.neem"]', t('herb.neem'));
  updateElementText('[data-i18n="herb.turmeric"]', t('herb.turmeric'));
  
  // Update status
  updateElementText('[data-i18n="status.pass"]', t('status.pass'));
  updateElementText('[data-i18n="status.fail"]', t('status.fail'));
  
  // Update page title
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) {
    pageTitle.textContent = t(`dashboard.${getCurrentDashboard()}`);
  }
}

// Update single element text
function updateElementText(selector, text) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = text;
    } else {
      element.textContent = text;
    }
  });
}

// Setup language switcher
function setupLanguageSwitcher() {
  const languageSwitcher = document.getElementById('language-switcher');
  if (!languageSwitcher) return;
  
  // Add click events for language buttons
  I18N_CONFIG.supportedLanguages.forEach(lang => {
    const button = document.querySelector(`[data-lang="${lang}"]`);
    if (button) {
      button.addEventListener('click', () => setLanguage(lang));
    }
  });
}

// Update language switcher active state
function updateLanguageSwitcher() {
  I18N_CONFIG.supportedLanguages.forEach(lang => {
    const button = document.querySelector(`[data-lang="${lang}"]`);
    if (button) {
      if (lang === currentLanguage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  });
}

// Get current dashboard
function getCurrentDashboard() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('dashboard') || 'farmer';
}

// Get language name
function getLanguageName(code) {
  const names = {
    'en': 'English',
    'hi': 'हिन्दी',
    'gu': 'ગુજરાતી',
    'mr': 'मराठी'
  };
  return names[code] || code;
}

// Load saved language
function loadSavedLanguage() {
  const savedLanguage = localStorage.getItem('krishi-language');
  if (savedLanguage && TRANSLATIONS[savedLanguage]) {
    setLanguage(savedLanguage);
  }
}

// Export functions for global use
window.i18n = {
  init: initI18n,
  setLanguage: setLanguage,
  t: t,
  getCurrentLanguage: () => currentLanguage,
  getLanguageName: getLanguageName,
  loadSavedLanguage: loadSavedLanguage
};