// backend/models/Collection.js

// Import Mongoose for schema and model definition
import mongoose from "mongoose";

// Define Collection schema with essential fields
// Each collection belongs to a user and contains sections and flashcards
const CollectionSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Custom collection ID
    userId: { type: String, ref: 'User', required: true }, // User reference
    title: { type: String, required: true }, // Collection title
    totalNoSections: { type: Number, required: true, default: 0 }, // Section count
    totalNoFlashcards: { type: Number, required: true, default: 0 }, // Flashcard count
    sections: [{ type: String, ref: 'Section', required: true }], // Section ID array
}, { _id: false }); // Disable auto-generated _id


export default mongoose.model('Collection', CollectionSchema);