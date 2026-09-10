import { describe, expect, it } from "vitest";
import { guides } from "./guides";
import { FACILITIES, INPATIENT_RATE, SPECIAL_CASES } from "./copay-rate";
import nextConfig from "../next.config";

/**
 * 가이드 데이터가 조용히 망가지는 것을 막는 테스트.
 *
 * 2026-09-10에 13편을 9편으로 합쳤다. 자격·보험료 5편이 같은 제도를 겹쳐
 * 설명하고 있었다 — 임의계속가입 요건(18개월 중 12개월·최대 36개월·기한 2개월)이
 * 네 편에, 보험료 조정·경감이 세 편에, 자동차 제외·기본공제 1억이 세 편에.
 * 애드센스가 "가치가 별로 없는 콘텐츠"로 두 번 반려한 뒤 진행한 통합의 일부다
 * (워크스페이스 CLAUDE.md 8장).
 */

/** 화면에 실제로 나가는 본문 길이 (공백 제외) */
function bodyLength(g: (typeof guides)[number]): number {
  const parts = [
    ...g.intro,
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    ...g.faq.flatMap((f) => [f.q, f.a]),
  ];
  return parts.join("").replace(/\s/g, "").length;
}

function allText(g: (typeof guides)[number]): string {
  return [
    ...g.intro,
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
    ...g.faq.flatMap((f) => [f.q, f.a]),
  ].join("\n");
}

