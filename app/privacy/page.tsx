import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE_NAME}의 개인정보처리방침입니다.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 text-[15px] leading-relaxed">
      <h1 className="text-2xl font-extrabold">개인정보처리방침</h1>
      <p className="text-sm text-muted">시행일: 2026-07-23</p>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">1. 수집하는 개인정보</h2>
        <p>
          {SITE_NAME}는 회원가입 없이 이용하는 서비스로, 이름·연락처 등 개인정보를
          직접 수집하지 않습니다. 계산기에 입력한 나이·소득·금액 등은 이용자의
          브라우저 안에서만 처리되며 서버로 전송·저장되지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">2. 쿠키 및 광고</h2>
        <p>
          본 사이트는 Google 애드센스 광고를 게재할 수 있습니다. Google을 포함한
          제3자 광고 사업자는 쿠키를 사용하여 이용자의 이전 방문 기록에 기반한
          광고를 제공할 수 있습니다. Google의 광고 쿠키 사용으로 Google과 파트너는
          본 사이트 및 다른 사이트 방문 기록을 바탕으로 맞춤 광고를 게재할 수
          있습니다.
        </p>
        <p>
          이용자는{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="text-accent underline-offset-4 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google 광고 설정
          </a>
          에서 맞춤 광고를 비활성화할 수 있으며, 브라우저 설정에서 쿠키를 차단할
          수 있습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">3. 통계 도구</h2>
        <p>
          서비스 개선을 위해 방문 통계 도구(예: Google Analytics, Vercel
          Analytics)를 사용할 수 있습니다. 이 도구는 익명화된 방문 정보를 수집하며
          특정 개인을 식별하지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">4. 문의</h2>
        <p>
          개인정보 관련 문의는{" "}
          <a href="mailto:cdkjjang@gmail.com" className="text-accent underline-offset-4 hover:underline">
            cdkjjang@gmail.com
          </a>
          으로 연락해 주세요.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">5. 방침의 변경</h2>
        <p>
          본 방침이 변경되는 경우 이 페이지에 갱신하여 게시하며, 시행일을 함께
          표기합니다.
        </p>
      </section>
    </div>
  );
}
