// 병원비 본인부담률 — 왜 같은 진료에 다른 돈을 내나
//
// 근거: 국민건강보험법 제44조, 같은 법 시행령 별표2(본인일부부담금의 부담률 및 부담액)
//
// [같은 진료도 어디서 받느냐로 달라진다]
//   외래 본인부담률은 의료기관 종별로 정해져 있다.
//     의원 30% · 병원 40% · 종합병원 50% · 상급종합병원 60%
//   병원·종합병원은 **동 지역** 기준이다(읍·면은 35%·45%).
//   ⚠️ 상급종합병원은 "60%"가 아니라 **진찰료 총액 + (나머지 × 60%)**다
//     (별표2 제1호나목). 진찰료는 공단이 한 푼도 내지 않는다. 2026-09-27 점검 전까지
//     이 계산기는 총액의 60%만 계산했다. 그래서 `consultFee` 입력을 받는다.
//   외래 본인부담금은 100원 미만을 버린다(같은 호 본문). 입원은 버리지 않는다.
//   입원은 종별과 무관하게 20%다. (식대는 50%)
//   16일 이상 장기입원 입원료 25~30%, 2·3인실 입원료 30~50%는 반영하지 않는다.
//
//   그래서 감기로 대학병원에 가면 동네 의원의 두 배를 낸다. 상급종합병원은
//   중증 환자를 보라고 만든 곳이라, 경증으로 가면 부담을 크게 지운다.
//
// [산정특례 — 중증질환은 5~10%]
//   암, 중증화상, 희귀·중증난치질환 등은 등록하면 본인부담률이 크게 내려간다.
//   암은 5년간 5%, 희귀·중증난치질환은 10%다. 심장·뇌혈관질환은 수술 등
//   특정 시술에 한해 30일간 5%가 적용된다.
//
// ⚠️ 이 계산기가 다루지 않는 것 — 비급여
//   **비급여는 본인부담률과 무관하게 전액 본인 부담이다.** 상급병실료 차액,
//   도수치료, 미용·성형, 일부 신의료기술 등이 여기 해당한다. 영수증에서
//   '급여'와 '비급여'가 나뉘어 있는 이유다. 병원비가 예상보다 많이 나오는
//   경우는 대개 비급여 비중이 크기 때문이다. 이 설명을 빼지 말 것.
//
// ⚠️ 갱신 대상: 부담률은 시행령 별표2 개정 시. 값을 고치면 테스트가 먼저 깨진다.

export type Facility =
  | "clinic"          // 의원
  | "hospital"        // 병원
  | "general"         // 종합병원
  | "tertiary"        // 상급종합병원
  | "pharmacy";       // 약국

export type VisitType = "outpatient" | "inpatient";

export interface FacilityInfo {
  key: Facility;
  label: string;
  /** 외래 본인부담률 */
  outpatient: number;
  hint: string;
}

export const FACILITIES: FacilityInfo[] = [
  { key: "clinic", label: "의원", outpatient: 0.3, hint: "동네 의원·치과의원·한의원" },
  { key: "hospital", label: "병원", outpatient: 0.4, hint: "병상 30~100개 · 읍·면은 35%" },
  { key: "general", label: "종합병원", outpatient: 0.5, hint: "병상 100개 이상 · 읍·면은 45%" },
  { key: "tertiary", label: "상급종합병원", outpatient: 0.6, hint: "대학병원 등 · 진찰료는 전액" },
  { key: "pharmacy", label: "약국", outpatient: 0.3, hint: "처방조제" },
];

/** 입원 본인부담률 — 종별 무관 */
export const INPATIENT_RATE = 0.2;

/** 입원 식대 본인부담률 */
export const MEAL_RATE = 0.5;

/** 산정특례 유형 */
export type SpecialCase = "none" | "cancer" | "rare" | "burn" | "cardio";

export const SPECIAL_CASES: { key: SpecialCase; label: string; rate: number; hint: string }[] = [
  { key: "none", label: "해당 없음", rate: 0, hint: "" },
  { key: "cancer", label: "암", rate: 0.05, hint: "등록일부터 5년간 5%" },
  { key: "rare", label: "희귀·중증난치질환", rate: 0.1, hint: "10%" },
  { key: "burn", label: "중증화상", rate: 0.05, hint: "등록일부터 1년간 5%" },
  { key: "cardio", label: "심장·뇌혈관질환", rate: 0.05, hint: "해당 수술·시술일부터 30일간 5%" },
];

export interface CopayRateInput {
  /** 총 진료비 중 급여 대상 금액 (원) */
  coveredTotal: number;
  /** 비급여 금액 (원) */
  uncovered: number;
  facility: Facility;
  visit: VisitType;
  specialCase: SpecialCase;
  /** 진찰료 총액 (원) — 상급종합병원 외래에서만 쓰인다. 이 부분은 전액 본인 부담 */
  consultFee?: number;
}

export interface CopayRateResult {
  /** 적용된 본인부담률 */
  rate: number;
  /** 산정특례가 적용됐는지 */
  specialApplied: boolean;
  /** 급여분 본인부담금 (원) */
  coveredCopay: number;
  /** 공단이 부담하는 금액 (원) */
  insurerPays: number;
  /** 비급여 (전액 본인 부담, 원) */
  uncovered: number;
  /** 실제로 내는 총액 (원) */
  totalPay: number;
  /** 전체 진료비 (원) */
  grandTotal: number;
  /** 실질 부담률 — 비급여까지 포함해 실제로 낸 비율 */
  effectiveRate: number;
  /** 같은 진료를 의원에서 받았다면 (원). 외래일 때만 의미 있음 */
  ifClinic: number;
}

export function facilityOf(key: Facility): FacilityInfo {
  return FACILITIES.find((f) => f.key === key) ?? FACILITIES[0];
}

export function calcCopayRate(input: CopayRateInput): CopayRateResult {
  const covered = Math.max(0, input.coveredTotal);
  const uncovered = Math.max(0, input.uncovered);

  const special = SPECIAL_CASES.find((s) => s.key === input.specialCase);
  const specialApplied = !!special && special.key !== "none";

  const baseRate =
    input.visit === "inpatient" ? INPATIENT_RATE : facilityOf(input.facility).outpatient;
  const rate = specialApplied ? special!.rate : baseRate;

  const outpatient = input.visit === "outpatient";
  // 외래는 100원 미만을 버리고, 입원은 원 단위까지 낸다
  const trim = (v: number) => (outpatient ? Math.floor(v / 100) * 100 : Math.floor(v));

  // 상급종합병원 외래: 진찰료 전액 + 나머지의 60%
  const consult =
    outpatient && !specialApplied && input.facility === "tertiary"
      ? Math.min(Math.max(0, input.consultFee ?? 0), covered)
      : 0;
  const coveredCopay = trim(consult + (covered - consult) * rate);
  const insurerPays = covered - coveredCopay;
  const totalPay = coveredCopay + uncovered;
  const grandTotal = covered + uncovered;

  const clinicRate = specialApplied
    ? special!.rate
    : input.visit === "inpatient"
      ? INPATIENT_RATE
      : facilityOf("clinic").outpatient;

  return {
    rate,
    specialApplied,
    coveredCopay,
    insurerPays,
    uncovered,
    totalPay,
    grandTotal,
    effectiveRate: grandTotal > 0 ? totalPay / grandTotal : 0,
    ifClinic: trim(covered * clinicRate) + uncovered,
  };
}

/** 상급종합병원과 의원의 외래 본인부담 차이 (배수) */
export function tertiaryVsClinic(): number {
  return facilityOf("tertiary").outpatient / facilityOf("clinic").outpatient;
}
