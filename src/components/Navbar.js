import { NavLink, Link } from 'react-router-dom';

export default function Navbar(){
  const navLinkClass = ({ isActive }) => ` ${isActive ? 'active' : ''}`;
  return (
    <header className="navbar">
      <div className="inner container">
        <Link to="/" className="brand">
          <span className="name">Kirk Wilkinson</span>
          <span className="role"> · Full-Stack JavaScript Developer</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/projects" className={navLinkClass}>Projects</NavLink>
          <NavLink to="/skills" className={navLinkClass}>Skills</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
