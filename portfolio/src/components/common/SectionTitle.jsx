export default function SectionTitle({ eyebrow, title, text, align = "left", action, fullWidth = false }) {
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
