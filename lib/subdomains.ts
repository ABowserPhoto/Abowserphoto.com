/**
 * Niche hosts stay on their own hostname. `proxy.ts` rewrites them to a
 * localized path on this app instead of redirecting the browser onto a
 * `/de/...` or `/en/...` folder of the main site.
 *
 * `studio.` has no category route of its own, so it serves the localized
 * homepage. The others serve one category landing page.
 */
export const NICHE_HOSTS = [
  { prefix: "immo.", basePath: "/real-estate" },
  { prefix: "food.", basePath: "/food" },
  { prefix: "wedding.", basePath: "/wedding" },
  { prefix: "studio.", basePath: "/" },
] as const;

export type NicheHost = (typeof NICHE_HOSTS)[number];

export function nicheHostForHostname(hostname: string): NicheHost | null {
  const host = hostname.toLowerCase().split(":")[0] ?? "";
  return NICHE_HOSTS.find((entry) => host.startsWith(entry.prefix)) ?? null;
}
