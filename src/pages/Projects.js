import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "KSLW";

// ✅ Manual grouping overrides
const overrides = {
  obsidian: ["obsidian-core-backend", "dashboard"],
  portfolio: ["kirk-portfolio", "kirk-portfolio-v2"],
};

// ✅ Helper: safely detect URLs in repo descriptions
function extractLiveURL(description) {
  if (!description || typeof description !== "string") return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = description.match(urlRegex);
  return matches ? matches[0] : null;
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL repos from GitHub
  async function fetchAllRepos() {
    let allRepos = [];
    let page = 1;
    let done = false;

    while (!done) {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`
      );
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        done = true;
      } else {
        allRepos = allRepos.concat(data);
        page++;
      }
    }

    // Only keep your repos, not forks
    return allRepos.filter((r) => !r.fork && r.owner.login === GITHUB_USERNAME);
  }

  useEffect(() => {
    async function fetchRepos() {
      try {
        const repos = await fetchAllRepos();

        // Auto-group by prefix (before first dash)
        const grouped = repos.reduce((acc, repo) => {
          const base = repo.name.split("-")[0];
          if (!acc[base]) acc[base] = [];
          acc[base].push(repo);
          return acc;
        }, {});

        // Apply manual overrides
        Object.entries(overrides).forEach(([group, repoNames]) => {
          const matched = repos.filter((r) => repoNames.includes(r.name));
          if (matched.length > 0) grouped[group] = matched;
        });

        // Convert groups to displayable projects
        const groupedProjects = await Promise.all(
          Object.entries(grouped).map(async ([name, repos]) => {
            const mainRepo = repos[0];
            let liveUrl = extractLiveURL(mainRepo.description);

            // Try checking GitHub topics for “live”, “demo”, etc.
            try {
              const topicsRes = await fetch(mainRepo.url + "/topics", {
                headers: { Accept: "application/vnd.github.mercy-preview+json" },
              });
              const topicsData = await topicsRes.json();

              if (
                topicsData &&
                topicsData.names &&
                topicsData.names.some((t) =>
                  ["live", "demo", "vercel", "deploy"].includes(t.toLowerCase())
                )
              ) {
                liveUrl =
                  liveUrl ||
                  `https://${mainRepo.name.replace(/_/g, "-")}.vercel.app`;
              }
            } catch (topicErr) {
              console.warn("Topic fetch failed:", topicErr);
            }

            return {
              name: name.charAt(0).toUpperCase() + name.slice(1),
              description:
                mainRepo.description ||
                (repos.length > 1
                  ? "A multi-part project built across several repositories."
                  : "A project from my GitHub portfolio."),
              links: [
                ...repos.map((r) => ({
                  label:
                    repos.length > 1
                      ? r.name.replace(`${name}-`, "").replaceAll("-", " ")
                      : "GitHub",
                  url: r.html_url,
                })),
                ...(liveUrl
                  ? [
                      {
                        label: "Live Demo",
                        url: liveUrl,
                        live: true,
                      },
                    ]
                  : []),
              ],
              updated_at: mainRepo.updated_at,
            };
          })
        );

        // Sort newest first
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
      <p className="lead">Auto-synced with GitHub — includes live demos where available.</p>

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project.name} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <div className="stack">
              <span className="chip">Auto Fetched</span>
            </div>

            <div style={{ marginTop: "10px" }}>
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${link.live ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    marginRight: "8px",
                    fontSize: "0.85rem",
                    padding: "0.4rem 0.8rem",
                    background: link.live
                      ? "linear-gradient(90deg, var(--mint), var(--purple))"
                      : "var(--bg-elev)",
                    color: link.live ? "#111" : "var(--text)",
                    border: link.live ? "none" : "1px solid var(--border)",
                    fontWeight: link.live ? 600 : 500,
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
