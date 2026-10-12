// Seed data matching the frontend's src/data/academics.ts exactly.
// Replace with database queries when a DB is connected.

import type { PerfRecord, Resource, Question, TopicStat, SubjectStat, GapAnalysis, GapRecord } from "../models/academics.model.js";

export const subjects = ["DSA", "Operating Systems", "DBMS", "Computer Networks"] as const;

export const topicsBySubject: Record<string, string[]> = {
  DSA: ["Arrays", "Linked Lists", "Trees", "Dynamic Programming"],
  "Operating Systems": ["Process Scheduling", "Deadlocks", "Memory Management"],
  DBMS: ["Normalization", "SQL Joins", "Transactions"],
  "Computer Networks": ["TCP/IP", "Routing", "Subnetting"],
};

// Mutable in-memory store (per process) — replace with DB persistence later.
export let records: PerfRecord[] = [
  { id: 1,  subject: "DSA",               topic: "Arrays",              score: 17, max: 20, date: "2026-09-02", type: "Quiz",       mistakes: "Off-by-one in loops" },
  { id: 2,  subject: "DSA",               topic: "Linked Lists",        score: 9,  max: 20, date: "2026-09-05", type: "Quiz",       mistakes: "Pointer updates when deleting nodes" },
  { id: 3,  subject: "DSA",               topic: "Dynamic Programming", score: 11, max: 25, date: "2026-09-12", type: "Exam",       mistakes: "Choosing the state" },
  { id: 4,  subject: "DSA",               topic: "Trees",               score: 15, max: 20, date: "2026-09-19", type: "Assignment", mistakes: "" },
  { id: 5,  subject: "Operating Systems", topic: "Process Scheduling",  score: 12, max: 20, date: "2026-09-08", type: "Quiz",       mistakes: "Round robin waiting time" },
  { id: 6,  subject: "Operating Systems", topic: "Deadlocks",           score: 16, max: 20, date: "2026-09-15", type: "Quiz",       mistakes: "" },
  { id: 7,  subject: "Operating Systems", topic: "Memory Management",   score: 10, max: 20, date: "2026-09-22", type: "Exam",       mistakes: "Page replacement counting" },
  { id: 8,  subject: "DBMS",              topic: "Normalization",       score: 18, max: 20, date: "2026-09-10", type: "Quiz",       mistakes: "" },
  { id: 9,  subject: "DBMS",              topic: "SQL Joins",           score: 13, max: 20, date: "2026-09-24", type: "Assignment", mistakes: "Outer vs inner join" },
  { id: 10, subject: "Computer Networks", topic: "Subnetting",          score: 8,  max: 20, date: "2026-09-26", type: "Quiz",       mistakes: "CIDR block sizes" },
  { id: 11, subject: "DSA",               topic: "Linked Lists",        score: 12, max: 20, date: "2026-10-03", type: "Practice",   mistakes: "Pointer updates when deleting nodes" },
  { id: 12, subject: "Computer Networks", topic: "TCP/IP",              score: 15, max: 20, date: "2026-10-06", type: "Quiz",       mistakes: "" },
];

let nextId = records.length + 1;

export function getRecords(): PerfRecord[] {
  return records;
}

export function addRecord(data: Omit<PerfRecord, "id">): PerfRecord {
  const record: PerfRecord = { id: nextId++, ...data };
  records.push(record);
  return record;
}

export function deleteRecord(id: number): boolean {
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  records.splice(idx, 1);
  return true;
}

