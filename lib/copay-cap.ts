// 본인부담상한제 — 환급 계산
//
// 근거: 국민건강보험법 제44조 제2항, 같은 법 시행령 제19조 및 별표3,
//       국민건강보험공단 「2026년도 본인부담상한액 안내」
//
// [한 해에 낸 병원비가 상한을 넘으면 돌려준다]
//   1월 1일부터 12월 31일까지 건강보험이 적용된 진료비 중 본인이 부담한
//   금액이 소득분위별 상한액을 넘으면, 초과분을 공단이 돌려준다.
//   전년도 진료분을 **다음 해 8월 말 이후** 순차 정산해 안내문을 보낸다.
//
// [소득분위는 '연평균 건강보험료'로 정해진다]
//   재산이나 연봉이 아니라 그해에 낸 건강보험료의 연평균으로 1~10분위를
//   나눈다. 직장·지역 구분 없이 같은 기준을 쓴다.
//
// [요양병원 120일 초과는 상한액이 따로다]
//   요양병원에 120일을 넘겨 입원한 경우 더 높은 상한액이 적용된다.
//   장기 입원을 통한 과다 이용을 억제하려는 장치다. 같은 1분위라도
//   90만원이 아니라 143만원이 된다.
//
// ⚠️ 상한액에 포함되지 않는 것 (중요)
//   **비급여는 대상이 아니다.** 상급병실료 차액, 선택진료비, 미용·성형,
//   추나요법 일부, 도수치료, 신의료기술 중 비급여 항목은 아무리 많이 내도
//   상한제와 무관하다. "병원비 500만원 냈는데 왜 환급이 없나"는 대부분
//   비급여 비중이 큰 경우다. 이 설명을 빼지 말 것.
//
// ⚠️ 갱신 대상: 상한액은 **매년 1월** 전국소비자물가변동률을 반영해 고시된다.
//   값을 고치면 `copay-cap.test.ts`의 고정 테스트가 먼저 깨진다.

/** 소득분위 */
export type Decile = 1 | 2 | 4 | 6 | 8 | 9 | 10;

export interface CapTier {
  /** 구간 대표 키 */
  key: Decile;
  label: string;
  /** 일반 상한액 (원) */
  normal: number;
  /** 요양병원 120일 초과 입원 시 상한액 (원) */
  longTerm: number;
}

/** 2026년도 본인부담상한액 (국민건강보험공단 고시) */
export const CAP_TIERS: CapTier[] = [
  { key: 1, label: "1분위 (하위 10%)", normal: 900_000, longTerm: 1_430_000 },
  { key: 2, label: "2~3분위", normal: 1_120_000, longTerm: 1_810_000 },
  { key: 4, label: "4~5분위", normal: 1_730_000, longTerm: 2_450_000 },
  { key: 6, label: "6~7분위", normal: 3_260_000, longTerm: 4_040_000 },
  { key: 8, label: "8분위", normal: 4_460_000, longTerm: 5_800_000 },
  { key: 9, label: "9분위", normal: 5_360_000, longTerm: 6_980_000 },
  { key: 10, label: "10분위 (상위 10%)", normal: 8_430_000, longTerm: 10_960_000 },
];

/** 요양병원 장기입원 판정 기준 (일) */
export const LONG_TERM_DAYS = 120;

/** 정산 안내가 시작되는 달 */
export const SETTLEMENT_MONTH = 8;

export function tierOf(key: Decile): CapTier {
  return CAP_TIERS.find((t) => t.key === key) ?? CAP_TIERS[0];
}

export interface CopayCapInput {
  /** 소득분위 */
  decile: Decile;
  /** 한 해 동안 본인이 부담한 급여 진료비 (원) */
  coveredCopay: number;
  /** 비급여로 낸 금액 (원) — 상한제 대상이 아니다 */
  uncovered: number;
  /** 요양병원 입원일수 (일) */
  hospitalDays: number;
}

export interface CopayCapResult {
  tier: CapTier;
  /** 적용된 상한액 (원) */
  cap: number;
  /** 요양병원 120일 초과 상한이 적용됐는지 */
  longTermApplied: boolean;
  /** 환급 예상액 (원) */
  refund: number;
  /** 환급이 있는지 */
  hasRefund: boolean;
  /** 상한까지 남은 금액 (원). 이미 넘었으면 0 */
  remaining: number;
  /** 비급여 (상한제 대상이 아니다, 원) */
  uncovered: number;
  /** 실제로 부담하게 되는 총액 = min(급여본인부담, 상한) + 비급여 */
  finalBurden: number;
  /** 전체 지출 중 상한제가 손대지 못하는 비율 (비급여 비중) */
  uncoveredRatio: number;
}

export function calcCopayCap(input: CopayCapInput): CopayCapResult {
  const tier = tierOf(input.decile);
  const longTermApplied = Math.max(0, input.hospitalDays) > LONG_TERM_DAYS;
  const cap = longTermApplied ? tier.longTerm : tier.normal;

  const covered = Math.max(0, input.coveredCopay);
  const uncovered = Math.max(0, input.uncovered);

  const refund = Math.max(0, covered - cap);
  const finalBurden = Math.min(covered, cap) + uncovered;
  const total = covered + uncovered;

  return {
    tier,
    cap,
    longTermApplied,
    refund,
    hasRefund: refund > 0,
    remaining: Math.max(0, cap - covered),
    uncovered,
    finalBurden,
    uncoveredRatio: total > 0 ? uncovered / total : 0,
  };
}

/**
 * 같은 지출인데 요양병원 120일을 넘겼을 때 얼마를 더 부담하는지.
 * 장기입원 기준의 실질 효과를 보여주기 위한 것.
 */
export function longTermPenalty(decile: Decile): number {
  const t = tierOf(decile);
  return t.longTerm - t.normal;
}
