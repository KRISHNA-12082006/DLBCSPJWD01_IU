// Import React hooks, routing, services, and components
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookmarkedFlashcards, editFlashcard } from "../services/flashcardService";
import FlashcardModal from "../components/FlashcardModal";

/**
 * Bookmarks component displays and manages bookmarked flashcards.
 * @component
 * @returns {JSX.Element} Bookmarked flashcards page
 */
export default function Bookmarks() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
    const userId = user?._id; // User ID for API calls
    const [flashcards, setFlashcards] = useState([]); // Bookmarked flashcards
    const [loading, setLoading] = useState(true); // Loading state
    const [expandedIndex, setExpandedIndex] = useState(null); // Expanded flashcard index
    const [feedback, setFeedback] = useState({ type: "", message: "" }); // Feedback message

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }
    }, [userId, navigate]);

    // Fetch bookmarked flashcards
    const loadBookmarks = useCallback(async () => {
        if (!userId) return;
        try {
            const bookmarked = await getBookmarkedFlashcards(userId);
            setFlashcards(bookmarked || []);
        } catch (err) {
            setFeedback({ type: "error", message: `Failed to load bookmarks: ${err.message || "Server error"}` });
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Load bookmarks on mount
    useEffect(() => {
        if (userId) loadBookmarks();
    }, [loadBookmarks, userId]);

    // Toggle bookmark status
    const toggleBookmark = async (fc) => {
        try {
            await editFlashcard(fc._id, { bookmarked: !fc.bookmarked });
            setFeedback({ type: "success", message: `Flashcard ${fc.bookmarked ? "unbookmarked" : "bookmarked"}` });
            await loadBookmarks();
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (err) {
            setFeedback({ type: "error", message: `Failed to toggle bookmark: ${err.message || "Server error"}` });
        }
    };

    // Navigate to next flashcard in modal
    const handleNext = () => {
        if (flashcards.length === 0) return;
        setExpandedIndex((prev) => (prev + 1) % flashcards.length);
    };

    // Navigate to previous flashcard in modal
    const handlePrev = () => {
        if (flashcards.length === 0) return;
        setExpandedIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    return (
        <main className="min-h-screen pt-20 px-4 sm:px-6 md:px-10 pb-10 bg-gray-900 text-gray-100">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <h2 className="text-3xl font-bold">Bookmarked Flashcards</h2>

                {/* Feedback message */}
                {feedback.message && (
                    <p className={`text-sm ${feedback.type === "success" ? "text-green-400" : "text-red-400"} text-center`}>
                        {feedback.message}
                    </p>
                )}

                {/* Loading indicator */}
                {loading && <p className="text-gray-300 text-center">Loading...</p>}

                {/* Flashcards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flashcards.length ? flashcards.map((fc, index) => (
                        <div
                            key={fc._id}
                            onClick={() => setExpandedIndex(index)}
                            className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition space-y-2 cursor-pointer"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold truncate">{fc.question}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(fc);
                                    }}
                                    className="text-yellow-400 text-xl hover:text-yellow-300"
                                >
                                    {fc.bookmarked ? "⭐" : "☆"}
                                </button>
                            </div>
                            <p className="text-gray-300 text-sm truncate">{fc.answer || '—'}</p>
                        </div>
                    )) : (
                        !loading && (
                            <p className="text-gray-400 col-span-full text-center">
                                No bookmarked flashcards found
                            </p>
                        )
                    )}
                </div>
            </div>

            {/* Flashcard viewer modal */}
            {expandedIndex !== null && flashcards[expandedIndex] && (
                <FlashcardModal
                    flashcard={flashcards[expandedIndex]}
                    sectionName="Bookmarks"
                    sectionBackgroundColor="#1a202c"
                    sectionTextColor="#fff"
                    onClose={() => setExpandedIndex(null)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}
        </main>
    );
}

// Approach Explanation:
// The Bookmarks component displays and manages bookmarked flashcards:
// - Uses React hooks (useState, useEffect, useCallback) for state and data fetching.
// - Integrates with flashcardService to fetch and toggle bookmarked flashcards.
// - Displays bookmarks in a responsive grid with unbookmarking capability.
// - Uses FlashcardModal for viewing flashcards with navigation controls.
// - Applies Tailwind CSS for consistent, dark-themed styling.