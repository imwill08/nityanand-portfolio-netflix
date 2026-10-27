import type { Card, Chapter } from "@/data/portfolio";

export const CHAPTER_HERO_IMAGES: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80", // Origin: Coding setup / Web Dev
  2: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80", // Full-stack: Modern tech code screen
  3: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80", // Today: Shipping at scale / High tech workspace
  4: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80", // Projects: Netflix cinema / Stories worth telling
  5: "https://media.licdn.com/dms/image/v2/D5603AQG5_zj4hbSbnw/profile-displayphoto-scale_400_400/B56aF3H1p6H0Ag-/0/1792999909826?e=1794441600&v=beta&t=6coUTXkIXtU-SGnUP0Rqua5w_PdeefJWI0nTrI0ibM8", // About me: User photo
};

export function getChapterHeroImage(p: Chapter): string {
  if (p.bg && p.bg.trim().length > 0) return p.bg.trim();
  return CHAPTER_HERO_IMAGES[p.k] || "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=80";
}

export const CHAPTER_COVER_IMAGES: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", // Origin: Coding / Internships
  2: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // Full-stack: Web code / APIs
  3: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // Today: Shipping at scale / Dashboards
  4: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80", // Projects: Stories worth telling
  5: "https://media.licdn.com/dms/image/v2/D5603AQG5_zj4hbSbnw/profile-displayphoto-scale_400_400/B56aF3H1p6H0Ag-/0/1792999909826?e=1794441600&v=beta&t=6coUTXkIXtU-SGnUP0Rqua5w_PdeefJWI0nTrI0ibM8", // About me: User photo
};

export const HIGHLIGHT_IMAGES: Record<number, string[]> = {
  1: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", // IFORTIS: Responsive web interfaces
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", // APPZ: Client web apps & debugging
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", // Blitz: Website features & creatives
  ],
  2: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // Full-stack web apps
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", // Blitz website & APIs
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", // HRMS Portal
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", // Admin dashboard
  ],
  3: [
    "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80", // Reusable frontend components
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // Admin dashboards with Redux & charts
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", // Arabic/English RTL support
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", // 10 products
  ],
};

/**
 * Returns a high-quality, contextual image for any card.
 * Prioritizes explicitly provided `c.img`, then matches card keywords,
 * and falls back to a relevant tech / design photo.
 */
export function getCardImage(c: Card, chapterK?: number, cardIndex?: number): string {
  if (c.img && c.img.trim().length > 0) {
    return c.img.trim();
  }

  // Highlight points for specific chapters
  if (chapterK && cardIndex != null && HIGHLIGHT_IMAGES[chapterK]?.[cardIndex]) {
    return HIGHLIGHT_IMAGES[chapterK][cardIndex];
  }

  const text = `${c.t || ""} ${c.d || ""} ${c.o || ""} ${c.r || ""}`.toLowerCase();

  // Featured and archived products
  if (text.includes("yumzy") || text.includes("food delivery") || text.includes("restaurant")) {
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("mirhal") || text.includes("travel") || text.includes("hotel") || text.includes("flight")) {
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("sahalat") || text.includes("wallet") || text.includes("enterprise admin")) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("bookly") || text.includes("appointment") || text.includes("coupon")) {
    return "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("peekabox") || text.includes("smart locker") || text.includes("locker")) {
    return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("simi") || text.includes("real estate") || text.includes("property bidding")) {
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("smart report") || text.includes("vehicle inspection") || text.includes("technician")) {
    return "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("artera") || text.includes("kpi charts") || text.includes("provider onboarding")) {
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("reeba") || text.includes("coach") || text.includes("fitness")) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("shagifa") || text.includes("motors") || text.includes("auto star") || text.includes("car")) {
    return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
  }

  // Work & Internships
  if (text.includes("ifortis")) {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("appz")) {
    return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("hrms")) {
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("blitz")) {
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("full-stack")) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";
  }

  // Skills & Toolkit
  if (text.includes("frontend") || text.includes("react") || text.includes("next.js")) {
    return "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("state") || text.includes("redux") || text.includes("tanstack")) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("backend") || text.includes("node.js") || text.includes("express") || text.includes("database")) {
    return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("testing") || text.includes("docker") || text.includes("graphql") || text.includes("api")) {
    return "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("reusable components") || text.includes("components")) {
    return "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("multilingual") || text.includes("rtl") || text.includes("arabic")) {
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";
  }

  // Education
  if (text.includes("engineering") || text.includes("b.e.") || text.includes("chandigarh university")) {
    return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("intermediate") || text.includes("pcmb")) {
    return "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("matriculation") || text.includes("cbse") || text.includes("army public school")) {
    return "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80";
  }

  // Certifications
  if (text.includes("html, css, and javascript") || text.includes("web development")) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("python dictionaries") || text.includes("python")) {
    return "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("software testing")) {
    return "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80";
  }
  if (text.includes("data mining")) {
    return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80";
  }

  // Contact
  if (c.icon === "mail" || text.includes("email")) {
    return "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=800&q=80";
  }
  if (c.icon === "phone" || text.includes("phone")) {
    return "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=800&q=80";
  }
  if (c.icon === "link" || text.includes("linkedin")) {
    return "https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=800&q=80";
  }
  if (c.icon === "file" || text.includes("github")) {
    return "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80";
  }

  // Chapters fallback
  if (text.includes("where it all started") || text.includes("origin")) {
    return CHAPTER_COVER_IMAGES[1];
  }
  if (text.includes("going full-stack") || text.includes("full-stack")) {
    return CHAPTER_COVER_IMAGES[2];
  }
  if (text.includes("shipping at scale") || text.includes("today")) {
    return CHAPTER_COVER_IMAGES[3];
  }
  if (text.includes("stories worth telling") || text.includes("projects")) {
    return CHAPTER_COVER_IMAGES[4];
  }
  if (text.includes("know more about me") || text.includes("about")) {
    return CHAPTER_COVER_IMAGES[5];
  }

  return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
}
