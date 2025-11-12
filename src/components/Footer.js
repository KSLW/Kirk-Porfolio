export default function Footer() {
  return (
    <footer aria-label="Site footer">
      <div className="container">
        <small>© {new Date().getFullYear()} Kirk Wilkinson. All rights reserved.</small>
        <div className="links">
          <a
            className="link-dev"
            href="https://github.com/KSLW"
            target="_blank"
            rel="noreferrer"
            aria-label="View Kirk's GitHub profile"
          >
            🧑‍💻 GitHub
          </a>
          <a
            className="link-ux"
            href="https://www.linkedin.com/in/kirk-wilkinson-892304b9/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Kirk's LinkedIn profile"
          >
            💼 LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
