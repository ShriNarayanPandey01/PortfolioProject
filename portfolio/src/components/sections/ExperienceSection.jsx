import SectionTitle from "../common/SectionTitle";

export default function ExperienceSection({ experience = [] }) {
  return (
    <section id="experience" className="scroll-section experience-section" data-scroll-section>
      <SectionTitle
        eyebrow=""
        title="My Experience"
        align="center"
      />
      <div className="experience-list">
        {experience.map((item) => (
          <article key={`${item.company}-${item.role}`} className="experience-card-item">
            <div className="experience-card-header-row">
              <div className="experience-card-icon">
                <svg className="briefcase-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <h3>{item.role} at {item.company}</h3>
                <p className="experience-card-date">{item.period}</p>
              </div>
            </div>

            <div className="experience-card-body-content">
              <p>{item.description}</p>
              {item.highlights && (
                <ul className="experience-card-highlights">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>

            {item.stack && (
              <div className="experience-card-tags">
                {item.stack.map((tech) => (
                  <span key={tech} className="experience-card-tag">{tech}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
