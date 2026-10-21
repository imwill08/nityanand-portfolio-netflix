import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

const description = "Nityanand — React Developer building dashboards and booking platforms with React, Next.js, TypeScript and Node.js.";
export const metadata: Metadata = {
  title: "Nityanand — React Developer Portfolio",
  description,
  icons: { icon: "/icon.svg" },
  openGraph: { title: "Nityanand — React Developer Portfolio", description, type: "website" },
};
export const viewport: Viewport = { themeColor: "#141414", viewportFit: "cover", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${bebas.variable} ${jakarta.variable}`}><body>{children}</body></html>);
}
