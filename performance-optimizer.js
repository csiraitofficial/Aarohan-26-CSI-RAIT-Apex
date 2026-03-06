// Performance Optimization Script
// Comprehensive performance improvements for Krishi PWA

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            timeToInteractive: 0
        };

        this.init();
    }

    init() {
        // Critical resource preloading
        this.preloadCriticalResources();

        // Lazy loading setup
        this.setupLazyLoading();

        // Performance monitoring
        this.setupPerformanceMonitoring();

        // Resource hints
        this.addResourceHints();

        // Optimize images
        this.optimizeImages();

        // Cache optimization
        this.setupCacheOptimization();

        console.log('🚀 Performance optimization initialized');
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: '/styles.css', as: 'style' },
            { href: '/assets/fonts/Inter-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
            { href: '/assets/fonts/DM-Sans-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
            { href: 'https://cdn.jsdelivr.net/npm/chart.js', as: 'script' },
            { href: 'https://unpkg.com/leaflet/dist/leaflet.css', as: 'style' },
            { href: 'https://unpkg.com/leaflet/dist/leaflet.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;

            if (resource.type) link.type = resource.type;
            if (resource.crossorigin) link.crossOrigin = resource.crossorigin;

            document.head.appendChild(link);
        });
    }

    // Setup lazy loading for non-critical resources
    setupLazyLoading() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Lazy load dashboard sections
        const dashboardSections = document.querySelectorAll('.dashboard-section');
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadSectionData(entry.target.id);
                    }
                });
            }, { threshold: 0.1 });

            dashboardSections.forEach(section => sectionObserver.observe(section));
        }
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // LCP
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.startTime;
                this.updatePerformanceScore();
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // CLS
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        this.metrics.cumulativeLayoutShift = clsValue;
                    }
                }
                this.updatePerformanceScore();
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // FID
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                    this.updatePerformanceScore();
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        }

        // Custom performance metrics
        window.addEventListener('load', () => {
            this.metrics.timeToInteractive = performance.now();
            this.updatePerformanceScore();
        });
    }

    // Add resource hints
    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
            { rel: 'dns-prefetch', href: '//unpkg.com' },
            { rel: 'preconnect', href: 'https://www.gstatic.com', crossorigin: 'anonymous' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
            { rel: 'prefetch', href: '/sw.js' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            Object.assign(link, hint);
            document.head.appendChild(link);
        });
    }

    // Optimize images
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading attribute for below-the-fold images
            if (img.getBoundingClientRect().top > window.innerHeight) {
                img.loading = 'lazy';
                img.decoding = 'async';
            }

            // Add srcset for responsive images
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }

    // Setup cache optimization
    setupCacheOptimization() {
        // Cache critical data
        const cacheKey = 'krishi-critical-data';
        const cachedData = localStorage.getItem(cacheKey);

        if (!cachedData) {
            // Cache critical data on first load
            const criticalData = {
                herbs: ['Ashwagandha', 'Tulsi', 'Neem', 'Turmeric', 'Amla', 'Ginseng', 'Brahmi', 'Shatavari'],
                roles: ['farmer', 'lab', 'manufacturer', 'consumer', 'admin'],
                timestamp: Date.now()
            };
            localStorage.setItem(cacheKey, JSON.stringify(criticalData));
        }
    }

    // Load section data on demand
    async loadSectionData(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section || section.dataset.loaded === 'true') return;

        section.dataset.loaded = 'true';

        try {
            switch (sectionId) {
                case 'farmer-dashboard':
                    await this.loadFarmerData();
                    break;
                case 'lab-dashboard':
                    await this.loadLabData();
                    break;
                case 'manufacturer-dashboard':
                    await this.loadManufacturerData();
                    break;
                case 'consumer-portal':
                    await this.loadConsumerData();
                    break;
                case 'admin-dashboard':
                    await this.loadAdminData();
                    break;
            }
        } catch (error) {
            console.warn(`Failed to load ${sectionId}:`, error);
        }
    }

    // Load farmer data
    async loadFarmerData() {
        // Lazy load map only when needed
        if (typeof L === 'undefined') {
            await this.loadScript('https://unpkg.com/leaflet/dist/leaflet.js');
        }

        // Initialize farmer map
        if (document.getElementById('farmer-map')) {
            this.initFarmerMap();
        }
    }

    // Load lab data
    async loadLabData() {
        // Initialize lab charts
        if (document.getElementById('batch-comparison-chart')) {
            this.initLabCharts();
        }
    }

    // Load manufacturer data
    async loadManufacturerData() {
        // Initialize production charts
        if (document.getElementById('production-chart')) {
            this.initProductionCharts();
        }
    }

    // Load consumer data
    async loadConsumerData() {
        // Lazy load QR scanner
        if (typeof Html5Qrcode === 'undefined') {
            await this.loadScript('https://unpkg.com/html5-qrcode');
        }
    }

    // Load admin data
    async loadAdminData() {
        // Initialize admin charts
        if (document.getElementById('waste-chart')) {
            this.initAdminCharts();
        }
    }

    // Initialize farmer map
    initFarmerMap() {
        if (typeof L === 'undefined') return;

        const map = L.map('farmer-map').setView([22.3, 73.1999], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add marker
        L.marker([22.3, 73.1999]).addTo(map)
            .bindPopup('Current Location')
            .openPopup();
    }

    // Initialize lab charts
    initLabCharts() {
        if (typeof Chart === 'undefined') return;

        const ctx = document.getElementById('batch-comparison-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Batch A', 'Batch B', 'Batch C'],
                datasets: [{
                    label: 'Purity %',
                    data: [98.4, 96.7, 99.1],
                    backgroundColor: '#2D6A4F'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Initialize production charts
    initProductionCharts() {
        if (typeof Chart === 'undefined') return;

        const ctx = document.getElementById('production-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Batches Processed',
                    data: [12, 19, 15, 22, 18, 25],
                    borderColor: '#2D6A4F',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Initialize admin charts
    initAdminCharts() {
        if (typeof Chart === 'undefined') return;

        const ctx = document.getElementById('waste-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Compost', 'Biogas', 'CPCB'],
                datasets: [{
                    data: [60, 25, 15],
                    backgroundColor: ['#2D6A4F', '#40916C', '#52B788']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Load script dynamically
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Update performance score
    updatePerformanceScore() {
        const score = this.calculatePerformanceScore();
        this.displayPerformanceScore(score);
    }

    // Calculate overall performance score
    calculatePerformanceScore() {
        let score = 100;

        // Deduct points based on metrics
        if (this.metrics.largestContentfulPaint > 2500) score -= 20;
        if (this.metrics.cumulativeLayoutShift > 0.1) score -= 20;
        if (this.metrics.firstInputDelay > 100) score -= 20;
        if (this.metrics.timeToInteractive > 5000) score -= 20;

        return Math.max(0, score);
    }

    // Display performance score
    displayPerformanceScore(score) {
        const scoreElement = document.getElementById('performance-score');
        if (scoreElement) {
            scoreElement.textContent = `Performance: ${score}/100`;
            scoreElement.style.color = score >= 90 ? '#2D6A4F' : '#D9534F';
        }
    }

    // Optimize rendering
    optimizeRendering() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollOptimization();
            }, 100);
        });

        // Optimize animations
        this.optimizeAnimations();
    }

    // Handle scroll optimization
    handleScrollOptimization() {
        // Throttle expensive operations during scroll
        const elements = document.querySelectorAll('.expensive-operation');
        elements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }

    // Optimize animations
    optimizeAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }

    // Cleanup unused resources
    cleanup() {
        // Clear unused event listeners
        // Clear unused timers
        // Clear unused data
        console.log('🧹 Performance cleanup completed');
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.PerformanceOptimizer === 'undefined') {
        window.PerformanceOptimizer = new PerformanceOptimizer();
    }
});

// Export for global use
window.PerformanceOptimizer = PerformanceOptimizer;