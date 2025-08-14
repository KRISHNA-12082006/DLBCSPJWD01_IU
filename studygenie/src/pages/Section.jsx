// Import React hooks, routing, services, and components
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { getSectionById } from '../services/sectionService';
import { getFlashcardsBySectionId, createNewFlashcards, editFlashcard, deleteFlashcard } from '../services/flashcardService';
import FlashcardModal from '../components/FlashcardModal';
import FlashcardCreationModal from '../components/FlashcardCreationModal';

/**
 * Section component displays and manages flashcards in a section.
 * @component
 * @returns {JSX.Element} Section detail page
 */
export default function Section() {
    const { sectionId } = useParams(); // Get section ID from URL
    const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user
    const userId = user?._id || null; // User ID for API calls
    const [flashcards, setFlashcards] = useState([]); // Section flashcards
    const [showModal, setShowModal] = useState(false); // Flashcard creation modal visibility
    const [newFlashcards, setNewFlashcards] = useState([{ question: '', answer: '' }]); // New flashcard form state
    const [selectedSectionId, setSelectedSectionId] = useState(sectionId); // Selected section ID
    const [sectionName, setSectionName] = useState(''); // Section name
    const [backgroundColor, setBackgroundColor] = useState(''); // Section background color
    const [textColor, setTextColor] = useState(''); // Section text color
    const [collectionId, setCollectionId] = useState(''); // Collection ID
    const [expandedIndex, setExpandedIndex] = useState(null); // Expanded flashcard index
    const [feedback, setFeedback] = useState({ type: "", message: "" }); // Feedback message

    // Load section details
    const loadSectionInfo = useCallback(async () => {
        try {
            const section = await getSectionById(sectionId);
            if (section) {
                setSectionName(section.name || '');
                setBackgroundColor(section.backgroundColor || '#272f3d');
                setTextColor(section.textColor || '#55f');
                setCollectionId(section.collectionId?.toString() || '');
            }
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to load section: ${error.message || "Server error"}` });
        }
    }, [sectionId]);

    // Load section flashcards
    const loadFlashcards = useCallback(async () => {
        try {
            const data = await getFlashcardsBySectionId(sectionId, userId);
            setFlashcards(data || []);
            setExpandedIndex(null);
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to load flashcards: ${error.message || "Server error"}` });
        }
    }, [sectionId, userId]);

    // Initial data load
    useEffect(() => {
        if (sectionId && userId) {
            loadFlashcards();
            loadSectionInfo();
        }
    }, [sectionId, userId, loadFlashcards, loadSectionInfo]);

    // Handle new flashcard input changes
    const handleInputChange = (index, field, value) => {
        const updated = [...newFlashcards];
        updated[index][field] = value;
        setNewFlashcards(updated);
    };

    // Add new flashcard input field
    const handleAddInput = () => {
        setNewFlashcards([...newFlashcards, { question: '', answer: '' }]);
    };

    // Submit new flashcards
    const handleSubmitFlashcards = async (e) => {
        e.preventDefault();
        const payload = newFlashcards.filter(fc => fc.question.trim());
        if (!payload.length || !userId) {
            setFeedback({ type: "error", message: "At least one valid question required" });
            return;
        }
        try {
            await createNewFlashcards(selectedSectionId, userId, payload);
            setShowModal(false);
            setNewFlashcards([{ question: '', answer: '' }]);
            setFeedback({ type: "success", message: "Flashcards created" });
            loadFlashcards();
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to create flashcards: ${error.message || "Server error"}` });
        }
    };

    // Edit flashcard
    const handleEdit = async (fc) => {
        const question = prompt("Edit Question:", fc.question);
        const answer = prompt("Edit Answer:", fc.answer);
        if (!question || !answer) return;
        try {
            await editFlashcard(fc._id, userId, { question, answer });
            setFeedback({ type: "success", message: "Flashcard updated" });
            loadFlashcards();
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to edit flashcard: ${error.message || "Server error"}` });
        }
    };

    // Delete flashcard
    const handleDelete = async (fc) => {
        if (!window.confirm("Delete this flashcard?")) return;
        try {
            await deleteFlashcard(fc._id, userId, collectionId);
            setFeedback({ type: "success", message: "Flashcard deleted" });
            loadFlashcards();
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to delete flashcard: ${error.message || "Server error"}` });
        }
    };

    // Toggle bookmark status
    const toggleBookmark = async (fc) => {
        try {
            await editFlashcard(fc._id, userId, { bookmarked: !fc.bookmarked });
            setFeedback({ type: "success", message: `Flashcard ${fc.bookmarked ? "unbookmarked" : "bookmarked"}` });
            loadFlashcards();
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to update bookmark: ${error.message || "Server error"}` });
        }
    };

    // Navigate to next flashcard in modal
    const handleNext = () => {
        if (!flashcards.length) return;
        setExpandedIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
    };

    // Navigate to previous flashcard in modal
    const handlePrev = () => {
        if (!flashcards.length) return;
        setExpandedIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
    };

    // Minimal collection object for modal dropdown
    const minimalCollection = { sections: [{ _id: sectionId, name: sectionName }] };

    return (
        <main className="min-h-screen pt-20 px-4 pb-10 bg-gray-900">
            <div className="mx-auto p-6 rounded-lg space-y-6 shadow-md">
                {/* Feedback message */}
                {feedback.message && (
                    <p className={`text-sm ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}>
                        {feedback.message}
                    </p>
                )}

                {/* Section header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">
                        Section:{' '}
                        <span 
                            className="p-2 rounded-xl"
                            style={{
                                textShadow: '2px 2px 4px rgba(100,100,100,0.5)',
                            }}
                        >
                            {sectionName || 'Loading...'}
                        </span>
                    </h2>
                    {userId && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
                        >
                            + Add Flashcards
                        </button>
                    )}
                </div>

                {/* Flashcards grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {flashcards.length ? flashcards.map((fc, index) => (
                        <div
                            key={fc._id}
                            className="bg-white/10 p-4 rounded-lg shadow-sm cursor-pointer"
                            style={{
                                backgroundColor: backgroundColor || '#1a202c',
                                color: textColor || '#55f',
                            }}
                            onClick={() => setExpandedIndex(index)}
                        >
                            <h4 className="font-bold">Q: {fc.question}</h4>
                            <p className="text-sm">A: {fc.answer || '—'}</p>
                            {userId && (
                                <div className="mt-3 flex justify-between items-center">
                                    <button
                                        className="text-white hover:underline text-sm bg-green-500 p-1 rounded border border-green-600"
                                        onClick={(e) => { e.stopPropagation(); handleEdit(fc); }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-white hover:underline text-sm bg-red-500 p-1 rounded border border-red-600"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(fc); }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="text-yellow-300 hover:text-yellow-400 text-lg"
                                        onClick={(e) => { e.stopPropagation(); toggleBookmark(fc); }}
                                    >
                                        {fc.bookmarked ? '⭐' : '☆'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <p className="text-gray-400">No flashcards found</p>
                    )}
                </div>
            </div>

            {/* Flashcard viewer modal */}
            {expandedIndex !== null && (
                <FlashcardModal
                    flashcard={flashcards[expandedIndex]}
                    onClose={() => setExpandedIndex(null)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    sectionName={sectionName}
                    sectionBackgroundColor={backgroundColor}
                    sectionTextColor={textColor}
                />
            )}

            {/* Flashcard creation modal */}
            {showModal && (
                <FlashcardCreationModal
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId}
                    collection={minimalCollection}
                    flashcards={newFlashcards}
                    handleSubmit={handleSubmitFlashcards}
                    handleInputChange={handleInputChange}
                    handleAddInput={handleAddInput}
                    setShowModal={setShowModal}
                />
            )}
        </main>
    );
}

// Approach Explanation:
// The Section component manages flashcards within a specific section:
// - Uses React hooks (useState, useEffect, useCallback) for state and data fetching.
// - Integrates with sectionService and flashcardService for section details and flashcard operations.
// - Displays flashcards in a grid with edit, delete, and bookmark options.
// - Uses modals (FlashcardModal, FlashcardCreationModal) for viewing and creating flashcards.
// - Applies Tailwind CSS for responsive styling, using section-specific colors.