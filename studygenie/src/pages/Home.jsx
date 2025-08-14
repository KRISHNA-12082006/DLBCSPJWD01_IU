// Import routing, and logo
import { Link } from 'react-router-dom'
import IconImg from '../../public/icon.png'

/**
 * Home component renders the landing page for StudyGenie.
 *
 * Features:
 * - Displays a fixed navigation bar with logo and login link.
 * - Hero section with app name, logo, and tagline.
 * - About section describing StudyGenie.
 * - Features section showcasing key functionalities using FeatureCard components.
 * @component
 * @returns {JSX.Element} The rendered Home page.
 */
function Home() {
    return (
    <div className="bg-gradient-to-r from-sky-700 to-indigo-900 text-white py-10 px-5">

        {/* Navbar */}
        <nav className="fixed bg-white/10 backdrop-blur-md top-0 left-0 z-50 mb-6 w-screen">
        <div>
            <Link to="/" className="text-2xl font-bold text-violet-500 px-3 py-2 float-left my-1 mx-1">
                <img src={IconImg} alt="StudyGenie Logo" className="w-8 h-8 inline-block mr-2" />
                StudyGenie
            </Link>
            <Link to="/login" className="text-xl px-3 py-3 float-right hover:backdrop-blur-xl hover:shadow-xl hover:scale-105 transition mx-5 my-1 rounded-xl">
            Login
            </Link>
        </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center">

            {/* Header */}
            <header>
                <h1 className="text-5xl text-fuchsia-600 font-bold flex items-center justify-center pt-18 pb-5">
                    <img src={IconImg} alt="StudyGenie Logo" className="w-10 h-10 inline-block" />
                    StudyGenie
                </h1>
                <p className="text-lg opacity-80 pb-10">Master exams with smart flashcards, AI quiz, and instant feedback.</p>
            </header>

            {/* About Section */}
            <section className="max-w-3xl mx-auto text-center pb-15">
                <div>
                    <h2 className="text-2xl text-fuchsia-600 font-bold mb-3">What is StudyGenie?</h2>
                    <p>
                    StudyGenie is your intelligent revision assistant designed to make learning faster and more effective.
                    Whether you're prepping for university exams or brushing up on fundamentals, it gives you the right tools powered by AI.
                    </p>
                </div>
            </section>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 gap-8 max-w-6xl justify-center mx-auto">
            <FeatureCard 
                heading= "📋 Interactive Flashcards"
                description= "Clean and categorized flashcards for rapid revision, organized by topics."
            />
            <FeatureCard 
                heading= "💬 AI Tutor"
                description= "Ask questions, get hints, and go deeper into any topic with AI chat support."
            />
            <FeatureCard 
                heading= "⭐ Bookmarked Flashcards"
                description="Bookmark your flashcards to enhance your learning experience."
            />
            <FeatureCard 
                heading= "🧩 Share Your Collections"
                description= "Create collections of flashcards and share them with friends. Collaborate and learn together."   
            />
        </section>
    </div>
    )
}

export default Home


/**
 * FeatureCard component renders a single feature block.
 * @component
 * @param {Object} props
 * @param {string} props.heading - Title of the feature
 * @param {string} props.description - Short description of the feature
 * @returns {JSX.Element} A styled card for a feature
 */
function FeatureCard({ heading, description }) {
    return (
        <div className="bg-white/10 p-6 rounded shadow hover:shadow-xl hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">{heading}</h3>
            <p className="opacity-80">{description}</p>
        </div>
    )
}

