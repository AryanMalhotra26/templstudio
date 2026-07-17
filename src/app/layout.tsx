import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Space_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import Providers from "@/components/layout/Providers";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/motion/CustomCursor";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.seo.siteUrl),
  title: {
    template: site.seo.titleTemplate,
    default: site.seo.defaultTitle,
  },
  description: site.seo.home.description,
  openGraph: {
    siteName: site.brand.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-body">
        <Providers>
          <div aria-hidden className="app-grain" />
          <CustomCursor />
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
