// frontend/services/authServices.js

import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/users`;

// Register new user
export const registerUser = async (userData, navigate) => {
    try {
        await axios.post(`${API_URL}/newUser`, userData);

        if (confirm("✅ New user registered.\nProceed to profile? (Cancel to go to login)")) {
            await loginUser(userData, navigate);
        } else {
            navigate('/login');
        }
    } catch (error) {
        console.error('❌ Error registering user:', error.response?.data || error.message);
        alert('Registration failed. Please try again.');
    }
};

// Login user
export const loginUser = async (userData, navigate) => {
    try {
        const res = await axios.post(`${API_URL}/login`, userData);
        const user = res.data;

        localStorage.setItem('user', JSON.stringify(user));
        console.log('[authServices] Logged in user:', user);
    } catch (error) {
        console.error('❌ Error logging in:', error.response?.data || error.message);
        alert('Login failed. Please check your credentials.');
        navigate('/login');
    }
};

// Logout user
export const logoutUser = (navigate) => {
    console.log('[authServices] Logging out user:', localStorage.getItem('user'));
    localStorage.removeItem('user');
    navigate('/login');
};

// Edit User
export const editUser = async (userData) => {
    try {
        const res = await axios.put(`${API_URL}/editUser`, userData);
        const user = res.data;

        localStorage.setItem('user', JSON.stringify(user));
        console.log('[authServices] Edited user:', user);
        return user;
        } catch (error) {
        console.error('❌ Error editing user:', error.response?.data || error.message);
        alert('Edit failed. Please try again.');
    }
};
