import { useEffect, useState } from "react";

export default function CurrentProject() {
  const [repo, setRepo] = useState(null);
  const GITHUB_USERNAME = "KSLW";
  const CACHE_KEY = "latest_repo";
  const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12h

  useEffect(() => {
    async function fetchLatest() {
      try {
        // Check local cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setRepo(parsed.data);
            return;
          }
        }

        // Fetch latest public events
        const resp = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
        if (!resp.ok) throw new Error(`GitHub API error: ${resp.status}`);
        const data = await resp.json();

        // Find the most recent push event
        const pushEvent = Array.isArray(data)
          ? data.find(ev => ev.type === "PushEvent" && ev.repo)
          : null;

        const repoName = pushEvent?.repo?.name
          ? pushEvent.repo.name.split("/")[1]
          : "Obsidian";

        const newRepo = {
          name: repoName,
          url: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
          description: "Latest repository with an active code push.",
          updated_at: pushEvent?.created_at || new Date().toISOString()
        };

        // Optionally fetch live description
        try {
          const metaResp = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`);
          if (metaResp.ok) {
            const meta = await metaResp.json();
            if (meta.description) newRepo.description = meta.description;
          }
        } catch {
          // Ignore metadata failures
        }

        // Save cache and update state
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: newRepo, timestamp: Date.now() })
        );
        setRepo(newRepo);

      } catch (e) {
        console.error("GitHub fetch failed", e);
        setRepo({
          name: "Obsidian",
          url: "https://github.com/KSLW/obsidian",
          description: "A full-stack automation tool for streamers and communities.",
          updated_at: new Date().toISOString()
        });
      }
    }

    fetchLatest();
  }, []);

  if (!repo) return null;

  const lastUpdated = new Date(repo.updated_at);
  const daysAgo = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="current-project">
      <p>
        🛠️ <strong>Currently working on:</strong>{" "}
        <a href={repo.url} target="_blank" rel="noreferrer" className="highlight">
          {repo.name}
        </a>{" "}
        — {repo.description}
        <span className="updated-badge">
          • Updated{" "}
          <time dateTime={repo.updated_at}>
            {daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}
          </time>
        </span>
      </p>
    </div>
  );
}
