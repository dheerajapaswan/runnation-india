import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

const ROUTES = ["", "/events", "/results", "/about", "/faq", "/register", "/contact", "/privacy", "/terms", "/refund-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r}`,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
