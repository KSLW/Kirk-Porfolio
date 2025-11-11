import { useEffect, useRef } from "react";

function SkillItem({ name, level }){
  const fillRef = useRef(null);
  useEffect(()=>{
    const el = fillRef.current;
    if(!el) return;
    requestAnimationFrame(()=>{ el.style.width = level + '%'; });
  },[level]);
  return (
    <div className="skill">
      <span className="chip">{name}</span>
      <div className="bar"><div ref={fillRef} className="fill" style={{ width: '0%' }}></div></div>
    </div>
  );
}

export default function Skills(){
  return (
    <section className="section">
      <div className="container">
        <h2>Skills & Tools</h2>
        <p className="lead">Focused on MERN, comfortable with PERN, and driven by good UX.</p>

        <div className="skills-list">
          <SkillItem name="React" level={85} />
          <SkillItem name="Node.js" level={80} />
          <SkillItem name="Express" level={78} />
          <SkillItem name="MongoDB" level={75} />
          <SkillItem name="PostgreSQL" level={70} />
          <SkillItem name="JavaScript (ES6+)" level={88} />
          <SkillItem name="HTML & CSS" level={90} />
          <SkillItem name="Git" level={82} />
        </div>
      </div>
    </section>
  );
}
