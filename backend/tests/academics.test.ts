import { describe, it, expect } from "vitest";
import {
  topicStats,
  subjectStats,
  gapAnalysis,
  pickQuestions,
  subjects,
} from "../src/services/academics.data.js";
import type { PerfRecord } from "../src/models/academics.model.js";

// ── Shared fixtures ──────────────────────────────────────────────────────────

const sampleRecords: PerfRecord[] = [
  { id: 1, subject: "DSA", topic: "Arrays",       score: 18, max: 20, date: "2026-09-01", type: "Quiz",     mistakes: "" },
  { id: 2, subject: "DSA", topic: "Arrays",       score: 14, max: 20, date: "2026-09-10", type: "Quiz",     mistakes: "Off-by-one" },
  { id: 3, subject: "DSA", topic: "Linked Lists", score: 8,  max: 20, date: "2026-09-15", type: "Quiz",     mistakes: "Pointer bug" },
];

// Multi-attempt fixture for gap analysis tests
const gapRecords: PerfRecord[] = [
  // Linked Lists — two attempts, both Weak; trend = +15
  { id: 1, subject: "DSA", topic: "Linked Lists", score: 9,  max: 20, date: "2026-09-05", type: "Quiz",     mistakes: "Pointer updates" },
  { id: 2, subject: "DSA", topic: "Linked Lists", score: 12, max: 20, date: "2026-10-03", type: "Practice", mistakes: "Pointer updates" },
  // Dynamic Programming — single Weak attempt
  { id: 3, subject: "DSA", topic: "Dynamic Programming", score: 11, max: 25, date: "2026-09-12", type: "Exam", mistakes: "Choosing the state" },
  // Process Scheduling — Revise (60–74 %)
  { id: 4, subject: "Operating Systems", topic: "Process Scheduling", score: 12, max: 20, date: "2026-09-08", type: "Quiz", mistakes: "Round robin" },
  // Arrays — Strong (≥ 75 %); must NOT appear in gaps
  { id: 5, subject: "DSA", topic: "Arrays", score: 17, max: 20, date: "2026-09-02", type: "Quiz", mistakes: "" },
];

// ── topicStats ───────────────────────────────────────────────────────────────

describe("topicStats", () => {
  it("returns one entry per unique subject+topic", () => {
    const stats = topicStats(sampleRecords);
    expect(stats).toHaveLength(2);
  });

  it("marks a topic with pct < 60 as Weak", () => {
    const stats = topicStats(sampleRecords);
    const ll = stats.find((s) => s.topic === "Linked Lists");
    expect(ll?.status).toBe("Weak");
    expect(ll?.pct).toBe(40);
  });

  it("marks a topic with pct >= 75 as Strong", () => {
    const stats = topicStats(sampleRecords);
    const arr = stats.find((s) => s.topic === "Arrays");
    expect(arr?.status).toBe("Strong");
  });

  it("calculates trend as last pct minus first pct", () => {
    const stats = topicStats(sampleRecords);
    const arr = stats.find((s) => s.topic === "Arrays");
    // first attempt 18/20 = 90 %, last 14/20 = 70 % → trend = −20
    expect(arr?.trend).toBe(-20);
  });
});

// ── subjectStats ─────────────────────────────────────────────────────────────

describe("subjectStats", () => {
  it("returns one entry per subject", () => {
    const stats = subjectStats(sampleRecords);
    expect(stats).toHaveLength(subjects.length);
  });

  it("returns 0 pct for subjects with no records", () => {
    const stats = subjectStats(sampleRecords);
    const os = stats.find((s) => s.subject === "Operating Systems");
    expect(os?.pct).toBe(0);
    expect(os?.count).toBe(0);
  });
});

// ── gapAnalysis ──────────────────────────────────────────────────────────────

