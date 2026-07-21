import SectionTitle from "../common/SectionTitle";

export default function CodingProfilesSection({ codingProfiles = [], codingStats = [] }) {
  return (
    <section id="profiles" className="scroll-section profiles-section" data-scroll-section>
      <SectionTitle
        eyebrow=""
        title="Coding Profiles"
        align="center"
      />
      <div className="coding-profiles-grid">
        {codingProfiles.map((profile) => {
          const nameLower = profile.name.toLowerCase();
          let icon = null;
          
          if (nameLower.includes("leetcode")) {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            );
          } else if (nameLower.includes("codeforces")) {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
                <path d="M12 2a6 6 0 0 0-6 6v3.58a6 6 0 0 0 6 6 6 6 0 0 0 6-6V8a6 6 0 0 0-6-6z"></path>
              </svg>
            );
          } else if (nameLower.includes("codechef")) {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18V20H18V18" />
                <path d="M6 18c-1.5 0-3-1-3-3 0-1.5 1-3 3-3V9c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5v3c2 0 3 1.5 3 3 0 2-1.5 3-3 3" />
                <path d="M10 18V12" />
                <path d="M14 18V12" />
              </svg>
            );
          } else {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            );
          }

          return (
            <a
              key={profile.name}
              href={profile.href}
              target="_blank"
              rel="noreferrer"
              className="coding-profile-card"
              id={`profile-card-${nameLower}`}
            >
              <div className="card-top-header">
                <div className="profile-icon-box">
                  {icon}
                </div>
                <div className="profile-header-info">
                  <span className="profile-name-text">{profile.name}</span>
                  <span className="profile-username-text">@{profile.username}</span>
                </div>
              </div>
              <p className="profile-tagline">{profile.subtitle || profile.blurb}</p>
              
              <div className="profile-stats-list">
                {profile.stats?.map((stat) => (
                  <div key={stat.label} className="profile-stat-row">
                    <span className="profile-stat-label">{stat.label}</span>
                    <span className="profile-stat-value">{stat.value}</span>
                  </div>
                ))}
              </div>
            </a>
          );
        })}
      </div>

      <div className="coding-stats-grid">
        {codingStats.map((stat, index) => {
          let icon = null;
          const iconLower = stat.icon ? stat.icon.toLowerCase() : "";

          if (iconLower.includes("code")) {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            );
          } else if (iconLower.includes("swords") || iconLower.includes("activity")) {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            );
          } else if (iconLower.includes("star")) {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            );
          } else {
            icon = (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            );
          }

          return (
            <div key={index} className="coding-stat-card" id={`stat-card-${index}`}>
              <div className="stat-icon-wrapper">
                {icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