describe("가이드 데이터", () => {
  it("슬러그가 중복되지 않는다", () => {
    const seen = new Set<string>();
    const dup: string[] = [];
    for (const g of guides) {
      if (seen.has(g.slug)) dup.push(g.slug);
      seen.add(g.slug);
    }
    expect(dup).toEqual([]);
  });

  it("related가 실제 있는 글을 가리키고 자기 자신을 넣지 않는다", () => {
    const known = new Set(guides.map((g) => g.slug));
    const bad: string[] = [];
    for (const g of guides) {
      for (const r of g.related) {
        if (!known.has(r)) bad.push(`${g.slug} → 없는 글 ${r}`);
        if (r === g.slug) bad.push(`${g.slug} → 자기 자신`);
      }
      if (new Set(g.related).size !== g.related.length) {
        bad.push(`${g.slug}: related 중복`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("얇은 글이 없다", () => {
    // ⚠️ 기준이 두 가지다. 통합을 결정할 때 쓴 감사 수치는 소스의 문자열
    //    리터럴을 세는 느슨한 방식이고, 여기 bodyLength는 화면에 나가는 글자를
    //    공백까지 빼고 센다. 감사 기준 2,000자 ≈ 여기 1,500자.
    //
    // 다른 노트에는 통합이 덜 끝난 동안 쓰던 KNOWN_THIN 예외 목록이 있었는데,
    // 이 노트는 처음부터 예외 없이 시작한다. **예외 목록을 만들지 말 것.**
    const thin = guides
      .map((g) => ({ slug: g.slug, len: bodyLength(g) }))
      .filter((x) => x.len < 1500)
      .map((x) => `${x.slug} (${x.len}자)`);
    expect(thin).toEqual([]);
  });

  it("섹션 제목이 한 글 안에서 중복되지 않는다", () => {
    // 템플릿이 heading을 React key로 쓴다. 겹치면 렌더링이 깨진다.
    const bad: string[] = [];
    for (const g of guides) {
      const seen = new Set<string>();
      for (const s of g.sections) {
        if (seen.has(s.heading)) bad.push(`${g.slug}: "${s.heading}"`);
        seen.add(s.heading);
      }
    }
    expect(bad).toEqual([]);
  });

  it("FAQ 질문이 한 글 안에서 중복되지 않는다", () => {
    const bad: string[] = [];
    for (const g of guides) {
      const seen = new Set<string>();
      for (const f of g.faq) {
        if (seen.has(f.q)) bad.push(`${g.slug}: "${f.q}"`);
        seen.add(f.q);
      }
    }
    expect(bad).toEqual([]);
  });

  it("faq에는 ** 를 쓰지 않는다", () => {
    // FAQ는 JSON-LD 구조화 데이터로도 나가므로 태그가 아니라 별표가 그대로 들어간다.
    const bad = guides
      .filter((g) => g.faq.some((f) => f.q.includes("**") || f.a.includes("**")))
      .map((g) => g.slug);
    expect(bad).toEqual([]);
  });

  it("본문에 원시 HTML 태그를 직접 쓰지 않는다", () => {
    // 템플릿의 bold()가 < > 를 **먼저 이스케이프한 뒤** ** 만 태그로 바꾼다.
    // 그래서 데이터에 <strong>이라고 쓰면 화면에 글자 그대로 나온다.
    // 부동산노트에서 실제로 라이브에 노출된 적이 있다.
    const bad: string[] = [];
    for (const g of guides) {
      for (const p of allText(g).split("\n")) {
        if (/<\/?[a-z]+[^>]*>/i.test(p)) bad.push(`${g.slug}: "${p.slice(0, 50)}"`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("제목의 부제(— 뒤)가 서로 겹치지 않는다", () => {
    const bySub = new Map<string, string[]>();
    for (const g of guides) {
      const parts = g.title.split(" — ");
      if (parts.length < 2) continue;
      const sub = parts.slice(1).join(" — ").trim();
      bySub.set(sub, [...(bySub.get(sub) ?? []), g.slug]);
    }
    const dup = [...bySub.entries()]
      .filter(([, v]) => v.length > 1)
      .map(([k, v]) => `"${k}": ${v.join(", ")}`);
    expect(dup).toEqual([]);
  });

  it("cta가 실제 있는 계산기를 가리킨다", () => {
    const calcs = new Set(["/calc/dependent", "/calc/cap", "/calc/checkup", "/calc/rate"]);
    const bad = guides
      .filter((g) => g.cta && !calcs.has(g.cta.href))
      .map((g) => `${g.slug} → ${g.cta!.href}`);
    expect(bad).toEqual([]);
  });
});

describe("본문 수치가 계산 엔진과 어긋나지 않는다", () => {
  it("외래 종별 본인부담률을 본문이 엔진과 같게 쓴다", () => {
    // 조각 매칭이 아니라 **엔진 상수를 직접 읽어** 본문과 대조한다.
    // 통합하며 나란히 놓고 보니 세 글이 같은 표를 각자 들고 있었다.
    //
    // ⚠️ "종합병원"은 "상급종합병원"의 일부라서, 긴 이름부터 훑고 이미 쓴
    //    구간을 지운 뒤 짧은 이름을 본다. 그러지 않으면 상급종합병원 60%가
    //    종합병원 50%와 어긋난 것으로 잘못 걸린다.
    const byLongest = [...FACILITIES].sort((a, b) => b.label.length - a.label.length);
    const bad: string[] = [];
    for (const g of guides) {
      let text = allText(g);
      for (const f of byLongest) {
        // "상급종합병원 60%" 처럼 기관명 바로 뒤에 숫자를 쓴 곳만 본다.
        const re = new RegExp(`${f.label}\\*{0,2}\\s*\\*{0,2}(\\d+)%`, "g");
        const hits = [...text.matchAll(re)];
        for (const m of hits) {
          if (Number(m[1]) !== Math.round(f.outpatient * 100)) {
            bad.push(`${g.slug}: ${f.label} ${m[1]}% (엔진은 ${Math.round(f.outpatient * 100)}%)`);
          }
        }
        text = text.replace(re, "");
      }
    }
    expect(bad).toEqual([]);
  });

  it("입원 본인부담률 20%가 엔진과 같다", () => {
    expect(Math.round(INPATIENT_RATE * 100)).toBe(20);
  });

  it("암 산정특례 5%를 본문이 엔진과 같게 쓴다", () => {
    const cancer = SPECIAL_CASES.find((s) => s.key === "cancer")!;
    const pct = Math.round(cancer.rate * 100);
    const bad: string[] = [];
    for (const g of guides) {
      for (const m of allText(g).matchAll(/암\*{0,2}\s*—?\s*등록일부터\s*\*{0,2}?5년간\s*(\d+)%/g)) {
        if (Number(m[1]) !== pct) bad.push(`${g.slug}: 암 ${m[1]}% (엔진은 ${pct}%)`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("임의계속가입 설명이 한 글에만 있다", () => {
    // 통합 전에는 다섯 편 중 네 편이 "18개월 중 12개월·최대 36개월"을 각자
    // 들고 있었다. 다시 흩어지면 값이 어긋나도 아무도 대조하지 않는다.
    // **재려는 것을 직접 잰다** — 요건 수치를 함께 쓴 글이 몇 편인가.
    const owners = guides
      .filter((g) => {
        const t = allText(g);
        return t.includes("18개월") && t.includes("36개월");
      })
      .map((g) => g.slug);
    expect(owners).toEqual(["dependent-lost"]);
  });
});

describe("통합으로 사라진 URL의 301", () => {
  it("출발지는 사라진 글이고 목적지는 실재한다", async () => {
    const known = new Set(guides.map((g) => g.slug));
    const rules = await nextConfig.redirects!();
    expect(rules.length).toBe(4);

    const bad: string[] = [];
    for (const r of rules) {
      const from = r.source.replace("/guide/", "");
      const to = r.destination.replace("/guide/", "");
      if (known.has(from)) bad.push(`${from}: 글이 살아 있는데 리다이렉트가 걸려 있음`);
      if (!known.has(to)) bad.push(`${from} → ${to}: 목적지가 없음`);
      if (!r.permanent) bad.push(`${from}: 301이 아님`);
    }
    expect(bad).toEqual([]);
  });

  it("리다이렉트가 다시 리다이렉트로 이어지지 않는다", async () => {
    const rules = await nextConfig.redirects!();
    const sources = new Set(rules.map((r) => r.source));
    const chained = rules
      .filter((r) => sources.has(r.destination))
      .map((r) => `${r.source} → ${r.destination}`);
    expect(chained).toEqual([]);
  });
});
