export default function Header({ data, initials }) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label={`${data.name} home`}>
        <span>{initials}</span>
      </a>

      <nav>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#profiles">Coding Profiles</a>
        <a href="#contact">Contact</a>
      </nav>

      <a className="header-chip" href={data.resumeHref}>
        {data.resumeLabel}
      </a>
    </header>
  );
}
