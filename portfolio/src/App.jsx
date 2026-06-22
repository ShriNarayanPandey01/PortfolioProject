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
          <div className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow">Software Engineer - Microservices - Applied AI</p>
              <h1>
                Hola, I&apos;m <span>{data.shortName}</span>,<br />
                Software Engineer
              </h1>
              <p className="hero-role">{data.title}</p>
              <p className="hero-text">{data.intro}</p>

              <div className="hero-actions">
                <a className="button button-primary" href="#projects">
                  Portfolio
                </a>
                <a className="button button-secondary" href="#contact">
                  Hire me
                </a>
              </div>

              <div className="rating-strip">
                {codingHighlights.map((item) => (
                  <a key={item.label} className="rating-card" href="#profiles">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>

              {isLoading ? <p className="api-note">Loading live portfolio data...</p> : null}
            </div>

            <div className="hero-visual">
              <div className="hero-score hero-score-left">
                <span>{data.socialLinks[0]?.label}</span>
                <p>{data.socialLinks[0]?.href.replace("https://", "")}</p>
              </div>

              <div className="portrait-stage">
                <div className="portrait-ring" />
                <div className="portrait-card">
                  <div className="portrait-badge">{initials}</div>
                  <div className="portrait-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>

              <div className="hero-score hero-score-right">
                <div className="star-row">★★★★★</div>
                <strong>{data.heroStats[1]?.value}</strong>
                <p>{data.heroStats[1]?.label}</p>
              </div>
            </div>
          </div>

          <section className="hire-section">
            <div className="hire-visual">
              <div className="hire-portrait">
                <div className="hire-orb" />
                <div className="hire-card">{initials}</div>
              </div>
            </div>

            <div className="hire-copy">
              <SectionTitle
                eyebrow="Why Hire Me?"
                title="Engineering systems that stay understandable as they grow."
                text={data.about}
              />

              <p className="hire-text">{data.contactText}</p>

              <div className="metric-row">
                {data.heroStats.map((stat) => (
                  <article key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>
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
