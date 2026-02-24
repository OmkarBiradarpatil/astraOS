import React, { useEffect, useState } from "react";

const ProgressBar = ({
  progress = 0,
  className = "",
  height = "6px",
  color = "var(--accent)",
  noGlow = false,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Small delay to ensure the mount animation triggers visually
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div
      className={`progress-track ${className}`}
      style={{
        height,
        background: "rgba(255,255,255,0.05)",
        borderRadius: "100px",
        overflow: "hidden",
      }}
    >
      <div
        className="progress-fill"
        style={{
          width: `${animatedProgress}%`,
          height: "100%",
          background: color,
          borderRadius: "100px",
          boxShadow: noGlow
            ? "none"
            : `0 0 16px ${color.replace("var(--", "rgba(var(--").replace(")", ", 0.3)")}`, // Fallback glow logic
          transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            animation:
              "shimmer 1.8s 0.8s cubic-bezier(0.16, 1, 0.3, 1) infinite",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
