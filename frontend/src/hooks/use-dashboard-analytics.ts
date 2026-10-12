/**
 * use-dashboard-analytics.ts
 *
 * Fetches and derives the two analytics feeds that the Overview dashboard
 * connects to real backend data:
 *
 * 1. weeklyActivity — per-day learning intensity derived from PerfRecords.
 *    Metric definition (transparent, no AI):
 *      For each record on a given calendar day:
 *        contribution = (score / max)          ← accuracy fraction 0–1
 *      dailyLearning = sum(contribution) for that day
 *      dailyCoding   = sum(contribution) for Practice-type records only
 *    Values are capped at 6.0 to match the existing chart Y-axis.
 *    "Coding" is a subset of "Learning" — Practice records count for both.
 *
 * 2. subjectMastery — per-subject average accuracy from the backend.
 *    Metric: mean( score_i / max_i × 100 ) for all records per subject.
 *    Comes directly from GET /api/academics/stats/subjects.
 */

import { useEffect, useRef, useState } from "react";
import { getRecords, getSubjectStats, ApiError, type PerfRecord, type SubjectStat } from "@/api";

// ── Types ────────────────────────────────────────────────────────────────────

export interface WeeklyActivityPoint {
  day: string; // "Mon" | "Tue" | … | "Sun"
  learning: number; // 0–6 (capped)
  coding: number; // 0–6 (capped, subset of learning)
}

export type DashboardLoadState =
  { status: "loading" } | { status: "error"; message: string } | { status: "success" };

export interface DashboardAnalytics {
  weeklyActivity: WeeklyActivityPoint[];
  subjectMastery: SubjectStat[];
  loadState: DashboardLoadState;
  refresh: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * Returns the ISO date string (YYYY-MM-DD) for `daysAgo` days before today.
 */
function dateAgo(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/**
 * Derives the last-7-days weekly activity from stored PerfRecords.
 *
 * For each of the 7 days (oldest → newest / Mon–Sun in display order):
 *   learning = Σ (score / max)  for every record on that day   — capped at 6
 *   coding   = Σ (score / max)  for Practice records only      — capped at 6
 *
 * Days with no records → learning=0, coding=0 (real empty data, not hidden).
 */
export function buildWeeklyActivity(records: PerfRecord[]): WeeklyActivityPoint[] {
  // Build a map: ISO-date → { learning, coding }
  const byDate = new Map<string, { learning: number; coding: number }>();

  for (const r of records) {
    const contrib = r.max > 0 ? r.score / r.max : 0;
    const entry = byDate.get(r.date) ?? { learning: 0, coding: 0 };
    entry.learning += contrib;
    if (r.type === "Practice") entry.coding += contrib;
    byDate.set(r.date, entry);
  }

  // Collect the last 7 calendar days (today is index 6, 6 days ago is index 0)
  const days: WeeklyActivityPoint[] = [];
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const dateStr = dateAgo(daysAgo);
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

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardAnalytics(): DashboardAnalytics {
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityPoint[]>([]);
  const [subjectMastery, setSubjectMastery] = useState<SubjectStat[]>([]);
  const [loadState, setLoadState] = useState<DashboardLoadState>({ status: "loading" });
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadState({ status: "loading" });

    Promise.all([getRecords(), getSubjectStats()])
      .then(([recRes, subjRes]) => {
        if (controller.signal.aborted) return;
        setWeeklyActivity(buildWeeklyActivity(recRes.data));
        setSubjectMastery(subjRes.data);
        setLoadState({ status: "success" });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Could not load dashboard analytics.";
        setLoadState({ status: "error", message });
      });

    return () => controller.abort();
  }, [tick]);

  return {
    weeklyActivity,
    subjectMastery,
    loadState,
    refresh: () => setTick((t) => t + 1),
  };
}
