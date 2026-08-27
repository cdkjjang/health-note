import type { Metadata } from "next";
import CalcGuides from "@/components/CalcGuides";
import RelatedTools from "@/components/RelatedTools";
import Link from "next/link";
import CheckupCalculator from "@/components/CheckupCalculator";
import AdSlot from "@/components/AdSlot";
import CalcNotes from "@/components/CalcNotes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "건강검진 대상 조회 — 올해 나는 무엇을 받나",
  description:
    "출생연도 홀짝으로 갈리는 일반건강검진과, 암 6종의 나이·주기를 한 번에 판정합니다. 위암 40세, 대장암 50세, 자궁경부암 20세 기준.",
  alternates: { canonical: "/calc/checkup" },
};

const faq = [
  {
    q: "왜 출생연도 홀짝으로 나누나요?",
    a: "일반건강검진이 2년에 한 번이기 때문입니다. 전 국민을 매년 다 받게 하면 의료기관이 감당하지 못하므로, 출생연도 끝자리가 짝수인 사람은 짝수 해에, 홀수인 사람은 홀수 해에 받도록 나눴습니다. 2년 주기 암검진도 같은 방식을 씁니다.",
  },
  {
    q: "작년에 안 받았는데 올해 받을 수 있나요?",
    a: "전년도 미수검자를 추가 대상으로 인정하는 경우가 있습니다. 공단 홈페이지의 검진대상자 조회에서 확인하세요. 다만 매년 그런 것은 아니므로 해당 연도에 받는 것이 원칙입니다.",
  },
  {
    q: "직장을 다니면 회사에서 받는 것과 다른가요?",
    a: "같은 국가건강검진입니다. 회사가 지정한 기관에서 단체로 받든 개인이 병원을 골라 받든 동일합니다. 다만 비사무직은 매년 대상이라 사무직과 주기가 다릅니다. 산업안전보건법상 특수건강진단은 이와 별개입니다.",
  },
  {
    q: "돈이 드나요?",
    a: "일반건강검진과 국가암검진은 공단이 부담해 무료입니다. 다만 대장암 1차 검사에서 이상이 나와 받는 대장내시경 등 확진 검사는 본인부담이 있을 수 있습니다. 의료급여 수급자와 건강보험료 하위 50%는 이마저도 지원됩니다.",
  },
  {
    q: "안 받으면 불이익이 있나요?",
    a: "일반 국민에게 과태료는 없습니다. 다만 사업주는 근로자에게 건강진단을 받게 할 의무가 있어, 미실시 시 산업안전보건법에 따라 사업주에게 과태료가 부과될 수 있습니다.",
  },
];

