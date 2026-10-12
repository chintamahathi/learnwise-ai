import type { Request, Response } from "express";
import { z } from "zod";
import {
  getRecords,
  addRecord,
  deleteRecord,
  resources,
  topicStats,
  subjectStats,
  gapAnalysis,
  recommendations,
  pickQuestions,
  subjects,
  topicsBySubject,
} from "../services/academics.data.js";

// ── GET /api/academics/records ────────────────────────────────────────────────
export function listRecords(_req: Request, res: Response) {
  res.json({ data: getRecords() });
}

// ── POST /api/academics/records ───────────────────────────────────────────────
const createRecordSchema = z.object({
  subject:  z.string().min(1),
  topic:    z.string().min(1),
  score:    z.number().nonnegative(),
  max:      z.number().positive(),
  date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  type:     z.enum(["Quiz", "Exam", "Assignment", "Practice"]),
  mistakes: z.string().default(""),
});

export function createRecord(req: Request, res: Response) {
  const result = createRecordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Validation failed", details: result.error.flatten() });
    return;
  }
  const record = addRecord(result.data);
  res.status(201).json({ data: record });
}

// ── DELETE /api/academics/records/:id ────────────────────────────────────────
export function removeRecord(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const deleted = deleteRecord(id);
  if (!deleted) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  res.status(204).send();
}

// ── GET /api/academics/stats/topics ──────────────────────────────────────────
export function listTopicStats(_req: Request, res: Response) {
  res.json({ data: topicStats(getRecords()) });
}

// ── GET /api/academics/stats/subjects ────────────────────────────────────────
export function listSubjectStats(_req: Request, res: Response) {
  res.json({ data: subjectStats(getRecords()) });
}

// ── GET /api/academics/resources ─────────────────────────────────────────────
export function listResources(req: Request, res: Response) {
  const { subject, topic } = req.query as Record<string, string | undefined>;
  let filtered = resources;
  if (subject) filtered = filtered.filter((r) => r.subject === subject);
  if (topic)   filtered = filtered.filter((r) => r.topic   === topic);
  res.json({ data: filtered });
}

// ── GET /api/academics/questions ─────────────────────────────────────────────
export function listQuestions(req: Request, res: Response) {
  const { subject, topic = "Any", difficulty = "Mixed", count = "5" } = req.query as Record<string, string | undefined>;
  if (!subject) {
    res.status(400).json({ error: "subject query param is required" });
    return;
  }
  const questions = pickQuestions(subject, topic, difficulty, Number(count));
  res.json({ data: questions });
}

// ── GET /api/academics/subjects ──────────────────────────────────────────────
export function listSubjects(_req: Request, res: Response) {
  res.json({ data: subjects, topicsBySubject });
}

// ── GET /api/academics/gaps ───────────────────────────────────────────────────
/**
 * Returns topics below the Strong threshold (pct < 75) derived purely from
 * stored performance records.  Each entry includes an `evidence` array of the
 * individual attempts so the client can display the source data, not just the
 * computed score.
 *
 * Optional query params:
 *   subject  — filter to one subject
 *   status   — "Weak" | "Revise" | "all" (default "all")
 */
export function listGaps(req: Request, res: Response) {
  const { subject, status = "all" } = req.query as Record<string, string | undefined>;
  let gaps = gapAnalysis(getRecords());
  if (subject) gaps = gaps.filter((g) => g.subject === subject);
  if (status === "Weak" || status === "Revise") gaps = gaps.filter((g) => g.status === status);
  res.json({
    data: gaps,
    meta: {
      total: gaps.length,
      weak: gaps.filter((g) => g.status === "Weak").length,
      revise: gaps.filter((g) => g.status === "Revise").length,
      /**
       * Calculation used:
       * pct   = round( mean( score_i / max_i * 100 ) for each attempt )
       * trend = last_attempt_pct − first_attempt_pct (chronological)
       * Weak  = pct < 60, Revise = 60–74, Strong = 75+ (excluded here)
       */
      calculation: "mean_attempt_pct",
    },
  });
}

// ── GET /api/academics/recommendations ───────────────────────────────────────
/**
 * Returns resources from the verified catalogue matched to the student's
 * actual gap topics (pct < 75 %), ordered weakest-first and by difficulty
 * within each topic (Easy before Hard).
 *
 * All returned resources carry source = "configured" — every URL in the
 * catalogue was hand-curated.  No AI-generated content is included.
 *
 * Optional query params:
 *   limit   — max resources to return (default 8, max 50)
 *   status  — "Weak" | "Revise" | "all" (default "all")
 */
export function listRecommendations(req: Request, res: Response) {
  const { status, limit: limitStr } = req.query as Record<string, string | undefined>;
  const limit = Math.min(Number(limitStr ?? "8") || 8, 50);
  const statusFilter =
    status === "Weak" || status === "Revise" ? (status as "Weak" | "Revise") : "all";

  const recs = recommendations(getRecords(), { limit, statusFilter });
  const gapTopics = new Set(recs.map((r) => r.matchedTopic)).size;

  res.json({
    data: recs,
    meta: {
      gapTopics,
      total: recs.length,
      algorithm:
        "topic_match_weakest_first_difficulty_asc — resources matched to gap topics from the verified catalogue only",
    },
  });
}
