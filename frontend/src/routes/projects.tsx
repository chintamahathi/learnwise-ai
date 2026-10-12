import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/elevate/growth-workspaces";
export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Your Projects — ElevateOS" },
      {
        name: "description",
        content: "Turn ideas into working projects with milestones, tasks, and collaboration.",
      },
      { property: "og:title", content: "Your Projects — ElevateOS" },
      {
        property: "og:description",
        content: "Turn ideas into working projects with milestones, tasks, and collaboration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Projects,
});
