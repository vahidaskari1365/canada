"use client";

import React from "react";
import { useLocale, useRouter } from "@/lib/app-context";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  desc,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const { dir } = useLocale();
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60 bg-muted/20",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 maple-pattern opacity-50" />
        <div className="absolute -top-24 ltr:right-10 rtl:left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 ltr:left-1/4 rtl:right-1/4 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl md:leading-[1.08]">
          {title}
        </h1>
        {desc && (
          <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            {desc}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function BackButton({ to = "/", label }: { to?: string; label: string }) {
  const { dir } = useLocale();
  const { navigate } = useRouter();
  const Chevron = dir === "rtl" ? ChevronRight : ChevronLeft;
  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <Chevron className="h-4 w-4" />
      {label}
    </button>
  );
}
