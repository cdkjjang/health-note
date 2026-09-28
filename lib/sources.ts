// 가이드 "이 글의 근거"에 쓰는 링크.
//
// 2026-09-27 전수 대조에서 **본문을 열어 확인한 것만** 넣었다.
// law.go.kr 조문은 iframe 본문, 별표는 문서뷰어의 쪽별 텍스트까지 읽었다.
// 별표 링크는 lsiSeq(연혁 번호) 없이 법령명으로 걸어 늘 현행을 연다.
// ⚠️ 확인하지 않은 링크를 여기에 추가하지 말 것.

type Source = { label: string; href: string; note?: string };

const BYL = (lsNm: string, bylNo: string) =>
  `https://www.law.go.kr/LSW/lsBylInfoPLinkR.do?lsNm=${encodeURIComponent(lsNm).replace(/%20/g, "+")}&bylNo=${bylNo}&bylBrNo=00&bylCls=BE&bylEfYdYn=Y`;

const JO = (law: string, jo: string) => `https://www.law.go.kr/법령/${law}/${jo}`;

export const SRC = {
  depRelation: {
    label: "국민건강보험법 시행규칙 별표1 — 부양요건",
    href: BYL("국민건강보험법 시행규칙", "0001"),
    note: "관계별 동거·비동거 인정 기준, 형제자매 30세 미만·65세 이상",
  },
  depIncome: {
    label: "국민건강보험법 시행규칙 별표1의2 — 소득·재산요건",
    href: "https://www.law.go.kr/LSW/lsLawLinkInfo.do?lsJoLnkSeq=1000920862",
    note: "합산소득 2천만원, 사업소득 500만원 예외, 기혼자는 부부 모두(제1호라목), 재산 5.4억·9억",
  },
  depLoss: {
    label: "국민건강보험법 시행규칙 제2조",
    href: JO("국민건강보험법시행규칙", "제2조"),
    note: "피부양자 자격 상실일 — 사업소득 미신고 시 발생한 달 말일로 소급",
  },
  incomeKinds: {
    label: "국민건강보험법 시행령 제41조",
    href: JO("국민건강보험법시행령", "제41조"),
    note: "소득월액에 넣는 소득 — 이자·배당·사업·근로·연금·기타, 비과세 제외",
  },
  incomeCalc: {
    label: "국민건강보험법 시행규칙 제44조",
    href: JO("국민건강보험법시행규칙", "제44조"),
    note: "이자·배당 합계 1천만원 이하는 합산하지 않음",
  },
  settle: {
    label: "국민건강보험법 시행령 제39조",
    href: JO("국민건강보험법시행령", "제39조"),
    note: "보수월액보험료 정산, 12회 이내 분할납부",
  },
  arrears: {
    label: "국민건강보험법 시행규칙 제55조",
    href: JO("국민건강보험법시행규칙", "제55조"),
    note: "3회 이상 체납 시 24회 이내 분할납부 승인",
  },
  abroad: {
    label: "국민건강보험법 제74조",
    href: JO("국민건강보험법", "제74조"),
    note: "국외 체류 시 보험료 면제 — 직장가입자는 국내 피부양자가 없을 때",
  },
  copayRate: {
    label: "국민건강보험법 시행령 별표2 — 본인일부부담금",
    href: BYL("국민건강보험법 시행령", "0002"),
    note: "종별 외래 부담률, 상급종합 진찰료 전액, 장기입원·2~3인실, 365회 초과 90%",
  },
  elderFlat: {
    label: "국민건강보험법 시행규칙 별표3",
    href: BYL("국민건강보험법 시행규칙", "0003"),
    note: "65세 이상 의원 외래 1만 5천원 이하 1,500원",
  },
  erMild: {
    label: "국민건강보험법 시행규칙 별표6",
    href: BYL("국민건강보험법 시행규칙", "0006"),
    note: "경증·비응급 환자의 권역응급의료센터 등 이용 시 90%, 요양급여 절차 미준수 시 전액",
  },
  nhisCap: {
    label: "국민건강보험공단 — 본인부담상한제",
    href: "https://www.nhis.or.kr/nhis/minwon/wbhapa01000m01.do?mode=view&articleNo=10946900",
    note: "2026년 상한액, 제외 항목, 사전급여 843만원 기준, 분위 기준보험료",
  },
  nccScreen: {
    label: "국가암정보센터 — 국가암검진 대상·주기",
    href: "https://www.cancer.go.kr/lay1/S1T261C262/contents.do",
    note: "6대 암 대상 연령·주기, 폐암 고위험군(30갑년 현재 흡연자)",
  },
  nccCost: {
    label: "국가암정보센터 — 암검진 비용",
    href: "https://www.cancer.go.kr/lay1/S1T553C556/contents.do",
    note: "보험료 상위 50% 10% 본인부담, 대장·자궁경부 무료",
  },
  mohwMental: {
    label: "보건복지부 보도자료 — 청년층 정신건강검진 확대",
    href: "https://www.mohw.go.kr/board.es?mid=a10503000000&bid=0027&list_no=1483375&act=view",
    note: "2025년부터 20~34세 2년마다, 조기정신증 검사 도입",
  },
} satisfies Record<string, Source>;
