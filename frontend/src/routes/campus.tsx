import { createFileRoute } from "@tanstack/react-router";
import { Campus } from "@/components/elevate/opportunities-community";
export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: "Campus Connect — ElevateOS" },
      {
        name: "description",
        content: "Find study partners, project collaborators, and ambitious student peers.",
      },
      { property: "og:title", content: "Campus Connect — ElevateOS" },
      {
        property: "og:description",
        content: "Find study partners, project collaborators, and ambitious student peers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Campus,
});
