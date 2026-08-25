import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

// 갱신일은 실제 수정 시점을 반영해야 재크롤링을 유도한다.
//
// ⚠️ 예전에는 TOOL_UPDATED 한 값으로 고정해 두었다(2026-08-03). 그 뒤 계산기
//    해설과 가이드를 여러 번 고치는 동안 아무도 올리지 않아, 3주 넘게 구글에
//    '바뀐 것 없음'으로 나갔다. 낡은 lastmod는 다시 가져갈 이유를 없앤다.
//    그래서 성격이 다른 셋으로 나눴다.

/** 가이드가 바뀌면 홈과 목록도 바뀐다 — 실제 갱신일에서 계산한다 */
const CONTENT_UPDATED =
  [...guides.map((g) => g.updated)].sort().at(-1) ?? "2026-08-23";

/** 계산기 페이지 — 해설을 손볼 때 함께 올릴 것 */
const CALC_UPDATED = "2026-08-23";

/** 법적 고지·소개 — 거의 바뀌지 않는다. 콘텐츠와 함께 올리지 않는다 */
const STATIC_UPDATED = "2026-08-20";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calc/dependent`, lastModified: CALC_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/cap`, lastModified: CALC_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/checkup`, lastModified: CALC_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/rate`, lastModified: CALC_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/guide`, lastModified: CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: STATIC_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, lastModified: STATIC_UPDATED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/editorial`, lastModified: STATIC_UPDATED, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: STATIC_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: STATIC_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: g.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}
