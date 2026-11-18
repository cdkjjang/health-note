import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6029964277117053";
// 2026-11-14 로더도 끈다. 슬롯을 꺼 둔 뒤로 광고는 한 개도 안 나오는데, 스크립트만 내려받아 실행하느라
// 휴대폰에서 첫 화면이 0.3~1.1초 멈췄다(허브 홈 1,283ms → 168ms). 애드센스를 다시 신청할 때 AdSlot의
// ADSENSE_SLOTS_ON과 함께 true로. ads.txt는 그대로 둔다.
const ADSENSE_LOADER_ON = false;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `피부양자 자격·본인부담상한제 환급·건강검진 대상 확인 | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // 글마다 대표 이미지(1200×630)를 만들었으므로 검색·디스커버에서 큰 미리보기를 허용한다.
  robots: { "max-image-preview": "large" },
  openGraph: {
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  // 구글은 lifebanjang.com 도메인 속성으로 자동 커버되므로 네이버만 등록한다.
  // 아래 값은 health.lifebanjang.com 전용으로 발급받은 것 — 다른 노트의 코드를
  // 복사해 쓰면 소유확인이 실패한다.
  verification: {
    other: {
      "naver-site-verification": "3ebf2346d6f670f64270bc0fe8d71869af566cc0",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      {/* 애드센스 로더 — 크롤러가 원본 HTML의 <head>에서 script 태그를 찾으므로
          next/script(preload만 출력) 대신 원시 script 태그를 head에 직접 넣는다. */}
      <head>
        {ADSENSE_CLIENT && ADSENSE_LOADER_ON && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:font-bold focus:shadow">
          본문 바로가기
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
