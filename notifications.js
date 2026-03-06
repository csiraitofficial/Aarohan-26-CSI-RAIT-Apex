// Toast Notifications System
// Provides user feedback through toast messages

// Toast configuration
const TOAST_CONFIG = {
  duration: 3000,
  maxToasts: 5,
  position: 'top-right'
};

// Toast container
let toastContainer = null;

// Initialize notifications
function initNotifications() {
  // Create toast container if it doesn't exist
  toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

// Show toast message
function showToast(message, type = 'info', duration = null) {
  if (!toastContainer) initNotifications();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
    </div>
    <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
      <span class="ph ph-x"></span>
    </button>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Auto-remove after duration
  const removeDuration = duration || TOAST_CONFIG.duration;
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, removeDuration);
  
  // Limit number of toasts
  const toasts = toastContainer.querySelectorAll('.toast');
  if (toasts.length > TOAST_CONFIG.maxToasts) {
    toasts[0].remove();
  }
}

// Success toast
function showSuccess(message, duration) {
  showToast(message, 'success', duration);
}

// Error toast
function showError(message, duration) {
  showToast(message, 'error', duration);
}

// Warning toast
function showWarning(message, duration) {
  showToast(message, 'warning', duration);
}

// Info toast
function showInfo(message, duration) {
  showToast(message, 'info', duration);
}

// Export functions for global use
window.notifications = {
  init: initNotifications,
  show: showToast,
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo
};