import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { COUPANG_PICKS } from "./coupang";

const ALL = Object.values(COUPANG_PICKS).flat();

describe("계산기 상품 링크 (lib/coupang.ts)", () => {
  it("링크는 우리 파트너스 계정의 정식 딥링크이고 subId 가 있다", () => {
    for (const p of ALL) {
      expect(p.href).toMatch(/^https:\/\/link\.coupang\.com\/re\/AFFSDP\?lptag=AF6888890&pageKey=\d+&subId=[a-z]+\d+$/);
    }
  });

  it("같은 상품은 같은 subId 를 쓴다(자리별 집계가 섞이지 않게)", () => {
    const byKey = new Map<string, string>();
    for (const p of ALL) {
      const key = new URL(p.href).searchParams.get("pageKey")!;
      const sub = new URL(p.href).searchParams.get("subId")!;
      if (byKey.has(key)) expect(byKey.get(key)).toBe(sub);
      byKey.set(key, sub);
    }
  });

  it("문구에 가격 · 할인 · 과장 표현이 없다", () => {
    for (const p of ALL) {
      expect(p.title + p.why).not.toMatch(/최저|할인|특가|인기|원\)|\d+원|\d+%|보장|무조건/);
    }
  });

  it.each(["checkup","dependent"])("/calc/%s 화면이 상품 블록을 그린다", (calc) => {
    const src = readFileSync(join(__dirname, "..", "app", "calc", calc, "page.tsx"), "utf8");
    expect(src).toContain(`<ContextualOffers calc="${calc}" />`);
  });
});
