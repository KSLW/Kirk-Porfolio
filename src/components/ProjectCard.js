import { useState } from "react";
export default function ProjectCard({ title, description, stack=[], link }){
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`project-card ${expanded ? "expanded":""}`} onClick={()=>setExpanded(!expanded)}>
      <div className="project-card-inner">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="stack">
          {stack.map(tech => <span key={tech} className="chip">{tech}</span>)}
        </div>
        {expanded && link && <a className="project-link" href={link} target="_blank" rel="noreferrer">View on GitHub ↗</a>}
      </div>
    </div>
  );
}
