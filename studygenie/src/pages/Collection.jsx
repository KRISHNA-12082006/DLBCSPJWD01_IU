// Import React hooks, routing, services, and components
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCollectionById } from '../services/collectionService';
import { editSection, deleteSection, createNewSection } from '../services/sectionService';
import { createNewFlashcards, editFlashcard } from '../services/flashcardService';
import FlashcardCreationModal from '../components/FlashcardCreationModal';
import FlashcardModal from '../components/FlashcardModal';

/**
 * Collection component manages sections and flashcards within a collection.
 * @component
 * @returns {JSX.Element} Collection detail page
 */
export default function Collection() {
    const { collectionId } = useParams(); // Get collection ID from URL
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    const [collection, setCollection] = useState(null); // Collection data
    const [selectedSectionId, setSelectedSectionId] = useState(''); // Selected section for flashcards
    const [showModal, setShowModal] = useState(false); // Flashcard creation modal visibility
    const [modalFlashcards, setModalFlashcards] = useState([]); // Flashcards for modal viewer
    const [expandedIndex, setExpandedIndex] = useState(null); // Expanded flashcard index
    const [flashcards, setFlashcards] = useState([{ question: '', answer: '' }]); // New flashcard inputs
    const [editingSection, setEditingSection] = useState(null); // Section being edited
    const [editName, setEditName] = useState(''); // Edited section name
    const [editBgColor, setEditBgColor] = useState('#559'); // Edited background color
    const [editTextColor, setEditTextColor] = useState('#fff'); // Edited text color
    const [feedback, setFeedback] = useState({ type: "", message: "" }); // Feedback message

    // Load collection data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCollectionById(collectionId);
                setCollection(data);
                setSelectedSectionId(data?.sections?.[0]?._id || '');
            } catch (err) {
                setFeedback({ type: "error", message: `Failed to load collection: ${err.message || "Server error"}` });
            }
        };
        if (user?._id) fetchData();
    }, [collectionId, user]);

    // Add new flashcard input field
    const handleAddInput = () => {
        setFlashcards([...flashcards, { question: '', answer: '' }]);
    };

    // Handle flashcard input changes
    const handleInputChange = (index, field, value) => {
        const updated = [...flashcards];
        updated[index][field] = value;
        setFlashcards(updated);
    };

    // Submit new flashcards
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!collection?.sections.length || !user?._id) {
            setFeedback({ type: "error", message: "No sections or user not authenticated" });
            return;
        }
        const validFlashcards = flashcards.filter(fc => fc.question.trim());
        if (!validFlashcards.length) {
            setFeedback({ type: "error", message: "At least one valid question required" });
            return;
        }
        try {
            await createNewFlashcards(selectedSectionId, user._id, validFlashcards);
            setShowModal(false);
            setFlashcards([{ question: '', answer: '' }]);
            setFeedback({ type: "success", message: "Flashcards created" });
            const updated = await fetchCollectionById(collectionId);
            setCollection(updated);
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (err) {
            setFeedback({ type: "error", message: `Failed to add flashcards: ${err.message || "Server error"}` });
        }
    };

    // Delete section
    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm("Delete this section and all its flashcards?")) return;
        try {
            await deleteSection(sectionId, user._id);
            setFeedback({ type: "success", message: "Section deleted" });
            const updated = await fetchCollectionById(collectionId);
            setCollection(updated);
            setSelectedSectionId(updated?.sections?.[0]?._id || '');
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (err) {
            setFeedback({ type: "error", message: `Failed to delete section: ${err.message || "Server error"}` });
        }
    };

    // Add new section
    const handleAddSection = async () => {
        const name = prompt("Enter new section name:", "Unnamed Section")?.trim() || "Unnamed Section";
        const bg = prompt("Enter background color (hex):", "#5552BB")?.trim() || "##5552BB";
        const text = prompt("Enter text color (hex):", "#fff")?.trim() || "#fff";
        const validBg = /^#([0-9A-F]{3}){1,2}$/i.test(bg) ? bg : "#5552BB";
        const validText = /^#([0-9A-F]{3}){1,2}$/i.test(text) ? text : "#fff";
        if (!user?._id) {
            setFeedback({ type: "error", message: "User not authenticated" });
            return;
        }
        try {
            await createNewSection({ userId: user._id, name, backgroundColor: validBg, textColor: validText, collectionId });
            setFeedback({ type: "success", message: "Section created" });
            const updated = await fetchCollectionById(collectionId);
            setCollection(updated);
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (err) {
            setFeedback({ type: "error", message: `Failed to create section: ${err.message || "Server error"}` });
        }
    };

    // Toggle bookmark status
    const handleToggleBookmark = async (fcId, status) => {
        try {
            await editFlashcard(fcId, { bookmarked: !status });
            setFeedback({ type: "success", message: `Flashcard ${status ? "unbookmarked" : "bookmarked"}` });
            const updated = await fetchCollectionById(collectionId);
            setCollection(updated);
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (err) {
            setFeedback({ type: "error", message: `Failed to toggle bookmark: ${err.message || "Server error"}` });
        }
    };

    // Open flashcard modal
    const openFlashcardModal = (clickedId) => {
        const allFlashcards = collection.sections.flatMap(s => s.flashcards);
        const startIndex = allFlashcards.findIndex(fc => fc._id === clickedId);
        if (startIndex === -1) return;
        setModalFlashcards(allFlashcards);
        setExpandedIndex(startIndex);
    };

    // Navigate to next/previous flashcard in modal
    const handleNext = () => setExpandedIndex(prev => (prev === modalFlashcards.length - 1 ? 0 : prev + 1));
    const handlePrev = () => setExpandedIndex(prev => (prev === 0 ? modalFlashcards.length - 1 : prev - 1));

    return (
        <main className="min-h-screen bg-gray-900 text-white pt-20 px-4 sm:px-6 md:px-10 pb-10">
            {/* Feedback message */}
            {feedback.message && (
                <p className={`text-sm ${feedback.type === "success" ? "text-green-400" : "text-red-400"} text-center mb-4`}>
                    {feedback.message}
                </p>
            )}

            {/* Collection content */}
            {collection ? (
                <div className="p-6 rounded-lg shadow-lg space-y-6 max-w-6xl mx-auto bg-gray-800">
                    {/* Header and controls */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <h2 className="text-3xl font-bold">{collection.title}</h2>
                        {user?._id === collection.userId && (
                            <div className="flex gap-2 flex-wrap">
                                <button onClick={() => setShowModal(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded">
                                    Add Flashcards
                                </button>
                                <button onClick={handleAddSection} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                                    + New Section
                                </button>
                                <Link to="/bookmarks">
                                    <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded">
                                        View Bookmarks
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sections and flashcards */}
                    {collection.sections.length ? collection.sections.map((section) => (
                        <div key={section._id} className="mt-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-semibold">{section.name}</h3>
                                {user?._id === collection.userId && (
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => {
                                                setEditingSection(section);
                                                setEditName(section.name);
                                                setEditBgColor(section.backgroundColor || '#559');
                                                setEditTextColor(section.textColor || '#fff');
                                            }}
                                            className="text-sm hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteSection(section._id)} className="text-red-400 text-sm hover:underline">
                                            Delete
                                        </button>
                                        <Link to={`/sections/${section._id}`}>
                                            <button className="bg-cyan-500 hover:bg-cyan-600 text-sm px-3 py-1 rounded">
                                                Open
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Flashcards grid */}
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {section.flashcards.length ? section.flashcards.map((fc) => (
                                    <div
                                        key={fc._id}
                                        onClick={() => openFlashcardModal(fc._id)}
                                        className="p-4 rounded shadow cursor-pointer"
                                        style={{ backgroundColor: section.backgroundColor || '#559', color: section.textColor || '#fff' }}
                                    >
                                        <h4 className="font-bold">Q: {fc.question}</h4>
                                        <p className="text-sm">A: {fc.answer || '—'}</p>
                                        {user?._id === collection.userId && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggleBookmark(fc._id, fc.bookmarked); }}
                                                className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-400"
                                            >
                                                {fc.bookmarked ? '⭐' : '☆'}
                                            </button>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-gray-400">No flashcards in this section</p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-400 text-center">No sections yet. Add one to get started!</p>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-300 mt-6">Loading collection...</p>
            )}

            {/* Flashcard creation modal */}
            {showModal && collection && (
                <FlashcardCreationModal
                    selectedSectionId={selectedSectionId}
                    setSelectedSectionId={setSelectedSectionId}
                    collection={collection}
                    flashcards={flashcards}
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    handleAddInput={handleAddInput}
                    setShowModal={setShowModal}
                />
            )}

            {/* Flashcard viewer modal */}
            {expandedIndex !== null && modalFlashcards.length > 0 && (
                <FlashcardModal
                    flashcard={modalFlashcards[expandedIndex]}
                    sectionName={collection.sections.find(sec => sec.flashcards.some(fc => fc._id === modalFlashcards[expandedIndex]._id))?.name || ''}
                    sectionBackgroundColor={collection.sections.find(sec => sec.flashcards.some(fc => fc._id === modalFlashcards[expandedIndex]._id))?.backgroundColor || '#559'}
                    sectionTextColor={collection.sections.find(sec => sec.flashcards.some(fc => fc._id === modalFlashcards[expandedIndex]._id))?.textColor || '#fff'}
                    onClose={() => setExpandedIndex(null)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}

            {/* Section editing modal */}
            {editingSection && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="p-6 rounded shadow-lg w-80 bg-gray-900 text-white">
                        <h3 className="text-xl font-bold mb-4">Edit Section</h3>
                        <label className="block mb-2">
                            Name:
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full p-1 rounded mt-1 bg-gray-800 text-white"
                            />
                        </label>
                        <label className="block mb-2">
                            Background Color:
                            <input
                                type="color"
                                value={editBgColor}
                                onChange={(e) => setEditBgColor(e.target.value)}
                                className="w-full h-10 p-0 mt-1 cursor-pointer"
                            />
                        </label>
                        <label className="block mb-4">
                            Text Color:
                            <input
                                type="color"
                                value={editTextColor}
                                onChange={(e) => setEditTextColor(e.target.value)}
                                className="w-full h-10 p-0 mt-1 cursor-pointer"
                            />
                        </label>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                                onClick={() => setEditingSection(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                                onClick={async () => {
                                    if (!editName.trim()) {
                                        setFeedback({ type: "error", message: "Section name required" });
                                        return;
                                    }
                                    try {
                                        await editSection(editingSection._id, {
                                            name: editName.trim(),
                                            backgroundColor: editBgColor,
                                            textColor: editTextColor,
                                        });
                                        setFeedback({ type: "success", message: "Section updated" });
                                        const updated = await fetchCollectionById(collectionId);
                                        setCollection(updated);
                                        setEditingSection(null);
                                        setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
                                    } catch (err) {
                                        setFeedback({ type: "error", message: `Failed to edit section: ${err.message || "Server error"}` });
                                    }
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

// Approach Explanation:
// The Collection component manages sections and flashcards within a collection:
// - Uses React hooks (useState, useEffect) for state and data fetching.
// - Integrates with collectionService, sectionService, and flashcardService for data operations.
// - Displays sections with flashcards in a grid, supporting creation, editing, and bookmarking.
// - Uses modals (FlashcardCreationModal, FlashcardModal, custom edit modal) for interactions.
// - Applies Tailwind CSS for responsive, dark-themed styling with section-specific colors.