import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "KSLW";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL repos (pagination aware)
  async function fetchAllRepos() {
    let allRepos = [];
    let page = 1;
    let done = false;

    while (!done) {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`
      );
      const data = await res.json();

      if (data.length === 0) done = true;
      else {
        allRepos = allRepos.concat(data);
        page++;
      }
    }

    return allRepos;
  }

  useEffect(() => {
    async function fetchRepos() {
      try {
        const repos = await fetchAllRepos();

        // Filter only your owned, non-fork repos
        const userRepos = repos.filter((repo) => !repo.fork && repo.owner.login === GITHUB_USERNAME);

        // Group by base project name
        const grouped = userRepos.reduce((acc, repo) => {
          const base = repo.name.split("-")[0]; // e.g. obsidian-core → obsidian
          if (!acc[base]) acc[base] = [];
          acc[base].push(repo);
          return acc;
        }, {});

        // Convert grouped repos to clean project objects
        const groupedProjects = Object.entries(grouped).map(([name, repos]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          description:
            repos[0].description ||
            (repos.length > 1
              ? "A multi-part project built across several repositories."
              : "A project from my GitHub portfolio."),
          links: repos.map((r) => ({
            label:
              repos.length > 1
                ? r.name.replace(`${name}-`, "").replaceAll("-", " ")
                : "GitHub",
            url: r.html_url,
          })),
          tech: [],
          updated_at: repos[0].updated_at,
        }));

        // Sort newest first
        groupedProjects.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );

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
      <p className="lead">Automatically synced with all public GitHub repositories.</p>

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
