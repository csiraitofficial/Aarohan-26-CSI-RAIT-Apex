// chatbot.js - Role-Aware Agentic AI Assistant for vaidyachain
// Powered by Google Gemini | Context-injected with live Firestore + blockchain data

const GEMINI_API_KEY = 'AIzaSyCjSZEgEsF8iN9qWbhBISsnsdRiAoM06yQ';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


// ─── Base system prompt ─────────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are an intelligent, role-aware AI assistant for vaidyachain — a blockchain-based Ayurvedic herb traceability platform connecting farmers, testing labs, manufacturers, and consumers.

Your capabilities:
1. Answer questions about the blockchain traceability system
2. Retrieve and explain live data from the system (batches, lab reports, products, transactions)
3. Guide each user type through their specific workflows
4. Format responses clearly with structured data when presenting batch/report details

Data interpretation rules:
- "collection" type transactions = herb collection by a farmer
- "lab-test" or "lab_test" type = quality testing results at a lab
- "manufacturing" type = product manufactured from a batch
- "purchase" type = purchase of a herb batch by a manufacturer
- "smart-contract-event" = automated blockchain event (payment, insurance, etc.)

When a user asks for specific data (e.g., "lab test report for BATCH-123"):
1. First search the SYSTEM DATA CONTEXT provided to you
2. Present the found data in a clear, structured format
3. If not found, say it isn't in the current records

Response format:
- Use **bold** for important fields, batch IDs, and status values
- Use bullet points for lists of data
- Always include the Batch ID when discussing batch-related data
- Be concise but complete

