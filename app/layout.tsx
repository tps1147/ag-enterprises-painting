import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import {
  INSTAGRAM_URL,
  IS_INDEXABLE,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  SITE_NAME,
  SITE_URL,
} from "./site-config";
import "./globals.css";

const metadataBase = new URL(SITE_URL);
const socialImage = new URL("/og-v3.jpg", metadataBase).toString();
const primaryImage = new URL("/work/exterior-column.jpg", metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "Home services",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL + "/" },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "128x128" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: SITE_URL + "/",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "AG Enterprises Painting — local painting and wall repair in Cinnaminson, New Jersey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [socialImage],
  },
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffbf4",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL + "/",
      name: SITE_NAME,
      alternateName: "AG Enterprises",
      inLanguage: "en-US",
      publisher: { "@id": SITE_URL + "/#business" },
    },
    {
      "@type": "WebPage",
      "@id": SITE_URL + "/#webpage",
      url: SITE_URL + "/",
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: { "@id": SITE_URL + "/#website" },
      about: { "@id": SITE_URL + "/#business" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": SITE_URL + "/#primaryimage",
        url: primaryImage,
        contentUrl: primaryImage,
        caption: "Freshly painted porch column by AG Enterprises Painting",
      },
    },
    {
      "@type": "HousePainter",
      "@id": SITE_URL + "/#business",
      name: SITE_NAME,
      url: SITE_URL + "/",
      description: PAGE_DESCRIPTION,
      logo: new URL("/favicon.png", metadataBase).toString(),
      image: [
        primaryImage,
        new URL("/work/kitchen-reset-v3.webp", metadataBase).toString(),
        new URL("/work/blue-wall-finish.webp", metadataBase).toString(),
      ],
      sameAs: [INSTAGRAM_URL],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cinnaminson",
        addressRegion: "NJ",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Cinnaminson, New Jersey" },
        { "@type": "AdministrativeArea", name: "South Jersey" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Painting and wall-repair services",
        itemListElement: [
          "Interior painting",
          "Drywall and Sheetrock repair",
          "Skim coating",
          "Wallpaper removal",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-US">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
