"use client";

import { useMemo } from "react";
import { AppProvider, useLocale, useRouter } from "@/lib/app-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { HomePage } from "@/components/pages/home-page";
import { ServicesPage } from "@/components/pages/services-page";
import { ServiceDetailPage } from "@/components/pages/service-detail-page";
import { BlogPage } from "@/components/pages/blog-page";
import { BlogDetailPage } from "@/components/pages/blog-detail-page";
import { BookingPage } from "@/components/pages/booking-page";
import { PaymentPage } from "@/components/pages/payment-page";
import { AssessmentPage } from "@/components/pages/assessment-page";
import { AboutPage } from "@/components/pages/about-page";
import { ContactPage } from "@/components/pages/contact-page";
import { FaqPage } from "@/components/pages/faq-page";
import { SuccessStoriesPage } from "@/components/pages/success-stories-page";
import { TeamPage } from "@/components/pages/team-page";
import { PricingPage } from "@/components/pages/pricing-page";
import { LegalPage } from "@/components/pages/legal-page";
import { AdminApp } from "@/components/admin/admin-app";
import { useEffect, useState } from "react";

function Shell() {
  const { path } = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/public")
      .then((r) => r.json())
      .then((d) => setSettings(d?.settings || {}))
      .catch(() => {});
  }, []);

  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  const adminSection = path.replace("/admin/", "").replace("/admin", "") || "dashboard";

  const page = useMemo(() => {
    // Split path and query
    const [purePath, queryString] = path.split("?");
    const query = new URLSearchParams(queryString || "");

    // Blog detail: /blog/:slug
    if (purePath.startsWith("/blog/")) {
      const slug = purePath.replace("/blog/", "");
      return <BlogDetailPage slug={slug} />;
    }
    // Service detail: /services/:slug
    if (purePath.startsWith("/services/")) {
      const slug = purePath.replace("/services/", "");
      return <ServiceDetailPage slug={slug} />;
    }
    switch (purePath) {
      case "/":
        return <HomePage />;
      case "/services":
        return <ServicesPage />;
      case "/about":
        return <AboutPage />;
      case "/blog":
        return <BlogPage mode="all" />;
      case "/news":
        return <BlogPage mode="news" />;
      case "/booking":
        return <BookingPage initialPkg={query.get("pkg") || ""} />;
      case "/payment":
        return (
          <PaymentPage
            bookingId={query.get("booking") || ""}
            pkgSlug={query.get("pkg") || ""}
          />
        );
      case "/assessment":
        return <AssessmentPage />;
      case "/contact":
        return <ContactPage />;
      case "/faq":
        return <FaqPage />;
      case "/success-stories":
        return <SuccessStoriesPage />;
      case "/team":
        return <TeamPage />;
      case "/pricing":
        return <PricingPage />;
      case "/privacy":
        return <LegalPage type="privacy" />;
      case "/terms":
        return <LegalPage type="terms" />;
      default:
        return <HomePage />;
    }
  }, [path]);

  if (isAdmin) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <main className="flex-1">
          <AdminApp section={adminSection as any} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1">{page}</main>
      <Footer settings={settings} />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
