import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";

function getProjectPriority(project) {
  const hasCode = Boolean(project.codeUrl && project.codeUrl.trim() && project.codeUrl !== "#");
  const hasDemo = Boolean(project.demoUrl && project.demoUrl.trim() && project.demoUrl !== "#");

  if (hasCode && hasDemo) return 1; // Both code and demo available -> Top priority
  if (hasCode || hasDemo) return 2; // Demo or Code missing -> Middle priority ("Demo: Work in progress")
  return 3;                         // Neither available -> Bottom priority ("No preview available")
}

export default function ProjectsSection({ projects = [], showAllProjects, setShowAllProjects }) {
  // Sort projects so that WIP / no-preview projects go to the bottom
  const sortedProjects = [...projects].sort((a, b) => getProjectPriority(a) - getProjectPriority(b));
  const visibleProjects = showAllProjects ? sortedProjects : sortedProjects.slice(0, 6);

  return (
    <section id="projects" className="scroll-section projects-section" data-scroll-section>
      <SectionTitle
        eyebrow=""
        title="My Projects"
        align="center"
      />
      <div className="projects-card-grid">
        {visibleProjects.map((project) => {
          const isShellCard = project.isShell || project.name?.toLowerCase().includes("shell") || project.demoUrl === "/shell";
          const hasCode = Boolean(project.codeUrl && project.codeUrl.trim() && project.codeUrl !== "#");
          const hasDemo = Boolean(project.demoUrl && project.demoUrl.trim() && project.demoUrl !== "#");

          return (
            <article key={project.name} className={`project-card ${isShellCard ? "shell-project-card" : ""}`}>
              <div className={`project-card-image ${isShellCard ? "shell-card-image" : ""}`}>
                {isShellCard ? (
                  <div className="shell-card-visual">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 17 10 11 4 5" />
                      <line x1="12" y1="19" x2="20" y2="19" />
                    </svg>
                    <span className="shell-card-prompt">$ _</span>
                  </div>
                ) : (
                  <img src={project.image || "/projects/ai_research_assistant.png"} alt={project.name} />
                )}
              </div>

              <div className="project-card-body">
                <h3>{isShellCard && !project.name.includes("🐚") ? `🐚 ${project.name}` : project.name}</h3>
                <p>{project.description}</p>
                
                <div className="project-card-tags">
                  {project.stack?.map((tag) => (
                    <span key={tag} className="project-card-tag">{tag}</span>
                  ))}
                </div>

                <div className="project-card-actions">
                  {hasCode && hasDemo && (
                    <>
                      <a href={project.codeUrl} target="_blank" rel="noreferrer" className="project-card-link">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                        Code
                      </a>
                      {project.demoUrl.startsWith("/") ? (
                        <Link to={project.demoUrl} className="project-card-link shell-try-link">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 17 10 11 4 5" />
                            <line x1="12" y1="19" x2="20" y2="19" />
                          </svg>
                          Try It Live
                        </Link>
                      ) : (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-card-link">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </>
                  )}

                  {hasCode && !hasDemo && (
                    <>
                      <a href={project.codeUrl} target="_blank" rel="noreferrer" className="project-card-link">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                        Code
                      </a>
                      <span className="project-card-wip-badge">
                        Demo: Work in progress
                      </span>
                    </>
                  )}

                  {!hasCode && hasDemo && (
                    <>
                      <span className="project-card-wip-badge">
                        Code: Work in progress
                      </span>
                      {project.demoUrl.startsWith("/") ? (
                        <Link to={project.demoUrl} className="project-card-link shell-try-link">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 17 10 11 4 5" />
                            <line x1="12" y1="19" x2="20" y2="19" />
                          </svg>
                          Try It Live
                        </Link>
                      ) : (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer" className="project-card-link">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </>
                  )}

                  {!hasCode && !hasDemo && (
                    <span className="project-card-no-preview-badge">
                      No preview available
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {sortedProjects.length > 6 && (
        <div className="projects-show-more-container">
          <button
            className="button button-secondary projects-toggle-btn"
            onClick={() => setShowAllProjects(!showAllProjects)}
          >
            {showAllProjects ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </section>
  );
}
