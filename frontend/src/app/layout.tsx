import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ruchi Sinha | Full Stack Developer & UI/UX Enthusiast",
  description: "Explore the portfolio of Ruchi Sinha, a Full Stack Developer specializing in building scalable web applications with high-end aesthetics and robust security.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "Portfolio", "Web Development"],
  authors: [{ name: "Ruchi Sinha" }],
  openGraph: {
    title: "Ruchi Sinha | Full Stack Developer Portfolio",
    description: "Building digital experiences with purpose and precision.",
    url: "https://your-portfolio-url.com",
    siteName: "Ruchi Sinha Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ruchi Sinha Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruchi Sinha | Full Stack Developer",
    description: "Building digital experiences with purpose and precision.",
    images: ["/og-image.png"],
  },
};

import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/30 dark:selection:text-blue-200`}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md shadow-lg"
        >
          Skip to content
        </a>
        <Providers>
          <main id="main-content">
            {children}
          </main>
          <Toaster position="bottom-right" theme="system" closeButton richColors />
        </Providers>
      </body>
    </html>
  );
}
