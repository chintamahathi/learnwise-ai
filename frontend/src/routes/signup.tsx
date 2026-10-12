import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/components/elevate/account";
export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Start Your Journey — ElevateOS" },
      {
        name: "description",
        content: "Preview creating your personal ElevateOS growth workspace.",
      },
      { property: "og:title", content: "Start Your Journey — ElevateOS" },
      {
        property: "og:description",
        content: "Preview creating your personal ElevateOS growth workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Auth mode="signup" />,
});
