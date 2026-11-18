// 계산기 결과 아래에 보여 주는 쿠팡 상품 링크 (2026-11-19, LBJ-REQ-7 사용자 결정).
// 상품은 피클AI 큐레이션(lifebanjang-hub/collab/inbox/2026-11-16-seo-ctr-coupang-boost.md 6.1).
//
// - 계산기 slug 에 상품이 없으면 블록이 아예 그려지지 않는다(빈 자리 없음).
// - href 는 정식 파트너 딥링크(lptag=AF6888890). subId 로 노트 · 자리별 클릭을 나눠 본다.
//   파트너스 콘솔에서 단축 링크(/a/…)를 발급하면 href 만 바꾸면 된다.
// - ⚠️ title · why 에 가격 · 할인 · '최저가' · '인기' 같은 말을 넣지 말 것(표시광고법 · 파트너스 약관).
//   why 는 계산 결과와 이어지는 한 문장으로 쓴다. lib/coupang.test.ts 가 막는다.
// - ⚠️ 상품 이미지를 쿠팡 CDN 에서 직접 받아 쓰지 말 것 — 글자 블록으로 둔다.

export type CoupangPick = {
  title: string;
  why: string;
  href: string;
};

export const COUPANG_PICKS: Record<string, CoupangPick[]> = {
  "checkup": [
    {
      "title": "비접촉 적외선 체온계 (휴비딕 HFS-900)",
      "why": "검진 전날부터 몸 상태를 기록해 두면 문진표를 쓸 때 도움이 됩니다.",
      "href": "https://link.coupang.com/re/AFFSDP?lptag=AF6888890&pageKey=4762533689&subId=health1"
    },
    {
      "title": "귀 적외선 체온계 (브라운 IRT6525)",
      "why": "가족 건강을 챙기는 집에서 가장 많이 두는 체온계입니다.",
      "href": "https://link.coupang.com/re/AFFSDP?lptag=AF6888890&pageKey=7613083729&subId=health2"
    }
  ],
  "dependent": [
    {
      "title": "귀 체온계 (GC녹십자MS YHT101)",
      "why": "아이를 피부양자로 올렸다면, 밤에 열이 날 때 병원에 갈지 가늠하는 데 체온계가 먼저입니다.",
      "href": "https://link.coupang.com/re/AFFSDP?lptag=AF6888890&pageKey=8278759871&subId=health3"
    }
  ]
};

export function picksFor(calc: string): CoupangPick[] {
  return COUPANG_PICKS[calc] ?? [];
}
