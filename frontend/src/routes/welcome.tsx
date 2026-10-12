import { createFileRoute } from "@tanstack/react-router";
import { Welcome } from "@/components/elevate/account";
export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Your Potential, Without Limits — ElevateOS" },
      {
        name: "description",
        content: "ElevateOS connects learning, focus, opportunities, and student growth.",
      },
      { property: "og:title", content: "Your Potential, Without Limits — ElevateOS" },
      {
        property: "og:description",
        content: "ElevateOS connects learning, focus, opportunities, and student growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});
