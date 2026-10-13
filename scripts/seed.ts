/* eslint-disable */
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");

  // ---------- Admin ----------
  await db.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "$2a$10$placeholderhashmaplebridge2025admin",
      name: "Site Admin",
      role: "admin",
    },
  });

  // ---------- Categories ----------
  const catExp = await db.category.create({
    data: { slug: "express-entry", nameEn: "Express Entry", nameFa: "اکسپرس اینتری", color: "red" },
  });
  const catStudy = await db.category.create({
    data: { slug: "study", nameEn: "Study", nameFa: "تحصیلی", color: "amber" },
  });
  const catWork = await db.category.create({
    data: { slug: "work", nameEn: "Work", nameFa: "کاری", color: "emerald" },
  });
  const catNews = await db.category.create({
    data: { slug: "news", nameEn: "News", nameFa: "اخبار", color: "blue" },
  });
  const catGuide = await db.category.create({
    data: { slug: "guide", nameEn: "Guides", nameFa: "راهنما", color: "purple" },
  });

  // ---------- Services ----------
  const services = [
    {
      slug: "express-entry",
      titleEn: "Express Entry",
      titleFa: "اکسپرس اینتری",
      shortDescEn: "Federal skilled worker, trades & Canadian experience class",
      shortDescFa: "برنامه فدرال کارگران ماهر، مشاغل و تجربه کانادایی",
      descEn:
        "Express Entry is Canada's flagship federal immigration system managing skilled worker applications through the Federal Skilled Worker Program, Federal Skilled Trades Program, and Canadian Experience Class. We optimize your Comprehensive Ranking System (CRS) score and build your profile to maximize invitation chances.",
      descFa:
        "اکسپرس اینتری سیستم فدرال مهاجرت کانادا برای کارگران ماهر است که شامل برنامه‌های کارگر ماهر فدرال، مشاغل ماهر فدرال و تجربه کانادایی می‌شود. ما امتیاز CRS شما را بهینه‌سازی کرده و پروفایلتان را برای حداکثر شانس دعوتنامه (ITA) می‌سازیم.",
      icon: "rocket",
      durationEn: "6-8 months",
      durationFa: "۶ تا ۸ ماه",
      feeFrom: "$2,500",
      featured: true,
      order: 1,
      requirements: [
        { en: "Minimum 1 year skilled work experience", fa: "حداقل یک سال سابقه کار ماهر" },
        { en: "CLB 7+ language proficiency (IELTS/CELPIP)", fa: "سطح زبان CLB ۷ به بالا (آیلتس/سلیپ)" },
        { en: "Educational Credential Assessment (ECA)", fa: "ارزیابی مدارک تحصیلی (ECA)" },
        { en: "67/100 federal points threshold", fa: "حداقل ۶۷ از ۱۰۰ امتیاز فدرال" },
      ],
      steps: [
        { tEn: "Profile assessment", tFa: "ارزیابی پروفایل", dEn: "We evaluate your CRS score and eligibility across all three programs.", dFa: "امتیاز CRS و واجد شرایطی شما را در سه برنامه ارزیابی می‌کنیم." },
        { tEn: "Document preparation", tFa: "آماده‌سازی مدارک", dEn: "ECA, language tests, reference letters and police certificates.", dFa: "ECA، آزمون زبان، نامه‌های مرجع و گواهی عدم سوءپیشینه." },
        { tEn: "Profile submission", tFa: "ارسال پروفایل", dEn: "Submit your Express Entry profile to the IRCC pool.", dFa: "پروفایل اکسپرس اینتری شما را به استخر IRCC ارسال می‌کنیم." },
        { tEn: "PR application", tFa: "درخواست اقامت دائم", dEn: "After ITA, file your full PR application within 60 days.", dFa: "پس از دریافت دعوتنامه، درخواست کامل اقامت دائم را ظرف ۶۰ روز ثبت می‌کنیم." },
      ],
    },
    {
      slug: "pnp",
      titleEn: "Provincial Nominee Program (PNP)",
      titleFa: "برنامه نامزدی استانی (PNP)",
      shortDescEn: "Nomination from 11 Canadian provinces & territories",
      shortDescFa: "نامزدی از ۱۱ استان و قلمرو کانادا",
      descEn:
        "Each Canadian province and territory (except Quebec) operates its own PNP streams aligned with local labour market needs. A provincial nomination adds 600 CRS points, virtually guaranteeing an ITA. We match your profile to the highest-probability streams.",
      descFa:
        "هر استان و قلمرو کانادا (به جز کبک) برنامه‌های PNP خاص خود را دارد که با نیازهای بازار کار محلی هماهنگ است. نامزدی استانی ۶۰۰ امتیاز CRS اضافه می‌کند و عملاً دریافت دعوتنامه را تضمین می‌کند. ما پروفایل شما را با بالاترین شانس استانی تطبیق می‌دهیم.",
      icon: "map",
      durationEn: "8-15 months",
      durationFa: "۸ تا ۱۵ ماه",
      feeFrom: "$2,800",
      featured: true,
      order: 2,
      requirements: [
        { en: "Job offer or in-demand occupation (stream dependent)", fa: "پیشنهاد کار یا شغل پرتقاضا (بسته به استانی)" },
        { en: "Intent to reside in the nominating province", fa: "قصد اقامت در استان نامزدکننده" },
        { en: "Sufficient settlement funds", fa: "تمکن مالی کافی برای سکونت" },
      ],
      steps: [
        { tEn: "Province matching", tFa: "تطبیق استان", dEn: "Identify the best-fit province based on your occupation and points.", dFa: "بهترین استان را بر اساس شغل و امتیاز شما شناسایی می‌کنیم." },
        { tEn: "PNP application", tFa: "درخواست PNP", dEn: "File your provincial nomination application.", dFa: "درخواست نامزدی استانی را ثبت می‌کنیم." },
        { tEn: "Nomination & EE update", tFa: "نامزدی و به‌روزرسانی", dEn: "Receive nomination, add 600 CRS points to your profile.", dFa: "نامزدی را دریافت کرده و ۶۰۰ امتیاز به پروفایل اضافه می‌کنیم." },
        { tEn: "PR filing", tFa: "ثبت PR", dEn: "File the permanent residence application with IRCC.", dFa: "درخواست اقامت دائم را به IRCC ارسال می‌کنیم." },
      ],
    },
    {
      slug: "study-permit",
      titleEn: "Study Permit",
      titleFa: "ویزای تحصیلی",
      shortDescEn: "Study at Canada's world-class universities & colleges",
      shortDescFa: "تحصیل در دانشگاه‌ها و کالج‌های برتر کانادا",
      descEn:
        "Canada hosts some of the world's top universities and offers post-graduation work permits (PGWP) that open pathways to permanent residence. We handle your Letter of Acceptance, study permit application, and study-to-PR strategy.",
      descFa:
        "کانادا میزبان دانشگاه‌های برتر جهان است و اجازه کار پس از تحصیل (PGWP) که مسیر اقامت دائم را باز می‌کند. ما نامه پذیرش، درخواست ویزای تحصیلی و استراتژی تحصیل به PR را مدیریت می‌کنیم.",
      icon: "graduation-cap",
      durationEn: "4-12 weeks",
      durationFa: "۴ تا ۱۲ هفته",
      feeFrom: "$1,800",
      featured: true,
      order: 3,
      requirements: [
        { en: "Letter of Acceptance from a DLI", fa: "نامه پذیرش از یک موسسه DLI" },
        { en: "Proof of financial support (GIC + tuition)", fa: "اثبات تمکن مالی (GIC + شهریه)" },
        { en: "Medical exam & police certificate", fa: "معاینه پزشکی و گواهی عدم سوءپیشینه" },
        { en: "Statement of purpose", fa: "انگیزه‌نامه" },
      ],
      steps: [
        { tEn: "School selection", tFa: "انتخاب مدرسه", dEn: "Shortlist DLIs aligned with your goals and budget.", dFa: "موسسات DLI متناسب با اهداف و بودجه شما فهرست می‌کنیم." },
        { tEn: "Admission application", tFa: "درخواست پذیرش", dEn: "Apply and secure your Letter of Acceptance.", dFa: "درخواست داده و نامه پذیرش می‌گیریم." },
        { tEn: "Visa filing", tFa: "ثبت ویزا", dEn: "Submit study permit application with GIC and tuition proof.", dFa: "درخواست ویزای تحصیلی را با GIC و اثبات شهریه ثبت می‌کنیم." },
        { tEn: "Arrival & PGWP plan", tFa: "ورود و برنامه PGWP", dEn: "Pre-departure briefing and post-graduation work plan.", dFa: "آمادگی قبل از سفر و برنامه کار پس از تحصیل." },
      ],
    },
    {
      slug: "work-permit",
      titleEn: "Work Permit",
      titleFa: "ویزای کار",
      shortDescEn: "Employer-sponsored LMIA & open work permits",
      shortDescFa: "ویزای کار با LMIA کارفرما و ویزای کار آزاد",
      descEn:
        "Whether through an LMIA-supported job offer, intra-company transfer, or the International Mobility Program, we secure your legal right to work in Canada and transition you toward permanent residence.",
      descFa:
        "چه از طریق پیشنهاد کار با LMIA، انتقال درون‌شرکتی یا برنامه تحرک بین‌المللی، اجازه قانونی کار در کانادا را برای شما تأمین کرده و شما را به سوی اقامت دائم هدایت می‌کنیم.",
      icon: "briefcase",
      durationEn: "3-9 months",
      durationFa: "۳ تا ۹ ماه",
      feeFrom: "$2,200",
      featured: true,
      order: 4,
      requirements: [
        { en: "Job offer or qualifying program", fa: "پیشنهاد کار یا برنامه واجد شرایط" },
        { en: "LMIA (where applicable)", fa: "LMIA (در موارد لازم)" },
        { en: "Proof of qualifications & experience", fa: "اثبات صلاحیت و سابقه کار" },
      ],
      steps: [
        { tEn: "Eligibility check", tFa: "بررسی واجد شرایطی", dEn: "Determine the right work permit stream.", dFa: "مسیر مناسب ویزای کار را تعیین می‌کنیم." },
        { tEn: "LMIA / employer docs", tFa: "LMIA / مدارک کارفرما", dEn: "Coordinate LMIA or IMP documentation.", dFa: "هماهنگی LMIA یا مدارک IMP." },
        { tEn: "Permit application", tFa: "درخواست مجوز", dEn: "File the work permit application with IRCC.", dFa: "درخواست ویزای کار را به IRCC ارسال می‌کنیم." },
        { tEn: "PR pathway", tFa: "مسیر PR", dEn: "Plan your transition to permanent residence.", dFa: "انتقال به اقامت دائم را برنامه‌ریزی می‌کنیم." },
      ],
    },
    {
      slug: "family-sponsorship",
      titleEn: "Family Sponsorship",
      titleFa: "اسپانسر خانوادگی",
      shortDescEn: "Sponsor spouse, children, parents & grandparents",
      shortDescFa: "اسپانسر همسر، فرزندان، والدین و اجداد",
      descEn:
        "Canadian citizens and permanent residents can sponsor eligible family members for permanent residence. We prepare your sponsorship undertaking and the applicant's PR application with meticulous attention to relationship evidence and financial capacity.",
      descFa:
        "شهروندان و مقیمان دائم کانادا می‌توانند اعضای واجد شرایط خانواده را برای اقامت دائم اسپانسر کنند. ما تعهد اسپانسرشیپ و درخواست PR متقاضی را با دقت در مستندات رابطه و ظرفیت مالی آماده می‌کنیم.",
      icon: "heart-handshake",
      durationEn: "10-12 months",
      durationFa: "۱۰ تا ۱۲ ماه",
      feeFrom: "$2,000",
      featured: false,
      order: 5,
      requirements: [
        { en: "Sponsor is PR or citizen, 18+", fa: "اسپانسر مقیم دائم یا شهروند، بالای ۱۸ سال" },
        { en: "Ability to provide basic needs", fa: "توانایی تأمین نیازهای اولیه" },
        { en: "Genuine relationship proof", fa: "اثبات رابطه واقعی" },
      ],
      steps: [
        { tEn: "Eligibility review", tFa: "بررسی واجد شرایطی", dEn: "Confirm sponsor and applicant eligibility.", dFa: "واجد شرایطی اسپانسر و متقاضی را تأیید می‌کنیم." },
        { tEn: "Sponsorship filing", tFa: "ثبت اسپانسرشیپ", dEn: "Submit sponsorship undertaking.", dFa: "تعهد اسپانسرشیپ را ارسال می‌کنیم." },
        { tEn: "PR application", tFa: "درخواست PR", dEn: "File the family member's PR application.", dFa: "درخواست اقامت دائم عضو خانواده را ثبت می‌کنیم." },
        { tEn: "Follow-up", tFa: "پیگیری", dEn: "Track until decision and landing.", dFa: "تا تصمیم نهایی و ورود پیگیری می‌کنیم." },
      ],
    },
    {
      slug: "business-investor",
      titleEn: "Business & Investor Visa",
      titleFa: "ویزای تجاری و سرمایه‌گذاری",
      shortDescEn: "Entrepreneur & self-employed pathways",
      shortDescFa: "مسیر کارآفرینی و خوداشتغالی",
      descEn:
        "For entrepreneurs and high-net-worth individuals, Canada offers provincial investor streams and the federal self-employed program. We structure your business plan, source of funds narrative, and application to meet stringent requirements.",
      descFa:
        "برای کارآفرینان و افراد دارای دارایی خالص بالا، کانادا استreamهای سرمایه‌گذاری استانی و برنامه خوداشتغالی فدرال را ارائه می‌دهد. ما طرح کسب‌وکار، روایت منابع مالی و درخواست شما را برای پاسخ به الزامات سخت‌گیرانه ساختاردهی می‌کنیم.",
      icon: "landmark",
      durationEn: "12-24 months",
      durationFa: "۱۲ تا ۲۴ ماه",
      feeFrom: "$5,000",
      featured: false,
      order: 6,
      requirements: [
        { en: "Verifiable net worth threshold", fa: "دارایی خالص قابل تأیید" },
        { en: "Business or self-employed experience", fa: "سابقه کسب‌وکار یا خوداشتغالی" },
        { en: "Viable business plan", fa: "طرح کسب‌وکار قابل اجرا" },
      ],
      steps: [
        { tEn: "Profile & net worth", tFa: "پروفایل و دارایی", dEn: "Assess your business background and funds.", dFa: "سابقه تجاری و منابع مالی را ارزیابی می‌کنیم." },
        { tEn: "Business plan", tFa: "طرح کسب‌وکار", dEn: "Build an IRCC-grade business plan.", dFa: "طرح کسب‌وکار در سطح IRCC می‌سازیم." },
        { tEn: "Application", tFa: "درخواست", dEn: "File your business/investor application.", dFa: "درخواست تجاری/سرمایه‌گذاری را ثبت می‌کنیم." },
        { tEn: "Work permit to PR", tFa: "از ویزای کار تا PR", dEn: "Land on a work permit and transition to PR.", dFa: "با ویزای کار وارد شده و به PR منتقل می‌شوید." },
      ],
    },
    {
      slug: "startup-visa",
      titleEn: "Start-up Visa",
      titleFa: "ویزای استارتاپ",
      shortDescEn: "For innovative founders with a qualifying venture",
      shortDescFa: "برای بنیان‌گذاران نوآور با کسب‌وکار واجد شرایط",
      descEn:
        "Canada's Start-up Visa Program targets immigrant entrepreneurs with the skills to build innovative businesses. We help you secure a Letter of Support from a designated organization and file your PR application.",
      descFa:
        "برنامه ویزای استارتاپ کانادا برای کارآفرینان مهاجر با مهارت ساخت کسب‌وکارهای نوآور است. ما کمک می‌کنیم نامه حمایت از یک سازمان تعیین‌شده بگیرید و درخواست PR را ثبت کنید.",
      icon: "lightbulb",
      durationEn: "12-18 months",
      durationFa: "۱۲ تا ۱۸ ماه",
      feeFrom: "$4,200",
      featured: false,
      order: 7,
      requirements: [
        { en: "Qualifying business & Letter of Support", fa: "کسب‌وکار واجد شرایط و نامه حمایت" },
        { en: "CLB 5+ language proficiency", fa: "سطح زبان CLB ۵ به بالا" },
        { en: "Sufficient settlement funds", fa: "تمکن مالی کافی" },
      ],
      steps: [
        { tEn: "Venture assessment", tFa: "ارزیابی کسب‌وکار", dEn: "Evaluate your start-up's eligibility.", dFa: "واجد شرایطی استارتاپ را ارزیابی می‌کنیم." },
        { tEn: "Support letter", tFa: "نامه حمایت", dEn: "Connect with designated incubators/angels.", dFa: "ارتباط با انکوباتورها/فرشتگان تعیین‌شده." },
        { tEn: "PR filing", tFa: "ثبت PR", dEn: "File your start-up visa PR application.", dFa: "درخواست PR ویزای استارتاپ را ثبت می‌کنیم." },
        { tEn: "Work permit bridge", tFa: "پل ویزای کار", dEn: "Secure a temporary work permit while PR processes.", dFa: "ویزای کار موقت در حالی که PR پردازش می‌شود." },
      ],
    },
    {
      slug: "visitor-visa",
      titleEn: "Visitor Visa (TRV)",
      titleFa: "ویزای توریستی (TRV)",
      shortDescEn: "Temporary Resident Visa for tourism, family & business",
      shortDescFa: "ویزای اقامت موقت برای گردشگری، خانواده و تجارت",
      descEn:
        "Visit Canada for tourism, family visits or business with a Temporary Resident Visa. We strengthen your application with robust ties-to-home-country evidence and travel history analysis to maximize approval odds.",
      descFa:
        "با ویزای اقامت موقت برای گردشگری، دیدار خانواده یا تجارت به کانادا سفر کنید. ما درخواست شما را با مستندات قوی ارتباط با کشور مبدأ و تحلیل سابقه سفر تقویت می‌کنیم.",
      icon: "plane",
      durationEn: "2-8 weeks",
      durationFa: "۲ تا ۸ هفته",
      feeFrom: "$600",
      featured: false,
      order: 8,
      requirements: [
        { en: "Valid passport & financial means", fa: "پاسپورت معتبر و تمکن مالی" },
        { en: "Ties to home country", fa: "ارتباط با کشور مبدأ" },
        { en: "Good health & character", fa: "سلامت و حسن شهرت" },
      ],
      steps: [
        { tEn: "Eligibility check", tFa: "بررسی واجد شرایطی", dEn: "Review your travel history and ties.", dFa: "سابقه سفر و ارتباط‌هایتان را بررسی می‌کنیم." },
        { tEn: "Document prep", tFa: "آماده‌سازی مدارک", dEn: "Gather financial and tie evidence.", dFa: "مدارک مالی و ارتباط را جمع‌آوری می‌کنیم." },
        { tEn: "Visa filing", tFa: "ثبت ویزا", dEn: "Submit TRV application online.", dFa: "درخواست TRV را آنلاین ثبت می‌کنیم." },
        { tEn: "Decision", tFa: "تصمیم", dEn: "Track to passport request.", dFa: "تا درخواست پاسپورت پیگیری می‌کنیم." },
      ],
    },
    {
      slug: "citizenship",
      titleEn: "Citizenship Application",
      titleFa: "درخواست شهروندی",
      shortDescEn: "Naturalization for eligible permanent residents",
      shortDescFa: "تابعیت برای مقیمان دائم واجد شرایط",
      descEn:
        "After 3 of the last 5 years as a permanent resident, you can apply for Canadian citizenship. We verify your physical presence, tax compliance, and prepare you for the citizenship test and interview.",
      descFa:
        "پس از ۳ سال از ۵ سال گذشته به عنوان مقیم دائم، می‌توانید برای شهروندی کانادا درخواست دهید. ما حضور فیزیکی، انطباق مالیاتی و آمادگی آزمون و مصاحبه شهروندی را بررسی می‌کنیم.",
      icon: "badge-check",
      durationEn: "6-12 months",
      durationFa: "۶ تا ۱۲ ماه",
      feeFrom: "$900",
      featured: false,
      order: 9,
      requirements: [
        { en: "1,095 days of physical presence", fa: "۱٬۰۹۵ روز حضور فیزیکی" },
        { en: "Filed taxes for 3 years", fa: "تسویه مالیاتی ۳ سال" },
        { en: "Language skills CLB 4+", fa: "مهارت زبانی CLB ۴ به بالا" },
      ],
      steps: [
        { tEn: "Presence audit", tFa: "حساب حضور", dEn: "Calculate your eligible days.", dFa: "روزهای واجد شرایط شما را محاسبه می‌کنیم." },
        { tEn: "Application", tFa: "درخواست", dEn: "File citizenship application.", dFa: "درخواست شهروندی را ثبت می‌کنیم." },
        { tEn: "Test prep", tFa: "آمادگی آزمون", dEn: "Prepare for the citizenship test.", dFa: "آمادگی آزمون شهروندی." },
        { tEn: "Ceremony", tFa: "مراسم", dEn: "Attend the ceremony and take the oath.", dFa: "حضور در مراسم و ادای سوگند." },
      ],
    },
    {
      slug: "pr-card",
      titleEn: "PR Card Renewal",
      titleFa: "تمدید کارت PR",
      shortDescEn: "Renew or replace your Permanent Resident Card",
      shortDescFa: "تمدید یا تعویض کارت اقامت دائم",
      descEn:
        "Maintain your PR status and travel freely with a valid PR card. We handle renewals, replacements and residency obligation assessments.",
      descFa:
        "وضعیت PR خود را حفظ کرده و با کارت معتبر آزادانه سفر کنید. ما تمدید، تعویض و ارزیابی تعهدات اقامتی را انجام می‌دهیم.",
      icon: "credit-card",
      durationEn: "2-6 months",
      durationFa: "۲ تا ۶ ماه",
      feeFrom: "$500",
      featured: false,
      order: 10,
      requirements: [
        { en: "730 days presence in 5 years", fa: "۷۳۰ روز حضور در ۵ سال" },
        { en: "Current PR status", fa: "وضعیت PR فعلی" },
      ],
      steps: [
        { tEn: "Residency audit", tFa: "حساب اقامت", dEn: "Verify residency obligation compliance.", dFa: "تأیید انطباق تعهد اقامتی." },
        { tEn: "Application", tFa: "درخواست", dEn: "File PR card renewal.", dFa: "ثبت تمدید کارت PR." },
        { tEn: "Card delivery", tFa: "تحویل کارت", dEn: "Receive new PR card.", dFa: "دریافت کارت PR جدید." },
      ],
    },
  ];

  for (const s of services) {
    await db.service.create({
      data: {
        slug: s.slug,
        titleEn: s.titleEn,
        titleFa: s.titleFa,
        shortDescEn: s.shortDescEn,
        shortDescFa: s.shortDescFa,
        descEn: s.descEn,
        descFa: s.descFa,
        icon: s.icon,
        durationEn: s.durationEn,
        durationFa: s.durationFa,
        feeFrom: s.feeFrom,
        featured: s.featured,
        order: s.order,
        published: true,
        requirements: {
          create: s.requirements.map((r) => ({ textEn: r.en, textFa: r.fa })),
        },
        steps: {
          create: s.steps.map((st, i) => ({
            step: i + 1,
            titleEn: st.tEn,
            titleFa: st.tFa,
            descEn: st.dEn,
            descFa: st.dFa,
          })),
        },
      },
    });
  }

  // ---------- Consultation Packages ----------
  const packages = [
    {
      slug: "quick-consult",
      nameEn: "Quick Consultation",
      nameFa: "مشاوره سریع",
      descEn: "30-minute focused call for a single question",
      descFa: "تماس ۳۰ دقیقه‌ای برای یک سؤال مشخص",
      priceUSD: 49,
      durationEn: "30 min",
      durationFa: "۳۰ دقیقه",
      featuresEn: "Single topic deep-dive\nWritten summary email\nFollow-up Q&A by email",
      featuresFa: "بررسی عمیق یک موضوع\nایمیل خلاصه کتبی\nپاسخ به سؤالات تکمیلی",
      order: 1,
    },
    {
      slug: "standard",
      nameEn: "Standard Strategy",
      nameFa: "استراتژی استاندارد",
      descEn: "60-minute roadmap + written assessment",
      descFa: "نقشه راه ۶۰ دقیقه‌ای + ارزیابی کتبی",
      priceUSD: 149,
      durationEn: "60 min",
      durationFa: "۶۰ دقیقه",
      featuresEn: "Full profile assessment\nPersonalized roadmap\nCRS/eligibility scoring\nWritten action plan\nPriority email support",
      featuresFa: "ارزیابی کامل پروفایل\nنقشه راه شخصی‌سازی‌شده\nامتیاز CRS/واجد شرایطی\nبرنامه عملیاتی کتبی\nپشتیبانی ایمیل اولویت‌دار",
      popular: true,
      order: 2,
    },
    {
      slug: "full-service",
      nameEn: "Full Application Service",
      nameFa: "خدمات کامل پرونده",
      descEn: "End-to-end representation from start to landing",
      descFa: "نمایت کامل از ابتدا تا ورود به کانادا",
      priceUSD: 2500,
      durationEn: "6-18 months",
      durationFa: "۶ تا ۱۸ ماه",
      featuresEn: "Dedicated case officer\nAll forms & documents\nIRCC correspondence\nUntil decision & landing\nFamily included",
      featuresFa: "مسئول پرونده اختصاصی\nتمام فرم‌ها و مدارک\nمکاتبات IRCC\nتا تصمیم نهایی و ورود\nشامل خانواده",
      order: 3,
    },
  ];
  for (const p of packages) {
    await db.consultationPackage.create({ data: p as any });
  }

  // ---------- Testimonials ----------
  const testimonials = [
    {
      nameEn: "Arman Rahimi",
      nameFa: "آرمان رحیمی",
      countryEn: "Iran",
      countryFa: "ایران",
      programEn: "Express Entry — FSW",
      programFa: "اکسپرس اینتری — FSW",
      textEn:
        "I got my ITA within 3 months of entering the pool. The team optimized my CRS from 421 to 487. Landed in Toronto last spring.",
      textFa:
        "تنها ۳ ماه بعد از ورود به استخر دعوتنامه گرفتم. تیم امتیاز CRS مرا از ۴۲۱ به ۴۸۷ رساند. بهار گذشته در تورنتو فرود آمد.",
      rating: 5,
    },
    {
      nameEn: "Negar Sadeghi",
      nameFa: "نگار صادقی",
      countryEn: "Iran",
      countryFa: "ایران",
      programEn: "Study Permit → PGWP",
      programFa: "ویزای تحصیلی → PGWP",
      textEn:
        "From admission to my study visa in 6 weeks. They even planned my post-grad work path. Now working full-time in Vancouver.",
      textFa:
        "از پذیرش تا ویزای تحصیلی در ۶ هفته. حتی مسیر کار پس از تحصیل را هم برنامه‌ریزی کردند. الان در ونکوور تمام‌وقت کار می‌کنم.",
      rating: 5,
    },
    {
      nameEn: "Reza Karimi",
      nameFa: "رضا کریمی",
      countryEn: "Iran",
      countryFa: "ایران",
      programEn: "Ontario PNP",
      programFa: "PNP انتاریو",
      textEn:
        "The provincial nomination was the turning point. Their province-matching strategy saved me months. Highly recommend.",
      textFa:
        "نامزدی استانی نقطه عطف بود. استراتژی تطبیق استانی ماه‌ها زمانم را ذخیره کرد. قویاً توصیه می‌کنم.",
      rating: 5,
    },
    {
      nameEn: "Sahar Mohammadi",
      nameFa: "سحر محمدی",
      countryEn: "Iran",
      countryFa: "ایران",
      programEn: "Spousal Sponsorship",
      programFa: "اسپانسر همسر",
      textEn:
        "My husband's PR came through in 11 months. They handled every document and made a stressful process feel calm.",
      textFa:
        "PR همسرم در ۱۱ ماه به نتیجه رسید. هر مدرک را مدیریت کردند و فرآیندی پر استرس را آرام کردند.",
      rating: 5,
    },
    {
      nameEn: "Kian Ahmadi",
      nameFa: "کیان احمدی",
      countryEn: "Iran",
      countryFa: "ایران",
      programEn: "Start-up Visa",
      programFa: "ویزای استارتاپ",
      textEn:
        "Secured a Letter of Support from a designated incubator with their help. Now building my company in Montreal.",
      textFa:
        "با کمک ایشان نامه حمایت از یک انکوباتور تعیین‌شده گرفتم. الان شرکت خودم را در مونترال می‌سازم.",
      rating: 5,
    },
    {
      nameEn: "Maryam Ebrahimi",
      nameFa: "مریم ابراهیمی",
      countryEn: "Iran",
      countryFa: "ایران",
      programEn: "Work Permit → CEC",
      programFa: "ویزای کار → CEC",
      textEn:
        "They guided me from LMIA to Canadian Experience Class PR. Transparent pricing and honest advice throughout.",
      textFa:
        "از LMIA تا PR از طریق CEC راهنمایییم کردند. قیمت‌گذاری شفاف و مشاوره صادقانه در تمام مسیر.",
      rating: 5,
    },
  ];
  for (const t of testimonials) {
    await db.testimonial.create({ data: { ...t, published: true } });
  }

  // ---------- Team ----------
  const team = [
    {
      nameEn: "Daniel Lafontaine, RCIC",
      nameFa: "دنیل لافونتین، RCIC",
      roleEn: "Lead Immigration Consultant",
      roleFa: "مشاور ارشد مهاجرت",
      bioEn: "RCIC since 2014 with 3,000+ filed cases across all federal and provincial streams.",
      bioFa: "مشاور رسمی RCIC از ۲۰۱۴ با بیش از ۳٬۰۰۰ پرونده در تمام استreamهای فدرال و استانی.",
      linkedin: "#",
      email: "daniel@maplebridge.ca",
      order: 1,
    },
    {
      nameEn: "Setareh Mirzaei",
      nameFa: "ستاره میرزایی",
      roleEn: "Senior Case Manager",
      roleFa: "مدیر ارشد پرونده",
      bioEn: "Specializes in Express Entry and PNP strategy for Middle Eastern applicants.",
      bioFa: "متخصص استراتژی اکسپرس اینتری و PNP برای متقاضیان خاورمیانه.",
      linkedin: "#",
      email: "setareh@maplebridge.ca",
      order: 2,
    },
    {
      nameEn: "Marc Tremblay",
      nameFa: "مارک ترمبلی",
      roleEn: "Corporate & Investor Lead",
      roleFa: "سرپرست تجاری و سرمایه‌گذاری",
      bioEn: "Former Big-4 advisor; structures business and investor applications.",
      bioFa: "مشاور سابق بیگ‌فور؛ ساختاردهی درخواست‌های تجاری و سرمایه‌گذاری.",
      linkedin: "#",
      email: "marc@maplebridge.ca",
      order: 3,
    },
  ];
  for (const m of team) {
    await db.teamMember.create({ data: { ...m, published: true } });
  }

  // ---------- FAQ ----------
  const faqs = [
    {
      qEn: "How long does the Express Entry process take?",
      qFa: "فرآیند اکسپرس اینتری چقدر طول می‌کشد؟",
      aEn: "From profile submission to PR decision typically 6-8 months, assuming you receive an Invitation to Apply within the first few draws.",
      aFa: "از ارسال پروفایل تا تصمیم PR معمولاً ۶ تا ۸ ماه، به شرط دریافت دعوتنامه در چند دوره اول.",
      category: "express-entry",
    },
    {
      qEn: "What is the minimum IELTS score required?",
      qFa: "حداقل نمره آیلتس چقدر است؟",
      aEn: "CLB 7 (about IELTS 6.0 in each band) is the federal minimum for FSW. Higher scores significantly raise your CRS points.",
      aFa: "CLB ۷ (حدود آیلتس ۶.۰ در هر مهارت) حداقل فدرال برای FSW است. نمرات بالاتر امتیاز CRS را به‌طور قابل توجهی افزایش می‌دهد.",
      category: "language",
    },
    {
      qEn: "Do you guarantee approval?",
      qFa: "آیا تضمین تأیید می‌دهید؟",
      aEn: "No licensed consultant can guarantee approval — IRCC makes the final decision. We guarantee a complete, accurate and strategically optimized application.",
      aFa: "هیچ مشاور رسمی نمی‌تواند تأیید را تضمین کند — تصمیم نهایی با IRCC است. ما یک درخواست کامل، دقیق و بهینه‌شده را تضمین می‌کنیم.",
      category: "general",
    },
    {
      qEn: "Can I work while on a study permit?",
      qFa: "آیا با ویزای تحصیلی می‌توانم کار کنم؟",
      aEn: "Yes — up to 24 hours/week off-campus during academic sessions and full-time during scheduled breaks.",
      aFa: "بله — تا ۲۴ ساعت در هفته خارج از دانشگاه در دوره‌های تحصیلی و تمام‌وقت در تعطیلات برنامه‌ریزی‌شده.",
      category: "study",
    },
    {
      qEn: "What settlement funds are required?",
      qFa: "تمکن مالی لازم چقدر است؟",
      aEn: "It depends on family size. For a single applicant in 2025 the threshold is CAD $14,690; it rises with each additional family member.",
      aFa: "بستگی به اندازه خانواده دارد. برای متقاضی مجرد در ۲۰۲۵ حدود ۱۴٬۶۹۰ دلار کانادا است و با هر عضو خانواده افزایش می‌یابد.",
      category: "general",
    },
    {
      qEn: "How are your fees structured?",
      qFa: "هزینه‌های شما چگونه محاسبه می‌شود؟",
      aEn: "Flat, transparent fees per service — no hourly surprises. Government fees are billed separately at cost.",
      aFa: "هزینه ثابت و شفاف برای هر خدمت — بدون هزینه ساعتی. هزینه‌های دولتی جداگانه به قیمت واقعی محاسبه می‌شود.",
      category: "general",
    },
  ];
  for (const f of faqs) {
    await db.faq.create({ data: f });
  }

  // ---------- Blog / News / Guides ----------
  const posts = [
    {
      slug: "express-entry-draws-2025",
      titleEn: "Express Entry Draws in 2025: What the New Category-Based Selections Mean",
      titleFa: "قرعه‌کشی‌های اکسپرس اینتری در ۲۰۲۵: معنای انتخاب‌های جدید مبتنی بر دسته",
      excerptEn: "IRCC continues category-based selection for STEM, healthcare, French and trades. Here's how to position your profile.",
      excerptFa: "IRCC به انتخاب‌های مبتنی بر دسته برای STEM، بهداشت، فرانسوی و مشاغل ادامه می‌دهد. نحوه موقعیت‌دهی پروفایل شما.",
      contentEn: "Canada's Express Entry system introduced category-based selections in 2023 and expanded them through 2024-2025. The categories target:\n\n- STEM professions (science, tech, engineering, math)\n- Healthcare occupations\n- French-language proficiency\n- Trades (carpentry, plumbing, welding)\n- Agriculture and agri-food\n- Transport\n\n## How to position yourself\n\n1. **Verify your NOC code** matches an in-demand category.\n2. **Boost French** — even CLB 7 can open category-specific draws.\n3. **Update your profile** after any job change or credential.\n\n## What CRS score is competitive?\n\nGeneral draws have hovered around 500-530, while category draws can be 60-100 points lower. If you qualify for a category, your odds improve substantially.",
      contentFa: "سیستم اکسپرس اینتری کانادا در ۲۰۲۳ انتخاب‌های مبتنی بر دسته را معرفی کرد و در ۲۰۲۴-۲۰۲۵ گسترش داد. دسته‌ها هدف می‌گیرند:\n\n- مشاغل STEM\n- مشاغل بهداشت و درمان\n- تسلط به زبان فرانسوی\n- مشاغل فنی (نجاری، لوله‌کشی، جوشکاری)\n- کشاورزی و صنایع غذایی\n- حمل‌ونقل\n\n## نحوه موقعیت‌دهی\n\n۱. **کد NOC** خود را با یک دسته پرتقاضا تطبیق دهید.\n۲. **فرانسوی را تقویت کنید** — حتی CLB ۷ می‌تواند قرعه‌کشی‌های خاص دسته را باز کند.\n۳. **پروفایل را به‌روز کنید** پس از هر تغییر شغل یا مدرک.\n\n## چه امتیاز CRS رقابتی است؟\n\nقرعه‌کشی‌های عمومی حدود ۵۰۰-۵۳۰ بوده‌اند، در حالی که قرعه‌کشی‌های دسته‌ای می‌تواند ۶۰-۱۰۰ امتیاز پایین‌تر باشد.",
      type: "guide",
      categoryId: catExp.id,
      authorEn: "Daniel Lafontaine",
      authorFa: "دنیل لافونتین",
      readingTime: 6,
      featured: true,
      tagsEn: "express-entry, CRS, 2025",
      tagsFa: "اکسپرس اینتری, CRS, ۲۰۲۵",
    },
    {
      slug: "pnp-update-ontario-bc-2025",
      titleEn: "Ontario & BC PNP Updates: New Streams for Tech Workers",
      titleFa: "به‌روزرسانی PNP انتاریو و BC: استreamهای جدید برای کارکنان فناوری",
      excerptEn: "OINP and BC PNP both launched tech-focused streams. Eligibility and how to apply.",
      excerptFa: "OINP و BC PNP هر دو استreamهای متمرکز بر فناوری راه‌اندازی کردند. واجد شرایطی و نحوه درخواست.",
      contentEn: "## Ontario Immigrant Nominee Program (OINP)\nOINP's Employer Job Offer: Tech stream targets six tech occupations including software engineers and data scientists.\n\n## BC PNP Tech\nBritish Columbia runs a dedicated tech pilot with weekly invitations and faster processing.\n\n## How to choose\nCompare your NOC, job offer location and CRS. We can map both pathways in a single consultation.",
      contentFa: "## برنامه نامزدی مهاجرت انتاریو (OINP)\nاستream شغل کارفرما: فناوری OINP شش شغل فناوری از جمله مهندسان نرم‌افزار و دانشمندان داده را هدف می‌گیرد.\n\n## BC PNP Tech\nبریتیش کلمبیا یک پایلوت فناوری اختصاصی با دعوت‌های هفتگی و پردازش سریع‌تر دارد.\n\n## نحوه انتخاب\nNOC، محل پیشنهاد کار و CRS را مقایسه کنید. می‌توانیم هر دو مسیر را در یک مشاوره نقشه‌برداری کنیم.",
      type: "news",
      categoryId: catNews.id,
      authorEn: "Setareh Mirzaei",
      authorFa: "ستاره میرزایی",
      readingTime: 4,
      featured: false,
      tagsEn: "PNP, Ontario, BC, tech",
      tagsFa: "PNP, انتاریو, BC, فناوری",
    },
    {
      slug: "study-permit-cap-2025",
      titleEn: "Canada's 2025 Study Permit Cap: What Students Must Know",
      titleFa: "سقف ویزای تحصیلی کانادا در ۲۰۲۵: آنچه دانشجویان باید بدانند",
      excerptEn: "IRCC introduced provincial attestation letters and intake targets. Impact on applicants.",
      excerptFa: "IRCC نامه تأیید استانی و اهداف پذیرش را معرفی کرد. تأثیر بر متقاضیان.",
      contentEn: "## The new framework\nIn 2024-2025 IRCC capped study permit intake and required a Provincial Attestation Letter (PAL) for most applicants.\n\n## What you need\n1. Letter of Acceptance from a DLI\n2. Provincial Attestation Letter\n3. Proof of funds\n\n## Strategy\nApply early — PALs are allocated per province and can run out.",
      contentFa: "## چارچوب جدید\nدر ۲۰۲۴-۲۰۲۵ IRCC پذیرش ویزای تحصیلی را سقف‌گذاری کرد و برای بیشتر متقاضیان نامه تأیید استانی (PAL) را الزامی کرد.\n\n## آنچه نیاز دارید\n۱. نامه پذیرش از یک DLI\n۲. نامه تأیید استانی\n۳. اثبات تمکن مالی\n\n## استراتژی\nزود درخواست دهید — PALها به هر استان اختصاص می‌یابد و ممکن است تمام شود.",
      type: "news",
      categoryId: catStudy.id,
      authorEn: "Setareh Mirzaei",
      authorFa: "ستاره میرزایی",
      readingTime: 5,
      featured: true,
      tagsEn: "study permit, PAL, 2025",
      tagsFa: "ویزای تحصیلی, PAL, ۲۰۲۵",
    },
    {
      slug: "crs-score-guide",
      titleEn: "How to Maximize Your CRS Score: A Practical Guide",
      titleFa: "چگونه امتیاز CRS خود را بیشینه کنید: راهنمای کاربردی",
      excerptEn: "Actionable tactics to raise your Comprehensive Ranking System score by 50-150 points.",
      excerptFa: "تاکتیک‌های عملی برای افزایش امتیاز CRS تا ۵۰-۱۵۰ امتیاز.",
      contentEn: "## Core human capital\n- Language: CLB 9+ adds significant points. CLB 10 in all bands can add 60+.\n- Education: A master's degree adds 126 points over a bachelor's.\n\n## Spouse factors\nIf your spouse is accompanying, language and education matter — but reduce your own ceiling.\n\n## Skill transferability\nCombining education + foreign work experience, or language + Canadian experience, adds up to 100 points.\n\n## Bonus points\n- Provincial nomination: +600\n- Qualified job offer (TEER 0): +200\n- Sibling in Canada: +15\n- French: +25-50",
      contentFa: "## سرمایه انسانی اصلی\n- زبان: CLB ۹+ امتیاز قابل توجهی اضافه می‌کند. CLB ۱۰ در همه مهارت‌ها می‌تواند ۶۰+ امتیاز بیاورد.\n- تحصیلات: مدرک ارشد ۱۲۶ امتیاز بیشتر از لیسانس.\n\n## عوامل همسر\nاگر همسر همراه است، زبان و تحصیلات مهم است — اما سقف خودتان را کاهش می‌دهد.\n\n## انتقال‌پذیری مهارت\nترکیب تحصیلات + سابقه کار خارجی، یا زبان + تجربه کانادایی، تا ۱۰۰ امتیاز اضافه می‌کند.\n\n## امتیازهای پاداش\n- نامزدی استانی: +۶۰۰\n- پیشنهاد کار واجد شرایط (TEER 0): +۲۰۰\n- خواهر/برادر در کانادا: +۱۵\n- فرانسوی: +۲۵-۵۰",
      type: "guide",
      categoryId: catExp.id,
      authorEn: "Daniel Lafontaine",
      authorFa: "دنیل لافونتین",
      readingTime: 7,
      featured: false,
      tagsEn: "CRS, express-entry, points",
      tagsFa: "CRS, اکسپرس اینتری, امتیاز",
    },
    {
      slug: "funds-settlement-2025",
      titleEn: "Proof of Funds 2025: Updated Amounts by Family Size",
      titleFa: "اثبات تمکن مالی ۲۰۲۵: مبالغ به‌روز بر اساس اندازه خانواده",
      excerptEn: "The 2025 LICO amounts every Express Entry applicant must show.",
      excerptFa: "مبالغ LICO ۲۰۲۵ که هر متقاضی اکسپرس اینتری باید نشان دهد.",
      contentEn: "## 2025 minimums (CAD)\n- 1 person: $14,690\n- 2 persons: $18,288\n- 3 persons: $22,483\n- 4 persons: $27,297\n- 5 persons: $30,690\n\n## Acceptable proof\n- Bank balances over 6 months\n- GIC\n- Non-cash assets (in some streams)\n\nKeep funds in a single, traceable account and avoid large unexplained deposits.",
      contentFa: "## حداقل‌های ۲۰۲۵ (دلار کانادا)\n- ۱ نفر: ۱۴٬۶۹۰\n- ۲ نفر: ۱۸٬۲۸۸\n- ۳ نفر: ۲۲٬۴۸۳\n- ۴ نفر: ۲۷٬۲۹۷\n- ۵ نفر: ۳۰٬۶۹۰\n\n## اثبات قابل قبول\n- موجودی بانکی بیش از ۶ ماه\n- GIC\n- دارایی‌های غیرنقدی (در برخی استreamها)\n\nوجه را در یک حساب قابل ردیابی نگه دارید و از واریزی‌های بزرگ بدون توضیح پرهیز کنید.",
      type: "guide",
      categoryId: catGuide.id,
      authorEn: "Setareh Mirzaei",
      authorFa: "ستاره میرزایی",
      readingTime: 4,
      featured: false,
      tagsEn: "funds, settlement, 2025",
      tagsFa: "تمکن, سکونت, ۲۰۲۵",
    },
    {
      slug: "startup-visa-deep-dive",
      titleEn: "Start-up Visa: From Idea to Letter of Support",
      titleFa: "ویزای استارتاپ: از ایده تا نامه حمایت",
      excerptEn: "How designated incubators, angel groups and VCs evaluate your venture.",
      excerptFa: "انکوباتورها، گروه‌های فرشته و VCهای تعیین‌شده چگونه کسب‌وکار شما را ارزیابی می‌کنند.",
      contentEn: "## Designated organizations\nThree types can issue a Letter of Support:\n1. Business incubators (no investment required)\n2. Angel investor groups (min $75,000)\n3. Venture capital funds (min $200,000)\n\n## Pitching\nPrepare a defensible business plan, traction evidence and a clear ask. Incubators focus on viability; VCs on scalability.\n\n## After the letter\nFile your PR with a work permit bridge to start operating in Canada immediately.",
      contentFa: "## سازمان‌های تعیین‌شده\nسه نوع می‌توانند نامه حمایت صادر کنند:\n۱. انکوباتورهای کسب‌وکار (بدون نیاز به سرمایه‌گذاری)\n۲. گروه‌های سرمایه‌گذار فرشته (حداقل ۷۵٬۰۰۰ دلار)\n۳. صندوق‌های سرمایه‌گذاری جسورانه (حداقل ۲۰۰٬۰۰۰ دلار)\n\n## پچ کردن\nطرح کسب‌وکار قابل دفاع، شواهد پیشرفت و درخواست واضح آماده کنید. انکوباتورها بر قابلیت اجرا؛ VCها بر مقیاس‌پذیری تمرکز دارند.\n\n## پس از نامه\nPR خود را با پل ویزای کار ثبت کنید تا فوراً در کانادا شروع به کار کنید.",
      type: "guide",
      categoryId: catGuide.id,
      authorEn: "Marc Tremblay",
      authorFa: "مارک ترمبلی",
      readingTime: 8,
      featured: false,
      tagsEn: "startup, visa, entrepreneur",
      tagsFa: "استارتاپ, ویزا, کارآفرینی",
    },
  ];
  for (const p of posts) {
    await db.post.create({
      data: {
        ...p,
        coverImage: "",
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 90 * 86400000),
      } as any,
    });
  }

  // ---------- Settings ----------
  await db.setting.create({
    data: {
      key: "site.phone",
      value: "+1 (416) 555-0142",
    },
  });
  await db.setting.create({
    data: { key: "site.email", value: "hello@maplebridge.ca" },
  });
  await db.setting.create({
    data: { key: "site.addressEn", value: "120 Adelaide St W, Suite 2500, Toronto, ON M5H 1T1" },
  });
  await db.setting.create({
    data: { key: "site.addressFa", value: "۱۲۰ آدلاید غربی، سوئیت ۲۵۰۰، تورنتو، انتاریو M5H 1T1" },
  });
  await db.setting.create({ data: { key: "site.whatsapp", value: "+14165550142" } });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
