import { describe, expect, it } from "vitest";
import {
  FACILITIES,
  INPATIENT_RATE,
  MEAL_RATE,
  SPECIAL_CASES,
  calcCopayRate,
  facilityOf,
  tertiaryVsClinic,
  type CopayRateInput,
} from "./copay-rate";

describe("본인부담률 고정 (시행령 별표2)", () => {
  it("외래 — 의원 30% · 병원 40% · 종합병원 50% · 상급종합 60%", () => {
    expect(facilityOf("clinic").outpatient).toBe(0.3);
    expect(facilityOf("hospital").outpatient).toBe(0.4);
    expect(facilityOf("general").outpatient).toBe(0.5);
    expect(facilityOf("tertiary").outpatient).toBe(0.6);
  });

  it("입원은 종별 무관 20%, 식대는 50%", () => {
    expect(INPATIENT_RATE).toBe(0.2);
    expect(MEAL_RATE).toBe(0.5);
  });

  it("산정특례 — 암 5%, 희귀·중증난치 10%, 중증화상 5%, 심뇌혈관 5%", () => {
    const m = Object.fromEntries(SPECIAL_CASES.map((s) => [s.key, s.rate]));
    expect(m.cancer).toBe(0.05);
    expect(m.rare).toBe(0.1);
    expect(m.burn).toBe(0.05);
    expect(m.cardio).toBe(0.05);
  });

  it("상급종합병원 외래는 의원의 2배", () => {
    expect(tertiaryVsClinic()).toBe(2);
  });

  it("약국은 의원과 같은 30%", () => {
    expect(facilityOf("pharmacy").outpatient).toBe(facilityOf("clinic").outpatient);
  });
});

const base: CopayRateInput = {
  coveredTotal: 100_000,
  uncovered: 0,
  facility: "clinic",
  visit: "outpatient",
  specialCase: "none",
};

describe("외래 — 어디서 받느냐로 달라진다", () => {
  it("의원 10만원 진료 → 3만원", () => {
    const r = calcCopayRate(base);
    expect(r.coveredCopay).toBe(30_000);
    expect(r.insurerPays).toBe(70_000);
  });

  it("같은 진료를 상급종합병원에서 받으면 6만원", () => {
    const r = calcCopayRate({ ...base, facility: "tertiary" });
    expect(r.coveredCopay).toBe(60_000);
    expect(r.ifClinic).toBe(30_000);
  });

  it("종별로 순서대로 올라간다", () => {
    const amounts = (["clinic", "hospital", "general", "tertiary"] as const).map(
      (f) => calcCopayRate({ ...base, facility: f }).coveredCopay
    );
    expect(amounts).toEqual([30_000, 40_000, 50_000, 60_000]);
  });
});

describe("입원은 종별과 무관하다", () => {
  it("의원이든 상급종합이든 20%", () => {
    const a = calcCopayRate({ ...base, visit: "inpatient", facility: "clinic" });
    const b = calcCopayRate({ ...base, visit: "inpatient", facility: "tertiary" });
    expect(a.coveredCopay).toBe(20_000);
    expect(b.coveredCopay).toBe(20_000);
  });
});

describe("산정특례", () => {
  it("암은 5% — 상급종합병원이어도 마찬가지", () => {
    const r = calcCopayRate({
      ...base,
      coveredTotal: 10_000_000,
      facility: "tertiary",
      specialCase: "cancer",
    });
    expect(r.rate).toBe(0.05);
    expect(r.coveredCopay).toBe(500_000);
    expect(r.specialApplied).toBe(true);
  });

  it("희귀·중증난치질환은 10%", () => {
    const r = calcCopayRate({ ...base, coveredTotal: 1_000_000, specialCase: "rare" });
    expect(r.coveredCopay).toBe(100_000);
  });

  it("산정특례는 종별 부담률을 덮어쓴다", () => {
    const clinic = calcCopayRate({ ...base, facility: "clinic", specialCase: "cancer" });
    const tertiary = calcCopayRate({ ...base, facility: "tertiary", specialCase: "cancer" });
    expect(clinic.coveredCopay).toBe(tertiary.coveredCopay);
  });
});

describe("비급여는 전액 본인 부담 — 이 계산기의 요점", () => {
  it("비급여는 부담률과 무관하게 그대로 더해진다", () => {
    const r = calcCopayRate({ ...base, uncovered: 500_000 });
    expect(r.coveredCopay).toBe(30_000);
    expect(r.totalPay).toBe(530_000);
  });

  it("비급여가 크면 실질 부담률이 명목 부담률을 크게 웃돈다", () => {
    const r = calcCopayRate({ ...base, coveredTotal: 100_000, uncovered: 900_000 });
    expect(r.rate).toBe(0.3);
    // (3만 + 90만) / 100만 = 93%
    expect(r.effectiveRate).toBeCloseTo(0.93, 10);
  });

  it("산정특례여도 비급여는 줄지 않는다", () => {
    const r = calcCopayRate({
      ...base,
      coveredTotal: 10_000_000,
      uncovered: 3_000_000,
      specialCase: "cancer",
    });
    expect(r.coveredCopay).toBe(500_000);
    expect(r.uncovered).toBe(3_000_000);
    expect(r.totalPay).toBe(3_500_000);
  });
});

describe("경계", () => {
  it("진료비가 0이면 부담도 0", () => {
    const r = calcCopayRate({ ...base, coveredTotal: 0 });
    expect(r.totalPay).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it("음수 입력은 0으로 처리한다", () => {
    const r = calcCopayRate({ ...base, coveredTotal: -100, uncovered: -100 });
    expect(r.totalPay).toBe(0);
  });
});
