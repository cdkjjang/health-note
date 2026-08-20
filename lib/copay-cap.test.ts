import { describe, expect, it } from "vitest";
import {
  CAP_TIERS,
  LONG_TERM_DAYS,
  calcCopayCap,
  longTermPenalty,
  tierOf,
  type CopayCapInput,
} from "./copay-cap";

// 고시값 고정 — 상한액은 매년 1월 물가변동률을 반영해 바뀐다.
describe("2026년도 본인부담상한액 고정", () => {
  it("일반 상한액 7구간", () => {
    expect(CAP_TIERS.map((t) => t.normal)).toEqual([
      900_000, 1_120_000, 1_730_000, 3_260_000, 4_460_000, 5_360_000, 8_430_000,
    ]);
  });

  it("요양병원 120일 초과 상한액 7구간", () => {
    expect(CAP_TIERS.map((t) => t.longTerm)).toEqual([
      1_430_000, 1_810_000, 2_450_000, 4_040_000, 5_800_000, 6_980_000, 10_960_000,
    ]);
  });

  it("요양병원 장기입원 기준은 120일", () => {
    expect(LONG_TERM_DAYS).toBe(120);
  });

  it("장기입원 상한이 언제나 일반 상한보다 높다", () => {
    for (const t of CAP_TIERS) expect(t.longTerm).toBeGreaterThan(t.normal);
  });
});

const base: CopayCapInput = {
  decile: 4,
  coveredCopay: 3_000_000,
  uncovered: 0,
  hospitalDays: 0,
};

describe("환급 계산", () => {
  it("4~5분위 상한 173만원을 넘은 만큼 돌려받는다", () => {
    const r = calcCopayCap(base);
    expect(r.cap).toBe(1_730_000);
    expect(r.refund).toBe(1_270_000);
    expect(r.hasRefund).toBe(true);
    expect(r.finalBurden).toBe(1_730_000);
  });

  it("상한에 못 미치면 환급이 없고 남은 금액을 알려준다", () => {
    const r = calcCopayCap({ ...base, coveredCopay: 1_000_000 });
    expect(r.refund).toBe(0);
    expect(r.hasRefund).toBe(false);
    expect(r.remaining).toBe(730_000);
  });

  it("정확히 상한액이면 환급 0", () => {
    const r = calcCopayCap({ ...base, coveredCopay: 1_730_000 });
    expect(r.refund).toBe(0);
    expect(r.remaining).toBe(0);
  });

  it("소득분위가 높을수록 상한이 높아 환급이 줄어든다", () => {
    const low = calcCopayCap({ ...base, decile: 1 });
    const high = calcCopayCap({ ...base, decile: 10 });
    expect(low.refund).toBeGreaterThan(high.refund);
    expect(high.refund).toBe(0);
  });
});

describe("비급여는 상한제 대상이 아니다 — 이 노트의 핵심", () => {
  it("비급여는 아무리 커도 환급에 영향을 주지 않는다", () => {
    const a = calcCopayCap({ ...base, uncovered: 0 });
    const b = calcCopayCap({ ...base, uncovered: 5_000_000 });
    expect(a.refund).toBe(b.refund);
  });

  it("비급여는 최종 부담에 그대로 더해진다", () => {
    const r = calcCopayCap({ ...base, uncovered: 5_000_000 });
    expect(r.finalBurden).toBe(1_730_000 + 5_000_000);
  });

  it("비급여 비중을 계산해 보여준다", () => {
    const r = calcCopayCap({ ...base, coveredCopay: 2_000_000, uncovered: 3_000_000 });
    expect(r.uncoveredRatio).toBeCloseTo(0.6, 10);
  });

  it("급여 부담이 적고 비급여만 크면 환급이 0이다", () => {
    const r = calcCopayCap({ ...base, coveredCopay: 500_000, uncovered: 8_000_000 });
    expect(r.refund).toBe(0);
    expect(r.finalBurden).toBe(8_500_000);
  });
});

describe("요양병원 120일 초과", () => {
  it("120일까지는 일반 상한", () => {
    expect(calcCopayCap({ ...base, hospitalDays: 120 }).longTermApplied).toBe(false);
    expect(calcCopayCap({ ...base, hospitalDays: 120 }).cap).toBe(1_730_000);
  });

  it("121일부터 장기입원 상한이 적용된다", () => {
    const r = calcCopayCap({ ...base, hospitalDays: 121 });
    expect(r.longTermApplied).toBe(true);
    expect(r.cap).toBe(2_450_000);
    expect(r.refund).toBe(550_000);
  });

  it("같은 지출인데 하루 차이로 부담이 늘어난다", () => {
    const a = calcCopayCap({ ...base, hospitalDays: 120 });
    const b = calcCopayCap({ ...base, hospitalDays: 121 });
    expect(b.finalBurden - a.finalBurden).toBe(longTermPenalty(4));
    expect(longTermPenalty(4)).toBe(720_000);
  });

  it("10분위는 장기입원 시 1,096만원까지 부담한다", () => {
    const r = calcCopayCap({ decile: 10, coveredCopay: 20_000_000, uncovered: 0, hospitalDays: 200 });
    expect(r.cap).toBe(10_960_000);
    expect(r.refund).toBe(9_040_000);
  });
});

describe("경계", () => {
  it("지출이 0이면 환급도 0", () => {
    const r = calcCopayCap({ ...base, coveredCopay: 0 });
    expect(r.refund).toBe(0);
    expect(r.finalBurden).toBe(0);
    expect(r.uncoveredRatio).toBe(0);
  });

  it("tierOf는 없는 키에도 안전하게 답한다", () => {
    expect(tierOf(1).normal).toBe(900_000);
  });
});
