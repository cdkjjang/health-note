import { RELATED_TOOLS } from "@/lib/related-tools";

const HUB_TOOLS_URL = "https://lifebanjang.com/tools";

/**
 * 계산 결과를 막 본 자리에 놓는 **한 줄짜리** 다음 단계 안내.
 *
 * 왜 여기인가: 같은 내용을 담은 RelatedTools는 페이지 맨 아래에 있는데,
 * 계산만 하고 나가는 사람은 거기까지 내려가지 않는다. 답을 얻은 직후가
 * "그럼 이건 어떻게 되지"가 떠오르는 유일한 순간이라 그 자리에 둔다.
 *
 * ⚠️ 광고 슬롯 **바로 위**에 넣는다. 아래에 두면 광고와 붙어 보여
 *    잘못 누르는 일이 생기고, 애드센스가 실제로 제재하는 항목이다.
 *    카드나 테두리 상자로 만들지 말 것 — 광고 단위처럼 보이면 같은 문제다.
 *    왼쪽 선과 작은 글씨로 본문의 일부임이 드러나게 둔다.
 *
 * 링크는 **최대 2개**다. 맥락 하나와 허브 하나. 늘리면 이 자리가
 * 링크 모음이 되어 결과를 가린다. 자세한 목록은 아래 RelatedTools가 맡는다.
 */
export default function NextStep({ calc }: { calc: string }) {
  const first = (RELATED_TOOLS[calc] ?? [])[0];

  return (
    <nav
      aria-label="다음에 볼 것"
      className="mt-5 border-l-2 border-accent/40 pl-3 text-sm leading-relaxed"
    >
      {first && (
        <p>
          <span className="text-muted">이 다음에 자주 걸리는 것 — </span>
          <a
            href={first.href}
            className="font-bold text-accent underline-offset-4 hover:underline"
          >
            {first.question}
          </a>{" "}
          <span className="text-muted">({first.note})</span>
        </p>
      )}
      <p className={first ? "mt-1" : undefined}>
        <a
          href={HUB_TOOLS_URL}
          className="text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          생활반장 계산기 전체 보기 →
        </a>
      </p>
    </nav>
  );
}
