import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const FocusTube = () => {
  const context = useAppContext();
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  if (!context)
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        Loading environment physics...
      </div>
    );
  const { focusSessions, setFocusSessions } = context;

  const extractId = (urlStr) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlStr.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const loadVideo = (e) => {
    e.preventDefault();
    const id = extractId(url);
    if (id) {
      setVideoId(id);
      setNotes([]);
      setUrl("");
      // Save to history globally
      setFocusSessions([
        {
          id: Date.now().toString(),
          videoId: id,
          date: new Date().toISOString(),
        },
        ...focusSessions,
      ]);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const addNote = (e) => {
    e.preventDefault();
    if (note.trim()) {
      setNotes([...notes, { id: Date.now(), text: note }]);
      setNote("");
    }
  };

  return (
    <>
      {/* Cinematic Mode Backdrop */}
      {videoId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.5) 0%, rgba(6,10,19,0.95) 100%)",
            backdropFilter: "blur(20px)",
            animation:
              "fadeInCinematic 1.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          className="welcome-banner"
          style={{
            marginBottom: "32px",
            animation: "fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <h1 className="greeting">FocusTube</h1>
          <p className="status" style={{ fontSize: "15px" }}>
            Distraction-free cinematic learning environment. Watch and take
            notes simultaneously.
          </p>
        </div>

        {!videoId && (
          <Card
            delay={0.1}
            style={{
              marginBottom: "24px",
              textAlign: "center",
              padding: "80px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  background: "rgba(0, 229, 255, 0.1)",
                  color: "var(--accent)",
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  boxShadow: "0 0 30px rgba(0,229,255,0.1)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontFamily: "Sora, sans-serif" }}>
                Enter the Flow State
              </h3>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "14px",
                  maxWidth: "400px",
                  lineHeight: 1.5,
                }}
              >
                Paste any YouTube tutorial or lecture link below to enter an
                isolated, distraction-free environment with synchronized notes.
              </p>

              <form
                onSubmit={loadVideo}
                style={{
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                  maxWidth: "500px",
                  marginTop: "16px",
                }}
              >
                <input
                  type="text"
                  placeholder="Paste YouTube link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    padding: "16px",
                    borderRadius: "12px",
                    color: "#fff",
                    outline: "none",
                    fontSize: "14px",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0, 229, 255, 0.4)";
                    e.target.style.boxShadow =
                      "0 0 20px rgba(0, 229, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <Button type="submit">Enter Session</Button>
              </form>
            </div>
          </Card>
        )}

        {videoId && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              gap: "24px",
              animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            {/* Left panel - Video */}
            <Card
              delay={0.2}
              style={{
                padding: "0",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              hover={false}
            >
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  background: "#000",
                }}
              >
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    animation: "fadeInCinematic 2s both",
                  }}
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid var(--border)",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <Button onClick={() => setVideoId("")} variant="danger">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "6px" }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                  End Focus Session
                </Button>
              </div>
            </Card>

            {/* Right panel - Formatted Notes */}
            <Card
              delay={0.3}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: "500px",
                background: "rgba(10,15,26,0.6)",
                backdropFilter: "blur(20px)",
              }}
              hover={false}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 10px var(--accent)",
                  }}
                />
                <h3
                  style={{ fontSize: "16px", fontFamily: "Sora, sans-serif" }}
                >
                  Session Memory
                </h3>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  paddingRight: "4px",
                }}
              >
                {notes.length === 0 && (
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: "13px",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      fontStyle: "italic",
                      border: "1px dashed var(--border)",
                      borderRadius: "12px",
                    }}
                  >
                    Memory blank.
                    <br />
                    Capture insights here.
                  </div>
                )}
                {notes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      padding: "14px",
                      borderRadius: "10px",
                      fontSize: "13.5px",
                      lineHeight: 1.5,
                      borderLeft: "3px solid var(--accent)",
                      animation:
                        "slideInNote 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
                    }}
                  >
                    {n.text}
                  </div>
                ))}
              </div>

              <form
                onSubmit={addNote}
                style={{ display: "flex", gap: "10px", marginTop: "auto" }}
              >
                <input
                  type="text"
                  placeholder="Type note & press Enter..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    padding: "14px",
                    borderRadius: "10px",
                    color: "#fff",
                    outline: "none",
                    fontSize: "13.5px",
                    transition: "all 0.3s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(0, 229, 255, 0.3)";
                    e.target.style.boxShadow =
                      "0 0 15px rgba(0, 229, 255, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </form>
            </Card>
          </div>
        )}

        {/* History */}
        <Card
          delay={videoId ? 0.4 : 0.2}
          style={{ marginTop: "24px" }}
          hover={false}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
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
              style={{ color: "var(--muted)" }}
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h3 style={{ fontSize: "16px", fontFamily: "Sora, sans-serif" }}>
              Temporal Repository
            </h3>
          </div>

          {focusSessions.length === 0 && (
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>
              No temporal records found.
            </span>
          )}

          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "16px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {focusSessions.map((sess, i) => (
              <div
                key={sess.id}
                style={{
                  minWidth: "240px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  animation: `fadeUp 0.5s ${0.3 + i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1) both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 20px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => setVideoId(sess.videoId)}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={`https://img.youtube.com/vi/${sess.videoId}/mqdefault.jpg`}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      height: "135px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.2)",
                      transition: "background 0.3s",
                    }}
                    className="thumb-overlay"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 40,
                      height: 40,
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(4px)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                    className="play-btn"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginLeft: 2 }}
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    padding: "16px",
                    fontSize: "12px",
                    color: "var(--muted)",
                    fontFamily: "Fira Code, monospace",
                  }}
                >
                  {new Date(sess.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes fadeInCinematic {
           from { opacity: 0; }
           to { opacity: 1; }
        }
        @keyframes slideInNote {
           from { opacity: 0; transform: translateX(20px); }
           to { opacity: 1; transform: translateX(0); }
        }
        .task-item:hover .thumb-overlay { background: rgba(0,0,0,0); }
        .task-item:hover .play-btn { opacity: 1; }
      `}</style>
    </>
  );
};

export default FocusTube;
