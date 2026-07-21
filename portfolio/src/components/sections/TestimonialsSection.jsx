import SectionTitle from "../common/SectionTitle";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-section testimonials-section" data-scroll-section>
      <SectionTitle
        eyebrow=""
        title="My Testimonial"
        align="center"
      />
      <div className="testimonials-grid-wrapper">
        <div className="testimonial-card">
          <div className="quote-mark">&ldquo;</div>
          <p className="testimonial-text">Evren&apos;s ability to translate complex requirements into intuitive designs is unmatched. A true professional.</p>
          <div className="testimonial-meta">
            <strong>Flora Smith</strong>
            <span>CEO at TechFlow</span>
          </div>
        </div>
        <div className="testimonial-card testimonial-card-dark">
          <div className="quote-mark">&ldquo;</div>
          <p className="testimonial-text">Working with Evren was a game-changer for our product. The code is clean, the design is bold, and the results are incredible.</p>
          <div className="testimonial-meta">
            <strong>Jason Marks</strong>
            <span>Product Lead at Horizon</span>
          </div>
        </div>
        <div className="testimonial-card">
          <div className="quote-mark">&ldquo;</div>
          <p className="testimonial-text">An exceptional developer who understands the balance between form and function. Highly recommended.</p>
          <div className="testimonial-meta">
            <strong>David Chen</strong>
            <span>Lead Designer at Pixel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
