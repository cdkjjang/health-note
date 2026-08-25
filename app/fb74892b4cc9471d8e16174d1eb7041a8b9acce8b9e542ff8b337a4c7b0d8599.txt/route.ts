// IndexNow 키 파일.
//
// 구글은 IndexNow를 지원하지 않지만 빙·네이버·얀덱스가 지원한다. 2026-08-25
// 확인 시점에 이 세 곳의 색인이 사실상 0이었다(빙 0건, 다음 0건, 네이버는
// 허브 홈 1개). 사이트맵만으로는 가져가지 않아 직접 알리는 경로를 둔다.
//
// 프로토콜은 이 키를 사이트 루트에 평문으로 두고, 제출할 때 keyLocation으로
// 이 주소를 함께 넘기는 방식이다. 계정도 인증도 필요 없다.
//
// ⚠️ 파일 이름(키)과 내용이 정확히 같아야 한다. 다르면 제출이 거부된다.
// ⚠️ 키를 바꾸면 19개 사이트를 전부 함께 바꾸고 scripts/indexnow.mjs도 고칠 것.
export const dynamic = "force-static";

export function GET() {
  return new Response("fb74892b4cc9471d8e16174d1eb7041a8b9acce8b9e542ff8b337a4c7b0d8599", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}