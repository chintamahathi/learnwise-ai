import { createFileRoute } from "@tanstack/react-router";
import { Assistant } from "@/components/elevate/growth-workspaces";
export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Growth Companion — ElevateOS" },
      {
        name: "description",
        content: "Explore a simulated thinking partner for study plans, concepts, and reflection.",
      },
      { property: "og:title", content: "AI Growth Companion — ElevateOS" },
      {
        property: "og:description",
        content: "Explore a simulated thinking partner for study plans, concepts, and reflection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assistant,
});
