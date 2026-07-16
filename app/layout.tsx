import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { DialKitRoot } from "@/components/grid/DialKitRoot";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Satvik Shreesha",
  description:
    "Product designer building AI and developer-facing experiences. Incoming @ Databricks. HCDE @ UW Seattle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
        <DialKitRoot />
      </body>
    </html>
  );
}
