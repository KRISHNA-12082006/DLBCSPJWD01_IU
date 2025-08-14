// Import React hooks, routing, and services
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCollectionsByUserId, createNewCollection } from "../services/collectionService";
import { editUser } from "../services/authService";

/**
 * Profile component renders the user profile page.
 * @component
 * @returns {JSX.Element} Profile UI with edit and collection management
 */
export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(""); // Logged-in user data
    const [collections, setCollections] = useState([]); // User collections
    const [newTitle, setNewTitle] = useState(""); // New collection title
    const [loading, setLoading] = useState(false); // Loading state
    const [feedback, setFeedback] = useState({ type: "", message: "" }); // Feedback message
    const [editMode, setEditMode] = useState({ name: false, email: false, password: false }); // Edit modes
    const [editedName, setEditedName] = useState(""); // Edited name
    const [editedEmail, setEditedEmail] = useState(""); // Edited email
    const [currentPassword, setCurrentPassword] = useState(""); // Current password
    const [newPassword, setNewPassword] = useState(""); // New password

    // Check authentication and redirect if not logged in
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/");
        } else {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            setEditedName(parsedUser.name || "");
            setEditedEmail(parsedUser.email || "");
        }
    }, [navigate]);

    // Fetch user collections
    const loadCollections = useCallback(async () => {
        if (!user?._id) return;
        try {
            const data = await fetchCollectionsByUserId(user._id);
            if (Array.isArray(data)) setCollections(data);
        } catch (error) {
            setFeedback({ type: "error", message: `Failed to load collections: ${error?.message || "Server error"}` });
        }
    }, [user]);

    useEffect(() => {
        loadCollections();
    }, [loadCollections]);

    // Create new collection
    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return setFeedback({ type: "error", message: "Enter a collection title" });
        setLoading(true);
        setFeedback({ type: "", message: "" });
        try {
            const created = await createNewCollection({ title: newTitle, userId: user._id });
            if (created?._id) {
                setNewTitle("");
                setFeedback({ type: "success", message: "Collection created" });
                await loadCollections();
                setTimeout(() => navigate('/collections'), 2000);
            } else {
                setFeedback({ type: "error", message: "Failed to create collection" });
            }
        } catch (err) {
            setFeedback({ type: "error", message: err?.message || "Server error" });
        } finally {
            setLoading(false);
        }
    };

    // Update profile field
    const handleFieldUpdate = async (field) => {
        if (!currentPassword) return setFeedback({ type: "error", message: "Current password required" });
        let payload = { userId: user._id, email: user.email, password: currentPassword };
        if (field === "name" && editedName !== user.name) payload.newName = editedName;
        if (field === "email" && editedEmail !== user.email) payload.newEmail = editedEmail;
        if (field === "password" && newPassword) payload.newPassword = newPassword;
        try {
            const updatedUser = await editUser(payload);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setFeedback({ type: "success", message: "Profile updated" });
            setEditMode({ ...editMode, [field]: false });
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => setFeedback({ type: "", message: "" }), 2000);
        } catch (err) {
            setFeedback({ type: "error", message: err.message || "Server error" });
        }
    };

    return (
        <main className="min-h-screen pt-20 px-4 sm:px-6 md:px-10 pb-10 bg-gray-900 text-gray-100">
            <div className="bg-gray-800 p-6 sm:p-8 shadow-lg space-y-6 rounded-lg max-w-6xl mx-auto">
                {/* Profile header */}
                <h2 className="text-3xl font-bold">Profile Page</h2>

                {/* Name field */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="font-semibold w-24">Name:</label>
                    {editMode.name ? (
                        <>
                            <input
                                className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-white flex-1"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                            <button onClick={() => handleFieldUpdate("name")} className="bg-green-600 px-3 py-1 rounded text-white">Save</button>
                            <button onClick={() => setEditMode({ ...editMode, name: false })} className="text-sm text-red-400">Cancel</button>
                        </>
                    ) : (
                        <>
                            <span>{user.name}</span>
                            <button onClick={() => setEditMode({ ...editMode, name: true })} className="text-yellow-400 text-sm">Update</button>
                        </>
                    )}
                </div>

                {/* Email field */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="font-semibold w-24">Email:</label>
                    {editMode.email ? (
                        <>
                            <input
                                className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-white flex-1"
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                            />
                            <button onClick={() => handleFieldUpdate("email")} className="bg-green-600 px-3 py-1 rounded text-white">Save</button>
                            <button onClick={() => setEditMode({ ...editMode, email: false })} className="text-sm text-red-400">Cancel</button>
                        </>
                    ) : (
                        <>
                            <span>{user.email}</span>
                            <button onClick={() => setEditMode({ ...editMode, email: true })} className="text-yellow-400 text-sm">Update</button>
                        </>
                    )}
                </div>

                {/* Password field */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="font-semibold w-24">Password:</label>
                    {editMode.password ? (
                        <>
                            <input
                                type="password"
                                placeholder="New password"
                                className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-white flex-1"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button onClick={() => handleFieldUpdate("password")} className="bg-green-600 px-3 py-1 rounded text-white">Save</button>
                            <button onClick={() => setEditMode({ ...editMode, password: false })} className="text-sm text-red-400">Cancel</button>
                        </>
                    ) : (
                        <>
                            <span>••••••••</span>
                            <button onClick={() => setEditMode({ ...editMode, password: true })} className="text-yellow-400 text-sm">Update</button>
                        </>
                    )}
                </div>

                {/* Current password input */}
                {(editMode.name || editMode.email || editMode.password) && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                        <label className="font-semibold w-24">Current Password:</label>
                        <input
                            type="password"
                            className="bg-gray-700 border border-gray-600 px-2 py-1 rounded text-white flex-1"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                )}

                {/* Feedback message */}
                {feedback.message && (
                    <p className={`mt-2 text-sm ${feedback.type === "success" ? "text-green-400" : "text-red-400"}`}>
                        {feedback.message}
                    </p>
                )}

                {/* User stats */}
                <div className="text-sm text-gray-300 mt-4">
                    <p>Total Flashcards: {collections.reduce((total, col) => total + (col.totalNoFlashcards || 0), 0)}</p>
                    <p>Total Collections: {collections.length}</p>
                </div>

                {/* Navigation actions */}
                <div className="flex gap-4 mt-4">
                    <Link to="/bookmarks">
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold p-2 rounded-lg">
                            View Bookmarks
                        </button>
                    </Link>
                </div>

                {/* Create collection form */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-2">Create New Collection</h3>
                    <form onSubmit={handleCreateCollection} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Enter collection title"
                            className="flex-1 px-4 py-2 rounded border border-gray-600 focus:outline-none text-white bg-gray-700"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </form>
                </div>

                {/* Collections list */}
                <div className="mt-8">
                    <h3 className="text-2xl font-bold">Your Collections</h3>
                    <div className="grid gap-6 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {collections.length ? (
                            collections.map((collection) => (
                                <Link
                                    to={`/collections/${collection._id}`}
                                    key={collection._id}
                                    className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-5 rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-bold truncate">{collection.title}</h4>
                                        <p className="text-sm">📚 Sections: {collection.totalNoSections || 0}</p>
                                        <p className="text-sm">📝 Flashcards: {collection.totalNoFlashcards || 0}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-400">No collections found</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// Approach Explanation:
// The Profile component manages user profile and collections:
// - Uses React hooks (useState, useEffect, useCallback) for state and data fetching.
// - Integrates with collectionService and authService for backend operations.
// - Allows editing of name, email, and password with secure validation.
// - Enables creation and display of collections with navigation to bookmarks.
// - Uses Tailwind CSS for responsive, modern styling with a dark theme.