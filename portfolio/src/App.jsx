import { useEffect, useState } from "react";
import { fallbackPortfolioData } from "./portfolioData";

function SectionTitle({ eyebrow, title, text, align = "left", action, fullWidth = false }) {
  return (
    <div className={`section-heading section-heading-${align}${fullWidth ? " section-heading-full" : ""}`}>
      <span>{eyebrow}</span>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {action ? action : null}
      </div>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

const initialContactForm = {
  name: "",
  email: "",
  message: "",
};

function App() {
  const [data, setData] = useState(fallbackPortfolioData);
  const [isLoading, setIsLoading] = useState(true);
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [contactState, setContactState] = useState({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error("Could not load portfolio data");
        }

        const payload = await response.json();
        if (isMounted) {
          setData(payload);
        }
      } catch (_error) {
        if (isMounted) {
          setData(fallbackPortfolioData);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-scroll-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setContactState({
      status: "submitting",
      message: "Sending your message...",
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Could not send message");
      }

      setContactForm(initialContactForm);
      setContactState({
        status: "success",
        message: "Message stored successfully in the backend.",
      });
    } catch (error) {
      setContactState({
        status: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }

  const initials = data.shortName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const primarySkills = data.skills.slice(0, 8);
  const codingHighlights = [
    {
      label: "LeetCode",
      value: data.codingProfiles.find((profile) => profile.name === "LeetCode")?.metric ?? "1700+ rating",
    },
    {
      label: "CodeChef",
      value: data.codingProfiles.find((profile) => profile.name === "CodeChef")?.metric ?? "1600+ rating",
    },
    {
      label: "Codeforces",
      value: data.codingProfiles.find((profile) => profile.name === "Codeforces")?.metric ?? "1600+ rating",
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-orb page-orb-left" />
      <div className="page-orb page-orb-right" />

      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label={`${data.name} home`}>
          <span>{initials}</span>
        </a>

        <nav>
          <a href="#about">About</a>
          <a href="#experience">Resume</a>
          <a href="#projects">Project</a>
          <a href="#profiles">Coding Profiles</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-chip" href={data.resumeHref}>
          {data.resumeLabel}
        </a>
      </header>

      <main id="top">
        <section id="about" className="scroll-section intro-group" data-scroll-section>
          <div className="hero-grid-bg" />
          <div className="hero-layout">
            {/* Top row: copy LEFT, visual RIGHT */}
            <div className="hero-top-row">
              <div className="hero-copy">
                <p className="eyebrow">Software Engineer · Microservices · Applied AI</p>
                <h1>
                  Hola, I&apos;m <span>{data.shortName}</span>,<br />
                  Software Engineer
                </h1>
                <p className="hero-role">{data.title}</p>

                <div className="hero-text-container">
                  <p className="hero-text">{data.intro}</p>
                  <p className="hero-text">{data.about}</p>
                </div>

                <div className="hero-availability">
                  <span className="availability-dot" />
                  Available for opportunities
                </div>

                <div className="hero-actions">
                  <a className="button button-primary" href="#projects">
                    Portfolio
                  </a>
                  <a className="button button-secondary" href="#contact">
                    Hire me
                  </a>
                </div>

                <div className="hero-socials">
                  {data.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      className="hero-social-link"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      title={link.label}
                    >
                      {link.label === "LinkedIn" && (
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {link.label === "GitHub" && (
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      )}
                      {link.label === "Email" && (
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>

                {isLoading && <p className="api-note">Loading live portfolio data...</p>}
              </div>

              {/* Visual — right column */}
              <div className="hero-visual">
                <div className="portrait-stage">
                  <div className="tech-ring outer-ring" />
                  <div className="tech-ring inner-ring" />
                  <div className="tech-crosshair" />
                  <div className="portrait-ring" />
                  <div className="portrait-card">
                    <div className="portrait-badge">{initials}</div>
                  </div>
                  <div className="portrait-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                {/* Floating score chips */}
                <div className="hero-score hero-score-left">
                  <div className="star-row">★★★★★</div>
                  <strong>{data.heroStats?.[0]?.value}</strong>
                  <p>{data.heroStats?.[0]?.label}</p>
                </div>

                <div className="hero-score hero-score-right">
                  <strong>{data.heroStats?.[1]?.value}</strong>
                  <span>{data.heroStats?.[1]?.label}</span>
                </div>
              </div>
            </div>


            {/* Bottom row: tagline + carousel */}
            <div className="hero-bottom-row">
              <p className="hero-contact-text">{data.contactText}</p>

              <div className="hero-carousel-wrapper">
                <div className="hero-carousel-container">
                  {codingHighlights.map((item) => (
                    <a key={item.label} className={`hero-carousel-card rating-card card-${item.label.toLowerCase()}`} href="#profiles">
                      <span className="card-accent" />
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </a>
                  ))}
                  {data.heroStats?.slice(2).map((stat) => (
                    <article key={stat.label} className="hero-carousel-card metric-glass-card card-metric">
                      <span className="card-accent" />
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-section section-block experience-block" data-scroll-section>
          <SectionTitle
            eyebrow="My Work Experience"
            title="Career growth presented in a cleaner timeline."
            align="center"
          />

          <div className="experience-timeline">
            {data.experience.map((item) => (
              <article key={`${item.company}-${item.role}`} className="experience-row">
                <div className="experience-place">
                  <h3>{item.company}</h3>
                  <p>{item.period}</p>
                </div>
                <div className="experience-dot" aria-hidden="true" />
                <div className="experience-role">
                  <h3>{item.role}</h3>
                  <p>{item.location}</p>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-section section-block projects-block" data-scroll-section>
          <section className="services-section projects-carousel-section">
            <SectionTitle
              eyebrow="Projects"
              title="Selected work in a horizontal showcase."
              text="Your project section now uses the same dark card styling as the old services block."
              fullWidth
              action={
                <a className="header-chip header-chip-accent" href={data.socialLinks[1]?.href} target="_blank" rel="noreferrer">
                  View all projects
                </a>
              }
            />

            <div className="project-carousel">
              {data.projects.map((project) => (
                <article key={project.name} className="service-card project-carousel-card">
                  <div className="service-card-top">
                    <h3>{project.name}</h3>
                    <span className="service-arrow">↗</span>
                  </div>
                  <span className="project-carousel-category">{project.category}</span>
                  <p>{project.description}</p>
                  <div className="tag-row">
                    {project.stack.map((tag) => (
                      <em key={tag}>{tag}</em>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="profiles" className="profiles-section">
            <SectionTitle
              eyebrow="Coding Profiles"
              title="Competitive programming and public coding work in one place."
              fullWidth
              action={
                <a className="header-chip header-chip-accent" href={data.socialLinks[1]?.href} target="_blank" rel="noreferrer">
                  See all
                </a>
              }
            />

            <div className="profile-grid">
              {data.codingProfiles.map((profile) => (
                <article key={profile.name} className="profile-card">
                  <div className="profile-art" />
                  <div className="profile-body">
                    <div className="profile-meta">
                      <span>{profile.name}</span>
                      <strong>{profile.metric}</strong>
                    </div>
                    <h3>{profile.username}</h3>
                    <p>{profile.blurb}</p>
                    <a href={profile.href} target="_blank" rel="noreferrer">
                      Visit profile
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section id="contact" className="scroll-section section-block final-block" data-scroll-section>
          <section className="testimonial-section">
            <SectionTitle
              eyebrow="Highlights"
              title="Momentum outside day-to-day shipping."
              text="Achievements and backend capability snapshots, styled like the testimonial band in the reference."
              align="center"
            />

            <div className="testimonial-grid">
              {data.achievements.map((item, index) => (
                <article key={item} className="testimonial-card">
                  <div className="quote-mark">"</div>
                  <p>{item}</p>
                  <div className="testimonial-meta">
                    <strong>{data.shortName}</strong>
                    <span>{index === 0 ? "Featured result" : "Career highlight"}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="skill-marquee" aria-hidden="true">
            <div>
              {primarySkills.concat(primarySkills).map((skill, index) => (
                <span key={`${skill}-${index}`}>{skill}</span>
              ))}
            </div>
          </div>

          <section className="contact-cta">
            <SectionTitle
              eyebrow="Contact"
              title="Have an awesome project idea? Let&apos;s discuss."
              align="center"
            />

            <div className="contact-pills">
              <a href={`mailto:${data.email}`}>{data.email}</a>
              <a href={`tel:${data.phone.replace(/\s+/g, "")}`}>{data.phone}</a>
              <span>{data.location}</span>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your name"
                value={contactForm.name}
                onChange={(event) =>
                  setContactForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
              <input
                type="email"
                placeholder="Your email"
                value={contactForm.email}
                onChange={(event) =>
                  setContactForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              <textarea
                placeholder="Tell me about the project"
                rows="5"
                value={contactForm.message}
                onChange={(event) =>
                  setContactForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
              />
              <button
                className="button button-primary"
                type="submit"
                disabled={contactState.status === "submitting"}
              >
                Send
              </button>
              {contactState.message ? (
                <p className={`form-message form-message-${contactState.status}`}>
                  {contactState.message}
                </p>
              ) : null}
            </form>
          </section>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="brand-mark brand-mark-footer">
            <span>{initials}</span>
          </div>
          <p>
            {data.name}
            <br />
            {data.title}
          </p>
        </div>

        <div className="footer-column">
          <strong>Navigation</strong>
          <a href="#about">About</a>
          <a href="#experience">Resume</a>
          <a href="#projects">Project</a>
          <a href="#profiles">Coding Profiles</a>
        </div>

        <div className="footer-column">
          <strong>Contacts</strong>
          <a href={`mailto:${data.email}`}>{data.email}</a>
          <a href={`tel:${data.phone.replace(/\s+/g, "")}`}>{data.phone}</a>
          <span>{data.location}</span>
        </div>

        <div className="footer-column">
          <strong>Get the latest information</strong>
          <div className="footer-socials">
            {data.socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
