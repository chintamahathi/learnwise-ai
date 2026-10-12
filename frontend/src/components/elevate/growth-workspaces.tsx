import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  FolderKanban,
  Code2,
  ArrowRight,
  Check,
  Download,
  Upload,
  FileText,
  BookOpen,
  Bookmark,
  Search,
  BriefcaseBusiness,
  Sparkles,
  Send,
  Target,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, PanelHeader, Progress, Modal, Tag, Ring } from "./shared";
import { ProductivityChart } from "./overview";
import { downloadText, goals } from "@/data/demo";
import { useDemo } from "./app-shell";
import { toast } from "sonner";
const projectSeeds = [
  {
    name: "CampusFlow",
    description: "A smarter way to navigate campus life.",
    stack: ["React", "Node.js", "MongoDB"],
    progress: 68,
    color: "cyan",
    members: 4,
  },
  {
    name: "StudyBuddy AI",
    description: "An intelligent revision companion for students.",
    stack: ["Python", "React", "AI/ML"],
    progress: 42,
    color: "",
    members: 3,
  },
  {
    name: "Personal Portfolio",
    description: "Your work. Your story. Your next opportunity.",
    stack: ["React", "Tailwind", "Vite"],
    progress: 85,
    color: "emerald",
    members: 1,
  },
];
export function Projects() {
  const [projects, setProjects] = useState(projectSeeds);
  const [selected, setSelected] = useState<(typeof projectSeeds)[number] | null>(null);
  const [tab, setTab] = useState("Overview");
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [cards, setCards] = useState([
    { title: "Design the dashboard", status: "Done", tag: "Design" },
    { title: "Build authentication UI", status: "In progress", tag: "Frontend" },
    { title: "Add user profile", status: "To do", tag: "Frontend" },
    { title: "Write testing checklist", status: "To do", tag: "Testing" },
  ]);
  return (
    <>
      <PageHeading
        title="Turn ideas into something real."
        description="Your projects, people, and milestones. One place to keep building."
      >
        <Button onClick={() => setModal(true)}>
          <Plus />
          New project
        </Button>
      </PageHeading>
      {!selected ? (
        <div className="item-grid">
          {projects.map((p) => (
            <section className="panel feature-card" key={p.name}>
              <div className="feature-card-top">
                <span className={`icon-tile ${p.color}`}>
                  <FolderKanban />
                </span>
                <Tag color={p.color}>IN PROGRESS</Tag>
              </div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="flex flex-wrap gap-2 my-5">
                {p.stack.map((s) => (
                  <Tag key={s} color="neutral">
                    {s}
                  </Tag>
                ))}
              </div>
              <div className="card-detail">
                <span>{p.members} team members</span>
                <strong>{p.progress}%</strong>
              </div>
              <Progress value={p.progress} color={p.color} />
              <Button
                variant="outline"
                className="w-full mt-6"
                onClick={() => {
                  setSelected(p);
                  setTab("Overview");
                }}
              >
                Open workspace
                <ArrowRight />
              </Button>
            </section>
          ))}
        </div>
      ) : (
        <>
          <div className="workspace-toolbar">
            <Button variant="ghost" onClick={() => setSelected(null)}>
              ← All projects
            </Button>
            <h2 className="font-display text-xl">{selected.name}</h2>
            <Tag color="cyan">DEMO PROJECT</Tag>
          </div>
          <div className="tabs-row">
            {["Overview", "Tasks", "Team", "Resources", "Activity"].map((t) => (
              <Button
                key={t}
                variant="ghost"
                className={tab === t ? "tab-active" : ""}
                onClick={() => setTab(t)}
              >
                {t}
              </Button>
            ))}
          </div>
          {tab === "Tasks" ? (
            <div className="kanban">
              {["To do", "In progress", "Done"].map((status) => (
                <section className="kanban-column" key={status}>
                  <h3>
                    {status} <Tag>{cards.filter((c) => c.status === status).length}</Tag>
                  </h3>
                  {cards
                    .filter((c) => c.status === status)
                    .map((c) => (
                      <div className="kanban-task" key={c.title}>
                        <Tag color="cyan">{c.tag}</Tag>
                        <h4>{c.title}</h4>
                        <select
                          aria-label={`Status for ${c.title}`}
                          className="text-[10px] w-full"
                          value={c.status}
                          onChange={(e) =>
                            setCards((old) =>
                              old.map((card) =>
                                card.title === c.title ? { ...card, status: e.target.value } : card,
                              ),
                            )
                          }
                        >
                          {["To do", "In progress", "Done"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                </section>
              ))}
            </div>
          ) : tab === "Overview" ? (
            <div className="two-col">
              <section className="panel p-6">
                <h3 className="text-xl">The idea</h3>
                <p className="text-muted-foreground leading-8 my-4">
                  {selected.description} Build a thoughtful, accessible student experience that
                  makes everyday campus workflows simpler.
                </p>
                <h4 className="text-base mt-6 mb-4">Milestones</h4>
                {[
                  "Discovery & requirements",
                  "Visual design",
                  "Frontend development",
                  "Testing & demo preparation",
                ].map((m, i) => (
                  <label className="task-row" key={m}>
                    <input type="checkbox" defaultChecked={i < 2} />
                    {m}
                  </label>
                ))}
              </section>
              <section className="panel feature-card h-fit">
                <h3>Project progress</h3>
                <Ring value={selected.progress} color={selected.color} />
                <p className="mt-5">Next milestone: complete the core frontend experience.</p>
                <Button variant="outline" onClick={() => setTab("Tasks")}>
                  Explore tasks
                  <ArrowRight />
                </Button>
              </section>
            </div>
          ) : tab === "Team" ? (
            <section className="panel">
              {[
                "Alex Morgan · Frontend developer",
                "Riya Kapoor · Product designer",
                "Siddharth Patel · AI engineer",
              ]
                .slice(0, selected.members)
                .map((p) => (
                  <div className="resource-row" key={p}>
                    <div className="avatar">{p.slice(0, 2)}</div>
                    {p}
                  </div>
                ))}
            </section>
          ) : tab === "Resources" ? (
            <section className="panel p-6">
              <h3 className="text-lg">Project notes</h3>
              <textarea
                className="w-full mt-5 min-h-52"
                aria-label="Project documentation"
                placeholder="Problem statement, tech stack, links, and decisions..."
              />
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => toast.success("Notes retained in this demo screen only")}
              >
                <Check />
                Keep draft
              </Button>
            </section>
          ) : (
            <section className="panel">
              {[
                "Design milestone completed · Today",
                "New task added: Build authentication UI · Yesterday",
                "Project workspace created · Oct 8",
              ].map((a) => (
                <div className="resource-row" key={a}>
                  <Clock className="text-primary" />
                  {a}
                </div>
              ))}
            </section>
          )}
        </>
      )}
      {modal && (
        <Modal title="Start something new" onClose={() => setModal(false)}>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setProjects((p) => [
                ...p,
                {
                  name,
                  description: "A new idea, ready to take shape.",
                  stack: ["React"],
                  progress: 0,
                  color: "cyan",
                  members: 1,
                },
              ]);
              setModal(false);
              setName("");
              toast.success("Project created in this demo");
            }}
          >
            <label>
              Project name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What are you building?"
              />
            </label>
            <label>
              Problem statement
              <textarea required placeholder="What problem will this solve?" />
            </label>
            <Button type="submit">
              <Plus />
              Create project
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
export function Career() {
  const [tab, setTab] = useState("My roadmap");
  const [practice, setPractice] = useState(false);
  const [answer, setAnswer] = useState("");
  const [review, setReview] = useState(false);
  const [resume, setResume] = useState({
    name: "Alex Morgan",
    role: "Computer Science Student",
    summary: "A curious builder focused on full-stack development and problem solving.",
    skills: "React, JavaScript, Python, Data Structures",
  });
  const [applications, setApplications] = useState([
    { company: "Google", role: "Software Engineering Intern", status: "Preparing" },
    { company: "Microsoft", role: "Explore Intern", status: "Applied (demo)" },
    { company: "Atlassian", role: "Frontend Intern", status: "Interview (demo)" },
  ]);
  return (
    <>
      <PageHeading
        title="Build a future that fits you."
        description="From your first resume to your next big opportunity."
      >
        <Tag color="cyan">YOUR CAREER COMMAND CENTER</Tag>
      </PageHeading>
      <div className="tabs-row">
        {["My roadmap", "Resume builder", "Interview practice", "Application tracker"].map((t) => (
          <Button
            variant="ghost"
            key={t}
            className={tab === t ? "tab-active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === "My roadmap" ? (
        <>
          <div className="stats-grid">
            {[
              { title: "Placement readiness", value: "68%", icon: BriefcaseBusiness },
              { title: "DSA problems solved", value: "128", icon: Code2 },
              { title: "Portfolio projects", value: "2 / 4", icon: FolderKanban },
              { title: "Active applications", value: "3", icon: FileText },
            ].map((s) => (
              <section className="stat-card" key={s.title}>
                <div className="stat-top">
                  <s.icon size={16} />
                  {s.title}
                </div>
                <div className="stat-value">{s.value}</div>
              </section>
            ))}
          </div>
          <section className="panel">
            <PanelHeader
              title="Your placement roadmap"
              description="One deliberate step at a time."
            />
            {[
              {
                title: "Strengthen your fundamentals",
                detail: "DSA, operating systems, and databases",
                progress: 78,
              },
              {
                title: "Build a portfolio that speaks",
                detail: "Two polished projects with documentation",
                progress: 50,
              },
              {
                title: "Tell your story",
                detail: "Resume, profile, and personal introduction",
                progress: 65,
              },
              {
                title: "Practice for the conversation",
                detail: "Technical questions and mock interviews",
                progress: 35,
              },
            ].map((r, i) => (
              <div className="resource-row" key={r.title}>
                <Ring value={r.progress} color={i % 2 ? "cyan" : ""} />
                <div className="flex-1">
                  <h3>{r.title}</h3>
                  <p>{r.detail}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTab(i === 2 ? "Resume builder" : "Interview practice")}
                >
                  Continue
                  <ArrowRight />
                </Button>
              </div>
            ))}
          </section>
        </>
      ) : tab === "Resume builder" ? (
        <div className="two-col">
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              downloadText(
                "elevateos-resume.txt",
                `${resume.name}\n${resume.role}\n\nPROFILE\n${resume.summary}\n\nSKILLS\n${resume.skills}`,
              );
              toast.success("Resume text exported");
            }}
          >
            {Object.entries(resume).map(([key, value]) => (
              <label key={key} className="capitalize">
                {key}
                {key === "summary" ? (
                  <textarea
                    value={value}
                    onChange={(e) => setResume((r) => ({ ...r, [key]: e.target.value }))}
                  />
                ) : (
                  <input
                    required
                    value={value}
                    onChange={(e) => setResume((r) => ({ ...r, [key]: e.target.value }))}
                  />
                )}
              </label>
            ))}
            <Button type="submit">
              <Download />
              Export resume
            </Button>
          </form>
          <section className="panel p-7">
            <Tag color="neutral">LIVE PREVIEW</Tag>
            <h2 className="text-2xl mt-6">{resume.name}</h2>
            <p className="text-primary my-3">{resume.role}</p>
            <h3 className="border-b border-border pb-3 mt-8">Profile</h3>
            <p className="text-muted-foreground leading-7 my-4">{resume.summary}</p>
            <h3 className="border-b border-border pb-3 mt-8">Skills</h3>
            <p className="text-muted-foreground leading-7 mt-4">{resume.skills}</p>
          </section>
        </div>
      ) : tab === "Interview practice" ? (
        <div className="item-grid">
          {[
            "Data structures",
            "Operating systems",
            "JavaScript fundamentals",
            "Behavioral questions",
            "Aptitude & reasoning",
            "System design basics",
          ].map((t, i) => (
            <section className="panel feature-card" key={t}>
              <span className={`icon-tile ${i % 2 ? "cyan" : ""}`}>
                <Code2 />
              </span>
              <h3>{t}</h3>
              <p>Practice explaining your thought process, not just finding an answer.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPractice(true);
                  setReview(false);
                  setAnswer("");
                }}
              >
                Start practice
                <ArrowRight />
              </Button>
            </section>
          ))}
        </div>
      ) : (
        <section className="panel">
          <PanelHeader title="Your application journey" />
          {applications.map((a) => (
            <div className="resource-row" key={a.company}>
              <div className="company-logo">{a.company.slice(0, 1)}</div>
              <div className="flex-1">
                <h3>{a.company}</h3>
                <p>{a.role}</p>
              </div>
              <select
                aria-label={`${a.company} application status`}
                value={a.status}
                onChange={(e) =>
                  setApplications((old) =>
                    old.map((v) =>
                      v.company === a.company ? { ...v, status: e.target.value } : v,
                    ),
                  )
                }
              >
                <option>Preparing</option>
                <option>Applied (demo)</option>
                <option>Interview (demo)</option>
                <option>Offer (demo)</option>
              </select>
            </div>
          ))}
        </section>
      )}
      {practice && (
        <Modal title="Interview practice" onClose={() => setPractice(false)}>
          <Tag>DEMO QUESTION</Tag>
          <h3 className="text-lg mt-5">
            How would you explain the difference between a process and a thread?
          </h3>
          <textarea
            aria-label="Your interview answer"
            className="w-full mt-5 min-h-36"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Think out loud. Structure your answer..."
          />
          {review ? (
            <p>
              A strong answer covers memory isolation, resource sharing, communication overhead, and
              context switching. Processes have separate address spaces; threads share their
              process’s memory.
            </p>
          ) : (
            <Button
              className="w-full mt-5"
              disabled={!answer.trim()}
              onClick={() => setReview(true)}
            >
              Show sample answer
              <ArrowRight />
            </Button>
          )}
        </Modal>
      )}
    </>
  );
}
const resourceSeeds = [
  {
    title: "Operating Systems — Revision Notes",
    type: "Notes",
    topic: "GATE preparation",
    date: "Oct 11",
    body: "Processes and threads\n\nA process is an independent execution unit. Threads share an address space. Review scheduling algorithms: FCFS, SJF, Round Robin, and priority scheduling.",
  },
  {
    title: "Linked Lists — Patterns & Practice",
    type: "Notes",
    topic: "DSA",
    date: "Oct 10",
    body: "Key patterns\n\nUse two pointers for cycle detection. A dummy head simplifies insertion and deletion. Practice reversing a list and merging two sorted lists.",
  },
  {
    title: "System Design — Flashcards",
    type: "Flashcards",
    topic: "Career preparation",
    date: "Oct 9",
    body: "What is load balancing?\n\nDistributing incoming traffic across multiple servers to improve availability and performance.",
  },
  {
    title: "CampusFlow — Project Documentation",
    type: "Documents",
    topic: "Projects",
    date: "Oct 8",
    body: "CampusFlow\n\nGoal: simplify campus life.\nStack: React, Node.js, MongoDB.\nNext milestone: authentication UI and profile settings.",
  },
  {
    title: "GATE Formula Quick Reference",
    type: "Notes",
    topic: "Mathematics",
    date: "Oct 7",
    body: "Probability\n\nP(A ∪ B) = P(A) + P(B) − P(A ∩ B).\nFor independent events: P(A ∩ B) = P(A)P(B).",
  },
];
export function Knowledge() {
  const [resources, setResources] = useState(resourceSeeds);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All resources");
  const [detail, setDetail] = useState<(typeof resourceSeeds)[number] | null>(null);
  const [upload, setUpload] = useState(false);
  const [flipped, setFlipped] = useState(false);
  return (
    <>
      <PageHeading
        title="Everything you learn, kept close."
        description="Your notes, resources, and ideas. Connected and ready when you are."
      >
        <Button onClick={() => setUpload(true)}>
          <Upload />
          Add resource
        </Button>
      </PageHeading>
      <div className="workspace-toolbar">
        <input
          aria-label="Search resources"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your knowledge..."
        />
        <select
          aria-label="Resource type"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["All resources", "Notes", "Flashcards", "Documents"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <section className="panel">
        {resources
          .filter(
            (r) =>
              (filter === "All resources" || r.type === filter) &&
              r.title.toLowerCase().includes(query.toLowerCase()),
          )
          .map((r) => (
            <div className="resource-row" key={r.title}>
              <span className="icon-tile cyan">
                <FileText />
              </span>
              <div className="flex-1">
                <h3>{r.title}</h3>
                <p>
                  {r.topic} · Updated {r.date}
                </p>
              </div>
              <Tag color="neutral">{r.type}</Tag>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Open ${r.title}`}
                onClick={() => {
                  setDetail(r);
                  setFlipped(false);
                }}
              >
                <ArrowRight />
              </Button>
            </div>
          ))}
      </section>
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <Tag color="cyan">{detail.type}</Tag>
          {detail.type === "Flashcards" ? (
            <div className="focus-screen mt-5 rounded-lg">
              <h3>{flipped ? detail.body.split("\n\n")[1] : detail.body.split("\n\n")[0]}</h3>
              <Button variant="outline" className="mt-5" onClick={() => setFlipped(!flipped)}>
                {flipped ? "Show question" : "Reveal answer"}
              </Button>
            </div>
          ) : (
            <p className="whitespace-pre-line mt-5">{detail.body}</p>
          )}
          <Button
            variant="outline"
            className="w-full mt-5"
            onClick={() => downloadText(`${detail.title}.txt`, detail.body)}
          >
            <Download />
            Export resource
          </Button>
        </Modal>
      )}
      {upload && (
        <Modal title="Add to your knowledge" onClose={() => setUpload(false)}>
          <p>
            Files are read locally for this preview and never uploaded. Add a plain text note to
            preview its contents.
          </p>
          <input
            type="file"
            accept=".txt,.md"
            aria-label="Select text resource"
            className="w-full"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 1000000) {
                toast.error("Choose a text file under 1 MB");
                return;
              }
              const body = await file.text();
              setResources((r) => [
                ...r,
                { title: file.name, type: "Documents", topic: "Local file", date: "Today", body },
              ]);
              setUpload(false);
              toast.success("Resource added to this demo");
            }}
          />
        </Modal>
      )}
    </>
  );
}
export function Reports() {
  const { tasks, openReview } = useDemo();
  const [period, setPeriod] = useState("Weekly");
  return (
    <>
      <PageHeading
        title="See how far you’ve come."
        description="Your effort, made visible. Your next chapter, made clearer."
      >
        <Button
          variant="outline"
          onClick={() => {
            downloadText(
              "elevateos-growth-report.csv",
              "Metric,Demo value\nFocus hours,24.5\nTask completion,75%\nDSA mastery,78%\nStudy streak,12 days",
              "text/csv",
            );
            toast.success("Demo growth report exported");
          }}
        >
          <Download />
          Export report
        </Button>
      </PageHeading>
      <div className="workspace-toolbar">
        <div className="segmented">
          {["Weekly", "Monthly"].map((p) => (
            <Button
              variant="ghost"
              size="sm"
              key={p}
              className={period === p ? "selected" : ""}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <Tag color="neutral">
          DEMO MEASUREMENTS · {period === "Weekly" ? "OCT 12 – 18" : "OCTOBER 2026"}
        </Tag>
      </div>
      <div className="stats-grid">
        {[
          { label: "Focus time", value: period === "Weekly" ? "24.5 hrs" : "92.5 hrs" },
          {
            label: "Tasks completed",
            value: period === "Weekly" ? String(17 + tasks.filter((t) => t.done).length) : "72",
          },
          { label: "Quiz accuracy", value: "76%" },
          { label: "Study consistency", value: "86%" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-top">
              <TrendingUp size={15} />
              {s.label}
            </div>
            <div className="stat-value">{s.value}</div>
            <span className="text-success text-[10px]">↗ Growing steadily</span>
          </div>
        ))}
      </div>
      <div className="two-col">
        <section className="panel">
          <PanelHeader
            title={
              period === "Weekly"
                ? "Weekly time allocation"
                : "Sample weekly breakdown of your month"
            }
            description="Learning and coding focus, measured in hours."
          />
          <ProductivityChart large />
        </section>
        <section className="panel">
          <PanelHeader title="Goal momentum" />
          {goals.map((g) => (
            <div className="resource-row" key={g.title}>
              <Ring value={g.progress} color={g.color} />
              <div>
                <h3>{g.title}</h3>
                <p>{g.subtitle}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
      <section className="panel mt-5">
        <PanelHeader
          title="Your growth timeline"
          action={
            <Button variant="ghost" className="text-primary" onClick={openReview}>
              Weekly review
              <Sparkles />
            </Button>
          }
        />
        {[
          "Oct 12 · Reached a 12-day study streak",
          "Oct 10 · Completed your 128th DSA problem",
          "Oct 08 · Started the CampusFlow project",
          "Oct 05 · Improved quiz accuracy by 18%",
        ].map((t) => (
          <div className="resource-row" key={t}>
            <span className="icon-tile emerald">
              <Check />
            </span>
            {t}
          </div>
        ))}
      </section>
    </>
  );
}
export function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey Alex. Ready for your next move?\n\nI can help you explore a sample study plan, understand a concept, or reflect on this demo workspace.",
    },
  ]);
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const prompts = [
    "Plan my next seven days for GATE and DSA.",
    "Help me improve linked lists.",
    "Find hackathons relevant to my skills.",
    "Review my weekly progress.",
  ];
  function send(value: string) {
    if (!value.trim() || waiting) return;
    setMessages((m) => [...m, { role: "user", text: value }]);
    setText("");
    setWaiting(true);
    setTimeout(() => {
      const lower = value.toLowerCase();
      const response = lower.includes("linked")
        ? "A linked list is a chain of nodes. Each node stores a value and a pointer to the next node.\n\nYour sample practice path:\n1. Draw a three-node list and trace its pointers.\n2. Implement insertion and deletion.\n3. Reverse a list with three pointers.\n4. Try fast/slow pointers for cycle detection."
        : lower.includes("hackathon")
          ? "Your demo skills in React and problem solving align with Hack the Future 2026.\n\nStart with a small problem you care about, form a team, and outline a working prototype. Browse Opportunity Radar for the sample listing. No live opportunities have been searched."
          : lower.includes("progress")
            ? "Here’s your sample weekly reflection:\n\n• 24.5 focus hours invested.\n• 18 tasks completed.\n• 128 DSA problems solved in total.\n• A 12-day consistency streak.\n\nNext move: dedicate two focused sessions to operating systems."
            : lower.includes("plan")
              ? "Here’s a sample seven-day study rhythm:\n\nMonday–Tuesday: linked lists + operating systems.\nWednesday–Thursday: trees + computer networks.\nFriday: mixed problem practice.\nSaturday: one timed GATE assessment.\nSunday: review mistakes and plan ahead.\n\nAim for 45 minutes of DSA and 60 minutes of GATE revision each day. Adjust it in your AI Planner."
              : "Let’s make your next step manageable. Choose one topic, spend 25 minutes understanding its fundamentals, then test yourself with one practice question.\n\nThis is a preset frontend demo response, not live AI advice. For a sample plan, try one of the suggested prompts.";
      setMessages((m) => [...m, { role: "assistant", text: response }]);
      setWaiting(false);
    }, 650);
  }
  return (
    <>
      <PageHeading
        title="A little clarity. A lot of possibility."
        description="Your thinking partner for the journey ahead."
      >
        <Tag>SIMULATED AI · FRONTEND DEMO</Tag>
      </PageHeading>
      <div className="chat-layout">
        <section className="panel">
          <PanelHeader
            title={
              <>
                <Sparkles />
                Your growth companion
              </>
            }
            action={
              <Button
                variant="ghost"
                onClick={() =>
                  setMessages([
                    { role: "assistant", text: "A fresh start. What would you like to focus on?" },
                  ])
                }
              >
                New chat
                <Plus />
              </Button>
            }
          />
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div className={`chat-message ${m.role === "user" ? "user" : ""}`} key={i}>
                {m.role === "assistant" && (
                  <div className="flex gap-2 items-center text-primary text-[10px] mb-2">
                    <Sparkles size={13} />
                    ELEVATE AI · DEMO
                  </div>
                )}
                {m.text}
              </div>
            ))}
            {waiting && (
              <div className="text-muted-foreground text-xs">Preparing a sample response…</div>
            )}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Message assistant"
              placeholder="What’s on your mind?"
            />
            <Button
              type="submit"
              size="icon"
              disabled={waiting || !text.trim()}
              aria-label="Send to demo assistant"
            >
              <Send />
            </Button>
          </form>
        </section>
        <aside className="panel p-5 h-fit">
          <span className="icon-tile">
            <Sparkles />
          </span>
          <h3 className="text-base my-4">Start with a next move.</h3>
          {prompts.map((p) => (
            <Button
              key={p}
              variant="outline"
              className="w-full whitespace-normal text-left h-auto text-[11px] py-3 justify-start my-2"
              onClick={() => send(p)}
              disabled={waiting}
            >
              {p}
              <ArrowRight className="ml-auto" />
            </Button>
          ))}
          <p className="text-muted-foreground text-[10px] leading-6 mt-5">
            Preset responses use sample content only. No messages are sent to an AI service.
          </p>
          <Button variant="ghost" className="text-primary mt-3" asChild>
            <Link to="/planner">
              Open my planner
              <ArrowRight />
            </Link>
          </Button>
        </aside>
      </div>
    </>
  );
}
