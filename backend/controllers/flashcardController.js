// backend/controllers/flashcardController.js

// Import models and error handling utility
import Flashcard from "../models/Flashcard.js";
import Section from "../models/Section.js";
import Collection from "../models/Collection.js";
import User from "../models/User.js";
import handleError from "../utils/handleError.js";

// Helper for error handling
const throwError = (res, error, action) => handleError(res, error, action, "flashcardController");

// Fetch flashcards by section ID
export const getFlashcardsBySectionId = async (req, res) => {
    const { sectionId, userId } = req.body; // Extract section and user IDs

    if (!sectionId || !userId) return res.status(400).json({ message: "sectionId and userId required" });

    try {
        const flashcards = await Flashcard.find({ sectionId, userId }); // Query flashcards

        res.status(200).json(flashcards || []); // Return flashcards or empty array
    } catch (error) {
        throwError(res, error, "fetching flashcards"); // Handle errors
    }
};

// Fetch bookmarked flashcards
export const getBookmarkedFlashcards = async (req, res) => {
    const { userId } = req.body; // Extract user ID

    if (!userId) return res.status(400).json({ message: "userId required" });

    try {
        const flashcards = await Flashcard.find({ bookmarked: true, userId }); // Query bookmarked flashcards

        res.status(200).json(flashcards); // Return bookmarked flashcards
    } catch (error) {
        throwError(res, error, "fetching bookmarked flashcards"); // Handle errors
    }
};

// Create new flashcards under a section
export const createNewFlashcardsForSectionId = async (req, res) => {
    const { sectionId, userId, flashcards } = req.body; // Extract section ID, user ID, and flashcards

    if (!sectionId || !userId || !Array.isArray(flashcards) || flashcards.length === 0) return res.status(400).json({ message: "sectionId, userId, and flashcards[] required" });

    try {
        const user = await User.findById(userId); // Find user
        const section = await Section.findById(sectionId); // Find section
        const collection = await Collection.findById(section.collectionId); // Find collection

        if (!user || !collection || !section) return res.status(404).json({ message: "User, Collection, or Section not found" });

        let counter = user.totalFlashcards; // Track flashcard count
        const savedFlashcards = [];

        for (const fc of flashcards) {
            if (!fc.question?.trim()) continue; // Skip empty questions
            counter++;
            const flashcardId = `${sectionId}.fc.${counter}`; // Generate flashcard ID
            const newFlashcard = new Flashcard({ // Create flashcard
                _id: flashcardId,
                sectionId,
                userId,
                question: fc.question,
                answer: fc.answer || "No answer added",
                bookmarked: false
            });

            await newFlashcard.save(); // Save flashcard
            savedFlashcards.push(newFlashcard);
        }

        const addedCount = savedFlashcards.length; // Count added flashcards
        user.totalFlashcards += addedCount; // Update user flashcard count
        collection.totalNoFlashcards += addedCount; // Update collection count
        section.totalNoFlashcards += addedCount; // Update section count
        section.flashcards.push(...savedFlashcards.map(fc => fc._id)); // Add flashcard IDs

        await user.save(); // Save user updates
        await collection.save(); // Save collection updates
        await section.save(); // Save section updates
        res.status(201).json({ message: "Flashcards created", flashcards: savedFlashcards }); // Return created flashcards
    } catch (error) {
        throwError(res, error, "creating flashcards"); // Handle errors
    }
};

// Edit a flashcard
export const editFlashcard = async (req, res) => {
    const { flashcardId, userId, question, answer, bookmarked } = req.body; // Extract flashcard details
    if (!flashcardId) return res.status(400).json({ message: "flashcardId required" });

    try {
        const flashcard = await Flashcard.findById(flashcardId); // Find flashcard
        if (!flashcard) return res.status(404).json({ message: "Flashcard not found" });
        if (userId && flashcard.userId.toString() !== userId) return res.status(403).json({ message: "Prohibited" }); // Verify ownership

        if (question !== undefined) flashcard.question = question; // Update question
        if (answer !== undefined) flashcard.answer = answer; // Update answer
        if (bookmarked !== undefined) flashcard.bookmarked = bookmarked; // Update bookmark status

        await flashcard.save(); // Save changes
        res.status(200).json({ message: "Flashcard updated", flashcard }); // Return updated flashcard
    } catch (error) {
        throwError(res, error, "editing flashcard"); // Handle errors
    }
};

// Delete a flashcard
export const deleteFlashcardById = async (req, res) => {
    const { flashcardId, userId, collectionId } = req.body; // Extract IDs
    if (!flashcardId || !userId || !collectionId) return res.status(400).json({ message: "flashcardId, userId, and collectionId required" });

    try {
        const flashcard = await Flashcard.findById(flashcardId); // Find flashcard
        const user = await User.findById(userId); // Find user
        const collection = await Collection.findById(collectionId); // Find collection
        const section = await Section.findById(flashcard.sectionId); // Find section

        if (!flashcard || !user || !collection || !section) return res.status(404).json({ message: "Flashcard not found" });
        if (userId !== flashcard.userId.toString()) return res.status(403).json({ message: "Prohibited" }); // Verify ownership

        await Flashcard.findByIdAndDelete(flashcardId); // Delete flashcard

        user.totalFlashcards--; // Update user count
        collection.totalNoFlashcards--; // Update collection count
        section.totalNoFlashcards--; // Update section count
        section.flashcards = section.flashcards.filter(fcId => fcId !== flashcardId); // Remove flashcard ID

        await user.save(); // Save user updates
        await collection.save(); // Save collection updates
        await section.save(); // Save section updates
        res.status(200).json({ message: "Flashcard deleted" }); // Confirm deletion
    } catch (error) {
        throwError(res, error, "deleting flashcard"); // Handle errors
    }
};

// Approach Explanation:
// Flashcard management enables users to create, edit, and delete flashcards for study:
// - Mongoose handles database operations for Flashcard, Section, Collection, and User models.
// - Input validation ensures required fields (e.g., sectionId, userId) are provided.
// - Error handling uses handleError utility for consistent responses.

// - getFlashcardsBySectionId retrieves flashcards for a specific section.
// - getBookmarkedFlashcards fetches user-bookmarked flashcards for quick review.
// - createNewFlashcardsForSectionId generates unique IDs and updates counts across models.
// - editFlashcard allows updates to question, answer, or bookmark status with ownership verification.
// - deleteFlashcardById ensures secure deletion and updates related counts.