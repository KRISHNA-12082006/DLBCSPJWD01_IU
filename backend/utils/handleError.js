// backend/utils/handleError.js

// Helper: consistent error logging 
// Parameters:
// - res: the response object to send the error response
// - error: the error object to log and send
// - action: a string describing the action being performed
// - controller: a string indicating the controller where the error occurred

const handleError = (res, error, action, controller) => {
    console.error(`❌ [sectionController] Error ${action}:`, error.message); // Log the error message
    res.status(500).json({ message: "Internal Server Error from ", controller }); // Send a 500 Internal Server Error response with a message
};

export default handleError;