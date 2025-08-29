# StudyGenie

A personalized flashcard web application for academic self-study, built with the MERN stack and Tailwind CSS.

## Overview

StudyGenie enables students to create, organize, and revise flashcards efficiently. It offers a responsive interface, hierarchical content organization (Collections > Sections > Flashcards), bookmarking, and an AI-powered tutor via the OpenRouter API. The app is designed for university students, high school STEM students, and self-learners preparing for exams or certifications.

* **Course** : Project Java and Web Development (DLBCSPJWD01)
* **Student** : Krishna Premshankar Kanojiya
* **University** : IU International University of Applied Sciences
* **GitHub** : [https://github.com/KRISHNA-12082006/DLBCSPJWD01_IU](https://github.com/KRISHNA-12082006/DLBCSPJWD01_IU)
* **Live Demo** : [https://studygenie-0j30.onrender.com/](https://studygenie-0j30.onrender.com/)

## Features

* **User Functionality** :
* Create and manage collections, sections, and flashcards.
* Bookmark flashcards for quick revision.
* Hierarchical organization: Collections > Sections > Flashcards.
* Modal-based flashcard review with Next/Previous navigation.
* Responsive design for desktop and mobile.
* **AI Support** :
* AI tutor chat interface for academic Q&A via OpenRouter API.
* **User Experience** :
* Simple, distraction-free UI with Tailwind CSS (violet: #7C3AED, yellow: #FBBF24, gray: #1A202C).
* Color-coded sections and flashcards with customizable colors.
* Shareable URLs for collections and sections.
* **Security** :
* User registration and login with password hashing.
* Personalized flashcard storage per user.

## Technology Stack

* **Frontend** :
* React.js (Vite): Dynamic, component-based UI.
* Tailwind CSS: Responsive, dark-themed styling.
* React Router: Client-side navigation.
* Axios: API requests to backend.
* **Backend** :
* Express.js: API routing and request handling.
* Mongoose: MongoDB data modeling.
* MongoDB: NoSQL database for users, collections, sections, flashcards.
* CORS: Cross-origin request handling.
* bcryptjs: Password hashing for authentication.
* **AI Integration** : OpenRouter API for AI tutor.
* **Tools** : GitHub (version control), Visual Studio Code, Nodemon (server auto-restart).

## Setup Instructions

1. **Clone Repository** :

```bash
   git clone https://github.com/KRISHNA-12082006/DLBCSPJWD01_IU
```

1. **Install Dependencies** :

* Navigate to `/studygenie` and `/backend` directories.
* Run:
  ```bash
  npm install
  ```
* Note: `node_modules` and `.env` files are excluded via `.gitignore`.

1. **Configure Environment Variables** :

* Create `.env` files (not included in GitHub for security):
  * `/studygenie/.env`:
    ```bash
    VITE_API_URL=http://localhost:5500
    ```
  * `/backend/.env`:
    ```bash
    PORT=5500
    AI_API=https://openrouter.ai/api/v1/chat/completions
    AI_API_KEY=<openRouter_API_KEY>
    FRONTEND_URL=http://localhost:5173
    DB_URI=<MongoDB_URI>
    ```
* Obtain `AI_API_KEY` from OpenRouter and `DB_URI` from MongoDB Atlas.

1. **Run Application** :

* In `/studygenie` and `/backend`, run:
  ```bash
  npm run dev
  ```
* Access frontend at `http://localhost:5173` and backend at `http://localhost:5500`.

1. **Live Demo** :

* Visit `https://studygenie-0j30.onrender.com/` for the deployed app.

## Project Structure

* **Frontend** (`/studygenie`):
  * `Home.jsx`: Landing page.
  * `Auth.jsx`: Login and registration forms.
  * `Profile.jsx`: User profile and collection creation.
  * `Collections.jsx`: Collection management (rename, delete).
  * `Collection.jsx`: Section management within collections.
  * `Section.jsx`: Flashcard creation and display.
  * `Bookmarks.jsx`: Bookmarked flashcards.
  * `Tutor.jsx`: AI tutor chat interface.
  * `Navbar.jsx`: Responsive navigation bar.
  * `FlashcardModal.jsx`, `FlashcardCreationModal.jsx`: Flashcard review and bulk creation.
* **Backend** (`/backend`):
  * `routes/authRoutes.js`, `services/authService.js`: User authentication.
  * `routes/collectionRoutes.js`, `services/collectionService.js`: Collection management.
  * `routes/sectionRoutes.js`, `services/sectionService.js`: Section management.
  * `routes/flashcardRoutes.js`, `services/flashcardService.js`: Flashcard operations.
  * `routes/aiRoutes.js`: AI tutor API integration.
  * `config.js`: Environment variable configuration.

## Running the Application

* After setup, the app supports:
  * User registration/login (`/login`, `/register`).
  * Collection/section/flashcard creation and management (`/profile`, `/collections`, `/sections`).
  * Bookmarking flashcards (`/bookmarks`).
  * AI tutor queries (`/tutor`).
  * Responsive navigation via `Navbar.jsx`.
* The live demo on Render (`https://studygenie-0j30.onrender.com/`) provides full functionality without local setup.

## Testing

Test cases cover:

* Authentication (login, registration).
* Collection management (create, rename, delete).
* Section and flashcard operations (create, edit, bookmark).
* AI tutor queries and navigation (desktop/mobile).

TC1: User Login
Description: Tests successful login with valid credentials.
Test Data: Email: testuser@example.com, Password: Password123
Preconditions: User is registered in the system. Backend API is running.
Steps:
1. Navigate to /login.
2. Enter email in the field.
3. Enter password in the field.
4. Click "Login".
Expected Outcome: Redirect to /profile, "Logged in successfully" message, localStorage has user object.

TC2: User Registration
Description: Tests successful registration with valid data.
Test Data: Email: newuser@example.com, Password: NewPass456
Preconditions: User does not exist in the system. Backend API is running.
Steps:
1. Navigate to /register.
2. Enter email in the field.
3. Enter password in the field.
4. Confirm password.
5. Click "Register".
Expected Outcome: Redirect to /login, "Registered successfully" message, new user in database.

TC3: Create Collection
Description: Tests creating a new collection for a logged-in user.
Test Data: Title: Math Basics, User ID: user123
Preconditions: User is logged in with ID user123. Backend API is running.
Steps:
1. Navigate to /profile.
2. Enter title in input.
3. Click "Create Collection".
Expected Outcome: Collection in list, "Collection created" message, backend updates MongoDB.

TC4: Rename Collection
Description: Tests renaming an existing collection.
Test Data: Collection ID: col456, New Title: Algebra Fundamentals
Preconditions: User is logged in with ID user123. Collection col456 exists. Backend API is running.
Steps:
1. Navigate to /collections.
2. Click "Rename" on target collection.
3. Enter new title in prompt.
4. Confirm.
Expected Outcome: Title updated, no error message, reflected in UI.

TC5: Delete Collection
Description: Tests deleting an existing collection.
Test Data: Collection ID: col456
Preconditions: User is logged in with ID user123. Collection col456 exists. Backend API is running.
Steps:
1. Navigate to /collections.
2. Click "Delete" on target collection.
3. Confirm deletion in prompt.
Expected Outcome: Collection removed from list, "Collection deleted" message, backend deletes from MongoDB.

TC6: Create Section
Description: Tests creating a new section in a collection.
Test Data: Collection ID: col456, Name: Linear Equations, Bg Color: #1a202c, Text Color: #fff
Preconditions: User is logged in with ID user123. Collection col456 exists. Backend API is running.
Steps:
1. Navigate to /collections/col456.
2. Click "+ New Section".
3. Enter name in prompt.
4. Enter background color in prompt.
5. Enter text color in prompt.
6. Confirm.
Expected Outcome: Section created, "Section created" message, displayed in collection with colors.

TC7: Edit Section
Description: Tests editing an existing section’s details.
Test Data: Section ID: sec789, New Name: Quadratic Equations, New Bg Color: #559, New Text Color: #fff
Preconditions: User is logged in with ID user123. Section sec789 exists. Backend API is running.
Steps:
1. Navigate to /collections/col456.
2. Click "Edit" on target section.
3. Update name in modal.
4. Update background color.
5. Update text color.
6. Click "Save".
Expected Outcome: Section updated, "Section updated" message, changes reflected in UI.

TC8: Create Flashcards
Description: Tests creating new flashcards in a section.
Test Data: Section ID: sec789, Flashcards: [{ question: "2+2?", answer: "4" }]
Preconditions: User is logged in with ID user123. Section sec789 exists. Backend API is running.
Steps:
1. Navigate to /sections/sec789.
2. Click "+ Add Flashcards".
3. Enter question and answer in modal.
4. Click "Submit".
Expected Outcome: Flashcards added, "Flashcards created" message, displayed in section grid.

TC9: Toggle Bookmark
Description: Tests bookmarking/unbookmarking a flashcard.
Test Data: Flashcard ID: fc101, Initial Bookmarked: false
Preconditions: User is logged in with ID user123. Flashcard fc101 exists. Backend API is running.
Steps:
1. Navigate to /sections/sec789.
2. Click bookmark star (☆) on target flashcard.
3. Navigate to /bookmarks.
Expected Outcome: Star changes to ⭐, flashcard in /bookmarks, "Flashcard bookmarked" message.

TC10: AI Tutor Query
Description: Tests submitting a question to the AI tutor and receiving a response.
Test Data: Question: "What is the Pythagorean theorem?"
Preconditions: User is logged in with ID user123. AI API endpoint is configured. Backend API is running.
Steps:
1. Navigate to /tutor.
2. Enter question in textarea.
3. Click "Send".
Expected Outcome: AI response in chat log, no error.

TC11: Navigation Links
Description: Tests navigation links in the navbar.
Test Data: Links: /collections, /bookmarks, /tutor, /about
Preconditions: User is logged in with ID user123. Backend API is running.
Steps:
1. Navigate to /profile.
2. Click "Collections" in navbar.
3. Return to /profile.
4. Click "Bookmarks" in navbar.
5. Repeat for "AI Tutor" and "About".
Expected Outcome: Correct navigation, active link highlighted (violet-600), no errors.

TC12: Mobile Menu Toggle
Description: Tests the mobile menu toggle functionality.
Test Data: Screen Width: <768px
Preconditions: User is logged in with ID user123. Browser window resized to mobile view.
Steps:
1. Resize browser to mobile view.
2. Click hamburger icon in navbar.
3. Click "Collections" in menu.
4. Click close icon (X).
Expected Outcome: Menu opens/closes, navigation works, no errors.

## Future Enhancements

* Flashcard sharing via public links.
* Advanced AI features (e.g., contextual flashcard integration).
* Gamification for engagement (e.g., quiz modes).

## License

MIT License. See `LICENSE` file for details.
