// backend/routes/aiRoutes.js

// Import dependencies
import express from "express";
import axios from "axios";
import { AI_API, AI_API_KEY } from "../config.js";

/**
 * AI routes for handling chat interactions with the OpenRouter API.
 * @module routes/aiRoutes
 */
const router = express.Router();

/**
 * POST /chat - Handles AI tutor chat requests.
 * @name POST/api/ai/chat
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Array} req.body.updatedLog - Array of chat messages
 * @param {Object} res - Express response object
 * @returns {Object} AI response data or error message
 */
router.post("/chat", async (req, res) => {
    // Validate request body
    const { updatedLog } = req.body;
    if (!updatedLog || !Array.isArray(updatedLog)) {
        return res.status(400).json({ error: "Invalid or missing chat log" });
    }

    try {
        // Make request to OpenRouter API
        const aiRes = await axios.post(
            AI_API,
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    { role: "system", content: "You are an academic tutor. Explain clearly." },
                    ...updatedLog,
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AI_API_KEY}`,
                },
            }
        );

        // Send AI response
        res.json(aiRes.data);
    } catch (err) {
        // Handle errors with detailed response
        const errorMessage = err.response?.data?.error || err.message || "Internal server error";
        console.error("❌ AI route error:", errorMessage);
        res.status(500).json({ error: errorMessage });
    }
});

// Approach Explanation:
// This module defines API routes for AI tutor functionality:
// - Uses Express Router to handle POST requests to /api/ai/chat.
// - Integrates with OpenRouter API via axios for AI-powered responses.
// - Validates input to ensure updatedLog is a valid array.
// - Returns AI responses or detailed error messages.

export default router;