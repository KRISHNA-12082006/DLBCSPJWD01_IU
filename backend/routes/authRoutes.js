// backend/routes/authRoutes.js

// This file defines the routes for user authentication in the application.

// Import router and authentication controller functions
import { router } from '../config.js'
import {
    createUser,
    loginUser,
    editUser
} from "../controllers/authController.js";

// Define routes for user authentication
router.post("/login", loginUser); // Route for user login
router.post("/newUser", createUser); // Route for creating a new user
router.put("/editUser", editUser) // Route for editing user details


// Export the router
export default router;