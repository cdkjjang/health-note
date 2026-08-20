// 국가건강검진 대상·주기 판정
//
// 근거: 건강검진기본법, 국민건강보험법 제52조(건강검진),
//       암관리법 시행령 별표1(암검진 대상자 및 검진주기)
//
// [출생연도 홀짝으로 갈린다]
//   일반건강검진은 2년에 한 번이고, **출생연도 끝자리가 짝수면 짝수 해에,
//   홀수면 홀수 해에** 받는다. 2026년은 짝수 해이므로 1990년생·1988년생처럼
//   짝수 해에 태어난 사람이 대상이다.
//   다만 **비사무직 직장가입자는 매년** 받는다.
//
// [암검진은 종류마다 나이와 주기가 다르다]
//   위암 40세 2년, 대장암 50세 1년, 유방암 40세 여성 2년,
//   자궁경부암 20세 여성 2년, 간암 40세 고위험군 6개월,
//   폐암 54~74세 고위험군 2년.
//   자궁경부암만 20세부터라 젊은 여성이 놓치기 쉽다.
//
// [비용]
//   일반건강검진과 암검진 대부분은 무료다. 대장내시경·위내시경 등
//   확진 검사와 일부 항목은 본인부담이 있을 수 있다.
//
// ⚠️ 이 판정은 참고용이다. 실제 대상 여부는 건강보험공단의 검진대상자
//   조회에서 확인해야 한다. 특히 전년도 미수검자 추가 대상, 만 20~64세
//   지역가입자 세대원 등 예외가 있다.

/** 일반건강검진 주기 (년) */
export const GENERAL_CYCLE = 2;

/** 일반건강검진 대상 최소 연령 (세대주·직장가입자는 나이 무관) */
export const GENERAL_MIN_AGE = 20;

export type Sex = "male" | "female";

export interface CancerScreening {
  key: string;
  name: string;
  /** 최소 연령 */
  fromAge: number;
  /** 최대 연령. 없으면 Infinity */
  toAge: number;
  /** 주기 (개월) */
  cycleMonths: number;
  /** 성별 제한 */
  sex?: Sex;
  /** 고위험군만 대상인지 */
  highRiskOnly: boolean;
  method: string;
  note: string;
}

/** 국가암검진 6종 (암관리법 시행령 별표1) */
export const CANCER_SCREENINGS: CancerScreening[] = [
  {
    key: "stomach",
    name: "위암",
    fromAge: 40,
    toAge: Infinity,
    cycleMonths: 24,
    highRiskOnly: false,
    method: "위내시경 (또는 위장조영검사)",
    note: "만 40세부터 2년마다. 우리나라에서 발생률이 높아 검진 효과가 큰 편입니다.",
  },
  {
    key: "colon",
    name: "대장암",
    fromAge: 50,
    toAge: Infinity,
    cycleMonths: 12,
    highRiskOnly: false,
    method: "분변잠혈검사 → 이상 시 대장내시경",
    note: "만 50세부터 매년. 6종 중 유일하게 해마다 받습니다. 1차 검사는 대변만 제출하면 됩니다.",
  },
  {
    key: "liver",
    name: "간암",
    fromAge: 40,
    toAge: Infinity,
    cycleMonths: 6,
    highRiskOnly: true,
    method: "간초음파 + 혈액검사(AFP)",
    note: "만 40세 이상 고위험군만. 간경변증, B형·C형 간염 바이러스 보유자 등이 해당하며 6개월마다 받습니다.",
  },
  {
    key: "breast",
    name: "유방암",
    fromAge: 40,
    toAge: Infinity,
    cycleMonths: 24,
    sex: "female",
    highRiskOnly: false,
    method: "유방촬영술",
    note: "만 40세 이상 여성, 2년마다.",
  },
  {
    key: "cervical",
    name: "자궁경부암",
    fromAge: 20,
    toAge: Infinity,
    cycleMonths: 24,
    sex: "female",
    highRiskOnly: false,
    method: "자궁경부세포검사",
    note: "만 20세 이상 여성, 2년마다. 6종 중 가장 이른 나이에 시작하는데 그만큼 많이 놓칩니다.",
  },
  {
    key: "lung",
    name: "폐암",
    fromAge: 54,
    toAge: 74,
    cycleMonths: 24,
    highRiskOnly: true,
    method: "저선량 흉부 CT",
    note: "만 54~74세 중 30갑년 이상 흡연력을 가진 고위험군만, 2년마다. (하루 1갑 × 30년 = 30갑년)",
  },
];

