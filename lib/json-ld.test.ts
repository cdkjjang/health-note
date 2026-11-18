import { describe, expect, it } from "vitest";
import { jsonLdScript } from "./json-ld";

describe("jsonLdScript", () => {
  it("</script>를 끊지 않게 이스케이프하고, 파싱하면 원래 값이 나온다", () => {
    const data = { name: "a </script><b>&" };
    const out = jsonLdScript(data);
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).not.toContain("&");
    expect(JSON.parse(out)).toEqual(data);
  });
});
