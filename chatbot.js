// chatbot.js
// AI Chatbot for Krishi

const KrishiChatbot = {
  isOpen: false,
  messages: [],

  knowledgeBase: [
    {
      keywords: ['hello', 'hi', 'hey', 'namaste'],
      response: '🙏 Namaste! Welcome to Krishi. I can help you with herb traceability, batch tagging, lab testing, and blockchain verification. What would you like to know?'
    },
    {
      keywords: ['tag', 'batch', 'collection', 'how to tag'],
      response: '🌾 To tag a new herb batch:\n1. Go to Farmer Dashboard\n2. Fill in: Farmer Name, Herb Type, Quantity, Harvest Date\n3. Your GPS location is auto-captured\n4. Click "Submit Batch" — a blockchain block is created automatically!\n\nYour unique Batch ID (BATCH-XXXX) will be generated.'
    },
    {
      keywords: ['lab', 'test', 'testing', 'quality'],
      response: '🧪 Lab Testing Process:\n1. Lab selects a pending batch\n2. Tests: Moisture%, Active Markers, Pesticides, Heavy Metals, Microbial Count\n3. Our Quality Smart Contract auto-evaluates against herb-specific thresholds\n4. PASS → Payment released to farmer\n5. FAIL → Insurance claim auto-filed'
    },
    {
      keywords: ['blockchain', 'hash', 'block', 'chain', 'how blockchain'],
      response: '⛓️ Krishi Blockchain:\n• Each action (collection, testing, manufacturing) creates a new block\n• Blocks are cryptographically linked using hash functions\n• Any tampering breaks the chain — making data immutable\n• You can verify the entire chain in the Blockchain Explorer panel\n• Each block shows: type, timestamp, hash, and data'
    },
    {
      keywords: ['smart contract', 'contract', 'payment', 'automatic'],
      response: '📜 Krishi has 4 Smart Contracts:\n1. **QualityContract** — Auto-evaluates lab results against herb thresholds\n2. **PaymentContract** — Auto-releases payment to farmer on PASS\n3. **InsuranceContract** — Auto-files insurance claim on FAIL\n4. **SupplyChainContract** — Tracks reputation scores for all stakeholders'
    },
    {
      keywords: ['qr', 'scan', 'trace', 'consumer', 'verify'],
      response: '📱 For Consumers:\n1. Go to Consumer Portal\n2. Enter a Product ID or scan the QR code on the product\n3. See the complete supply chain journey: Farm → Lab → Factory\n4. Each step is blockchain-verified with a cryptographic seal\n5. You can verify the herb is authentic and tested!'
    },
    {
      keywords: ['herb', 'herbs', 'ayurvedic', 'types'],
      response: '🌿 Supported Herbs:\n• Ashwagandha — ₹450/kg\n• Tulsi — ₹320/kg\n• Neem — ₹280/kg\n• Turmeric — ₹200/kg\n• Brahmi — ₹550/kg\n• Shatavari — ₹480/kg\n• Amla — ₹180/kg\n• Guduchi — ₹400/kg\n\nEach herb has specific quality thresholds for lab testing.'
    },
    {
      keywords: ['price', 'market', 'rate', 'cost'],
      response: '💰 Current Market Rates:\n• Ashwagandha: ₹450/kg\n• Tulsi: ₹320/kg\n• Neem: ₹280/kg\n• Turmeric: ₹200/kg\n• Brahmi: ₹550/kg\n• Shatavari: ₹480/kg\n• Amla: ₹180/kg\n• Guduchi: ₹400/kg\n\nPrices update seasonally. Quality bonus of 10% for premium grades!'
    },
    {
      keywords: ['insurance', 'claim', 'coverage'],
      response: '🛡️ Insurance System:\n• Coverage: 50-75% of batch value depending on herb type\n• Auto-filed when lab test FAILS\n• Claim ID generated automatically\n• Track status in Insurance Dashboard\n• Protects farmers from losses on contaminated batches'
    },
    {
      keywords: ['dna', 'genetic', 'authenticity'],
      response: '🧬 DNA Banking:\n• Register genetic profiles for herb varieties\n• Each profile includes: variety name, genetic markers, lab ID\n• Used to verify authenticity against adulteration\n• Provides scientific proof for premium herb claims\n• Registered on blockchain for immutability'
    },
    {
      keywords: ['waste', 'disposal', 'recycle'],
      response: '♻️ Waste Management:\n• Register failed/expired batches for proper disposal\n• Methods: Composting, Biogas, CPCB-compliant disposal\n• Track waste volumes by category\n• Supports sustainability goals and circular economy'
    },
    {
      keywords: ['weather', 'climate', 'forecast'],
      response: '🌦️ Weather Information:\n• Weather widget shows current conditions for your farm area\n• Alerts for extreme weather that may affect herb quality\n• Temperature and humidity monitoring\n• Helps farmers plan harvest timing for optimal quality'
    },
    {
      keywords: ['export', 'download', 'csv', 'pdf', 'report'],
      response: '📤 Export Options:\n• CSV — Download batch data as spreadsheet\n• PDF — Generate lab certificates\n• JSON — Export entire blockchain for audit\n• Available from toolbar buttons in each dashboard'
    },
    {
      keywords: ['language', 'hindi', 'gujarati', 'marathi', 'translation'],
      response: '🌐 Language Support:\n• English (EN)\n• हिंदी (HI)\n• ગુજરાતી (GU)\n• मराठी (MR)\n\nChange language from the dropdown in the header. Your preference is saved!'
    },
    {
      keywords: ['help', 'support', 'how to', 'guide'],
      response: '❓ I can help with:\n• 🌾 Tagging herb batches\n• 🧪 Understanding lab tests\n• ⛓️ Blockchain verification\n• 📱 QR code scanning\n• 💰 Market prices\n• 📜 Smart contracts\n• 🛡️ Insurance claims\n• 📤 Exporting data\n\nJust ask me about any of these topics!'
    }
  ],

  findResponse(input) {
    const q = input.toLowerCase().trim();

    for (const entry of this.knowledgeBase) {
      if (entry.keywords.some(kw => q.includes(kw))) {
        return entry.response;
      }
    }

    return '🤔 I\'m not sure about that. Try asking about:\n• Batch tagging\n• Lab testing\n• Blockchain\n• Smart contracts\n• Market prices\n• QR tracing\n\nOr type "help" for all topics!';
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('chatbot-panel');
    if (panel) {
      panel.style.display = this.isOpen ? 'flex' : 'none';
    }
    if (this.isOpen && this.messages.length === 0) {
      this.addBotMessage('🙏 Namaste! I\'m KrishiBot. How can I help you today?\n\nType "help" to see all topics I can assist with.');
    }
  },

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    this.addUserMessage(text);
    input.value = '';

    // Simulate typing
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const response = this.findResponse(text);
      this.addBotMessage(response);
    }, 800 + Math.random() * 800);
  },

  addUserMessage(text) {
    this.messages.push({ sender: 'user', text, time: Date.now() });
    this.renderMessages();
  },

  addBotMessage(text) {
    this.messages.push({ sender: 'bot', text, time: Date.now() });
    this.renderMessages();
  },

  showTyping() {
    const chat = document.getElementById('chatbot-messages');
    if (!chat) return;
    const typing = document.createElement('div');
    typing.id = 'chatbot-typing';
    typing.className = 'chat-msg bot';
    typing.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
  },

  hideTyping() {
    const typing = document.getElementById('chatbot-typing');
    if (typing) typing.remove();
  },

  renderMessages() {
    const chat = document.getElementById('chatbot-messages');
    if (!chat) return;

    chat.innerHTML = this.messages.map(msg => `
      <div class="chat-msg ${msg.sender}">
        <div class="chat-bubble ${msg.sender}">
          ${msg.text.replace(/\n/g, '<br>')}
        </div>
        <small class="chat-time">${new Date(msg.time).toLocaleTimeString()}</small>
      </div>
    `).join('');

    chat.scrollTop = chat.scrollHeight;
  },

  init() {
    console.log('🤖 KrishiBot initialized');
  }
};

document.addEventListener('DOMContentLoaded', () => KrishiChatbot.init());