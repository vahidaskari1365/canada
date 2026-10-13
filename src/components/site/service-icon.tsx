"use client";

import {
  Rocket,
  Map,
  GraduationCap,
  Briefcase,
  HeartHandshake,
  Landmark,
  Lightbulb,
  Plane,
  BadgeCheck,
  CreditCard,
  FileText,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  rocket: Rocket,
  map: Map,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  "heart-handshake": HeartHandshake,
  landmark: Landmark,
  lightbulb: Lightbulb,
  plane: Plane,
  "badge-check": BadgeCheck,
  "credit-card": CreditCard,
  "file-text": FileText,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] || FileText;
  return <Icon className={className} strokeWidth={1.75} />;
}
