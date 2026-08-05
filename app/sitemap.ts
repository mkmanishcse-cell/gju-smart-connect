import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gjusmartconnect.online";

  const routes = [
    "",
    "/contact",
    "/about",
    "/features",
    "/statistics",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // =============================
  // Future Dynamic Pages
  // =============================
  //
  // Example (Supabase):
  //
  // const { data: subjects } = await supabase
  //   .from("subjects")
  //   .select("id, updated_at");
  //
  // const subjectRoutes =
  //   subjects?.map((subject) => ({
  //     url: `${baseUrl}/subjects/${subject.id}`,
  //     lastModified: new Date(subject.updated_at),
  //     changeFrequency: "weekly",
  //     priority: 0.7,
  //   })) ?? [];
  //
  // return [...staticRoutes, ...subjectRoutes];

  return staticRoutes;
}