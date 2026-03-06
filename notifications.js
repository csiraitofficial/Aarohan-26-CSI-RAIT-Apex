// notifications.js
// Custom Toast Notification System

class NotificationSystem {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.bellCounter = document.getElementById('notification-count');
        this.count = 0;
        this.unreadCount = 0;
    }

    /**
     * Show a new toast notification
     * @param {string} message - The main notification text
     * @param {string} type - 'success', 'error', 'info'
     * @param {string} title - Optional title, defaults based on type
     */
    show(message, type = 'info', title = null) {
        if (!this.container) return;

        const id = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.id = id;

        // Default icons
        let icon = 'ph-info';
        if (type === 'success') icon = 'ph-check-circle';
        if (type === 'error') icon = 'ph-warning-circle';

        // Default title
        if (!title) {
            if (type === 'success') title = 'Success';
            else if (type === 'error') title = 'Error';
            else title = 'Notification';
        }

        toast.innerHTML = `
            <i class="ph ${icon} toast-icon"></i>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="toast-close" onclick="document.getElementById('${id}').remove()">
                <i class="ph ph-x"></i>
            </button>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            if (document.getElementById(id)) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);

        this.updateBadge();
    }

    updateBadge() {
        if (this.bellCounter) {
            this.unreadCount++;
            this.bellCounter.textContent = this.unreadCount;
            this.bellCounter.style.display = 'flex';
        }
    }

    resetBadge() {
        if (this.bellCounter) {
            this.unreadCount = 0;
            this.bellCounter.textContent = '0';
            this.bellCounter.style.display = 'none';
        }
    }
}

// Expose to window globally 
const notifier = new NotificationSystem();
window.showNotification = (msg, type, title) => notifier.show(msg, type, title);

// Tie to bell click
document.addEventListener("DOMContentLoaded", () => {
    const bell = document.getElementById('notification-bell');
    if (bell) {
        bell.addEventListener('click', () => {
            notifier.resetBadge();
            notifier.show('You are up to date.', 'info');
        });
    }
});
