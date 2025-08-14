/**
 * FlashcardCreationModal allows users to add multiple flashcards to a selected section.
 * Renders a modal with a section dropdown, dynamic flashcard input fields,
 * and form controls for submission or cancellation.
 *
 * @component
 * @param {Object} props
 * @param {string} props.selectedSectionId - Currently selected section ID.
 * @param {Function} props.setSelectedSectionId - Updates the selected section ID.
 * @param {Object} props.collection - The current collection containing its sections.
 * @param {Array} props.flashcards - Array of flashcard objects being created.
 * @param {Function} props.handleSubmit - Handles form submission.
 * @param {Function} props.handleInputChange - Handles changes in flashcard input fields.
 * @param {Function} props.handleAddInput - Adds another pair of question/answer inputs.
 * @param {Function} props.setShowModal - Controls modal visibility.
 * @returns {JSX.Element} Modal for creating multiple flashcards.
 */
function FlashcardCreationModal({
  selectedSectionId,
  setSelectedSectionId,
  collection,
  flashcards,
  handleSubmit,
  handleInputChange,
  handleAddInput,
  setShowModal
}) {
  return (
    // Background overlay for modal
    <div className="fixed inset-0 z-50 bg-black/80 bg-opacity-60 flex items-center justify-center">

      {/* Modal box */}
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-2xl space-y-4 relative">
        <h3 className="text-xl font-bold">Add Multiple Flashcards</h3>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">

          {/* Section dropdown */}
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          >
            {collection.sections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.name}
              </option>
            ))}
          </select>

          {/* Flashcard input pairs */}
          {flashcards.map((fc, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Question"
                value={fc.question}
                onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Answer (optional)"
                value={fc.answer}
                onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                className="border px-3 py-2 rounded"
              />
            </div>
          ))}

          {/* Form actions */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleAddInput}
              className="text-blue-600 font-semibold"
            >
              + Add More
            </button>
            <div className="space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FlashcardCreationModal;
