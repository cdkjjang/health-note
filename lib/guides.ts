import type { Guide } from "./guide-types";
import { guides1 } from "./guides-1";
import { guides2 } from "./guides-2";
import { guides3 } from "./guides-3";
import { guides4 } from "./guides-4";

export type { Guide, GuideSection } from "./guide-types";

const rawGuides: Guide[] = [...guides1, ...guides2, ...guides3, ...guides4];

/**
 * related를 양방향으로 채운다.
 *
 * 글을 추가할 때 새 글에서 옛 글로만 링크를 걸다 보니, 옛 글은 새 글의 존재를
 * 모르는 상태가 쌓였다. 2026-08-23 측정에서 전체 관련글 연결의 74%가 한쪽
 * 방향이었고, 그 탓에 가이드 상당수가 목록 페이지에서만 링크되고 있었다.
 * 내부 링크가 얇으면 크롤 우선순위가 밀린다.
 *
 * 데이터 파일 수백 곳을 고치는 대신 집계 지점인 여기서 역방향을 채운다.
 * 원문에 직접 적은 큐레이션이 앞에 오고, 자동으로 채운 것은 뒤에 붙는다.
 * MAX_RELATED로 잘라 링크 텍스트 비율이 과하게 오르지 않게 한다.
 */
const MAX_RELATED = 6;

function withReciprocalRelated(list: Guide[]): Guide[] {
  const known = new Set(list.map((g) => g.slug));
  const declared = new Map(list.map((g) => [g.slug, new Set(g.related)]));
  const added = new Map<string, string[]>();

  for (const g of list) {
    for (const target of g.related) {
      if (!known.has(target)) continue; // 없는 슬러그는 무시
      if (declared.get(target)?.has(g.slug)) continue; // 이미 양방향
      const bucket = added.get(target) ?? [];
      if (!bucket.includes(g.slug)) bucket.push(g.slug);
      added.set(target, bucket);
    }
  }

  return list.map((g) => {
    const extra = added.get(g.slug);
    if (!extra?.length) return g;
    return { ...g, related: [...g.related, ...extra].slice(0, MAX_RELATED) };
  });
}

export const guides: Guide[] = withReciprocalRelated(rawGuides);
export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}