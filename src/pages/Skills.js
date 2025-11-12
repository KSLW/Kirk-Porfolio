import { useEffect, useRef, useState } from "react";

function SkillItem({ name, level, visible }) {
  const fillRef = useRef(null);
  useEffect(() => {
    if (!fillRef.current || !visible) return;
    requestAnimationFrame(() => {
      fillRef.current.style.width = level + "%";
    });
  }, [level, visible]);

  return (
    <div className="skill">
      <span className="chip">{name}</span>
      <div
        className="bar"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${name} skill proficiency`}
      >
        <div ref={fillRef} className="fill" style={{ width: "0%" }}></div>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section" id="skills">
      <div className="container">
        <h2>Skills & Tools</h2>
        <p className="lead">
          Focused on MERN, comfortable with PERN, and driven by good UX.
        </p>

        <div className="skills-list">
          <SkillItem name="React" level={85} visible={visible} />
          <SkillItem name="Node.js" level={80} visible={visible} />
          <SkillItem name="Express" level={78} visible={visible} />
          <SkillItem name="MongoDB" level={75} visible={visible} />
          <SkillItem name="PostgreSQL" level={70} visible={visible} />
          <SkillItem name="JavaScript (ES6+)" level={88} visible={visible} />
          <SkillItem name="HTML & CSS" level={90} visible={visible} />
          <SkillItem name="Git" level={82} visible={visible} />
        </div>
      </div>
    </section>
  );
}
