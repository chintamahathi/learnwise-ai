// ── LearnWise AI — backend API client ────────────────────────────────────────
//
// Base URL is read from the VITE_API_URL env var (set in .env.local for dev).
// Falls back to http://localhost:3001 so the app still works without a .env.local.

// ── Shared response types ────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  env: string;
  timestamp: string;
}

export interface SubjectsResponse {
  data: readonly string[];
  topicsBySubject: Record<string, string[]>;
}

export type StudentStatus = "On track" | "Needs support" | "Placement ready";

export interface CampusStudent {
  roll: string;
  name: string;
  dept: string;
  year: number;
  progress: number;
  attendance: number;
  status: StudentStatus;
}

export interface StudentsResponse {
  data: CampusStudent[];
}

// ── Academics types (mirror backend/src/models/academics.model.ts) ───────────

export type RecordType = "Quiz" | "Exam" | "Assignment" | "Practice";

export interface PerfRecord {
  id: number;
  subject: string;
  topic: string;
  score: number;
  max: number;
  date: string;
  type: RecordType;
  mistakes: string;
}

export type CreateRecordInput = Omit<PerfRecord, "id">;

export interface Question {
  id: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  q: string;
  options: string[];
  answer: number;
  hint: string;
  explanation: string;
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
   * Absent on older responses — treat missing as "configured".
   */
  source?: "configured" | "generated";
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
 * One entry from GET /api/academics/gaps.
 * Mirrors backend/src/models/academics.model.ts GapAnalysis exactly.
 */
export interface GapRecord {
  id: number;
  date: string;
  type: RecordType;
  score: number;
  max: number;
  /** Rounded percentage for this single attempt: round(score/max*100). */
  attemptPct: number;
  mistakes: string;
}

export interface GapAnalysis {
  subject: string;
  topic: string;
  /** Average of per-attempt percentages, rounded. */
  pct: number;
  attempts: number;
  /** Last attempt pct minus first attempt pct; positive = improving. */
  trend: number;
  mistakes: string[];
  status: "Weak" | "Revise";
  /** The individual records that produced this gap, sorted oldest-first. */
  evidence: GapRecord[];
}

export interface GapsResponse {
  data: GapAnalysis[];
  meta: {
    total: number;
    weak: number;
    revise: number;
    calculation: string;
  };
}

// ── Custom error class ───────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly originalCause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Base URL (from Vite env var, with fallback) ──────────────────────────────

const API_BASE_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:3001";

// ── Core fetch helper ────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (cause) {
    throw new ApiError(
      `Network error — could not reach the backend at ${API_BASE_URL}. Is it running?`,
      null,
      cause,
    );
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { error?: string };
      detail = body.error ? ` — ${body.error}` : "";
    } catch {
      // ignore JSON parse failure on error bodies
    }
    throw new ApiError(
      `${response.status} ${response.statusText}${detail} (${path})`,
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new ApiError(`Failed to parse JSON response from ${path}`, response.status, cause);
  }
}

// ── Health ───────────────────────────────────────────────────────────────────

export function checkBackend(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

// ── Subjects ─────────────────────────────────────────────────────────────────

export function getSubjects(): Promise<SubjectsResponse> {
  return request<SubjectsResponse>("/api/academics/subjects");
}

// ── Performance records ───────────────────────────────────────────────────────

export function getRecords(): Promise<{ data: PerfRecord[] }> {
  return request<{ data: PerfRecord[] }>("/api/academics/records");
}

export function createRecord(body: CreateRecordInput): Promise<{ data: PerfRecord }> {
  return request<{ data: PerfRecord }>("/api/academics/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteRecord(id: number): Promise<void> {
  return request<void>(`/api/academics/records/${id}`, { method: "DELETE" });
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getTopicStats(): Promise<{ data: TopicStat[] }> {
  return request<{ data: TopicStat[] }>("/api/academics/stats/topics");
}

export function getSubjectStats(): Promise<{ data: SubjectStat[] }> {
  return request<{ data: SubjectStat[] }>("/api/academics/stats/subjects");
}

// ── Resources ────────────────────────────────────────────────────────────────

export function getResources(params?: {
  subject?: string;
  topic?: string;
}): Promise<{ data: Resource[] }> {
  const qs = new URLSearchParams();
  if (params?.subject) qs.set("subject", params.subject);
  if (params?.topic) qs.set("topic", params.topic);
  const query = qs.toString();
  return request<{ data: Resource[] }>(`/api/academics/resources${query ? `?${query}` : ""}`);
}

// ── Recommendations ───────────────────────────────────────────────────────────

export interface RecommendedResource extends Resource {
  /** The gap topic this resource was matched to. */
  matchedTopic: string;
  /** The gap status that triggered this recommendation. */
  matchedStatus: "Weak" | "Revise";
  /** Accuracy percentage of the matched topic (0–100). */
  matchedPct: number;
  source: "configured"; // all server-side recommendations come from the verified catalogue
}

export interface RecommendationsResponse {
  data: RecommendedResource[];
  meta: {
    /** Number of gap topics queried. */
    gapTopics: number;
    /** Number of resources found across those topics. */
    total: number;
    /**
     * How matches are selected:
     * 1. For each gap topic (weakest-first) pull all resources for that topic.
     * 2. Within each topic: Easy before Medium before Hard (match difficulty to gap severity).
     * 3. Deduplicate by resource id.
     * 4. Cap at `limit` (default 8).
     * All resources come from the verified backend catalogue — no AI generation.
     */
    algorithm: string;
  };
}

/**
 * GET /api/academics/recommendations
 * Returns curated resources matched to the student's actual weak topics.
 *
 * Optional params:
 *   limit  — max resources to return (default 8)
 *   status — "Weak" | "Revise" | "all" (default "all")
 */
export function getRecommendations(params?: {
  limit?: number;
  status?: "Weak" | "Revise";
}): Promise<RecommendationsResponse> {
  const qs = new URLSearchParams();
  if (params?.limit != null) qs.set("limit", String(params.limit));
  if (params?.status) qs.set("status", params.status);
  const query = qs.toString();
  return request<RecommendationsResponse>(
    `/api/academics/recommendations${query ? `?${query}` : ""}`,
  );
}

// ── Gaps (learning-gap analysis) ─────────────────────────────────────────────

/**
 * GET /api/academics/gaps
 * Returns topics below the Strong threshold (pct < 75) with full evidence.
 * Optional filters: subject, status ("Weak" | "Revise")
 */
export function getGaps(params?: {
  subject?: string;
  status?: "Weak" | "Revise";
}): Promise<GapsResponse> {
  const qs = new URLSearchParams();
  if (params?.subject) qs.set("subject", params.subject);
  if (params?.status) qs.set("status", params.status);
  const query = qs.toString();
  return request<GapsResponse>(`/api/academics/gaps${query ? `?${query}` : ""}`);
}

// ── Questions ────────────────────────────────────────────────────────────────

export function getQuestions(params: {
  subject: string;
  topic?: string;
  difficulty?: string;
  count?: number;
}): Promise<{ data: Question[] }> {
  const qs = new URLSearchParams({ subject: params.subject });
  if (params.topic) qs.set("topic", params.topic);
  if (params.difficulty) qs.set("difficulty", params.difficulty);
  if (params.count != null) qs.set("count", String(params.count));
  return request<{ data: Question[] }>(`/api/academics/questions?${qs.toString()}`);
}

// ── Students ──────────────────────────────────────────────────────────────────

export function getStudents(): Promise<StudentsResponse> {
  return request<StudentsResponse>("/api/students");
}
