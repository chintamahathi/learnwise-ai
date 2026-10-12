import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import {
  Upload,
  FileText,
  Plus,
  Trash2,
  Pencil,
  Check,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Lightbulb,
  Target,
  Play,
  CalendarPlus,
  Users,
  Radio,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { PageHeading, Tag, Progress } from "./shared";
import { useDemo } from "./app-shell";
import {
  createRecord as apiCreateRecord,
  deleteRecord as apiDeleteRecord,
  getResources,
  getQuestions,
  getPracticeSet,
  submitAttempt as apiSubmitAttempt,
  getAttempts,
  getTopicStats,
  getSubjectStats,
  getGaps,
  ApiError,
  type PerfRecord,
  type Question,
  type TopicStat,
  type Resource,
  type CreateRecordInput,
  type AttemptHistory,
  type PracticeSet,
} from "@/api";
import {
  parseCsv,
  sampleCsv,
  subjects as staticSubjectsRaw,
  topicsBySubject as staticTopicsBySubject,
} from "@/data/academics";

// Widen to string[] so form state (string) is assignable without casts.
const staticSubjects: readonly string[] = staticSubjectsRaw;
import { useAcademicsData } from "@/hooks/use-academics-data";
import { toast } from "sonner";

// ── Context ───────────────────────────────────────────────────────────────────

type Attempt = {
  id: number;
  subject: string;
  topic: string;
  score: number;
  total: number;
  date: string;
};

type Ctx = {
  records: PerfRecord[];
  stats: TopicStat[];
  /** Add a record via the backend and refresh context. */
  addRecord: (data: CreateRecordInput) => Promise<PerfRecord>;
  /** Delete a record via the backend and refresh context. */
  removeRecord: (id: number) => Promise<void>;
  attempts: Attempt[];
  addAttempt: (a: Attempt) => void;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  refresh: () => void;
};

const AcademicsContext = createContext<Ctx | null>(null);

export function useAcademics() {
  const c = useContext(AcademicsContext);
  if (!c) throw new Error("Academics context missing");
  return c;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AcademicsProvider({ children }: { children: ReactNode }) {
  const { records, stats, refresh } = useAcademicsData();
  const [attempts, setAttempts] = useState<Attempt[]>([
    { id: 1, subject: "DSA", topic: "Arrays", score: 2, total: 2, date: "2026-10-01" },
  ]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const addRecord = useCallback(
    async (data: CreateRecordInput): Promise<PerfRecord> => {
      const res = await apiCreateRecord(data);
      refresh();
      return res.data;
    },
    [refresh],
  );

  const removeRecord = useCallback(
    async (id: number): Promise<void> => {
      await apiDeleteRecord(id);
      refresh();
    },
    [refresh],
  );

  return (
    <AcademicsContext.Provider
      value={{
        records,
        stats,
        addRecord,
        removeRecord,
        attempts,
        addAttempt: (a) => setAttempts((x) => [a, ...x]),
        bookmarks,
        toggleBookmark: (id) =>
          setBookmarks((b) => (b.includes(id) ? b.filter((v) => v !== id) : [...b, id])),
        refresh,
      }}
    >
      {children}
    </AcademicsContext.Provider>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  "Performance data",
  "Learning gaps",
  "Materials",
  "Practice",
  "Progress",
  "Focus next",
] as const;
type TabName = (typeof TABS)[number];
const chartColors = {
  primary: "#7563A9",
  lavender: "#D8CCFA",
  coral: "#F3B4B8",
  mint: "#B9EBD9",
  peach: "#F9D9B7",
};
const statusColor = (s: string) => (s === "Weak" ? "amber" : s === "Revise" ? "cyan" : "emerald");

// ── Root component with loading / error gate ──────────────────────────────────

export function Academics() {
  const { loadState, refresh } = useAcademicsData();
  const [tab, setTab] = useState<TabName>("Focus next");
  const [practiceTopic, setPracticeTopic] = useState<{ subject: string; topic: string } | null>(
    null,
  );
  const startPractice = (subject: string, topic: string) => {
    setPracticeTopic({ subject, topic });
    setTab("Practice");
  };

  if (loadState.status === "loading")
    return (
      <>
        <PageHeading
          title="Performance Lab."
          description="Enter your marks, spot learning gaps, and practise exactly what needs work."
        >
          <Tag color="neutral">LOADING…</Tag>
        </PageHeading>
        <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading your academic data…</span>
        </div>
      </>
    );

  if (loadState.status === "error")
    return (
      <>
        <PageHeading
          title="Performance Lab."
          description="Enter your marks, spot learning gaps, and practise exactly what needs work."
        >
          <Tag color="neutral">OFFLINE</Tag>
        </PageHeading>
        <div className="panel p-8 max-w-md mx-auto mt-8 text-center">
          <AlertTriangle className="mx-auto text-amber-500 mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">Could not load academic data</h3>
          <p className="text-muted-foreground text-sm mb-5">{loadState.message}</p>
          <Button onClick={refresh}>
            <RefreshCw size={14} />
            Try again
          </Button>
        </div>
      </>
    );

  return (
    <>
      <PageHeading
        title="Performance Lab."
        description="Enter your marks, spot learning gaps, and practise exactly what needs work. Records saved to the backend."
      >
        <Tag color="neutral">LIVE DATA</Tag>
      </PageHeading>
      <div className="pill-tabs" role="tablist" aria-label="Performance Lab sections">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "chosen" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Performance data" && <DataEntry />}
      {tab === "Learning gaps" && <Gaps onPractice={startPractice} />}
      {tab === "Materials" && <Materials />}
      {tab === "Practice" && (
        <Practice
          key={practiceTopic ? practiceTopic.subject + practiceTopic.topic : "none"}
          initial={practiceTopic}
        />
      )}
      {tab === "Progress" && <ProgressView />}
      {tab === "Focus next" && <FocusNext onPractice={startPractice} />}
    </>
  );
}

// ── DataEntry ─────────────────────────────────────────────────────────────────

function DataEntry() {
  const { records, addRecord, removeRecord, stats } = useAcademics();

  // We need subjects/topics for the form — fetch from context stats or fall back to static list
  const { subjects, topicsBySubject } = useSubjectsLocal();

  const blank = {
    subject: subjects[0] ?? "DSA",
    topic: "",
    score: "",
    max: "20",
    date: new Date().toISOString().slice(0, 10),
    type: "Quiz",
    mistakes: "",
  };
  const [form, setForm] = useState({ ...blank, topic: topicsBySubject[blank.subject]?.[0] ?? "" });
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [csvState, setCsvState] = useState<{
    name: string;
    rows: PerfRecord[];
    errors: string[];
  } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const score = Number(form.score);
    const max = Number(form.max);
    if (form.score === "" || isNaN(score) || isNaN(max) || max <= 0) {
      setError("Enter a score and a maximum greater than 0.");
      return;
    }
    if (score < 0 || score > max) {
      setError(`Score must be between 0 and ${max}.`);
      return;
    }
    setError("");
    setSaving(true);

    const payload: CreateRecordInput = {
      subject: form.subject,
      topic: form.topic,
      score,
      max,
      date: form.date,
      type: form.type as PerfRecord["type"],
      mistakes: form.mistakes,
    };

    try {
      if (editing !== null) {
        // Backend has no PUT — delete old + create new to emulate edit
        await removeRecord(editing);
        await addRecord(payload);
        toast.success("Record updated");
      } else {
        await addRecord(payload);
        toast.success("Record added");
      }
      setEditing(null);
      setForm({ ...blank, topic: topicsBySubject[blank.subject]?.[0] ?? "" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save record.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await removeRecord(id);
      toast.success("Record deleted");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete record.";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setCsvState({ name: file.name, rows: [], errors: ["Please choose a .csv file."] });
      return;
    }
    file.text().then((t) => setCsvState({ name: file.name, ...parseCsv(t) }));
  };

  const importCsv = async (rows: PerfRecord[]) => {
    setSaving(true);
    try {
      for (const r of rows) {
        const { id: _id, ...rest } = r;
        await addRecord(rest);
      }
      toast.success(`Imported ${rows.length} records`);
      setCsvState(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Import failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const topics = topicsBySubject[form.subject] ?? [];

  // Keep topic in sync when subject changes
  const handleSubjectChange = (subject: string) => {
    const firstTopic = topicsBySubject[subject]?.[0] ?? "";
    setForm({ ...form, subject, topic: firstTopic });
  };

  return (
    <div className="lab-grid">
      <section className="panel p-5">
        <h3 className="lab-title">
          <Plus size={16} />
          {editing !== null ? "Edit record" : "Add marks"}
        </h3>
        <form className="form-stack" onSubmit={submit}>
          <div className="form-grid">
            <label>
              Subject
              <select value={form.subject} onChange={(e) => handleSubjectChange(e.target.value)}>
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Topic
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Score
              <input
                inputMode="decimal"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                placeholder="e.g. 14"
                aria-invalid={!!error}
              />
            </label>
            <label>
              Out of
              <input
                inputMode="decimal"
                value={form.max}
                onChange={(e) => setForm({ ...form, max: e.target.value })}
              />
            </label>
            <label>
              Type
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {["Quiz", "Exam", "Assignment", "Practice"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
          </div>
          <label>
            Mistakes noticed (optional)
            <input
              value={form.mistakes}
              onChange={(e) => setForm({ ...form, mistakes: e.target.value })}
              placeholder="e.g. Pointer updates"
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              <AlertTriangle size={14} />
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Check />}
              {editing !== null ? "Save changes" : "Add record"}
            </Button>
            {editing !== null && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setForm({ ...blank, topic: topicsBySubject[blank.subject]?.[0] ?? "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="panel p-5">
        <h3 className="lab-title">
          <Upload size={16} />
          Import a CSV
        </h3>
        <label
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files[0]);
          }}
        >
          <FileText />
          <strong>{csvState?.name ?? "Choose or drop a CSV file"}</strong>
          <small>Columns: subject, topic, score, max, date, type, mistakes</small>
          <input
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setCsvState({ name: "sample-marks.csv", ...parseCsv(sampleCsv) })}
        >
          Load sample CSV
        </Button>
        {csvState && (
          <div className="mt-4">
            {csvState.errors.map((e) => (
              <p key={e} className="form-error">
                <AlertTriangle size={14} />
                {e}
              </p>
            ))}
            {csvState.rows.length > 0 && (
              <>
                <p className="text-success text-xs mb-2">
                  <Check size={14} className="inline" /> {csvState.rows.length} valid rows ready
                </p>
                <Button size="sm" disabled={saving} onClick={() => importCsv(csvState.rows)}>
                  {saving ? <Loader2 className="animate-spin" size={14} /> : null}
                  Import records
                </Button>
              </>
            )}
          </div>
        )}
      </section>

      <section className="panel lab-span">
        <div className="panel-header">
          <h3>
            Your records <Tag color="neutral">{records.length}</Tag>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Type</th>
                <th>Score</th>
                <th>Mistakes</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...records]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((r) => {
                  const p = Math.round((r.score / r.max) * 100);
                  return (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>{r.subject}</td>
                      <td>{r.topic}</td>
                      <td>{r.type}</td>
                      <td>
                        <Tag color={p < 60 ? "amber" : p < 75 ? "cyan" : "emerald"}>
                          {r.score}/{r.max} · {p}%
                        </Tag>
                      </td>
                      <td className="text-muted-foreground">{r.mistakes || "—"}</td>
                      <td className="whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit record"
                          onClick={() => {
                            setEditing(r.id);
                            setForm({
                              subject: r.subject,
                              topic: r.topic,
                              score: String(r.score),
                              max: String(r.max),
                              date: r.date,
                              type: r.type,
                              mistakes: r.mistakes,
                            });
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete record"
                          disabled={deletingId === r.id}
                          onClick={() => onDelete(r.id)}
                        >
                          {deletingId === r.id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <Trash2 />
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ── Gaps ──────────────────────────────────────────────────────────────────────

function Gaps({ onPractice }: { onPractice: (s: string, t: string) => void }) {
  const { refresh } = useAcademics();

  // ── Fetch gaps with evidence from the dedicated endpoint ─────────────────
  const [gaps, setGaps] = useState<import("@/api").GapAnalysis[]>([]);
  const [gapsLoading, setGapsLoading] = useState(true);
  const [gapsError, setGapsError] = useState("");
  const [sel, setSel] = useState<import("@/api").GapAnalysis | null>(null);
  const [subj, setSubj] = useState<{ subject: string; pct: number; count: number }[]>([]);

  const fetchGaps = useCallback(() => {
    setGapsLoading(true);
    setGapsError("");
    Promise.all([getGaps(), getSubjectStats()])
      .then(([gapsRes, subjRes]) => {
        setGaps(gapsRes.data);
        setSubj(subjRes.data);
        // Keep selection valid after refresh
        setSel((prev) => {
          if (!prev) return gapsRes.data[0] ?? null;
          return (
            gapsRes.data.find((g) => g.subject === prev.subject && g.topic === prev.topic) ??
            gapsRes.data[0] ??
            null
          );
        });
        setGapsLoading(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof ApiError ? err.message : "Failed to load gap analysis.";
        setGapsError(msg);
        setGapsLoading(false);
      });
  }, []);

  // Re-fetch whenever the parent records change (refresh tick propagates via useAcademics)
  useEffect(() => {
    fetchGaps();
  }, [fetchGaps, refresh]);

  const current = sel ?? gaps[0] ?? null;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (gapsLoading)
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="animate-spin" size={20} />
        <span>Calculating learning gaps…</span>
      </div>
    );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (gapsError)
    return (
      <div className="panel p-8 max-w-md mx-auto mt-8 text-center">
        <AlertTriangle className="mx-auto text-amber-500 mb-3" size={32} />
        <h3 className="text-lg font-semibold mb-2">Gap analysis unavailable</h3>
        <p className="text-muted-foreground text-sm mb-5">{gapsError}</p>
        <Button onClick={fetchGaps}>
          <RefreshCw size={14} />
          Try again
        </Button>
      </div>
    );

  // ── Empty (no gaps — all topics Strong) ───────────────────────────────────
  if (!gaps.length)
    return (
      <div className="panel p-8 max-w-md mx-auto mt-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No gaps found</h3>
        <p className="text-muted-foreground text-sm">
          Every attempted topic is at 75% or above. Add more marks to track new topics.
        </p>
      </div>
    );

  return (
    <div className="lab-grid">
      {/* ── Subject bar chart ─────────────────────────────────────────────── */}
      <section className="panel p-5">
        <h3 className="lab-title">Subject performance</h3>
        <div className="chart-box">
          <ResponsiveContainer>
            <BarChart data={subj}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="pct" name="Average %" radius={[10, 10, 10, 10]}>
                {subj.map((s, i) => (
                  <Cell
                    key={s.subject}
                    fill={
                      [
                        chartColors.lavender,
                        chartColors.mint,
                        chartColors.peach,
                        chartColors.coral,
                      ][i % 4]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Gap map ───────────────────────────────────────────────────────── */}
      <section className="panel p-5">
        <h3 className="lab-title">Learning-gap map</h3>
        <p className="text-muted-foreground text-xs mb-3">
          Select a topic to see why it needs attention.
        </p>
        <div className="gap-map">
          {gaps.map((g) => (
            <button
              key={g.subject + g.topic}
              className={`gap-cell ${g.status.toLowerCase()} ${current === g ? "chosen" : ""}`}
              onClick={() => setSel(g)}
            >
              <strong>{g.topic}</strong>
              <small>
                {g.subject} · {g.pct}%
              </small>
            </button>
          ))}
        </div>
        <div className="legend mt-3">
          <span className="dot weak" />
          Weak &lt;60% <span className="dot revise" />
          Revise 60–74% <span className="dot strong" />
          Strong 75%+
        </div>
      </section>

      {/* ── Detail panel with evidence ────────────────────────────────────── */}
      {current && (
        <section className="panel p-5 lab-span">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Tag color={statusColor(current.status)}>{current.status.toUpperCase()}</Tag>
              <h3 className="text-xl mt-2">
                {current.topic}{" "}
                <span className="text-muted-foreground text-sm">· {current.subject}</span>
              </h3>
            </div>
            <Button onClick={() => onPractice(current.subject, current.topic)}>
              <Play />
              Practise this topic
            </Button>
          </div>

          {/* Summary stats */}
          <div className="form-grid mt-4">
            <div>
              <small className="text-muted-foreground">Mastery</small>
              <div className="text-2xl my-1">{current.pct}%</div>
              <Progress value={current.pct} />
            </div>
            <div>
              <small className="text-muted-foreground">
                Trend over {current.attempts} attempt{current.attempts !== 1 ? "s" : ""}
              </small>
              <div className="text-2xl my-1 flex items-center gap-2">
                {current.trend >= 0 ? (
                  <TrendingUp className="text-success" />
                ) : (
                  <TrendingDown className="text-destructive" />
                )}
                {current.trend > 0 ? "+" : ""}
                {current.trend}%
              </div>
            </div>
          </div>

          {/* Recurring mistakes */}
          <h4 className="mt-4 mb-2 text-sm">Recurring mistakes</h4>
          {current.mistakes.length ? (
            <ul className="flex flex-wrap gap-2">
              {current.mistakes.map((m) => (
                <li key={m}>
                  <Tag color="amber">{m}</Tag>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-xs">No mistakes noted.</p>
          )}

          {/* Evidence trail — the actual records behind the gap score */}
          <h4 className="mt-5 mb-2 text-sm flex items-center gap-2">
            Evidence
            <Tag color="neutral">
              {current.evidence.length} attempt{current.evidence.length !== 1 ? "s" : ""}
            </Tag>
            <span className="text-muted-foreground text-xs font-normal">
              · accuracy = mean(score ÷ max) per attempt
            </span>
          </h4>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Score</th>
                  <th>Out of</th>
                  <th>This attempt</th>
                  <th>Mistakes</th>
                </tr>
              </thead>
              <tbody>
                {current.evidence.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>{e.type}</td>
                    <td>{e.score}</td>
                    <td>{e.max}</td>
                    <td>
                      <Tag
                        color={e.attemptPct < 60 ? "amber" : e.attemptPct < 75 ? "cyan" : "emerald"}
                      >
                        {e.attemptPct}%
                      </Tag>
                    </td>
                    <td className="text-muted-foreground">{e.mistakes || "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-muted-foreground text-xs">
                    Average
                  </td>
                  <td>
                    <Tag color={statusColor(current.status)}>{current.pct}%</Tag>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

// ── ResourceCard ──────────────────────────────────────────────────────────────

function ResourceCard({ r }: { r: Resource }) {
  const { bookmarks, toggleBookmark } = useAcademics();
  const saved = bookmarks.includes(r.id);
  return (
    <article className="resource-card">
      <div className="flex justify-between items-start gap-2">
        <Tag color="neutral">{r.kind}</Tag>
        <Button
          variant="ghost"
          size="icon"
          aria-label={saved ? "Remove bookmark" : "Bookmark"}
          aria-pressed={saved}
          onClick={() => {
            toggleBookmark(r.id);
            toast(saved ? "Bookmark removed" : "Saved to bookmarks");
          }}
        >
          {saved ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
        </Button>
      </div>
      <h4>{r.title}</h4>
      <p>{r.description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>
          {r.subject} · {r.topic}
        </span>
        <span>·</span>
        <span>{r.difficulty}</span>
        <span>·</span>
        <span>{r.minutes} min</span>
      </div>
      <a href={r.url} target="_blank" rel="noreferrer" className="panel-link mt-3">
        Open resource
        <ExternalLink size={12} />
      </a>
    </article>
  );
}

// ── Materials ─────────────────────────────────────────────────────────────────

function Materials() {
  const { stats, bookmarks } = useAcademics();
  const { subjects } = useSubjectsLocal();
  const [subject, setSubject] = useState("All");
  const [kind, setKind] = useState("All");
  const [diff, setDiff] = useState("All");
  const [onlyGaps, setOnlyGaps] = useState(true);
  const [onlySaved, setOnlySaved] = useState(false);

  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [resError, setResError] = useState("");

  // Fetch resources from backend whenever subject filter changes
  useEffect(() => {
    setResLoading(true);
    setResError("");
    getResources(subject !== "All" ? { subject } : undefined)
      .then((r) => {
        setAllResources(r.data);
        setResLoading(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof ApiError ? err.message : "Failed to load resources.";
        setResError(msg);
        setResLoading(false);
      });
  }, [subject]);

  const weak = new Set(stats.filter((s) => s.status !== "Strong").map((s) => s.topic));
  const list = allResources.filter(
    (r) =>
      (kind === "All" || r.kind === kind) &&
      (diff === "All" || r.difficulty === diff) &&
      (!onlyGaps || weak.has(r.topic)) &&
      (!onlySaved || bookmarks.includes(r.id)),
  );

  return (
    <>
      <div className="filter-row">
        <select aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option>All</option>
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value)}>
          {["All", "Video", "Notes", "Docs", "Tutorial", "Practice"].map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select aria-label="Difficulty" value={diff} onChange={(e) => setDiff(e.target.value)}>
          {["All", "Easy", "Medium", "Hard"].map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyGaps}
            onChange={(e) => setOnlyGaps(e.target.checked)}
          />
          For my gaps
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlySaved}
            onChange={(e) => setOnlySaved(e.target.checked)}
          />
          Bookmarked ({bookmarks.length})
        </label>
      </div>

      {resLoading && (
        <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
          <Loader2 className="animate-spin" size={18} />
          <span>Loading resources…</span>
        </div>
      )}
      {!resLoading && resError && (
        <p className="empty-state">
          <AlertTriangle size={14} className="inline mr-2" />
          {resError}
        </p>
      )}
      {!resLoading &&
        !resError &&
        (list.length ? (
          <div className="item-grid">
            {list.map((r) => (
              <ResourceCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No materials match these filters.</p>
        ))}
    </>
  );
}

// ── Practice ──────────────────────────────────────────────────────────────────

function Practice({ initial }: { initial: { subject: string; topic: string } | null }) {
  const { addRecord, addAttempt, stats } = useAcademics();
  const { addPlanTask } = useDemo();
  const { subjects, topicsBySubject } = useSubjectsLocal();

  // ── Mode toggle: personalized vs manual ──────────────────────────────────
  const [mode, setMode] = useState<"personalized" | "manual">(initial ? "manual" : "personalized");

  // Manual controls
  const [subject, setSubject] = useState(initial?.subject ?? subjects[0] ?? "DSA");
  const [topic, setTopic] = useState(initial?.topic ?? "Any");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [count, setCount] = useState(3);

  // Practice session state
  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);
  const [qs, setQs] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hints, setHints] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Attempt history from backend
  const [attemptHistory, setAttemptHistory] = useState<AttemptHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load attempt history on mount
  useEffect(() => {
    getAttempts()
      .then((r) => {
        setAttemptHistory(r.data);
        setHistoryLoading(false);
      })
      .catch(() => setHistoryLoading(false));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      let res: { data: PracticeSet };
      if (mode === "personalized") {
        res = await getPracticeSet({ mode: "personalized", count });
      } else {
        res = await getPracticeSet({ mode: "manual", subject, topic, difficulty, count });
      }

      if (!res.data.questions.length) {
        toast.error("No questions available for this topic yet");
        return;
      }
      setPracticeSet(res.data);
      setQs(res.data.questions);
      setAnswers({});
      setHints([]);
      setDone(false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load questions.";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  const score = qs ? qs.filter((q) => answers[q.id] === q.answer).length : 0;

  const submit = async () => {
    if (!qs || !practiceSet) return;
    setSubmitting(true);
    setDone(true);

    const today = new Date().toISOString().slice(0, 10);

    // Aggregate answers by topic
    const byTopic = new Map<
      string,
      { s: number; t: number; subject: string; mistakes: string[] }
    >();
    qs.forEach((q) => {
      const k = q.topic;
      const v = byTopic.get(k) ?? { s: 0, t: 0, subject: q.subject, mistakes: [] };
      v.t++;
      if (answers[q.id] === q.answer) {
        v.s++;
      } else {
        v.mistakes.push(q.q.slice(0, 60));
      }
      byTopic.set(k, v);
    });

    const results = [...byTopic.entries()].map(([t, v]) => ({
      subject: v.subject,
      topic: t,
      score: v.s,
      total: v.t,
      mistakes: v.mistakes.length ? v.mistakes[0]! : "",
    }));

    try {
      // Use the dedicated attempts endpoint — persists to backend and returns summary
      const att = await apiSubmitAttempt({ results, date: today });

      // Also add a legacy context attempt for ProgressView compatibility
      addAttempt({
        id: Date.now(),
        subject: practiceSet.subject,
        topic: practiceSet.topic,
        score: results.reduce((a, r) => a + r.score, 0),
        total: results.reduce((a, r) => a + r.total, 0),
        date: today,
      });

      // Refresh attempt history panel
      setAttemptHistory((prev) => [
        {
          sessionId: att.data.sessionId,
          subject: att.data.subject,
          topic: att.data.topic,
          score: att.data.score,
          total: att.data.total,
          date: att.data.date,
          pct: Math.round((att.data.score / att.data.total) * 100),
        },
        ...prev,
      ]);

      // Trigger records refresh so gaps + stats update
      for (const r of results) {
        await addRecord({
          subject: r.subject,
          topic: r.topic,
          score: r.score,
          max: r.total,
          date: today,
          type: "Practice",
          mistakes: r.mistakes ?? "",
        });
      }

      toast.success("Practice saved — gaps and recommendations updated");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to save practice result.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const weakest = stats[0];

  return (
    <div className="lab-grid">
      {/* ── Left panel: configuration ─────────────────────────────────── */}
      <section className="panel p-5">
        <h3 className="lab-title">
          <Target size={16} />
          Build a practice set
        </h3>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={mode === "personalized" ? "default" : "outline"}
            onClick={() => setMode("personalized")}
          >
            Personalized
          </Button>
          <Button
            size="sm"
            variant={mode === "manual" ? "default" : "outline"}
            onClick={() => setMode("manual")}
          >
            Manual
          </Button>
        </div>

        {mode === "personalized" ? (
          <div className="form-stack">
            <p className="text-xs text-muted-foreground">
              The backend picks your weakest gap topic and adjusts difficulty to your accuracy — no
              manual selection needed.
            </p>
            <label>
              Number of questions: {count}
              <input
                type="range"
                min={1}
                max={5}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
            <Button onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="animate-spin" size={14} /> : <Play />}
              Start personalized session
            </Button>
            {weakest && (
              <p className="text-xs text-muted-foreground">
                Current weakest topic: <strong>{weakest.topic}</strong> ({weakest.pct}%)
              </p>
            )}
          </div>
        ) : (
          <div className="form-stack">
            <label>
              Subject
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setTopic("Any");
                }}
              >
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              Topic
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option>Any</option>
                {(topicsBySubject[subject] ?? []).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Difficulty
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {["Mixed", "Easy", "Medium", "Hard"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label>
              Number of questions: {count}
              <input
                type="range"
                min={1}
                max={5}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
            <Button onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="animate-spin" size={14} /> : <Play />}
              Generate questions
            </Button>
            {weakest && (
              <Button
                variant="outline"
                onClick={() => {
                  setMode("manual");
                  setSubject(weakest.subject);
                  setTopic(weakest.topic);
                }}
              >
                Use my weakest topic: {weakest.topic}
              </Button>
            )}
          </div>
        )}

        {/* Attempt history from backend */}
        {!historyLoading && attemptHistory.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs text-muted-foreground mb-2">Recent sessions</h4>
            <div className="flex flex-col gap-1">
              {attemptHistory.slice(0, 5).map((a) => (
                <div key={a.sessionId} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {a.date} · {a.topic}
                  </span>
                  <Tag color={a.pct < 60 ? "amber" : a.pct < 75 ? "cyan" : "emerald"}>
                    {a.score}/{a.total} · {a.pct}%
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Right panel: questions + result ──────────────────────────────── */}
      <section className="panel p-5">
        {/* Personalized reason banner */}
        {practiceSet?.mode === "personalized" && practiceSet.reason && !done && (
          <div className="mb-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
            <strong>Why this set:</strong> {practiceSet.reason.rationale}
          </div>
        )}

        {!qs ? (
          <p className="empty-state">
            {mode === "personalized"
              ? 'Click "Start personalized session" — the backend selects your highest-priority gap topic.'
              : "Choose your settings and generate a practice set. Questions come from the backend question bank."}
          </p>
        ) : (
          <div className="form-stack">
            {qs.map((q, i) => (
              <div key={q.id} className="question-card">
                <div className="flex justify-between gap-2 mb-2">
                  <small className="text-muted-foreground">
                    Q{i + 1} · {q.topic} · {q.difficulty}
                  </small>
                  {!done && (
                    <button className="panel-link" onClick={() => setHints((h) => [...h, q.id])}>
                      <Lightbulb size={12} />
                      Hint
                    </button>
                  )}
                </div>
                <p className="mb-3">{q.q}</p>
                <div className="grid gap-2">
                  {q.options.map((o, oi) => {
                    const chosen = answers[q.id] === oi;
                    const cls = done
                      ? oi === q.answer
                        ? "correct"
                        : chosen
                          ? "wrong"
                          : ""
                      : chosen
                        ? "chosen"
                        : "";
                    return (
                      <button
                        key={o}
                        disabled={done}
                        className={`option-btn ${cls}`}
                        aria-pressed={chosen}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                {hints.includes(q.id) && !done && (
                  <p className="hint">
                    <Lightbulb size={12} />
                    {q.hint}
                  </p>
                )}
                {done && <p className="hint">{q.explanation}</p>}
              </div>
            ))}

            {!done ? (
              <Button
                disabled={Object.keys(answers).length < qs.length || submitting}
                onClick={submit}
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : null}
                Submit answers ({Object.keys(answers).length}/{qs.length})
              </Button>
            ) : (
              <div className="result-card">
                <div className="text-3xl">
                  {score}/{qs.length}
                </div>
                <p>
                  {score === qs.length
                    ? "Excellent — this topic is getting stronger."
                    : "Keep going — your plan now focuses on what you missed."}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button size="sm" onClick={generate}>
                    Try another set
                  </Button>
                  {mode === "personalized" && (
                    <Button size="sm" variant="outline" onClick={generate}>
                      Next gap topic
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      addPlanTask(
                        `Revise ${topic === "Any" ? subject : topic} — practice set`,
                        subject === "DSA" ? "DSA & Coding" : "GATE 2027",
                        30,
                      );
                      toast.success("Added to your planner");
                    }}
                  >
                    <CalendarPlus />
                    Add revision to planner
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ── ProgressView ──────────────────────────────────────────────────────────────

function ProgressView() {
  const { records, attempts, stats } = useAcademics();
  const [subj, setSubj] = useState<{ subject: string; pct: number; count: number }[]>([]);

  useEffect(() => {
    getSubjectStats()
      .then((r) => setSubj(r.data))
      .catch(() => {
        /* non-critical */
      });
  }, [records]);

  const weekly = (() => {
    const m = new Map<string, number[]>();
    records.forEach((r) => {
      const d = new Date(r.date);
      const wk = `${d.toLocaleString("en", { month: "short" })} W${Math.ceil(d.getDate() / 7)}`;
      m.set(wk, [...(m.get(wk) ?? []), (r.score / r.max) * 100]);
    });
    return [...records]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => {
        const d = new Date(r.date);
        return `${d.toLocaleString("en", { month: "short" })} W${Math.ceil(d.getDate() / 7)}`;
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((w) => ({
        week: w,
        avg: Math.round(m.get(w)!.reduce((a, b) => a + b, 0) / m.get(w)!.length),
        count: m.get(w)!.length,
      }));
  })();

  const overall = records.length
    ? Math.round((records.reduce((a, r) => a + r.score / r.max, 0) / records.length) * 100)
    : 0;
  const strong = stats.filter((s) => s.status === "Strong").length;
  const quizAvg = (() => {
    const q = records.filter((r) => r.type === "Quiz");
    return q.length ? Math.round((q.reduce((a, r) => a + r.score / r.max, 0) / q.length) * 100) : 0;
  })();
  const change = weekly.length > 1 ? weekly[weekly.length - 1]!.avg - weekly[0]!.avg : 0;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">Overall score</div>
          <div className="stat-value">
            {overall}
            <small>%</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-top">Quiz average</div>
          <div className="stat-value">
            {quizAvg}
            <small>%</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-top">Assessments done</div>
          <div className="stat-value">{records.length}</div>
          <div className="stat-bottom">{attempts.length} practice sets</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">Topics mastered</div>
          <div className="stat-value">
            {strong}
            <small>/ {stats.length}</small>
          </div>
          <div className="stat-bottom">
            {change >= 0 ? "+" : ""}
            {change}% since first week
          </div>
        </div>
      </div>
      <div className="lab-grid">
        <section className="panel p-5">
          <h3 className="lab-title">Improvement trend</h3>
          <div className="chart-box">
            <ResponsiveContainer>
              <LineChart data={weekly}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  dataKey="avg"
                  name="Weekly average %"
                  stroke={chartColors.primary}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5">
          <h3 className="lab-title">Subject mastery</h3>
          <div className="form-stack">
            {subj.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{s.subject}</span>
                  <span>{s.pct}%</span>
                </div>
                <Progress value={s.pct} />
              </div>
            ))}
          </div>
          <h4 className="text-sm mt-5 mb-2">Topic progress</h4>
          <div className="flex flex-wrap gap-2">
            {stats.map((s) => (
              <Tag key={s.subject + s.topic} color={statusColor(s.status)}>
                {s.topic} {s.pct}%
              </Tag>
            ))}
          </div>
        </section>
        <section className="panel lab-span">
          <div className="panel-header">
            <h3>Weekly summary &amp; assessment history</h3>
            <Link to="/reports" className="panel-link">
              Progress Reports
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Assessments</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {[...weekly].reverse().map((w) => (
                  <tr key={w.week}>
                    <td>{w.week}</td>
                    <td>{w.count}</td>
                    <td>{w.avg}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {attempts.length > 0 && (
            <div className="p-5">
              <h4 className="text-sm mb-2">Practice sets</h4>
              <div className="flex flex-wrap gap-2">
                {attempts.map((a) => (
                  <Tag key={a.id} color="neutral">
                    {a.date} · {a.topic === "Any" ? a.subject : a.topic} · {a.score}/{a.total}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

// ── FocusNext ─────────────────────────────────────────────────────────────────

export function FocusNext({
  onPractice,
  compact = false,
}: {
  onPractice?: (s: string, t: string) => void;
  compact?: boolean;
}) {
  const { stats } = useAcademics();
  const { addPlanTask } = useDemo();
  const [resources, setResources] = useState<Resource[]>([]);

  // Fetch all resources once so FocusNext can suggest materials per topic
  useEffect(() => {
    getResources()
      .then((r) => setResources(r.data))
      .catch(() => {
        /* non-critical */
      });
  }, []);

  const focus = stats.filter((s) => s.status !== "Strong").slice(0, compact ? 2 : 4);

  if (!focus.length)
    return (
      <p className="empty-state">Every topic is strong right now. Add new marks to keep growing.</p>
    );

  return (
    <div className="focus-grid">
      {focus.map((s, i) => {
        const mats = resources.filter((r) => r.topic === s.topic).slice(0, 2);
        const priority = s.pct < 50 ? "High" : s.pct < 65 ? "Medium" : "Low";
        return (
          <article key={s.subject + s.topic} className="focus-card">
            <div className="flex justify-between items-start gap-2">
              <Tag
                color={priority === "High" ? "amber" : priority === "Medium" ? "cyan" : "emerald"}
              >
                {priority.toUpperCase()} PRIORITY
              </Tag>
              {i === 0 && <Tag>NEXT UP</Tag>}
            </div>
            <h3>{s.topic}</h3>
            <small className="text-muted-foreground">
              {s.subject} · {s.pct}% mastery · {s.attempts} attempts
            </small>
            <p className="mt-2">
              {s.pct < 60 ? `Below 60% on average` : `Between 60–74% — worth revising`}
              {s.trend < 0
                ? `, and scores dropped ${Math.abs(s.trend)}%`
                : s.trend > 0
                  ? `, improving by ${s.trend}%`
                  : ""}
              .{s.mistakes[0] ? ` Common mistake: ${s.mistakes[0]!.toLowerCase()}.` : ""}
            </p>
            {!compact && (
              <>
                <h4 className="text-xs mt-3 mb-1">Suggested materials</h4>
                <ul className="text-xs space-y-1">
                  {mats.map((m) => (
                    <li key={m.id}>
                      <a className="panel-link" href={m.url} target="_blank" rel="noreferrer">
                        {m.kind}: {m.title}
                      </a>
                    </li>
                  ))}
                  {!mats.length && <li className="text-muted-foreground">No materials yet</li>}
                </ul>
              </>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {onPractice ? (
                <Button size="sm" onClick={() => onPractice(s.subject, s.topic)}>
                  <Play />
                  Start practising
                </Button>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/academics">Open Performance Lab</Link>
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  addPlanTask(
                    `Practise ${s.topic} (${s.subject})`,
                    s.subject === "DSA" ? "DSA & Coding" : "GATE 2027",
                    45,
                  );
                  toast.success("Added to your planner");
                }}
              >
                <CalendarPlus />
                Add to planner
              </Button>
            </div>
            {!compact && (
              <div className="flex gap-3 mt-3 text-xs">
                <Link to="/rooms" className="panel-link">
                  <Radio size={12} />
                  Find a study room
                </Link>
                <Link to="/campus" className="panel-link">
                  <Users size={12} />
                  Find a study partner
                </Link>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

// ── Local helper: subjects + topicsBySubject (static fallback) ────────────────
// The backend subjects are fetched by the Subjects page; here we use the
// static data as a guaranteed-available fallback for form controls only.

function useSubjectsLocal() {
  return { subjects: staticSubjects, topicsBySubject: staticTopicsBySubject };
}
