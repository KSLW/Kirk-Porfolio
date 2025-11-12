import { useEffect, useRef, useState } from "react";
import Me from "../assets/Me.jpg";

export default function About() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      tabIndex="0"
      aria-labelledby="about-heading"
      className={`section about-section ${isVisible ? "visible" : ""}`}
    >
      <div className="about-container">
        <div className="about-image-wrapper">
          <img
            src={Me}
            className="about-photo"
            alt="Portrait of Kirk Wilkinson, Full-Stack Developer"
            loading="lazy"
          />
        </div>

        <div className="about-content">
          <h2 id="about-heading">About Me</h2>
          <p>
            I’m a <strong>full-stack developer</strong> passionate about creating
            modern, dynamic, and engaging digital experiences that blend design
            with performance.
          </p>
          <p>
            I focus on crafting seamless interactions between front-end visuals
            and backend logic — building projects that are both elegant and
            powerful. Currently developing <strong>Obsidian</strong>, a
            next-generation integration of UI motion and automation.
          </p>
        </div>
      </div>
    </section>
  );
}
