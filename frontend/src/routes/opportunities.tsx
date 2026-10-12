import { createFileRoute } from "@tanstack/react-router";
import { Opportunities } from "@/components/elevate/opportunities-community";
export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunity Radar — ElevateOS" },
      {
        name: "description",
        content:
          "Discover sample internships, hackathons, scholarships, and fellowships for your next move.",
      },
      { property: "og:title", content: "Opportunity Radar — ElevateOS" },
      {
        property: "og:description",
        content:
          "Discover sample internships, hackathons, scholarships, and fellowships for your next move.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Opportunities,
});
