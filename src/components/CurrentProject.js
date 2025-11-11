import React, { useState, useEffect } from "react";

const GITHUB_USERNAME = "KSLW";
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes cache

const CurrentProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("latest_projects");
    const cacheTime = localStorage.getItem("latest_projects_time");

    if (cached && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
      setProjects(JSON.parse(cached));
      setLoading(false);
      return;
    }

    async function fetchProjects() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`
        );
        const data = await res.json();

        // Detect grouped projects like obsidian-core-backend + dashboard
        const grouped = data.reduce((acc, repo) => {
          const baseName = repo.name.split("-")[0];
          if (!acc[baseName]) acc[baseName] = [];
          acc[baseName].push(repo);
          return acc;
        }, {});

        const topProjects = Object.entries(grouped)
          .map(([key, repos]) => ({
            name: key,
            repos,
          }))
          .slice(0, 3); // limit display

        setProjects(topProjects);
        localStorage.setItem("latest_projects", JSON.stringify(topProjects));
        localStorage.setItem("latest_projects_time", Date.now());
      } catch (err) {
        console.error("GitHub fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div className="current-project">Loading projects...</div>;
  if (!projects.length)
    return (
      <div className="current-project">No recent projects found 😅</div>
    );

  return (
    <div className="current-project">
      <p>
        <strong>Currently Working On:</strong>
      </p>
      {projects.map((proj) => (
        <div key={proj.name} style={{ marginTop: "4px" }}>
          <span className="highlight">{proj.name}</span>{" "}
          {proj.repos.map((r, i) => (
            <a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--mint)",
                marginLeft: "8px",
                fontWeight: 500,
              }}
            >
              [{r.name.replace(`${proj.name}-`, "")}]
            </a>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CurrentProject;
