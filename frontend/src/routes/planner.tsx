import { createFileRoute } from "@tanstack/react-router";
import { Planner } from "@/components/elevate/learning-planner";
export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Your AI Planner — ElevateOS" },
      {
        name: "description",
        content: "Make space for your goals with a clear study timetable and focused tasks.",
      },
      { property: "og:title", content: "Your AI Planner — ElevateOS" },
      {
        property: "og:description",
        content: "Make space for your goals with a clear study timetable and focused tasks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planner,
});
