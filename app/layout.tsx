import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const pageTitle = "Cinnaminson Interior Painting & Drywall Repair | AG Enterprises";
const pageDescription =
  "AG Enterprises Painting handles interior painting, drywall repair, skim coating, and wallpaper removal in Cinnaminson and nearby South Jersey. Small jobs welcome.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const rawHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3002";
  const host = rawHost.split(",")[0].trim();
  const rawProtocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const protocol = rawProtocol.split(",")[0].trim();
  const metadataBase = new URL(protocol + "://" + host);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: pageTitle,
    description: pageDescription,
    applicationName: "AG Enterprises Painting",
    keywords: [
      "interior painter Cinnaminson NJ",
      "drywall repair Cinnaminson",
      "Sheetrock repair South Jersey",
      "skim coating Cinnaminson",
      "wallpaper removal South Jersey",
      "small painting jobs Cinnaminson",
    ],
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    creator: "AG Enterprises Painting",
    publisher: "AG Enterprises Painting",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "AG Enterprises Painting",
      title: pageTitle,
      description: pageDescription,
      url: "/",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "AG Enterprises Painting — small repairs, serious prep, and fresh-room energy",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [socialImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
