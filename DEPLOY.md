# 배포 — 상속노트 (sangsok.lifebanjang.com)

생활반장 노트 시리즈의 배포 방식을 그대로 따른다. **배포는 `git push origin main`만 사용**(Vercel 자동 배포). CLI 직접 배포 금지.

> **순서를 지킬 것.** 퇴사노트 배포 때 배운 것이다. 도메인이 붙기 전에 다른 사이트의
> 크로스링크부터 배포하면 16개 사이트 푸터 = 1,900여 페이지에 죽은 링크가 생긴다.
> 그래서 지금은 링크를 **주석으로 막아 둔 상태**다. 아래 1~3단계로 도메인을 띄운 뒤
> 4단계에서 한 번에 푼다.

## 1. GitHub 저장소 생성 — **사용자가 해야 함**

포터블 `gh`는 인증돼 있지 않고 `gh auth login`은 대화형이라 Claude가 만들 수 없다.
github.com에서 **`sangsok-note`** 저장소를 private·빈 상태로 만들면 된다.

저장소만 생기면 푸시는 이미 준비돼 있다 (`git init` + 커밋 + 원격 등록 완료).

```powershell
$env:Path = "E:\클로드\tools\node;$env:Path"
cd E:\클로드\sangsok-note
git push -u origin main
```

> 새로 `git init`한 저장소는 자격증명 헬퍼가 없어 `git config credential.helper manager`가
> 선설정돼 있어야 한다. 이미 설정해 두었다.

## 2. Vercel 연결 — **사용자가 해야 함**

1. Vercel 대시보드 → Add New Project → `sangsok-note` 저장소 임포트
2. Framework: Next.js (자동 감지, `vercel.json`에 명시됨)
3. 환경변수: `NEXT_PUBLIC_SITE_URL` = `https://sangsok.lifebanjang.com`
   - `NEXT_PUBLIC_ADSENSE_CLIENT`는 설정하지 않아도 된다. 코드에 기본값
     `ca-pub-6029964277117053`이 들어 있다.
4. Deploy

## 3. 도메인 연결 — **사용자가 해야 함**

1. Vercel 프로젝트 → Settings → Domains → `sangsok.lifebanjang.com` 추가
2. 가비아 DNS에 CNAME 추가 — 호스트 `sangsok`, 값 `cname.vercel-dns.com`
3. 전파 후 Vercel에서 유효성 확인 (보통 몇 분)

## 4. 크로스링크 게이팅 해제 — 도메인이 살아난 뒤에

도메인이 실제로 200을 반환하는 것을 확인한 다음에 푼다.

- **허브 `lib/notes.ts`** — sangsok 항목의 `status: "coming"` → `"live"`
  (홈 카드·`/tools`·`/articles/sangsok`·sitemap이 자동으로 포함된다)
- **16개 사이트 `components/FamilyLinks.tsx`** — `⚠️ 임시 제거` 주석 블록을 지우고
  아래 줄의 주석을 푼다

  ```ts
  { slug: "sangsok", name: "상속노트", url: "https://sangsok.lifebanjang.com", desc: "상속세·상속분·상속등기" },
  ```

- 전체 빌드 후 `.next/server/app/**/*.html`에 `sangsok.lifebanjang.com`이 나타나는지
  확인하고, 17개 저장소를 커밋·푸시한다.

## 5. 검색엔진 등록

- **구글**: `sc-domain:lifebanjang.com` 도메인 속성으로 자동 커버된다.
  Search Console → Sitemaps에서 `https://sangsok.lifebanjang.com/sitemap.xml`만 제출.
- **네이버**: 서치어드바이저에 개별 등록해야 한다.
  `app/layout.tsx`의 `metadata`에 **verification이 비어 있다**(다른 노트 코드를 그대로
  두면 소유확인이 실패하므로 지워 두었다).
  1. 서치어드바이저에서 `https://sangsok.lifebanjang.com` 등록
  2. 발급받은 값으로 `app/layout.tsx`에 추가

     ```ts
     verification: { other: { "naver-site-verification": "<발급받은 값>" } },
     ```
  3. 커밋·푸시 후 소유확인 → 사이트맵 제출

## 6. 배포 후 확인

```powershell
$ProgressPreference='SilentlyContinue'
foreach($p in @("/","/calc/tax","/calc/share","/calc/deadline","/calc/registration","/guide","/ads.txt","/sitemap.xml")){
  try{ $r=Invoke-WebRequest "https://sangsok.lifebanjang.com$p" -UseBasicParsing -TimeoutSec 30; "$p => $($r.StatusCode)" }
  catch{ "$p => ERR" }
}
```

- `/ads.txt`가 `google.com, pub-6029964277117053, DIRECT, f08c47fec0942fa0`를 반환하는지
- 홈 원본 HTML `<head>`에 애드센스 script 태그가 있는지
- 사이트맵 URL(정적 7 + 계산기 4 + 가이드 10 = **21개**)이 전부 200인지
- 가이드 본문에 `**` 별표가 남아 있지 않은지 (`<strong>`으로 변환됐는지)

## 7. 허브 반영 (로컬 완료)

- `lifebanjang-hub/lib/notes.ts` — sangsok 항목 추가 (emoji 🕯️, **현재 `status: "coming"`**)
- `lifebanjang-hub/lib/article-intros.ts` — `/articles/sangsok` 해설 추가
- `lifebanjang-hub/scripts/gen-note-guides.mjs` — NOTE_DIRS에 sangsok 추가
- `lifebanjang-hub/lib/note-guides.ts` — 재생성 완료 (343 → **353편**)
- 16개 사이트 `components/FamilyLinks.tsx` — sangsok 줄 추가 후 **주석 처리(게이팅)**
- 워크스페이스 `.claude/launch.json` — `sangsok-note-dev` (포트 4600)
