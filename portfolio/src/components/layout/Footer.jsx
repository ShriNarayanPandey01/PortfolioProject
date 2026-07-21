export default function Footer({ data }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-title">{data.name}</div>
        <p className="footer-copy">
          &copy; 2026 {data.name}. All rights reserved.
        </p>
      </div>
      <div className="footer-social-links">
        {data.socialLinks?.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
