// 생활반장 노트 시리즈 크로스링크 — 전 사이트 공통 정본. CURRENT만 사이트별로 다르고
// 나머지는 완전히 동일하다. 새 노트가 생기면 이 SITES 배열에 한 줄 추가 후 모든 사이트에 복사.
const CURRENT = "health";

const SITES = [
  { slug: "hub", name: "생활반장 홈", url: "https://lifebanjang.com", desc: "노트 시리즈 전체 보기" },
  { slug: "isa", name: "이사노트", url: "https://isa.lifebanjang.com", desc: "전월세 이사·정산" },
  { slug: "gyeongjosa", name: "경조사노트", url: "https://gyeongjosa.lifebanjang.com", desc: "축의금·부의금·위로 문구" },
  { slug: "car", name: "자동차노트", url: "https://car.lifebanjang.com", desc: "자동차세·검사·과태료" },
  { slug: "saju", name: "사주노트", url: "https://saju.lifebanjang.com", desc: "사주 명식·오행·운세" },
  { slug: "salary", name: "급여노트", url: "https://salary.lifebanjang.com", desc: "실수령액·퇴직금·주휴수당" },
  { slug: "tax", name: "세금노트", url: "https://tax.lifebanjang.com", desc: "연말정산·종합소득세·증여세" },
  { slug: "lotto", name: "로또노트", url: "https://lotto.lifebanjang.com", desc: "당첨번호·통계·번호생성" },
  { slug: "baby", name: "육아노트", url: "https://baby.lifebanjang.com", desc: "육아휴직급여·부모급여·예방접종" },
  { slug: "loan", name: "대출노트", url: "https://loan.lifebanjang.com", desc: "대출이자·중도상환·DSR" },
  { slug: "youth", name: "청년정책노트", url: "https://youth.lifebanjang.com", desc: "청년적금·월세지원·K-패스" },
  { slug: "trip", name: "여행노트", url: "https://trip.lifebanjang.com", desc: "면세한도·기내반입·여권" },
  { slug: "budongsan", name: "부동산노트", url: "https://budongsan.lifebanjang.com", desc: "취득세·양도세·보유세" },
  { slug: "pension", name: "연금노트", url: "https://pension.lifebanjang.com", desc: "국민연금·기초연금·퇴직연금" },
  { slug: "bill", name: "공과금노트", url: "https://bill.lifebanjang.com", desc: "전기요금·도시가스·수도요금" },
  { slug: "toesa", name: "퇴사노트", url: "https://toesa.lifebanjang.com", desc: "실업급여·수급자격·조기재취업수당" },
  { slug: "sangsok", name: "상속노트", url: "https://sangsok.lifebanjang.com", desc: "상속세·상속분·상속등기" },
  { slug: "health", name: "건강보험노트", url: "https://health.lifebanjang.com", desc: "피부양자·병원비 환급·건강검진" },
  { slug: "hakjagum", name: "학자금노트", url: "https://hakjagum.lifebanjang.com", desc: "지원구간·국가장학금·학자금대출" },
];

export default function FamilyLinks() {
  const others = SITES.filter((site) => site.slug !== CURRENT);
  return (
    <nav aria-label="생활반장 노트 시리즈" className="mb-5">
      <p className="mb-2 font-semibold text-foreground">생활반장 노트 시리즈</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {others.map((site) => (
          <li key={site.url}>
            <a href={site.url} className="hover:text-accent">
              <span className="font-semibold">{site.name}</span>
              <span className="ml-1.5 text-xs">— {site.desc}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
