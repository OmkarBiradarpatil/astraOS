import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import CircularMeter from "../components/ui/CircularMeter";

const Health = () => {
  const context = useAppContext();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  if (!context)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { healthData, setHealthData } = context;

  const calculateBMI = (e) => {
    e.preventDefault();
    if (height && weight) {
      const hMeters = parseFloat(height) / 100;
      const bmi = (parseFloat(weight) / (hMeters * hMeters)).toFixed(1);
      setHealthData({ ...healthData, bmi });
    }
  };

  const updateMetric = (metric, diff) => {
    setHealthData({
      ...healthData,
      [metric]: Math.max(0, healthData[metric] + diff),
    });
  };

  return (
    <>
      <div
        className="welcome-banner"
        style={{
          marginBottom: "32px",
          animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <h1 className="greeting">Health Systems</h1>
        <p className="status" style={{ fontSize: "15px" }}>
          Maintain optimal physical condition for peak performance and deep work
          output.
        </p>
      </div>

      <div className="dashboard-grid">
        <Card delay={0.1}>
          <div className="card-header">
            <h3 className="card-title">Body Metrics (BMI)</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(251, 191, 36, 0.1)",
                color: "var(--gold)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "16px",
            }}
          >
            <form
              onSubmit={calculateBMI}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  padding: "14px",
                  borderRadius: "10px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(251, 191, 36, 0.4)";
                  e.target.style.boxShadow = "0 0 20px rgba(251, 191, 36, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  padding: "14px",
                  borderRadius: "10px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "14px",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(251, 191, 36, 0.4)";
                  e.target.style.boxShadow = "0 0 20px rgba(251, 191, 36, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <Button
                type="submit"
                style={{
                  background: "var(--gold)",
                  color: "#000",
                  boxShadow: "0 0 16px rgba(251,191,36,0.3)",
                }}
              >
                Calculate BMI
              </Button>
            </form>

            {healthData.bmi && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "20px",
                  background: "rgba(0, 229, 255, 0.08)",
                  border: "1px solid rgba(0, 229, 255, 0.2)",
                  borderRadius: "12px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      fontFamily: "Fira Code, monospace",
                      letterSpacing: "1px",
                      marginBottom: "4px",
                    }}
                  >
                    Current BMI
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                    Optimal tracking active
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "var(--accent)",
                    fontFamily: "Sora, sans-serif",
                    letterSpacing: "-1px",
                  }}
                >
                  <AnimatedCounter
                    value={parseFloat(healthData.bmi) || 0}
                    decimals={1}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card delay={0.2}>
          <div className="card-header">
            <h3 className="card-title">Hydration Intake</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(96, 165, 250, 0.1)",
                color: "#60a5fa",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "16px",
              gap: "24px",
            }}
          >
            <CircularMeter
              progress={(healthData.water / 3) * 100}
              size={140}
              strokeWidth={8}
              color="#60a5fa"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    fontFamily: "Sora, sans-serif",
                    letterSpacing: "-1px",
                    color: "#60a5fa",
                  }}
                >
                  <AnimatedCounter value={healthData.water} decimals={1} />
                </span>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Liters / 3L
                </span>
              </div>
            </CircularMeter>

            <div
              style={{
                display: "flex",
                gap: "12px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => updateMetric("water", -0.2)}
                variant="ghost"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  padding: 0,
                  fontSize: "20px",
                }}
              >
                -
              </Button>
              <Button
                onClick={() => updateMetric("water", 0.2)}
                style={{
                  background: "#60a5fa",
                  color: "#000",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  padding: 0,
                  fontSize: "20px",
                  boxShadow: "0 0 16px rgba(96,165,250,0.3)",
                }}
              >
                +
              </Button>
            </div>
          </div>
        </Card>

        <Card delay={0.3}>
          <div className="card-header">
            <h3 className="card-title">Sleep Cycle</h3>
            <div
              className="card-icon"
              style={{
                background: "rgba(192, 132, 252, 0.1)",
                color: "#c084fc",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "16px",
              gap: "24px",
            }}
          >
            <CircularMeter
              progress={(healthData.sleep / 8) * 100}
              size={140}
              strokeWidth={8}
              color="#c084fc"
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    fontFamily: "Sora, sans-serif",
                    letterSpacing: "-1px",
                    color: "#c084fc",
                  }}
                >
                  <AnimatedCounter value={healthData.sleep} decimals={1} />
                </span>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  Hours / 8h
                </span>
              </div>
            </CircularMeter>

            <div
              style={{
                display: "flex",
                gap: "12px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => updateMetric("sleep", -0.5)}
                variant="ghost"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  padding: 0,
                  fontSize: "20px",
                }}
              >
                -
              </Button>
              <Button
                onClick={() => updateMetric("sleep", 0.5)}
                style={{
                  background: "#c084fc",
                  color: "#000",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  padding: 0,
                  fontSize: "20px",
                  boxShadow: "0 0 16px rgba(192,132,252,0.3)",
                }}
              >
                +
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Health;
