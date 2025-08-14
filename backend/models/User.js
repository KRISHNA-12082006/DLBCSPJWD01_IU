// backend/models/User.js

// Import Mongoose for schema and model definition
import mongoose from "mongoose";

// Define User schema with essential fields
// Each user has a unique ID, name, email, password, and counts for collections, sections, and flashcards
const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generated ObjectId for user
    name: { type: String, required: true }, // User name
    email: { type: String, required: true, unique: true }, // Unique user email
    password: { type: String, required: true }, // User password (hashed)
    createdAt: { type: Date, default: Date.now }, // Account creation date
    totalCollections: { type: Number, required: true, default: 0 }, // Collection count
    totalSections: { type: Number, required: true, default: 0 }, // Section count
    totalFlashcards: { type: Number, required: true, default: 0 } // Flashcard count
});


export default mongoose.model("User", UserSchema);