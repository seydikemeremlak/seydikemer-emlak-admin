import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://seydikemeremlak.com.tr"),

  title: {
    default: "Seydikemer Emlak | Mahalleler, İlanlar ve Emlak Rehberi",
    template: "%s | Seydikemer Emlak",
  },

  description:
    "Seydikemer mahalleleri, satılık emlak ilanları, bölge bilgileri ve emlak rehberi. Seydikemer'de doğru bilgiyle güvenli yatırım.",

  openGraph: {
    title: "Seydikemer Emlak",
    description:
      "Seydikemer mahalleleri, satılık emlak ilanları, bölge bilgileri ve emlak rehberi.",
    url: "https://seydikemeremlak.com.tr",
    siteName: "Seydikemer Emlak",
    locale: "tr_TR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Seydikemer Emlak",
    description:
      "Seydikemer mahalleleri, satılık emlak ilanları, bölge bilgileri ve emlak rehberi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}