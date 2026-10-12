import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/components/elevate/account";
export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Account Recovery — ElevateOS" },
      {
        name: "description",
        content: "Preview password recovery for your ElevateOS student workspace.",
      },
      { property: "og:title", content: "Account Recovery — ElevateOS" },
      {
        property: "og:description",
        content: "Preview password recovery for your ElevateOS student workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Auth mode="forgot" />,
});
