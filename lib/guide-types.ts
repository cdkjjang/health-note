// 표 — 금액 구간·기한·두 제도 비교처럼 눈으로 대조하는 정보는 문단 대신 표로 쓴다(2026-11-15, 콘텐츠 작성 3원칙).
// 칸에도 **강조**를 쓸 수 있다(템플릿의 bold()를 탄다). note는 표 아래 한 줄 해설·근거.
export interface GuideTable {
  head: string[];
  rows: string[][];
  note?: string;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  table?: GuideTable;
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  updated: string; // YYYY-MM-DD
  intro: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  related: string[]; // 관련 가이드 slug
  cta?: { href: string; label: string }; // 글 하단 계산기 연결 버튼
  // 본문을 대조한 근거. law.go.kr 조문은 iframe 본문까지 열어 확인한 것만 넣는다.
  sources?: { label: string; href: string; note?: string }[];
}

/**
 * 섹션에서 화면에 나가는 글자 전부 — 읽는 시간(템플릿)과 본문 하한(guides.test.ts)이 같은 기준으로 센다.
 * 표는 머리·칸·해설까지 모두 본문으로 센다. 표로 옮겼다고 글이 얇아진 것으로 잡히면 안 되기 때문이다.
 */
export function sectionTexts(s: GuideSection): string[] {
  return [
    s.heading,
    ...s.paragraphs,
    ...(s.table ? [...s.table.head, ...s.table.rows.flat(), s.table.note ?? ""] : []),
    ...(s.list ?? []),
  ];
}
