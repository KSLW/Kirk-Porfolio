import React from "react";

const projects = [
  {
    name: "Obsidian",
    description: "Two-part project: core backend and dashboard.",
    links: [
      { label: "Core Backend", url: "https://github.com/KSLW/obsidian-core-backend" },
      { label: "Dashboard", url: "https://github.com/KSLW/dashboard" },
    ],
    tech: ["Node.js", "PostgreSQL", "React", "Express"],
  },
  {
    name: "Other Project",
    description: "Single project example.",
    links: [
      { label: "GitHub", url: "https://github.com/KSLW/single-project" },
    ],
    tech: ["React", "MongoDB"],
  },
];

const Projects = () => (
  <section className="section">
    <h2>Projects</h2>
    <p className="lead">
      A selection of my work — personal, collaborative, and experimental.
    </p>

    <div className="card-grid">
      {projects.map((project) => (
        <div key={project.name} className="card">
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          <div className="stack">
            {project.tech.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>

          <div style={{ marginTop: "10px" }}>
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  marginRight: "8px",
                  fontSize: "0.85rem",
                  padding: "0.4rem 0.8rem",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Projects;
