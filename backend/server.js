// backend/server.js

/*
  This file sets up the Express server, connects to the MongoDB database, and configures API routes for the application.
*/

// Import necessary modules
import http from "http";
import { PORT, app, connectToDB } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";


// Establish connection to MongoDB database
connectToDB();

// Set up API routes for user authentication, collections, sections, and flashcards
app.use("/api/users", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/ai", aiRoutes);

// Create HTTP server instance and start listening on specified host and port
const server = http.createServer(app);

// Start the server and log the status
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`); // Log successful server startup
}).on("error", (err) => {
  console.error("❌ Server.js error:", err.message); // Log any server startup errors
});