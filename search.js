// search.js
// Global Search Functionality

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('global-search');
    const searchIcon = document.querySelector('.search-icon'); // The "search button"

    if (searchInput) {
        // Core search logic grouped into a function
        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();

            // Typical item containers across all dashboards
            const searchSelectors = [
                '.herb-card',
                '.batch-card',
                '.market-record-card',
                '.product-card',
                '.supplier-card',
                '.transaction-card',
                '.consumer-timeline-item',
                'table tbody tr'
            ];

            // Only search inside dashboard elements if available, else entire document
            const searchContext = document.getElementById('dashboard-container') || document;
            const elements = searchContext.querySelectorAll(searchSelectors.join(', '));

            if (query.length > 0) {
                elements.forEach(el => {
                    // Skip elements that contain a <form> (usually dashboard input areas)
                    if (el.querySelector('form')) {
                        return;
                    }

                    // For table rows, skip headers just in case
                    if (el.tagName === 'TR' && el.querySelector('th')) {
                        return;
                    }

                    // Check if the text matches
                    if (el.textContent.toLowerCase().includes(query)) {
                        el.style.display = ''; // revert to CSS default
                    } else {
                        el.style.display = 'none'; // hide it
                    }
                });
            } else {
                // Reset search when input is empty
                elements.forEach(el => {
                    if (el.querySelector('form')) return;
                    if (el.tagName === 'TR' && el.querySelector('th')) return;

                    el.style.display = ''; // Reset to original display
                });
            }
        };

        // Trigger on input
        searchInput.addEventListener('input', performSearch);

        // Trigger on enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Trigger when clicking the search icon
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.addEventListener('click', performSearch);
        }
    }
});
