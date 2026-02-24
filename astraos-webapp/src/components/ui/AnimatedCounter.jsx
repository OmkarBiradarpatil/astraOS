import React, { useEffect, useState, useRef } from "react";

const AnimatedCounter = ({
  value,
  duration = 1000,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = performance.now();
    let rAF;

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const updateCounter = (currentTime) => {
      const elapsedTime = currentTime - startTime.current;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = easeOutExpo(progress);
      const currentVal =
        startValue.current + (value - startValue.current) * easedProgress;

      setDisplayValue(currentVal);

      if (progress < 1) {
        rAF = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    rAF = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(rAF);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const formattedValue =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue);

  return (
    <span className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
