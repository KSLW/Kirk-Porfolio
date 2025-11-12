import { useEffect, useState } from "react";

export default function RecentWork() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const GITHUB_USERNAME = "KSLW";
  const CACHE_KEY = "recent_repos";
  const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12h

  useEffect(() => {
    async function fetchRepos() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setRepos(parsed.data);
            setLoading(false);
            return;
          }
        }

        const resp = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`
        );
        if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);

        const data = await resp.json();
        if (Array.isArray(data)) {
          setRepos(data);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() })
          );
        }
      } catch (err) {
        console.error("GitHub fetch failed:", err);
        setError("Unable to load recent repositories.");
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, []);

  return (
    <section className="section" aria-labelledby="recent-work-title">
      <div className="container">
        <h2 id="recent-work-title">Recent Work</h2>

        {loading && <p>Loading recent work...</p>}
        {error && <p className="contact-error">{error}</p>}

        {!loading && !error && (
          <div className="card-grid">
            {repos.map((repo) => (
              <article className="card" key={repo.id}>
                <h3>{repo.name}</h3>
                <p className="lead">
                  {repo.description || "No description provided."}
                </p>
                <p className="muted">
                  ⭐ {repo.stargazers_count || 0} • {repo.language || "Unknown language"}
                </p>
                <a
                  className="project-link"
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Repository ↗
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
