import ProjectCard from "../components/ProjectCard";

export default function Projects(){
  return (
    <section className="section">
      <div className="container">
        <h2>Projects</h2>
        <p className="lead">A growing collection of practical apps and creative experiments.</p>
        <div className="card-grid">
          <ProjectCard
            title="Case Studies Coming Soon"
            description="In-progress MERN projects focused on clean architecture, accessibility, and meaningful UX."
            stack={['React','Node','Express','MongoDB']}
          />
          <ProjectCard
            title="Obsidian"
            description="A full-stack automation tool for streamers and communities with Twitch and Discord integration."
            stack={['React','Node','Express','MongoDB']}
            link="https://github.com/KSLW/obsidian"
          />
        </div>
      </div>
    </section>
  );
}
