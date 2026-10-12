/**
 * Tests for dashboard analytics calculations.
 *
 * buildWeeklyActivity lives in the frontend hook (use-dashboard-analytics.ts),
 * but the core metric is simple enough to test inline here by replicating the
 * same deterministic function so the backend test suite validates the contract.
 *
 * Metric definition (from the hook's JSDoc):
 *   For each record on a given calendar day:
 *     contribution = score / max   (accuracy fraction 0–1)
 *   dailyLearning = Σ contribution for all records on that day, capped at 6
 *   dailyCoding   = Σ contribution for Practice records only, capped at 6
 */

import { describe, it, expect } from "vitest";

interface Rec {
  score: number;
  max: number;
  date: string;
  type: string;
}

// ── Replicate the buildWeeklyActivity metric for testing ─────────────────────

function dateAgo(daysAgo: number, anchor: string): string {
  const d = new Date(anchor);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function buildWeeklyActivity(records: Rec[], anchor = "2026-10-12") {
  const byDate = new Map<string, { learning: number; coding: number }>();
  for (const r of records) {
    const contrib = r.max > 0 ? r.score / r.max : 0;
    const entry = byDate.get(r.date) ?? { learning: 0, coding: 0 };
    entry.learning += contrib;
    if (r.type === "Practice") entry.coding += contrib;
    byDate.set(r.date, entry);
  }
  const days = [];
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const dateStr = dateAgo(daysAgo, anchor);
    const d = new Date(dateStr);
    const dayName = DAY_NAMES[d.getDay()]!;
    const entry = byDate.get(dateStr) ?? { learning: 0, coding: 0 };
    days.push({
      day: dayName,
      learning: Math.min(Math.round(entry.learning * 10) / 10, 6),
      coding: Math.min(Math.round(entry.coding * 10) / 10, 6),
    });
  }
  return days;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("buildWeeklyActivity", () => {
  it("returns exactly 7 days", () => {
    const result = buildWeeklyActivity([]);
    expect(result).toHaveLength(7);
  });

  it("returns zeroes for all days when no records exist", () => {
    const result = buildWeeklyActivity([]);
    result.forEach((d) => {
      expect(d.learning).toBe(0);
      expect(d.coding).toBe(0);
    });
  });

  it("computes learning as accuracy fraction sum for a day", () => {
    // 17/20 = 0.85 contribution
    const rec: Rec = { score: 17, max: 20, date: "2026-10-12", type: "Quiz" };
    const result = buildWeeklyActivity([rec]);
    const today = result[result.length - 1]!; // anchor is 2026-10-12 = last day
    expect(today.learning).toBe(0.9); // round(0.85 * 10)/10 = 0.9 (nearest 0.1)
    expect(today.coding).toBe(0);    // Quiz is not Practice
  });

  it("adds coding contribution only for Practice records", () => {
    const recs: Rec[] = [
      { score: 10, max: 20, date: "2026-10-12", type: "Quiz" },     // learning +0.5
      { score: 12, max: 20, date: "2026-10-12", type: "Practice" }, // learning +0.6, coding +0.6
    ];
    const result = buildWeeklyActivity(recs);
    const today = result[result.length - 1]!;
    expect(today.learning).toBe(1.1); // 0.5 + 0.6
    expect(today.coding).toBe(0.6);
  });

  it("places records on the correct day slot", () => {
    // 3 days ago from anchor 2026-10-12 = 2026-10-09 (Friday)
    const rec: Rec = { score: 20, max: 20, date: "2026-10-09", type: "Quiz" };
    const result = buildWeeklyActivity([rec]);
    // Slot index: anchor is index 6, 3 days ago is index 3
    const slot = result[3]!;
    expect(slot.learning).toBe(1);
    expect(slot.day).toBe("Fri");
  });

  it("ignores records older than 7 days", () => {
    const rec: Rec = { score: 20, max: 20, date: "2026-10-05", type: "Quiz" }; // 7 days ago = outside window
    const result = buildWeeklyActivity([rec]);
    result.forEach((d) => expect(d.learning).toBe(0));
  });

  it("caps learning at 6 regardless of how many records exist on one day", () => {
    const recs: Rec[] = Array.from({ length: 20 }, (_, i) => ({
      score: 20,
      max: 20,
      date: "2026-10-12",
      type: "Quiz",
    }));
    const result = buildWeeklyActivity(recs);
    const today = result[result.length - 1]!;
    expect(today.learning).toBe(6);
  });

  it("caps coding at 6 as well", () => {
    const recs: Rec[] = Array.from({ length: 20 }, () => ({
      score: 20,
      max: 20,
      date: "2026-10-12",
      type: "Practice",
    }));
    const result = buildWeeklyActivity(recs);
    const today = result[result.length - 1]!;
    expect(today.coding).toBe(6);
  });

  it("coding is always <= learning on the same day", () => {
    const recs: Rec[] = [
      { score: 15, max: 20, date: "2026-10-12", type: "Quiz" },
      { score: 10, max: 20, date: "2026-10-12", type: "Practice" },
    ];
    const result = buildWeeklyActivity(recs);
    result.forEach((d) => expect(d.coding).toBeLessThanOrEqual(d.learning));
  });

  it("handles max=0 without division errors", () => {
    const rec: Rec = { score: 0, max: 0, date: "2026-10-12", type: "Quiz" };
    expect(() => buildWeeklyActivity([rec])).not.toThrow();
    const result = buildWeeklyActivity([rec]);
    const today = result[result.length - 1]!;
    expect(today.learning).toBe(0);
  });
});
