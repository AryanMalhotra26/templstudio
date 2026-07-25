import type { Metadata, Viewport } from "next";
import {
  DM_Serif_Display,
  Fraunces,
  Instrument_Serif,
  Inter,
  Space_Grotesk,
} from "next/font/google";
import { site } from "@/content/site";
import Providers from "@/components/layout/Providers";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import MaskTextReveal from "@/components/motion/MaskTextReveal";
import "./globals.css";

/**
 * Instrument Serif stands in for PP Editorial New (headings) and Inter for
 * PP Neue Montreal (body) — both commercial faces on the reference site.
 * Drop the licensed files into /public/fonts and swap these two declarations
 * for `next/font/local` to match exactly; nothing else needs to change.
 */
const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

const neue = Inter({
  subsets: ["latin"],
  variable: "--font-neue",
  display: "swap",
});

/**
 * Wordmark only. The reference's mark is twelve individually-rendered 3D
 * letters in a wide display serif; DM Serif Display has the same generous
 * lowercase, so the chrome treatment fills the viewport the way theirs does
 * (Instrument Serif is too narrow to carry a full-width wordmark).
 */
const wordmark = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-wordmark",
  display: "swap",
});

/* Legacy faces — still referenced by /services, /work, /about, /contact. */
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
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
  themeColor: "#ecfdad",
};

/**
 * Runs before first paint so split-text copy is hidden until GSAP has
 * measured and masked its lines. Without JS the class is never added and
 * every heading stays visible.
 */
const SPLIT_BOOT = `document.documentElement.classList.add("split-ready")`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // The boot script below stamps `split-ready` onto <html> before React
      // hydrates, which is the whole point — so don't warn about it.
      suppressHydrationWarning
      className={`${editorial.variable} ${neue.variable} ${wordmark.variable} ${fraunces.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: SPLIT_BOOT }} />
        <Providers>
          <MaskTextReveal />
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
