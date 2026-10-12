import { FocusNext } from "./academics";
import { useState } from "react";
import {
  BookOpen,
  Code2,
  Network,
  Cpu,
  Play,
  Plus,
  Sparkles,
  Download,
  ArrowRight,
  Check,
  Target,
  Clock,
  CalendarDays,
  Upload,
  RotateCcw,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeading, Modal, Tag, Progress, PanelHeader, Ring } from "./shared";
import { goals, downloadText } from "@/data/demo";
import { useDemo } from "./app-shell";
import { toast } from "sonner";
const subjects = [
  {
    title: "Data Structures & Algorithms",
    icon: Code2,
    value: 78,
    color: "cyan",
    topics: 24,
    focus: "Linked lists",
  },
  {
    title: "Operating Systems",
    icon: Cpu,
    value: 62,
    color: "",
    topics: 18,
    focus: "Process scheduling",
  },
  {
    title: "Computer Networks",
    icon: Network,
    value: 45,
    color: "amber",
    topics: 21,
    focus: "TCP & congestion control",
  },
  {
    title: "Database Management",
    icon: BookOpen,
    value: 84,
    color: "emerald",
    topics: 16,
    focus: "Normalization",
  },
  {
    title: "Engineering Mathematics",
    icon: Target,
    value: 68,
    color: "",
    topics: 28,
    focus: "Probability",
  },
  {
    title: "Theory of Computation",
    icon: Network,
    value: 52,
    color: "cyan",
    topics: 17,
    focus: "Finite automata",
  },
];
export function Learning() {
  const [filter, setFilter] = useState("All subjects");
  const [detail, setDetail] = useState<(typeof subjects)[number] | null>(null);
  const [quiz, setQuiz] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [query, setQuery] = useState("");
  const [upload, setUpload] = useState(false);
  return (
    <>
      <PageHeading
        title="Your learning, connected."
        description="Understand where you are. Discover what comes next."
      >
        <Button variant="outline" onClick={() => setUpload(true)}>
          <Upload />
          Import assessment
        </Button>
      </PageHeading>
      <section className="panel p-5 mb-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="lab-title m-0">Topics to improve</h3>
          <Link to="/academics" className="panel-link">
            Open Performance Lab
          </Link>
        </div>
        <FocusNext compact />
      </section>
      <div className="workspace-toolbar">
        <input
          aria-label="Search subjects"
          placeholder="Search subjects or topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="segmented">
          {["All subjects", "Needs attention", "Strong mastery"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant="ghost"
              className={filter === f ? "selected" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
      <div className="item-grid">
        {subjects
          .filter(
            (s) =>
              s.title.toLowerCase().includes(query.toLowerCase()) &&
              (filter === "All subjects" ||
                (filter === "Needs attention" ? s.value < 65 : s.value >= 75)),
          )
          .map((s) => (
            <section className="panel feature-card" key={s.title}>
              <div className="feature-card-top">
                <span className={`icon-tile ${s.color}`}>
                  <s.icon />
                </span>
                <Tag color={s.value < 65 ? "amber" : "emerald"}>
                  {s.value < 65 ? "Needs attention" : "Developing mastery"}
                </Tag>
              </div>
              <h3>{s.title}</h3>
              <p>{s.topics} topics · GATE & academic preparation</p>
              <div className="card-detail">
                <span>Topic mastery</span>
                <strong>{s.value}%</strong>
              </div>
              <Progress value={s.value} color={s.color} />
              <p className="mt-4">Next up: {s.focus}</p>
              <div className="card-actions">
                <Button variant="outline" size="sm" onClick={() => setDetail(s)}>
                  Explore topics
                  <ArrowRight />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Practice ${s.title}`}
                  onClick={() => {
                    setDetail(s);
                    setQuiz(true);
                    setAnswer(null);
                    setSubmitted(false);
                  }}
                >
                  <Play />
                </Button>
              </div>
            </section>
          ))}
      </div>
      {detail && (
        <Modal
          title={quiz ? "Practice: Linked lists" : detail.title}
          onClose={() => {
            setDetail(null);
            setQuiz(false);
          }}
        >
          {quiz ? (
            <>
              <Tag color="cyan">QUESTION 1 OF 1 · DEMO</Tag>
              <h3 className="text-lg my-5">
                What is the time complexity of inserting a node at the beginning of a singly linked
                list?
              </h3>
              {["O(n)", "O(1)", "O(log n)", "O(n²)"].map((a, i) => (
                <Button
                  variant="outline"
                  className={`quiz-option ${answer === i ? "tab-active" : ""}`}
                  key={a}
                  onClick={() => !submitted && setAnswer(i)}
                >
                  {String.fromCharCode(65 + i)}. {a}
                  {submitted && i === 1 && <Check className="text-success ml-auto" />}
                </Button>
              ))}
              {submitted ? (
                <div className="mt-5">
                  <Tag color={answer === 1 ? "emerald" : "amber"}>
                    {answer === 1 ? "Correct!" : "Let’s review"}
                  </Tag>
                  <p>
                    You only update the new node’s next pointer and the head pointer. This is a
                    constant number of operations, so insertion takes O(1) time.
                  </p>
                  <Button
                    onClick={() => {
                      setQuiz(false);
                      setSubmitted(false);
                    }}
                  >
                    Back to topics
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full mt-5"
                  disabled={answer === null}
                  onClick={() => setSubmitted(true)}
                >
                  Check my answer
                  <ArrowRight />
                </Button>
              )}
            </>
          ) : (
            <>
              <Tag color={detail.color}>{detail.value}% MASTERY</Tag>
              <p>
                Your next step is {detail.focus}. Work through prerequisites, then test your
                understanding.
              </p>
              <div className="mastery-list px-0">
                {["Fundamentals", "Core concepts", detail.focus, "Advanced applications"].map(
                  (t, i) => (
                    <div className="mastery-item" key={t}>
                      <div>
                        <span>{t}</span>
                        <span>{[94, 76, 58, 35][i]}%</span>
                      </div>
                      <Progress value={[94, 76, 58, 35][i] ?? 0} color={detail.color} />
                    </div>
                  ),
                )}
              </div>
              <Button
                onClick={() => {
                  setQuiz(true);
                  setAnswer(null);
                  setSubmitted(false);
                }}
              >
                <Play />
                Start practice
              </Button>
            </>
          )}
        </Modal>
      )}
      {upload && (
        <Modal title="Import an assessment" onClose={() => setUpload(false)}>
          <p>Preview assessment file details in this demo. No files are uploaded to a server.</p>
          <input
            aria-label="Choose assessment CSV"
            type="file"
            accept=".csv"
            className="w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file)
                toast.success(`Selected ${file.name} · ${(file.size / 1024).toFixed(1)} KB`);
            }}
          />
          <Button className="w-full mt-5" onClick={() => setUpload(false)}>
            Done
          </Button>
        </Modal>
      )}
    </>
  );
}
export function Planner() {
  const { tasks, toggleTask, openAdd, openFocus } = useDemo();
  const [view, setView] = useState("Week");
  const [generate, setGenerate] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [hours, setHours] = useState(3);
  const [period, setPeriod] = useState("Evening");
  const [accepted, setAccepted] = useState(false);
  const [filter, setFilter] = useState("All tasks");
  const [query, setQuery] = useState("");
  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All tasks" || (filter === "Completed" ? t.done : !t.done)),
  );
  return (
    <>
      <PageHeading
        title="Make room for what matters."
        description="A clear plan. A focused mind. A week that moves you forward."
      >
        <Button
          variant="outline"
          onClick={() => {
            setGenerate(true);
            setGenerated(false);
          }}
        >
          <Sparkles />
          Build timetable
        </Button>
        <Button className="primary-button" onClick={openAdd}>
          <Plus />
          Add task
        </Button>
      </PageHeading>
      <div className="workspace-toolbar">
        <div className="segmented">
          {["Day", "Week", "Month", "Agenda"].map((v) => (
            <Button
              key={v}
              size="sm"
              variant="ghost"
              className={v === view ? "selected" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
        <span className="ml-auto text-muted-foreground text-xs">October 12 – 18, 2026</span>
        <Button
          variant="outline"
          size="icon"
          aria-label="Export calendar"
          onClick={() => {
            downloadText(
              "elevateos-calendar.ics",
              "BEGIN:VCALENDAR\nVERSION:2.0\n" +
                tasks
                  .filter((t) => !t.done)
                  .map(
                    (t, i) =>
                      `BEGIN:VEVENT\nUID:${t.id}@elevateos.demo\nDTSTART:202610${String(12 + i).padStart(2, "0")}T180000\nSUMMARY:${t.title}\nEND:VEVENT`,
                  )
                  .join("\n") +
                "\nEND:VCALENDAR",
              "text/calendar",
            );
            toast.success("Demo calendar exported");
          }}
        >
          <Download />
        </Button>
      </div>
      {accepted && (
        <div className="task-footer mb-5 rounded-lg">
          <Check />
          Your sample {hours}-hour {period.toLowerCase()} timetable is active for this demo.
        </div>
      )}
      {view === "Week" || view === "Day" ? (
        <section className="panel mb-5">
          <div className="calendar-grid">
            <div />
            <>
              {["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16"].map((d) => (
                <div className="calendar-day" key={d}>
                  {d}
                </div>
              ))}
            </>
            {[9, 14, 18].map((hour, row) => (
              <CalendarRow key={hour} hour={hour} row={row} tasks={tasks} onFocus={openFocus} />
            ))}
          </div>
        </section>
      ) : view === "Month" ? (
        <section className="panel p-5 mb-5">
          <div className="grid grid-cols-7 gap-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div className="calendar-day" key={i}>
                {d}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div className="calendar-cell" key={i}>
                <span className="text-muted-foreground text-xs">
                  {i > 2 && i < 34 ? i - 2 : ""}
                </span>
                {i === 14 && <Tag>Today</Tag>}
                {i >= 14 && i <= 17 && (
                  <p className="text-primary text-[9px] mt-2">
                    {tasks[(i - 14) % tasks.length]?.goal}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="panel">
        <PanelHeader
          title="Your tasks"
          action={
            <div className="flex gap-2">
              <input
                className="text-xs py-1.5 w-40"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                aria-label="Task status filter"
                className="text-xs py-1.5"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All tasks</option>
                <option>To do</option>
                <option>Completed</option>
              </select>
            </div>
          }
        />
        <div className="task-list">
          {filtered.map((t) => (
            <div className={`task-row ${t.done ? "task-completed" : ""}`} key={t.id}>
              <input
                type="checkbox"
                checked={t.done}
                aria-label={`Complete ${t.title}`}
                onChange={() => toggleTask(t.id)}
              />
              <div className="task-copy">
                <strong>{t.title}</strong>
                <div className="task-meta">
                  <Tag color={t.color}>{t.goal}</Tag>
                  <Clock />
                  {t.duration} min
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => openFocus(t.title)}>
                <Play />
                Focus
              </Button>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state">No tasks match this filter.</div>}
        </div>
      </section>
      {generate && (
        <Modal title="Build your study timetable" onClose={() => setGenerate(false)}>
          {!generated ? (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                setGenerated(true);
              }}
            >
              <Tag>SIMULATED PLANNER</Tag>
              <label>
                Daily study hours
                <input
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </label>
              <label>
                Preferred time
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </label>
              <label>
                Focus goals
                <select>
                  <option>GATE preparation & DSA</option>
                  <option>Projects & placements</option>
                  <option>College examinations</option>
                </select>
              </label>
              <Button type="submit">
                <Sparkles />
                Preview timetable
              </Button>
            </form>
          ) : (
            <>
              <Tag color="emerald">YOUR SAMPLE TIMETABLE</Tag>
              <p>
                {hours} hours each {period.toLowerCase()}, split into purposeful study blocks.
              </p>
              {["DSA practice", "GATE revision", "Project building"].map((t, i) => (
                <div className="resource-row px-0" key={t}>
                  <Clock className="text-primary" />
                  <div>
                    <h3>{t}</h3>
                    <p>
                      {Math.round((hours * 60) / 3)} minutes · Block {i + 1}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 mt-5">
                <Button variant="outline" onClick={() => setGenerated(false)}>
                  <RotateCcw />
                  Adjust
                </Button>
                <Button
                  onClick={() => {
                    setAccepted(true);
                    setGenerate(false);
                    toast.success("Sample timetable added to this demo");
                  }}
                >
                  <Check />
                  Accept schedule
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
function CalendarRow({
  hour,
  row,
  tasks,
  onFocus,
}: {
  hour: number;
  row: number;
  tasks: ReturnType<typeof useDemo>["tasks"];
  onFocus: (s: string) => void;
}) {
  return (
    <>
      <div className="calendar-time">
        {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? "PM" : "AM"}
      </div>
      {[0, 1, 2, 3, 4].map((d) => (
        <div className="calendar-cell" key={d}>
          {(d + row) % 3 !== 2 && (
            <Button
              variant="ghost"
              className="calendar-block w-full h-auto whitespace-normal justify-start text-left"
              onClick={() => onFocus(tasks[(d + row) % tasks.length]?.title || "Study session")}
            >
              <div>
                {tasks[(d + row) % tasks.length]?.title}
                <p>{tasks[(d + row) % tasks.length]?.duration} min · Focus session</p>
              </div>
            </Button>
          )}
        </div>
      ))}
    </>
  );
}
export function Goals() {
  const [custom, setCustom] = useState<
    { title: string; subtitle: string; progress: number; color: string }[]
  >([]);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  return (
    <>
      <PageHeading
        title="Ambition, with a direction."
        description="Big dreams become real with small, intentional steps."
      >
        <Button onClick={() => setModal(true)}>
          <Plus />
          New goal
        </Button>
      </PageHeading>
      <div className="item-grid">
        {[...goals, ...custom].map((g) => (
          <section className="panel feature-card" key={g.title}>
            <div className="feature-card-top">
              <Ring value={g.progress} color={g.color} />
              <Tag color={g.color}>IN PROGRESS</Tag>
            </div>
            <h3>{g.title}</h3>
            <p>{g.subtitle}</p>
            <div className="card-detail">
              <span>Overall progress</span>
              <strong>{g.progress}%</strong>
            </div>
            <Progress value={g.progress} color={g.color} />
            <div className="card-actions">
              <Button variant="outline" size="sm" asChild>
                <Link to="/planner">
                  Plan next milestone
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </section>
        ))}
      </div>
      {modal && (
        <Modal title="Set your next goal" onClose={() => setModal(false)}>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setCustom((c) => [
                ...c,
                { title, subtitle: "Your new growth journey", progress: 0, color: "cyan" },
              ]);
              setTitle("");
              setModal(false);
              toast.success("Goal created in this demo");
            }}
          >
            <label>
              Goal title
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to achieve?"
              />
            </label>
            <label>
              Target date
              <input type="date" required />
            </label>
            <Button type="submit">
              <Target />
              Create goal
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
