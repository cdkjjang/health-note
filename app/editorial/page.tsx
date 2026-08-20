import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

const CONTACT_EMAIL = "cdkjjang@gmail.com";

export const metadata: Metadata = {
  title: "편집 원칙과 근거 자료",
  description: `${SITE_NAME}가 계산기와 가이드를 만드는 방식, 근거로 삼는 법령과 공공기관 자료, 갱신 주기와 오류 정정 절차를 공개합니다.`,
  alternates: { canonical: "/editorial" },
};

export default function EditorialPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">편집 원칙과 근거 자료</h1>
      <p className="text-muted">
        {SITE_NAME}는 돈과 행정에 관한 정보를 다룹니다. 잘못된 숫자 하나가 실제 손해로
        이어질 수 있는 영역이라, 어떤 근거로 어떻게 만들고 언제 고치는지를 공개합니다.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">1. 계산은 코드로, 근거는 법령으로</h2>
        <p>
          {SITE_NAME}의 계산기는 모두 공개된 법령·시행령·고시의 산식을 코드로 옮긴
          것입니다. 어림값이나 업계 관행을 임의로 넣지 않으며, 각 계산 로직에는 근거
          조문을 주석으로 남겨 둡니다.
        </p>
        <p>
          계산 결과가 맞는지 확인하기 위해 각 계산 로직마다 자동 검증 테스트를 두고
          있습니다. 경계값(구간이 바뀌는 지점, 상한·하한, 예외 조건)을 중심으로 검사하며,
          기준을 수정할 때는 테스트도 함께 갱신해야 배포되도록 해 두었습니다.
        </p>
        <p>
          외부 인공지능이 답을 생성하거나, 서버가 사용자의 입력을 받아 계산하는 구조가
          아닙니다. 계산은 전적으로 이용자의 브라우저 안에서 이루어집니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">2. 근거로 삼는 자료</h2>
        <p>
          다루는 주제에 따라 아래 기관이 공표한 법령·고시·안내를 1차 근거로 삼습니다.
          블로그나 커뮤니티의 내용을 근거로 쓰지 않습니다.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://www.law.go.kr"
              rel="noopener nofollow"
              target="_blank"
              className="text-accent underline-offset-4 hover:underline"
            >
              국가법령정보센터
            </a>{" "}
            — 법률·시행령·시행규칙의 원문과 개정 이력
          </li>
          <li>
            <a
              href="https://www.nts.go.kr"
              rel="noopener nofollow"
              target="_blank"
              className="text-accent underline-offset-4 hover:underline"
            >
              국세청
            </a>
            ·
            <a
              href="https://www.wetax.go.kr"
              rel="noopener nofollow"
              target="_blank"
              className="text-accent underline-offset-4 hover:underline"
            >
              위택스
            </a>{" "}
            — 국세·지방세의 세율과 신고 절차
          </li>
          <li>
            <a
              href="https://www.moel.go.kr"
              rel="noopener nofollow"
              target="_blank"
              className="text-accent underline-offset-4 hover:underline"
            >
              고용노동부
            </a>{" "}
            — 최저임금 고시, 근로기준·고용보험 관련 기준
          </li>
          <li>
            <a
              href="https://www.gov.kr"
              rel="noopener nofollow"
              target="_blank"
              className="text-accent underline-offset-4 hover:underline"
            >
              정부24
            </a>
            ·
            <a
              href="https://www.bokjiro.go.kr"
              rel="noopener nofollow"
              target="_blank"
              className="text-accent underline-offset-4 hover:underline"
            >
              복지로
            </a>{" "}
            — 각종 지원제도의 자격 요건과 신청 절차
          </li>
          <li>각 제도를 소관하는 공단·공사의 공식 안내와 연도별 공고문</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">3. 갱신 — 기준이 바뀌면 고칩니다</h2>
        <p>
          실업급여 기준값은 해마다 바뀝니다. 하한액은 최저임금에 연동되어 매년
          1월에 달라지고, 상한액은 고용노동부 고시로 정해집니다. 상한액은 2019년
          66,000원으로 정해진 뒤 7년 동안 그대로였다가 2026년 68,100원으로
          올랐습니다. <strong>이렇게 오래 묶여 있던 값일수록 바뀐 것을 놓치기
          쉽습니다.</strong> 그래서 고시값 자체를 숫자로 고정하는 검증 테스트를
          따로 두어, 값이 낡으면 조용히 통과하지 않고 먼저 실패하게 했습니다.
          건강보험료율과 장기요양보험료율도 매년 초 고시를 확인합니다.
        </p>
        <p>
          기준이 바뀌면 계산 로직, 검증 테스트, 화면에 표시되는 설명, 관련 가이드 글을
          함께 고칩니다. 계산기와 설명 글의 숫자가 서로 달라지는 일을 막기 위해, 화면에
          표시되는 요율은 가능한 한 계산 로직의 값에서 직접 가져오도록 만들고 있습니다.
        </p>
        <p>
          각 가이드 글에는 마지막으로 손본 날짜를 적어 둡니다. 오래된 글을 그대로 두지
          않고, 기준이 바뀐 글은 갱신하거나 변경 사실을 본문에 반영합니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">4. 하지 않는 것</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            개별 사안에 대한 세무·법률·노무·금융 자문을 하지 않습니다. 여기서 얻은 결과는
            참고용 추정치이며, 확정 금액과 자격 판단은 소관 기관이나 해당 분야 전문가의
            몫입니다.
          </li>
          <li>
            특정 금융상품이나 업체를 권유하지 않습니다. 제휴 링크로 수익을 얻는 구조가
            아닙니다.
          </li>
          <li>
            생년월일, 급여, 보증금처럼 이용자가 입력하는 값을 서버로 전송하거나 저장하지
            않습니다. 자세한 내용은 개인정보처리방침에 적어 두었습니다.
          </li>
          <li>
            확인되지 않은 수치를 그럴듯하게 채워 넣지 않습니다. 자료가 불확실한 항목은
            단정하지 않고 확인 방법을 안내합니다.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">5. 오류를 발견하셨다면</h2>
        <p>
          기준이 바뀌었는데 반영되지 않았거나, 계산 결과가 실제와 다르다면 알려주세요.
          어떤 값을 넣었을 때 어떤 결과가 나왔는지, 기대한 값은 얼마인지 함께 적어
          주시면 원인을 빨리 찾을 수 있습니다. 근거가 되는 공식 자료 링크를 주시면 확인
          후 반영합니다.
        </p>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">6. 운영</h2>
        <p>
          {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나로, 개인이 직접
          기획하고 만들어 운영합니다. 운영 비용은 페이지에 게재되는 광고로 충당하며,
          광고 여부가 계산 결과나 글의 내용에 영향을 주지 않습니다.
        </p>
      </section>
    </div>
  );
}