export const resources: Resource[] = [
  { id: 1,  title: "Linked List visualised",        description: "Step-by-step pointer updates for insert and delete.",      subject: "DSA",               topic: "Linked Lists",       kind: "Video",    difficulty: "Easy",   minutes: 18, url: "https://visualgo.net/en/list" },
  { id: 2,  title: "Linked list problem set",        description: "Reverse, merge, and detect cycles.",                       subject: "DSA",               topic: "Linked Lists",       kind: "Practice", difficulty: "Medium", minutes: 45, url: "https://leetcode.com/tag/linked-list/" },
  { id: 3,  title: "DP patterns guide",              description: "How to define states and transitions.",                    subject: "DSA",               topic: "Dynamic Programming",kind: "Tutorial", difficulty: "Hard",   minutes: 40, url: "https://cp-algorithms.com/" },
  { id: 4,  title: "Array techniques notes",         description: "Two pointers, prefix sums, sliding window.",               subject: "DSA",               topic: "Arrays",             kind: "Notes",    difficulty: "Easy",   minutes: 15, url: "https://www.geeksforgeeks.org/array-data-structure/" },
  { id: 5,  title: "Tree traversals walkthrough",    description: "Inorder, preorder, level order with examples.",            subject: "DSA",               topic: "Trees",              kind: "Video",    difficulty: "Medium", minutes: 22, url: "https://visualgo.net/en/bst" },
  { id: 6,  title: "CPU scheduling worked examples", description: "FCFS, SJF, and round robin timelines.",                   subject: "Operating Systems", topic: "Process Scheduling", kind: "Notes",    difficulty: "Medium", minutes: 30, url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/" },
  { id: 7,  title: "Page replacement practice",      description: "FIFO, LRU, and optimal with page-fault counting.",        subject: "Operating Systems", topic: "Memory Management",  kind: "Practice", difficulty: "Medium", minutes: 35, url: "https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/" },
  { id: 8,  title: "Deadlock and Banker's algorithm",description: "Safe states explained with tables.",                      subject: "Operating Systems", topic: "Deadlocks",          kind: "Tutorial", difficulty: "Hard",   minutes: 25, url: "https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/" },
  { id: 9,  title: "SQL joins reference",            description: "Official PostgreSQL join documentation.",                  subject: "DBMS",              topic: "SQL Joins",          kind: "Docs",     difficulty: "Easy",   minutes: 20, url: "https://www.postgresql.org/docs/current/tutorial-join.html" },
  { id: 10, title: "Normalization in 15 minutes",    description: "1NF to BCNF with one running example.",                   subject: "DBMS",              topic: "Normalization",      kind: "Video",    difficulty: "Medium", minutes: 15, url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/" },
  { id: 11, title: "Subnetting cheat sheet",         description: "Block sizes, masks, and quick tricks.",                   subject: "Computer Networks", topic: "Subnetting",         kind: "Notes",    difficulty: "Easy",   minutes: 12, url: "https://www.geeksforgeeks.org/introduction-to-subnetting/" },
  { id: 12, title: "Subnetting drills",              description: "Practice splitting networks into subnets.",                subject: "Computer Networks", topic: "Subnetting",         kind: "Practice", difficulty: "Medium", minutes: 30, url: "https://subnettingpractice.com/" },
  { id: 13, title: "TCP/IP model overview",          description: "Layers and responsibilities.",                             subject: "Computer Networks", topic: "TCP/IP",             kind: "Notes",    difficulty: "Easy",   minutes: 15, url: "https://www.geeksforgeeks.org/tcp-ip-model/" },
  { id: 14, title: "ACID transactions explained",    description: "Isolation levels with examples.",                         subject: "DBMS",              topic: "Transactions",       kind: "Tutorial", difficulty: "Medium", minutes: 20, url: "https://www.postgresql.org/docs/current/transaction-iso.html" },
];

export const questionBank: Question[] = [
  { id: "ll1", subject: "DSA", topic: "Linked Lists",        difficulty: "Easy",   q: "What is the time complexity to insert at the head of a singly linked list?",    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],                                                                            answer: 0, hint: "You only change the head pointer.",      explanation: "A new node points to the old head and becomes the head: constant time." },
  { id: "ll2", subject: "DSA", topic: "Linked Lists",        difficulty: "Medium", q: "To delete node X (not the tail) in a singly list, which pointer must change?",  options: ["X.next", "prev.next", "head", "tail"],                                                                          answer: 1, hint: "Who points to X?",                       explanation: "The previous node's next must skip X and point to X.next." },
  { id: "ll3", subject: "DSA", topic: "Linked Lists",        difficulty: "Medium", q: "Floyd's algorithm detects…",                                                     options: ["Sorted order", "A cycle", "The middle only", "Duplicates"],                                                     answer: 1, hint: "Tortoise and hare.",                     explanation: "Two pointers at different speeds meet only if a cycle exists." },
  { id: "ll4", subject: "DSA", topic: "Linked Lists",        difficulty: "Hard",   q: "Reversing a linked list in place uses how much extra space?",                    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],                                                                            answer: 2, hint: "Three pointers.",                        explanation: "prev, curr and next are enough — constant extra space." },
  { id: "ar1", subject: "DSA", topic: "Arrays",              difficulty: "Easy",   q: "Accessing arr[i] in an array takes…",                                            options: ["O(1)", "O(n)", "O(log n)", "O(i)"],                                                                             answer: 0, hint: "Contiguous memory.",                    explanation: "Address = base + i × size, computed directly." },
  { id: "ar2", subject: "DSA", topic: "Arrays",              difficulty: "Medium", q: "Which technique finds a pair summing to K in a sorted array in O(n)?",           options: ["Binary search each", "Two pointers", "Bubble sort", "Recursion"],                                              answer: 1, hint: "Start at both ends.",                   explanation: "Move left or right pointer depending on the current sum." },
  { id: "dp1", subject: "DSA", topic: "Dynamic Programming", difficulty: "Medium", q: "DP applies when a problem has optimal substructure and…",                        options: ["Greedy choice", "Overlapping subproblems", "Sorted input", "No recursion"],                                    answer: 1, hint: "Why do we memoize?",                    explanation: "Repeated subproblems make caching worthwhile." },
  { id: "dp2", subject: "DSA", topic: "Dynamic Programming", difficulty: "Hard",   q: "0/1 knapsack with n items and capacity W runs in…",                              options: ["O(nW)", "O(2ⁿ) always", "O(n log n)", "O(W)"],                                                                 answer: 0, hint: "Table size.",                           explanation: "An n × W table, each cell O(1)." },
  { id: "tr1", subject: "DSA", topic: "Trees",               difficulty: "Easy",   q: "Inorder traversal of a BST gives…",                                              options: ["Random order", "Sorted order", "Reverse level order", "Preorder"],                                             answer: 1, hint: "Left, root, right.",                   explanation: "BST property makes inorder produce ascending keys." },
  { id: "ps1", subject: "Operating Systems", topic: "Process Scheduling", difficulty: "Medium", q: "Round robin mainly depends on…",                                    options: ["Burst length only", "Time quantum", "Priority only", "Arrival order only"],                                   answer: 1, hint: "Each process gets a slice.",             explanation: "The quantum controls how often the CPU switches." },
  { id: "ps2", subject: "Operating Systems", topic: "Process Scheduling", difficulty: "Easy",   q: "SJF minimises average…",                                            options: ["Waiting time", "Throughput", "Memory use", "Context switches"],                                                 answer: 0, hint: "Short jobs first.",                    explanation: "Running shortest jobs first gives the minimum average waiting time." },
  { id: "mm1", subject: "Operating Systems", topic: "Memory Management",  difficulty: "Medium", q: "Belady's anomaly can occur with…",                                   options: ["LRU", "Optimal", "FIFO", "LFU only"],                                                                           answer: 2, hint: "More frames, more faults?",             explanation: "FIFO can produce more faults with more frames." },
  { id: "dl1", subject: "Operating Systems", topic: "Deadlocks",          difficulty: "Medium", q: "Banker's algorithm is used for deadlock…",                           options: ["Detection", "Avoidance", "Recovery", "Ignoring"],                                                               answer: 1, hint: "It checks safe states first.",          explanation: "It only grants requests that keep the system in a safe state." },
  { id: "sj1", subject: "DBMS",              topic: "SQL Joins",          difficulty: "Easy",   q: "LEFT JOIN returns…",                                                 options: ["Only matches", "All left rows plus matches", "All right rows", "Cartesian product"],                           answer: 1, hint: "Which side is kept?",                   explanation: "Unmatched left rows appear with NULLs on the right." },
  { id: "nf1", subject: "DBMS",              topic: "Normalization",      difficulty: "Medium", q: "2NF removes…",                                                       options: ["Transitive dependency", "Partial dependency", "Multivalued dependency", "All redundancy"],                    answer: 1, hint: "Part of a composite key.",              explanation: "2NF removes attributes depending on only part of the key." },
  { id: "sn1", subject: "Computer Networks", topic: "Subnetting",         difficulty: "Easy",   q: "How many usable hosts in a /24 network?",                             options: ["256", "254", "255", "128"],                                                                                     answer: 1, hint: "Subtract network and broadcast.",       explanation: "2⁸ − 2 = 254 usable addresses." },
  { id: "sn2", subject: "Computer Networks", topic: "Subnetting",         difficulty: "Medium", q: "The subnet mask for /26 is…",                                         options: ["255.255.255.0", "255.255.255.192", "255.255.255.224", "255.255.255.128"],                                   answer: 1, hint: "26 − 24 = 2 extra bits.",               explanation: "Two bits set in the last octet: 128 + 64 = 192." },
  { id: "sn3", subject: "Computer Networks", topic: "Subnetting",         difficulty: "Hard",   q: "A /27 block contains how many addresses?",                            options: ["16", "32", "64", "30"],                                                                                         answer: 1, hint: "2^(32−27).",                            explanation: "2⁵ = 32 addresses (30 usable)." },
  { id: "tc1", subject: "Computer Networks", topic: "TCP/IP",             difficulty: "Easy",   q: "TCP is…",                                                             options: ["Connectionless", "Connection-oriented", "A routing protocol", "A physical layer"],                           answer: 1, hint: "Three-way handshake.",                  explanation: "TCP sets up a connection before sending data." },
];

