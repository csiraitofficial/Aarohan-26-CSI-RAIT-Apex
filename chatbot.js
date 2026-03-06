// chatbot.js - OpenRouter AI Chatbot Integration for VaidyaChain
// API Key: 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

const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are a helpful AI assistant for VaidyaChain - a blockchain-based Ayurvedic herb traceability system. 

Your role is to help users with:
1. Understanding how the blockchain traceability system works
2. Guiding farmers through herb collection and registration
3. Explaining the quality testing process at laboratories
4. Helping manufacturers with product creation and QR code generation
5. Assisting consumers in tracing product authenticity
6. Answering questions about blockchain technology in simple terms
7. Providing information about insurance, sustainability, and DNA banking features

Key features of VaidyaChain:
- Blockchain-powered tracking from farm to consumer
- QR code scanning for product verification
- Quality assurance through lab testing
- Multi-stakeholder platform (farmers, labs, manufacturers, consumers)
- Sustainability monitoring
- Crop insurance with parametric triggers
- DNA banking for herb preservation

Always be friendly, helpful, and provide clear explanations. If you don't know something, admit it and suggest where the user might find more information.

Language: Respond in the same language as the user's query. If the user writes in Hindi or Gujarati, respond in Hindi or Gujarati respectively.`;

let chatHistory = [];
let isChatOpen = false;

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function () {
    createChatbotUI();
    setupChatbotEventListeners();
});

// Create the chatbot UI
function createChatbotUI() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <!-- Chatbot Toggle Button -->
        <button id="chatbot-toggle" class="chatbot-toggle" title="Chat with AI Assistant">
            <i class="ph ph-robot"></i>
            <span class="chatbot-badge">AI</span>
        </button>
        
        <!-- Chatbot Window -->
        <div id="chatbot-window" class="chatbot-window">
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-avatar">
                        <i class="ph ph-robot"></i>
                    </div>
                    <div>
                        <h3 data-i18n="chatbotTitle">VaidyaChain Assistant</h3>
                        <span class="chatbot-status">
                            <span class="status-dot"></span>
                            Online
                        </span>
                    </div>
                </div>
                <button id="chatbot-close" class="chatbot-close">
                    <i class="ph ph-x"></i>
                </button>
            </div>
            
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chatbot-message bot-message">
                    <div class="message-avatar">
                        <i class="ph ph-robot"></i>
                    </div>
                    <div class="message-content">
                        <p data-i18n="chatbotWelcome">Hello! I'm your VaidyaChain assistant. How can I help you today?</p>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-input-area">
                <input 
                    type="text" 
                    id="chatbot-input" 
                    data-i18n-placeholder="chatbotPlaceholder"
                    placeholder="Ask me anything about VaidyaChain..."
                >
                <button id="chatbot-send" class="chatbot-send">
                    <i class="ph ph-paper-plane-tilt"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(chatbotContainer);
}

// Setup event listeners
function setupChatbotEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const window = document.getElementById('chatbot-window');

    if (toggle) {
        toggle.addEventListener('click', toggleChatbot);
    }

    if (close) {
        close.addEventListener('click', closeChatbot);
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Toggle chatbot visibility
function toggleChatbot() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');

    isChatOpen = !isChatOpen;

    if (isChatOpen) {
        window.classList.add('chatbot-open');
        toggle.classList.add('chatbot-hidden');
    } else {
        window.classList.remove('chatbot-open');
        toggle.classList.remove('chatbot-hidden');
    }
}

// Close chatbot
function closeChatbot() {
    const window = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');

    isChatOpen = false;
    window.classList.remove('chatbot-open');
    toggle.classList.remove('chatbot-hidden');
}

// Send message to OpenRouter
async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to UI
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to OpenRouter API
        const response = await getAIResponse(message);

        // Remove typing indicator
        removeTypingIndicator();

        // Add bot response
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        console.error('Chatbot error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

// Get AI response from OpenRouter
async function getAIResponse(userMessage) {
    // Add current message to history
    chatHistory.push({
        role: 'user',
        content: userMessage
    });

    // Keep only last 10 messages
    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(-10);
    }

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'VaidyaChain AI Assistant'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...chatHistory
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const botResponse = data.choices[0].message.content;

            // Add bot response to history
            chatHistory.push({
                role: 'assistant',
                content: botResponse
            });

            return botResponse;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('OpenRouter API error:', error);

        // Fallback to a simple response if API fails
        return getFallbackResponse(userMessage);
    }
}

// Fallback responses when API is unavailable
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check for common questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
        return "Hello! Namaste! Welcome to VaidyaChain. How can I help you today?";
    }

    if (lowerMessage.includes('trace') || lowerMessage.includes('track')) {
        return "VaidyaChain uses blockchain technology to track Ayurvedic herbs from farm to consumer. You can trace any product by entering its ID in the Consumer Portal or scanning the QR code on the product packaging.";
    }

    if (lowerMessage.includes('farmer') || lowerMessage.includes('farm')) {
        return "As a farmer, you can use the Farmer Dashboard to register your herb collections with GPS location. Simply select the herb type, enter the quantity, and the system will create a blockchain record with a unique batch ID.";
    }

    if (lowerMessage.includes('lab') || lowerMessage.includes('test') || lowerMessage.includes('quality')) {
        return "The Testing Lab dashboard allows quality testers to verify herb batches. They can check moisture content, pesticides, heavy metals, and microbial count. Approved batches can then be used for manufacturing.";
    }

    if (lowerMessage.includes('manufacturer') || lowerMessage.includes('product')) {
        return "Manufacturers can create products from approved herb batches. After entering batch details and product information, the system generates a unique QR code that consumers can scan to verify authenticity.";
    }

    if (lowerMessage.includes('consumer') || lowerMessage.includes('verify')) {
        return "Consumers can verify product authenticity by scanning the QR code or entering the Product ID in the Consumer Portal. This shows the complete journey from farm collection through lab testing to manufacturing.";
    }

    if (lowerMessage.includes('blockchain')) {
        return "Blockchain technology creates an immutable, transparent record of every transaction. In VaidyaChain, each step (collection, testing, manufacturing) is recorded on the blockchain, ensuring complete traceability and trust.";
    }

    if (lowerMessage.includes('insurance')) {
        return "VaidyaChain offers blockchain-based crop insurance with automatic claim processing. Parametric triggers like weather conditions or quality test failures can automatically initiate claim approvals.";
    }

    if (lowerMessage.includes('sustainability')) {
        return "The Sustainability Dashboard tracks environmental impact metrics like herbs tracked and quality pass rates. It also shows source locations on a map to monitor sustainable sourcing practices.";
    }

    if (lowerMessage.includes('dna') || lowerMessage.includes('genetic')) {
        return "DNA Banking allows preservation of Ayurvedic herb genetics for future regeneration. DNA samples can be stored indefinitely and used to regenerate rare or endangered herb species.";
    }

    return "Thank you for your question! For detailed information, please explore the different dashboards in VaidyaChain. Each section - Farmer, Lab, Manufacturer, and Consumer - has specific tools and features to help you.";
}

// Add message to chat
function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'en';

    messageDiv.innerHTML = `
        ${sender === 'bot' ? `
            <div class="message-avatar">
                <i class="ph ph-robot"></i>
            </div>
        ` : ''}
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="ph ph-robot"></i>
        </div>
        <div class="message-content typing">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
        typing.remove();
    }
}

// Make chatbot functions globally available
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.sendMessage = sendMessage;
