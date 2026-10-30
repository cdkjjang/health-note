// 애드센스 광고 슬롯 자리.
// NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)가 설정되기 전에는 아무것도 렌더링하지 않는다.
// 승인 후 할 일:
//   1. .env.local 등에 NEXT_PUBLIC_ADSENSE_CLIENT 설정
//   2. app/layout.tsx에 애드센스 로더 <script>가 자동 삽입됨 (환경변수 기준)
//   3. 각 배치 지점의 slot 번호를 애드센스 콘솔에서 발급받아 전달

"use client";

import CoupangBanner from "./CoupangBanner";
import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6029964277117053";
// 2026-10-30 방향 전환: 애드센스 승인 대신 검색 유입 + 쿠팡 파트너스로 수익을 낸다.
// 미승인 상태의 애드센스 슬롯은 광고 없이 336px 빈칸만 남겨 본문을 밀어내므로 슬롯만 끈다.
// 로더 스크립트(layout)와 ads.txt는 그대로 둔다 — 다시 신청할 때 이 값만 true로.
const ADSENSE_SLOTS_ON = false;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

function AdSenseSlot({ slot }: { slot: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT || !ADSENSE_SLOTS_ON) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등으로 실패해도 페이지 동작에는 영향 없음
    }
  }, []);

  if (!ADSENSE_CLIENT || !ADSENSE_SLOTS_ON) return null;

  return (
    // 높이를 미리 잡아 둔다. 광고 스크립트가 실행되며 0 -> 실제 크기로 늘어나면
    // 아래 콘텐츠가 통째로 밀리는데(측정값: 모바일 375px), 그 순간 누르려던 것을
    // 잘못 눌러 무효 클릭이 될 수 있다. 애드센스가 실제로 제재하는 항목이다.
    // 모바일은 슬롯이 뷰포트 폭에 가깝게(375px에서 375px) 잡혀 336px을 예약하고,
    // 데스크톱은 300x250·336x280을 덮는 280px로 둔다.
    // ⚠️ 지금은 광고가 채워지지 않은 상태의 크기로 맞춘 값이다.
    //    승인 후 실제 게재 크기를 다시 재서 조정할 것.
    //
    // <aside>를 쓰는 이유: 역할 없는 <div>에 aria-label을 달면 접근성 검사에서
    // '금지된 ARIA 속성'으로 걸린다. <aside>는 role=complementary라 이름을 받는다.
    <aside className="my-6 min-h-[336px] sm:min-h-[280px]" aria-label="광고">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

// 광고 자리 하나 = 쿠팡 파트너스 배너 + 애드센스 슬롯.
// 한 페이지에 광고 자리가 둘 이상이면 하나만 coupang을 켜 둘 것(배너는 페이지당 1개).
export default function AdSlot({ slot, coupang = true }: { slot: string; coupang?: boolean }) {
  return (
    <>
      {coupang && <CoupangBanner />}
      <AdSenseSlot slot={slot} />
    </>
  );
}