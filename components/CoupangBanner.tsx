// 쿠팡 파트너스 다이나믹 배너 (2026-10-30 시험 게재).
// AdSlot이 이 컴포넌트를 함께 렌더링하므로 광고 자리(계산기·가이드 상세·홈)에만 나온다.
// 지금은 19곳이 같은 배너를 쓴다. 효과를 본 뒤 노트별 채널·상품으로 바꿀 것.
//
// 화면 폭으로 배너를 고른다 — 768px(Tailwind md) 이상은 PC용 680×140, 그보다 좁으면 320×100.
// 본문 폭이 max-w-3xl(패딩 빼고 736px)이라 680이 들어간다. 처음 그릴 때 한 번만 고르고
// 창 크기를 바꿔도 다시 고르지 않는다.
//
// 공식 코드는 <script> 두 줄을 그 자리에 박는 방식인데, React는 innerHTML로 넣은
// 스크립트를 실행하지 않고 클라이언트 이동 때 다시 돌지도 않는다. 그래서 g.js를 한 번만
// 불러 두고 PartnersCoupang.G의 container 옵션으로 이 div 안에 iframe을 꽂는다.
//
// ⚠️ 수수료 고지 문구는 공정위 추천·보증 심사지침상 필수다. 지우지 말 것.

"use client";

import { useEffect, useRef } from "react";

const MOBILE_BANNER = {
  id: 1044822,
  template: "carousel",
  trackingCode: "AF6888890",
  width: "320",
  height: "100",
  tsource: "",
};

const PC_BANNER = {
  id: 1044856,
  template: "carousel",
  trackingCode: "AF6888890",
  width: "680",
  height: "140",
  tsource: "",
};

const PC_QUERY = "(min-width: 768px)";

const SCRIPT_SRC = "https://ads-partners.coupang.com/g.js";

declare global {
  interface Window {
    PartnersCoupang?: { G: new (options: Record<string, unknown>) => unknown };
  }
}

let loader: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.PartnersCoupang) return Promise.resolve();
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loader = null;
        reject(new Error("coupang script failed"));
      };
      document.head.appendChild(s);
    });
  }
  return loader;
}

export default function CoupangBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const banner = window.matchMedia(PC_QUERY).matches ? PC_BANNER : MOBILE_BANNER;
    loadScript()
      .then(() => {
        if (cancelled || !window.PartnersCoupang) return;
        el.innerHTML = "";
        new window.PartnersCoupang.G({ ...banner, container: el });
      })
      .catch(() => {
        // 광고 차단기 등으로 실패해도 페이지 동작에는 영향 없음
      });
    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
  }, []);

  return (
    // 머리 문구 + 배너 + 고지 문구를 한 묶음으로 둔다. 폭은 배너에 맞춘다(모바일 320 · PC 680).
    // 모바일은 본문 폭이 328px 안팎이라 테두리·안쪽 여백을 넣으면 320 배너가 넘친다 — 카드 모양은 PC에서만.
    //
    // ⚠️ 머리 문구에 '세일·특가·할인'을 쓰지 말 것. 이 배너는 '고객 관심 기반 추천'이라 특가 상품이
    //    나온다는 보장이 없다. 사실과 다른 문구로 클릭을 끌면 표시광고법상 기만 광고이고 쿠팡 파트너스
    //    약관의 부당 클릭 유도에도 걸린다. 특가 문구를 쓰려면 배너 자체를 골드박스(특가) 타입으로 바꿀 것.
//    '오늘의'는 괜찮다 — 추천 상품이 들어올 때마다 바뀌므로 사실과 맞다(2026-10-30 사용자와 정함).
    <aside
      className="mx-auto my-6 w-full max-w-[320px] md:max-w-[706px] md:rounded-2xl md:border md:border-border-soft md:bg-card md:p-3"
      aria-label="쿠팡 파트너스 광고"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-bold">
          오늘의 <span className="text-accent">쿠팡</span> 추천 상품
        </p>
        <span className="shrink-0 rounded border border-border-soft px-1.5 py-px text-[11px] text-muted">
          광고
        </span>
      </div>
      {/* 배너 높이(모바일 100px · PC 140px)를 미리 잡아 둔다. 늦게 뜨면서 아래 내용을 밀면 잘못 누르기 쉽다. */}
      <div
        ref={ref}
        className="mx-auto min-h-[100px] max-w-[320px] overflow-hidden rounded-lg md:min-h-[140px] md:max-w-[680px]"
      />
      <p className="mt-2 text-[11px] leading-snug text-muted">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </aside>
  );
}
