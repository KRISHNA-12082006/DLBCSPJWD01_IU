// backend/routes/collectionRoutes.js

// This file defines the routes for handling collections in the application.

// Import router and collection controller functions
import { router } from '../config.js'
import {
    getCollectionsByUserId,
    getCollectionWithSectionsAndFlashcards,
    createNewCollectionForUserId,
    changeCollectionTitle,
    deleteCollectionById
} from "../controllers/collectionController.js";

// Define routes for collections
router.post("/collections", getCollectionsByUserId); // Route to get all collections for a user
router.post("/collection", getCollectionWithSectionsAndFlashcards); // Route to get a specific collection with its sections and flashcards
router.post("/newCollection", createNewCollectionForUserId); // Route to create a new collection for a user
router.put("/change-title", changeCollectionTitle); // Route to change the title of a collection
router.delete("/deleteCollection", deleteCollectionById) // Route to delete a collection by its ID


// Export the router
export default router;