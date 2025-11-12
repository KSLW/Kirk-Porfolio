import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Prevent background scroll when menu is open (mobile UX polish)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="inner">
        {/* Brand / Title */}
        <div className="brand">
          <span className="name">Kirk Wilkinson</span>
          <span className="role">Full-Stack JavaScript Developer</span>
        </div>

        {/* Hamburger (mobile only via CSS) */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/projects" onClick={closeMenu}>Projects</NavLink>
          <NavLink to="/skills" onClick={closeMenu}>Skills</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
        </div>
      </div>
    </nav>
  );
}
