// 계산기 결과 아래 상품 링크 블록 — 상품은 lib/coupang.ts.
// ⚠️ 수수료 고지 문구는 공정위 추천·보증 심사지침상 필수다. 지우지 말 것.
// ⚠️ 쿠팡 배너(AdSlot)와 붙여 두지 말 것 — 페이지에서는 NextStep 아래에 둔다.
import { picksFor } from "@/lib/coupang";

export default function ContextualOffers({ calc }: { calc: string }) {
  const picks = picksFor(calc);
  if (picks.length === 0) return null;
  return (
    <section aria-label="쿠팡 파트너스 광고" className="mt-10 border-t border-border-soft pt-4">
      <p className="text-xs text-muted">
        광고 · 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
      <p className="mt-2 font-bold">이 계산과 함께 챙기면 좋은 것</p>
      <ul className="mt-2 divide-y divide-border-soft">
        {picks.map((p) => (
          <li key={p.href}>
            <a
              href={p.href}
              target="_blank"
              rel="sponsored noopener"
              className="flex min-h-11 items-center justify-between gap-3 py-3"
            >
              <span>
                <span className="font-semibold">{p.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{p.why}</span>
              </span>
              <span className="shrink-0 rounded-lg border border-border-soft px-3 py-1.5 text-sm">
                쿠팡에서 보기
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
