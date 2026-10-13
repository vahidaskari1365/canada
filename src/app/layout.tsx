import type { Metadata } from "next";
import { Geist, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

// Only preload the primary fonts actually used at first paint.
// Geist Mono is only used for tabular numbers — load it lazily (no preload).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Maple Bridge | مهاجرت و ویزای کانادا — Canada Visa & Immigration",
  description:
    "مشاوره تخصصی مهاجرت به کانادا: اکسپرس اینتری،PNP، ویزای تحصیلی، کاری و سرمایه‌گذاری. Expert Canada immigration consulting: Express Entry, PNP, study, work & investor visas.",
  keywords: [
    "مهاجرت کانادا",
    "ویزای کانادا",
    "اکسپرس اینتری",
    "Canada immigration",
    "Canada visa",
    "Express Entry",
    "PNP",
    "study permit Canada",
  ],
  authors: [{ name: "Maple Bridge" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Maple Bridge — Canada Visa & Immigration",
    description:
      "Expert Canada immigration consulting. Express Entry, PNP, study, work & investor visas.",
    siteName: "Maple Bridge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maple Bridge — Canada Visa & Immigration",
    description: "Expert Canada immigration consulting.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Preconnect to image origin (same origin) for faster hero image */}
        <link rel="preload" as="image" href="/canada.webp" fetchPriority="high" />
      </head>
      <body
        className={`${geistSans.variable} ${vazirmatn.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}
