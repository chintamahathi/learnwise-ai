import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Target,
  Radar,
  Users,
  Radio,
  FolderKanban,
  BriefcaseBusiness,
  Library,
  ChartNoAxesCombined,
  Sparkles,
  Settings,
  GraduationCap,
} from "lucide-react";
export const navigation = [
  { title: "Overview", path: "/", icon: LayoutDashboard },
  { title: "My Learning", path: "/learning", icon: BookOpen },
  { title: "Performance Lab", path: "/academics", icon: GraduationCap },
  { title: "AI Planner", path: "/planner", icon: CalendarDays },
  { title: "My Goals", path: "/goals", icon: Target },
  { title: "Opportunity Radar", path: "/opportunities", icon: Radar },
  { title: "Campus Connect", path: "/campus", icon: Users },
  { title: "Study Rooms", path: "/rooms", icon: Radio },
  { title: "Projects", path: "/projects", icon: FolderKanban },
  { title: "Career Hub", path: "/career", icon: BriefcaseBusiness },
  { title: "Knowledge Hub", path: "/knowledge", icon: Library },
  { title: "Progress Reports", path: "/reports", icon: ChartNoAxesCombined },
  { title: "AI Assistant", path: "/assistant", icon: Sparkles },
  { title: "Settings", path: "/settings", icon: Settings },
] as const;
export const initialTasks = [
  {
    id: 1,
    title: "Master linked lists & solve 3 problems",
    goal: "DSA & Coding",
    duration: 45,
    priority: "High priority",
    color: "cyan",
    done: false,
  },
  {
    id: 2,
    title: "Revise operating systems — process scheduling",
    goal: "GATE 2027",
    duration: 60,
    priority: "High priority",
    color: "",
    done: false,
  },
  {
    id: 3,
    title: "Build the authentication flow for your project",
    goal: "Full-stack Dev",
    duration: 90,
    priority: "Medium",
    color: "emerald",
    done: false,
  },
  {
    id: 4,
    title: "Update resume with your latest project",
    goal: "Placement Prep",
    duration: 30,
    priority: "Medium",
    color: "amber",
    done: true,
  },
];
export const goals = [
  {
    title: "Crack GATE 2027",
    subtitle: "Computer Science · 8 subjects",
    progress: 64,
    color: "",
    icon: BookOpen,
  },
  {
    title: "Master DSA",
    subtitle: "128 / 200 problems solved",
    progress: 72,
    color: "cyan",
    icon: TerminalIcon,
  },
  {
    title: "Land a dream internship",
    subtitle: "3 applications in progress",
    progress: 45,
    color: "emerald",
    icon: BriefcaseBusiness,
  },
  {
    title: "Build a full-stack portfolio",
    subtitle: "2 / 4 projects completed",
    progress: 50,
    color: "amber",
    icon: FolderKanban,
  },
];
function TerminalIcon() {
  return null;
}
export const opportunities = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Google",
    type: "Internship",
    logo: "G",
    location: "Bengaluru · Hybrid",
    match: 96,
    deadline: "Oct 24",
    skills: ["DSA", "Python", "Problem solving"],
    description:
      "Work alongside engineers to build meaningful products. A sample opportunity for students interested in software engineering.",
    color: "cyan",
  },
  {
    id: 2,
    title: "Hack the Future 2026",
    company: "Devfolio",
    type: "Hackathon",
    logo: "DEV",
    location: "Online · 48 hours",
    match: 94,
    deadline: "Oct 20",
    skills: ["React", "AI/ML", "Teamwork"],
    description:
      "Turn your boldest idea into a working prototype with a team of builders. This is a fictional demo listing.",
    color: "",
  },
  {
    id: 3,
    title: "Women in Tech Scholarship",
    company: "Elevate Foundation",
    type: "Scholarship",
    logo: "E",
    location: "India · Remote",
    match: 91,
    deadline: "Nov 05",
    skills: ["Leadership", "Computer science"],
    description:
      "A sample scholarship recognizing ambitious students and their contributions to technology.",
    color: "emerald",
  },
  {
    id: 4,
    title: "Open Source Fellowship",
    company: "MLH",
    type: "Fellowship",
    logo: "M",
    location: "Remote · 12 weeks",
    match: 88,
    deadline: "Nov 12",
    skills: ["Git", "JavaScript", "Open source"],
    description:
      "Collaborate on open source projects and practice working with a distributed engineering team. Demo listing.",
    color: "amber",
  },
];
export const weekly = [
  { day: "Mon", learning: 2.1, coding: 1.3 },
  { day: "Tue", learning: 2.8, coding: 1.8 },
  { day: "Wed", learning: 2.4, coding: 1.5 },
  { day: "Thu", learning: 3.9, coding: 2.5 },
  { day: "Fri", learning: 3.5, coding: 2.2 },
  { day: "Sat", learning: 4.8, coding: 3.2 },
  { day: "Sun", learning: 3.7, coding: 2.6 },
];
export function downloadText(name: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// Sample students for the college admin demo view (not real people).
export const campusStudents = [
  {
    roll: "21B81A0501",
    name: "Alex Morgan",
    dept: "CSE",
    year: 3,
    progress: 72,
    attendance: 91,
    status: "On track",
  },
  {
    roll: "21B81A0512",
    name: "Priya Reddy",
    dept: "CSE",
    year: 3,
    progress: 88,
    attendance: 96,
    status: "On track",
  },
  {
    roll: "21B81A0433",
    name: "Rahul Varma",
    dept: "ECE",
    year: 3,
    progress: 41,
    attendance: 68,
    status: "Needs support",
  },
  {
    roll: "22B81A1207",
    name: "Sneha Iyer",
    dept: "IT",
    year: 2,
    progress: 64,
    attendance: 84,
    status: "On track",
  },
  {
    roll: "22B81A0548",
    name: "Karthik Rao",
    dept: "CSE",
    year: 2,
    progress: 35,
    attendance: 72,
    status: "Needs support",
  },
  {
    roll: "20B81A0219",
    name: "Ananya Das",
    dept: "EEE",
    year: 4,
    progress: 93,
    attendance: 98,
    status: "Placement ready",
  },
];
