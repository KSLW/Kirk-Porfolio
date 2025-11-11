import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "KSLW";

// ✅ Grouping + guaranteed live demo overrides
const overrides = {
  obsidian: {
    repos: ["obsidian-core-backend", "dashboard"],
    live: [
      { label: "🖥️ Dashboard Demo", url: "https://dashboard-3let.onrender.com" },
      { label: "⚙️ API Demo", url: "https://obsidian-core-backend.onrender.com" },
    ],
  },
  portfolio: {
    repos: ["kirk-portfolio", "kirk-portfolio-v2"],
    live: [{ label: "🌐 Live Demo", url: "https://kirk-portfolio.vercel.app" }],
  },
};

// Helper: detect URLs safely
function extractLiveURL(description) {
  if (!description || typeof description !== "string") return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = description.match(urlRegex);
  return matches ? matches[0] : null;
}

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAllRepos() {
  let allRepos = [];
  let page = 1;
  let done = false;

  const headers = {
    Authorization: process.env.REACT_APP_GITHUB_TOKEN
      ? `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      : undefined,
    Accept: "application/vnd.github+json",
  };

  while (!done) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }
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

        // Auto-group by prefix
        const grouped = repos.reduce((acc, repo) => {
          const base = repo.name.split("-")[0];
          if (!acc[base]) acc[base] = [];
          acc[base].push(repo);
          return acc;
        }, {});

        // Apply overrides (attach live links)
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

// 🧠 Fallback: check README for live demo URL if not found in description
if (!liveUrl) {
  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${mainRepo.name}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          Authorization: process.env.REACT_APP_GITHUB_TOKEN
            ? `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
            : undefined,
        },
      }
    );

    if (readmeRes.ok) {
      const readmeText = await readmeRes.text();
      const foundInReadme = extractLiveURL(readmeText);
      if (foundInReadme) liveUrl = foundInReadme;
    }
  } catch (err) {
    console.warn(`Failed to fetch README for ${mainRepo.name}:`, err);
  }
}


            // Topic check
            try {
              const topicsRes = await fetch(mainRepo.url + "/topics", {
  headers: {
    Accept: "application/vnd.github.mercy-preview+json",
    Authorization: process.env.REACT_APP_GITHUB_TOKEN
      ? `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      : undefined,
  },
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
            } catch {
              /* ignore */
            }

            const repoDetails = repos.map((r) => ({
              name: r.name,
              description:
                r.description ||
                "No description provided yet — this repo may still be in progress.",
              html_url: r.html_url,
            }));

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
                      ? `💻 ${r.name
                          .replace(`${name}-`, "")
                          .replaceAll("-", " ")}`
                      : "GitHub",
                  url: r.html_url,
                })),
                ...liveLinks.map((l) => ({ ...l, live: true })),
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
        Auto-synced from GitHub — includes live demos and repo details.
      </p>

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project.name} className="card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            {/* Repo details list */}
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

            {/* Buttons section */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${link.live ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "130px",
                    gap: "0.3rem",
                    fontSize: "0.85rem",
                    padding: "0.45rem 0.9rem",
                    background: link.live
                      ? "linear-gradient(90deg, var(--mint), var(--purple))"
                      : "var(--bg-elev)",
                    color: link.live ? "#111" : "var(--text)",
                    border: link.live ? "none" : "1px solid var(--border)",
                    fontWeight: link.live ? 600 : 500,
                    borderRadius: "8px",
                    boxShadow: link.live
                      ? "0 0 10px rgba(102,240,198,0.3)"
                      : "none",
                    transition:
                      "transform 0.2s ease, box-shadow 0.25s ease, opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(167,139,250,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = link.live
                      ? "0 0 10px rgba(102,240,198,0.3)"
                      : "none";
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
