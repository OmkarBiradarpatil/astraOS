import React, { useEffect, useState } from "react";

const CircularMeter = ({
  progress = 0,
  size = 56,
  strokeWidth = 4,
  color = "var(--accent)",
  trackColor = "rgba(255,255,255,0.06)",
  children,
}) => {
  const [offset, setOffset] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const timer = setTimeout(() => {
      const progressOffset = circumference - (progress / 100) * circumference;
      setOffset(progressOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress, circumference]);

  return (
    <div
      className="circle-wrap"
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset !== 0 ? offset : circumference} // Initial state is empty
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      {children && (
        <div
          className="circle-text"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CircularMeter;
