/**
 * Footer component displayed at the bottom of all pages.
 * Shows the current year, your name, and a link to your GitHub profile.
 *
 * @component
 * @returns {JSX.Element} The site footer.
 */
function Footer() {
  return (
    <footer className="bg-black py-6 text-center text-violet-600">
      {/* Using <pre> to keep spacing consistent for text and link */}
      <pre>
        © {new Date().getFullYear()} Krishna Kanojiya &nbsp; • &nbsp;
        <a
          href="https://github.com/KRISHNA-12082006"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:underline"
        >
          GitHub
        </a>
      </pre>
    </footer>
  );
}

export default Footer;
