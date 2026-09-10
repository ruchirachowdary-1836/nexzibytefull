import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="hero-video-bg-container">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="hero-video-element"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/techtalk-visiting-people.mp4" type="video/mp4" />
      </video>

      {/* Dark Cinematic Conference Atmospheric Overlays (No White) */}
      <div className="hero-dark-overlay"></div>
      <div className="hero-ambient-blue-glow"></div>
      <div className="hero-ambient-purple-glow"></div>

      {/* Video controls */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "24px",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: 0.8,
        transition: "opacity 0.2s"
      }}>
        <button
          type="button"
          onClick={togglePlay}
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            backdropFilter: "blur(8px)"
          }}
          title={isPlaying ? "Pause background video" : "Play background video"}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            backdropFilter: "blur(8px)"
          }}
          title={isMuted ? "Unmute video" : "Mute video"}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </div>
  );
}
