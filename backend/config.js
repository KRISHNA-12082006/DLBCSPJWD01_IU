// backend/config.js

/*
  This file contains the configuration for the Express server, including environment variables, CORS settings,
  and MongoDB connection. It exports the necessary constants and functions to be used in the server setup.
*/

// Import required modules for server setup, CORS, environment variables, and MongoDB
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


// Load environment variables
dotenv.config();
const PORT = process.env.PORT;
const AI_API = process.env.AI_API;
const AI_API_KEY = process.env.AI_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const DB_URI = process.env.DB_URI;


// Basic validation
if (!PORT) console.error("❌ PORT is not defined in the environment variables - From config.")
if (!AI_API) console.error("❌ AI_API is not defined in the environment variables - From config.")
if (!AI_API_KEY) console.error("❌ AI_API_KEY is not defined in the environment variables - From config.")
if (!FRONTEND_URL) console.error("❌ FRONTEND is not defined in the environment variables - From config.");
if (!DB_URI) console.error("❌ DB_URI is not defined in the environment variables - From config.");


// Create an Express app
const app = express();

// Middleware to parse JSON bodies for processing incoming JSON data
app.use(express.json());

// Middleware to enable CORS, allowing frontend-backend communication
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// A router for handling API routes: This will be used to define the routes for the application
const router = express.Router();

// This function establishes a connection to the MongoDB database using Mongoose
const connectToDB = () => {
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("✅ MongoDB connected (from config).");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error (from config):", err.message);
    });
};


// Export the functions
export { PORT, AI_API, AI_API_KEY, app, connectToDB, router };