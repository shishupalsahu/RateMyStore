document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const sidebarContainer = document.getElementById('sidebar-container');
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title');

    // --- API & AUTH ---
    const API_BASE_URL = 'http://localhost:5000/api';
    const getToken = () => localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        // Redirect to the main login page for all users
        window.location.href = '../user/login.html';
    };
    
    // --- RENDER FUNCTIONS ---

    /**
     * Renders the sidebar navigation.
     */
    const renderSidebar = () => {
        sidebarContainer.innerHTML = `
            <div class="p-6 text-2xl font-bold border-b border-slate-700">
                Business Panel
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <a href="#dashboard" class="nav-link flex items-center px-4 py-2 rounded-lg bg-slate-700 text-white">
                    <i class="fas fa-tachometer-alt w-6"></i>
                    <span>Dashboard</span>
                </a>
                <!-- Add other links for future features if needed -->
            </nav>
            <div class="p-4 border-t border-slate-700">
                <a href="#" id="logout-btn" class="flex items-center px-4 py-2 rounded-lg hover:bg-slate-700">
                    <i class="fas fa-sign-out-alt w-6"></i>
                    <span>Logout</span>
                </a>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    };

    /**
     * Renders the main dashboard view with data from the API.
     * @param {object} data - The dashboard data from the API.
     */
    const renderDashboard = (data) => {
        const averageRating = data.averageRating ? parseFloat(data.averageRating).toFixed(2) : 'N/A';
        
        const ratingsList = data.ratings.map(rating => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4">${rating.user.name}</td>
                <td class="p-4">${rating.user.email}</td>
                <td class="p-4 text-yellow-500">${'<i class="fas fa-star"></i>'.repeat(rating.rating)}</td>
            </tr>
        `).join('');

        contentArea.innerHTML = `
            <!-- Analytics Cards -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <p class="text-sm font-medium text-gray-500">Average Store Rating</p>
                    <p class="text-3xl font-bold">${averageRating}</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <p class="text-sm font-medium text-gray-500">Total Ratings Received</p>
                    <p class="text-3xl font-bold">${data.ratings.length}</p>
                </div>
            </section>

            <!-- Ratings Table -->
            <section class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">User Ratings</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-50 border-b">
                                <th class="p-4 font-semibold">User Name</th>
                                <th class="p-4 font-semibold">User Email</th>
                                <th class="p-4 font-semibold">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ratingsList}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
        pageTitle.textContent = 'Dashboard';
    };

    // --- API CALLS ---

    /**
     * Fetches the dashboard data for the logged-in store owner.
     */
    async function fetchDashboardData() {
        const token = getToken();
        if (!token) {
            // If no token, redirect to login
            logout();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/owners/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401 || response.status === 403) {
                // Unauthorized or forbidden, likely a bad token or wrong user role
                logout();
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data.');
            }

            const data = await response.json();
            renderDashboard(data);

        } catch (error) {
            contentArea.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
        }
    }

    // --- INITIALIZATION ---
    function init() {
        renderSidebar();
        fetchDashboardData();
    }

    init();
});
