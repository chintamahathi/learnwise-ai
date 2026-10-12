import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "@/components/elevate/account";
export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Your Settings — ElevateOS" },
      {
        name: "description",
        content: "Personalize your student profile, academic journey, and demo preferences.",
      },
      { property: "og:title", content: "Your Settings — ElevateOS" },
      {
        property: "og:description",
        content: "Personalize your student profile, academic journey, and demo preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});
