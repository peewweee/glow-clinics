import type { Metadata, Viewport } from "next";
import { Figtree, Gilda_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-gilda", display: "swap" });

export const metadata: Metadata = {
  title: "Treatment Finder · Glow Clinics",
  description: "Answer five quick questions and get a suggested treatment before your free consult.",
};

export const viewport: Viewport = { themeColor: "#f6f4f8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${gilda.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
