// Sample academic performance data and local question bank (simulated, not real student records).
export type PerfRecord = {
  id: number;
  subject: string;
  topic: string;
  score: number;
  max: number;
  date: string;
  type: "Quiz" | "Exam" | "Assignment" | "Practice";
  mistakes: string;
};
export const subjects = ["DSA", "Operating Systems", "DBMS", "Computer Networks"] as const;
export const topicsBySubject: Record<string, string[]> = {
  DSA: ["Arrays", "Linked Lists", "Trees", "Dynamic Programming"],
  "Operating Systems": ["Process Scheduling", "Deadlocks", "Memory Management"],
  DBMS: ["Normalization", "SQL Joins", "Transactions"],
  "Computer Networks": ["TCP/IP", "Routing", "Subnetting"],
};
export const initialRecords: PerfRecord[] = [
  {
    id: 1,
    subject: "DSA",
    topic: "Arrays",
    score: 17,
    max: 20,
    date: "2026-09-02",
    type: "Quiz",
    mistakes: "Off-by-one in loops",
  },
  {
    id: 2,
    subject: "DSA",
    topic: "Linked Lists",
    score: 9,
    max: 20,
    date: "2026-09-05",
    type: "Quiz",
    mistakes: "Pointer updates when deleting nodes",
  },
  {
    id: 3,
    subject: "DSA",
    topic: "Dynamic Programming",
    score: 11,
    max: 25,
    date: "2026-09-12",
    type: "Exam",
    mistakes: "Choosing the state",
  },
  {
    id: 4,
    subject: "DSA",
    topic: "Trees",
    score: 15,
    max: 20,
    date: "2026-09-19",
    type: "Assignment",
    mistakes: "",
  },
  {
    id: 5,
    subject: "Operating Systems",
    topic: "Process Scheduling",
    score: 12,
    max: 20,
    date: "2026-09-08",
    type: "Quiz",
    mistakes: "Round robin waiting time",
  },
  {
    id: 6,
    subject: "Operating Systems",
    topic: "Deadlocks",
    score: 16,
    max: 20,
    date: "2026-09-15",
    type: "Quiz",
    mistakes: "",
  },
  {
    id: 7,
    subject: "Operating Systems",
    topic: "Memory Management",
    score: 10,
    max: 20,
    date: "2026-09-22",
    type: "Exam",
    mistakes: "Page replacement counting",
  },
  {
    id: 8,
    subject: "DBMS",
    topic: "Normalization",
    score: 18,
    max: 20,
    date: "2026-09-10",
    type: "Quiz",
    mistakes: "",
  },
  {
    id: 9,
    subject: "DBMS",
    topic: "SQL Joins",
    score: 13,
    max: 20,
    date: "2026-09-24",
    type: "Assignment",
    mistakes: "Outer vs inner join",
  },
  {
    id: 10,
    subject: "Computer Networks",
    topic: "Subnetting",
    score: 8,
    max: 20,
    date: "2026-09-26",
    type: "Quiz",
    mistakes: "CIDR block sizes",
  },
  {
    id: 11,
    subject: "DSA",
    topic: "Linked Lists",
    score: 12,
    max: 20,
    date: "2026-10-03",
    type: "Practice",
    mistakes: "Pointer updates when deleting nodes",
  },
  {
    id: 12,
    subject: "Computer Networks",
    topic: "TCP/IP",
    score: 15,
    max: 20,
    date: "2026-10-06",
    type: "Quiz",
    mistakes: "",
  },
];
export type Resource = {
  id: number;
  title: string;
  description: string;
  subject: string;
  topic: string;
  kind: "Video" | "Notes" | "Docs" | "Tutorial" | "Practice";
  difficulty: "Easy" | "Medium" | "Hard";
  minutes: number;
  url: string;
};
export const resources: Resource[] = [
  {
    id: 1,
    title: "Linked List visualised",
    description: "Step-by-step pointer updates for insert and delete.",
    subject: "DSA",
    topic: "Linked Lists",
    kind: "Video",
    difficulty: "Easy",
    minutes: 18,
    url: "https://visualgo.net/en/list",
  },
  {
    id: 2,
    title: "Linked list problem set",
    description: "Reverse, merge, and detect cycles.",
    subject: "DSA",
    topic: "Linked Lists",
    kind: "Practice",
    difficulty: "Medium",
    minutes: 45,
    url: "https://leetcode.com/tag/linked-list/",
  },
  {
    id: 3,
    title: "DP patterns guide",
    description: "How to define states and transitions.",
    subject: "DSA",
    topic: "Dynamic Programming",
    kind: "Tutorial",
    difficulty: "Hard",
    minutes: 40,
    url: "https://cp-algorithms.com/",
  },
  {
    id: 4,
    title: "Array techniques notes",
    description: "Two pointers, prefix sums, sliding window.",
    subject: "DSA",
    topic: "Arrays",
    kind: "Notes",
    difficulty: "Easy",
    minutes: 15,
    url: "https://www.geeksforgeeks.org/array-data-structure/",
  },
  {
    id: 5,
    title: "Tree traversals walkthrough",
    description: "Inorder, preorder, level order with examples.",
    subject: "DSA",
    topic: "Trees",
    kind: "Video",
    difficulty: "Medium",
    minutes: 22,
    url: "https://visualgo.net/en/bst",
  },
  {
    id: 6,
    title: "CPU scheduling worked examples",
    description: "FCFS, SJF, and round robin timelines.",
    subject: "Operating Systems",
    topic: "Process Scheduling",
    kind: "Notes",
    difficulty: "Medium",
    minutes: 30,
    url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/",
  },
  {
    id: 7,
    title: "Page replacement practice",
    description: "FIFO, LRU, and optimal with page-fault counting.",
    subject: "Operating Systems",
    topic: "Memory Management",
    kind: "Practice",
    difficulty: "Medium",
    minutes: 35,
    url: "https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/",
  },
  {
    id: 8,
    title: "Deadlock and Banker’s algorithm",
    description: "Safe states explained with tables.",
    subject: "Operating Systems",
    topic: "Deadlocks",
    kind: "Tutorial",
    difficulty: "Hard",
    minutes: 25,
    url: "https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/",
  },
  {
    id: 9,
    title: "SQL joins reference",
    description: "Official PostgreSQL join documentation.",
    subject: "DBMS",
    topic: "SQL Joins",
    kind: "Docs",
    difficulty: "Easy",
    minutes: 20,
    url: "https://www.postgresql.org/docs/current/tutorial-join.html",
  },
  {
    id: 10,
    title: "Normalization in 15 minutes",
    description: "1NF to BCNF with one running example.",
    subject: "DBMS",
    topic: "Normalization",
    kind: "Video",
    difficulty: "Medium",
    minutes: 15,
    url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/",
  },
  {
    id: 11,
    title: "Subnetting cheat sheet",
    description: "Block sizes, masks, and quick tricks.",
    subject: "Computer Networks",
    topic: "Subnetting",
    kind: "Notes",
    difficulty: "Easy",
    minutes: 12,
    url: "https://www.geeksforgeeks.org/introduction-to-subnetting/",
  },
  {
    id: 12,
    title: "Subnetting drills",
    description: "Practice splitting networks into subnets.",
    subject: "Computer Networks",
    topic: "Subnetting",
    kind: "Practice",
    difficulty: "Medium",
    minutes: 30,
    url: "https://subnettingpractice.com/",
  },
  {
    id: 13,
    title: "TCP/IP model overview",
    description: "Layers and responsibilities.",
    subject: "Computer Networks",
    topic: "TCP/IP",
    kind: "Notes",
    difficulty: "Easy",
    minutes: 15,
    url: "https://www.geeksforgeeks.org/tcp-ip-model/",
  },
  {
    id: 14,
    title: "ACID transactions explained",
    description: "Isolation levels with examples.",
    subject: "DBMS",
    topic: "Transactions",
    kind: "Tutorial",
    difficulty: "Medium",
    minutes: 20,
    url: "https://www.postgresql.org/docs/current/transaction-iso.html",
  },
];
export type Question = {
  id: string;
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  q: string;
  options: string[];
  answer: number;
  hint: string;
  explanation: string;
};
const q = (
  id: string,
  subject: string,
  topic: string,
  difficulty: Question["difficulty"],
  text: string,
  options: string[],
  answer: number,
  hint: string,
  explanation: string,
): Question => ({ id, subject, topic, difficulty, q: text, options, answer, hint, explanation });
export const questionBank: Question[] = [
  q(
    "ll1",
    "DSA",
    "Linked Lists",
    "Easy",
    "What is the time complexity to insert at the head of a singly linked list?",
    ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    0,
    "You only change the head pointer.",
    "A new node points to the old head and becomes the head: constant time.",
  ),
  q(
    "ll2",
    "DSA",
    "Linked Lists",
    "Medium",
    "To delete node X (not the tail) in a singly list, which pointer must change?",
    ["X.next", "prev.next", "head", "tail"],
    1,
    "Who points to X?",
    "The previous node’s next must skip X and point to X.next.",
  ),
  q(
    "ll3",
    "DSA",
    "Linked Lists",
    "Medium",
    "Floyd’s algorithm detects…",
    ["Sorted order", "A cycle", "The middle only", "Duplicates"],
    1,
    "Tortoise and hare.",
    "Two pointers at different speeds meet only if a cycle exists.",
  ),
  q(
    "ll4",
    "DSA",
    "Linked Lists",
    "Hard",
    "Reversing a linked list in place uses how much extra space?",
    ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    2,
    "Three pointers.",
    "prev, curr and next are enough — constant extra space.",
  ),
  q(
    "ar1",
    "DSA",
    "Arrays",
    "Easy",
    "Accessing arr[i] in an array takes…",
    ["O(1)", "O(n)", "O(log n)", "O(i)"],
    0,
    "Contiguous memory.",
    "Address = base + i × size, computed directly.",
  ),
  q(
    "ar2",
    "DSA",
    "Arrays",
    "Medium",
    "Which technique finds a pair summing to K in a sorted array in O(n)?",
    ["Binary search each", "Two pointers", "Bubble sort", "Recursion"],
    1,
    "Start at both ends.",
    "Move left or right pointer depending on the current sum.",
  ),
  q(
    "dp1",
    "DSA",
    "Dynamic Programming",
    "Medium",
    "DP applies when a problem has optimal substructure and…",
    ["Greedy choice", "Overlapping subproblems", "Sorted input", "No recursion"],
    1,
    "Why do we memoize?",
    "Repeated subproblems make caching worthwhile.",
  ),
  q(
    "dp2",
    "DSA",
    "Dynamic Programming",
    "Hard",
    "0/1 knapsack with n items and capacity W runs in…",
    ["O(nW)", "O(2ⁿ) always", "O(n log n)", "O(W)"],
    0,
    "Table size.",
    "An n × W table, each cell O(1).",
  ),
  q(
    "tr1",
    "DSA",
    "Trees",
    "Easy",
    "Inorder traversal of a BST gives…",
    ["Random order", "Sorted order", "Reverse level order", "Preorder"],
    1,
    "Left, root, right.",
    "BST property makes inorder produce ascending keys.",
  ),
  q(
    "ps1",
    "Operating Systems",
    "Process Scheduling",
    "Medium",
    "Round robin mainly depends on…",
    ["Burst length only", "Time quantum", "Priority only", "Arrival order only"],
    1,
    "Each process gets a slice.",
    "The quantum controls how often the CPU switches.",
  ),
  q(
    "ps2",
    "Operating Systems",
    "Process Scheduling",
    "Easy",
    "SJF minimises average…",
    ["Waiting time", "Throughput", "Memory use", "Context switches"],
    0,
    "Short jobs first.",
    "Running shortest jobs first gives the minimum average waiting time.",
  ),
  q(
    "mm1",
    "Operating Systems",
    "Memory Management",
    "Medium",
    "Belady’s anomaly can occur with…",
    ["LRU", "Optimal", "FIFO", "LFU only"],
    2,
    "More frames, more faults?",
    "FIFO can produce more faults with more frames.",
  ),
  q(
    "dl1",
    "Operating Systems",
    "Deadlocks",
    "Medium",
    "Banker’s algorithm is used for deadlock…",
    ["Detection", "Avoidance", "Recovery", "Ignoring"],
    1,
    "It checks safe states first.",
    "It only grants requests that keep the system in a safe state.",
  ),
  q(
    "sj1",
    "DBMS",
    "SQL Joins",
    "Easy",
    "LEFT JOIN returns…",
    ["Only matches", "All left rows plus matches", "All right rows", "Cartesian product"],
    1,
    "Which side is kept?",
    "Unmatched left rows appear with NULLs on the right.",
  ),
  q(
    "nf1",
    "DBMS",
    "Normalization",
    "Medium",
    "2NF removes…",
    ["Transitive dependency", "Partial dependency", "Multivalued dependency", "All redundancy"],
    1,
    "Part of a composite key.",
    "2NF removes attributes depending on only part of the key.",
  ),
  q(
    "sn1",
    "Computer Networks",
    "Subnetting",
    "Easy",
    "How many usable hosts in a /24 network?",
    ["256", "254", "255", "128"],
    1,
    "Subtract network and broadcast.",
    "2⁸ − 2 = 254 usable addresses.",
  ),
  q(
    "sn2",
    "Computer Networks",
    "Subnetting",
    "Medium",
    "The subnet mask for /26 is…",
    ["255.255.255.0", "255.255.255.192", "255.255.255.224", "255.255.255.128"],
    1,
    "26 − 24 = 2 extra bits.",
    "Two bits set in the last octet: 128 + 64 = 192.",
  ),
  q(
    "sn3",
    "Computer Networks",
    "Subnetting",
    "Hard",
    "A /27 block contains how many addresses?",
    ["16", "32", "64", "30"],
    1,
    "2^(32−27).",
    "2⁵ = 32 addresses (30 usable).",
  ),
  q(
    "tc1",
    "Computer Networks",
    "TCP/IP",
    "Easy",
    "TCP is…",
    ["Connectionless", "Connection-oriented", "A routing protocol", "A physical layer"],
    1,
    "Three-way handshake.",
    "TCP sets up a connection before sending data.",
  ),
];
export type TopicStat = {
  subject: string;
  topic: string;
  pct: number;
  attempts: number;
  trend: number;
  mistakes: string[];
  status: "Weak" | "Revise" | "Strong";
};
export function topicStats(records: PerfRecord[]): TopicStat[] {
  const map = new Map<string, PerfRecord[]>();
  records.forEach((r) => {
    const k = r.subject + "|" + r.topic;
    map.set(k, [...(map.get(k) || []), r]);
  });
  return [...map.entries()]
    .map(([k, rs]) => {
      const [subject, topic] = k.split("|");
      const sorted = [...rs].sort((a, b) => a.date.localeCompare(b.date));
      const pcts = sorted.map((r) => Math.round((r.score / r.max) * 100));
      const pct = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
      const trend = pcts.length > 1 ? pcts[pcts.length - 1]! - pcts[0]! : 0;
      const mistakes = [...new Set(rs.map((r) => r.mistakes).filter(Boolean))];
      return {
        subject,
        topic,
        pct,
        attempts: rs.length,
        trend,
        mistakes,
        status: pct < 60 ? "Weak" : pct < 75 ? "Revise" : "Strong",
      } as TopicStat;
    })
    .sort((a, b) => a.pct - b.pct);
}
export function subjectStats(records: PerfRecord[]) {
  return subjects.map((s) => {
    const rs = records.filter((r) => r.subject === s);
    const pct = rs.length
      ? Math.round((rs.reduce((a, r) => a + r.score / r.max, 0) / rs.length) * 100)
      : 0;
    return { subject: s, pct, count: rs.length };
  });
}
export function pickQuestions(
  subject: string,
  topic: string,
  difficulty: string,
  count: number,
): Question[] {
  let pool = questionBank.filter(
    (x) => x.subject === subject && (topic === "Any" || x.topic === topic),
  );
  const exact = pool.filter((x) => difficulty === "Mixed" || x.difficulty === difficulty);
  pool = [...exact, ...pool.filter((x) => !exact.includes(x))];
  return pool.slice(0, count);
}
export function parseCsv(text: string): { rows: PerfRecord[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/);
  const errors: string[] = [];
  const rows: PerfRecord[] = [];
  const head =
    lines[0]
      ?.toLowerCase()
      .split(",")
      .map((s) => s.trim()) || [];
  const need = ["subject", "topic", "score", "max"];
  const miss = need.filter((n) => !head.includes(n));
  if (miss.length) return { rows, errors: ["Missing columns: " + miss.join(", ")] };
  lines.slice(1).forEach((line, i) => {
    const c = line.split(",").map((s) => s.trim());
    const get = (n: string) => c[head.indexOf(n)] ?? "";
    const score = Number(get("score")),
      max = Number(get("max"));
    if (
      !get("subject") ||
      !get("topic") ||
      isNaN(score) ||
      isNaN(max) ||
      max <= 0 ||
      score < 0 ||
      score > max
    ) {
      errors.push(`Row ${i + 2}: check subject, topic and score (0–max).`);
      return;
    }
    rows.push({
      id: Date.now() + i,
      subject: get("subject"),
      topic: get("topic"),
      score,
      max,
      date: get("date") || new Date().toISOString().slice(0, 10),
      type: (["Quiz", "Exam", "Assignment", "Practice"].includes(get("type"))
        ? get("type")
        : "Quiz") as PerfRecord["type"],
      mistakes: get("mistakes"),
    });
  });
  return { rows, errors };
}
export const sampleCsv =
  "subject,topic,score,max,date,type,mistakes\nDSA,Trees,12,20,2026-10-08,Quiz,Height vs depth\nDBMS,Transactions,9,20,2026-10-09,Quiz,Isolation levels\nOperating Systems,Deadlocks,18,20,2026-10-10,Exam,";
