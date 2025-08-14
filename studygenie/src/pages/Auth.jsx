// Import routing, logo, and auth services
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconImg from '../../public/icon.png';
import { registerUser, loginUser } from '../services/authService';

/**
 * Auth component renders a form for user sign-in and sign-up.
 * @component
 * @returns {JSX.Element} Authentication page
 */
export default function Auth() {
    const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
    const navigate = useNavigate(); // Navigation hook

    // Redirect authenticated user to profile
    useEffect(() => {
        if (user) navigate("/profile");
    }, [user, navigate]);

    const [isSignup, setIsSignup] = useState(false); // Toggle sign-in/sign-up
    const [formData, setFormData] = useState({ name: '', email: '', password: '' }); // Form state

    // Update form data on input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignup) {
            await registerUser(formData, navigate); // Register user
        } else {
            await loginUser(formData, navigate); // Log in user
        }
        setFormData({ name: '', email: '', password: '' }); // Reset form
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-sky-700 text-white px-4">
            {/* Navigation bar */}
            <nav className="fixed top-0 left-0 z-50 w-full bg-white/10 backdrop-blur-md">
                <div className="container mx-auto flex justify-between items-center p-3">
                    <Link to="/" className="text-2xl font-bold text-blue-400 flex items-center">
                        <img src={IconImg} alt="StudyGenie Logo" className="w-8 h-8 mr-2" />
                        StudyGenie
                    </Link>
                </div>
            </nav>

            {/* Auth form */}
            <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 backdrop-blur-sm">
                <h2 className="text-center text-3xl font-bold">
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>

                {/* Toggle buttons */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsSignup(false)}
                        className={`px-4 py-2 rounded ${!isSignup ? 'bg-white text-black' : 'bg-transparent border border-white'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsSignup(true)}
                        className={`px-4 py-2 rounded ${isSignup ? 'bg-white text-black' : 'bg-transparent border border-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form inputs */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
                    >
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                {/* Toggle link */}
                <p className="text-center text-sm text-gray-300">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        className="underline"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
}

// Approach Explanation:
// The Auth component provides a unified interface for user authentication:
// - Uses React hooks (useState, useEffect) for state and navigation.
// - Integrates with authService.js for sign-in and sign-up operations.
// - Toggles between sign-in and sign-up modes with dynamic form fields.
// - Redirects authenticated users to the profile page.
// - Uses Tailwind CSS for responsive, modern styling with a gradient background.