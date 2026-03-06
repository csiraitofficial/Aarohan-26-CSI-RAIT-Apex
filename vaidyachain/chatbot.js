/**
 * vaidyachain - AI Chatbot Assistant
 * Provides FAQ and project information.
 */

export const Chatbot = {
    responses: {
        "blockchain": "vaidyachain uses a distributed ledger to ensure that herb batch records cannot be altered or deleted. Every block contains a hash of the previous one, creating an immutable Digital Trail.",
        "purity": "We simulate spectroscopic analysis to verify herbal purity. Only batches with a 95% purity match or higher are passed by the Lab Testing Dashboard.",
        "farmers": "Farmers use the platform to tag their collections with GPS coordinates. This ensures we know exactly which forest or farm the herb originated from.",
        "default": "I'm the vaidyachain AI. I can help you understand traceability, lab testing, and blockchain security in our Ayurvedic supply chain."
    },

    ask(question) {
        const q = question.toLowerCase();
        for (let key in this.responses) {
            if (q.includes(key)) return this.responses[key];
        }
        return this.responses['default'];
    }
};

window.Chatbot = Chatbot;
