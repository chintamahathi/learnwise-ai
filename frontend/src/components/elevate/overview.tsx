import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Plus,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Target,
  CircleCheck,
  Clock,
  Flame,
  Play,
  TrendingUp,
  ChevronRight,
  Radio,
  Zap,
  Code2,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import coreImage from "@/assets/intelligence-core.jpg";
import { goals, opportunities } from "@/data/demo";
import { useDemo } from "./app-shell";
import { Tag, Ring, Progress, PanelHeader, LinkLabel } from "./shared";
import { useDashboardAnalytics } from "@/hooks/use-dashboard-analytics";

// ── ProductivityChart ─────────────────────────────────────────────────────────
// Accepts either live weekly data from the hook or a static fallback.

export function ProductivityChart({
  data,
  large = false,
}: {
  data?: { day: string; learning: number; coding: number }[];
  large?: boolean;
}) {
  // Fall back to empty placeholder shape so the chart never crashes
  const chartData = data ?? [
    { day: "Mon", learning: 0, coding: 0 },
    { day: "Tue", learning: 0, coding: 0 },
    { day: "Wed", learning: 0, coding: 0 },
    { day: "Thu", learning: 0, coding: 0 },
    { day: "Fri", learning: 0, coding: 0 },
    { day: "Sat", learning: 0, coding: 0 },
    { day: "Sun", learning: 0, coding: 0 },
  ];

  return (
    <div
      className="chart-wrap"
      ref={(el) => {
        if (el && large) el.style.height = "300px";
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 15, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="learningGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="codingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.1} />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            dy={9}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 8 }}
            tickFormatter={(v) => `${v}h`}
            axisLine={false}
            tickLine={false}
            domain={[0, 6]}
            ticks={[0, 2, 4, 6]}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 11,
            }}
          />
          <Area
            type="monotone"
            dataKey="learning"
            name="Learning"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#learningGradient)"
          />
          <Area
            type="monotone"
            dataKey="coding"
            name="Coding"
            stroke="var(--cyan)"
            strokeWidth={2}
            strokeDasharray="4 3"
            fill="url(#codingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────

