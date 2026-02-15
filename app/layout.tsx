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
  title: "Crazwash - Cuci Sepatu & Tas  Bandung",
  description:
    "Jasa cuci sepatu dan tas profesional di Bandung Timur. Deep clean, leather care, suede care, dengan layanan pickup delivery gratis area tertentu.",
  keywords:
    "cuci sepatu bandung, cuci tas, deep clean sepatu, leather care, suede care, jasa cuci sepatu bandung timur",
  authors: [{ name: "Crazwash" }],
  openGraph: {
    title: "Crazwash - Cuci Sepatu & Tas  Bandung",
    description:
      "Bikin sepatu & tas kembali seperti baru. Deep clean profesional + pickup delivery terpercaya.",
    url: "https://crazwash.vercel.app",
    siteName: "Crazwash",
    images: [
      {
        url: "/image/crazwash.jpg",
        width: 800,
        height: 600,
        alt: "Crazwash - Cuci Sepatu & Tas Bandung",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/image/crazwash.jpg",
    apple: "/image/crazwash.jpg",
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
      <body
        className={`${plusJakarta.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
