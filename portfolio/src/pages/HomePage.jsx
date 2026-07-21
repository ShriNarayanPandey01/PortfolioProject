import { useEffect, useState } from "react";
import portfolioData from "../portfolioData";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import SkillsSection from "../components/sections/SkillsSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import CodingProfilesSection from "../components/sections/CodingProfilesSection";
import ContactSection from "../components/sections/ContactSection";

const initialContactForm = {
  name: "",
  email: "",
  message: "",
};

export default function HomePage() {
  const [data] = useState(portfolioData);
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [contactState, setContactState] = useState({
    status: "idle",
    message: "",
  });
  const [scrolled, setScrolled] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const introSection = document.querySelector(".hero-intro-wrapper");
    if (!introSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(introSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-scroll-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tiltElements = document.querySelectorAll(".project-card, .coding-profile-card");

    const handleMouseMove = (e, el) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (el) => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    tiltElements.forEach((el) => {
      el.style.transition = "transform 0.15s ease-out, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease";
      el.style.transformStyle = "preserve-3d";

      const onMove = (e) => handleMouseMove(e, el);
      const onLeave = () => handleMouseLeave(el);

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      el._tiltListeners = { onMove, onLeave };
    });

    return () => {
      tiltElements.forEach((el) => {
        if (el._tiltListeners) {
          el.removeEventListener("mousemove", el._tiltListeners.onMove);
          el.removeEventListener("mouseleave", el._tiltListeners.onLeave);
        }
      });
    };
  }, [showAllProjects]);

  function handleSubmit(event) {
    event.preventDefault();
    setContactState({
      status: "submitting",
      message: "Sending your message...",
    });

    setTimeout(() => {
      setContactForm(initialContactForm);
      setContactState({
        status: "success",
        message: "Thank you for reaching out! Your message has been received.",
      });
    }, 400);
  }

  const initials = data.shortName
    ? data.shortName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "SN";

  const codingHighlights = (data.codingProfiles || [])
    .filter((profile) => profile.name.toLowerCase() !== "github")
    .map((profile) => {
      let mainVal = "";
      let subText = "";

      const ratingStat = profile.stats?.find((s) => s.label.toLowerCase() === "rating");
      const solvedStat = profile.stats?.find((s) => s.label.toLowerCase() === "solved");

      if (ratingStat) {
        mainVal = ratingStat.value;
        subText = `${profile.name} Rating`;
      } else if (solvedStat) {
        mainVal = solvedStat.value;
        subText = `${profile.name} Solved`;
      } else if (profile.stats && profile.stats.length > 0) {
        mainVal = profile.stats[0].value;
        subText = `${profile.name} ${profile.stats[0].label}`;
      } else {
        mainVal = "Active";
        subText = profile.name;
      }

      return {
        label: subText,
        value: mainVal,
      };
    });

  return (
    <div className="page-shell">
      <Header data={data} initials={initials} />

      <main id="top">
        <HeroSection data={data} scrolled={scrolled} codingHighlights={codingHighlights} />
        <SkillsSection skills={data.skills} />
        <ExperienceSection experience={data.experience} />
        <ProjectsSection projects={data.projects} showAllProjects={showAllProjects} setShowAllProjects={setShowAllProjects} />
        <CodingProfilesSection codingProfiles={data.codingProfiles} codingStats={data.codingStats} />
        <ContactSection
          data={data}
          contactForm={contactForm}
          setContactForm={setContactForm}
          contactState={contactState}
          handleSubmit={handleSubmit}
        />
      </main>

      <Footer data={data} />
    </div>
  );
}
