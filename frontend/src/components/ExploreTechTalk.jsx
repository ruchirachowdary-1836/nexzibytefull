import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, BookOpen, Calendar, Rocket, Mic, Code, Users, Sparkles 
} from "lucide-react";
import { EXPLORE_FEATURES } from "../data/mockData.js";

const FEATURE_ICONS = {
  BookOpen: BookOpen,
  Calendar: Calendar,
  Rocket: Rocket,
  Mic: Mic,
  Code: Code,
  Users: Users
};

// 6 Distinct Curated Premium Theme Palettes (Rich Luxury Gradients - No Blues)
const CARD_THEMES = [
  {
    name: "amethyst-royal",
    label: "Imperial Amethyst",
    bg: "linear-gradient(145deg, #3B0764 0%, #581C87 55%, #7C3AED 100%)",
    border: "rgba(196, 181, 253, 0.35)",
    hoverBorder: "rgba(237, 233, 254, 0.85)",
    glow: "rgba(124, 58, 237, 0.45)",
    hoverIconColor: "#A855F7"
  },
  {
    name: "rose-gold",
    label: "Velvet Rose Gold",
    bg: "linear-gradient(145deg, #4A154B 0%, #831843 55%, #9D174D 100%)",
    border: "rgba(244, 114, 182, 0.35)",
    hoverBorder: "rgba(251, 207, 232, 0.85)",
    glow: "rgba(219, 39, 119, 0.45)",
    hoverIconColor: "#F472B6"
  },
  {
    name: "emerald",
    label: "Cyber Emerald",
    bg: "linear-gradient(145deg, #064E3B 0%, #047857 55%, #059669 100%)",
    border: "rgba(110, 231, 183, 0.35)",
    hoverBorder: "rgba(209, 250, 229, 0.85)",
    glow: "rgba(5, 150, 105, 0.45)",
    hoverIconColor: "#047857"
  },
  {
    name: "ruby",
    label: "Crimson Ruby",
    bg: "linear-gradient(145deg, #881337 0%, #BE123C 55%, #E11D48 100%)",
    border: "rgba(253, 164, 175, 0.35)",
    hoverBorder: "rgba(255, 228, 230, 0.85)",
    glow: "rgba(225, 29, 72, 0.45)",
    hoverIconColor: "#BE123C"
  },
  {
    name: "amber",
    label: "Solar Amber",
    bg: "linear-gradient(145deg, #78350F 0%, #B45309 55%, #D97706 100%)",
    border: "rgba(253, 230, 138, 0.35)",
    hoverBorder: "rgba(254, 243, 199, 0.85)",
    glow: "rgba(217, 119, 6, 0.45)",
    hoverIconColor: "#B45309"
  },
  {
    name: "mulberry",
    label: "Royal Mulberry",
    bg: "linear-gradient(145deg, #2E1065 0%, #4C1D95 55%, #6D28D9 100%)",
    border: "rgba(216, 180, 254, 0.35)",
    hoverBorder: "rgba(243, 232, 255, 0.85)",
    glow: "rgba(147, 51, 234, 0.45)",
    hoverIconColor: "#C084FC"
  }
];

export default function ExploreTechTalk() {
  return (
    <section className="section-padding" id="explore-tech">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <span className="section-label">
            <Sparkles size={13} />
            ECOSYSTEM DIRECTORY
          </span>
          <h2 className="section-heading">One Community. Endless Possibilities.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Explore every facet of NexziByte TechTalk — from cutting-edge engineering research to closed-door founder summits.
          </p>
        </div>

        <div className="explore-grid">
          {EXPLORE_FEATURES.map((item, index) => {
            const IconComp = FEATURE_ICONS[item.icon] || Code;
            const theme = CARD_THEMES[index % CARD_THEMES.length];

            return (
              <Link 
                to={item.link} 
                key={item.id} 
                className="explore-feature-card"
                style={{
                  "--card-bg": theme.bg,
                  "--card-border": theme.border,
                  "--card-hover-border": theme.hoverBorder,
                  "--card-glow": theme.glow,
                  "--card-hover-icon": theme.hoverIconColor,
                }}
                aria-label={`Explore ${item.title}`}
              >
                <div>
                  <div className="explore-card-header">
                    <span className="explore-number">{item.number}</span>
                    <div className="explore-icon-wrapper">
                      <IconComp size={19} strokeWidth={2.2} />
                    </div>
                  </div>

                  <h3 className="explore-card-title">{item.title}</h3>
                  <p className="explore-card-desc">{item.description}</p>
                </div>

                <div className="explore-card-arrow">
                  <span>Explore</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
