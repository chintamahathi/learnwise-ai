import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/components/elevate/growth-workspaces";
export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Progress Reports — ElevateOS" },
      {
        name: "description",
        content: "Reflect on your study consistency, learning progress, and goal momentum.",
      },
      { property: "og:title", content: "Progress Reports — ElevateOS" },
      {
        property: "og:description",
        content: "Reflect on your study consistency, learning progress, and goal momentum.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reports,
});
