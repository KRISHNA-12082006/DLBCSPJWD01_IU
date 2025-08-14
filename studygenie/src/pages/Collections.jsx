// Import React hooks, routing, and collection services
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCollectionsByUserId, changeCollectionTitle, deleteCollection } from '../services/collectionService';

/**
 * Collections component displays and manages user flashcard collections.
 * @component
 * @returns {JSX.Element} Collections overview page
 */
export default function Collections() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    const [collections, setCollections] = useState([]); // User collections

    // Fetch user collections
    const loadCollections = useCallback(async () => {
        if (!user?._id) return;
        try {
            const data = await fetchCollectionsByUserId(user._id);
            setCollections(data || []);
        } catch (error) {
            console.error("Failed to load collections:", error);
        }
    }, [user]);

    // Redirect to login if not authenticated, else load collections
    useEffect(() => {
        if (!user?._id) {
            navigate('/login');
        } else {
            loadCollections();
        }
    }, [user, navigate, loadCollections]);

    // Rename a collection
    const handleRenameCollection = async (collectionId, oldTitle) => {
        const newTitle = prompt("Enter new title:", oldTitle);
        if (!newTitle || newTitle === oldTitle) return;
        try {
            await changeCollectionTitle(collectionId, newTitle);
            loadCollections();
        } catch (error) {
            console.error("Failed to rename collection:", error);
        }
    };

    // Delete a collection
    const handleDeleteCollection = async (collectionId) => {
        if (!window.confirm("Are you sure you want to delete this collection?")) return;
        try {
            await deleteCollection(collectionId, user._id);
            loadCollections();
        } catch (error) {
            console.error("Failed to delete collection:", error);
        }
    };

    return (
        <main className="min-h-screen pt-20 px-4 sm:px-6 md:px-10 pb-10 bg-gray-900 text-gray-100">
            {/* Page header */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold">Flashcards Overview</h1>
                <p className="text-gray-300">Explore your collections, edit flashcards, and manage bookmarks.</p>
                <Link to="/profile">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded">
                        + New Collection
                    </button>
                </Link>
            </div>

            {/* Collections grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
                {collections.length ? collections.map((collection) => (
                    <div
                        key={collection._id}
                        className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition space-y-4"
                    >
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <h3 className="text-xl font-semibold truncate">{collection.title}</h3>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleRenameCollection(collection._id, collection.title)}
                                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                                >
                                    Rename
                                </button>
                                <button
                                    onClick={() => handleDeleteCollection(collection._id)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    Delete
                                </button>
                                <Link to={`/collections/${collection._id}`}>
                                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 text-sm rounded">
                                        Open
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Sections: {collection.totalNoSections || 0} | Flashcards: {collection.totalNoFlashcards || 0}
                        </p>
                    </div>
                )) : (
                    <p className="text-gray-400">No collections found</p>
                )}
            </div>
        </main>
    );
}

// Approach Explanation:
// The Collections component displays and manages user flashcard collections:
// - Uses React hooks (useState, useEffect, useCallback) for state and data fetching.
// - Integrates with collectionService for fetching, renaming, and deleting collections.
// - Redirects unauthenticated users to login.
// - Provides a responsive grid layout for collections with rename, delete, and navigation options.
// - Uses Tailwind CSS for consistent, modern styling with a dark theme.