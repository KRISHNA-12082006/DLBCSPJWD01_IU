/**
 * About component renders the StudyGenie About page.
 * @component
 * @returns {JSX.Element} About page content
 */
export default function About() {
    return (
        <div className="min-h-screen p-16 lg:px-24 pt-40 bg-gradient-to-r from-sky-700 to-indigo-900 text-white">
            {/* Project title and intro */}
            <h1 className="text-4xl font-bold mb-4 text-violet-500">About StudyGenie</h1>
            <p className="text-lg mb-8 opacity-90">
                <strong>StudyGenie</strong> is an AI-powered revision tool for computer science and technical exams,
                offering smart flashcards and an AI tutor for interactive learning.
            </p>

            {/* Features list */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Project Features</h2>
                <ul className="list-disc list-inside max-w-xl mx-auto opacity-90">
                    <li>Topic-based flashcards for rapid revision</li>
                    <li>AI tutor for hints and explanations</li>
                    <li>Customizable datasets with scalable architecture</li>
                </ul>
            </section>

            {/* Technical approaches */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Technical Approach</h2>
                <h3 className="text-xl font-bold mt-4">Frontend</h3>
                <p className="opacity-90 max-w-3xl mx-auto">
                    Built with <strong>React.js</strong> and React Router for navigation.
                    Styled with <strong>Tailwind CSS</strong> for responsive design.
                    Uses Fetch API for RESTful backend communication.
                    Manages state with React hooks (<code>useState</code>, <code>useEffect</code>).
                </p>
                <h3 className="text-xl font-bold mt-4">Backend</h3>
                <p className="opacity-90 max-w-3xl mx-auto">
                    Uses <strong>Node.js</strong> and <strong>Express.js</strong> for API routing.
                    <strong>MongoDB</strong> with <strong>Mongoose</strong> for data management.
                    Implements JWT authentication and <strong>bcrypt.js</strong> for secure password hashing.
                    Follows MVC architecture for organized logic.
                </p>
            </section>

            {/* GitHub repository */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">GitHub Repository</h2>
                <a
                    href="https://github.com/KRISHNA-12082006/StudyGenie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 underline hover:text-blue-500"
                >
                    View Project on GitHub
                </a>
            </section>

            {/* Documentation approach */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Documentation</h2>
                <ul className="list-disc list-inside max-w-3xl mx-auto opacity-90">
                    <li>Javadoc-style comments for React components and backend functions</li>
                    <li>Inline comments for key logic</li>
                    <li>In-code documentation, no separate files</li>
                </ul>
            </section>

            {/* Developer info */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">About the Developer</h2>
                <p className="opacity-90">
                    <strong>Krishna Kanojiya</strong>, a student at <strong>IU International University of Applied Sciences</strong>,
                    built StudyGenie to enhance learning with AI-driven tools.
                    Interests: web development, AI, and educational solutions.
                </p>
            </section>

            {/* University info */}
            <section>
                <h2 className="text-2xl font-semibold mb-2">University</h2>
                <p className="opacity-90">
                    <strong>IU International University of Applied Sciences</strong><br />
                    Bachelor in Computer Science
                </p>
            </section>

            {/* Contact */}
            <section className="mt-10">
                <a
                    href="mailto:krishna.cs96.ai@outlook.com"
                    className="text-blue-300 underline hover:text-blue-500"
                >
                    Contact Me
                </a>
            </section>
        </div>
    );
}

// Approach Explanation:
// The About component presents StudyGenie’s purpose and technical details:
// - Uses React for rendering a structured, informative page.
// - Organizes content into sections: intro, features, technical approach, documentation, developer info.
// - Applies Tailwind CSS for responsive, gradient-styled design.
// - Links to GitHub and email for accessibility.
// - Follows Javadoc-style documentation for frontend consistency.