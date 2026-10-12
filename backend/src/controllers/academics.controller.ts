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
  buildPersonalizedSet,
  getAttemptHistory,
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

// ── GET /api/academics/practice-set ──────────────────────────────────────────
/**
 * Returns a set of questions tailored to the student's performance.
 *
 * mode=personalized (default):
 *   Picks the weakest gap topic that has questions in the bank.
 *   Chooses difficulty deterministically from the gap's accuracy:
 *     pct < 50  → Easy   (rebuild confidence)
 *     pct 50–59 → Mixed  (consolidate fragile knowledge)
 *     pct 60–74 → Medium (push toward Strong)
 *   No AI is used — every decision is rule-based and auditable.
 *
 * mode=manual:
 *   Behaves exactly like GET /api/academics/questions.
 *   Required params: subject
 *   Optional params: topic (default "Any"), difficulty (default "Mixed"), count (default 5)
 *
 * Optional for both modes:
 *   count    — number of questions (1–20, default 5)
 *   status   — "Weak" | "Revise" | "all" (default "all") — only for personalized
 */
export function getPracticeSet(req: Request, res: Response) {
  const {
    mode = "personalized",
    subject,
    topic = "Any",
    difficulty = "Mixed",
    count: countStr = "5",
    status,
  } = req.query as Record<string, string | undefined>;

  const count = Math.min(Math.max(Number(countStr) || 5, 1), 20);

  if (mode === "manual") {
    if (!subject) {
      res.status(400).json({ error: "subject is required when mode=manual" });
      return;
    }
    const questions = pickQuestions(subject, topic, difficulty, count);
    res.json({
      data: {
        questions,
        subject,
        topic,
        difficulty,
        mode: "manual",
      },
    });
    return;
  }

  // Personalized mode
  const statusFilter =
    status === "Weak" || status === "Revise" ? (status as "Weak" | "Revise") : "all";
  const set = buildPersonalizedSet(getRecords(), { count, statusFilter });
  res.json({ data: set });
}

// ── POST /api/academics/attempts ─────────────────────────────────────────────
/**
 * Persists a completed practice session as a batch of PerfRecords.
 *
 * Body shape:
 *   {
 *     results: [
 *       { subject, topic, score, total, mistakes? }  // one per topic in the set
 *     ],
 *     date?: "YYYY-MM-DD"   // defaults to today
 *   }
 *
 * The backend saves one PerfRecord per result entry (type="Practice") and
 * returns the created records plus a session summary.  No separate attempt
 * table is needed — history is derived from the records table.
 */
const attemptResultSchema = z.object({
  subject:  z.string().min(1),
  topic:    z.string().min(1),
  score:    z.number().int().nonnegative(),
  total:    z.number().int().positive(),
  mistakes: z.string().default(""),
});

const submitAttemptSchema = z.object({
  results: z.array(attemptResultSchema).min(1).max(20),
  date:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export function submitAttempt(req: Request, res: Response) {
  const parsed = submitAttemptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const { results, date = new Date().toISOString().slice(0, 10) } = parsed.data;
  const createdIds: number[] = [];

  for (const r of results) {
    const rec = addRecord({
      subject:  r.subject,
      topic:    r.topic,
      score:    r.score,
      max:      r.total,
      date,
      type:     "Practice",
      mistakes: r.mistakes ?? "",
    });
    createdIds.push(rec.id);
  }

  const totalScore = results.reduce((a, r) => a + r.score, 0);
  const totalMax   = results.reduce((a, r) => a + r.total, 0);
  const subject    = results[0]!.subject;
  const topic      = results.length === 1 ? results[0]!.topic : "Mixed";

  res.status(201).json({
    data: {
      sessionId:  `${date}-${subject.replace(/\s+/g, "_")}-${topic.replace(/\s+/g, "_")}`,
      subject,
      topic,
      score:      totalScore,
      total:      totalMax,
      date,
      recordIds:  createdIds,
    },
  });
}

// ── GET /api/academics/attempts ───────────────────────────────────────────────
/**
 * Returns the student's practice-session history, derived from stored
 * PerfRecords with type="Practice".
 *
 * Groups records by date + subject + topic so each session appears once.
 * Sorted newest-first.  No separate attempt store needed.
 */
export function listAttempts(_req: Request, res: Response) {
  const history = getAttemptHistory(getRecords());
  res.json({ data: history, meta: { total: history.length } });
}
