// studygernie/src/services/collectionServices.js

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = axios.create({
  baseURL: `${API_BASE}/api/collections`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Get all collections for a user
export const fetchCollectionsByUserId = async (userId) => {
  try {
    const res = await API_URL.post("/collections", { userId });
    return res.data;
  } catch (error) {
    console.error("🔴 Failed to fetch collections:", error.response?.data || error.message);
    return [];
  }
};

// ✅ Get one collection with sections and flashcards
export const fetchCollectionById = async (collectionId) => {
  try {
    const res = await API_URL.post("/collection", { collectionId });
    return res.data;
  } catch (error) {
    console.error("🔴 Failed to fetch collection:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Create a new collection
export const createNewCollection = async (collection) => {
  try {
    const res = await API_URL.post("/newCollection", collection);
    return res.data;
  } catch (error) {
    console.error("🔴 Collection creation failed:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Change collection title
export const changeCollectionTitle = async (collectionId, newTitle) => {
  try {
    const res = await API_URL.put("/change-title", { collectionId, newTitle });
    return res.data;
  } catch (error) {
    console.error("🔴 Failed to change collection title:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Delete a collection (expects userId too)
export const deleteCollection = async (collectionId, userId) => {
  try {
    const res = await API_URL.delete("/deleteCollection", {
      data: { collectionId, userId },
    });
    return res.data;
  } catch (error) {
    console.error("🔴 Failed to delete collection:", error.response?.data || error.message);
    return null;
  }
};