export function Overview() {
  const { tasks, toggleTask, openAdd, openFocus, openReview, name } = useDemo();
  const { weeklyActivity, subjectMastery, loadState, refresh } = useDashboardAnalytics();

  // ── Derived stats from real data ─────────────────────────────────────────
  // Total learning units this week (sum of accuracy fractions, 1 decimal)
  const weeklyTotal =
    loadState.status === "success" ? weeklyActivity.reduce((a, d) => a + d.learning, 0) : null;

  // Top 3 subjects sorted by pct ascending (weakest first = most needs work)
  const masterySubjects =
    loadState.status === "success"
      ? [...subjectMastery].sort((a, b) => a.pct - b.pct).slice(0, 3)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Page heading ───────────────────────────────────────────────── */}
      <div className="page-heading">
        <div>
          <p className="eyebrow">MONDAY, OCTOBER 12</p>
          <h1>
            Good morning, {name}
            <span className="wave">✦</span>
          </h1>
          <p>A little focus today. A big leap tomorrow. Let's make it count.</p>
        </div>
        <div className="heading-actions">
          <span className="date-pill">
            <CalendarDays size={13} />
            Oct 12, 2026
          </span>
          <Button className="primary-button text-[11px]" onClick={openAdd}>
            <Plus />
            Quick add
          </Button>
        </div>
      </div>

      {/* ── Hero banner ────────────────────────────────────────────────── */}
      <section className="hero-banner">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <Sparkles size={13} />
            YOUR AI GROWTH COMPANION
          </div>
          <h2>
            Your next level <span>starts here.</span>
          </h2>
          <p>
            Four active goals. Three priorities. One focused day.
            <br />
            Your personalized path to what's next is ready.
          </p>
          <Button className="primary-button text-[10px]" size="sm" asChild>
            <Link to="/planner">
              Explore today's plan
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="ghost" className="text-[10px] ml-2" size="sm" asChild>
            <Link to="/assistant">
              Ask your AI
              <Sparkles size={12} />
            </Link>
          </Button>
        </div>
        <img
          src={coreImage}
          className="hero-art"
          alt="Luminous violet and cyan intelligence core"
          width={1024}
          height={768}
        />
        <span className="hero-status">
          <span className="live-dot" />
          Aligned with your ambition
        </span>
      </section>

      {/* ── Stats grid ─────────────────────────────────────────────────── */}
      <section className="stats-grid" aria-label="Growth summary">
        {[
          {
            icon: Target,
            label: "Active goals",
            value: "04",
            unit: "",
            detail: "2 milestones this week",
            change: "+1",
            color: "",
          },
          {
            icon: CircleCheck,
            label: "Tasks completed",
            value: String(17 + tasks.filter((t) => t.done).length),
            unit: "/ 24",
            detail: "vs. last week",
            change: "+12%",
            color: "cyan",
          },
          {
            icon: Clock,
            label: "Weekly focus time",
            value: "24.5",
            unit: "hrs",
            detail: "vs. last week",
            change: "+18%",
            color: "emerald",
          },
          {
            icon: Flame,
            label: "Current streak",
            value: "12",
            unit: "days",
            detail: "Keep the momentum going",
            change: "",
            color: "amber",
          },
        ].map((s, i) => (
          <motion.div
            className="stat-card"
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <div className="stat-top">
              <span className={`icon-tile ${s.color}`}>
                <s.icon />
              </span>
              {s.label}
            </div>
            <div className="stat-value">
              {s.value}
              <small>{s.unit}</small>
            </div>
            <div className="stat-bottom">
              {s.change && <span className="positive">↗ {s.change}</span>} {s.detail}
            </div>
            <svg
              viewBox="0 0 70 30"
              className={`sparkline ${s.color === "cyan" ? "text-cyan" : s.color === "emerald" ? "text-success" : s.color === "amber" ? "text-warning" : ""}`}
              aria-hidden="true"
            >
              <path
                d={
                  i === 0
                    ? "M0 26L12 26L12 20L26 20L26 15L41 15L41 8L58 8L58 3L70 3"
                    : i === 1
                      ? "M0 24L10 19L20 22L30 11L40 14L50 8L60 12L70 2"
                      : "M0 25L9 20L18 25L29 13L37 17L45 9L52 14L61 5L70 8"
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </motion.div>
        ))}
      </section>

      {/* ── Dashboard grid ─────────────────────────────────────────────── */}
      <div className="dashboard-grid">
        <div className="dashboard-column">
          {/* Task list */}
          <section className="panel">
            <PanelHeader
              title={
                <>
                  <Sparkles />
                  Today's action plan <Tag>AI CURATED</Tag>
                </>
              }
              description="The right things, in the right order."
              action={
                <Link to="/planner">
                  <LinkLabel>View planner</LinkLabel>
                </Link>
              }
            />
            <div className="task-list">
              {tasks.slice(0, 5).map((t) => (
                <div key={t.id} className={`task-row ${t.done ? "task-completed" : ""}`}>
                  <label className="task-check">
                    <input
                      type="checkbox"
                      checked={t.done}
                      aria-label={`Complete ${t.title}`}
                      onChange={() => toggleTask(t.id)}
                    />
                  </label>
                  <div className="task-copy">
                    <strong>{t.title}</strong>
                    <div className="task-meta">
                      <Tag color={t.color}>{t.goal}</Tag>
                      <Clock />
                      {t.duration} min <span>·</span>
                      <span>{t.done ? "Completed" : t.priority}</span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Focus on ${t.title}`}
                    onClick={() => openFocus(t.title)}
                  >
                    {t.done ? <CircleCheck className="text-success" /> : <Play size={14} />}
                  </Button>
                </div>
              ))}
            </div>
            <div className="task-footer">
              <Sparkles />
              Your plan balances your goals, deadlines, and when you're at your best.
            </div>
          </section>

          {/* ── Productivity chart (live data) ──────────────────────────── */}
          <section className="panel">
            <PanelHeader
              title="Weekly productivity"
              description={
                loadState.status === "success"
                  ? "Derived from your quiz and practice records this week."
                  : "Every focused hour is a step forward."
              }
              action={
                loadState.status === "error" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refresh}
                    aria-label="Retry loading chart data"
                  >
                    <RefreshCw size={12} />
                    Retry
                  </Button>
                ) : (
                  <select className="text-[9px] py-1 px-2" aria-label="Productivity period">
                    <option>This week</option>
                  </select>
                )
              }
            />

            {/* Chart summary row */}
            <div className="chart-summary">
              <div>
                {loadState.status === "loading" ? (
                  <span className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 size={14} className="animate-spin" />
                    Loading…
                  </span>
                ) : loadState.status === "error" ? (
                  <span className="flex items-center gap-2 text-muted-foreground text-xs">
                    <AlertTriangle size={13} className="text-amber-500" />
                    {loadState.message}
                  </span>
                ) : (
                  <>
                    <strong>
                      {weeklyTotal !== null ? weeklyTotal.toFixed(1) : "—"}
                      <small className="text-[10px] font-sans text-muted-foreground ml-1">
                        units
                      </small>
                    </strong>
                    <span className="text-muted-foreground text-[10px] ml-2">
                      accuracy-weighted assessment activity
                    </span>
                  </>
                )}
              </div>
              <div className="chart-legend">
                <span>
                  <i className="legend-dot" />
                  Learning
                </span>
                <span>
                  <i className="legend-dot cyan" />
                  Coding / Practice
                </span>
              </div>
            </div>

            <ProductivityChart
              {...(loadState.status === "success" ? { data: weeklyActivity } : {})}
            />
          </section>
        </div>

        <div className="dashboard-column">
          {/* Goals */}
          <section className="panel">
            <PanelHeader
              title="Your goals, in motion"
              action={
                <Link to="/goals">
                  <LinkLabel>View all</LinkLabel>
                </Link>
              }
            />
            <div className="goal-list">
              {goals.slice(0, 3).map((g) => (
                <Link to="/goals" key={g.title} className="goal-row">
                  <Ring value={g.progress} color={g.color} />
                  <div className="goal-copy">
                    <strong>{g.title}</strong>
                    <p>{g.subtitle}</p>
                  </div>
                  <ChevronRight size={13} className="text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>

          {/* Opportunities */}
          <section className="panel">
            <PanelHeader
              title={
                <>
                  Opportunity Radar<Tag color="emerald">12 NEW</Tag>
                </>
              }
              action={
                <Link to="/opportunities">
                  <LinkLabel>Explore</LinkLabel>
                </Link>
              }
            />
            {opportunities.slice(0, 3).map((o) => (
              <Link to="/opportunities" key={o.id} className="opportunity-mini">
                <div className={`company-logo ${o.logo === "DEV" ? "dev" : ""}`}>{o.logo}</div>
                <div className="flex-1">
                  <strong>{o.title}</strong>
                  <p>
                    {o.company} · {o.type}
                  </p>
                  <div className="mini-meta">
                    <Tag color="emerald">{o.match}% match</Tag>
                    <span>Closes {o.deadline}</span>
                  </div>
                </div>
                <ChevronRight size={12} className="text-muted-foreground mt-2" />
              </Link>
            ))}
          </section>
        </div>
      </div>

      {/* ── Bottom grid ────────────────────────────────────────────────── */}
      <div className="bottom-grid">
        {/* ── Learning mastery (live data) ────────────────────────────── */}
        <section className="panel">
          <PanelHeader
            title="Learning mastery"
            action={
              <Link to="/learning" aria-label="Explore learning mastery">
                <ArrowUpRight size={16} className="text-muted-foreground" />
              </Link>
            }
          />

          {loadState.status === "loading" && (
            <div className="flex items-center gap-2 px-5 pb-4 text-muted-foreground text-xs">
              <Loader2 size={14} className="animate-spin" />
              Loading subject data…
            </div>
          )}

          {loadState.status === "error" && (
            <div className="px-5 pb-4">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <AlertTriangle size={13} className="text-amber-500" />
                Could not load mastery data.
              </p>
              <Button variant="ghost" size="sm" onClick={refresh} className="mt-2 text-xs">
                <RefreshCw size={12} />
                Retry
              </Button>
            </div>
          )}

          {loadState.status === "success" && masterySubjects && (
            <div className="mastery-list">
              {masterySubjects.length === 0 ? (
                <p className="text-xs text-muted-foreground px-5 pb-4">
                  No records yet. Add marks in Performance Lab to see mastery.
                </p>
              ) : (
                masterySubjects.map((s) => (
                  <div key={s.subject} className="mastery-item">
                    <div>
                      <span>{s.subject}</span>
                      <span className="text-muted-foreground">{s.pct}%</span>
                    </div>
                    <Progress
                      value={s.pct}
                      color={s.pct >= 75 ? "emerald" : s.pct >= 60 ? "cyan" : "amber"}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Study rooms */}
        <section className="panel">
          <PanelHeader
            title="Better, together"
            action={
              <Tag color="emerald">
                <span className="live-dot" />
                LIVE
              </Tag>
            }
          />
          <div className="room-mini">
            <div className="flex items-center gap-2">
              <span className="icon-tile cyan">
                <Code2 />
              </span>
              <strong>DSA Sprint Room</strong>
            </div>
            <p>Linked lists &amp; problem solving</p>
            <div className="room-mini-footer">
              <div className="avatar-stack">
                <span className="avatar">RK</span>
                <span className="avatar cyan">SP</span>
                <span className="avatar emerald">AM</span>
                <span className="avatar">+5</span>
              </div>
              <Button variant="ghost" className="text-[9px] text-primary" size="sm" asChild>
                <Link to="/rooms">
                  Join room
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Weekly review */}
        <section className="panel review-panel">
          <Sparkles className="text-primary" size={18} />
          <h3>Your week. A little wiser.</h3>
          <p>
            You're building real momentum.
            <br />
            See your wins, patterns, and next moves.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] text-primary px-0"
            onClick={openReview}
          >
            Read my weekly review
            <ArrowUpRight />
          </Button>
        </section>
      </div>

      <div className="flex justify-between mt-5 items-center">
        <span className="text-[9px] text-muted-foreground flex items-center gap-1">
          <Zap size={11} className="text-warning" /> Progress isn't always loud. Keep showing up.
        </span>
        <Button variant="ghost" size="sm" className="focus-chip" onClick={() => openFocus()}>
          <Play size={10} />
          Start a focus session
        </Button>
      </div>
    </motion.div>
  );
}
