// AI Chatbot System
// Provides conversational assistance for Krishi platform users

// Chatbot configuration
const CHATBOT_CONFIG = {
  name: 'Krishi Assistant',
  version: '1.0.0',
  maxMessages: 50,
  typingDelay: 600
};

// Chatbot responses database
const CHATBOT_RESPONSES = {
  // Greetings
  greetings: [
    "Hello! I'm Krishi Assistant, here to help you with herb traceability and blockchain features.",
    "Hi there! How can I assist you with the Krishi platform today?",
    "Welcome! I can help you with herb collection, lab testing, product creation, and more."
  ],
  
  // Herb collection help
  herbCollection: [
    "To tag a new herb collection:\n1. Go to Farmer Dashboard\n2. Fill in the collection form\n3. Capture GPS location\n4. Submit to blockchain\n\nEach batch gets a unique ID and is permanently recorded!",
    "Herb collection process:\n• Enter farmer name and herb type\n• Specify quantity and harvest date\n• Capture GPS coordinates\n• Submit to create blockchain record\n\nThis ensures traceability from farm to formula.",
    "For herb collection, you'll need:\n- Farmer details\n- Herb type (Ashwagandha, Tulsi, Neem, etc.)\n- Quantity in kg\n- Harvest date\n- GPS location\n\nAll data is stored immutably on the blockchain."
  ],
  
  // Lab testing help
  labTesting: [
    "Lab testing process:\n1. Select a batch from the dropdown\n2. Check batch details\n3. Enter test parameters\n4. Upload lab report\n5. Submit result\n\nResults are stored immutably on the blockchain.",
    "For lab testing, you'll assess:\n• Moisture content\n• Active markers percentage\n• Pesticide residues\n• Adulterant presence\n• Heavy metal levels\n• Microbial count\n\nQuality thresholds are herb-specific.",
    "Lab test parameters:\n• Moisture: Should be within herb-specific limits\n• Active Markers: Minimum percentage required\n• Pesticides: Should be 'None Detected'\n• Adulterants: Should be 'None Detected'\n• Heavy Metals: Should be 'Within Limits'\n• Microbial: Should be 'Within Limits'"
  ],
  
  // Product creation help
  productCreation: [
    "To create a product:\n1. Go to Manufacturer Dashboard\n2. Check batch status (must pass lab test)\n3. Fill product details\n4. Generate QR code\n5. Product is ready for consumers to trace!",
    "Product creation requirements:\n• Approved batch ID (must pass lab test)\n• Product name and type\n• Manufacturing and expiry dates\n• QR code generation for traceability\n\nEach product gets a unique QR code linking to its blockchain history.",
    "Product types available:\n• Powder\n• Capsule\n• Tablet\n• Extract\n• Oil\n\nEnsure the batch has passed quality testing before creating products."
  ],
  
  // Supply chain tracing help
  supplyChain: [
    "To trace a product:\n1. Go to Consumer Portal\n2. Enter product ID or scan QR code\n3. View complete supply chain journey\n4. See blockchain verification\n\nEvery step is transparent and verifiable!",
    "Supply chain journey includes:\n• Herb collection (farm details, GPS location)\n• Lab testing (quality results, certificates)\n• Manufacturing (product creation, QR code)\n• All steps are recorded on the blockchain\n\nThis ensures complete transparency.",
    "Traceability benefits:\n• Verify product authenticity\n• Check quality test results\n• View farm-to-formula journey\n• Confirm blockchain verification\n• Make informed purchasing decisions"
  ],
  
  // Blockchain help
  blockchain: [
    "Our blockchain:\n• Records every transaction permanently\n• Uses cryptographic hashing\n• Links blocks together securely\n• Provides full transparency\n• Cannot be altered or deleted\n\nEach block contains a unique hash that links to the previous block.",
    "Blockchain features:\n• Immutable records\n• Cryptographic security\n• Transparent transactions\n• Timestamp verification\n• Tamper-proof history\n\nEvery herb batch, test result, and product is recorded.",
    "Blockchain verification:\n• Each transaction gets a unique hash\n• Blocks are linked chronologically\n• Data cannot be modified\n• Full audit trail available\n• Cryptographic proof of integrity"
  ],
  
  // Smart contracts help
  smartContracts: [
    "Smart contracts automate processes:\n• Payment contracts auto-pay farmers when quality passes\n• Insurance contracts auto-file claims when quality fails\n• Quality contracts set herb-specific thresholds\n• Supply chain contracts track reputation scores",
    "Payment automation:\n• When lab tests pass, payments release automatically\n• No middlemen required\n• Transparent payment tracking\n• Instant farmer compensation\n• Blockchain-verified transactions",
    "Quality assurance:\n• Herb-specific quality thresholds\n• Automatic pass/fail determination\n• Smart contract execution\n• Quality-based payment triggers\n• Immutable quality records"
  ],
  
  // General help
  general: [
    "I can help you with:\n• Herb collection process\n• Lab testing procedures\n• Product creation workflow\n• Supply chain tracing\n• Blockchain basics\n• Smart contract features\n\nWhat would you like to know more about?",
    "Available dashboards:\n• Farmer Dashboard - Tag herb collections\n• Lab Dashboard - Quality testing\n• Manufacturer Dashboard - Product creation\n• Consumer Portal - Product tracing\n• Admin Dashboard - System management\n• Blockchain Explorer - View chain data",
    "Platform features:\n• Role-based access (Farmer, Lab, Manufacturer, Consumer, Admin)\n• Multilingual support (English, Hindi, Gujarati, Marathi)\n• PWA offline capability\n• QR code traceability\n• Blockchain verification\n• Smart contract automation"
  ],
  
  // Error responses
  errors: [
    "I'm still learning about Krishi. For now, I can help with:\n• Herb collection process\n• Lab testing\n• Product creation\n• Supply chain tracing\n• Blockchain basics\n\nPlease ask about one of these topics!",
    "I don't have information about that yet. Try asking about:\n• How to tag herb collections\n• Lab testing procedures\n• Creating products\n• Tracing supply chain\n• Blockchain features",
    "Let me help you with something I know:\n• Herb collection workflow\n• Quality testing process\n• Product creation steps\n• Supply chain transparency\n• Blockchain verification"
  ]
};

