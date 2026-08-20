import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// 계산기·정적 페이지의 최종 갱신일. 본문을 손볼 때 함께 올려 재크롤링을 유도한다.
const TOOL_UPDATED = "2026-08-20";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: TOOL_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calc/dependent`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/cap`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/checkup`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/rate`, lastModified: TOOL_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/guide`, lastModified: TOOL_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/editorial`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: TOOL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: g.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}
