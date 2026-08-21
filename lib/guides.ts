import type { Guide } from "./guide-types";
import { guides1 } from "./guides-1";
import { guides2 } from "./guides-2";
import { guides3 } from "./guides-3";

export type { Guide, GuideSection } from "./guide-types";

export const guides: Guide[] = [...guides1, ...guides2, ...guides3];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}