import { createFileRoute } from "@tanstack/react-router";
import { Onboarding } from "@/components/elevate/account";
export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Your Growth Plan — ElevateOS" },
      {
        name: "description",
        content: "Choose your goals and build a sample study rhythm that fits your life.",
      },
      { property: "og:title", content: "Your Growth Plan — ElevateOS" },
      {
        property: "og:description",
        content: "Choose your goals and build a sample study rhythm that fits your life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});