Language: Respond in the same language as the user (Hindi, Gujarati, or English).`;

// ─── State ──────────────────────────────────────────────────────────────────
let chatHistory = [];
let isChatOpen = false;
let agentContext = null; // Cached role-specific data

// ─── Initialize chatbot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    createChatbotUI();
    setupChatbotEventListeners();

    const toggle = document.getElementById('chatbot-toggle');
    if (toggle) toggle.classList.remove('chatbot-hidden');
});

// ─── Create UI ──────────────────────────────────────────────────────────────
function createChatbotUI() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <!-- Chatbot Toggle Button -->
        <button id="chatbot-toggle" class="chatbot-toggle" title="Chat with AI Assistant" style="background:linear-gradient(135deg,#16a34a,#15803d)!important;color:#fff!important;border:none!important;">
            <i class="ph ph-robot" style="color:#fff!important;font-size:1.6rem;"></i>
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
                        <h3>vaidyachain Assistant</h3>
                        <span class="chatbot-status">
                            <span class="status-dot"></span>
                            <span id="chatbot-role-label">Connecting…</span>
                        </span>
                    </div>
                </div>
                <div style="display:flex;gap:4px;align-items:center;">
                    <button id="chatbot-refresh-ctx" class="chatbot-close" title="Refresh data context"
                        style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                        <i class="ph ph-arrows-clockwise" style="color:#fff!important;font-size:1rem;"></i>
                    </button>
                    <button id="chatbot-close" class="chatbot-close"
                        style="background:rgba(255,255,255,0.25);border:none;color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;">
                        <i class="ph ph-x" style="color:#fff!important;font-size:1rem;"></i>
                    </button>
                </div>
            </div>

            <!-- Messages -->
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chatbot-message bot-message">
                    <div class="message-avatar"><i class="ph ph-robot"></i></div>
                    <div class="message-content">
                        <p>Hello! I'm your vaidyachain AI assistant. I have access to your live data and can help you with batch reports, lab tests, manufacturing details, and more. What would you like to know?</p>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="chatbot-input-area">
                <input
                    type="text"
                    id="chatbot-input"
                    placeholder="Ask about batches, reports, products…"
                >
                <button id="chatbot-send" class="chatbot-send">
                    <i class="ph ph-paper-plane-tilt"></i>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(chatbotContainer);
}

// ─── Event Listeners ────────────────────────────────────────────────────────
function setupChatbotEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const refreshBtn = document.getElementById('chatbot-refresh-ctx');

    if (toggle) toggle.addEventListener('click', toggleChatbot);
    if (close) close.addEventListener('click', closeChatbot);
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (refreshBtn) refreshBtn.addEventListener('click', async () => {
        const refreshIcon = refreshBtn.querySelector('i');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear infinite';
        }
        agentContext = null;
        await buildAgentContext();
        if (refreshIcon) refreshIcon.style.animation = '';
        addMessage('✅ Data context refreshed! I now have the latest information from the system.', 'bot');
    });

    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

// ─── Toggle / Close ─────────────────────────────────────────────────────────
function toggleChatbot() {
    const win = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        win.classList.add('chatbot-open');
        toggle.classList.add('chatbot-hidden');
        // Build context in background when first opened
        if (!agentContext) buildAgentContext();
    } else {
        win.classList.remove('chatbot-open');
        toggle.classList.remove('chatbot-hidden');
    }
}

function closeChatbot() {
    const win = document.getElementById('chatbot-window');
    const toggle = document.getElementById('chatbot-toggle');
    isChatOpen = false;
    win.classList.remove('chatbot-open');
    toggle.classList.remove('chatbot-hidden');
}

// ─── Agent Context Builder (the core "agent" logic) ─────────────────────────
async function buildAgentContext() {
    const role = (typeof window.getCurrentUserRole === 'function')
        ? (window.getCurrentUserRole() || 'unknown')
        : 'unknown';
    const user = (typeof window.getCurrentUser === 'function')
        ? window.getCurrentUser()
        : null;

    // Update role label in header
    const roleLabel = document.getElementById('chatbot-role-label');
    if (roleLabel) {
        roleLabel.textContent = role !== 'unknown' ? `${role.toUpperCase()} mode` : 'Guest mode';
    }

    const ctx = {
        role,
        user: user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null,
        timestamp: new Date().toISOString(),
        blockchainData: {},
        firestoreData: {},
    };

    // ── 1. Pull from blockchain (local) ──────────────────────────────────
    try {
        if (typeof window.getAllHerbTransactions === 'function') {
            const allTx = window.getAllHerbTransactions();

            // Slim down for context injection
            const slimTx = allTx.map(tx => {
                const d = tx.data || {};
                const base = {
                    batchId: tx.batchId || d.batchId || 'N/A',
                    type: d.type || 'unknown',
                    timestamp: tx.timestamp || d.timestamp,
                };

                switch (d.type) {
                    case 'collection':
                        return {
                            ...base,
                            herbType: d.herbType,
                            quantity: d.quantity,
                            price: d.price,
                            farmer: d.farmer,
                            location: d.location,
                            status: d.status,
                            collectionDate: d.collectionDate,
                        };
                    case 'lab-test':
                    case 'lab_test':
                        return {
                            ...base,
                            labName: d.labName,
                            testResult: d.testResult,
                            status: d.status,
                            moisture: d.moisture,
                            pesticides: d.pesticides,
                            heavyMetals: d.heavyMetals,
                            microbialCount: d.microbialCount,
                            notes: d.notes,
                            metrics: d.metrics,
                            testedBy: d.testedBy,
                        };
                    case 'manufacturing':
                        return {
                            ...base,
                            productName: d.productName,
                            productId: d.productId,
                            manufacturer: d.manufacturer,
                            quantity: d.quantity,
                            expiryDate: d.expiryDate,
                        };
                    case 'purchase':
                        return {
                            ...base,
                            amount: d.amount,
                            buyerId: d.buyerId,
                        };
                    case 'smart-contract-event':
                        return {
                            ...base,
                            event: d.event,
                            contract: d.contract,
                            data: d.data,
                        };
                    default:
                        return base;
                }
            });

            // Keep latest 80 transactions
            ctx.blockchainData.transactions = slimTx.slice(-80);

            // Role-specific filtered summaries
            if (role === 'farmer' && user) {
                ctx.blockchainData.myCollections = slimTx.filter(
                    tx => tx.type === 'collection' && tx.farmer && tx.farmer.id === user.uid
                );
            }
            if (role === 'manufacturer') {
                ctx.blockchainData.myProducts = slimTx.filter(tx => tx.type === 'manufacturing');
                ctx.blockchainData.approvedBatches = slimTx.filter(
                    tx => (tx.type === 'lab-test' || tx.type === 'lab_test') && tx.testResult === 'pass'
                );
            }
            if (role === 'lab') {
                ctx.blockchainData.labTests = slimTx.filter(
                    tx => tx.type === 'lab-test' || tx.type === 'lab_test'
                );
                ctx.blockchainData.pendingBatches = slimTx.filter(
                    tx => tx.type === 'collection' && tx.status === 'collected'
                );
            }
        }
    } catch (e) {
        console.warn('[ChatAgent] Blockchain data fetch failed:', e);
    }

    // ── 2. Pull from Firestore ──────────────────────────────────────────
    try {
        if (typeof db !== 'undefined' && db) {
            const fetchCollection = async (colName, limitN = 30) => {
                const snap = await db.collection(colName).orderBy('createdAt', 'desc').limit(limitN).get();
                return snap.docs.map(d => ({ id: d.id, ...d.data() }));
            };

            // Fetch based on role
            const fetches = [];

            if (role === 'farmer') {
                fetches.push(
                    fetchCollection('collections', 20).then(d => { ctx.firestoreData.collections = d; }),
                );
            } else if (role === 'lab') {
                fetches.push(
                    fetchCollection('collections', 20).then(d => { ctx.firestoreData.collections = d; }),
                    fetchCollection('labTests', 20).then(d => { ctx.firestoreData.labTests = d; }).catch(() => { })
                );
            } else if (role === 'manufacturer') {
                fetches.push(
                    fetchCollection('manufacturing', 20).then(d => { ctx.firestoreData.manufacturing = d; }).catch(() => { }),
                    fetchCollection('collections', 20).then(d => { ctx.firestoreData.collections = d; }),
                );
            } else if (role === 'admin') {
                fetches.push(
                    fetchCollection('collections', 20).then(d => { ctx.firestoreData.collections = d; }),
                    fetchCollection('manufacturing', 15).then(d => { ctx.firestoreData.manufacturing = d; }).catch(() => { }),
                    fetchCollection('transactions', 20).then(d => { ctx.firestoreData.transactions = d; }).catch(() => { }),
                    db.collection('users').limit(50).get().then(snap => {
                        ctx.firestoreData.users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
                    }).catch(() => { })
                );
            } else if (role === 'consumer') {
                fetches.push(
                    fetchCollection('collections', 10).then(d => { ctx.firestoreData.collections = d; }),
                );
            } else {
                // Guest / unknown
                fetches.push(
                    fetchCollection('collections', 5).then(d => { ctx.firestoreData.collections = d; }),
                );
            }

            await Promise.allSettled(fetches);
        }
    } catch (e) {
        console.warn('[ChatAgent] Firestore data fetch failed:', e);
    }

    agentContext = ctx;
    return ctx;
}

// ─── Build dynamic system prompt with context ────────────────────────────────
function buildSystemPrompt(ctx) {
    let prompt = BASE_SYSTEM_PROMPT;

    if (!ctx) return prompt;

    prompt += `\n\n===== CURRENT SESSION CONTEXT =====`;
    prompt += `\nTIMESTAMP: ${ctx.timestamp}`;
    prompt += `\nUSER ROLE: ${ctx.role.toUpperCase()}`;

    if (ctx.user) {
        prompt += `\nUSER: ${ctx.user.displayName || ctx.user.email} (UID: ${ctx.user.uid})`;
    }

    // Inject blockchain data
    if (ctx.blockchainData && Object.keys(ctx.blockchainData).length > 0) {
        prompt += `\n\n===== LIVE BLOCKCHAIN DATA =====`;
        prompt += `\n${JSON.stringify(ctx.blockchainData, null, 2)}`;
    }

    // Inject Firestore data
    if (ctx.firestoreData && Object.keys(ctx.firestoreData).length > 0) {
        prompt += `\n\n===== LIVE FIRESTORE DATABASE DATA =====`;
        prompt += `\n${JSON.stringify(ctx.firestoreData, null, 2)}`;
    }

    prompt += `\n\n===== INSTRUCTIONS =====`;
    prompt += `\nYou have the above live data from this system. When the user queries specific data (batch IDs, lab reports, products, etc.), search the provided context and return accurate, structured information. Do not make up data not in the context. If something is not found, say so clearly.`;
    prompt += `\nFor role "${ctx.role}": Focus your assistance on what this user type needs most. A manufacturer wants to see lab test outcomes and approved batches. A farmer wants to see their collections and payments. A lab user wants pending tests and test metrics. A consumer wants to trace product authenticity.`;

    return prompt;
}


// ─── Send message ────────────────────────────────────────────────────────────
async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    showTypingIndicator();

    try {
        // Ensure context is built
        if (!agentContext) await buildAgentContext();
        const response = await getAIResponse(message);
        removeTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        console.error('Chatbot error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

// ─── Get AI response (Google Gemini) ─────────────────────────────────────────
async function getAIResponse(userMessage) {
    chatHistory.push({ role: 'user', content: userMessage });
    if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);

    // Try to handle offline with fallback for batch-specific queries
    const offlineResult = tryOfflineBatchQuery(userMessage);

    const systemPrompt = buildSystemPrompt(agentContext);

    // Convert chatHistory to Gemini format
    const geminiContents = chatHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));

    const requestBody = JSON.stringify({
        system_instruction: {
            parts: [{ text: systemPrompt }],
        },
        contents: geminiContents,
        generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 700,
        },
    });

    // Retry logic for rate-limit (429) errors
    const MAX_RETRIES = 2;
    const RETRY_DELAYS = [2000, 5000];

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });

            if (response.status === 429 && attempt < MAX_RETRIES) {
                console.warn(`[ChatAgent] Rate limited (429), retrying in ${RETRY_DELAYS[attempt]}ms... (attempt ${attempt + 1})`);
                await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
                continue;
            }

            if (!response.ok) throw new Error(`Gemini API Error: ${response.status}`);

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const botResponse = data.candidates[0].content.parts[0].text;
                chatHistory.push({ role: 'assistant', content: botResponse });
                return botResponse;
            }
            throw new Error('Invalid Gemini response format');
        } catch (error) {
            if (attempt < MAX_RETRIES && error.message && error.message.includes('429')) {
                await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
                continue;
            }
            console.error('[ChatAgent] Gemini API error:', error);
            if (offlineResult) return offlineResult;
            return getFallbackResponse(userMessage);
        }
    }
    // Should not reach here, but safety fallback
    if (offlineResult) return offlineResult;
    return getFallbackResponse(userMessage);
}

// ─── Offline batch query resolver (fast, no API needed) ──────────────────────
function tryOfflineBatchQuery(message) {
    if (typeof window.getAllHerbTransactions !== 'function') return null;

    const batchMatch = message.match(/BATCH-[\w\d]+/i);
    if (!batchMatch) return null;

    const batchId = batchMatch[0].toUpperCase();
    const allTx = window.getAllHerbTransactions();
    const relevantTx = allTx.filter(
        tx => tx.batchId === batchId || (tx.data && (tx.data.batchId === batchId || tx.batchId === batchId))
    );

    if (relevantTx.length === 0) return null; // Let AI handle

    // Also check firestoreData
    let extraFirestore = '';
    if (agentContext && agentContext.firestoreData) {
        const { collections = [], manufacturing = [], labTests = [] } = agentContext.firestoreData;
        const allFs = [...collections, ...manufacturing, ...labTests];
        const fsBatch = allFs.filter(r => r.batchId === batchId || r.id === batchId);
        if (fsBatch.length > 0) {
            extraFirestore = `\n\n**Firestore Records:**\n${JSON.stringify(fsBatch, null, 2)}`;
        }
    }

    const msgLower = message.toLowerCase();
    const isLabQuery = msgLower.includes('lab') || msgLower.includes('test') || msgLower.includes('report');

    let result = `Here is the complete blockchain history for **${batchId}**:\n\n`;

    const labTests = relevantTx.filter(tx => tx.data && (tx.data.type === 'lab-test' || tx.data.type === 'lab_test'));
    const collections = relevantTx.filter(tx => tx.data && tx.data.type === 'collection');
    const manufacturing = relevantTx.filter(tx => tx.data && tx.data.type === 'manufacturing');

    if (collections.length > 0) {
        const c = collections[0].data;
        result += `**🌿 Collection Record**\n`;
        result += `- Herb Type: **${c.herbType || 'N/A'}**\n`;
        result += `- Quantity: **${c.quantity} kg**\n`;
        result += `- Price: ₹${c.price}/kg\n`;
        result += `- Farmer: ${c.farmer ? c.farmer.name : 'N/A'} (ID: ${c.farmer ? c.farmer.id : 'N/A'})\n`;
        result += `- Collection Date: ${c.collectionDate || 'N/A'}\n`;
        result += `- Status: **${c.status || 'collected'}**\n\n`;
    }

    if (labTests.length > 0) {
        labTests.forEach((ltx, i) => {
            const l = ltx.data;
            const passed = l.testResult === 'pass' || l.status === 'approved';
            result += `**🔬 Lab Test Report ${labTests.length > 1 ? `#${i + 1}` : ''}**\n`;
            result += `- Lab Name: ${l.labName || 'N/A'}\n`;
            result += `- Result: **${passed ? '✅ PASSED' : '❌ FAILED'}**\n`;
            if (l.moisture !== undefined) result += `- Moisture: ${l.moisture}%\n`;
            if (l.pesticides) result += `- Pesticides: ${l.pesticides}\n`;
            if (l.heavyMetals) result += `- Heavy Metals: ${l.heavyMetals}\n`;
            if (l.microbialCount) result += `- Microbial Count: ${l.microbialCount}\n`;
            if (l.metrics) result += `- Metrics: ${JSON.stringify(l.metrics)}\n`;
            if (l.notes) result += `- Notes: ${l.notes}\n`;
            if (l.testedBy) result += `- Tested By: ${l.testedBy}\n`;
            result += '\n';
        });
    } else if (isLabQuery) {
        result += `**🔬 Lab Test Report:** No lab test records found on the blockchain for **${batchId}** yet.\n\n`;
    }

    if (manufacturing.length > 0) {
        const m = manufacturing[0].data;
        result += `**🏭 Manufacturing Record**\n`;
        result += `- Product Name: **${m.productName || 'N/A'}**\n`;
        result += `- Product ID: ${m.productId || 'N/A'}\n`;
        result += `- Manufacturer: ${m.manufacturer || 'N/A'}\n`;
        result += `- Quantity: ${m.quantity || 'N/A'}\n`;
        result += `- Expiry Date: ${m.expiryDate || 'N/A'}\n\n`;
    }

    result += extraFirestore;
    return result;
}

// ─── Add message to UI ────────────────────────────────────────────────────────
function addMessage(content, sender) {
    const container = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = `chatbot-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;

    // Convert markdown-like bold/bullets to HTML
    const formatted = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br>• ')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

    div.innerHTML = `
        ${sender === 'bot' ? `<div class="message-avatar"><i class="ph ph-robot"></i></div>` : ''}
        <div class="message-content"><p>${formatted}</p></div>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function showTypingIndicator() {
    const container = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'chatbot-message bot-message';
    div.innerHTML = `
        <div class="message-avatar"><i class="ph ph-robot"></i></div>
        <div class="message-content typing">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

