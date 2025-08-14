// backend/controllers/authController.js

// Authentication Controller for User Management

// Import User model and bcrypt for password hashing and utility for error handling
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import handleError from "../utils/handleError.js";

// Helper for error handling
const throwError = (res, error, action) => handleError(res, error, action, "authController");

// Handle user login
export const loginUser = async (req, res) => {
    const { email, password } = req.body; // Extract credentials

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    try {
        const user = await User.findOne({ email }); // Find user
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password); // Verify password
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json(user); // Return user data
    } catch (error) {
        throwError(res, error, "logging in user"); // Handle errors
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { name, email, password } = req.body; // Extract user details

    if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password required" });

    try {
        const existingUser = await User.findOne({ email }); // Check existing user

        if (existingUser) return res.status(409).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const newUser = new User({ name, email, password: hashedPassword }); // Create user

        await newUser.save(); // Save to database
    
        res.status(201).json(newUser); // Return new user
    } catch (error) {
        throwError(res, error, "creating user"); // Handle errors
    }
};

// Update user details
export const editUser = async (req, res) => {
    const { userId, email, password, newName, newEmail, newPassword } = req.body; // Extract update details

    if (!email || !password) return res.status(400).json({ message: "Email and password required" })

    try {
        const user = await User.findById(userId); // Find user
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password); // Verify password
        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        if (newName) user.name = newName; // Update name
        if (newEmail) user.email = newEmail; // Update email
        if (newPassword) user.password = await bcrypt.hash(newPassword, 10); // Update password

        await user.save(); // Save changes
        res.status(200).json(user); // Return updated user
    } catch (error) {
        throwError(res, error, "editing user"); // Handle errors
    }
};

// Approach Explanation:
// Authentication objectives (login, create, edit) are handled using:
// - Mongoose for MongoDB interactions to perform efficient queries and updates.
// - bcrypt with 10 salt rounds for secure password hashing to protect credentials.
// - Input validation to ensure required fields are provided, preventing invalid requests.
// - Standardized error handling via handleError utility for consistent responses.

// - loginUser verifies email and password, returning user data on success.
// - createUser checks for duplicate emails and stores hashed passwords.
// - editUser verifies credentials before updating.