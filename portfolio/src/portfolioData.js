export const fallbackPortfolioData = {
  name: "John Doe (Fallback)",
  shortName: "John",
  title:
    "Demo Software Engineer — Backend is currently offline.",
  email: "johndoe@example.com",
  phone: "+1 (555) 019-9000",
  location: "Silicon Valley, CA",
  resumeLabel: "Demo Resume",
  resumeHref: "#",
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://linkedin.com",
    },
    {
      label: "GitHub",
      href: "https://github.com",
    },
    {
      label: "Email",
      href: "mailto:johndoe@example.com",
    },
  ],
  heroStats: [
    { value: "1000+", label: "Demo Rating" },
    { value: "Top 99%", label: "Demo Competitions" },
    { value: "0", label: "Microservices Platform" },
  ],
  intro:
    "This is placeholder dummy data displayed because the Spring Boot backend is offline. Start the backend on port 4000 to dynamically populate this portfolio with the real data.",
  about:
    "This is a fallback placeholder. When the backend service is running and accessible on port 4000, this card will be dynamically replaced with the real portfolio owner's profile details.",
  skills: [
    "Dummy Skill 1",
    "Dummy Skill 2",
    "Dummy Skill 3",
    "Dummy Skill 4",
    "Dummy Skill 5",
  ],
  codingProfiles: [
    {
      name: "LeetCode",
      username: "johndoe_leetcode",
      href: "https://leetcode.com/",
      metric: "1200+ rating",
      blurb: "Placeholder problem solving profile.",
    },
    {
      name: "GitHub",
      username: "johndoe_github",
      href: "https://github.com/",
      metric: "Demo repositories",
      blurb: "Placeholder open-source profile.",
    },
  ],
  experience: [
    {
      role: "Demo Software Engineer",
      company: "Offline Company Ltd",
      period: "Jan 2026 - Present",
      location: "Remote, Earth",
      highlights: [
        "This is dummy experience item 1 to demonstrate timeline layout when backend is not responding.",
        "This is dummy experience item 2 to demonstrate timeline layout when backend is not responding.",
      ],
    },
    {
      role: "Demo Developer Intern",
      company: "Acme Corp",
      period: "Jun 2025 - Dec 2025",
      location: "Remote, Earth",
      highlights: [
        "Constructed dummy REST APIs using placeholder parameters.",
        "Participated in mock code reviews and virtual team standups.",
      ],
    },
  ],
  projects: [
    {
      name: "Demo Project Alpha",
      category: "Frontend / React",
      description:
        "A placeholder React client demonstrating the responsiveness and grid styles of the project grid.",
      stack: ["React", "CSS Grid", "Vite"],
    },
    {
      name: "Demo Project Beta",
      category: "Backend / Node",
      description:
        "A mock database wrapper designed to showcase clean cards layout when dynamic content is offline.",
      stack: ["Node.js", "Express"],
    },
  ],
  backendProjects: [
    {
      name: "Demo API Gateway",
      purpose: "Proxy routing validation",
      summary:
        "This is a fallback mockup showing how backend system specifications look on the expanded projects panel.",
      highlights: [
        "Placeholder dynamic route forwarding",
        "Mock security certificate validation",
      ],
      stack: ["Spring Boot", "Zuul", "Eureka"],
      status: "Offline Mode",
    },
  ],
  achievements: [
    "Ranked in top 1% of simulated programmers worldwide.",
    "Completed virtual full-stack deployment certification.",
  ],
  contactText:
    "This is placeholder contact text. Start the backend to enable contact submissions and dynamically fetch actual details.",
};
