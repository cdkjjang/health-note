import { RELATED_TOOLS } from "@/lib/related-tools";

/**
 * 계산이 끝난 사람에게 **다른 노트의** 계산기를 안내한다.
 *
 * ⚠️ 2026-08-25에 형제 노트 링크를 전부 걷어낸 적이 있다. 그때 문제는 링크의
 *    존재가 아니라 방식이었다 — 모든 페이지 하단에 18개 노트를 통째로 나열해
 *    719개 페이지 × 18 = 약 12,942개의 도메인 간 링크가 **본문 맥락과 무관하게
 *    똑같이** 반복됐고, 외부 유입 링크는 0개였다. 링크망으로 읽히는 구조였다.
 *
 *    이 컴포넌트는 다르다. 계산기마다 **다른 2~3개**를, "이 계산이 끝나면
 *    실제로 다음에 걸리는 것"만 골라 붙인다. 페이지마다 내용이 달라 반복
 *    블록이 되지 않는다.
 *
 * 규칙:
 *   - 한 페이지에 **최대 3개**. 늘리지 말 것.
 *   - 같은 노트 안의 계산기는 넣지 않는다(그건 각 페이지가 이미 안내한다).
 *   - "관련 계산기"가 아니라 **그 사람이 다음에 마주칠 질문**으로 적는다.
 *     제목만 링크로 두고 설명은 본문으로 남긴다 — 앵커 텍스트 비율 때문이다.
 */
export default function RelatedTools({ calc }: { calc: string }) {
  const list = (RELATED_TOOLS[calc] ?? []).slice(0, 3);
  if (list.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-border-soft bg-card p-5">
      <h2 className="mb-1 font-bold">이 계산이 끝나면 대개 이것이 걸립니다</h2>
      <p className="mb-4 text-sm text-muted">
        생활반장의 다른 노트에 있는 계산기입니다. 전부 무료이고 회원가입이
        없습니다.
      </p>
      <ul className="space-y-4">
        {list.map((t) => (
          <li key={t.href}>
            <p className="font-bold leading-snug">
              <a
                href={t.href}
                className="text-accent underline-offset-4 hover:underline"
              >
                {t.question}
              </a>
            </p>
            <p className="mt-1 text-sm text-muted">
              {t.note} · {t.tool}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
