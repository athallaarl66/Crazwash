// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crazwash - Cuci Sepatu & Tas di Bandung",
  description:
    "Jasa cuci sepatu dan tas profesional di Bandung Timur. Deep clean, leather care, suede care, dengan layanan pickup delivery gratis area tertentu.",
  keywords:
    "cuci sepatu bandung, cuci tas, deep clean sepatu, leather care, suede care, jasa cuci sepatu bandung timur",
  authors: [{ name: "Crazwash" }],
  openGraph: {
    title: "Crazwash - Cuci Sepatu & Tas di Bandung",
    description:
      "Bikin sepatu & tas kembali seperti baru. Deep clean profesional + pickup delivery terpercaya.",
    url: "https://crazwash.vercel.app",
    siteName: "Crazwash",
    images: [
      {
        url: "/images/crazwash.jpg", // ← BENARIN PATH (ada "s"-nya)
        width: 800,
        height: 600,
        alt: "Crazwash - Cuci Sepatu & Tas Bandung",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/crazwash.jpg", // ← BENARIN PATH
    apple: "/images/crazwash.jpg", // ← BENARIN PATH
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* ← TAMBAHIN INI buat favicon */}
        <link
          rel="icon"
          href="/images/crazwash.jpg"
          type="image/jpeg"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/images/crazwash.jpg" />
      </head>
      <body
        className={`${plusJakarta.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
