// backend/models/Section.js

// Import Mongoose for schema and model definition
import mongoose from "mongoose";

// Define Section schema with essential fields
// Each section belongs to a collection and contains flashcards
const SectionSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Custom section ID
    collectionId: { type: String, ref: 'Collection', required: true }, // Collection reference
    name: { type: String, required: true }, // Section name
    backgroundColor: { type: String }, // Background color
    textColor: { type: String }, // Text color
    totalNoFlashcards: { type: Number, required: true, default: 0 }, // Flashcard count
    flashcards: [{ type: String, ref: 'Flashcard' }] // Flashcard ID array
}, { _id: false }) // Disable auto-generated _id


export default mongoose.model("Section", SectionSchema)