describe("gapAnalysis", () => {
  it("excludes topics with pct >= 75 (Strong)", () => {
    const gaps = gapAnalysis(gapRecords);
    const arraysGap = gaps.find((g) => g.topic === "Arrays");
    expect(arraysGap).toBeUndefined();
  });

  it("returns only Weak and Revise topics", () => {
    const gaps = gapAnalysis(gapRecords);
    gaps.forEach((g) => {
      expect(["Weak", "Revise"]).toContain(g.status);
    });
  });

  it("sorts results weakest-first (ascending pct)", () => {
    const gaps = gapAnalysis(gapRecords);
    for (let i = 1; i < gaps.length; i++) {
      expect(gaps[i]!.pct).toBeGreaterThanOrEqual(gaps[i - 1]!.pct);
    }
  });

  it("calculates pct as the mean of per-attempt percentages", () => {
    // attempt 1: 9/20 = 45 %, attempt 2: 12/20 = 60 % → mean = 52.5 → 53
    const gaps = gapAnalysis(gapRecords);
    const ll = gaps.find((g) => g.topic === "Linked Lists");
    expect(ll).toBeDefined();
    expect(ll?.pct).toBe(53);
  });

  it("calculates trend as last attempt pct minus first attempt pct", () => {
    // 60 − 45 = +15
    const gaps = gapAnalysis(gapRecords);
    const ll = gaps.find((g) => g.topic === "Linked Lists");
    expect(ll?.trend).toBe(15);
  });

  it("populates evidence with one entry per attempt, sorted oldest-first", () => {
    const gaps = gapAnalysis(gapRecords);
    const ll = gaps.find((g) => g.topic === "Linked Lists");
    expect(ll?.evidence).toHaveLength(2);
    // oldest first
    expect(ll?.evidence[0]?.date).toBe("2026-09-05");
    expect(ll?.evidence[1]?.date).toBe("2026-10-03");
  });

  it("sets attemptPct correctly on each evidence entry", () => {
    const gaps = gapAnalysis(gapRecords);
    const ll = gaps.find((g) => g.topic === "Linked Lists");
    expect(ll?.evidence[0]?.attemptPct).toBe(45); // 9/20
    expect(ll?.evidence[1]?.attemptPct).toBe(60); // 12/20
  });

  it("deduplicates mistakes across attempts", () => {
    const gaps = gapAnalysis(gapRecords);
    const ll = gaps.find((g) => g.topic === "Linked Lists");
    // both attempts have the same mistake string → deduped to 1 entry
    expect(ll?.mistakes).toHaveLength(1);
    expect(ll?.mistakes[0]).toBe("Pointer updates");
  });

  it("marks pct 60-74 as Revise", () => {
    const gaps = gapAnalysis(gapRecords);
    const ps = gaps.find((g) => g.topic === "Process Scheduling");
    expect(ps?.status).toBe("Revise");
    expect(ps?.pct).toBe(60);
  });

  it("returns empty array when all topics are Strong", () => {
    const strongRecords: PerfRecord[] = [
      { id: 1, subject: "DSA", topic: "Arrays", score: 20, max: 20, date: "2026-09-01", type: "Quiz", mistakes: "" },
    ];
    expect(gapAnalysis(strongRecords)).toHaveLength(0);
  });

  it("returns empty array for an empty record set", () => {
    expect(gapAnalysis([])).toHaveLength(0);
  });
});

// ── pickQuestions ────────────────────────────────────────────────────────────

describe("pickQuestions", () => {
  it("returns at most count questions", () => {
    const qs = pickQuestions("DSA", "Linked Lists", "Easy", 2);
    expect(qs.length).toBeLessThanOrEqual(2);
  });

  it("returns questions matching the subject and topic", () => {
    const qs = pickQuestions("DSA", "Arrays", "Mixed", 10);
    qs.forEach((q) => {
      expect(q.subject).toBe("DSA");
      expect(q.topic).toBe("Arrays");
    });
  });

  it("returns an empty array for an unknown subject", () => {
    const qs = pickQuestions("Unknown", "Any", "Mixed", 5);
    expect(qs).toHaveLength(0);
  });
});
