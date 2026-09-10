import React, { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "../data/mockData.js";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first open by default

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="section-padding" id="faq">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="section-heading">Everything You Need to Know</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Clear answers regarding event entry, visitor accreditation, free delegate criteria, and venue check-in.
          </p>
        </div>

        <div className="faq-accordion-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="faq-icon-caret" />
                </button>

                {isOpen && (
                  <div className="faq-answer-pane">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
