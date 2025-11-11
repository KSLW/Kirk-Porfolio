export default function Footer(){
  return (
    <footer>
      <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap'}}>
        <small>© {new Date().getFullYear()} Kirk Wilkinson. All rights reserved.</small>
        <div className="links">
          <a className="link-dev" href="https://github.com/KSLW" target="_blank" rel="noreferrer">GitHub</a>
          <a className="link-ux" href="https://www.linkedin.com/in/kirk-wilkinson-892304b9/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
