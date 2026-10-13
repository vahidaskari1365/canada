"use client";

import { useLocale } from "@/lib/app-context";

export function Logo({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
          {/* Maple leaf mark */}
          <path
            d="M24 4l3.2 7.4 7.8-2.2-3 7.6 7.2 3.6-7.2 3.6 3 7.6-7.8-2.2L24 44l-3.2-7.4-7.8 2.2 3-7.6L8.8 27.4l7.2-3.6-3-7.6 7.8 2.2L24 4z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">
          {locale === "fa" ? "مِیپل بریج" : "Maple Bridge"}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {locale === "fa" ? "مهاجرت به کانادا" : "Canada Immigration"}
        </span>
      </span>
    </span>
  );
}
