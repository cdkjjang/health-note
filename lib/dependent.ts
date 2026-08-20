// 건강보험 피부양자 자격 판정
//
// 근거: 국민건강보험법 제5조(적용 대상 등), 같은 법 시행규칙 별표1
//       (피부양자 자격의 인정기준 중 소득 및 재산요건)
//
// [피부양자가 되면 보험료가 0원이다]
//   직장가입자의 가족으로 등재되면 보험료를 내지 않는다. 그래서 퇴직·실직 후
//   가장 먼저 확인해야 할 선택지다. 다만 요건이 계속 강화돼 왔고, 특히
//   2022년 2단계 개편에서 소득 기준이 3,400만원 → 2,000만원으로 내려가면서
//   탈락자가 크게 늘었다.
//
// [세 가지를 모두 통과해야 한다]
//   ① 부양요건 — 직장가입자와의 관계·동거 여부
//   ② 소득요건 — 연간 합산소득 2,000만원 이하 (+ 사업소득 별도 기준)
//   ③ 재산요건 — 재산세 과세표준 기준
//
// [가장 많이 걸리는 함정 두 가지]
//   · **사업자등록이 있으면 사업소득이 1원만 있어도 탈락한다.** 소득 2,000만원
//     기준과는 별개로 작동한다. 퇴직 후 프리랜서로 사업자등록을 내는 순간
//     피부양자에서 빠지는 경우가 많다.
//   · **소득 2,000만원은 '초과하면 즉시'다.** 2,000만 1원이어도 탈락한다.
//     구간별 감액이 아니라 통과/탈락이다.
//
// ⚠️ 이 판정은 참고용이다. 최종 판단은 건강보험공단이 한다. 특히 부양요건은
//   가족관계와 동거 여부를 개별로 확인하므로, 여기서 통과가 나와도 결과가
//   다를 수 있다.
//
// ⚠️ 갱신 대상: 소득·재산 기준은 시행규칙 개정 시 바뀐다. 값을 고치면
//   `dependent.test.ts`의 고정 테스트가 먼저 깨진다.

/** 연간 합산소득 한도 (원) — 초과하면 즉시 탈락 */
export const INCOME_LIMIT = 20_000_000;

/** 사업자등록이 없는 경우의 사업소득 한도 (원) */
export const BUSINESS_INCOME_LIMIT_NO_REG = 5_000_000;

/** 재산세 과세표준 — 이 금액 이하면 소득과 무관하게 통과 (원) */
export const PROPERTY_SAFE = 540_000_000;

/** 재산세 과세표준 — 이 금액을 넘으면 소득과 무관하게 탈락 (원) */
export const PROPERTY_FAIL = 900_000_000;

/** 재산 5.4억~9억 구간에서 요구되는 소득 한도 (원) */
export const INCOME_LIMIT_MID_PROPERTY = 10_000_000;

/** 형제자매의 재산세 과세표준 한도 (원) */
export const SIBLING_PROPERTY_LIMIT = 180_000_000;

/** 형제자매가 피부양자가 될 수 있는 나이 */
export const SIBLING_YOUNG_MAX = 30;
export const SIBLING_OLD_MIN = 65;

/**
 * 금액을 "2억원" · "5,400만원" · "2억 3,000만원"처럼 읽기 쉽게.
 * 만원 단위로만 쓰면 "20,000만원" 같은 어색한 표기가 나온다.
 */
