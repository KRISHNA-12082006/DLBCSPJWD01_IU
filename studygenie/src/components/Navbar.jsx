import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import IconImg from '../../public/icon.png';
import { logoutUser } from '../services/authService';

/**
 * Navbar component renders the top navigation bar for the application.
 * It displays links to main pages, a logout button, and supports a mobile menu toggle.
 * @component
 * @returns {JSX.Element} The responsive navigation bar with links and logout functionality.
*/
function Navbar() {
const location = useLocation();
const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);

// Returns styling classes for links based on whether the current path matches the link's path
const linkClass = (path) =>
  `text-sm md:text-base px-3 py-2 rounded-md transition-colors duration-200 ${
    location.pathname === path
      ? 'text-white bg-violet-600 font-semibold'
      : 'text-white/80 hover:text-white hover:bg-violet-500/30'
  }`;

// Handles user logout by calling the logout service and redirecting to login page
const handleLogout = () => {
logoutUser(navigate);
navigate('/login');
};

return (
<nav className="fixed top-0 left-0 z-50 backdrop-blur-xl bg-white/10 text-white px-4 py-3 w-full shadow-md">
<div className="flex justify-between items-center max-w-screen-xl mx-auto">
{/* Logo and title linking to profile */}
<Link to="/profile" className="flex items-center text-xl font-bold text-violet-500 hover:text-violet-400" >
<img src={IconImg} alt="StudyGenie Logo" className="w-6 h-6 mr-2" />
StudyGenie
</Link>

    {/* Desktop navigation links */}
    <div className="hidden md:flex items-center gap-4">
      <Link to="/collections" className={linkClass('/collections')}>
        Collections
      </Link>
      <Link to="/bookmarks" className={linkClass('/bookmarks')}>
        Bookmarks
      </Link>
      <Link to="/tutor" className={linkClass('/tutor')}>
        AI Tutor
      </Link>
      <Link to="/about" className={linkClass('/about')}>
        About
      </Link>
    </div>

    {/* Desktop logout button */}
    <div className="hidden md:block">
      <button
        onClick={handleLogout}
        className="text-sm md:text-base px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors duration-200"
      >
        Logout
      </button>
    </div>

    {/* Mobile menu toggle button */}
    <div className="md:hidden">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {menuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </div>
  </div>

  {/* Mobile dropdown menu */}
  {menuOpen && (
    <div className="md:hidden mt-2 flex flex-col gap-2 bg-violet-800/90 rounded-lg p-4 shadow-md">
      <Link
        to="/collections"
        onClick={() => setMenuOpen(false)}
        className={linkClass('/collections')}
      >
        Collections
      </Link>
      <Link
        to="/bookmarks"
        onClick={() => setMenuOpen(false)}
        className={linkClass('/bookmarks')}
      >
        Bookmarks
      </Link>
      <Link
        to="/tutor"
        onClick={() => setMenuOpen(false)}
        className={linkClass('/tutor')}
      >
        AI Tutor
      </Link>
      <Link
        to="/about"
        onClick={() => setMenuOpen(false)}
        className={linkClass('/about')}
      >
        About
      </Link>
      <button
        onClick={() => {
          setMenuOpen(false);
          handleLogout();
        }}
        className="text-sm px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
      >
        Logout
      </button>
    </div>
  )}
</nav>
);
}

export default Navbar;