import { createFileRoute } from "@tanstack/react-router";
import { Rooms } from "@/components/elevate/opportunities-community";
export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Study Rooms — ElevateOS" },
      { name: "description", content: "Find shared focus in collaborative student study rooms." },
      { property: "og:title", content: "Study Rooms — ElevateOS" },
      {
        property: "og:description",
        content: "Find shared focus in collaborative student study rooms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rooms,
});