export function formatMoney(won: number): string {
  const v = Math.round(Math.max(0, won));
  if (v === 0) return "0원";
  const eok = Math.floor(v / 100_000_000);
  const man = Math.floor((v % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  if (man > 0) return `${man.toLocaleString()}만원`;
  return `${v.toLocaleString()}원`;
}

/** 직장가입자와의 관계 */
export type Relation =
  | "spouse"      // 배우자
  | "lineal"      // 직계존비속 (부모·조부모·자녀·손자녀)
  | "inLaw"       // 배우자의 직계존속
  | "sibling"     // 형제자매
  | "other";      // 그 밖

export const RELATIONS: { key: Relation; label: string; hint: string }[] = [
  { key: "spouse", label: "배우자", hint: "동거 여부 무관" },
  { key: "lineal", label: "부모·자녀·조부모·손자녀", hint: "직계존비속" },
  { key: "inLaw", label: "배우자의 부모·조부모", hint: "장인·시부모 등" },
  { key: "sibling", label: "형제자매", hint: "요건이 훨씬 까다롭습니다" },
  { key: "other", label: "그 밖의 친족", hint: "원칙적으로 대상이 아닙니다" },
];

export interface DependentInput {
  relation: Relation;
  /** 형제자매인 경우의 나이 */
  age: number;
  /** 장애인·국가유공상이자 등 */
  disabled: boolean;
  /** 연간 합산소득 (이자·배당·사업·근로·연금·기타, 원) */
  totalIncome: number;
  /** 사업자등록이 되어 있는지 */
  hasBusinessReg: boolean;
  /** 사업소득 (원) */
  businessIncome: number;
  /** 재산세 과세표준 (원) */
  propertyBase: number;
}

export type CheckStatus = "pass" | "fail" | "warn";

export interface Check {
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface DependentResult {
  checks: Check[];
  /** 하나라도 fail이면 false */
  qualified: boolean;
  /** 확인이 필요한 항목이 있는지 */
  hasWarning: boolean;
  /** 소득 기준까지 남은 여유 (원). 음수면 초과분 */
  incomeHeadroom: number;
}

export function calcDependent(input: DependentInput): DependentResult {
  const checks: Check[] = [];
  const income = Math.max(0, input.totalIncome);
  const property = Math.max(0, input.propertyBase);

  // ── ① 부양요건
  if (input.relation === "sibling") {
    const ageOk =
      input.age < SIBLING_YOUNG_MAX || input.age >= SIBLING_OLD_MIN || input.disabled;
    const propOk = property <= SIBLING_PROPERTY_LIMIT;
    checks.push({
      label: "부양요건 — 형제자매",
      status: ageOk && propOk ? "warn" : "fail",
      detail: !ageOk
        ? `형제자매는 30세 미만이거나 65세 이상, 또는 장애인이어야 합니다. 현재 ${input.age}세라 해당하지 않습니다.`
        : !propOk
          ? `형제자매는 재산세 과세표준이 1억 8천만원 이하여야 합니다. 현재 ${formatMoney(property)}입니다.`
          : "나이·재산 요건은 맞지만, 형제자매는 미혼이면서 실제로 부양받고 있어야 인정됩니다. 공단 확인이 필요합니다.",
    });
  } else if (input.relation === "other") {
    checks.push({
      label: "부양요건",
      status: "fail",
      detail:
        "배우자, 직계존비속, 배우자의 직계존속, 형제자매가 아닌 친족은 피부양자가 될 수 없습니다.",
    });
  } else {
    checks.push({
      label: "부양요건",
      status: "pass",
      detail:
        input.relation === "spouse"
          ? "배우자는 동거 여부와 관계없이 부양요건을 충족합니다."
          : "직계 관계는 부양요건을 충족합니다. 다만 비동거 시 다른 부양자가 있으면 확인이 필요할 수 있습니다.",
    });
  }

  // ── ② 소득요건
  const incomeOk = income <= INCOME_LIMIT;
  checks.push({
    label: "연간 합산소득 2,000만원 이하",
    status: incomeOk ? "pass" : "fail",
    detail: incomeOk
      ? `${formatMoney(income)} — 한도까지 ${formatMoney(INCOME_LIMIT - income)} 남았습니다.`
      : `${formatMoney(income)} — 한도를 ${formatMoney(income - INCOME_LIMIT)} 넘었습니다. 1원만 초과해도 탈락합니다.`,
  });

  // ── ②-2 사업소득 별도 기준
  const biz = Math.max(0, input.businessIncome);
  if (input.hasBusinessReg) {
    checks.push({
      label: "사업소득 (사업자등록 있음)",
      status: biz > 0 ? "fail" : "pass",
      detail:
        biz > 0
          ? "사업자등록이 있으면 사업소득이 1원만 있어도 탈락합니다. 소득 2,000만원 기준과는 별개로 작동합니다."
          : "사업자등록은 있으나 사업소득이 없어 통과합니다. 소득이 발생하는 즉시 자격을 잃습니다.",
    });
  } else if (biz > 0) {
    checks.push({
      label: "사업소득 (사업자등록 없음)",
      status: biz <= BUSINESS_INCOME_LIMIT_NO_REG ? "pass" : "fail",
      detail:
        biz <= BUSINESS_INCOME_LIMIT_NO_REG
          ? `${formatMoney(biz)} — 사업자등록이 없으면 500만원까지 인정됩니다.`
          : `${formatMoney(biz)} — 사업자등록이 없어도 500만원을 넘으면 탈락합니다.`,
    });
  }

  // ── ③ 재산요건
  if (property > PROPERTY_FAIL) {
    checks.push({
      label: "재산세 과세표준",
      status: "fail",
      detail: `${formatMoney(property)} — 9억원을 넘으면 소득과 무관하게 탈락합니다.`,
    });
  } else if (property > PROPERTY_SAFE) {
    const ok = income <= INCOME_LIMIT_MID_PROPERTY;
    checks.push({
      label: "재산세 과세표준 5.4억~9억 구간",
      status: ok ? "pass" : "fail",
      detail: ok
        ? `${formatMoney(property)} — 이 구간은 소득이 1,000만원 이하여야 하는데 충족합니다.`
        : `${formatMoney(property)} — 이 구간은 소득이 1,000만원 이하여야 합니다. 현재 ${formatMoney(income)}입니다.`,
    });
  } else {
    checks.push({
      label: "재산세 과세표준 5.4억 이하",
      status: "pass",
      detail: `${formatMoney(property)} — 재산 요건을 충족합니다.`,
    });
  }

  return {
    checks,
    qualified: checks.every((c) => c.status !== "fail"),
    hasWarning: checks.some((c) => c.status === "warn"),
    incomeHeadroom: INCOME_LIMIT - income,
  };
}

/**
 * 재산 구간에 따라 실제로 적용되는 소득 한도.
 * "재산이 있으면 소득 문턱이 낮아진다"는 것을 화면에서 보여주기 위한 것.
 */
export function effectiveIncomeLimit(propertyBase: number): number | null {
  if (propertyBase > PROPERTY_FAIL) return null; // 소득과 무관하게 탈락
  if (propertyBase > PROPERTY_SAFE) return INCOME_LIMIT_MID_PROPERTY;
  return INCOME_LIMIT;
}
