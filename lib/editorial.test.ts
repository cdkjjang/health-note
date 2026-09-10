import { describe, expect, it } from "vitest";
import { EDITORIAL } from "./editorial";

/**
 * /editorial 본문이 조용히 망가지는 것을 막는 테스트.
 *
 * 2026-09-10 이전에는 19개 사이트가 글자 하나까지 같은 편집 원칙 페이지를 쓰고
 * 있었다. 노트별 본문으로 갈라내면서 붙인 검사다.
 */

function allText(): string[] {
  return [
    EDITORIAL.metaDescription,
    ...EDITORIAL.lead,
    ...EDITORIAL.sections.flatMap((s) => [
      s.heading,
      ...(s.paragraphs ?? []),
      ...(s.list ?? []),
      ...(s.sources ?? []).flatMap((x) => [x.label, x.note]),
    ]),
    EDITORIAL.correction,
  ];
}

describe("편집 원칙 본문", () => {
  it("본문에 원시 HTML 태그를 직접 쓰지 않는다", () => {
    // 페이지는 문자열을 React 노드로 렌더링하므로 태그를 쓰면 글자로 나간다.
    const bad = allText().filter((t) => /<\/?[a-z]+[^>]*>/i.test(t));
    expect(bad).toEqual([]);
  });

  it("강조 표기 **가 짝을 이룬다", () => {
    // 짝이 안 맞으면 별표가 화면에 그대로 남는다.
    const bad = allText().filter((t) => (t.match(/\*\*/g) ?? []).length % 2 !== 0);
    expect(bad).toEqual([]);
  });

  it("섹션 제목이 중복되지 않는다", () => {
    const seen = new Set<string>();
    const dup: string[] = [];
    for (const s of EDITORIAL.sections) {
      if (seen.has(s.heading)) dup.push(s.heading);
      seen.add(s.heading);
    }
    expect(dup).toEqual([]);
  });

  it("모든 섹션이 문단이나 목록을 가진다", () => {
    const empty = EDITORIAL.sections
      .filter((s) => !s.paragraphs?.length && !s.list?.length && !s.sources?.length)
      .map((s) => s.heading);
    expect(empty).toEqual([]);
  });

  it("근거 링크가 https이고 중복되지 않는다", () => {
    const hrefs = EDITORIAL.sections.flatMap((s) => (s.sources ?? []).map((x) => x.href));
    const bad = hrefs.filter((h) => !h.startsWith("https://"));
    expect(bad).toEqual([]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("본문이 충분한 분량을 가진다", () => {
    // 다른 사이트와 같은 글로 되돌아가면 대개 분량부터 줄어든다.
    const len = allText().join("").replace(/\s/g, "").length;
    expect(len).toBeGreaterThanOrEqual(1200);
  });
});
