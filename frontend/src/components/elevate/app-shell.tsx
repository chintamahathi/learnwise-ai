import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Layers,
  ChevronsUpDown,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  Sparkles,
  ArrowUpRight,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation, initialTasks } from "@/data/demo";
import { Modal, Tag } from "./shared";
import { Toaster, toast } from "sonner";
type Task = (typeof initialTasks)[number];
type AppContextType = {
  tasks: Task[];
  toggleTask: (id: number) => void;
  openAdd: () => void;
  openFocus: (title?: string) => void;
  openReview: () => void;
  addPlanTask: (title: string, goal: string, duration: number) => void;
  name: string;
  setName: (name: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  rollNo: string;
  setRollNo: (r: string) => void;
};
export type Role = "student" | "admin";
const AppContext = createContext<AppContextType | null>(null);
export function useDemo() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("App context missing");
  return ctx;
}
export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = navigation.find((item) => item.path === path);
  const [mobile, setMobile] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  const [name, setName] = useState("Alex");
  const [role, setRole] = useState<Role>("student");
  const [rollNo, setRollNo] = useState("21B81A0501");
  const [modal, setModal] = useState<
    "search" | "notifications" | "task" | "focus" | "review" | "upgrade" | "profile" | null
  >(null);
  const [query, setQuery] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskGoal, setTaskGoal] = useState("DSA & Coding");
  const [duration, setDuration] = useState(45);
  const [focusTitle, setFocusTitle] = useState("Master linked lists & solve 3 problems");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [focusMode, setFocusMode] = useState("Focus");
  const [read, setRead] = useState(false);
  useEffect(() => {
    setMobile(false);
    setModal(null);
  }, [path]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setModal("search");
      }
      if (e.key === "Escape") {
        setModal(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(
      () =>
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        }),
      1000,
    );
    return () => clearInterval(interval);
  }, [running]);
  const openFocus = (title?: string) => {
    if (title) setFocusTitle(title);
    setModal("focus");
  };
  const toggleTask = (id: number) =>
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setTasks((t) => [
      ...t,
      {
        id: Date.now(),
        title: taskTitle,
        goal: taskGoal,
        duration,
        priority: "Medium",
        color: "cyan",
        done: false,
      },
    ]);
    setModal(null);
    setTaskTitle("");
    toast.success("Task added to your demo plan");
  };
  return (
    <AppContext.Provider
      value={{
        tasks,
        toggleTask,
        openAdd: () => setModal("task"),
        openFocus,
        openReview: () => setModal("review"),
        addPlanTask: (title, goal, duration) =>
          setTasks((t) => [
            ...t,
            {
              id: Date.now(),
              title,
              goal,
              duration,
              priority: "High priority",
              color: "amber",
              done: false,
            },
          ]),
        name,
        setName,
        role,
        setRole,
        rollNo,
        setRollNo,
      }}
    >
      <div className="app-shell">
        <aside className={`sidebar ${mobile ? "open" : ""}`}>
          <Link to="/" className="brand">
            <div className="brand-mark">
              <Layers strokeWidth={2.7} />
            </div>
            <span>
              Elevate<span>OS</span>
            </span>
          </Link>
          <div className="brand-caption">YOUR PERSONAL GROWTH OS</div>
          <div className="nav-label">WORKSPACE</div>
          <nav aria-label="Main navigation">
            {navigation.slice(0, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${path === item.path ? "active" : ""}`}
              >
                <item.icon />
                {item.title}
                {item.path === "/opportunities" && <span className="nav-count">12</span>}
              </Link>
            ))}
            <div className="nav-label mt-6">CONNECT & BUILD</div>
            {navigation.slice(6, 12).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${path === item.path ? "active" : ""}`}
              >
                <item.icon />
                {item.title}
                {item.path === "/rooms" && <span className="live-dot ml-auto" />}
              </Link>
            ))}
            <div className="nav-label mt-6">YOUR COPILOT</div>
            <Link to="/assistant" className={`nav-item ${path === "/assistant" ? "active" : ""}`}>
              <Sparkles />
              AI Assistant<Tag>AI</Tag>
            </Link>
            {role === "admin" && (
              <>
                <div className="nav-label mt-6">COLLEGE ADMIN</div>
                <Link to="/admin" className={`nav-item ${path === "/admin" ? "active" : ""}`}>
                  <Shield />
                  Student overview
                </Link>
              </>
            )}
          </nav>
          <div className="sidebar-bottom">
            <div className="upgrade-box">
              <Sparkles size={17} className="text-primary" />
              <h4>Your potential, amplified.</h4>
              <p>Unlock advanced insights and a smarter growth journey.</p>
              <Button
                className="w-full primary-button text-[10px]"
                size="sm"
                onClick={() => setModal("upgrade")}
              >
                Explore Elevate Pro
                <ArrowUpRight />
              </Button>
            </div>
            <Link to="/settings" className={`nav-item ${path === "/settings" ? "active" : ""}`}>
              <navigationSettings.icon />
              Settings
            </Link>
            <div className="profile-row">
              <div className="avatar">{name.slice(0, 1)}M</div>
              <div className="flex-1">
                <strong>{name} Morgan</strong>
                <small>{role === "admin" ? "College admin" : "Student · " + rollNo} · Demo</small>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account menu"
                onClick={() => setModal("profile")}
              >
                <ChevronsUpDown size={14} />
              </Button>
            </div>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              aria-label={mobile ? "Close navigation" : "Open navigation"}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X /> : <Menu />}
            </Button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={12} />
              <strong>
                {path === "/admin" ? "Student overview" : current?.title || "Your account"}
              </strong>
            </div>
            <Button
              variant="ghost"
              className="search-trigger"
              onClick={() => setModal("search")}
              aria-label="Search workspace"
            >
              <span>
                <Search />
                <span className="search-label">Search anything...</span>
              </span>
              <kbd>⌘ K</kbd>
            </Button>
            <div className="topbar-actions">
              {running && (
                <Button variant="ghost" className="focus-chip" onClick={() => setModal("focus")}>
                  <span className="live-dot" />
                  {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={read ? "" : "notification-button"}
                aria-label="Notifications"
                onClick={() => setModal("notifications")}
              >
                <Bell />
              </Button>
              <div className="h-6 border-l border-border" />
              <div
                className="avatar cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Open profile"
                onClick={() => setModal("profile")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setModal("profile");
                }}
              >
                {name.slice(0, 1)}M
              </div>
            </div>
          </header>
          <main className="content">
            {children}
            <footer className="footer">
              <span>
                © 2026 ElevateOS <span className="mx-2">·</span> Your Goals. Your Growth. Your Next
                Move.
              </span>
              <span className="flex items-center gap-2">
                <span className="live-dot" />
                Demo workspace <span className="mx-2">·</span> Built for your next level
              </span>
            </footer>
          </main>
        </div>
      </div>
      {modal === "search" && (
        <Modal title="Search your workspace" onClose={() => setModal(null)}>
          <input
            autoFocus
            placeholder="Search pages, goals, or tools..."
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="command-results">
            {navigation
              .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
              .map((n) => (
                <Link
                  key={n.path}
                  to={n.path}
                  className="command-result"
                  onClick={() => setModal(null)}
                >
                  <n.icon />
                  {n.title}
                  <ChevronRight className="ml-auto" />
                </Link>
              ))}
            {navigation.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
              .length === 0 && <p>No matches. Try “planner” or “learning”.</p>}
          </div>
        </Modal>
      )}
      {modal === "task" && (
        <Modal title="Add a task" onClose={() => setModal(null)}>
          <form className="form-stack" onSubmit={addTask}>
            <label>
              What’s your next move?
              <input
                required
                autoFocus
                placeholder="e.g. Practice binary search"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </label>
            <div className="form-grid">
              <label>
                Associated goal
                <select value={taskGoal} onChange={(e) => setTaskGoal(e.target.value)}>
                  <option>DSA & Coding</option>
                  <option>GATE 2027</option>
                  <option>Full-stack Dev</option>
                  <option>Placement Prep</option>
                </select>
              </label>
              <label>
                Duration (minutes)
                <input
                  type="number"
                  required
                  min={5}
                  max={480}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </label>
            </div>
            <Button type="submit" className="primary-button">
              <Plus />
              Add to my plan
            </Button>
          </form>
        </Modal>
      )}
      {modal === "notifications" && (
        <Modal title="Your notifications" onClose={() => setModal(null)}>
          {!read ? (
            <>
              <div className="resource-row">
                <Sparkles className="text-primary" />
                <div>
                  <h3>Your weekly growth review is ready</h3>
                  <p>Explore your progress and next steps · 20 min ago</p>
                </div>
              </div>
              <div className="resource-row">
                <Clock className="text-warning" />
                <div>
                  <h3>Hack the Future application closes soon</h3>
                  <p>8 days remaining · Sample reminder</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-5 w-full"
                onClick={() => {
                  setRead(true);
                  toast.success("Notifications marked as read");
                }}
              >
                <Check />
                Mark all as read
              </Button>
            </>
          ) : (
            <div className="empty-state">
              <Bell />
              <h3>You’re all caught up</h3>
              <p>No unread notifications.</p>
            </div>
          )}
        </Modal>
      )}
      {modal === "focus" && (
        <Modal title="Find your focus" onClose={() => setModal(null)}>
          <div className="segmented justify-center">
            {["Focus", "Short break", "Long break"].map((m) => (
              <Button
                key={m}
                size="sm"
                variant="ghost"
                className={m === focusMode ? "selected" : ""}
                onClick={() => {
                  setFocusMode(m);
                  setRunning(false);
                  setSeconds(m === "Focus" ? 1500 : m === "Short break" ? 300 : 900);
                }}
              >
                {m}
              </Button>
            ))}
          </div>
          <div className="focus-screen mt-4 rounded-lg">
            <Tag>
              <Sparkles size={10} /> ONE THING AT A TIME
            </Tag>
            <h3>{focusTitle}</h3>
            <div className="focus-timer">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </div>
            <div className="focus-actions">
              <Button onClick={() => setRunning(!running)}>
                {running ? <Pause /> : <Play />}
                {running ? "Pause" : "Start focus"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Reset timer"
                onClick={() => {
                  setRunning(false);
                  setSeconds(
                    focusMode === "Focus" ? 1500 : focusMode === "Short break" ? 300 : 900,
                  );
                }}
              >
                <RotateCcw />
              </Button>
            </div>
          </div>
          <textarea
            className="w-full mt-4"
            rows={2}
            placeholder="Session notes..."
            aria-label="Focus session notes"
          />
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => {
              setRunning(false);
              setModal(null);
              toast.success("Demo focus session completed");
            }}
          >
            <Check />
            Complete session
          </Button>
        </Modal>
      )}
      {modal === "review" && (
        <Modal title="Your weekly growth review" onClose={() => setModal(null)}>
          <Tag>DEMO INSIGHT</Tag>
          <h3 className="text-lg mt-5">Small steps. Remarkable progress.</h3>
          <p>
            You completed 18 tasks and spent 24.5 hours investing in yourself this week. Your coding
            consistency improved by 18%.
          </p>
          <div className="form-stack mt-5">
            <div className="resource-row">
              <Check className="text-success" />
              <div>
                <h3>Your biggest win</h3>
                <p>Linked list accuracy increased from 58% to 76%.</p>
              </div>
            </div>
            <div className="resource-row">
              <Target className="text-cyan" />
              <div>
                <h3>Your next focus</h3>
                <p>Give operating systems two 45-minute sessions next week.</p>
              </div>
            </div>
          </div>
          <Button className="w-full mt-5" asChild>
            <Link to="/planner">
              Plan my next week
              <ArrowUpRight />
            </Link>
          </Button>
        </Modal>
      )}
      {modal === "upgrade" && (
        <Modal title="Elevate Pro" onClose={() => setModal(null)}>
          <Tag>COMING SOON</Tag>
          <p>
            A deeper view of your growth. Advanced learning insights, personalized roadmaps, and
            unlimited planning are being explored.
          </p>
          <p>This frontend preview has no paid plans or checkout.</p>
          <Button className="w-full" onClick={() => setModal(null)}>
            Continue exploring
          </Button>
        </Modal>
      )}
      {modal === "profile" && (
        <Modal title="Your account" onClose={() => setModal(null)}>
          <div className="profile-row border-0 pt-0">
            <div className="avatar">{name.slice(0, 1)}M</div>
            <div>
              <strong>{name} Morgan</strong>
              <small>Computer Science · Year 3</small>
            </div>
          </div>
          <div className="form-stack mt-5">
            <Button variant="outline" asChild>
              <Link to="/settings">
                Edit profile
                <ChevronRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/onboarding">
                Personalize my growth plan
                <Sparkles />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/signin">
                <LogOut />
                Explore sign-in demo
              </Link>
            </Button>
          </div>
        </Modal>
      )}
      <Toaster theme="dark" position="bottom-right" richColors />
    </AppContext.Provider>
  );
}
const navigationSettings = navigation[12];
import { Target } from "lucide-react";
