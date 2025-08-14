import { useEffect } from 'react';

/**
 * FlashcardModal displays a single flashcard in a fullscreen modal view.
 * Uses dynamic background and text colors passed as props.
 * Supports keyboard navigation (Left/Right arrows) and closing with the Escape key.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.flashcard - The flashcard data (question and answer).
 * @param {string} [props.sectionName] - Name of the section this flashcard belongs to.
 * @param {string} [props.sectionBackgroundColor] - Background color for the modal.
 * @param {string} [props.sectionTextColor] - Text color for modal content.
 * @param {Function} props.onClose - Handles closing the modal.
 * @param {Function} props.onPrev - Shows the previous flashcard.
 * @param {Function} props.onNext - Shows the next flashcard.
 * @returns {JSX.Element} Fullscreen modal displaying a flashcard.
 */
function FlashcardModal({
  flashcard,
  sectionName = '',
  sectionBackgroundColor = '#1a202c',
  sectionTextColor = '#fff',
  onClose,
  onPrev,
  onNext,
}) {
  // Keyboard controls for navigation & close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    // Modal overlay background
    <div className="fixed inset-0 z-50 bg-black/80 bg-opacity-60 flex items-center justify-center p-4">
      <div
        className="rounded-lg w-full max-w-2xl shadow-md space-y-6 border relative"
        style={{
          backgroundColor: sectionBackgroundColor, // whole modal background
          color: sectionTextColor,                  // modal text
          borderColor: sectionTextColor,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl hover:opacity-80 transition"
          style={{ color: sectionTextColor }}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6 space-y-6">
          {/* Section title */}
          {sectionName && (
            <h2 className="text-xl font-bold">
              Section:{' '}
              <span style={{ textDecoration: 'underline' }}>
                {sectionName}
              </span>
            </h2>
          )}

          {/* Question */}
          <div>
            <h3 className="text-lg font-semibold mb-1">Q:</h3>
            <div
              className="p-3 rounded border"
              style={{
                borderColor: sectionTextColor,
                backgroundColor: `${sectionTextColor}20`, // faint transparency
              }}
            >
              {flashcard.question}
            </div>
          </div>

          {/* Answer */}
          <div>
            <h3 className="text-lg font-semibold mb-1">A:</h3>
            <div
              className="p-3 rounded border"
              style={{
                borderColor: sectionTextColor,
                backgroundColor: `${sectionTextColor}20`,
              }}
            >
              {flashcard.answer || '—'}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={onPrev}
              className="font-medium text-lg"
              style={{ color: sectionTextColor }}
            >
              ⬅ Prev
            </button>
            <button
              onClick={onNext}
              className="font-medium text-lg"
              style={{ color: sectionTextColor }}
            >
              Next ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashcardModal;
