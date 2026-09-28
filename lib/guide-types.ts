export interface GuideSection {
  heading: string;
  paragraphs: string[];
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
