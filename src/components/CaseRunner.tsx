import { useEffect, useMemo, useState } from "react";
import type { CaseModule, ChoiceId } from "../data/cases";

type Props = {
  mod: CaseModule; // compatibility
  allMods?: CaseModule[]; // pass CASES here
};

const CATEGORY_LABEL: Record<CaseModule["category"], string> = {
  HBT: "HBT",
  TRAUMA: "Trauma",
  BREAST: "Breast",
  ENDO: "Endocrine",
  GIT: "GIT",
  VASC: "Vascular",
  PEDIA: "Pedia",
};

type ProgressStore = {
  cases: Record<string, { answered: number; correct: number; updatedAt: number }>;
};

const PROGRESS_KEY = "surgeonpro_v1_progress";

function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { cases: {} };
    const parsed = JSON.parse(raw) as ProgressStore;
    if (!parsed?.cases || typeof parsed.cases !== "object") return { cases: {} };
    return parsed;
  } catch {
    return { cases: {} };
  }
}

function saveProgress(store: ProgressStore) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // If storage is blocked/quota exceeded, do nothing (avoid crashing the app)
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Highlight key headings like Charcot/Reynolds/Differentials */
function isHeadingLine(line: string) {
  const t = line.trim();
  if (!t) return false;

  const keyHeadings = [
    "Charcot Triad",
    "Reynolds Pentad",
    "Differentials",
    "Board traps",
    "Pathophysiology",
    "Tokyo Diagnostic Criteria",
    "Tokyo Severity Grading",
    "Grade I",
    "Grade II",
    "Grade III",
    "Resuscitation",
    "Antibiotics",
    "Duration",
    "ASGE",
    "High Risk",
    "Intermediate Risk",
    "Low Risk",
    "Drainage timing",
    "ERCP complications",
    "Pancreatitis prophylaxis",
    "Indications",
    "Primary closure",
    "Complications",
    "Oral Defense Script",
    "Rapid-fire",
    "Numeric board traps",
  ];

  const matchesKey = keyHeadings.some((k) =>
    t.toLowerCase().startsWith(k.toLowerCase())
  );

  const looksLikeHeader = t.endsWith(":");

  return matchesKey || looksLikeHeader;
}

function isBullet(line: string) {
  const t = line.trim();
  return t.startsWith("•") || t.startsWith("- ") || t.startsWith("– ");
}

