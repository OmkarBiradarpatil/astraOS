"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RotateCcw, ChevronLeft, ChevronRight, Loader2, Check, X } from "lucide-react";
import { fetchDocuments, fetchStudyContent } from "@/lib/api";

export default function StudyPage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string>("");
    const [studyData, setStudyData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"flashcards" | "quiz">("flashcards");
    const [cardIndex, setCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizChecked, setQuizChecked] = useState(false);

    useEffect(() => {
        fetchDocuments().then((d) => {
            const ready = (d.documents || []).filter((x: any) => x.status === "ready");
            setDocs(ready);
            if (ready.length > 0) setSelectedDoc(ready[0].id);
        }).catch(() => { });
    }, []);

    const generateStudy = async () => {
        if (!selectedDoc) return;
        setLoading(true);
        setStudyData(null);
        setCardIndex(0);
        setFlipped(false);
        setQuizAnswers({});
        setQuizChecked(false);
        try {
            const data = await fetchStudyContent(selectedDoc);
            setStudyData(data);
        } catch {
            setStudyData({ flashcards: [], quiz: [], summary: "Error generating study content.", key_points: [] });
        }
        setLoading(false);
    };

    const flashcards = studyData?.flashcards || [];
    const quiz = studyData?.quiz || [];
    const quizScore = Object.entries(quizAnswers).filter(([i, a]) => a === quiz[+i]?.correct_index).length;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Study <span className="gradient-text">Mode</span></h2>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>AI generates flashcards and quizzes from your documents.</p>
            </motion.div>

            {/* Doc selector + generate */}
            <div className="card" style={{ marginBottom: 28, padding: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <select value={selectedDoc} onChange={(e) => setSelectedDoc(e.target.value)}
                    className="input-field" style={{ flex: 1, minWidth: 200 }}>
                    <option value="">Select a document...</option>
                    {docs.map((d) => <option key={d.id} value={d.id}>{d.original_name}</option>)}
                </select>
                <button className="btn-primary" onClick={generateStudy} disabled={!selectedDoc || loading}
                    style={{ opacity: (!selectedDoc || loading) ? 0.6 : 1 }}>
                    {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Generating...</> : "✨ Generate Study Set"}
                </button>
            </div>

            {/* Empty state */}
            {!studyData && !loading && (
                <div className="card" style={{ textAlign: "center", padding: "60px 24px" }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>📚</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to study?</div>
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Select a document above and hit Generate. AI will create flashcards and quizzes.</p>
                </div>
            )}

            {/* Study content */}
            {studyData && !loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                        {(["flashcards", "quiz"] as const).map((m) => (
                            <button key={m} onClick={() => setMode(m)}
                                className={mode === m ? "btn-primary" : "btn-secondary"}
                                style={{ textTransform: "capitalize", fontSize: 14 }}>
                                {m === "flashcards" ? `🃏 Flashcards (${flashcards.length})` : `❓ Quiz (${quiz.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Summary */}
                    {studyData.summary && (
                        <div className="card glass-bright" style={{ marginBottom: 24, padding: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6 }}>📋 DOCUMENT SUMMARY</div>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{studyData.summary}</p>
                            {studyData.key_points?.length > 0 && (
                                <ul style={{ marginTop: 12, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                                    {studyData.key_points.map((p: string, i: number) => (
                                        <li key={i} style={{ fontSize: 13, color: "var(--text-muted)" }}>{p}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Flashcards */}
                    {mode === "flashcards" && flashcards.length > 0 && (
                        <div>
                            <div style={{ textAlign: "center", marginBottom: 12, fontSize: 13, color: "var(--text-muted)" }}>
                                Card {cardIndex + 1} of {flashcards.length} · Click card to reveal answer
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={cardIndex} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                                    <div className={`flashcard ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}
                                        style={{ cursor: "pointer", minHeight: 260, position: "relative" }}>
                                        <div className="flashcard-inner" style={{ minHeight: 260 }}>
                                            {/* Front */}
                                            <div className="flashcard-front card" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                textAlign: "center", padding: 40, minHeight: 260, background: "var(--bg-card)"
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", marginBottom: 16, letterSpacing: "1px" }}>QUESTION</div>
                                                    <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5 }}>{flashcards[cardIndex].question}</p>
                                                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 16 }}>Click to reveal →</p>
                                                </div>
                                            </div>
                                            {/* Back */}
                                            <div className="flashcard-back card" style={{
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                textAlign: "center", padding: 40, minHeight: 260, background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.3)"
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#22d3ee", marginBottom: 16, letterSpacing: "1px" }}>ANSWER</div>
                                                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-secondary)" }}>{flashcards[cardIndex].answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                                <button className="btn-secondary" onClick={() => { setCardIndex((c) => Math.max(0, c - 1)); setFlipped(false); }} disabled={cardIndex === 0}>
                                    <ChevronLeft size={16} /> Prev
                                </button>
                                <button className="btn-icon" onClick={() => setFlipped(!flipped)} title="Flip"><RotateCcw size={14} /></button>
                                <button className="btn-secondary" onClick={() => { setCardIndex((c) => Math.min(flashcards.length - 1, c + 1)); setFlipped(false); }} disabled={cardIndex === flashcards.length - 1}>
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Progress dots */}
                            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
                                {flashcards.map((_: any, i: number) => (
                                    <div key={i} onClick={() => { setCardIndex(i); setFlipped(false); }}
                                        style={{
                                            width: i === cardIndex ? 20 : 6, height: 6, borderRadius: 3, cursor: "pointer", transition: "all 0.3s",
                                            background: i === cardIndex ? "var(--purple)" : "var(--border)"
                                        }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quiz */}
                    {mode === "quiz" && quiz.length > 0 && (
                        <div>
                            {quiz.map((q: any, qi: number) => (
                                <div key={qi} className="card" style={{ marginBottom: 16, padding: 20 }}>
                                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>
                                        <span style={{ color: "#a78bfa", marginRight: 8 }}>Q{qi + 1}.</span>{q.question}
                                    </div>
                                    {q.options?.map((opt: string, oi: number) => {
                                        const chosen = quizAnswers[qi] === oi;
                                        const correct = quizChecked && oi === q.correct_index;
                                        const wrong = quizChecked && chosen && oi !== q.correct_index;
                                        return (
                                            <button key={oi} onClick={() => !quizChecked && setQuizAnswers((a) => ({ ...a, [qi]: oi }))}
                                                style={{
                                                    width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 10, marginBottom: 8,
                                                    border: `1px solid ${correct ? "#10b981" : wrong ? "#ef4444" : chosen ? "var(--purple)" : "var(--border)"}`,
                                                    background: correct ? "rgba(16,185,129,0.1)" : wrong ? "rgba(239,68,68,0.1)" : chosen ? "rgba(124,58,237,0.1)" : "transparent",
                                                    color: correct ? "#34d399" : wrong ? "#f87171" : chosen ? "#a78bfa" : "var(--text-secondary)",
                                                    cursor: quizChecked ? "default" : "pointer", transition: "all 0.2s", fontSize: 14
                                                }}>
                                                <span style={{ fontWeight: 700, marginRight: 8 }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                                                {correct && <Check size={14} style={{ float: "right", marginTop: 2 }} />}
                                                {wrong && <X size={14} style={{ float: "right", marginTop: 2 }} />}
                                            </button>
                                        );
                                    })}
                                    {quizChecked && q.explanation && (
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, padding: "8px 12px", background: "var(--bg-secondary)", borderRadius: 8 }}>
                                            💡 {q.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div style={{ textAlign: "center" }}>
                                {!quizChecked ? (
                                    <button className="btn-primary" onClick={() => setQuizChecked(true)} disabled={Object.keys(quizAnswers).length < quiz.length}
                                        style={{ opacity: Object.keys(quizAnswers).length < quiz.length ? 0.6 : 1 }}>
                                        Submit Quiz
                                    </button>
                                ) : (
                                    <div className="card glass-bright" style={{ padding: 20, display: "inline-block" }}>
                                        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
                                            {quizScore}/{quiz.length}
                                            <span style={{ marginLeft: 8 }}>{quizScore === quiz.length ? "🎉" : quizScore >= quiz.length / 2 ? "👍" : "📚"}</span>
                                        </div>
                                        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                                            {quizScore === quiz.length ? "Perfect score!" : `Keep studying! ${quiz.length - quizScore} incorrect.`}
                                        </div>
                                        <button className="btn-secondary" onClick={() => { setQuizAnswers({}); setQuizChecked(false); }} style={{ marginTop: 12 }}>
                                            Retry Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
