import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Header({ data, initials }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <a className="brand-mark" href="#top" onClick={closeMenu} aria-label={`${data.name} home`}>
          <span>{initials}</span>
        </a>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <nav className="desktop-site-nav">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#profiles">Coding Profiles</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-chip desktop-header-chip" href={data.resumeHref} target="_blank" rel="noreferrer">
          {data.resumeLabel}
        </a>
      </header>

      {/* Mobile Drawer Portal */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="mobile-menu-portal">
          <div className="mobile-nav-backdrop" onClick={closeMenu} aria-hidden="true" />
          
          <aside className="mobile-nav-drawer" role="dialog" aria-modal="true">
            <div className="mobile-drawer-header">
              <a className="brand-mark" href="#top" onClick={closeMenu} aria-label={`${data.name} home`}>
                <span>{initials}</span>
              </a>
              <button className="mobile-drawer-close" onClick={closeMenu} aria-label="Close menu">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <a href="#about" onClick={closeMenu}>About</a>
              <a href="#skills" onClick={closeMenu}>Skills</a>
              <a href="#experience" onClick={closeMenu}>Experience</a>
              <a href="#projects" onClick={closeMenu}>Projects</a>
              <a href="#profiles" onClick={closeMenu}>Coding Profiles</a>
              <a href="#contact" onClick={closeMenu}>Contact</a>
            </nav>

            <div className="mobile-drawer-footer">
              <a className="header-chip mobile-header-chip" href={data.resumeHref} onClick={closeMenu} target="_blank" rel="noreferrer">
                {data.resumeLabel}
              </a>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}

