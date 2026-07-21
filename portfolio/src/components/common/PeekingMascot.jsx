export default function PeekingMascot({ scrolled }) {
  return (
    <a href="#projects" className={`hero-peeking-mascot ${scrolled ? "mascot-hidden" : ""}`} aria-label="Wanna see some cool projects I did? Click me!">
      <div className="mascot-speech-bubble">
        wanna see some cool project i did? <strong>click me!</strong>
      </div>
      <div className="mascot-svg-wrapper">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="peeking-svg">
          <defs>
            <linearGradient id="wallGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0b1120" />
            </linearGradient>
          </defs>
          <rect x="104" y="0" width="16" height="120" fill="url(#wallGradient)" />
          <line x1="104" y1="0" x2="104" y2="120" stroke="#000000" strokeWidth="2" opacity="0.85" />
          <rect x="68" y="12" width="4" height="15" fill="#94a3b8" rx="2" />
          <circle cx="70" cy="10" r="6" fill="#000000" />
          <rect x="38" y="55" width="8" height="20" rx="2" fill="#475569" />
          <rect x="94" y="55" width="8" height="20" rx="2" fill="#475569" />
          <rect x="42" y="25" width="56" height="56" rx="16" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          <rect x="48" y="31" width="44" height="34" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <ellipse cx="62" cy="48" rx="4.5" ry="6.5" fill="#ffffff" className="eye-blink" />
          <ellipse cx="78" cy="48" rx="4.5" ry="6.5" fill="#ffffff" className="eye-blink" />
          <circle cx="56" cy="58" r="2.5" fill="#475569" opacity="0.35" />
          <circle cx="84" cy="58" r="2.5" fill="#475569" opacity="0.35" />
          <path d="M 66 56 Q 70 60 74 56" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 120 45 Q 100 45 100 53 Q 100 60 120 60" fill="#334155" stroke="#475569" strokeWidth="2" />
          <path d="M 120 65 Q 98 65 98 73 Q 98 80 120 80" fill="#334155" stroke="#475569" strokeWidth="2" />
        </svg>
      </div>
    </a>
  );
}
