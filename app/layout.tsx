import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6029964277117053";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 피부양자·병원비·건강검진, 한곳에서`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
        {ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
