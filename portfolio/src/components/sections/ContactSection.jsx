export default function ContactSection({ data, contactForm, setContactForm, contactState, handleSubmit }) {
  return (
    <section id="contact" className="scroll-section contact-section" data-scroll-section>
      <div className="contact-layout">
        <div className="contact-info">
          <h2>Let&apos;s talk for Something special</h2>
          <p>I seek to push the boundaries of web development and design. If you have a project in mind, let&apos;s create something remarkable together.</p>
          <div className="contact-details-list">
            <div className="contact-detail-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{data.email}</span>
            </div>
            <div className="contact-detail-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{data.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <form className="contact-form-brutalist" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              required
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
              placeholder="Email"
              required
              value={contactForm.email}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
            <textarea
              placeholder="How can I help?"
              rows="5"
              required
              value={contactForm.message}
              onChange={(event) =>
                setContactForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
            />
            <button
              className="button button-primary btn-get-touch"
              type="submit"
              disabled={contactState.status === "submitting"}
            >
              Get In Touch <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
            {contactState.message ? (
              <p className={`form-message form-message-${contactState.status}`}>
                {contactState.message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
