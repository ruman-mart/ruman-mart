import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rumanmart.com"),
  title: {
    default: "Ruman Mart | Quality Products at Great Prices",
    template: "%s | Ruman Mart",
  },
  description: "Shop quality electronics, homeware, kitchen accessories, perfumes and watches at great prices from Ruman Mart.",
  applicationName: "Ruman Mart",
  keywords: ["online shopping Pakistan", "electronics Pakistan", "homeware", "kitchen accessories", "perfumes", "watches"],
  authors: [{ name: "Ruman Mart" }],
  creator: "Ruman Mart",
  icons: {
    icon: [{ url: "/logo-web.png", type: "image/png" }],
    shortcut: ["/logo-web.png"],
    apple: [{ url: "/logo-web.png", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "/",
    siteName: "Ruman Mart",
    title: "Ruman Mart | Quality Products at Great Prices",
    description: "Discover quality products, exclusive deals and reliable delivery across Pakistan.",
    images: [{ url: "/hero.png", width: 1200, height: 630, alt: "Ruman Mart online store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruman Mart | Quality Products at Great Prices",
    description: "Shop quality products and exclusive deals from Ruman Mart.",
    images: ["/hero.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
