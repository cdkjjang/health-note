import Link from "next/link";
import { guides } from "@/lib/guides";

/**
 * 이 계산기를 안내하는 가이드를 계산기 쪽에서도 보여 준다.
 *
 * 가이드에는 이미 `cta.href`로 "이 글을 읽었으면 이 계산기"라는 큐레이션이
 * 들어 있는데, 그 링크가 가이드 → 계산기 한 방향뿐이었다. 그래서 계산기
 * 페이지에서 본문 글로 들어가는 길이 없었고, 검색으로 계산기에 바로 들어온
 * 사람은 읽을 것을 만나지 못한 채 나갔다.
 *
 * 슬러그를 따로 적지 않고 기존 cta를 뒤집어 쓴다. 가이드를 추가하면 자동으로
 * 해당 계산기에 붙으므로 두 곳을 맞출 일이 없다.
 */
export default function CalcGuides({
  calcHref,
  heading = "이 계산기와 함께 읽을 글",
  limit = 5,
}: {
  calcHref: string;
  heading?: string;
  limit?: number;
}) {
  const list = guides.filter((g) => g.cta?.href === calcHref).slice(0, limit);
  if (list.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
      <h2 className="mb-3 font-bold">{heading}</h2>
      <ul className="space-y-3">
        {list.map((g) => (
          <li key={g.slug}>
            {/* 제목만 링크로 둔다 — 설명까지 앵커에 넣으면 본문 대부분이 링크가 된다. */}
            <p className="font-bold leading-snug">
              <Link
                href={`/guide/${g.slug}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {g.title}
              </Link>
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{g.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/guide" className="text-accent underline-offset-4 hover:underline">
          가이드 전체 보기 →
        </Link>
      </p>
    </section>
  );
}