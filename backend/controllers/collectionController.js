// backend/controllers/collectionController.js

// Import models and error handling utility
import Collection from "../models/Collection.js";
import Section from "../models/Section.js";
import Flashcard from "../models/Flashcard.js";
import User from "../models/User.js";
import handleError from "../utils/handleError.js";

// Helper for error handling
const throwError = (res, error, action) => handleError(res, error, action, "collectionController");

// Fetch all collections for a user
export const getCollectionsByUserId = async (req, res) => {
    const { userId } = req.body; // Extract user ID
    if (!userId) return res.status(400).json({ message: "userId required" });
    try {
        const collections = await Collection.find({ userId }); // Query collections by user

        res.status(200).json(collections); // Return collections
    } catch (error) {
        throwError(res, error, "fetching collections"); // Handle errors
    }
};

// Fetch a collection with its sections and flashcards
export const getCollectionWithSectionsAndFlashcards = async (req, res) => {
    const { collectionId } = req.body; // Extract collection ID
    if (!collectionId) return res.status(400).json({ message: "collectionId required" });

    try {
        const collection = await Collection.findById(collectionId); // Find collection
        const sections = await Section.find({ collectionId }); // Find sections
        const sectionsWithFlashcards = await Promise.all(sections.map(async section => {
            const flashcards = await Flashcard.find({ sectionId: section._id }); // Find flashcards per section

            return {
                _id: section._id,
                name: section.name,
                backgroundColor: section.backgroundColor,
                textColor: section.textColor,
                totalNoFlashcards: section.totalNoFlashcards,
                flashcards
            };
        }));

        res.status(200).json({
            _id: collection._id,
            title: collection.title,
            userId: collection.userId,
            sections: sectionsWithFlashcards
        }); // Return collection with sections and flashcards
    } catch (error) {
        throwError(res, error, "fetching full collection"); // Handle errors
    }
};

// Create a new collection with a default section
export const createNewCollectionForUserId = async (req, res) => {
    const { title, userId } = req.body; // Extract title and user ID
    if (!title || !userId) return res.status(400).json({ message: "Title and userId required" });

    try {
        const user = await User.findById(userId); // Find user
        user.totalCollections++; // Increment collection count
        user.totalSections++; // Increment section count

        await user.save(); // Save user updates

        const collectionId = `${userId}.coll.${user.totalCollections}`; // Generate collection ID
        const sectionId = `${collectionId}.sec.${user.totalSections}`; // Generate section ID
        const newMainSection = await Section.create({ // Create default section
            _id: sectionId,
            collectionId,
            name: "Main",
            backgroundColor: "#5552bb",
            textColor: "#ffffff",
            totalNoFlashcards: 0,
            flashcards: []
        });

        const newCollection = await Collection.create({ // Create collection
            _id: collectionId,
            userId,
            title,
            totalNoSections: 1,
            totalNoFlashcards: 0,
            sections: [newMainSection._id]
        });

        res.status(201).json(newCollection); // Return new collection
    } catch (error) {
        throwError(res, error, "creating collection"); // Handle errors
    }
};

// Update collection title
export const changeCollectionTitle = async (req, res) => {
    const { collectionId, newTitle } = req.body; // Extract collection ID and new title
    if (!collectionId || !newTitle) return res.status(400).json({ message: "collectionId and newTitle required" });

    try {
        const collection = await Collection.findById(collectionId); // Find collection

        if (!collection) return res.status(404).json({ message: "Collection not found" });
        collection.title = newTitle; // Update title

        await collection.save(); // Save changes
        res.status(200).json(collection); // Return updated collection
    } catch (error) {
        throwError(res, error, "changing collection title"); // Handle errors
    }
};

// Delete a collection and its sections/flashcards
export const deleteCollectionById = async (req, res) => {
    const { collectionId, userId } = req.body; // Extract collection and user IDs
    if (!collectionId || !userId) return res.status(400).json({ message: "collectionId and userId required" });

    try {
        const collection = await Collection.findById(collectionId); // Find collection
        if (!collection) return res.status(404).json({ message: "Collection not found" });
        if (userId !== collection.userId.toString()) return res.status(403).json({ message: "Prohibited" }); // Verify ownership

        const sections = await Section.find({ collectionId }); // Find sections
        const sectionIds = sections.map(sec => sec._id); // Get section IDs
        const flashcardCount = await Flashcard.countDocuments({ sectionId: { $in: sectionIds } }); // Count flashcards

        await Flashcard.deleteMany({ sectionId: { $in: sectionIds } }); // Delete flashcards
        await Section.deleteMany({ collectionId }); // Delete sections
        await Collection.findByIdAndDelete(collectionId); // Delete collection

        const user = await User.findById(userId); // Find user

        if (user) {
            user.totalCollections = Math.max(0, user.totalCollections - 1); // Update collection count
            user.totalSections = Math.max(0, user.totalSections - sectionIds.length); // Update section count
            user.totalFlashcards = Math.max(0, user.totalFlashcards - flashcardCount); // Update flashcard count
            await user.save(); // Save user updates
        }
        res.status(200).json({ message: "Collection, sections, and flashcards deleted" }); // Confirm deletion
    } catch (error) {
        throwError(res, error, "deleting collection"); // Handle errors
    }
};

// Approach Explanation:
// Collection management supports organizing study materials via CRUD operations:
// - Uses Mongoose to query and update Collection, Section, Flashcard, and User models in MongoDB.
// - Input validation ensures required fields (e.g., userId, collectionId) are provided.
// - Standardized error handling with handleError utility ensures consistent responses.

// - getCollectionsByUserId retrieves all user collections for display.
// - getCollectionWithSectionsAndFlashcards fetches a collection with nested sections and flashcards for detailed views.
// - createNewCollectionForUserId generates unique IDs and creates a default section for new collections.
// - changeCollectionTitle updates titles efficiently with validation.
// - deleteCollectionById ensures secure deletion by verifying ownership and updating user counts.