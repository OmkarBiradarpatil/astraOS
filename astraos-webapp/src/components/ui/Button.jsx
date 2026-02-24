import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  style = {},
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "danger":
        return "btn-danger";
      case "ghost":
        return "btn-ghost";
      default:
        return "btn-primary";
    }
  };

  const baseStyle = {
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "13.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    border: "none",
    cursor: "pointer",
    ...style,
  };

  if (variant === "primary") {
    baseStyle.background = "var(--accent)";
    baseStyle.color = "#000"; // High contrast text on Cyan
    baseStyle.boxShadow = "0 0 16px rgba(0,229,255,0.2)";
  } else if (variant === "danger") {
    baseStyle.background = "rgba(251,52,98,0.15)";
    baseStyle.color = "var(--rose)";
    baseStyle.border = "1px solid rgba(251,52,98,0.3)";
  } else if (variant === "ghost") {
    baseStyle.background = "rgba(255,255,255,0.03)";
    baseStyle.color = "var(--text)";
    baseStyle.border = "1px solid var(--border)";
  }

  return (
    <button
      type={type}
      className={`${getVariantClass()} ${className}`}
      style={baseStyle}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
