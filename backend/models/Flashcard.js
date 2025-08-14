// backend/models/Flashcard.js

// Import Mongoose for schema and model definition
import mongoose from "mongoose";

// Define Flashcard schema with essential fields
// Each flashcard belongs to a section and a user, with a question and answer
const FlashcardSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Custom flashcard ID
    sectionId: { type: String, ref: 'Section', required: true }, // Section reference
    userId: { type: String, ref: 'User', required: true }, // User reference
    question: { type: String, required: true }, // Flashcard question
    answer: { type: String, default: '', required: true }, // Flashcard answer
    bookmarked: { type: Boolean, default: false, required: true } // Bookmark status
}, { _id: false }) // Disable auto-generated _id


export default mongoose.model("Flashcard", FlashcardSchema)