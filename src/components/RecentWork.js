import { useEffect, useState } from "react";
export default function RecentWork(){
  const [repos, setRepos] = useState([]);
  const GITHUB_USERNAME = "KSLW";
  useEffect(()=>{
    async function run(){
      try{
        const resp = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`);
        const data = await resp.json();
        if(Array.isArray(data)) setRepos(data);
      }catch(e){ console.error(e) }
    }
    run();
  },[]);
  return (
    <section className="section">
      <div className="container">
        <h2>Recent Work</h2>
        <div className="card-grid">
          {repos.map(repo => (
            <article className="card" key={repo.id}>
              <h3>{repo.name}</h3>
              <p className="lead">{repo.description || "No description provided."}</p>
              <a className="project-link" href={repo.html_url} target="_blank" rel="noreferrer">View Repository</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
