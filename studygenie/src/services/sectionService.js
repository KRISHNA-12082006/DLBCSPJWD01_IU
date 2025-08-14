// studygenie/src/services/sectionServices.js

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = axios.create({
    baseURL: `${API_BASE}/api/sections`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Get one section by ID
export const getSectionById = async (sectionId) => {
    try {
        const res = await API_URL.post("/section", { sectionId });
        return res.data;
    } catch (error) {
        console.error("🔴 Failed to get section by ID:", error.response?.data || error.message);
        return null;
    }
};

// Get all sections for a collection
export const getSectionsByCollectionId = async (collectionId) => {
    try {
        const res = await API_URL.post("/sections", { collectionId });
        return res.data;
    } catch (error) {
        console.error("🔴 Failed to fetch sections:", error.response?.data || error.message);
    return [];
    }
};

// Create a new section
export const createNewSection = async (sectionData) => {
    try {
        const res = await API_URL.post("/newSection", sectionData);
        return res.data;
    } catch (error) {
        console.error("🔴 Failed to create section:", error.response?.data || error.message);
        return null;
    }
};

// Edit Section
export const editSection = async (sectionId, updatedData) => {
    try {
        const res = await API_URL.put("/editSection", { sectionId, ...updatedData });
        return res.data;
    } catch (error) {
        console.error("🔴 Failed to edit section:", error.response?.data || error.message);
        return null;
    }
};

// Delete a section
export const deleteSection = async (sectionId, userId) => {
    try {
        const res = await API_URL.delete("/deleteSection", {
            data: { sectionId, userId }
        });
        return res.data;
    } catch (error) {
        console.error("🔴 Failed to delete section:", error.response?.data || error.message);
        return null;
    }
};
