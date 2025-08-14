import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './global.css'; // Global styles from Tailwind CSS

// Import pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Collections from './pages/Collections';
import Collection from './pages/Collection';
import Section from './pages/Section';
import Tutor from './pages/Tutor';
import About from './pages/About';

// Layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/**
 * AppContent defines the main application layout and routes.
 * It also decides when to show or hide the Navbar based on the current path.
 *
 * @component
 * @returns {JSX.Element} Rendered application content.
 */
function AppContent() {
  const location = useLocation();

  // Paths where Navbar should not be displayed (e.g., landing page, login page)
  const noNavbarPaths = ['/', '/login'];

  // Paths that should display the Navbar
  const validNavbarPaths = [
    '/profile',
    '/bookmarks',
    '/collections',
    '/collections/*',
    '/sections',
    '/sections/*',
    '/tutor',
    '/about'
  ];

  // Check if the current path matches any Navbar-visible routes
  const shouldShowNavbar =
    !noNavbarPaths.includes(location.pathname) &&
    (
      validNavbarPaths.some(path => location.pathname.startsWith(path)) ||
      /^\/collections\/[^/]+$/.test(location.pathname) ||
      /^\/sections\/[^/]+$/.test(location.pathname)
    );

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:collectionId" element={<Collection />} />
        <Route path="/sections/:sectionId" element={<Section />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<p>Page Not Found</p>} />
      </Routes>

      <Footer />
    </>
  );
}

/**
 * App is the root component that wraps AppContent with the Router.
 */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
