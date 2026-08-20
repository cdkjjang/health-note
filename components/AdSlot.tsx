// 애드센스 광고 슬롯 자리.
// NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)가 설정되기 전에는 아무것도 렌더링하지 않는다.
// 승인 후 할 일:
//   1. .env.local 등에 NEXT_PUBLIC_ADSENSE_CLIENT 설정
//   2. app/layout.tsx에 애드센스 로더 <script>가 자동 삽입됨 (환경변수 기준)
//   3. 각 배치 지점의 slot 번호를 애드센스 콘솔에서 발급받아 전달

"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6029964277117053";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ slot }: { slot: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 광고 차단기 등으로 실패해도 페이지 동작에는 영향 없음
    }
  }, []);

  if (!ADSENSE_CLIENT) return null;

  return (
    <div className="my-6" aria-label="광고">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
