import { TestType } from "./types";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCurrentTime() {
  return new Date().getTime();
}

export const TEST_TYPES: { type: TestType; name: string; slug: string }[] = [
  { type: "GENERAL", name: "General", slug: "general" },
  { type: "NUMBERS", name: "Numbers", slug: "numbers" },
  { type: "SPECIAL_CHARACTERS", name: "Special Characters", slug: "special-characters" },
];

export function formatTestType(type: TestType | string) {
  return TEST_TYPES.find((t) => t.type === type)?.name ?? capitalize(type.toLowerCase().replace(/_/g, " "));
}

export function testTypeFromSlug(slug: string | undefined): TestType {
  return TEST_TYPES.find((t) => t.slug === slug)?.type ?? "GENERAL";
}

export function formatNumber(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return minutes > 0 ? `${minutes}:${rest.toFixed(1).padStart(4, "0")}` : `${rest.toFixed(1)}s`;
}

/** Makes whitespace visible in lists of missed characters. */
export function displayChar(char: string) {
  return char === " " ? "␣" : char;
}

export function truncate(text: string, length: number) {
  return text.length > length ? text.slice(0, length).trimEnd() + "…" : text;
}
