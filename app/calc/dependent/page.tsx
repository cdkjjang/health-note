import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import Link from "next/link";
import DependentCalculator from "@/components/DependentCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "건강보험 피부양자 자격 판정 — 보험료 0원의 조건",
  description:
    "소득 2,000만원, 사업자등록 시 사업소득 1원, 재산세 과세표준 5.4억·9억. 세 가지 요건을 하나씩 확인해 피부양자 자격을 판정합니다.",
  alternates: { canonical: "/calc/dependent" },
};

const faq = [
  {
    q: "피부양자가 되면 정말 보험료를 한 푼도 안 내나요?",
    a: "네, 0원입니다. 그리고 부양하는 직장가입자의 보험료도 늘지 않습니다. 직장가입자 보험료는 보수월액으로만 산정하기 때문에 피부양자가 몇 명이든 같습니다. 자격이 된다면 가장 유리한 선택지입니다.",
  },
  {
    q: "퇴직하고 프리랜서로 일하는데 자격이 유지되나요?",
    a: "사업자등록 여부가 갈림길입니다. 사업자등록을 냈다면 사업소득이 1원만 있어도 탈락합니다. 사업자등록 없이 3.3% 원천징수로 받는 경우에는 사업소득 500만원까지 인정됩니다. 퇴직 후 사업자등록을 내는 순간 피부양자에서 빠지는 경우가 많습니다.",
  },
  {
    q: "실업급여를 받으면 자격을 잃나요?",
    a: "잃지 않습니다. 실업급여는 피부양자 소득 판단에서 소득으로 보지 않습니다. 퇴직 후 실업급여를 받으면서 가족의 피부양자로 등재하는 것이 가능합니다.",
  },
  {
    q: "연금을 받는데 얼마까지 괜찮나요?",
    a: "공적연금(국민연금·공무원연금 등)은 전액이 소득에 포함됩니다. 다른 소득이 없다면 연 2,000만원, 즉 월 약 166만원까지입니다. 반면 연금저축·IRP 같은 사적연금은 소득에 포함되지 않습니다. 이 차이 때문에 노후 소득을 사적연금 쪽에 두는 것이 유리한 경우가 있습니다.",
  },
  {
    q: "재산이 많으면 소득이 적어도 안 되나요?",
    a: "재산세 과세표준이 9억원을 넘으면 소득과 무관하게 탈락합니다. 5억 4천만원에서 9억원 사이라면 소득이 1,000만원 이하여야 합니다. 재산이 있으면 소득 문턱이 절반으로 내려가는 구조입니다.",
  },
];

