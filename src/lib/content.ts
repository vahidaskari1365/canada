/** Bilingual field picker helper */
export function localized<T extends Record<string, any>>(
  item: T,
  field: string,
  locale: "fa" | "en"
): string {
  const key = `${field}${locale === "fa" ? "Fa" : "En"}`;
  return (item as any)[key] ?? (item as any)[`${field}En`] ?? "";
}

export function multi(field: string): ["fa", "en"] {
  return ["fa", "en"];
}

export function splitLines(s: string): string[] {
  if (!s) return [];
  return s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string, locale: "fa" | "en") {
  const d = typeof date === "string" ? new Date(date) : date;
  if (locale === "fa") {
    try {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  }
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatCurrency(usd: number, locale: "fa" | "en") {
  if (locale === "fa") {
    return new Intl.NumberFormat("fa-IR").format(usd) + " دلار";
  }
  return "$" + usd.toLocaleString("en-US");
}
