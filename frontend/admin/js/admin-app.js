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
        // Redirect to the main login page
        window.location.href = '../user/login.html';
    };

    // --- RENDER FUNCTIONS ---

    /**
     * Renders the sidebar navigation.
     */
    const renderSidebar = () => {
        sidebarContainer.innerHTML = `
            <div class="p-6 text-2xl font-bold border-b border-gray-700">
                Admin Panel
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <a href="#dashboard" class="nav-link flex items-center px-4 py-2 rounded-lg">
                    <i class="fas fa-tachometer-alt w-6"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#users" class="nav-link flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
                    <i class="fas fa-users w-6"></i>
                    <span>Users</span>
                </a>
                <a href="#stores" class="nav-link flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
                    <i class="fas fa-store w-6"></i>
                    <span>Stores</span>
                </a>
            </nav>
            <div class="p-4 border-t border-gray-700">
                <a href="#" id="logout-btn" class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700">
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
     * Renders the dashboard view with stats from the API.
     * @param {object} stats - The statistics object from the API.
     */
    const renderDashboardView = (stats) => {
        contentArea.innerHTML = `
            <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <p class="text-sm font-medium text-gray-500">Total Users</p>
                    <p class="text-3xl font-bold">${stats.totalUsers}</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <p class="text-sm font-medium text-gray-500">Total Stores</p>
                    <p class="text-3xl font-bold">${stats.totalStores}</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <p class="text-sm font-medium text-gray-500">Total Ratings</p>
                    <p class="text-3xl font-bold">${stats.totalRatings}</p>
                </div>
            </section>
        `;
    };

    /**
     * Renders the user management view with a list of users.
     * @param {Array} users - An array of user objects from the API.
     */
    const renderUsersView = (users) => {
        const userRows = users.map(user => {
            let roleBadge;
            switch (user.role) {
                case 'Admin':
                    roleBadge = `<span class="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">${user.role}</span>`;
                    break;
                case 'Store Owner':
                    roleBadge = `<span class="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">${user.role}</span>`;
                    break;
                default:
                    roleBadge = `<span class="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">${user.role}</span>`;
            }
            return `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-4">${user.name}</td>
                    <td class="p-4">${user.email}</td>
                    <td class="p-4">${user.address}</td>
                    <td class="p-4">${roleBadge}</td>
                </tr>
            `;
        }).join('');

        contentArea.innerHTML = `
            <section class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">User Management</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-50 border-b">
                                <th class="p-4 font-semibold">Name</th>
                                <th class="p-4 font-semibold">Email</th>
                                <th class="p-4 font-semibold">Address</th>
                                <th class="p-4 font-semibold">Role</th>
                            </tr>
                        </thead>
                        <tbody>${userRows}</tbody>
                    </table>
                </div>
            </section>
        `;
    };
    
     const renderStoresView = (stores) => {
        const storeRows = stores.map(store => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4">${store.name}</td>
                <td class="p-4">${store.email}</td>
                <td class="p-4">${store.address}</td>
                <td class="p-4 text-yellow-500">${parseFloat(store.averageRating || 0).toFixed(2)}</td>
            </tr>
        `).join('');

        contentArea.innerHTML = `
            <section class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4">Store Management</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-50 border-b">
                                <th class="p-4 font-semibold">Name</th>
                                <th class="p-4 font-semibold">Email</th>
                                <th class="p-4 font-semibold">Address</th>
                                <th class="p-4 font-semibold">Avg. Rating</th>
                            </tr>
                        </thead>
                        <tbody>${storeRows}</tbody>
                    </table>
                </div>
            </section>
        `;
    };

    // --- API CALLS ---
    const fetchDashboardStats = async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch dashboard stats.');
        return response.json();
    };

    const fetchUsers = async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch users.');
        return response.json();
    };
    
    const fetchStores = async (token) => {
        const response = await fetch(`${API_BASE_URL}/admin/stores`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch stores.');
        return response.json();
    };


    // --- ROUTER & NAVIGATION ---
    const routes = {
        '#dashboard': { title: 'Dashboard Overview', render: renderDashboardView, fetch: fetchDashboardStats },
        '#users': { title: 'User Management', render: renderUsersView, fetch: fetchUsers },
        '#stores': { title: 'Store Management', render: renderStoresView, fetch: fetchStores },
    };

    const navigate = async () => {
        const token = getToken();
        if (!token) {
            logout();
            return;
        }

        const hash = window.location.hash || '#dashboard';
        const route = routes[hash] || routes['#dashboard'];

        pageTitle.textContent = route.title;
        contentArea.innerHTML = `<p>Loading...</p>`; // Show loading state

        try {
            const data = await route.fetch(token);
            route.render(data);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
            } else {
                contentArea.innerHTML = `<p class="text-red-500">${error.message}</p>`;
            }
        }

        // Update active link style
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('bg-gray-700', 'text-white');
            if (link.getAttribute('href') === hash) {
                link.classList.add('bg-gray-700', 'text-white');
            }
        });
    };

    // --- INITIALIZATION ---
    function init() {
        renderSidebar();
        window.addEventListener('hashchange', navigate);
        navigate(); // Initial load
    }

    init();
});
