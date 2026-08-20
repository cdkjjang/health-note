// 노트 홈 공통 보강 블록 — 상황별 안내 / 자주 묻는 질문 / 기준 관리 방식.
// 홈은 방문자가 처음 보는 화면인데 도구 카드만 있으면 이 사이트가 무엇을 근거로
// 어떻게 만들어졌는지 알 수 없다. FAQPage 구조화 데이터도 여기서 함께 출력한다.
import Link from "next/link";

export interface HomeScenario {
  /** 방문자가 처한 상황 */
  situation: string;
  /** 그때 무엇을 확인하면 되는지 */
  action: string;
  /** 연결할 계산기 경로 */
  href: string;
  label: string;
}

export interface HomeFaq {
  q: string;
  a: string;
}

export default function HomeNotes({
  scenarios,
  faq,
  maintained,
  updated,
  intro,
  siteName,
}: {
  scenarios: HomeScenario[];
  faq: HomeFaq[];
  /** 매년 확인·갱신하는 기준 항목 */
  maintained: string[];
  updated: string;
  /** 상황 섹션 도입 문장 */
  intro: string;
  siteName: string;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="mt-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section>
        <h2 className="text-xl font-bold">이럴 때 쓰면 됩니다</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{intro}</p>
        <ul className="mt-4 space-y-3">
          {scenarios.map((s) => (
            <li
              key={s.href + s.situation}
              className="rounded-xl border border-border-soft bg-card p-4"
            >
              <p className="font-bold leading-snug">{s.situation}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                {s.action}
              </p>
              <Link
                href={s.href}
                className="mt-2 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                {s.label} →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">자주 묻는 질문</h2>
        <dl className="mt-4 space-y-4">
          {faq.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-xl border border-border-soft bg-card p-4 shadow-sm"
            >
              <dt className="font-bold">
                <span className="text-accent">Q.</span> {q}
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-2xl border border-border-soft bg-card p-5 text-[15px] leading-relaxed">
        <h2 className="text-lg font-bold">기준은 이렇게 관리합니다</h2>
        <p className="mt-2 text-muted">
          {siteName}가 다루는 숫자는 법령과 고시에서 나옵니다. 그리고 이 값들은
          해마다 바뀝니다. 아래 항목은 매년 확인해 계산 로직과 설명을 함께
          갱신하는 대상입니다.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
          {maintained.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <p className="mt-3 text-muted">
          계산 로직에는 경계값 중심의 자동 검증 테스트를 두어, 기준을 고칠 때
          테스트도 함께 통과해야 배포되도록 했습니다. 화면에 표시되는 요율은
          가능한 한 계산 로직의 값에서 직접 가져와 설명과 결과가 어긋나지 않게
          합니다. 마지막 점검: {updated}
        </p>
        <p className="mt-3 text-muted">
          작성 기준과 근거 자료, 오류 정정 절차는{" "}
          <Link
            href="/editorial"
            className="text-accent underline-offset-4 hover:underline"
          >
            편집 원칙
          </Link>
          에 공개해 두었습니다. 기준이 바뀌었는데 반영되지 않았거나 결과가 실제와
          다르다면{" "}
          <Link
            href="/contact"
            className="text-accent underline-offset-4 hover:underline"
          >
            문의하기
          </Link>
          로 알려주세요.
        </p>
      </section>
    </div>
  );
}