// ── Derived stat helpers ──────────────────────────────────────────────────────

export function topicStats(recs: PerfRecord[]): TopicStat[] {
  const map = new Map<string, PerfRecord[]>();
  recs.forEach((r) => {
    const k = `${r.subject}|${r.topic}`;
    map.set(k, [...(map.get(k) ?? []), r]);
  });
  return [...map.entries()]
    .map(([k, rs]) => {
      const [subject, topic] = k.split("|") as [string, string];
      const sorted = [...rs].sort((a, b) => a.date.localeCompare(b.date));
      const pcts = sorted.map((r) => Math.round((r.score / r.max) * 100));
      const pct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
      const trend = pcts.length > 1 ? pcts[pcts.length - 1]! - pcts[0]! : 0;
      const mistakes = [...new Set(rs.map((r) => r.mistakes).filter(Boolean))];
      const status: TopicStat["status"] = pct < 60 ? "Weak" : pct < 75 ? "Revise" : "Strong";
      return { subject, topic, pct, attempts: rs.length, trend, mistakes, status };
    })
    .sort((a, b) => a.pct - b.pct);
}

export function subjectStats(recs: PerfRecord[]): SubjectStat[] {
  return subjects.map((s) => {
    const rs = recs.filter((r) => r.subject === s);
    const pct = rs.length
      ? Math.round((rs.reduce((a, r) => a + r.score / r.max, 0) / rs.length) * 100)
      : 0;
    return { subject: s, pct, count: rs.length };
  });
}

