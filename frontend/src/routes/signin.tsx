import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "@/components/elevate/account";
export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Welcome Back — ElevateOS" },
      { name: "description", content: "Explore the ElevateOS student sign-in experience." },
      { property: "og:title", content: "Welcome Back — ElevateOS" },
      { property: "og:description", content: "Explore the ElevateOS student sign-in experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Auth,
});
