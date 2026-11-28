import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/sign-in/",
          "/sign-up/",
          "/forgot-password/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/sign-in/",
          "/sign-up/",
          "/forgot-password/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
