import SectionTitle from "../common/SectionTitle";
import SkillIcon from "../common/SkillIcon";

export default function SkillsSection({ skills = [] }) {
  return (
    <div className="hero-skills-wrapper" id="skills" data-scroll-section>
      <div className="hero-skills-heading-container">
        <SectionTitle
          eyebrow=""
          title="My Skills"
          align="center"
        />
      </div>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill} className="skill-card">
            <div className="skill-icon-box">
              <SkillIcon name={skill} />
            </div>
            <span className="skill-name">{skill.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
