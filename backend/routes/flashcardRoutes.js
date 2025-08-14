// backend/routes/flashcardRoutes.js

// This file defines the routes for handling flashcards in the application.

// Import router and flashcard controller functions
import { router } from '../config.js'
import {
    getFlashcardsBySectionId,
    getBookmarkedFlashcards,
    createNewFlashcardsForSectionId,
    editFlashcard,
    deleteFlashcardById
} from "../controllers/flashcardController.js";

// Define routes for flashcards
router.post("/flashcards", getFlashcardsBySectionId); // Route to get all flashcards for a section
router.post("/bookmarked", getBookmarkedFlashcards); // Route to get all bookmarked flashcards
router.post("/newFlashcard", createNewFlashcardsForSectionId); // Route to create new flashcards for a section
router.put("/editFlashcard", editFlashcard); // Route to edit an existing flashcard
router.delete("/deleteFlashcard", deleteFlashcardById) // Route to delete a flashcard by its ID


// Export the router
export default router;