/**
 * Returns topics whose average accuracy is below the Strong threshold (75 %).
 *
 * Calculation — fully deterministic, derived only from stored records:
 *   1. Group records by (subject, topic).
 *   2. Sort each group chronologically (oldest first).
 *   3. pct   = round( mean of per-attempt percentages )
 *   4. trend = last_attempt_pct − first_attempt_pct
 *   5. status = "Weak" if pct < 60, "Revise" if 60–74.
 *   6. Attach the contributing records as `evidence` so callers can audit.
 *
 * Topics with no records (pct = 0) are excluded — a topic must have been
 * attempted at least once to appear as a gap.
 */
export function gapAnalysis(recs: PerfRecord[]): GapAnalysis[] {
  const map = new Map<string, PerfRecord[]>();
  recs.forEach((r) => {
    const k = `${r.subject}|${r.topic}`;
    map.set(k, [...(map.get(k) ?? []), r]);
  });

  const gaps: GapAnalysis[] = [];

  for (const [k, rs] of map.entries()) {
    const [subject, topic] = k.split("|") as [string, string];
    const sorted = [...rs].sort((a, b) => a.date.localeCompare(b.date));
    const pcts = sorted.map((r) => Math.round((r.score / r.max) * 100));
    const pct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);

    if (pct >= 75) continue; // Strong — not a gap

    const trend = pcts.length > 1 ? pcts[pcts.length - 1]! - pcts[0]! : 0;
    const mistakes = [...new Set(rs.map((r) => r.mistakes).filter(Boolean))];
    const status: "Weak" | "Revise" = pct < 60 ? "Weak" : "Revise";

    const evidence: GapRecord[] = sorted.map((r) => ({
      id: r.id,
      date: r.date,
      type: r.type,
      score: r.score,
      max: r.max,
      attemptPct: Math.round((r.score / r.max) * 100),
      mistakes: r.mistakes,
    }));

    gaps.push({ subject, topic, pct, attempts: rs.length, trend, mistakes, status, evidence });
  }

  // Sort weakest first so the highest-priority gap is at index 0
  return gaps.sort((a, b) => a.pct - b.pct);
}

export function pickQuestions(subject: string, topic: string, difficulty: string, count: number): Question[] {
  let pool = questionBank.filter(
    (x) => x.subject === subject && (topic === "Any" || x.topic === topic),
  );
  const exact = pool.filter((x) => difficulty === "Mixed" || x.difficulty === difficulty);
  pool = [...exact, ...pool.filter((x) => !exact.includes(x))];
  return pool.slice(0, count);
}
