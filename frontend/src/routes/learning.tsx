import { createFileRoute } from "@tanstack/react-router";
import { Learning } from "@/components/elevate/learning-planner";
export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Your Learning — ElevateOS" },
      {
        name: "description",
        content: "Build subject mastery, explore topics, and practice your understanding.",
      },
      { property: "og:title", content: "Your Learning — ElevateOS" },
      {
        property: "og:description",
        content: "Build subject mastery, explore topics, and practice your understanding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Learning,
});
