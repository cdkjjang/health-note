// 계산기 페이지 공통 보강 블록 — 근거 조문 / 단계별 계산 예시 / 자주 틀리는 지점 / 확인처.
// 계산 결과만 있고 근거가 없으면 이용자가 숫자를 검증할 방법이 없다.
// 여기서 어떤 기준으로 계산했는지 밝히고, 직접 검산할 수 있게 예시를 단계로 보여준다.

export interface CalcBasis {
  /** 근거 법령·고시 이름 (예: "지방세법 제11조") */
  law: string;
  /** 그 조문이 정하는 내용을 한 문장으로 */
  detail: string;
}

export interface CalcExample {
  /** 사례 요약 (예: "연봉 4,000만원 / 부양가족 1명") */
  title: string;
  /** 계산 단계 — 각 줄이 하나의 계산 과정 */
  steps: string[];
  /** 최종 결과 한 줄 */
  result: string;
}

export interface CalcPitfall {
  heading: string;
  body: string;
}

export interface CalcSource {
  label: string;
  href: string;
}

export default function CalcNotes({
  basis,
  examples,
  pitfalls,
  sources,
  updated,
  note,
}: {
  basis: CalcBasis[];
  examples: CalcExample[];
  pitfalls: CalcPitfall[];
  sources: CalcSource[];
  updated: string;
  /** 이 계산기에만 해당하는 한계·전제 (선택) */
  note?: string;
}) {
  return (
    <div className="mt-10 space-y-10">
      <section>
        <h2 className="border-l-4 border-accent pl-3 text-xl font-bold">
          무엇을 근거로 계산하나
        </h2>
        <dl className="mt-4 space-y-3">
          {basis.map((b) => (
            <div
              key={b.law}
              className="rounded-xl border border-border-soft bg-card p-4"
            >
              <dt className="font-bold">{b.law}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-muted">
                {b.detail}
              </dd>
            </div>
          ))}
        </dl>
        {note && (
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{note}</p>
        )}
      </section>

      <section>
        <h2 className="border-l-4 border-accent pl-3 text-xl font-bold">
          계산 예시 — 직접 따라가 보세요
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          아래는 위 계산기가 실제로 거치는 단계입니다. 같은 값을 넣으면 같은 결과가
          나오는지 확인해 보실 수 있습니다.
        </p>
        <div className="mt-4 space-y-5">
          {examples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl border border-border-soft bg-card p-5"
            >
              <p className="font-bold">{ex.title}</p>
              <ol className="mt-3 space-y-2 text-[15px] leading-relaxed text-muted">
                {ex.steps.map((s, i) => (
                  <li key={s} className="flex gap-2">
                    <span className="shrink-0 font-bold text-accent">
                      {i + 1}.
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 border-t border-border-soft pt-3 font-bold text-accent-strong">
                → {ex.result}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="border-l-4 border-accent pl-3 text-xl font-bold">
          이런 점을 자주 놓칩니다
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed">
          {pitfalls.map((p) => (
            <div key={p.heading}>
              <h3 className="font-bold">{p.heading}</h3>
              <p className="mt-1 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border-soft bg-card p-5 text-sm leading-relaxed text-muted">
        <p className="font-bold text-foreground">확인처와 갱신</p>
        <p className="mt-2">
          이 계산기는 위에 적은 기준을 코드로 옮긴 것이며, 경계값 중심의 자동 검증
          테스트를 두고 운영합니다. 기준이 개정되면 계산 로직과 이 설명을 함께
          갱신합니다. 마지막 갱신: {updated}
        </p>
        <p className="mt-2">
          결과는 참고용 추정치입니다. 확정 금액과 자격 판단은 아래에서 확인하세요.
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {sources.map((s) => {
            // 사이트 내부 경로에는 nofollow·target을 붙이지 않는다.
            const external = s.href.startsWith("http");
            return (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="text-accent underline-offset-4 hover:underline"
                  {...(external
                    ? { rel: "noopener nofollow", target: "_blank" }
                    : {})}
                >
                  {s.label}
                  {external ? " ↗" : " →"}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
