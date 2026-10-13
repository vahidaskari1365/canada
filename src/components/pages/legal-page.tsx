"use client";

import { useLocale } from "@/lib/app-context";
import { PageHero } from "../site/page-hero";
import { Section } from "../site/ui-bits";

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const { locale } = useLocale();

  const content = {
    privacy: {
      fa: {
        eyebrow: "حریم خصوصی",
        title: "سیاست حریم خصوصی",
        sections: [
          {
            h: "جمع‌آوری اطلاعات",
            p: "ما اطلاعات شخصی شما (نام، ایمیل، تلفن، اطلاعات مهاجرتی) را تنها برای ارائه خدمات مشاوره مهاجرتی جمع‌آوری می‌کنیم.",
          },
          {
            h: "استفاده از اطلاعات",
            p: "اطلاعات شما برای ارزیابی واجد شرایطی، ارتباط درباره پرونده و ارائه خدمات استفاده می‌شود. هرگز به треть اشخاص فروخته نمی‌شود.",
          },
          {
            h: "ذخیره‌سازی امن",
            p: "اطلاعات شما در پایگاه داده امن ذخیره می‌شود و دسترسی محدود به مشاوران مجاز دارد.",
          },
          {
            h: "حقوق شما",
            p: "شما حق دارید به اطلاعات خود دسترسی، آن را تصحیح یا حذف کنید. برای این منظور با ما تماس بگیرید.",
          },
        ],
      },
      en: {
        eyebrow: "Privacy",
        title: "Privacy Policy",
        sections: [
          {
            h: "Information collection",
            p: "We collect your personal information (name, email, phone, immigration details) solely to provide immigration consulting services.",
          },
          {
            h: "Use of information",
            p: "Your information is used for eligibility assessment, case communication and service delivery. It is never sold to third parties.",
          },
          {
            h: "Secure storage",
            p: "Your information is stored in a secure database with access limited to authorized consultants.",
          },
          {
            h: "Your rights",
            p: "You have the right to access, correct or delete your information. Contact us to exercise these rights.",
          },
        ],
      },
    },
    terms: {
      fa: {
        eyebrow: "شرایط استفاده",
        title: "شرایط و قوانین خدمات",
        sections: [
          {
            h: "ماهیت خدمات",
            p: "ما خدمات مشاوره مهاجرت ارائه می‌دهیم. تصمیم نهایی درباره ویزا منحصراً توسط IRCC گرفته می‌شود و هیچ مشاور رسمی نمی‌تواند تأیید را تضمین کند.",
          },
          {
            h: "هزینه‌ها",
            p: "هزینه‌های خدمات شفاف و ثابت است. هزینه‌های دولتی جداگانه محاسبه می‌شود. پرداخت‌ها غیرقابل بازگشت هستند مگر در موارد خاص.",
          },
          {
            h: "تعهدات مشتری",
            p: "مشتری متعهد می‌شود اطلاعات صحیح و کامل ارائه دهد. هرگونه اطلاعات نادرست می‌تواند منجر به رد درخواست شود.",
          },
          {
            h: "محرومیت از مسئولیت",
            p: "ما تلاش می‌کنیم بهترین خدمات را ارائه دهیم اما نتایج مهاجرتی تضمین‌پذیر نیستند و به سیاست‌های IRCC بستگی دارند.",
          },
        ],
      },
      en: {
        eyebrow: "Terms",
        title: "Terms of Service",
        sections: [
          {
            h: "Nature of services",
            p: "We provide immigration consulting services. The final visa decision is made solely by IRCC, and no licensed consultant can guarantee approval.",
          },
          {
            h: "Fees",
            p: "Service fees are transparent and fixed. Government fees are billed separately. Payments are non-refundable except in specific cases.",
          },
          {
            h: "Client obligations",
            p: "The client commits to providing accurate and complete information. Any inaccurate information may lead to application refusal.",
          },
          {
            h: "Disclaimer",
            p: "We strive to provide the best services, but immigration outcomes cannot be guaranteed and depend on IRCC policies.",
          },
        ],
      },
    },
  };

  const c = content[type][locale];

  return (
    <div>
      <PageHero eyebrow={c.eyebrow} title={c.title} />
      <Section>
        <div className="mx-auto max-w-3xl space-y-8">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.p}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
