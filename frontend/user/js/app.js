document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const contentArea = document.getElementById('content-area');
    const mainNav = document.getElementById('main-nav');
    const ratingModal = document.getElementById('rating-modal');
    const modalStoreName = document.getElementById('modal-store-name');
    const modalStarsContainer = document.getElementById('modal-stars-container');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    const modalMessageContainer = document.getElementById('modal-message-container');

    // --- APP STATE ---
    let currentRating = 0;
let currentStoreId = null; // ADD THIS
    const API_BASE_URL = 'http://localhost:5000/api';

    // --- CORE FUNCTIONS ---
    const getToken = () => localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/user/login.html';
    };

    const showModalMessage = (message, isError = false) => {
        modalMessageContainer.textContent = message;
        modalMessageContainer.className = `mt-4 mb-2 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`;
    };

    const openRatingModal = (storeId, storeName) => {
        // Store the ID directly on the modal element itself. This is very reliable.
        ratingModal.dataset.storeId = storeId;
        currentRating = 0;
        modalStoreName.textContent = `Rate: ${storeName}`;
        modalMessageContainer.textContent = '';
        updateModalStars(0);
        ratingModal.classList.remove('modal-hidden');
    };

    const closeRatingModal = () => {
        ratingModal.classList.add('modal-hidden');
    };

    const updateModalStars = (rating) => {
        currentRating = rating;
        modalStarsContainer.querySelectorAll('i').forEach(star => {
            const starValue = parseInt(star.dataset.value);
            star.classList.toggle('fas', starValue <= rating);
            star.classList.toggle('far', starValue > rating);
            star.classList.toggle('text-yellow-500', starValue <= rating);
        });
    };

    async function submitRating() {
        // Read the ID directly from the modal element.
        const storeId = ratingModal.dataset.storeId;
        if (currentRating === 0) {
            showModalMessage('Please select a rating (1-5 stars).', true);
            return;
        }
        if (!storeId) {
            showModalMessage('Error: Store ID is missing. Please try again.', true);
            return;
        }

        const token = getToken();
        submitRatingBtn.disabled = true;
        submitRatingBtn.textContent = 'Submitting...';
        showModalMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/stores/${storeId}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ rating: currentRating }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit rating.');
            }
            showModalMessage('Rating submitted successfully!', false);
            setTimeout(() => {
                closeRatingModal();
                fetchStores();
            }, 1500);
        } catch (error) {
            showModalMessage(error.message, true);
        } finally {
            submitRatingBtn.disabled = false;
            submitRatingBtn.textContent = 'Submit Rating';
        }
    }

    async function fetchStores() {
        const token = getToken();
        if (!token) {
            contentArea.innerHTML = '<p class="text-center">Please <a href="/user/login.html" class="text-blue-600">log in</a> to view stores.</p>';
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/stores`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch stores.');
            const stores = await response.json();
            renderStores(stores);
        } catch (error) {
            contentArea.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
        }
    }
    
    function renderStores(stores) {

        if (!stores || !stores.length) {
            contentArea.innerHTML = '<p>No stores found.</p>';
            return;
        }
        contentArea.innerHTML = `
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Registered Stores</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${stores.map(store => {
                    const userRatingHtml = store.userSubmittedRating > 0 ? renderStars(store.userSubmittedRating, 'text-blue-500') : `<p class="text-gray-500 text-sm">You haven't rated this store yet.</p>`;
                    const averageRating = store.averageRating ? parseFloat(store.averageRating).toFixed(1) : 'N/A';
      
             
                    return `
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div class="p-6">
                                <h3 class="text-xl font-bold mb-2">${store.name}</h3>
                                <p class="text-gray-600 mb-4 text-sm"><i class="fas fa-map-marker-alt mr-2"></i>${store.address}</p>
                                <div class="mb-4">
                                    <p class="text-sm font-medium text-gray-700 mb-1">Overall Rating</p>
                                    <div class="flex items-center">
                                        ${renderStars(averageRating)}
                                        <span class="text-gray-600 text-sm ml-2">${averageRating} (${store.numRatings || 0} reviews)</span>
                                    </div>
                                </div>
                                <div class="mb-4">
                                     <p class="text-sm font-medium text-gray-700 mb-1">Your Rating</p>
                                     ${userRatingHtml}
                                </div>
                                <button class="rate-btn bg-blue-600 text-white text-center block w-full py-2 rounded-lg hover:bg-blue-700" data-store-id="${store._id}" data-store-name="${store.name}">
                                    Rate or Modify
                                </button>
                            </div>
                        </div>`;
                }).join('')}
            </div>`;
        
        // After rendering, attach listeners to the new "Rate or Modify" buttons
        document.querySelectorAll('.rate-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                openRatingModal(e.currentTarget.dataset.storeId, e.currentTarget.dataset.storeName);
            });
        });
    }
    
    function renderStars(rating, colorClass = 'text-yellow-500') {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="${i <= rating ? 'fas' : 'far'} fa-star"></i>`;
        }
const feedbackRoutes = require("./routes/feedback");
app.use("/api/feedback", feedbackRoutes);

        return `<div class="flex items-center ${colorClass}">${stars}</div>`;
    }

    function updateNav() {
        const token = getToken();
        if (token) {
            mainNav.innerHTML = `<a href="#" id="logout-btn" class="text-gray-600 hover:text-blue-600 px-4">Logout</a>`;
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            mainNav.innerHTML = `
                <a href="/user/login.html" class="text-gray-600 hover:text-blue-600 px-4">Login</a>
                <a href="/user/register.html" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</a>
            `;
        }
    }

    // --- INITIALIZATION & EVENT LISTENERS ---
    // Attach listeners for the modal buttons and stars ONCE when the page loads.
    submitRatingBtn.addEventListener('click', submitRating);
    closeModalBtn.addEventListener('click', closeRatingModal);
    modalStarsContainer.addEventListener('click', (e) => {
        if (e.target.dataset.value) {
            updateModalStars(parseInt(e.target.dataset.value));
        }
    });

    // Load the initial page content
    updateNav();
    fetchStores();
});