// Chatbot state
let chatbotState = {
  messages: [],
  isTyping: false,
  isActive: false
};

// Initialize chatbot
function initChatbot() {
  // Add welcome message
  addBotMessage("Hello! I'm Krishi Assistant. How can I help you with herb traceability and blockchain features today?");
}

// Add message to chat
function addMessage(text, sender) {
  const messagesContainer = document.getElementById('chatbot-messages');
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.innerHTML = `
    <div class="message-bubble">
      <span class="message-text">${text}</span>
      <span class="message-time">${formatTime(new Date())}</span>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Store message
  chatbotState.messages.push({ text, sender, timestamp: Date.now() });
  
  // Limit messages
  if (chatbotState.messages.length > CHATBOT_CONFIG.maxMessages) {
    chatbotState.messages.shift();
    // Remove oldest message from DOM
    const oldestMessage = messagesContainer.querySelector('.chat-message');
    if (oldestMessage) oldestMessage.remove();
  }
}

// Add bot message with typing effect
function addBotMessage(text) {
  chatbotState.isTyping = true;
  
  // Show typing indicator
  const messagesContainer = document.getElementById('chatbot-messages');
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-message bot typing-indicator';
  typingIndicator.innerHTML = `
    <div class="message-bubble">
      <span class="typing-dots">
        <span></span><span></span><span></span>
      </span>
    </div>
  `;
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Remove typing indicator and show message after delay
  setTimeout(() => {
    typingIndicator.remove();
    addMessage(text, 'bot');
    chatbotState.isTyping = false;
  }, CHATBOT_CONFIG.typingDelay);
}

// Process user message
function processUserMessage(message) {
  const msg = message.toLowerCase().trim();
  
  // Add user message
  addMessage(message, 'user');
  
  // Generate response
  const response = generateResponse(msg);
  addBotMessage(response);
}

// Generate response based on message content
function generateResponse(message) {
  // Check for greetings
  if (isGreeting(message)) {
    return getRandomResponse(CHATBOT_RESPONSES.greetings);
  }
  
  // Check for herb collection keywords
  if (hasKeywords(message, ['collection', 'tag', 'batch', 'farmer', 'herb'])) {
    return getRandomResponse(CHATBOT_RESPONSES.herbCollection);
  }
  
  // Check for lab testing keywords
  if (hasKeywords(message, ['lab', 'test', 'quality', 'moisture', 'pesticide', 'certificate'])) {
    return getRandomResponse(CHATBOT_RESPONSES.labTesting);
  }
  
  // Check for product creation keywords
  if (hasKeywords(message, ['product', 'manufactur', 'create', 'qr', 'batch'])) {
    return getRandomResponse(CHATBOT_RESPONSES.productCreation);
  }
  
  // Check for supply chain keywords
  if (hasKeywords(message, ['trace', 'supply', 'chain', 'journey', 'qr', 'scan'])) {
    return getRandomResponse(CHATBOT_RESPONSES.supplyChain);
  }
  
  // Check for blockchain keywords
  if (hasKeywords(message, ['blockchain', 'hash', 'immutable', 'verify', 'crypto'])) {
    return getRandomResponse(CHATBOT_RESPONSES.blockchain);
  }
  
  // Check for smart contract keywords
  if (hasKeywords(message, ['contract', 'smart', 'payment', 'insurance', 'automat'])) {
    return getRandomResponse(CHATBOT_RESPONSES.smartContracts);
  }
  
  // Check for general help
  if (hasKeywords(message, ['help', 'how', 'what', 'where', 'when'])) {
    return getRandomResponse(CHATBOT_RESPONSES.general);
  }
  
  // Default response
  return getRandomResponse(CHATBOT_RESPONSES.errors);
}

// Helper functions
function isGreeting(message) {
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some(greeting => message.includes(greeting));
}

function hasKeywords(message, keywords) {
  return keywords.some(keyword => message.includes(keyword));
}

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Export functions for global use
window.chatbot = {
  init: initChatbot,
  processMessage: processUserMessage,
  addMessage: addMessage,
  addBotMessage: addBotMessage
};