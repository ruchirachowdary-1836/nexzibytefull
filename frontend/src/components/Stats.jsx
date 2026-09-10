import React, { useState, useEffect, useRef } from "react";
import { COMMUNITY_STATS } from "../data/mockData.js";

function AnimatedNumber({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1600;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, stepTime);
        }
      },
      { threshold: 0.25 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats-section" id="community-stats">
      <div className="container">
        <div className="stats-grid">
          {COMMUNITY_STATS.map((stat, index) => (
            <div key={stat.label} className="stat-item">
              <div className={`stat-number ${index === 0 ? "accent-purple" : ""}`}>
                <AnimatedNumber target={stat.number} suffix={stat.suffix} />
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-desc">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
