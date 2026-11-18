/**
 * JSON-LD를 <script> 안에 넣을 때 쓰는 직렬화(2026-11-20).
 * JSON.stringify는 "</script>"를 그대로 내보내므로, 글 제목·설명에 그 문자열이 한 번 들어가면
 * 스크립트가 거기서 끊기고 뒤가 HTML로 읽힌다. <·>·& 를 유니코드 이스케이프(u003c 등)로 바꿔 막는다.
 * 검색엔진이 읽는 값은 똑같다(JSON 파서가 이스케이프를 원래 글자로 되돌린다).
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
