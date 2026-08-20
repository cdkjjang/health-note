import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

const CONTACT_EMAIL = "cdkjjang@gmail.com";

export const metadata: Metadata = {
  title: "문의하기",
  description: `${SITE_NAME} 문의 안내 — 계산 결과 오류 제보, 기준 변경 알림, 제휴·광고 문의를 받습니다.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">문의하기</h1>
      <p className="text-muted">
        {SITE_NAME}는 회원가입·로그인 없이 누구나 쓰는 무료 도구입니다. 별도의 고객센터
        전화는 운영하지 않고 <strong>이메일로만</strong> 문의를 받습니다.
      </p>

      <section className="rounded-xl border border-border-soft bg-card p-5">
        <h2 className="mb-2 text-lg font-bold">이메일</h2>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-2 text-sm text-muted">
          평일 기준 2~3일 안에 답변드립니다. 주말·공휴일에는 회신이 늦어질 수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">이런 내용을 보내주세요</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>계산 결과가 이상한 경우</strong> — 어떤 계산기에 어떤 값을 넣었을 때
            어떤 결과가 나왔는지, 기대한 값은 얼마인지 함께 적어주시면 원인을 훨씬 빨리
            찾을 수 있습니다.
          </li>
          <li>
            <strong>기준·요율이 바뀐 경우</strong> — 법령 개정이나 고시 변경으로 사이트의
            수치가 옛것이 되었다면 알려주세요. 근거가 되는 공식 자료 링크를 함께 주시면
            확인 후 빠르게 반영합니다.
          </li>
          <li>
            <strong>화면 오류·접속 문제</strong> — 사용하신 기기와 브라우저(예: 아이폰
            사파리, 안드로이드 크롬)를 알려주시면 재현에 도움이 됩니다.
          </li>
          <li>
            <strong>제휴·광고·콘텐츠 인용 문의</strong>
          </li>
          <li>
            <strong>개인정보 관련 문의</strong> — 처리 방침은{" "}
            <a href="/privacy" className="text-accent underline-offset-4 hover:underline">
              개인정보처리방침
            </a>
            을 참고해 주세요.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">답변드리기 어려운 문의</h2>
        <p className="text-muted">
          {SITE_NAME}의 계산기와 가이드는 공개된 법령·고시를 정리한 <strong>참고용
          자료</strong>이며 전문가의 자문이 아닙니다. 개별 사안에 대한 세무·법률·금융
          상담이나 특정 상황의 유불리 판단은 드릴 수 없습니다. 이런 경우에는 소관 기관이나
          해당 분야 전문가에게 문의해 주세요.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">운영자</h2>
        <p className="text-muted">
          {SITE_NAME}는 생활반장(lifebanjang.com) 노트 시리즈의 하나로 개인이 운영합니다.
          시리즈 전체 소개는{" "}
          <a
            href="https://lifebanjang.com"
            className="text-accent underline-offset-4 hover:underline"
          >
            생활반장 홈
          </a>
          에서 볼 수 있습니다.
        </p>
      </section>
    </div>
  );
}
