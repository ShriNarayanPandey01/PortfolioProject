import { useState } from "react";

const SKILL_ICON_MAP = {
  "fastapi": "/FastAPI.png",
  "python": "/Python.png",
  "java": "/java.png",
  "redis": "/Redish.png",
  "postgresql": "/Postgresql_elephant.svg.webp",
  "postgres": "/Postgresql_elephant.svg.webp",
  "langchain": "/Langchain.png",
  "langgraph": "/langgraph-logo.svg",
  "google adk": "/googleADK.png",
  "googleadk": "/googleADK.png",
  "kafka": "/Kafka.png",
  "docker": "/docker-icon-logo.png",
  "gcp": "/gcp.jpg",
  "google cloud": "/gcp.jpg",
  "git": "/git.png",
  "linux": "/linux.png",
  "springboot": "/springboot.png",
  "spring boot": "/springboot.png",
  "spring": "/springboot.png",
  "rust": "/rust.png"
};

export default function SkillIcon({ name }) {
  const [imgError, setImgError] = useState(false);
  const normalized = (name || "").toLowerCase().trim();
  const iconUrl = SKILL_ICON_MAP[normalized];

  if (iconUrl && !imgError) {
    return (
      <img
        src={iconUrl}
        alt={`${name} icon`}
        className="skill-icon-img"
        onError={() => setImgError(true)}
      />
    );
  }

  if (normalized.includes("microservice")) {
    return (
      <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="8" height="8" rx="2" />
        <rect x="14" y="2" width="8" height="8" rx="2" />
        <rect x="2" y="14" width="8" height="8" rx="2" />
        <rect x="14" y="14" width="8" height="8" rx="2" />
      </svg>
    );
  }

  if (normalized.includes("api") || normalized.includes("rest")) {
    return (
      <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
    );
  }

  if (normalized.includes("system") || normalized.includes("design") || normalized.includes("architecture")) {
    return (
      <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    );
  }

  return (
    <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}
