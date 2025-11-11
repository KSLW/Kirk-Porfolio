import { useEffect, useState } from "react";
export default function CurrentProject(){
  const [repo, setRepo] = useState(null);
  const GITHUB_USERNAME = "KSLW";
  const CACHE_KEY = "latest_repo";
  const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12h

  useEffect(()=>{
    async function fetchLatest(){
      try{
        const cached = localStorage.getItem(CACHE_KEY);
        if(cached){
          const parsed = JSON.parse(cached);
          if(Date.now() - parsed.timestamp < CACHE_DURATION){
            setRepo(parsed.data);
            return;
          }
        }
        const resp = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
        const data = await resp.json();
        const pushEvent = Array.isArray(data) ? data.find(ev => ev.type === "PushEvent") : null;
        const newRepo = pushEvent ? {
          name: pushEvent.repo.name.split("/")[1],
          url: `https://github.com/${pushEvent.repo.name}`,
          description: "Latest repository with an active code push.",
          updated_at: pushEvent.created_at
        } : {
          name: "Obsidian",
          url: "https://github.com/KSLW/obsidian",
          description: "A full-stack automation tool for streamers and communities.",
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify({data:newRepo, timestamp:Date.now()}));
        setRepo(newRepo);
      }catch(e){
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
  },[]);

  if(!repo) return null;
  const lastUpdated = new Date(repo.updated_at);
  const daysAgo = Math.floor((Date.now() - lastUpdated.getTime()) / (1000*60*60*24));
  return (
    <div className="current-project">
      <p>🛠️ <strong>Currently working on:</strong>{" "}
        <a href={repo.url} target="_blank" rel="noreferrer" className="highlight">{repo.name}</a>{" "}
        — {repo.description}
        <span className="updated-badge"> • Updated {daysAgo===0?"today":`${daysAgo} day${daysAgo>1?"s":""} ago`}</span>
      </p>
    </div>
  );
}
