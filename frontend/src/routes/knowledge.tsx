import { createFileRoute } from "@tanstack/react-router";
import { Knowledge } from "@/components/elevate/growth-workspaces";
export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Hub — ElevateOS" },
      {
        name: "description",
        content: "Keep your notes, resources, flashcards, and learning ideas close.",
      },
      { property: "og:title", content: "Knowledge Hub — ElevateOS" },
      {
        property: "og:description",
        content: "Keep your notes, resources, flashcards, and learning ideas close.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Knowledge,
});
