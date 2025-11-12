import { Link } from "react-router-dom";
import RecentWork from "../components/RecentWork";

export default function Home() {
  return (
    <>
      <section
        className="hero"
        role="banner"
        aria-label="Introduction section"
      >
        <div className="container">
          <h1 className="animate-hero">
            Building useful, human-centered web apps.
          </h1>
          <p>
            I'm <strong>Kirk Wilkinson</strong>, a full-stack JavaScript developer focused on the MERN stack. 
            Clean code, clear UX, and shipping value are my priorities.
          </p>
          <div className="btn-row">
            <Link to="/projects" className="btn btn-primary">
              View Projects
            </Link>
            <Link to="/contact" className="btn">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      <RecentWork />
    </>
  );
}
