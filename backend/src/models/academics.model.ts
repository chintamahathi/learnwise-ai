// Academic performance data shapes.
// These mirror the frontend's src/data/academics.ts types exactly
// so the API contract matches what the UI already expects.

export type RecordType = "Quiz" | "Exam" | "Assignment" | "Practice";

export interface PerfRecord {
  id: number;
  subject: string;
  topic: string;
  score: number;
  max: number;
  date: string; // ISO date string: YYYY-MM-DD
  type: RecordType;
  mistakes: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  subject: string;
  topic: string;
  kind: "Video" | "Notes" | "Docs" | "Tutorial" | "Practice";
  difficulty: "Easy" | "Medium" | "Hard";
  minutes: number;
  url: string;
  /**
   * "configured" = hand-curated URL in the backend resource catalogue.
   * "generated"  = future AI-produced suggestion (not yet implemented).
   */
  source: "configured" | "generated";
}

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  q: string;
  options: string[];
  answer: number; // index into options
  hint: string;
  explanation: string;
}

export interface TopicStat {
  subject: string;
  topic: string;
  pct: number;
  attempts: number;
  trend: number;
  mistakes: string[];
  status: "Weak" | "Revise" | "Strong";
}

export interface SubjectStat {
  subject: string;
  pct: number;
  count: number;
}

/**
 * A learning-gap entry: one topic whose average accuracy is below the "Strong"
 * threshold (75 %).  Every contributing record is included so the UI can
 * surface the exact evidence behind the gap instead of an opaque score.
 *
 * Calculation (transparent, no AI):
 *   pct  = round( mean( score_i / max_i * 100 )  for each attempt i )
 *   trend = last_attempt_pct − first_attempt_pct  (chronological order)
 *   status = "Weak" if pct < 60, "Revise" if 60–74
 *
 * Records are sorted oldest-first so the trend direction is unambiguous.
 */
export interface GapRecord {
  id: number;
  date: string;
  type: RecordType;
  score: number;
  max: number;
  /** Rounded percentage for this single attempt. */
  attemptPct: number;
  mistakes: string;
}

export interface GapAnalysis {
  subject: string;
  topic: string;
  /** Average accuracy across all attempts (0–100). */
  pct: number;
  /** Number of recorded attempts for this topic. */
  attempts: number;
  /** Last attempt pct minus first attempt pct; positive = improving. */
  trend: number;
  /** Deduplicated list of non-empty mistake strings. */
  mistakes: string[];
  status: "Weak" | "Revise";
  /**
   * The individual records that produced this gap score, sorted
   * oldest-first.  Lets the frontend show "here is why" rather than
   * just a number.
   */
  evidence: GapRecord[];
}

/**
 * A resource recommendation entry.
 * All server-side recommendations come from the verified catalogue
 * (source = "configured").  A future AI integration would set
 * source = "generated" and include a disclaimer.
 */
export interface RecommendedResource extends Resource {
  source: "configured";
  /** The gap topic this resource was matched against. */
  matchedTopic: string;
  /** The gap status of the matched topic. */
  matchedStatus: "Weak" | "Revise";
  /** Accuracy percentage of the matched topic. */
  matchedPct: number;
}

/**
 * A personalized practice set returned by GET /api/academics/practice-set.
 *
 * When mode=personalized the backend uses the student's actual gap topics
 * (from gapAnalysis) to choose subject, topic and difficulty automatically.
 * The selection logic is fully deterministic — no AI is involved.
 */
export interface PracticeSet {
  questions: Question[];
  /** Subject the questions are drawn from. */
  subject: string;
  /** Topic the questions are drawn from ("Any" means mixed). */
  topic: string;
  /** Difficulty tier applied. */
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  /**
   * "personalized" — derived from the student's actual gap topics.
   * "manual"       — caller supplied subject/topic/difficulty explicitly.
   */
  mode: "personalized" | "manual";
  /**
   * Only present when mode = "personalized".
   * Explains which gap triggered the selection and why.
   */
  reason?: {
    gapPct: number;
    gapStatus: "Weak" | "Revise";
    difficultyChosen: string;
    rationale: string;
  };
}

/**
 * A single practice session stored via POST /api/academics/attempts.
 * The backend saves each topic result as a PerfRecord and returns a summary.
 */
export interface AttemptSummary {
  /** Session identifier (date + topic slug). */
  sessionId: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  date: string;
  /** IDs of the PerfRecords created for this attempt. */
  recordIds: number[];
}

/**
 * A practice session history entry derived from stored PerfRecords.
 * Returned by GET /api/academics/attempts.
 */
export interface AttemptHistory {
  sessionId: string;
  subject: string;
  topic: string;
  score: number;
  total: number;
  date: string;
  pct: number;
}
