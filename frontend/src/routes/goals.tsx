import { createFileRoute } from "@tanstack/react-router";
import { Goals } from "@/components/elevate/learning-planner";
export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Your Goals — ElevateOS" },
      {
        name: "description",
        content: "Follow your milestones and keep your personal ambitions in motion.",
      },
      { property: "og:title", content: "Your Goals — ElevateOS" },
      {
        property: "og:description",
        content: "Follow your milestones and keep your personal ambitions in motion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Goals,
});