export interface CheckupInput {
  /** 출생연도 */
  birthYear: number;
  /** 판정 기준 연도 */
  year: number;
  sex: Sex;
  /** 비사무직 직장가입자 — 일반검진을 매년 받는다 */
  nonOffice: boolean;
  /** 간암 고위험군 (간경변·B/C형 간염 등) */
  liverHighRisk: boolean;
  /** 30갑년 이상 흡연력 */
  heavySmoker: boolean;
}

export interface GeneralResult {
  eligible: boolean;
  reason: string;
  /** 이번 해가 아니라면 다음 대상 연도 */
  nextYear: number | null;
}

export interface CancerResult {
  screening: CancerScreening;
  eligible: boolean;
  reason: string;
}

export interface CheckupResult {
  age: number;
  general: GeneralResult;
  cancers: CancerResult[];
  /** 올해 받을 수 있는 암검진 수 */
  eligibleCount: number;
}

export function calcCheckup(input: CheckupInput): CheckupResult {
  // 국가건강검진은 만 나이가 아니라 '해당 연도 − 출생연도'로 본다.
  const age = input.year - input.birthYear;

  // ── 일반건강검진
  let general: GeneralResult;
  if (age < GENERAL_MIN_AGE) {
    general = {
      eligible: false,
      reason: `만 ${GENERAL_MIN_AGE}세부터 대상입니다. 그 전에는 영유아·학생 검진을 받습니다.`,
      nextYear: input.birthYear + GENERAL_MIN_AGE,
    };
  } else if (input.nonOffice) {
    general = {
      eligible: true,
      reason: "비사무직 직장가입자는 출생연도와 관계없이 매년 대상입니다.",
      nextYear: null,
    };
  } else {
    const sameParity = input.birthYear % 2 === input.year % 2;
    general = {
      eligible: sameParity,
      reason: sameParity
        ? `출생연도(${input.birthYear})와 검진연도(${input.year})의 홀짝이 같아 올해가 대상입니다.`
        : `출생연도(${input.birthYear})가 ${input.birthYear % 2 === 0 ? "짝수" : "홀수"}라 ${input.birthYear % 2 === 0 ? "짝수" : "홀수"} 해에 받습니다. 올해는 대상이 아닙니다.`,
      nextYear: sameParity ? null : input.year + 1,
    };
  }

  // ── 암검진
  const cancers: CancerResult[] = CANCER_SCREENINGS.map((s) => {
    if (s.sex && s.sex !== input.sex) {
      return { screening: s, eligible: false, reason: `${s.sex === "female" ? "여성" : "남성"}만 해당합니다.` };
    }
    if (age < s.fromAge) {
      return { screening: s, eligible: false, reason: `만 ${s.fromAge}세부터 대상입니다. (${input.birthYear + s.fromAge}년부터)` };
    }
    if (age > s.toAge) {
      return { screening: s, eligible: false, reason: `만 ${s.toAge}세까지가 대상입니다.` };
    }
    if (s.highRiskOnly) {
      const isRisk = s.key === "liver" ? input.liverHighRisk : input.heavySmoker;
      if (!isRisk) {
        return {
          screening: s,
          eligible: false,
          reason:
            s.key === "liver"
              ? "간경변증, B형·C형 간염 바이러스 보유자 등 고위험군만 대상입니다."
              : "30갑년 이상 흡연력을 가진 고위험군만 대상입니다.",
        };
      }
      return { screening: s, eligible: true, reason: `고위험군으로 ${s.cycleMonths}개월마다 대상입니다.` };
    }
    // 2년 주기 암검진도 출생연도 홀짝을 따른다
    if (s.cycleMonths === 24) {
      const sameParity = input.birthYear % 2 === input.year % 2;
      return {
        screening: s,
        eligible: sameParity,
        reason: sameParity
          ? "올해가 대상입니다 (2년 주기, 출생연도 홀짝 기준)."
          : "2년 주기라 올해는 대상이 아닙니다. 내년에 받으세요.",
      };
    }
    return { screening: s, eligible: true, reason: "매년 대상입니다." };
  });

  return {
    age,
    general,
    cancers,
    eligibleCount: cancers.filter((c) => c.eligible).length,
  };
}
