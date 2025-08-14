
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
    AI_API_KEY=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
    FRONTEND_URL=http://localhost:5173
    DB_URI='mongodb+srv://sg-user:xyamU1qaCqj92sqy@sg-cluster.efevdja.mongodb.net/?retryWrites=true&w=majority&appName=SG-cluster'
    ```
* Obtained `AI_API_KEY` from OpenRouter and `DB_URI` from MongoDB Atlas.

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

Test cases are documented in the Phase 2 presentation (Slides 13–15), covering:

* Authentication (login, registration).
* Collection management (create, rename, delete).
* Section and flashcard operations (create, edit, bookmark).
* AI tutor queries and navigation (desktop/mobile).
  Refer to the presentation for detailed test cases (TC1–TC12).

## Future Enhancements

* Flashcard sharing via public links.
* Advanced AI features (e.g., contextual flashcard integration).
* Gamification for engagement (e.g., quiz modes).

## License

MIT License. See `LICENSE` file for details.