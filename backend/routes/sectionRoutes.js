// backend/rotes/sectionRoutes.js

// This file defines the routes for handling sections in the application.

// Import router and section controller functions
import { router } from '../config.js'
import {
    getSectionById,
    getSectionsByCollectionId,
    createNewSectionForCollectionId,
    editSection,
    deleteSectionById
} from "../controllers/sectionController.js";

// Define routes for sections
router.post("/section", getSectionById); // Route to get a specific section by its ID
router.post("/sections", getSectionsByCollectionId); // Route to get all sections for a collection
router.post("/newSection", createNewSectionForCollectionId); // Route to create a new section for a collection
router.put("/editSection", editSection); // Route to edit an existing section
router.delete("/deleteSection", deleteSectionById) // Route to delete a section by its ID


// Export the router
export default router;