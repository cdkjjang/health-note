// 생활반장 노트 시리즈 크로스링크 — 전 사이트 공통 정본.
//
// ⚠️ 2026-08-25에 구조를 바꿨다. 예전에는 모든 페이지가 형제 노트 18개를
//    전부 링크했다. 719개 페이지 × 18 = 약 12,942개의 도메인 간 상호 링크였고,
//    같은 날 GSC 링크 보고서에서 확인한 **외부 링크는 0개**였다.
//
//    바깥에서 들어오는 링크가 하나도 없는데 19개 도메인이 자기들끼리만
//    12,942개를 주고받는 모양은, 구글이 링크 네트워크로 읽기에 좋은 형태다.
//    실제로 이 시점에 8개 노트가 색인에서 통째로 빠져 있었다.
//
//    그래서 노트에서는 허브 한 곳만 가리킨다. 발견 경로는 그대로다 —
//    허브가 노트 전체를 링크하고(lifebanjang.com/tools·/articles),
//    각 노트는 허브로 돌아간다. 그래프는 연결돼 있고 링크 수만 줄었다.
//
//    되돌리려면 이 파일을 예전처럼 SITES 배열을 순회하도록 되돌리면 된다.
//    다만 되돌리기 전에 링크 보고서의 외부 링크 수를 먼저 확인할 것.
const HUB_URL = "https://lifebanjang.com";

export default function FamilyLinks() {
  return (
    <nav aria-label="생활반장 노트 시리즈" className="mb-5">
      <p className="mb-2 font-semibold text-foreground">생활반장 노트 시리즈</p>
      <p className="leading-relaxed">
        축의금·월세 정산·자동차세처럼 검색해도 답이 제각각인 생활 문제를 주제별
        노트로 나눠 정리합니다. 전부 무료이고 회원가입이 없습니다.{" "}
        <a href={HUB_URL} className="font-semibold hover:text-accent">
          노트 전체 보기 →
        </a>
      </p>
    </nav>
  );
}
