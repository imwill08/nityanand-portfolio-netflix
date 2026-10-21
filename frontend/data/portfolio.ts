export type Gradient = [string, string];
export type IconKey = "clip" | "trend" | "award" | "film" | "user" | "mail" | "phone" | "link" | "file";
export interface Card { t: string; d?: string; r?: string; o?: string; sc?: string[]; n?: number; icon?: IconKey; go?: string; dead?: boolean; at?: number; }
export interface Row { h: string; cards: Card[]; }
export interface Chapter { k: number; icon: IconKey; c: Gradient; label: string; title: string; match: number; year: string; role: string; where: string; summary: string; points?: string[]; rowTitle?: string; cards?: Card[]; scenes?: string[]; buttons?: [string, "play" | "next" | "mail"][]; rows?: Row[]; }

export const owner = { name: "Nityanand", email: "royanand729@gmail.com", phone: "+91 98375 06732", tel: "+919837506732", linkedin: "https://www.linkedin.com/", github: "https://github.com/" };

export const project = (t: string, d: string, o: string, pts: string[]): Card => ({ t, d, r: "React Developer", o, sc: [`React Developer — ${d}`, ...pts] });

export const archive: Card[] = [
  { t: "Simi — Real Estate Admin", d: "Property bidding, agent verification, wallet transactions", dead: true },
  { t: "Smart Report AI", d: "Vehicle inspection and technician management (React + Jotai)", dead: true },
  { t: "Artera", d: "Booking interfaces, KPI charts, loyalty and provider onboarding", dead: true },
  { t: "Reeba", d: "Client and coach interfaces with calendar scheduling and RTL", dead: true },
  { t: "Shagifa A1 Auto Star Motors", d: "Public site, employee portal, admin panel, bulk CSV workflows", dead: true },
];

export const featured: Card[] = [
  project("Yumzy — Food Delivery", "Restaurant and admin dashboards", "Next.js · Redux Toolkit · TanStack Query", ["Built restaurant and admin dashboards with Next.js, Redux Toolkit and TanStack Query.", "Worked on order status flows and menu management.", "Developed charity distribution features.", "Implemented commission payouts."]),
  project("Mirhal — Travel & Hospitality", "Hotels, vehicle rental, flights and activities", "Firebase notifications · vendor payouts", ["Worked across hotel, vehicle rental, flight and activity modules.", "Integrated Firebase notifications.", "Built vendor payout features."]),
  project("Sahalat — Enterprise Admin Portal", "Wallet, withdrawals and audit logs", "Arabic / English RTL", ["Built wallet and transaction views.", "Implemented withdrawal workflows and audit logs.", "Added Arabic/English RTL support."]),
  project("Bookly — Appointment Management", "Coupons, disputes and revenue reports", "React Query · ApexCharts", ["Developed appointment management and category management features.", "Built coupon handling and dispute workflows.", "Created revenue reports with React Query and ApexCharts."]),
  project("PeekaBox — Smart Lockers", "Locker and branch administration", "Live status via WebSockets", ["Built smart-locker administration features.", "Used Google Maps API for locations.", "Showed live locker status with WebSockets and handled branch operations."]),
];

const toolkit: [string, string, string][] = [
  ["Frontend", "React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS and Bootstrap.", "React → Next.js → TypeScript → Tailwind"],
  ["State & data", "Redux Toolkit, TanStack Query and Jotai, with ApexCharts and Chart.js for dashboards.", "Redux → Query → Jotai → Charts"],
  ["Backend & databases", "Node.js, Express.js, MySQL, PostgreSQL, MongoDB, Firebase and WebSockets.", "Node → Express → Database → Realtime"],
  ["Tools & testing", "REST APIs, GraphQL, Git, Docker, Google Maps API, i18next (RTL/LTR) and React Testing Library.", "API → Git → Docker → Test"],
  ["Reusable components", "Consistent, reusable UI components that make new features faster to deliver across apps.", "Design → Component → Reuse → Ship"],
  ["Multilingual UIs", "Arabic/English RTL support for admin portals and customer apps.", "i18next → RTL → LTR → Release"],
];

