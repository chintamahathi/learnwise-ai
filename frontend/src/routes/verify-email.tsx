import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/components/elevate/account";
export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Email Verification — ElevateOS" },
      {
        name: "description",
        content: "Preview email confirmation before personalizing your growth journey.",
      },
      { property: "og:title", content: "Email Verification — ElevateOS" },
      {
        property: "og:description",
        content: "Preview email confirmation before personalizing your growth journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Auth mode="verify" />,
});
