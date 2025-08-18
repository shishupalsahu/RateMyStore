// This script will handle both the registration and login forms.

document.addEventListener('DOMContentLoaded', () => {
    // --- COMMON VARIABLES ---
    const API_BASE_URL = 'http://localhost:5000/api'; // Your backend server URL
    const messageContainer = document.getElementById('message-container');

    // --- HELPER FUNCTION to display messages ---
    const showMessage = (message, isError = false) => {
        const messageClass = isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
        messageContainer.innerHTML = `<div class="${messageClass} p-4 rounded-lg">${message}</div>`;
    };

    // --- REGISTRATION LOGIC ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            // Clear previous messages
            messageContainer.innerHTML = '';

            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (!response.ok) {
                    // If server responds with an error (e.g., 400, 500)
                    throw new Error(result.message || 'Something went wrong');
                }

                // Handle success
                showMessage('Registration successful! You can now log in.');
                registerForm.reset(); // Clear the form

            } catch (error) {
                // Handle network errors or errors thrown from response check
                showMessage(error.message, true);
            }
        });
    }

    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageContainer.innerHTML = '';

            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Invalid credentials');
                }

                // On successful login, save the token and redirect
                localStorage.setItem('token', result.token);
                showMessage('Login successful! Redirecting...');
                
                // Redirect to the main page after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            } catch (error) {
                showMessage(error.message, true);
            }
        });
    }
});