export const chapters: Chapter[] = [
  { k: 1, icon: "clip", c: ["#E50914", "#5a050b"], label: "Origin", title: "Where it all started", match: 97, year: "2022 – 2024", role: "Web Development Intern", where: "Blitz · Appz Global · IFortis", summary: "Three internships taught me the basics of shipping real web interfaces: HTML, CSS, JavaScript, debugging and working with an engineering team.", points: ["IFORTIS Worldwide (Aug 2023 – Feb 2024): built responsive interfaces with HTML, CSS, JavaScript and Next.js, improving cross-device compatibility.", "APPZ Global Tech (Jan – Jul 2023): helped build and maintain client web applications and got faster at debugging.", "Blitz Learning Technologies (Jun – Dec 2022): supported website features and bug fixing, plus marketing creatives and AutoCAD-related tasks."] },
  { k: 2, icon: "trend", c: ["#0071EB", "#082a63"], label: "Full-stack", title: "Going full-stack", match: 98, year: "Jun 2024 – Sep 2025", role: "Software Developer", where: "Blitz Learning Technologies", summary: "Back at Blitz as a full-time developer, working on company websites and internal tools with Next.js, Node.js and Express.js.", points: ["Helped build and maintain full-stack web applications, with API improvements and performance work.", "Blitz Learning Website: developed features and integrated backend APIs.", "HRMS Portal: implemented attendance tracking, leave management and reporting.", "Admin Dashboard: built screens for employee lifecycle management and operational reporting."] },
  { k: 3, icon: "award", c: ["#F5A623", "#6b4200"], label: "Today", title: "Shipping at scale", match: 99, year: "Sep 2025 – Now", role: "React Developer", where: "TechGropse Pvt. Ltd.", summary: "I build and maintain web apps across food delivery, travel, enterprise tools, logistics, fitness and real estate: interface components, API integration, state management and responsive layouts.", points: ["Built reusable frontend components shared across multiple web applications.", "Delivered admin dashboards with Redux Toolkit, TanStack Query, React Query, Jotai and ApexCharts.", "Added Arabic/English RTL support on several products.", "Worked on 10 products, including Yumzy, Mirhal, Sahalat, Bookly and PeekaBox."] },
  { k: 4, icon: "film", c: ["#FF6B35", "#702209"], label: "Projects", title: "Stories worth telling", match: 99, year: "10 products", role: "Portfolio", where: "5 featured, 5 more", summary: "Five featured products from TechGropse. Pick one to watch its story.", rowTitle: "Featured projects", cards: featured },
  { k: 5, icon: "user", c: ["#00B8A9", "#03403b"], label: "About me", title: "Know more about me", match: 100, year: "4 sections", role: "About", where: "Toolkit, education, certificates, contact", summary: "Software Developer building responsive, reusable web apps with React.js, Next.js, TypeScript, Node.js and Express.js.",
    scenes: ["Software Developer building dashboards and booking platforms, connecting frontends to APIs, with a focus on clear, reusable code.", "Toolkit: React.js, Next.js, TypeScript, Node.js, Express.js, Redux Toolkit, TanStack Query, Tailwind CSS, MySQL, PostgreSQL, MongoDB.", "Education: B.E. in Computer Science Engineering, Chandigarh University (2021 – 2025).", `Contact: ${owner.email}, ${owner.phone}.`],
    buttons: [["Play story", "play"], ["Email me", "mail"]],
    rows: [
      { h: "My toolkit", cards: toolkit.map((x, i) => ({ t: x[0], d: x[1], sc: [x[1], x[2]], n: i + 1 })) },
      { h: "Education", cards: [{ t: "B.E. Computer Science Engineering", d: "Chandigarh University, Punjab — 2021 to 2025" }, { t: "Intermediate (BSEB, PCMB)", d: "Ram Naresh Senyai, Kurtha, Arwal, Bihar — 2019 to 2021" }, { t: "Matriculation (CBSE)", d: "Army Public School, Dehradun — 2018 to 2019" }] },
      { h: "Certifications", cards: [{ t: "HTML, CSS, and JavaScript for Web Development", d: "Coursera" }, { t: "Python Dictionaries", d: "Coursera" }, { t: "Software Testing", d: "NPTEL" }, { t: "Data Mining", d: "NPTEL" }] },
      { h: "Get in touch", cards: [{ t: "Email", d: owner.email, go: `mailto:${owner.email}`, icon: "mail" }, { t: "Phone", d: owner.phone, go: `tel:${owner.tel}`, icon: "phone" }, { t: "LinkedIn", d: "Open profile", go: owner.linkedin, icon: "link" }, { t: "GitHub", d: "Open profile", go: owner.github, icon: "file" }] },
    ] },
];