// ─── Fallback responses when API is down ─────────────────────────────────────
function getFallbackResponse(message) {
    const msg = message.toLowerCase();

    if (/\b(hello|hi|namaste)\b/i.test(message)) {
        return "Hello! Namaste! Welcome to vaidyachain. How can I help you today?";
    }
    if (/\b(trace|track)\b/i.test(message)) {
        return "vaidyachain uses blockchain technology to track Ayurvedic herbs from farm to consumer. You can trace any product by entering its ID in the Consumer Portal or scanning the QR code on the product packaging.";
    }
    if (/\b(farmer|farm)\b/i.test(message)) {
        return "As a farmer, you can register herb collections with GPS location. Simply select the herb type, enter the quantity, and the system creates a blockchain record with a unique batch ID.";
    }
    if (/\b(lab|test|quality)\b/i.test(message) && !/batch/i.test(msg)) {
        return "The Testing Lab dashboard allows quality testers to verify herb batches. They can check moisture content, pesticides, heavy metals, and microbial count. Approved batches can then be used for manufacturing.";
    }
    if (/\b(manufacturer|product)\b/i.test(message)) {
        return "Manufacturers can create products from approved herb batches. After entering batch details and product information, the system generates a unique QR code that consumers can scan to verify authenticity.";
    }
    if (/\b(consumer|verify)\b/i.test(message)) {
        return "Consumers can verify product authenticity by scanning the QR code or entering the Product ID in the Consumer Portal. This shows the complete journey from farm through lab testing to manufacturing.";
    }
    if (/\b(blockchain)\b/i.test(message)) {
        return "Blockchain technology creates an immutable, transparent record of every transaction. In vaidyachain, each step (collection, testing, manufacturing) is recorded, ensuring complete traceability and trust.";
    }

    // Fallback batch lookup (offline)
    if (/batch/i.test(msg)) {
        const result = tryOfflineBatchQuery(message);
        if (result) return result;
    }

    return "Thank you for your question! For detailed information, please explore the different dashboards. Each section — Farmer, Lab, Manufacturer, and Consumer — has specific tools to help you.\n\n(Note: The AI service is currently unreachable; responses are automated.)";
}

// ─── Global exports ───────────────────────────────────────────────────────────
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.sendMessage = sendMessage;

// Re-build context whenever the user role changes (e.g. after login)
const _origApplySidebar = window.applyRoleBasedSidebar;
if (typeof _origApplySidebar === 'function') {
    window.applyRoleBasedSidebar = function (role) {
        _origApplySidebar(role);
        agentContext = null; // Invalidate cached context
        if (isChatOpen) buildAgentContext();
    };
}