export default function CaseRunner({ mod, allMods }: Props) {
  const modules = useMemo<CaseModule[]>(
    () => (allMods && allMods.length ? allMods : [mod]),
    [allMods, mod]
  );

  const categories = useMemo(() => {
    const uniq = new Set(modules.map((m) => m.category));
    return Array.from(uniq);
  }, [modules]);

  const [activeCategory, setActiveCategory] = useState<CaseModule["category"]>(
    modules[0].category
  );

  const casesInCategory = useMemo(
    () => modules.filter((m) => m.category === activeCategory),
    [modules, activeCategory]
  );

  const [activeCaseId, setActiveCaseId] = useState<string>(modules[0].id);

  const activeCase = useMemo(() => {
    return modules.find((m) => m.id === activeCaseId) ?? modules[0];
  }, [modules, activeCaseId]);

  // Keep case inside category
  useEffect(() => {
    if (!casesInCategory.some((c) => c.id === activeCaseId)) {
      setActiveCaseId(casesInCategory[0]?.id ?? modules[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // ✅ TRUE ACCORDION
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  useEffect(() => {
    setOpenSectionId(null);
  }, [activeCaseId]);

  // Answer + reveal
  const [selected, setSelected] = useState<Record<string, ChoiceId | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Exam mode + timer
  const [examMode, setExamMode] = useState(false);
  const [examSeconds, setExamSeconds] = useState(15 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setExamSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (examSeconds === 0) setRunning(false);
  }, [examSeconds]);

  // When switching CASE: hide reveals for that case’s questions
  useEffect(() => {
    const next: Record<string, boolean> = { ...revealed };
    activeCase.sections.forEach((s) => s.qna.forEach((q) => (next[q.id] = false)));
    setRevealed(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCaseId]);

  const allQuestions = useMemo(
    () => activeCase.sections.flatMap((s) => s.qna),
    [activeCase]
  );

  const score = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of allQuestions) {
      const pick = selected[q.id];
      if (pick) {
        answered += 1;
        if (pick === q.answerId) correct += 1;
      }
    }
    return { answered, correct, total: allQuestions.length };
  }, [allQuestions, selected]);

  // Read progress ONCE per render
  const store = useMemo(() => loadProgress(), [activeCaseId, score.answered, score.correct]);

  // Persist progress
  useEffect(() => {
    if (score.total === 0) return;
    const s = loadProgress();
    s.cases[activeCase.id] = {
      answered: score.answered,
      correct: score.correct,
      updatedAt: Date.now(),
    };
    saveProgress(s);
  }, [activeCase.id, score.answered, score.correct, score.total]);

  const progressForCase =
    store.cases[activeCase.id] ?? { answered: 0, correct: 0, updatedAt: 0 };

  const categoryProgress = useMemo(() => {
    const cases = casesInCategory;
    let totalQ = 0;
    let answered = 0;
    let correct = 0;

    for (const c of cases) {
      const qs = c.sections.flatMap((s) => s.qna).length;
      totalQ += qs;
      const p = store.cases[c.id];
      if (p) {
        answered += clamp(p.answered, 0, qs);
        correct += clamp(p.correct, 0, qs);
      }
    }
    return { totalQ, answered, correct };
  }, [casesInCategory, store.cases]);

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function resetExam(minutes = 15) {
    setRunning(false);
    setExamSeconds(minutes * 60);
    const next: Record<string, boolean> = { ...revealed };
    activeCase.sections.forEach((s) => s.qna.forEach((q) => (next[q.id] = false)));
    setRevealed(next);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1220", color: "white" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 340, padding: 16, borderRight: "1px solid rgba(255,255,255,0.12)" }}>
        <h3 style={{ marginTop: 0, marginBottom: 10 }}>SURGEON PRO V1</h3>

        {/* CATEGORY LIST */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Categories</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: isActive ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  {CATEGORY_LABEL[cat] ?? cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* CATEGORY PROGRESS */}
        <div
          style={{
            marginBottom: 14,
            padding: 12,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
            {CATEGORY_LABEL[activeCategory] ?? activeCategory} progress
          </div>
          <div style={{ fontWeight: 800 }}>
            {categoryProgress.correct}/{categoryProgress.totalQ} correct
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            answered: {categoryProgress.answered}/{categoryProgress.totalQ}
          </div>
        </div>

        {/* CASES UNDER CATEGORY */}
        <div>
          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            {CATEGORY_LABEL[activeCategory] ?? activeCategory} cases
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {casesInCategory.map((c) => {
              const isActive = c.id === activeCaseId;
              const p = store.cases[c.id];
              const total = c.sections.flatMap((s) => s.qna).length;
              const small =
                total > 0 && p ? `${clamp(p.correct, 0, total)}/${total}` : total > 0 ? `0/${total}` : "";

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCaseId(c.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: isActive ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 900 }}>{c.title}</div>
                    {small && <div style={{ fontSize: 12, opacity: 0.85 }}>{small}</div>}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>{c.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ padding: 20, width: "100%", maxWidth: "none", margin: 0, textAlign: "left" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>LOADED CASE ID: {activeCase.id}</div>
          <h2 style={{ margin: "6px 0 6px" }}>{activeCase.title}</h2>
          <div style={{ opacity: 0.9 }}>{activeCase.subtitle}</div>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              lineHeight: 1.5,
            }}
          >
            <b>Priority one-liner:</b> {activeCase.priorityOneLiner}
          </div>

          {/* SCORE + EXAM MODE */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.85 }}>Case score</div>
              <div style={{ fontWeight: 900 }}>
                {score.correct}/{score.total} correct
              </div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                answered: {score.answered}/{score.total}
              </div>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                minWidth: 260,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>Exam Mode</div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !examMode;
                    setExamMode(next);
                    if (next) resetExam(15);
                    if (!next) setRunning(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: examMode ? "rgba(239,68,68,0.18)" : "rgba(34,197,94,0.18)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 800,
                  }}
                >
                  {examMode ? "ON" : "OFF"}
                </button>
              </div>

              <div style={{ marginTop: 8, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontSize: 12, opacity: 0.85 }}>Timer:</div>
                <div style={{ fontWeight: 900 }}>{formatTime(examSeconds)}</div>

                <button
                  type="button"
                  onClick={() => setRunning((r) => !r)}
                  disabled={!examMode || examSeconds === 0}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: !examMode ? "not-allowed" : "pointer",
                    opacity: !examMode ? 0.5 : 1,
                    fontWeight: 800,
                  }}
                >
                  {running ? "Pause" : "Start"}
                </button>

                <button
                  type="button"
                  onClick={() => resetExam(15)}
                  disabled={!examMode}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: !examMode ? "not-allowed" : "pointer",
                    opacity: !examMode ? 0.5 : 1,
                    fontWeight: 800,
                  }}
                >
                  Reset 15
                </button>
              </div>

              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                Exam Mode locks “Reveal” while ON.
              </div>
            </div>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.85 }}>Saved progress</div>
              <div style={{ fontWeight: 900 }}>
                {progressForCase.correct}/{score.total} correct
              </div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                answered: {progressForCase.answered}/{score.total}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ TRUE ACCORDION SECTIONS */}
        <div style={{ marginTop: 16 }}>
          {activeCase.sections.map((s, idx) => {
            const isOpen = openSectionId === s.id;

            return (
              <div
                key={s.id}
                style={{
                  marginBottom: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenSectionId((cur) => (cur === s.id ? null : s.id))}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    cursor: "pointer",
                    background: "transparent",
                    color: "white",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 900,
                  }}
                >
                  <span>
                    {idx + 1}. {s.title}
                  </span>
                  <span style={{ opacity: 0.85 }}>{isOpen ? "▾" : "▸"}</span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 14px 14px" }}>
                    {/* CONTENT (LEFT + HIGHLIGHTS) */}
                    <div style={{ paddingTop: 10 }}>
                      {s.content.map((line, i) => {
                        const t = line.trim();
                        if (!t) return <div key={i} style={{ height: 10 }} />;

                        if (isHeadingLine(line)) {
                          return (
                            <div
                              key={i}
                              style={{
                                marginTop: 12,
                                marginBottom: 8,
                                padding: "10px 12px",
                                borderRadius: 12,
                                border: "1px solid rgba(245,158,11,0.55)",
                                background: "rgba(245,158,11,0.12)",
                                fontWeight: 900,
                              }}
                            >
                              {t}
                            </div>
                          );
                        }

                        if (isBullet(line)) {
                          return (
                            <div
                              key={i}
                              style={{
                                margin: "6px 0",
                                padding: "8px 10px",
                                borderRadius: 10,
                                border: "1px solid rgba(37,99,235,0.35)",
                                background: "rgba(37,99,235,0.08)",
                              }}
                            >
                              {t}
                            </div>
                          );
                        }

                        return (
                          <p key={i} style={{ margin: "6px 0", lineHeight: 1.6, opacity: 0.95 }}>
                            {line}
                          </p>
                        );
                      })}

                      {/* Q&A */}
                      {s.qna.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <h4 style={{ margin: "8px 0" }}>Q&A</h4>

                          {s.qna.map((q) => {
                            const picked = selected[q.id] ?? null;
                            const isRevealed = revealed[q.id] ?? false;
                            const revealAllowed = !examMode;

                            return (
                              <div
                                key={q.id}
                                style={{
                                  marginBottom: 12,
                                  padding: 12,
                                  borderRadius: 12,
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  background: "rgba(255,255,255,0.04)",
                                }}
                              >
                                <p style={{ fontWeight: 800, margin: "0 0 8px" }}>{q.question}</p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                  {q.choices.map((c) => {
                                    const isPicked = picked === c.id;
                                    const isCorrect = c.id === q.answerId;

                                    const border =
                                      isRevealed && isCorrect
                                        ? "1px solid rgba(34,197,94,0.9)"
                                        : isPicked
                                        ? "1px solid rgba(37,99,235,0.9)"
                                        : "1px solid rgba(255,255,255,0.12)";

                                    const background =
                                      isRevealed && isCorrect
                                        ? "rgba(34,197,94,0.18)"
                                        : isPicked
                                        ? "rgba(37,99,235,0.18)"
                                        : "rgba(255,255,255,0.06)";

                                    return (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setSelected((p) => ({ ...p, [q.id]: c.id }))}
                                        style={{
                                          textAlign: "left",
                                          padding: "10px 12px",
                                          borderRadius: 10,
                                          border,
                                          background,
                                          color: "white",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <b>({c.id})</b> {c.text}
                                      </button>
                                    );
                                  })}
                                </div>

                                <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                  <button
                                    type="button"
                                    onClick={() => setRevealed((r) => ({ ...r, [q.id]: !r[q.id] }))}
                                    disabled={!revealAllowed}
                                    style={{
                                      padding: "8px 12px",
                                      borderRadius: 10,
                                      border: "1px solid rgba(255,255,255,0.15)",
                                      background: "rgba(255,255,255,0.06)",
                                      color: "white",
                                      cursor: !revealAllowed ? "not-allowed" : "pointer",
                                      opacity: !revealAllowed ? 0.5 : 1,
                                      fontWeight: 800,
                                    }}
                                  >
                                    {isRevealed ? "Hide" : "Reveal"}
                                  </button>
                                </div>

                                {!revealAllowed && examMode && (
                                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                                    Exam Mode: Reveal locked.
                                  </div>
                                )}

                                {isRevealed && (
                                  <div
                                    style={{
                                      marginTop: 10,
                                      padding: 12,
                                      borderRadius: 10,
                                      border: "1px solid rgba(34,197,94,0.5)",
                                      background: "rgba(34,197,94,0.10)",
                                      lineHeight: 1.5,
                                    }}
                                  >
                                    <div>
                                      <b>Answer:</b> ({q.answerId})
                                    </div>
                                    <div style={{ marginTop: 6 }}>{q.explanation}</div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 18, fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
          Content basis (quick refs): Tokyo Guidelines (acute cholangitis), ASGE 2019 choledocholithiasis risk stratification.
        </div>
      </main>
    </div>
  );
}
