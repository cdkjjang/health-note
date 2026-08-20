import { describe, expect, it } from "vitest";
import {
  CANCER_SCREENINGS,
  GENERAL_CYCLE,
  calcCheckup,
  type CheckupInput,
} from "./checkup";

describe("암검진 기준 고정 (암관리법 시행령 별표1)", () => {
  it("6종의 시작 연령과 주기", () => {
    const m = Object.fromEntries(
      CANCER_SCREENINGS.map((s) => [s.key, { from: s.fromAge, cycle: s.cycleMonths }])
    );
    expect(m.stomach).toEqual({ from: 40, cycle: 24 });
    expect(m.colon).toEqual({ from: 50, cycle: 12 });
    expect(m.liver).toEqual({ from: 40, cycle: 6 });
    expect(m.breast).toEqual({ from: 40, cycle: 24 });
    expect(m.cervical).toEqual({ from: 20, cycle: 24 });
    expect(m.lung).toEqual({ from: 54, cycle: 24 });
  });

  it("폐암만 상한 연령이 있다 (74세)", () => {
    expect(CANCER_SCREENINGS.find((s) => s.key === "lung")!.toAge).toBe(74);
    expect(CANCER_SCREENINGS.filter((s) => s.toAge !== Infinity)).toHaveLength(1);
  });

  it("대장암만 매년이다", () => {
    expect(CANCER_SCREENINGS.filter((s) => s.cycleMonths === 12).map((s) => s.key)).toEqual([
      "colon",
    ]);
  });

  it("고위험군 전용은 간암·폐암 둘", () => {
    expect(CANCER_SCREENINGS.filter((s) => s.highRiskOnly).map((s) => s.key)).toEqual([
      "liver",
      "lung",
    ]);
  });

  it("일반건강검진은 2년 주기", () => {
    expect(GENERAL_CYCLE).toBe(2);
  });
});

const base: CheckupInput = {
  birthYear: 1980,
  year: 2026,
  sex: "female",
  nonOffice: false,
  liverHighRisk: false,
  heavySmoker: false,
};

describe("일반건강검진 — 출생연도 홀짝", () => {
  it("짝수 해에 태어났으면 짝수 해가 대상", () => {
    expect(calcCheckup({ ...base, birthYear: 1980, year: 2026 }).general.eligible).toBe(true);
    expect(calcCheckup({ ...base, birthYear: 1980, year: 2027 }).general.eligible).toBe(false);
  });

  it("홀수 해에 태어났으면 홀수 해가 대상", () => {
    expect(calcCheckup({ ...base, birthYear: 1981, year: 2027 }).general.eligible).toBe(true);
    expect(calcCheckup({ ...base, birthYear: 1981, year: 2026 }).general.eligible).toBe(false);
  });

  it("대상이 아니면 다음 해를 알려준다", () => {
    const r = calcCheckup({ ...base, birthYear: 1981, year: 2026 });
    expect(r.general.nextYear).toBe(2027);
  });

  it("비사무직 직장가입자는 매년 대상", () => {
    const r = calcCheckup({ ...base, birthYear: 1981, year: 2026, nonOffice: true });
    expect(r.general.eligible).toBe(true);
    expect(r.general.reason).toContain("매년");
  });

  it("만 20세 미만은 대상이 아니다", () => {
    const r = calcCheckup({ ...base, birthYear: 2010, year: 2026 });
    expect(r.age).toBe(16);
    expect(r.general.eligible).toBe(false);
    expect(r.general.nextYear).toBe(2030);
  });
});

describe("암검진 판정", () => {
  it("46세 여성(짝수년생)은 위암·유방암·자궁경부암 대상", () => {
    const r = calcCheckup({ ...base, birthYear: 1980, year: 2026, sex: "female" });
    expect(r.age).toBe(46);
    const ok = r.cancers.filter((c) => c.eligible).map((c) => c.screening.key);
    expect(ok).toEqual(["stomach", "breast", "cervical"]);
    expect(r.eligibleCount).toBe(3);
  });

  it("남성은 유방암·자궁경부암 대상이 아니다", () => {
    const r = calcCheckup({ ...base, birthYear: 1980, year: 2026, sex: "male" });
    const ok = r.cancers.filter((c) => c.eligible).map((c) => c.screening.key);
    expect(ok).toEqual(["stomach"]);
  });

  it("자궁경부암은 20세부터 — 가장 이르다", () => {
    const r = calcCheckup({ ...base, birthYear: 2006, year: 2026, sex: "female" });
    expect(r.age).toBe(20);
    expect(r.cancers.find((c) => c.screening.key === "cervical")!.eligible).toBe(true);
    expect(r.cancers.find((c) => c.screening.key === "stomach")!.eligible).toBe(false);
  });

  it("대장암은 50세부터 매년이라 홀짝과 무관", () => {
    const a = calcCheckup({ ...base, birthYear: 1975, year: 2026 });
    const b = calcCheckup({ ...base, birthYear: 1975, year: 2027 });
    expect(a.cancers.find((c) => c.screening.key === "colon")!.eligible).toBe(true);
    expect(b.cancers.find((c) => c.screening.key === "colon")!.eligible).toBe(true);
  });

  it("간암은 고위험군만", () => {
    const no = calcCheckup({ ...base, birthYear: 1980, year: 2026 });
    const yes = calcCheckup({ ...base, birthYear: 1980, year: 2026, liverHighRisk: true });
    expect(no.cancers.find((c) => c.screening.key === "liver")!.eligible).toBe(false);
    expect(yes.cancers.find((c) => c.screening.key === "liver")!.eligible).toBe(true);
  });

  it("폐암은 54~74세 고위험군만", () => {
    const young = calcCheckup({ ...base, birthYear: 1975, year: 2026, heavySmoker: true });
    const ok = calcCheckup({ ...base, birthYear: 1970, year: 2026, heavySmoker: true });
    const old = calcCheckup({ ...base, birthYear: 1950, year: 2026, heavySmoker: true });
    expect(young.age).toBe(51);
    expect(young.cancers.find((c) => c.screening.key === "lung")!.eligible).toBe(false);
    expect(ok.age).toBe(56);
    expect(ok.cancers.find((c) => c.screening.key === "lung")!.eligible).toBe(true);
    expect(old.age).toBe(76);
    expect(old.cancers.find((c) => c.screening.key === "lung")!.eligible).toBe(false);
  });

  it("2년 주기 암검진도 출생연도 홀짝을 따른다", () => {
    const r = calcCheckup({ ...base, birthYear: 1981, year: 2026, sex: "female" });
    expect(r.cancers.find((c) => c.screening.key === "cervical")!.eligible).toBe(false);
  });
});
