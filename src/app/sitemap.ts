import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.seo.siteUrl;
  const staticRoutes = ["", "/services", "/work", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    })
  );
  const workRoutes = site.work.map((item) => ({
    url: `${base}/work/${item.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...workRoutes];
}
