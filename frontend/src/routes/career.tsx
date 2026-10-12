import { createFileRoute } from "@tanstack/react-router";
import { Career } from "@/components/elevate/growth-workspaces";
export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career Hub — ElevateOS" },
      {
        name: "description",
        content: "Prepare your resume, practice interviews, and plan a meaningful career path.",
      },
      { property: "og:title", content: "Career Hub — ElevateOS" },
      {
        property: "og:description",
        content: "Prepare your resume, practice interviews, and plan a meaningful career path.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Career,
});
