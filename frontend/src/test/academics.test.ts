import { describe, it, expect } from "vitest";
import { topicStats, parseCsv } from "@/data/academics";
const r = (topic: string, score: number, max = 20) => ({
  id: Math.random(),
  subject: "DSA",
  topic,
  score,
  max,
  date: "2026-10-01",
  type: "Quiz" as const,
  mistakes: "",
});
describe("learning gaps", () => {
  it("marks below 60% as Weak", () => {
    expect(topicStats([r("A", 11)])[0]!.status).toBe("Weak");
  });
  it("marks 60–74% as Revise", () => {
    expect(topicStats([r("A", 12)])[0]!.status).toBe("Revise");
  });
  it("marks 75%+ as Strong", () => {
    expect(topicStats([r("A", 15)])[0]!.status).toBe("Strong");
  });
  it("rejects CSV scores above the maximum", () => {
    expect(parseCsv("subject,topic,score,max\nDSA,Trees,25,20").rows).toHaveLength(0);
  });
});
