import React, { useState, useEffect } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "../data/mockData.js";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  // Optional subtle auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="section-padding testimonials-section" id="testimonials">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            COMMUNITY VOICES
          </span>
          <h2 className="section-heading">Real People. Real Connections.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Hear how developers, architects, and startup founders expand their horizons at NexziByte TechTalk.
          </p>
        </div>

        <div className="testimonials-slider-box">
          <div className="testimonial-card">
            <Quote 
              size={42} 
              style={{ color: "#16A34A", opacity: 0.35, marginBottom: "16px" }} 
            />

            <p className="testimonial-quote">
              "{current.quote}"
            </p>

            <div className="testimonial-author-row">
              <img 
                src={current.image} 
                alt={current.name} 
                className="testimonial-avatar"
                loading="lazy" 
              />
              <div>
                <div className="testimonial-name">{current.name}</div>
                <div className="testimonial-role">
                  {current.role} • <span style={{ color: "#15803D", fontWeight: 700 }}>{current.company}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="slider-controls-row">
            <button 
              type="button" 
              className="slider-arrow-btn" 
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: currentIndex === idx ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: currentIndex === idx ? "var(--primary-purple)" : "#D1D5DB",
                    border: "none",
                    padding: 0,
                    transition: "all 0.25s ease"
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              type="button" 
              className="slider-arrow-btn" 
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
