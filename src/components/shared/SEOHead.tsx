// Dynamic SEO Head component - updates document head per route
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMeta, FAQ_STRUCTURED_DATA, ORG_STRUCTURED_DATA } from "@/lib/seo-metadata";

export function SEOHead() {
  const location = useLocation();

  useEffect(() => {
    const meta = getPageMeta(location.pathname);

    // Title
    document.title = meta.title;

    // Meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", meta.description);
    if (meta.keywords) setMeta("keywords", meta.keywords);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = meta.canonical;

    // Open Graph
    setMeta("og:title", meta.title, true);
    setMeta("og:description", meta.description, true);
    setMeta("og:url", meta.canonical, true);
    setMeta("og:type", meta.ogType || "website", true);

    // Twitter
    setMeta("twitter:title", meta.title);
    setMeta("twitter:description", meta.description);

    // Structured Data
    const existingSD = document.getElementById("dynamic-structured-data");
    if (existingSD) existingSD.remove();

    const schemas: Record<string, any>[] = [];
    if (meta.structuredData) schemas.push(meta.structuredData);
    if (location.pathname === "/") {
      schemas.push(FAQ_STRUCTURED_DATA);
      schemas.push(ORG_STRUCTURED_DATA);
    }

    if (schemas.length > 0) {
      const script = document.createElement("script");
      script.id = "dynamic-structured-data";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }
  }, [location.pathname]);

  return null;
}
