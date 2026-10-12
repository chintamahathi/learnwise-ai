import { useState } from "react";
import {
  Bookmark,
  MapPin,
  ArrowRight,
  Sparkles,
  Check,
  Users,
  Plus,
  Radio,
  Send,
  Code2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, Tag, Modal, PanelHeader } from "./shared";
import { opportunities } from "@/data/demo";
import { useDemo } from "./app-shell";
import { toast } from "sonner";
export function Opportunities() {
  const [category, setCategory] = useState("All opportunities");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [detail, setDetail] = useState<(typeof opportunities)[number] | null>(null);
  const [plan, setPlan] = useState(false);
  const [status, setStatus] = useState("Not started");
  const [checked, setChecked] = useState<string[]>([]);
  const filtered = opportunities.filter(
    (o) =>
      (category === "All opportunities" || category === "Saved"
        ? category !== "Saved" || saved.includes(o.id)
        : o.type === category) &&
      `${o.title} ${o.company} ${o.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title="Your next door is open."
        description="Discover possibilities that match your skills, goals, and ambition."
      >
        <Tag color="cyan">CURATED DEMO LISTINGS</Tag>
      </PageHeading>
      <div className="workspace-toolbar">
        <input
          placeholder="Search opportunities, skills, or companies..."
          aria-label="Search opportunities"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Opportunity category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {[
            "All opportunities",
            "Internship",
            "Hackathon",
            "Scholarship",
            "Fellowship",
            "Saved",
          ].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="item-grid">
        {filtered.map((o) => (
          <section className="panel feature-card" key={o.id}>
            <div className="feature-card-top">
              <div className={`company-logo ${o.logo === "DEV" ? "dev" : ""}`}>{o.logo}</div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${saved.includes(o.id) ? "Unsave" : "Save"} ${o.title}`}
                onClick={() =>
                  setSaved((s) => (s.includes(o.id) ? s.filter((id) => id !== o.id) : [...s, o.id]))
                }
              >
                <Bookmark className={saved.includes(o.id) ? "fill-primary text-primary" : ""} />
              </Button>
            </div>
            <div className="flex gap-2 mt-5">
              <Tag color={o.color}>{o.type}</Tag>
              <Tag color="emerald">{o.match}% match</Tag>
            </div>
            <h3>{o.title}</h3>
            <p>{o.company}</p>
            <p className="flex gap-2 items-center">
              <MapPin size={12} />
              {o.location}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {o.skills.map((s) => (
                <Tag color="neutral" key={s}>
                  {s}
                </Tag>
              ))}
            </div>
            <div className="card-detail">
              <span>Applications close</span>
              <span className="text-warning">{o.deadline}, 2026</span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setDetail(o);
                setPlan(false);
                setStatus("Not started");
                setChecked([]);
              }}
            >
              Explore opportunity
              <ArrowRight />
            </Button>
          </section>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <Bookmark />
          <h3>No opportunities here yet</h3>
          <p>Try a different filter or save a listing to come back to it.</p>
        </div>
      )}
      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <div className="flex gap-2">
            <Tag color={detail.color}>{detail.type}</Tag>
            <Tag color="emerald">{detail.match}% MATCH</Tag>
            <Tag color="neutral">DEMO · NOT VERIFIED</Tag>
          </div>
          <p>{detail.description}</p>
          <h4 className="mt-5">Why this fits your path</h4>
          <p>
            Aligned with your DSA preparation, growing project portfolio, and interest in software
            engineering.
          </p>
          <h4>Skills to bring</h4>
          <div className="flex flex-wrap gap-2 my-3">
            {detail.skills.map((s) => (
              <Tag key={s} color="cyan">
                {s}
              </Tag>
            ))}
          </div>
          <label className="form-stack mt-5">
            Application progress
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Not started</option>
              <option>Preparing</option>
              <option>Applied (demo)</option>
            </select>
          </label>
          {!plan ? (
            <Button className="w-full mt-5" onClick={() => setPlan(true)}>
              <Sparkles />
              Build My Preparation Plan
            </Button>
          ) : (
            <div className="mt-5">
              <Tag>SIMULATED PREPARATION PLAN</Tag>
              {[
                "Review eligibility and requirements",
                "Update resume and project portfolio",
                "Practice three interview problems",
                "Prepare your application draft",
              ].map((s, i) => (
                <label className="task-row" key={s}>
                  <input
                    type="checkbox"
                    checked={checked.includes(s)}
                    onChange={() =>
                      setChecked((c) => (c.includes(s) ? c.filter((v) => v !== s) : [...c, s]))
                    }
                  />
                  <div>
                    <span>{s}</span>
                    <p className="text-[10px] my-1">Day {i + 1} · 45 minutes</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          <p className="text-[10px] mt-5">
            This sample listing has no official application link. Check the organization’s official
            website before applying.
          </p>
        </Modal>
      )}
    </>
  );
}
const people = [
  {
    name: "Riya Kapoor",
    initials: "RK",
    department: "Computer Science",
    year: "Year 3",
    skills: ["React", "UI/UX", "JavaScript"],
    goal: "Building a full-stack project",
    color: "",
  },
  {
    name: "Siddharth Patel",
    initials: "SP",
    department: "Computer Science",
    year: "Year 3",
    skills: ["Python", "DSA", "Machine Learning"],
    goal: "Looking for hackathon teammates",
    color: "cyan",
  },
  {
    name: "Ananya Rao",
    initials: "AR",
    department: "Electronics",
    year: "Year 2",
    skills: ["IoT", "Python", "Robotics"],
    goal: "Preparing for GATE 2027",
    color: "emerald",
  },
  {
    name: "Arjun Mehta",
    initials: "AM",
    department: "Computer Science",
    year: "Year 4",
    skills: ["Java", "DSA", "System Design"],
    goal: "Peer mentoring for placements",
    color: "",
  },
  {
    name: "Neha Singh",
    initials: "NS",
    department: "Information Technology",
    year: "Year 3",
    skills: ["React", "Node.js", "MongoDB"],
    goal: "Seeking a project collaborator",
    color: "cyan",
  },
  {
    name: "Vikram Das",
    initials: "VD",
    department: "Electronics",
    year: "Year 3",
    skills: ["C++", "Embedded", "IoT"],
    goal: "Building smart campus solutions",
    color: "emerald",
  },
];
export function Campus() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All departments");
  const [requests, setRequests] = useState<string[]>([]);
  const [selected, setSelected] = useState<(typeof people)[number] | null>(null);
  return (
    <>
      <PageHeading
        title="Find your kind of ambitious."
        description="Learn together. Build together. Grow beyond your circle."
      >
        <Tag color="emerald">
          <Users size={11} />
          124 STUDENTS · DEMO
        </Tag>
      </PageHeading>
      <div className="workspace-toolbar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search students"
          placeholder="Search people, skills, or interests..."
        />
        <select
          aria-label="Department filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["All departments", "Computer Science", "Electronics", "Information Technology"].map(
            (v) => (
              <option key={v}>{v}</option>
            ),
          )}
        </select>
      </div>
      <div className="item-grid">
        {people
          .filter(
            (p) =>
              (filter === "All departments" || p.department === filter) &&
              `${p.name} ${p.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
          )
          .map((p) => (
            <section className="panel feature-card" key={p.name}>
              <div className="feature-card-top">
                <div className={`avatar ${p.color} w-12 h-12 text-sm`}>{p.initials}</div>
                <Tag color="emerald">OPEN TO CONNECT</Tag>
              </div>
              <h3>{p.name}</h3>
              <p>
                {p.department} · {p.year}
                <br />
                VJIT · Hyderabad
              </p>
              <div className="flex gap-2 flex-wrap my-4">
                {p.skills.map((s) => (
                  <Tag key={s} color="cyan">
                    {s}
                  </Tag>
                ))}
              </div>
              <p>{p.goal}</p>
              <div className="card-actions">
                <Button
                  variant={requests.includes(p.name) ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    if (!requests.includes(p.name)) {
                      setRequests((r) => [...r, p.name]);
                      toast.success("Demo connection request · not sent to a real person");
                    }
                  }}
                >
                  {requests.includes(p.name) ? <Check /> : <Plus />}
                  {requests.includes(p.name) ? "Requested" : "Connect"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelected(p)}>
                  View profile
                  <ArrowRight />
                </Button>
              </div>
            </section>
          ))}
      </div>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className={`avatar ${selected.color} w-16 h-16 text-lg`}>{selected.initials}</div>
          <p>
            {selected.department} · {selected.year} · VJIT
          </p>
          <h4>Current focus</h4>
          <p>{selected.goal}</p>
          <h4>Skills & interests</h4>
          <div className="flex gap-2 flex-wrap my-4">
            {selected.skills.map((s) => (
              <Tag color="cyan" key={s}>
                {s}
              </Tag>
            ))}
          </div>
          <Tag color="neutral">SAMPLE STUDENT PROFILE</Tag>
        </Modal>
      )}
    </>
  );
}
const initialRooms = [
  {
    name: "DSA Sprint Room",
    topic: "Linked lists & problem solving",
    type: "Coding",
    members: 8,
    duration: 45,
    color: "cyan",
    private: false,
  },
  {
    name: "GATE Study Circle",
    topic: "Operating systems revision",
    type: "GATE",
    members: 12,
    duration: 60,
    color: "",
    private: false,
  },
  {
    name: "Build Together",
    topic: "Full-stack project collaboration",
    type: "Projects",
    members: 4,
    duration: 90,
    color: "emerald",
    private: false,
  },
  {
    name: "Placement Prep Crew",
    topic: "Mock interviews & aptitude",
    type: "Placements",
    members: 6,
    duration: 60,
    color: "amber",
    private: true,
  },
];
export function Rooms() {
  const { openFocus } = useDemo();
  const [rooms, setRooms] = useState(initialRooms);
  const [filter, setFilter] = useState("All rooms");
  const [joined, setJoined] = useState<(typeof initialRooms)[number] | null>(null);
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { name: "Riya", text: "Ready for today’s sprint? Let’s start with linked lists." },
  ]);
  const [tab, setTab] = useState("Chat");
  const [notes, setNotes] = useState("");
  return (
    <>
      <PageHeading
        title="Shared focus. Bigger progress."
        description="Pull up a chair. Your next breakthrough is better together."
      >
        <Button onClick={() => setCreate(true)}>
          <Plus />
          Create room
        </Button>
      </PageHeading>
      {!joined ? (
        <>
          <div className="tabs-row">
            {["All rooms", "Coding", "GATE", "Projects", "Placements"].map((f) => (
              <Button
                variant="ghost"
                key={f}
                className={filter === f ? "tab-active" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
          <div className="item-grid">
            {rooms
              .filter((r) => filter === "All rooms" || r.type === filter)
              .map((r) => (
                <section className="panel feature-card" key={r.name}>
                  <div className="feature-card-top">
                    <span className={`icon-tile ${r.color}`}>
                      <Radio />
                    </span>
                    <Tag color={r.private ? "neutral" : "emerald"}>
                      {r.private ? "INVITE ONLY" : "LIVE NOW"}
                    </Tag>
                  </div>
                  <h3>{r.name}</h3>
                  <p>{r.topic}</p>
                  <div className="card-detail">
                    <span>
                      <Users size={12} className="inline mr-1" />
                      {r.members} students
                    </span>
                    <span>
                      <Clock size={12} className="inline mr-1" />
                      {r.duration} min
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    variant={r.private ? "outline" : "default"}
                    onClick={() => {
                      if (r.private) {
                        toast.info("An invitation is required for this demo room");
                        return;
                      }
                      setJoined(r);
                      setMessages([
                        {
                          name: "Riya",
                          text: `Welcome! Today we’re focusing on ${r.topic.toLowerCase()}.`,
                        },
                      ]);
                    }}
                  >
                    {" "}
                    {r.private ? "Request invitation" : "Join room"}
                    <ArrowRight />
                  </Button>
                </section>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="workspace-toolbar">
            <h2 className="font-display text-xl">{joined.name}</h2>
            <Tag color="emerald">DEMO SESSION</Tag>
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => {
                setJoined(null);
                toast.success("You left the demo room");
              }}
            >
              Leave room
            </Button>
            <Button onClick={() => openFocus(joined.topic)}>
              <PlayIcon />
              Focus together
            </Button>
          </div>
          <div className="two-col">
            <section className="panel">
              <PanelHeader title={joined.topic} />
              <div className="tabs-row px-5">
                {["Chat", "Notes", "Tasks"].map((t) => (
                  <Button
                    variant="ghost"
                    className={tab === t ? "tab-active" : ""}
                    key={t}
                    onClick={() => setTab(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
              {tab === "Chat" ? (
                <>
                  <div className="chat-messages">
                    {messages.map((m, i) => (
                      <div className={`chat-message ${m.name === "You" ? "user" : ""}`} key={i}>
                        <Tag color="cyan">{m.name}</Tag>
                        <div className="mt-2">{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="chat-input"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!message.trim()) return;
                      setMessages((m) => [...m, { name: "You", text: message }]);
                      setMessage("");
                    }}
                  >
                    <input
                      aria-label="Room message"
                      placeholder="Add to the demo conversation..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button type="submit" size="icon" aria-label="Add message">
                      <Send />
                    </Button>
                  </form>
                </>
              ) : tab === "Notes" ? (
                <textarea
                  className="m-5 min-h-64 w-[calc(100%-40px)]"
                  placeholder="Your session notes..."
                  aria-label="Room notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              ) : (
                <div className="p-5">
                  {[
                    "Review the fundamentals",
                    "Solve two practice problems",
                    "Share one takeaway",
                  ].map((t) => (
                    <label className="task-row" key={t}>
                      <input type="checkbox" />
                      {t}
                    </label>
                  ))}
                </div>
              )}
            </section>
            <section className="panel h-fit">
              <PanelHeader title="In this room" />
              {["You", "Riya Kapoor", "Siddharth Patel", "Arjun Mehta"].map((n) => (
                <div key={n} className="resource-row">
                  <div className="avatar">{n.slice(0, 2).toUpperCase()}</div>
                  <span>{n}</span>
                  <span className="live-dot ml-auto" />
                </div>
              ))}
              <p className="p-5 text-[10px] text-muted-foreground">
                Sample participants. Messages and notes exist only in this demo session.
              </p>
            </section>
          </div>
        </>
      )}
      {create && (
        <Modal title="Create a study room" onClose={() => setCreate(false)}>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setRooms((r) => [
                ...r,
                {
                  name,
                  topic: "Your collaborative study session",
                  type: "Coding",
                  members: 1,
                  duration: 45,
                  color: "cyan",
                  private: false,
                },
              ]);
              setCreate(false);
              setName("");
              toast.success("Demo room created");
            }}
          >
            <label>
              Room name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Give your study circle a name"
              />
            </label>
            <label>
              Session goal
              <input required placeholder="What are you working on?" />
            </label>
            <Button type="submit">
              <Plus />
              Create demo room
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
import { Play as PlayIcon } from "lucide-react";
