// search.js
// Global Search Functionality

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('global-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length > 2) {
                // In a real app, you would debounce this call and filter actual data here.
                // For demonstration, we'll just log it and potentially filter visible cards.

                console.log("Searching for:", query);

                const cards = document.querySelectorAll('.herb-card');
                let foundAny = false;

                cards.forEach(card => {
                    if (card.textContent.toLowerCase().includes(query)) {
                        card.style.display = 'block';
                        foundAny = true;
                    } else {
                        // Don't hide the main dashboard forms, just the lists
                        if (!card.querySelector('form')) {
                            card.style.display = 'none';
                        }
                    }
                });
            } else if (query.length === 0) {
                // Reset search
                const cards = document.querySelectorAll('.herb-card');
                cards.forEach(card => card.style.display = 'block');
            }
        });
    }
});
