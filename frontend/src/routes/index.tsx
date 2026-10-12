import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/components/elevate/overview";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Overview — ElevateOS" },
      {
        name: "description",
        content:
          "Your daily action plan, learning progress, goals, and opportunities in one personal student growth workspace.",
      },
      { property: "og:title", content: "Your Overview — ElevateOS" },
      {
        property: "og:description",
        content: "A focused day. A bigger future. Explore your personal growth overview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});
