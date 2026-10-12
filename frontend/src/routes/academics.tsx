import { createFileRoute } from "@tanstack/react-router";
import { Academics } from "@/components/elevate/academics";
export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Performance Lab — ElevateOS" },
      {
        name: "description",
        content:
          "Enter marks, find learning gaps, get study materials and personalised practice questions.",
      },
      { property: "og:title", content: "Performance Lab — ElevateOS" },
      {
        property: "og:description",
        content:
          "Enter marks, find learning gaps, get study materials and personalised practice questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Academics,
});
