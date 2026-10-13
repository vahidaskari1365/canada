"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("cv-auto py-16 md:py-24", className)}>
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-start",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.05]">
        {title}
      </h2>
      {desc && (
        <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          {desc}
        </p>
      )}
    </div>
  );
}

export function StatNumber({ value }: { value: string }) {
  return (
    <span className="font-mono tabular-nums tracking-tight">{value}</span>
  );
}
