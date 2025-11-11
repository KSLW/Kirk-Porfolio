import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "KSLW";

// ✅ Manual grouping + live demo overrides
const overrides = {
  obsidian: {
    repos: ["obsidian-core-backend", "dashboard"],
    live: [
      { label: "Dashboard Demo", url: "https://dashboard-3let.onrender.com" },
      { label: "API Demo", url: "https://obsidian-core-backend.onrender.com" },
    ],
  },
  portfolio: {
    repos: ["kirk-portfolio", "kirk-portfolio-v2"],
    live: [{ label: "Live Demo", url: "https://kirk-portfolio.vercel.app" }],
  },
};

// ✅ Helper: safely detect URLs in descriptions
function extractLiveURL(description) {
  if (!description || typeof description !== "string") return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = description.match(urlRegex);
  return matches ? matches[0] : null;
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all repos (with pagination)
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

    return allRepos.filter((r) => !r.fork && r.owner.login === GITHUB_USERNAME);
  }

  useEffect(() => {
    async function fetchRepos() {
      try {
        const repos = await fetchAllRepos();

        // Auto-group repos by prefix
        const grouped = repos.reduce((acc, repo) => {
          const base = repo.name.split("-")[0];
          if (!acc[base]) acc[base] = [];
          acc[base].push(repo);
          return acc;
        }, {});

        // Apply manual overrides (attach live links)
        Object.entries(overrides).forEach(([group, config]) => {
          const matched = repos.filter((r) => config.repos.includes(r.name));
          if (matched.length > 0) {
            grouped[group] = matched;
            grouped[group].live = config.live;
          }
        });

        const groupedProjects = await Promise.all(
          Object.entries(grouped).map(async ([name, repos]) => {
            const mainRepo = repos[0];
            let liveUrl = extractLiveURL(mainRepo.description);

            // Check for GitHub topics that might hint at live demos
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
            } catch (err) {
              console.warn("Topic fetch failed:", err);
            }

            // Prepare repo details
            const repoDetails = repos.map((r) => ({
              name: r.name,
              description:
                r.description ||
                "No description provided yet — this repo may still be in progress.",
              html_url: r.html_url,
            }));

            // Merge live links: override live URLs or fallback from GitHub
            const liveLinks = Array.isArray(grouped[name]?.live)
              ? grouped[name].live
              : grouped[name]?.live
              ? [{ label: "Live Demo", url: grouped[name].live, live: true }]
              : liveUrl
              ? [{ label: "Live Demo", url: liveUrl, live: true }]
              : [];

            return {
              name: name.charAt(0).toUpperCase() + name.slice(1),
              description:
                mainRepo.description ||
                (repos.length > 1
                  ? "A multi-part project built across several repositories."
                  : "A project from my GitHub portfolio."),
              repos: repoDetails,
              links: [
                ...repos.map((r) => ({
                  label:
                    repos.length > 1
                      ? r.name.replace(`${name}-`, "").replaceAll("-", " ")
                      : "GitHub",
                  url: r.html_url,
                })),
                ...liveLinks,
              ],
              updated_at: mainRepo.updated_at,
            };
          })
        );

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
      <p className="lead">
        Auto-synced from GitHub — includes repo descriptions and live demos.
      </p>

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project.name} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            {/* Show repo descriptions for grouped projects */}
            {project.repos.length > 1 && (
              <ul style={{ margin: "0.75rem 0 1rem", paddingLeft: "1rem" }}>
                {project.repos.map((r) => (
                  <li key={r.name} style={{ marginBottom: "0.4rem" }}>
                    <strong>
                      {r.name.replace(`${project.name.toLowerCase()}-`, "")}:
                    </strong>{" "}
                    {r.description}
                  </li>
                ))}
              </ul>
            )}

            {/* Buttons */}
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
