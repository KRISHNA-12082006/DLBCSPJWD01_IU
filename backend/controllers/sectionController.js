// backend/controllers/sectionController.js

// Import models and error handling utility
import Section from "../models/Section.js";
import Flashcard from "../models/Flashcard.js";
import Collection from "../models/Collection.js";
import User from "../models/User.js";
import handleError from "../utils/handleError.js";

// Helper for error handling
const throwError = (res, error, action) => handleError(res, error, action, "sectionController");

// Fetch section by ID
export const getSectionById = async (req, res) => {
    const { sectionId } = req.body; // Extract section ID
    if (!sectionId) return res.status(400).json({ message: "sectionId required" });

    try {
        const section = await Section.findById(sectionId); // Find section
        res.status(200).json(section); // Return section
    } catch (error) {
        throwError(res, error, "fetching section"); // Handle errors
    }
};

// Fetch sections by collection ID
export const getSectionsByCollectionId = async (req, res) => {
    const { collectionId } = req.body; // Extract collection ID
    if (!collectionId) return res.status(400).json({ message: "collectionId required" });

    try {
        const sections = await Section.find({ collectionId }); // Find sections
        res.status(200).json(sections); // Return sections
    } catch (error) {
        throwError(res, error, "fetching sections"); // Handle errors
    }
};

// Create a new section under a collection
export const createNewSectionForCollectionId = async (req, res) => {
    const { userId, name, backgroundColor, textColor, collectionId } = req.body; // Extract section details
    if (!name || !collectionId || !userId) return res.status(400).json({ message: "name, collectionId, and userId required" });

    try {
        const user = await User.findById(userId); // Find user
        const collection = await Collection.findById(collectionId); // Find collection

        user.totalSections++; // Increment section count
        collection.totalNoSections++; // Increment collection section count

        const sectionId = `${collectionId}.sec.${user.totalSections}`; // Generate section ID
        const newSection = new Section({ // Create section
            _id: sectionId,
            collectionId,
            name,
            backgroundColor,
            textColor,
            flashcards: []
        });
        collection.sections.push(newSection._id); // Add section to collection

        await user.save(); // Save user updates
        await collection.save(); // Save collection updates
        await newSection.save(); // Save new section
        res.status(201).json(newSection); // Return new section
    } catch (error) {
        throwError(res, error, "creating section"); // Handle errors
    }
};

// Edit section details
export const editSection = async (req, res) => {
    const { sectionId, name, backgroundColor, textColor } = req.body; // Extract section details
    if (!sectionId || !name || !backgroundColor || !textColor) return res.status(400).json({ message: "sectionId, name, backgroundColor, and textColor required" });

    const isValidHex = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color); // Validate hex color
    if (!isValidHex(backgroundColor) || !isValidHex(textColor)) return res.status(400).json({ message: "Invalid hex color format" });

    try {
        const section = await Section.findById(sectionId); // Find section
        if (!section) return res.status(404).json({ message: "Section not found" });

        section.name = name; // Update name
        section.backgroundColor = backgroundColor; // Update background color
        section.textColor = textColor; // Update text color

        await section.save(); // Save changes
        res.status(200).json(section); // Return updated section
    } catch (error) {
        throwError(res, error, "editing section"); // Handle errors
    }
};

// Delete section and associated flashcards
export const deleteSectionById = async (req, res) => {
    const { sectionId, userId } = req.body; // Extract section and user IDs

    if (!sectionId || !userId) return res.status(400).json({ message: "sectionId and userId required" });

    try {
        const section = await Section.findById(sectionId); // Find section
        if (!section) return res.status(404).json({ message: "Section not found" });

        const collection = await Collection.findById(section.collectionId); // Find collection
        if (!collection || collection.userId.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });
        const flashcardCount = (await Flashcard.find({ sectionId })).length; // Count flashcards

        await Flashcard.deleteMany({ sectionId }); // Delete flashcards
        await Section.findByIdAndDelete(sectionId); // Delete section

        collection.totalNoSections--; // Update collection count
        collection.sections = collection.sections.filter(secId => secId !== sectionId); // Remove section ID

        await collection.save(); // Save collection updates

        const user = await User.findById(userId); // Find user

        user.totalSections = Math.max(0, user.totalSections - 1); // Update section count
        user.totalFlashcards = Math.max(0, user.totalFlashcards - flashcardCount); // Update flashcard count

        await user.save(); // Save user updates
        res.status(200).json({ message: "Section and flashcards deleted" }); // Confirm deletion
    } catch (error) {
        throwError(res, error, "deleting section"); // Handle errors
    }
};

// Approach Explanation:
// Section management enables users to organize flashcards within collections:
// - Mongoose handles database operations for Section, Collection, Flashcard, and User models.
// - Input validation ensures required fields (e.g., sectionId, collectionId) are provided.
// - Error handling uses handleError utility for consistent responses.

// - getSectionById and getSectionsByCollectionId retrieve sections for display.
// - createNewSectionForCollectionId generates unique IDs and updates counts.
// - editSection validates hex colors and updates section details.
// - deleteSectionById ensures secure deletion with ownership verification and updates counts.