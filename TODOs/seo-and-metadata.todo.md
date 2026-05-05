# SEO and Metadata

## Goal
Ensure every page has correct, unique metadata and the site is discoverable by search engines with a clean sitemap and robots.txt.

## Scope In
- Unique `<title>` and `<meta name="description">` on every page (already in layout/page files)
- Root layout `metadata.metadataBase` pointing to `https://noahwright.dev`
- `robots.txt` — allow all crawlers, link to sitemap
- `sitemap.xml` — list all 5 launch routes with `<lastmod>`
- Open Graph `og:title`, `og:description`, `og:url` defaults in root layout
- Optional: `og:image` if a suitable image is available

## Scope Out
- Canonical tags for old blog post URLs (excluded — clean break policy)
- Structured data / JSON-LD (post-launch)
- Twitter card metadata (post-launch)

## Dependencies
- routing-and-ia.todo.md

## Tasks
- [ ] Confirm `metadataBase` in root layout is `https://noahwright.dev`
- [ ] Add `robots.ts` (Next.js App Router metadata API) or static `public/robots.txt`
- [ ] Add `sitemap.ts` (Next.js App Router metadata API) listing all 5 routes
- [ ] Verify each page returns a unique `<title>` in view-source
- [ ] Verify each page returns a unique `<meta name="description">` in view-source
- [ ] Check OG tags are present in view-source on home page
- [ ] (Optional) Add `og:image` if a headshot or brand image is available

## Verification
- `https://noahwright.dev/sitemap.xml` returns valid XML with 5 routes after deploy
- `https://noahwright.dev/robots.txt` returns allow-all + sitemap reference
- Google Search Console "URL Inspection" shows page is indexable after launch

## Done When
Robots, sitemap, and per-page metadata are confirmed correct in production.
