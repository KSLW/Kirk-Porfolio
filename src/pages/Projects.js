import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "KSLW";

// ✅ Manual grouping overrides
const overrides = {
  obsidian: ["obsidian-core-backend", "dashboard"], // even if names differ
  portfolio: ["kirk-portfolio", "kirk-portfolio-v2"],
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

    return allRepos.filter((r) => !r.fork && r.owner.login === GITHUB_USERNAME);
  }

  useEffect(() => {
    async function fetchRepos() {
      try {
        const repos = await fetchAllRepos();

        // Group repos by prefix (default)
        const grouped = repos.reduce((acc, repo) => {
          const base = repo.name.split("-")[0];
          if (!acc[base]) acc[base] = [];
          acc[base].push(repo);
          return acc;
        }, {});

        // Apply manual overrides
        Object.entries(overrides).forEach(([group, repoNames]) => {
          const matchedRepos = repos.filter((r) => repoNames.includes(r.name));
          if (matchedRepos.length > 0) grouped[group] = matchedRepos;
        });

        // Convert to array of cards
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
          updated_at: repos[0].updated_at,
        }));

        groupedProjects.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );

        setProjects(groupedProjects);
      } catch (err) {
        console.error("GitHub API error:", err);
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
      <p className="lead">Automatically synced from GitHub (including grouped repos).</p>

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project.name} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <div className="stack">
              <span className="chip">Auto fetched</span>
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