export default function DependentPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "피부양자 자격 판정" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">피부양자 자격 판정</h1>
      <p className="mb-6 text-muted">
        보험료가 0원이 되는 자격입니다. 부양·소득·재산 세 가지 요건을 하나씩 확인합니다.
      </p>

      <DependentCalculator />

      <AdSlot slot="dependent-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">보험료 0원, 그런데 요건이 계속 좁아졌습니다</h2>
        <p>
          직장가입자의 가족으로 등재되면 건강보험료를 내지 않습니다. 부양하는 쪽의
          보험료도 늘지 않습니다. 직장가입자 보험료는 보수월액으로만 산정하기 때문에{" "}
          <strong>피부양자가 몇 명이든 같습니다.</strong> 그래서 자격이 되는지가
          퇴직·실직 후 가장 먼저 확인할 일입니다.
        </p>
        <p>
          다만 요건은 계속 강화돼 왔습니다. 특히 2022년 개편에서 소득 기준이 연
          3,400만원에서 <strong>2,000만원</strong>으로 내려가면서 탈락자가 크게
          늘었습니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">세 가지를 모두 통과해야 합니다</h2>
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            <strong>부양요건</strong> — 배우자, 직계존비속, 배우자의 직계존속,
            형제자매만 대상입니다. 형제자매는 30세 미만이거나 65세 이상, 또는
            장애인이어야 하고 재산도 1억 8천만원 이하여야 합니다.
          </li>
          <li>
            <strong>소득요건</strong> — 연간 합산소득 2,000만원 이하. 이자·배당·사업·
            근로·연금·기타소득을 모두 더합니다.
          </li>
          <li>
            <strong>재산요건</strong> — 재산세 과세표준 5억 4천만원 이하면 통과,
            9억원 초과면 탈락, 그 사이는 소득이 1,000만원 이하여야 합니다.
          </li>
        </ol>

        <h2 className="mt-8 text-xl font-bold">가장 많이 걸리는 두 가지</h2>
        <p>
          <strong>① 사업자등록.</strong> 사업자등록이 있으면 사업소득이 1원만
          있어도 탈락합니다. 소득 2,000만원 기준과는 별개로 작동합니다. 퇴직 후
          프리랜서 일을 시작하면서 사업자등록을 내는 순간 자격을 잃는 경우가 많습니다.
        </p>
        <p>
          반대로 사업자등록 없이 3.3% 원천징수로 받는 경우에는 사업소득 500만원까지
          인정됩니다. 같은 일을 해도 등록 여부로 결과가 갈립니다.
        </p>
        <p>
          <strong>② 소득 2,000만원은 &lsquo;초과하면 즉시&rsquo;.</strong> 구간별
          감액이 아니라 통과/탈락입니다. 2,000만 1원이어도 자격을 잃습니다. 연말에
          금융소득이나 임대소득이 조금 늘어 넘어가는 경우가 실제로 생깁니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          자격을 잃으면 지역가입자가 됩니다
        </h2>
        <p>
          피부양자에서 빠지면 지역가입자로 전환되어 보험료가 발생합니다. 소득뿐
          아니라 재산까지 반영되므로 부담이 작지 않습니다.
        </p>
        <p>
          퇴직 직후라면 <strong>임의계속가입</strong>이라는 선택지도 있습니다. 퇴직
          전 18개월 중 직장가입 기간이 통산 12개월 이상이면 최대 36개월간 재직 중
          보험료를 유지할 수 있습니다. 신청 기한이 짧으니 함께 확인해 보세요.
        </p>

        <h2 className="mt-8 text-xl font-bold">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {faq.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border-soft bg-card p-4 shadow-sm">
              <dt className="font-bold"><span className="text-accent">Q.</span> {q}</dt>
              <dd className="mt-2 text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CalcNotes
        updated="2026-08-20"
        basis={[
          {
            law: "국민건강보험법 제5조 (적용 대상 등)",
            detail:
              "직장가입자에게 주로 생계를 의존하는 배우자, 직계존속(배우자의 직계존속 포함), 직계비속(배우자의 직계비속 포함)과 그 배우자, 형제·자매 중 보수 또는 소득이 없는 사람을 피부양자로 합니다.",
          },
          {
            law: "같은 법 시행규칙 별표1 (피부양자 자격의 인정기준)",
            detail:
              "연간 합산소득이 2,000만원 이하여야 합니다. 사업자등록이 있는 경우 사업소득이 없어야 하고, 사업자등록이 없으면 사업소득이 연 500만원 이하여야 합니다.",
          },
          {
            law: "재산 요건",
            detail:
              "재산세 과세표준이 5억 4천만원 이하면 소득요건만 충족하면 됩니다. 5억 4천만원 초과 9억원 이하는 연간 합산소득이 1,000만원 이하여야 하고, 9억원을 초과하면 자격이 인정되지 않습니다.",
          },
          {
            law: "형제·자매의 특례",
            detail:
              "형제·자매는 30세 미만이거나 65세 이상, 또는 장애인·국가유공상이자여야 하며, 재산세 과세표준이 1억 8천만원 이하여야 합니다.",
          },
        ]}
        note="부양요건은 동거 여부와 다른 부양자의 존재를 개별로 확인하므로, 이 계산기에서 통과가 나와도 결과가 다를 수 있습니다. 실업급여는 소득으로 보지 않습니다. 최종 판단은 국민건강보험공단이 합니다."
        examples={[
          {
            title: "68세 부모 · 연금소득 1,200만원 · 재산 과표 2억",
            steps: [
              "부양요건 — 직계존속으로 충족",
              "소득 1,200만원 ≤ 2,000만원 → 통과",
              "재산 2억 ≤ 5.4억 → 통과",
            ],
            result: "피부양자 자격 있음 · 보험료 0원",
          },
          {
            title: "퇴직 후 프리랜서 · 사업자등록 있음 · 사업소득 300만원",
            steps: [
              "소득 300만원 ≤ 2,000만원 → 소득요건은 통과",
              "그러나 사업자등록이 있으면 사업소득 1원에도 탈락",
            ],
            result: "탈락 — 사업자등록이 결정적입니다",
          },
          {
            title: "재산 과표 7억 · 연금소득 1,500만원",
            steps: [
              "재산이 5.4억을 넘어 소득 한도가 1,000만원으로 내려감",
              "소득 1,500만원 > 1,000만원",
            ],
            result: "탈락 — 재산이 있으면 소득 문턱이 절반이 됩니다",
          },
        ]}
        pitfalls={[
          {
            heading: "재산세 과세표준은 시가가 아닙니다",
            body:
              "공시가격에 공정시장가액비율을 곱한 금액입니다. 시가 10억 아파트라도 과세표준은 그보다 훨씬 낮습니다. 재산세 고지서나 위택스에서 확인하세요.",
          },
          {
            heading: "사적연금은 소득에 들어가지 않습니다",
            body:
              "공적연금(국민연금·공무원연금 등)은 전액 소득으로 잡히지만, 연금저축·IRP에서 받는 사적연금은 피부양자 소득 판단에 포함되지 않습니다. 노후 소득 구성에서 의미 있는 차이입니다.",
          },
          {
            heading: "자격 상실은 소급 적용될 수 있습니다",
            body:
              "공단이 소득 자료를 확인하는 시점과 실제 소득 발생 시점이 다릅니다. 나중에 자격 상실이 확인되면 그 기간의 지역가입자 보험료를 소급해 부과합니다. 소득이 늘었다면 미리 신고하는 편이 안전합니다.",
          },
          {
            heading: "형제자매는 문턱이 훨씬 높습니다",
            body:
              "나이(30세 미만 또는 65세 이상)와 재산(1억 8천만원 이하) 요건이 추가로 붙고, 미혼이면서 실제로 부양받고 있어야 합니다. 부모·자녀와 같은 기준으로 생각하면 어긋납니다.",
          },
        ]}
        sources={[
          { label: "국민건강보험공단", href: "https://www.nhis.or.kr" },
          { label: "건강보험공단 고객센터 1577-1000", href: "https://www.nhis.or.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
          { label: "본인부담상한제 계산기", href: "/calc/cap" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/cap" className="text-accent underline-offset-4 hover:underline">본인부담상한제 환급 계산기 →</Link></li>
          <li><Link href="/calc/checkup" className="text-accent underline-offset-4 hover:underline">건강검진 대상 조회 →</Link></li>
          <li><Link href="/guide/dependent-lost" className="text-accent underline-offset-4 hover:underline">피부양자 자격을 잃었을 때 →</Link></li>
          {/* 자격이 안 되면 지역가입자 아니면 임의계속가입이다. 임의계속 보험료
              계산은 퇴사노트 몫이라 여기서 다시 계산하지 않고 링크로 보낸다. */}
          <li>
            <a href="https://toesa.lifebanjang.com/calc/health" className="text-accent underline-offset-4 hover:underline">퇴사 후 건강보험료 계산기 (퇴사노트) →</a>
            <span className="block text-sm text-muted">피부양자 자격이 안 된다면 임의계속가입을 검토합니다. 신청 기한이 있어 늦으면 못 씁니다.</span>
          </li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/dependent" />
    </div>
  );
}
