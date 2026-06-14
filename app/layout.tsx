import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_DEVELOPMENT_URL ||
  "https://hyperspeed-t2a.vercel.app";

const title = "HyperSpeed T2A - Prompt to App Builder";
const description =
  "Generate, preview, refine, and share full React apps from a prompt or screenshot.";
const ogimage = `${siteUrl.replace(/\/$/, "")}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: siteUrl,
    siteName: "HyperSpeed",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className="h-full">{children}</html>;
}
