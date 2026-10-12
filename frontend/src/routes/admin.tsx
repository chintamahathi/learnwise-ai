import { createFileRoute } from "@tanstack/react-router";
import { AdminOverview } from "@/components/elevate/admin";
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Student Overview — ElevateOS Admin" },
      {
        name: "description",
        content: "College admin view of student progress and campus announcements.",
      },
      { property: "og:title", content: "Student Overview — ElevateOS Admin" },
      {
        property: "og:description",
        content: "College admin view of student progress and campus announcements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminOverview,
});
