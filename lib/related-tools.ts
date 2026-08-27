/**
 * 이 노트의 계산기를 쓴 사람이 **다음에 마주칠 질문**과, 그 답이 있는
 * 다른 노트의 계산기.
 *
 * ⚠️ 이 파일은 워크스페이스 생성기로 만든다. 손으로 고치면 다음 생성 때 덮인다.
 *
 * 규칙 (components/RelatedTools.tsx 주석 참조):
 *   - 계산기마다 최대 3개. 페이지마다 내용이 달라야 한다.
 *   - 같은 노트 안의 계산기는 넣지 않는다.
 *   - "관련 계산기"가 아니라 그 사람이 실제로 다음에 겪는 일로 적는다.
 */
export type RelatedTool = {
  /** 그 사람이 다음에 던지는 질문 — 링크 텍스트가 된다 */
  question: string;
  /** 어느 노트인지 */
  note: string;
  /** 어떤 계산기인지 */
  tool: string;
  /** 전체 URL (다른 도메인이므로 절대 경로) */
  href: string;
};

export const RELATED_TOOLS: Record<string, RelatedTool[]> = {
  "/calc/dependent": [
    {
      question: "퇴사했는데 임의계속가입이 더 싼가요",
      note: "퇴사노트",
      tool: "퇴사 후 건강보험 계산기",
      href: "https://toesa.lifebanjang.com/calc/health",
    },
    {
      question: "직장가입자면 보험료가 얼마인가요",
      note: "급여노트",
      tool: "4대보험 계산기",
      href: "https://salary.lifebanjang.com/calc/insurance",
    },
    {
      question: "연금을 받으면 소득으로 잡히나요",
      note: "연금노트",
      tool: "기초연금 계산기",
      href: "https://pension.lifebanjang.com/calc/basic",
    },
  ],
  "/calc/cap": [
    {
      question: "의료비 세액공제도 받을 수 있나요",
      note: "세금노트",
      tool: "연말정산 계산기",
      href: "https://tax.lifebanjang.com/calc/year-end",
    },
    {
      question: "퇴사 후 보험료는 얼마가 되나요",
      note: "퇴사노트",
      tool: "퇴사 후 건강보험 계산기",
      href: "https://toesa.lifebanjang.com/calc/health",
    },
    {
      question: "기초연금 자격에 영향이 있나요",
      note: "연금노트",
      tool: "기초연금 계산기",
      href: "https://pension.lifebanjang.com/calc/basic",
    },
  ],
  "/calc/checkup": [
    {
      question: "직장가입자 보험료는 얼마인가요",
      note: "급여노트",
      tool: "4대보험 계산기",
      href: "https://salary.lifebanjang.com/calc/insurance",
    },
    {
      question: "퇴사하면 검진 대상에서 빠지나요",
      note: "퇴사노트",
      tool: "퇴사 후 건강보험 계산기",
      href: "https://toesa.lifebanjang.com/calc/health",
    },
    {
      question: "아이 예방접종 일정도 챙겨야 하나요",
      note: "육아노트",
      tool: "예방접종 일정 계산기",
      href: "https://baby.lifebanjang.com/calc/vaccine",
    },
  ],
  "/calc/rate": [
    {
      question: "낸 병원비를 연말정산에서 공제받나요",
      note: "세금노트",
      tool: "연말정산 계산기",
      href: "https://tax.lifebanjang.com/calc/year-end",
    },
    {
      question: "직장가입자는 보험료를 얼마나 내나요",
      note: "급여노트",
      tool: "4대보험 계산기",
      href: "https://salary.lifebanjang.com/calc/insurance",
    },
    {
      question: "퇴사 후에는 보험료가 얼마인가요",
      note: "퇴사노트",
      tool: "퇴사 후 건강보험 계산기",
      href: "https://toesa.lifebanjang.com/calc/health",
    },
  ],
};
