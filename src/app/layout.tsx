import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { MapleFlagBg } from "@/components/site/maple-flag-bg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased bg-background text-foreground`}
      >
        {/* Site-wide waving Canadian flag — subtle, fixed behind all content */}
        <MapleFlagBg variant="site" />
        <div className="relative z-10">
          {children}
        </div>
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}