export default function CheckupPage() {
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
          { "@type": "ListItem", position: 2, name: "건강검진 대상 조회" },
        ],
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-2 text-2xl font-extrabold">건강검진 대상 조회</h1>
      <p className="mb-6 text-muted">
        출생연도와 성별을 넣으면 올해 받을 수 있는 일반건강검진과 암검진을 판정합니다.
      </p>

      <CheckupCalculator />

      <AdSlot slot="checkup-below-tool" />

      <section className="mt-10 space-y-4 text-[15px] leading-relaxed">
        <h2 className="text-xl font-bold">출생연도 홀짝이 기준입니다</h2>
        <p>
          일반건강검진은 2년에 한 번입니다. 전 국민이 매년 받으면 의료기관이 감당하지
          못하므로 <strong>출생연도 끝자리가 짝수면 짝수 해에, 홀수면 홀수 해에</strong>{" "}
          받도록 나눴습니다.
        </p>
        <p>
          예외가 하나 있습니다. <strong>비사무직 직장가입자는 매년</strong> 받습니다.
          생산·건설·운전직 등 작업환경상 위험이 큰 직종을 더 자주 보려는 취지입니다.
        </p>
        <p>
          만 20세 이상이면 직장가입자, 지역가입자 세대주와 세대원, 20세 이상
          피부양자가 모두 대상입니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">암검진 6종 — 나이와 주기가 다릅니다</h2>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border-soft text-left">
                <th className="py-2 pr-3 font-bold">암종</th>
                <th className="py-2 pr-3 font-bold">대상</th>
                <th className="py-2 pr-3 font-bold">주기</th>
                <th className="py-2 font-bold">방법</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">위암</td><td className="py-2 pr-3">만 40세 이상</td><td className="py-2 pr-3">2년</td><td className="py-2">위내시경</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">대장암</td><td className="py-2 pr-3">만 50세 이상</td><td className="py-2 pr-3"><strong>1년</strong></td><td className="py-2">분변잠혈검사</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">간암</td><td className="py-2 pr-3">만 40세 이상 고위험군</td><td className="py-2 pr-3"><strong>6개월</strong></td><td className="py-2">초음파 + 혈액</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">유방암</td><td className="py-2 pr-3">만 40세 이상 여성</td><td className="py-2 pr-3">2년</td><td className="py-2">유방촬영술</td></tr>
              <tr className="border-b border-border-soft"><td className="py-2 pr-3">자궁경부암</td><td className="py-2 pr-3"><strong>만 20세 이상</strong> 여성</td><td className="py-2 pr-3">2년</td><td className="py-2">세포검사</td></tr>
              <tr><td className="py-2 pr-3">폐암</td><td className="py-2 pr-3">만 54~74세 고위험군</td><td className="py-2 pr-3">2년</td><td className="py-2">저선량 흉부 CT</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="mt-8 text-xl font-bold">가장 많이 놓치는 것 — 자궁경부암</h2>
        <p>
          자궁경부암 검진은 <strong>만 20세부터</strong>입니다. 6종 중 가장 이릅니다.
          그런데 &ldquo;건강검진은 40대부터&rdquo;라는 인식 때문에 20~30대 여성이
          대상인 줄 모르고 지나가는 경우가 많습니다.
        </p>
        <p>
          자궁경부암은 조기에 발견하면 완치율이 매우 높고, 검사도 몇 분이면 끝납니다.
          해당 연령이라면 확인해 보세요.
        </p>

        <h2 className="mt-8 text-xl font-bold">대장암만 매년입니다</h2>
        <p>
          6종 중 대장암만 <strong>1년 주기</strong>입니다. 1차 검사가 분변잠혈검사라
          부담이 적기 때문입니다. 대변만 채취해 제출하면 되고 병원에 갈 필요도 거의
          없습니다.
        </p>
        <p>
          여기서 이상이 나오면 대장내시경으로 확진합니다. 이 확진 검사는 본인부담이
          있을 수 있습니다.
        </p>

        <h2 className="mt-8 text-xl font-bold">고위험군만 받는 두 가지</h2>
        <p>
          <strong>간암</strong>은 만 40세 이상 중 간경변증이나 B형·C형 간염 바이러스
          보유자 등 고위험군만 대상이고, 6개월마다 받습니다. 6종 중 가장 자주
          받는 검진입니다.
        </p>
        <p>
          <strong>폐암</strong>은 만 54~74세 중 30갑년 이상 흡연력이 있는 사람만
          대상입니다. 30갑년은 하루 1갑씩 30년, 또는 하루 2갑씩 15년입니다. 6종 중
          유일하게 상한 연령(74세)이 있습니다.
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
            law: "국민건강보험법 제52조 (건강검진)",
            detail:
              "공단은 가입자와 피부양자에게 질병의 조기 발견과 그에 따른 요양급여를 하기 위해 건강검진을 실시합니다. 일반건강검진은 2년마다 1회 이상 실시하되, 비사무직 직장가입자는 1년에 1회 실시합니다.",
          },
          {
            law: "암관리법 시행령 별표1 (암검진 대상자 및 검진주기)",
            detail:
              "위암은 만 40세 이상 2년, 대장암은 만 50세 이상 1년, 간암은 만 40세 이상 고위험군 6개월, 유방암은 만 40세 이상 여성 2년, 자궁경부암은 만 20세 이상 여성 2년, 폐암은 만 54세~74세 고위험군 2년 주기입니다.",
          },
          {
            law: "나이 계산 기준",
            detail:
              "국가건강검진의 연령은 만 나이가 아니라 '검진 연도 − 출생연도'로 계산합니다. 그래서 생일과 관계없이 같은 해에 태어난 사람은 같은 대상이 됩니다.",
          },
          {
            law: "비용",
            detail:
              "일반건강검진과 국가암검진 비용은 공단이 부담합니다. 대장내시경 등 확진 검사와 일부 항목은 본인부담이 있을 수 있으며, 의료급여 수급자와 건강보험료 하위 50%는 국가와 지자체가 지원합니다.",
          },
        ]}
        note="전년도 미수검자 추가 대상, 만 20~64세 지역가입자 세대원 등 예외가 있어 실제 대상 여부는 국민건강보험공단의 검진대상자 조회에서 확인해야 합니다. 영유아 건강검진(생후 14일~71개월)과 학생 건강검진, 산업안전보건법상 특수건강진단은 이 계산기가 다루지 않습니다."
        examples={[
          {
            title: "1980년생 여성 · 2026년",
            steps: [
              "나이 = 2026 − 1980 = 46세",
              "출생연도 1980(짝수) = 검진연도 2026(짝수) → 일반건강검진 대상",
              "위암 40세 이상 2년 주기 → 대상",
              "유방암 40세 이상 여성 2년 주기 → 대상",
              "자궁경부암 20세 이상 여성 2년 주기 → 대상",
            ],
            result: "일반검진 + 암검진 3종",
          },
          {
            title: "1981년생 · 2026년 — 홀짝이 어긋납니다",
            steps: [
              "출생연도 1981(홀수) ≠ 검진연도 2026(짝수)",
              "일반건강검진과 2년 주기 암검진 모두 대상 아님",
            ],
            result: "2027년에 받습니다 (비사무직이면 매년)",
          },
          {
            title: "1970년생 남성 · 30갑년 흡연 · 2026년",
            steps: [
              "나이 = 56세",
              "위암 대상, 대장암 50세 이상 매년 대상",
              "폐암 54~74세 고위험군 → 대상",
            ],
            result: "일반검진 + 위암 + 대장암 + 폐암",
          },
        ]}
        pitfalls={[
          {
            heading: "만 나이가 아닙니다",
            body:
              "국가건강검진은 '검진 연도 − 출생연도'로 나이를 셉니다. 생일이 지나지 않았어도 같은 해에 태어난 사람은 같은 대상입니다. 만 나이로 계산하면 한 해 어긋납니다.",
          },
          {
            heading: "자궁경부암은 20세부터입니다",
            body:
              "6종 중 가장 이른 나이에 시작하는데, '건강검진은 중년부터'라는 인식 때문에 20~30대 여성이 가장 많이 놓칩니다. 해당 연령이라면 대상조회를 해 보세요.",
          },
          {
            heading: "검진 결과가 다음 대상에 영향을 주지 않습니다",
            body:
              "이상이 나왔다고 다음 해에 자동으로 다시 받게 되지는 않습니다. 주기는 그대로입니다. 추적 관찰이 필요하면 별도의 진료로 진행됩니다.",
          },
          {
            heading: "연말에 몰리면 예약이 어렵습니다",
            body:
              "대상 연도의 12월 31일까지 받아야 하는데 11~12월에 수요가 몰립니다. 상반기에 받는 편이 여유롭고, 위내시경 같은 항목은 특히 예약이 밀립니다.",
          },
        ]}
        sources={[
          { label: "국민건강보험공단 검진대상 조회", href: "https://www.nhis.or.kr" },
          { label: "국립암센터 국가암검진", href: "https://www.ncc.re.kr" },
          { label: "국가법령정보센터", href: "https://www.law.go.kr" },
          { label: "병원비 본인부담률 계산기", href: "/calc/rate" },
        ]}
      />

      <section className="mt-10 rounded-2xl border border-border-soft bg-card p-5">
        <h2 className="mb-3 font-bold">함께 확인하세요</h2>
        <ul className="space-y-2 text-[15px]">
          <li><Link href="/calc/rate" className="text-accent underline-offset-4 hover:underline">병원비 본인부담률 계산기 →</Link></li>
          <li><Link href="/calc/cap" className="text-accent underline-offset-4 hover:underline">본인부담상한제 환급 계산기 →</Link></li>
          <li><Link href="/guide/checkup-guide" className="text-accent underline-offset-4 hover:underline">건강검진 항목 읽는 법 →</Link></li>
        </ul>
      </section>
      <CalcGuides calcHref="/calc/checkup" />
      <RelatedTools calc="/calc/checkup" />
    </div>
  );
}
