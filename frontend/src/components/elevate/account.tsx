import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  Check,
  Download,
  Bell,
  Shield,
  Target,
  Plus,
  Layers,
  BookOpen,
  Code2,
  Radar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, Tag, Progress } from "./shared";
import { useDemo } from "./app-shell";
import { downloadText } from "@/data/demo";
import { toast } from "sonner";
import coreImage from "@/assets/intelligence-core.jpg";
export function Settings() {
  const { name, setName } = useDemo();
  const [draft, setDraft] = useState(name);
  const [email, setEmail] = useState("alex@example.com");
  const [college, setCollege] = useState("VJIT, Hyderabad");
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeading
        title="Make this space yours."
        description="Your profile, preferences, and the way you want to grow."
      />
      <div className="settings-layout">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setName(draft);
            setSaved(true);
            toast.success("Profile updated in this demo session");
          }}
        >
          <section className="settings-section">
            <h3>Personal information</h3>
            <div className="form-grid">
              <label className="form-stack">
                First name
                <input
                  required
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setSaved(false);
                  }}
                />
              </label>
              <label className="form-stack">
                Email address
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="form-stack">
                College
                <input required value={college} onChange={(e) => setCollege(e.target.value)} />
              </label>
              <label className="form-stack">
                Department
                <select>
                  <option>Computer Science</option>
                  <option>Electronics</option>
                  <option>Information Technology</option>
                </select>
              </label>
            </div>
          </section>
          <section className="settings-section">
            <h3>Academic journey</h3>
            <div className="form-grid">
              <label className="form-stack">
                Degree
                <select>
                  <option>B.Tech</option>
                  <option>B.E.</option>
                  <option>B.Sc.</option>
                  <option>M.Tech</option>
                </select>
              </label>
              <label className="form-stack">
                Academic year
                <select defaultValue="Year 3">
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                </select>
              </label>
            </div>
          </section>
          <section className="settings-section">
            <h3>Notifications & privacy</h3>
            {[
              {
                title: "Daily study reminders",
                detail: "A small nudge to make space for your goals.",
              },
              {
                title: "Opportunity alerts",
                detail: "Keep up with possibilities that fit your interests.",
              },
              {
                title: "Campus profile visibility",
                detail: "Let other students discover your demo profile.",
              },
            ].map((s) => (
              <div className="setting-row" key={s.title}>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.detail}</p>
                </div>
                <input type="checkbox" aria-label={s.title} defaultChecked />
              </div>
            ))}
          </section>
          <div className="flex items-center gap-4 mt-5">
            <Button type="submit">
              <Check />
              {saved ? "Updated for this session" : "Update demo profile"}
            </Button>
            <Tag color="neutral">CHANGES RESET ON RELOAD</Tag>
          </div>
        </form>
        <section className="settings-section">
          <h3>Account & data</h3>
          <div className="setting-row">
            <div>
              <strong>Export demo profile</strong>
              <p>Download the profile you’ve entered.</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Export profile"
              onClick={() =>
                downloadText(
                  "elevateos-profile.json",
                  JSON.stringify({ name: draft, email, college, demo: true }, null, 2),
                  "application/json",
                )
              }
            >
              <Download />
            </Button>
          </div>
          <div className="setting-row">
            <div>
              <strong>Connected integrations</strong>
              <p>No connected services. This is a frontend-only workspace.</p>
            </div>
            <Tag color="neutral">NOT CONNECTED</Tag>
          </div>
          <Button variant="ghost" className="text-primary" asChild>
            <Link to="/onboarding">
              Revisit my growth plan
              <ArrowRight />
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
export function Auth({ mode = "signin" }: { mode?: "signin" | "signup" | "forgot" | "verify" }) {
  const [sent, setSent] = useState(false);
  const { setRole, setRollNo } = useDemo();
  const navigate = useNavigate();
  const [pickRole, setPickRole] = useState<"student" | "admin">("student");
  const [roll, setRoll] = useState("");
  const title =
    mode === "signup"
      ? "Your next chapter starts here."
      : mode === "forgot"
        ? "Find your way back."
        : mode === "verify"
          ? "One more step."
          : "Welcome back, ambitious.";
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <Tag>
          <Sparkles size={12} />
          ELEVATE YOUR EVERYDAY
        </Tag>
        <h1>
          Your potential.
          <br />
          <span className="text-primary">Without limits.</span>
        </h1>
        <p className="text-muted-foreground leading-7">
          One intelligent space to learn, build, and become the person you’re working toward.
        </p>
        <img src={coreImage} width={1024} height={768} alt="ElevateOS intelligence sphere" />
      </div>
      <section>
        <Tag color="neutral">FRONTEND DEMO · NO REAL ACCOUNT</Tag>
        <h2 className="text-2xl mt-6 mb-3">{title}</h2>
        <p className="text-muted-foreground text-xs leading-6 mb-6">
          {mode === "forgot"
            ? "Preview the password recovery experience."
            : mode === "verify"
              ? "A sample verification screen for your future growth workspace."
              : "Your Goals. Your Growth. Your Next Move."}
        </p>
        {sent ? (
          <>
            <div className="panel p-6">
              <Check className="text-success mb-3" />
              <h3 className="text-base">
                {mode === "forgot" ? "Recovery preview ready" : "You’re ready to explore"}
              </h3>
              <p className="text-muted-foreground leading-7 mt-3">
                No email was sent and no account was created. Continue into the interactive demo.
              </p>
            </div>
            <Button className="w-full mt-5" asChild>
              <Link to={mode === "signup" ? "/onboarding" : "/"}>
                Continue to demo
                <ArrowRight />
              </Link>
            </Button>
          </>
        ) : mode === "verify" ? (
          <>
            <p className="text-muted-foreground leading-7">
              In a connected account experience, you would confirm your email before continuing. No
              verification email is sent in this preview.
            </p>
            <Button className="w-full mt-6" asChild>
              <Link to="/onboarding">
                Explore profile setup
                <ArrowRight />
              </Link>
            </Button>
          </>
        ) : (
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "signin") {
                setRole(pickRole);
                setRollNo(roll);
                toast.success(
                  pickRole === "admin"
                    ? "Signed in as college admin (demo)"
                    : "Signed in as " + roll + " (demo)",
                );
                navigate({ to: pickRole === "admin" ? "/admin" : "/" });
                return;
              }
              setSent(true);
            }}
          >
            {mode === "signup" && (
              <label>
                Your name
                <input required placeholder="Your full name" autoComplete="name" />
              </label>
            )}
            {mode === "signin" ? (
              <>
                <div className="role-switch" role="tablist" aria-label="Sign in as">
                  {(["student", "admin"] as const).map((r) => (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={pickRole === r}
                      key={r}
                      className={pickRole === r ? "chosen" : ""}
                      onClick={() => setPickRole(r)}
                    >
                      {r === "student" ? "Student" : "College admin"}
                    </button>
                  ))}
                </div>
                <label>
                  {pickRole === "student" ? "Roll number" : "Admin ID"}
                  <input
                    required
                    value={roll}
                    onChange={(e) => setRoll(e.target.value.toUpperCase())}
                    placeholder={pickRole === "student" ? "e.g. 21B81A0501" : "e.g. ADMIN-VJIT"}
                    autoComplete="username"
                  />
                </label>
              </>
            ) : (
              <label>
                Email address
                <input required type="email" placeholder="you@college.edu" autoComplete="email" />
              </label>
            )}
            {mode !== "forgot" && (
              <label>
                Password
                <input
                  required
                  type="password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </label>
            )}
            {mode === "signin" && (
              <Link to="/forgot-password" className="text-primary text-xs text-right">
                Forgot password?
              </Link>
            )}
            <Button type="submit">
              {mode === "signup"
                ? "Preview sign up"
                : mode === "forgot"
                  ? "Preview recovery"
                  : "Explore sign in"}
              <ArrowRight />
            </Button>
          </form>
        )}
        <div className="mt-6 text-center text-muted-foreground text-xs">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link to="/signin" className="text-primary">
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to ElevateOS?{" "}
              <Link to="/signup" className="text-primary">
                Start your journey
              </Link>
            </>
          )}
        </div>
        <Button variant="ghost" className="w-full mt-4" asChild>
          <Link to="/">Back to workspace</Link>
        </Button>
      </section>
    </div>
  );
}
export function Onboarding() {
  const { setName } = useDemo();
  const [step, setStep] = useState(0);
  const [name, setDraftName] = useState("Alex");
  const [selected, setSelected] = useState(["GATE preparation", "DSA & coding"]);
  const [hours, setHours] = useState(3);
  const [period, setPeriod] = useState("Evening");
  const [level, setLevel] = useState("Intermediate");
  const goalOptions = [
    "GATE preparation",
    "DSA & coding",
    "Placements",
    "Internships",
    "Hackathons",
    "Projects",
    "AI / ML",
    "Full-stack development",
    "College exams",
    "Research",
  ];
  return (
    <div className="max-w-3xl mx-auto py-6">
      <PageHeading
        title="Let’s build your next chapter."
        description="A growth plan that begins with you."
      />
      <div className="flex justify-between items-center mb-4">
        <Tag>STEP {Math.min(step + 1, 4)} OF 4</Tag>
        <span className="text-muted-foreground text-xs">
          {["Your world", "Your ambitions", "Your rhythm", "Your next move"][step]}
        </span>
      </div>
      <Progress value={(step + 1) * 25} />
      <div className="py-8">
        <h2 className="text-2xl mb-3">
          {
            [
              "First, tell us a little about you.",
              "What are you growing toward?",
              "Find a rhythm that fits your life.",
              "Your growth plan is taking shape.",
            ][step]
          }
        </h2>
        <p className="text-muted-foreground text-xs mb-7">
          {
            [
              "A personal space starts with a personal introduction.",
              "Choose the goals that matter to you.",
              "A realistic plan is a plan you can return to.",
              "A sample starting point. Yours to explore and adjust.",
            ][step]
          }
        </p>
        {step === 0 ? (
          <div className="form-grid">
            <label className="form-stack">
              First name
              <input required value={name} onChange={(e) => setDraftName(e.target.value)} />
            </label>
            <label className="form-stack">
              College
              <input placeholder="Your college" defaultValue="VJIT, Hyderabad" />
            </label>
            <label className="form-stack">
              Department
              <select>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Information Technology</option>
              </select>
            </label>
            <label className="form-stack">
              Academic year
              <select defaultValue="Year 3">
                <option>Year 1</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4</option>
              </select>
            </label>
          </div>
        ) : step === 1 ? (
          <div className="onboarding-options">
            {goalOptions.map((g) => (
              <Button
                variant="ghost"
                key={g}
                className={`onboarding-option ${selected.includes(g) ? "chosen" : ""}`}
                onClick={() =>
                  setSelected((s) => (s.includes(g) ? s.filter((v) => v !== g) : [...s, g]))
                }
              >
                {selected.includes(g) ? <Check /> : <Plus />}
                {g}
              </Button>
            ))}
          </div>
        ) : step === 2 ? (
          <div className="form-stack">
            <label>
              Daily study hours: {hours}
              <input
                type="range"
                min={1}
                max={8}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
            </label>
            <label>
              Preferred study time
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </label>
            <label>
              Current skill level
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label>
              Learning preference
              <select>
                <option>Practice-first learning</option>
                <option>Videos & walkthroughs</option>
                <option>Reading & notes</option>
              </select>
            </label>
            <label className="flex-row items-center">
              <input type="checkbox" defaultChecked />
              Daily study reminders
            </label>
          </div>
        ) : (
          <section className="panel feature-card">
            <Tag color="emerald">YOUR SAMPLE PERSONALIZED PLAN</Tag>
            <h3>{name}, your next move starts small.</h3>
            <p>
              {hours} hours each {period.toLowerCase()} · {level} level
            </p>
            <div className="flex flex-wrap gap-2 my-5">
              {selected.map((g) => (
                <Tag color="cyan" key={g}>
                  {g}
                </Tag>
              ))}
            </div>
            <h4 className="text-base mt-5">A rhythm to begin with</h4>
            <p>
              {Math.round(hours * 60 * 0.4)} minutes: strengthen your fundamentals.
              <br />
              {Math.round(hours * 60 * 0.4)} minutes: deliberate practice for your top goal.
              <br />
              {Math.round(hours * 60 * 0.2)} minutes: reflect, revise, and plan your next move.
            </p>
          </section>
        )}
      </div>
      <div className="flex justify-between border-t border-border pt-5">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        {step < 3 ? (
          <Button
            disabled={step === 0 ? !name.trim() : step === 1 ? selected.length === 0 : false}
            onClick={() => setStep((s) => s + 1)}
          >
            Continue
            <ArrowRight />
          </Button>
        ) : (
          <Button asChild onClick={() => setName(name)}>
            <Link to="/">
              Explore my workspace
              <Sparkles />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
export function Welcome() {
  return (
    <>
      <section className="welcome-hero">
        <div className="hero-eyebrow">
          <Layers size={15} /> ELEVATEOS · THE STUDENT GROWTH OS
        </div>
        <h1>
          YOUR POTENTIAL.
          <br />
          <span>WITHOUT LIMITS.</span>
        </h1>
        <p>
          One intelligent space to master your subjects, build your future, discover opportunities,
          and become the person you’re working toward.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Button className="primary-button" size="lg" asChild>
            <Link to="/onboarding">
              Build My Growth Plan
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/">Explore ElevateOS</Link>
          </Button>
        </div>
        <Tag color="neutral">INTERACTIVE FRONTEND PREVIEW</Tag>
        <img
          src={coreImage}
          width={1024}
          height={768}
          alt="ElevateOS luminous intelligence sphere"
        />
      </section>
      <div className="page-heading mt-8">
        <div>
          <h2 className="text-2xl">One space. Every next move.</h2>
          <p className="mt-2">Less switching between tools. More moving toward what matters.</p>
        </div>
      </div>
      <div className="item-grid">
        {[
          {
            title: "Learn with clarity",
            text: "Find your gaps. Strengthen your foundations.",
            icon: BookOpen,
            path: "/learning",
          },
          {
            title: "Plan with purpose",
            text: "Make space for focused, meaningful work.",
            icon: Sparkles,
            path: "/planner",
          },
          {
            title: "Discover your next door",
            text: "Explore opportunities aligned with your ambition.",
            icon: Radar,
            path: "/opportunities",
          },
        ].map((f) => (
          <section className="panel feature-card" key={f.title}>
            <span className="icon-tile cyan">
              <f.icon />
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <Button variant="ghost" className="text-primary px-0" asChild>
              <Link to={f.path}>
                Explore
                <ArrowRight />
              </Link>
            </Button>
          </section>
        ))}
      </div>
    </>
  );
}
