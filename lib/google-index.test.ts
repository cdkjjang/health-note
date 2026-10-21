import { describe, expect, it } from "vitest";
import { guides } from "./guides";
import { GOOGLE_INDEXED_GUIDES, guideRobots } from "./google-index";

describe("구글 색인 허용 가이드", () => {
  it("목록의 슬러그가 모두 살아 있는 글이다", () => {
    const slugs = new Set(guides.map((g) => g.slug));
    for (const s of GOOGLE_INDEXED_GUIDES) expect(slugs.has(s), s).toBe(true);
  });

  it("목록 밖의 글은 구글에만 noindex, 목록 안의 글은 색인 허용", () => {
    for (const g of guides) {
      const r = guideRobots(g.slug) as { googleBot?: { index: boolean } };
      if (GOOGLE_INDEXED_GUIDES.has(g.slug)) expect(r.googleBot).toBeUndefined();
      else expect(r.googleBot).toEqual({ index: false, follow: true });
    }
  });
});