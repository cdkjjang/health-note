// 구글에 색인을 맡기는 가이드 — 나머지 가이드는 구글에만 noindex를 건다.
//
// 2026-10-22. 이 사이트는 구글 8월·9월 스팸 업데이트(8/18~21, 9/24~10/7)로 사이트 전체가
// 순위에서 눌려 있다(워크스페이스 CLAUDE.md 8장). 8/22 이후 두 달 동안 19개 사이트 합계
// 노출 67회·클릭 0회. 판정 대상은 51일에 수백 편을 만든 '대량 생성 콘텐츠'의 규모다.
// 그래서 구글이 실제로 노출해 준 적이 있는 글만 남기고, 나머지는 구글 색인에서 뺀다.
//
// - `<meta name="googlebot" content="noindex, follow">`만 붙는다. 네이버(Yeti)·빙은 그대로
//   색인하고, 화면·사이트맵·내부 링크도 그대로다. 실제 유입이 나는 곳은 네이버다.
// - 목록은 서치콘솔 실적(2026-07-16 ~ 10-19, 페이지별)에서 노출이 1회 이상이었던 글이다.
//   통합으로 사라진 주소가 노출을 받았던 경우는 그 내용을 흡수한 글을 넣었다.
// - ⚠️ 새 글을 여기 넣지 말 것. 구글 실적에서 노출이 확인된 글만 넣는다. 늘리는 것은
//   억제가 풀린 뒤(노출이 다시 생긴 뒤)의 판단이다.
export const GOOGLE_INDEXED_GUIDES: ReadonlySet<string> = new Set([]);

/** 가이드 상세의 robots 메타. 루트 layout의 max-image-preview를 함께 유지한다. */
export function guideRobots(slug: string) {
  return GOOGLE_INDEXED_GUIDES.has(slug)
    ? { "max-image-preview": "large" as const }
    : { "max-image-preview": "large" as const, googleBot: { index: false, follow: true } };
}
