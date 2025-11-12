import { useState } from "react";

export default function ProjectCard({ title, description, stack = [], link }) {
  const [expanded, setExpanded] = useState(false);

  const toggleCard = () => setExpanded(!expanded);

  return (
    <div
      className={`project-card ${expanded ? "expanded" : ""}`}
      onClick={toggleCard}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleCard()}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <div className="project-card-inner">
        <h3>{title || "Untitled Project"}</h3>
        <p>{description || "No description available."}</p>

        <div className="stack">
          {stack.length > 0 ? (
            stack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))
          ) : (
            <span className="chip muted">Tech stack unavailable</span>
          )}
        </div>

        {expanded && link && (
          <a
            className="project-link"
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View on GitHub ↗
          </a>
        )}
      </div>
    </div>
  );
}
