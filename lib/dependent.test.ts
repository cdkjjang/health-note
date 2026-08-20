import { describe, expect, it } from "vitest";
import {
  BUSINESS_INCOME_LIMIT_NO_REG,
  INCOME_LIMIT,
  INCOME_LIMIT_MID_PROPERTY,
  PROPERTY_FAIL,
  PROPERTY_SAFE,
  SIBLING_PROPERTY_LIMIT,
  calcDependent,
  effectiveIncomeLimit,
  type DependentInput,
} from "./dependent";

// 고시값 고정 — 기호 참조만 하면 값이 낡아도 통과한다.
describe("피부양자 요건 고정 (2026년)", () => {
  it("연간 합산소득 2,000만원", () => {
    expect(INCOME_LIMIT).toBe(20_000_000);
  });
  it("사업자등록 없을 때 사업소득 500만원", () => {
    expect(BUSINESS_INCOME_LIMIT_NO_REG).toBe(5_000_000);
  });
  it("재산세 과세표준 5.4억 / 9억, 중간 구간 소득 1,000만원", () => {
    expect(PROPERTY_SAFE).toBe(540_000_000);
    expect(PROPERTY_FAIL).toBe(900_000_000);
    expect(INCOME_LIMIT_MID_PROPERTY).toBe(10_000_000);
  });
  it("형제자매 재산 한도 1.8억", () => {
    expect(SIBLING_PROPERTY_LIMIT).toBe(180_000_000);
  });
});

const base: DependentInput = {
  relation: "lineal",
  age: 68,
  disabled: false,
  totalIncome: 12_000_000,
  hasBusinessReg: false,
  businessIncome: 0,
  propertyBase: 200_000_000,
};

describe("기본 판정", () => {
  it("직계존속·소득 1,200만원·재산 2억이면 통과", () => {
    const r = calcDependent(base);
    expect(r.qualified).toBe(true);
    expect(r.incomeHeadroom).toBe(8_000_000);
  });

  it("소득이 2,000만원을 1원이라도 넘으면 탈락", () => {
    const r = calcDependent({ ...base, totalIncome: 20_000_001 });
    expect(r.qualified).toBe(false);
    expect(r.checks.find((c) => c.label.includes("2,000만원"))!.status).toBe("fail");
  });

  it("정확히 2,000만원은 통과", () => {
    expect(calcDependent({ ...base, totalIncome: 20_000_000 }).qualified).toBe(true);
  });
});

describe("사업소득 — 가장 흔한 탈락 사유", () => {
  it("사업자등록이 있으면 사업소득 1원에도 탈락", () => {
    const r = calcDependent({ ...base, hasBusinessReg: true, businessIncome: 1 });
    expect(r.qualified).toBe(false);
    expect(r.checks.find((c) => c.label.includes("사업소득"))!.detail).toContain("1원");
  });

  it("사업자등록이 있어도 사업소득이 0이면 통과", () => {
    expect(
      calcDependent({ ...base, hasBusinessReg: true, businessIncome: 0 }).qualified
    ).toBe(true);
  });

  it("사업자등록이 없으면 500만원까지 인정", () => {
    expect(calcDependent({ ...base, businessIncome: 5_000_000 }).qualified).toBe(true);
    expect(calcDependent({ ...base, businessIncome: 5_000_001 }).qualified).toBe(false);
  });

  it("소득 총액은 통과해도 사업소득 기준에 걸릴 수 있다", () => {
    const r = calcDependent({
      ...base,
      totalIncome: 8_000_000,
      hasBusinessReg: true,
      businessIncome: 8_000_000,
    });
    expect(r.checks.find((c) => c.label.includes("2,000만원"))!.status).toBe("pass");
    expect(r.qualified).toBe(false);
  });
});

describe("재산 요건", () => {
  it("5.4억 이하면 소득 요건만 보면 된다", () => {
    const r = calcDependent({ ...base, propertyBase: 540_000_000, totalIncome: 19_000_000 });
    expect(r.qualified).toBe(true);
  });

  it("5.4억~9억 구간은 소득이 1,000만원 이하여야 한다", () => {
    const ok = calcDependent({ ...base, propertyBase: 700_000_000, totalIncome: 10_000_000 });
    const no = calcDependent({ ...base, propertyBase: 700_000_000, totalIncome: 10_000_001 });
    expect(ok.qualified).toBe(true);
    expect(no.qualified).toBe(false);
  });

  it("9억을 넘으면 소득과 무관하게 탈락", () => {
    const r = calcDependent({ ...base, propertyBase: 900_000_001, totalIncome: 0 });
    expect(r.qualified).toBe(false);
  });

  it("재산 구간에 따라 실제 소득 한도가 달라진다", () => {
    expect(effectiveIncomeLimit(100_000_000)).toBe(20_000_000);
    expect(effectiveIncomeLimit(700_000_000)).toBe(10_000_000);
    expect(effectiveIncomeLimit(1_000_000_000)).toBeNull();
  });
});

describe("관계별 부양요건", () => {
  it("배우자는 동거 여부와 무관", () => {
    const r = calcDependent({ ...base, relation: "spouse" });
    expect(r.checks[0].status).toBe("pass");
  });

  it("그 밖의 친족은 대상이 아니다", () => {
    const r = calcDependent({ ...base, relation: "other" });
    expect(r.qualified).toBe(false);
  });

  it("형제자매는 30세 미만·65세 이상·장애인만 가능", () => {
    const mid = calcDependent({ ...base, relation: "sibling", age: 45, propertyBase: 0 });
    expect(mid.qualified).toBe(false);
    const young = calcDependent({ ...base, relation: "sibling", age: 25, propertyBase: 0 });
    expect(young.qualified).toBe(true);
    expect(young.hasWarning).toBe(true);
  });

  it("형제자매는 재산 1.8억을 넘으면 탈락", () => {
    const r = calcDependent({
      ...base,
      relation: "sibling",
      age: 25,
      propertyBase: 180_000_001,
    });
    expect(r.qualified).toBe(false);
  });

  it("장애인 형제자매는 나이 제한을 받지 않는다", () => {
    const r = calcDependent({
      ...base,
      relation: "sibling",
      age: 45,
      disabled: true,
      propertyBase: 0,
    });
    expect(r.qualified).toBe(true);
  });
});
