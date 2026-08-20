// 애드센스 ads.txt — NEXT_PUBLIC_ADSENSE_CLIENT(ca-pub-...)가 설정되면 자동으로 활성화된다.
// 서브도메인은 루트 도메인(lifebanjang.com)의 ads.txt를 따르지만, 방어적으로 각 사이트에도 배치한다.
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-6029964277117053";
  if (!client) {
    return new Response("", { status: 404 });
  }
  // ca-pub-XXXX -> pub-XXXX
  const publisherId = client.replace(/^ca-/, "");
  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}
