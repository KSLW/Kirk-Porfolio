import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "KSLW";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`
        );
        const data = await res.json();

        // Group repos by base name (prefix before first "-")
        const grouped = data.reduce((acc, repo) => {
          // Skip archived or forked repos (optional)
          if (repo.fork) return acc;

          const baseName = repo.name.split("-")[0]; // e.g. obsidian-core → obsidian
          if (!acc[baseName]) acc[baseName] = [];
          acc[baseName].push(repo);
          return acc;
        }, {});

        // Convert to array format
        const groupedProjects = Object.entries(grouped).map(([key, repos]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          description:
            repos[0].description ||
            "A project made up of multiple repositories.",
          links: repos.map((r) => ({
            label:
              repos.length > 1
                ? r.name.replace(`${key}-`, "").replaceAll("-", " ")
                : "GitHub",
            url: r.html_url,
          })),
          tech: [],
        }));

        setProjects(groupedProjects);
      } catch (err) {
        console.error("Error fetching GitHub repos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  if (loading) return <div className="section">Loading projects...</div>;

  return (
    <section className="section">
      <h2>Projects</h2>
      <p className="lead">Automatically synced from GitHub.</p>

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project.name} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <div className="stack">
              {project.tech.length > 0 ? (
                project.tech.map((t) => <span key={t} className="chip">{t}</span>)
              ) : (
                <span className="chip">Auto Fetched</span>
              )}
            </div>

            <div style={{ marginTop: "10px" }}>
              {project.links.map((link) => (
                <a
                  key={link.url}
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
};

export default Projects;
