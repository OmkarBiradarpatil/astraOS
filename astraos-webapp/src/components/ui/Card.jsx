import React from "react";

const Card = ({
  children,
  delay = 0,
  className = "",
  noPadding = false,
  hover = true,
  style = {},
  onClick,
}) => {
  const baseStyle = {
    animation: `cardEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
    padding: noPadding ? "0" : "22px",
    cursor: onClick ? "pointer" : "default",
    ...style,
  };

  return (
    <div
      className={`card ${hover ? "" : "no-hover"} ${className}`}
      style={baseStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
