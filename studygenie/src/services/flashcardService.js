// src/services/flashcardService.js

import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = axios.create({
  baseURL: `${API_BASE}/api/flashcards`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all flashcards in a section
export const getFlashcardsBySectionId = async (sectionId, userId) => {
  try {
    const res = await API_URL.post('/flashcards', { sectionId, userId });
    console.log("🔍 Flashcards fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch flashcards by section:", error);
    return [];
  }
};

// Get all bookmarked flashcards for a user
export const getBookmarkedFlashcards = async (userId) => {
  try {
    const res = await API_URL.post('/bookmarked', { userId } );
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch bookmarked flashcards:", error);
    return [];
  }
};

// Create multiple flashcards in a section
export const createNewFlashcards = async (sectionId, userId, flashcards) => {
  try {
    const res = await API_URL.post('/newFlashcard', { sectionId, userId, flashcards });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to create flashcards:", error);
    return null;
  }
};

// Edit a flashcard (question, answer, or bookmarked)
export const editFlashcard = async (flashcardId, userId, updatedData) => {
  try {
    const res = await API_URL.put('/editFlashcard', { flashcardId, userId, ...updatedData });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to edit flashcard:", error);
    return null;
  }
};

// Delete a flashcard
export const deleteFlashcard = async (flashcardId, userId, collectionId) => {
  try {
    const res = await API_URL.delete('/deleteFlashcard', {data: { flashcardId, userId, collectionId }});
    return res.data;
  } catch (error) {
    console.error("❌ Failed to delete flashcard:", error);
    return null;
  }
};
