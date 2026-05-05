# Netlify Deploy

## Goal
Configure Netlify to build and deploy the Next.js App Router site correctly on every push to main.

## Scope In
- `netlify.toml` with correct build command and publish directory for Next.js
- Netlify Runtime / `@netlify/plugin-nextjs` for full App Router SSR support
- Environment variables configured in Netlify dashboard (not in committed files)
- Custom domain `noahwright.dev` connected to Netlify site
- Force HTTPS
- PDF content-disposition header for resume download

## Scope Out
- Branch deploy previews (configure after first main deploy)
- Edge functions or API routes (not used at launch)
- CDN cache tuning (post-launch)

## Dependencies
- foundation-setup.todo.md ✅

## Tasks
- [ ] Install `@netlify/plugin-nextjs` as a dev dependency: `npm install -D @netlify/plugin-nextjs`
- [ ] Update `netlify.toml` to use Next.js runtime plugin (see below)
- [ ] Create Netlify site via Netlify dashboard or CLI, linked to this repo
- [ ] Set `NODE_VERSION = "20"` in Netlify build environment
- [ ] Add `NEXT_PUBLIC_CLARITY_ID` environment variable once Clarity project is created
- [ ] Connect `noahwright.dev` custom domain in Netlify DNS settings
- [ ] Enable HTTPS (Netlify auto-provisions Let's Encrypt)
- [ ] Add PDF header rule to `netlify.toml` for `/*.pdf` files
- [ ] Trigger first deploy — confirm build passes and site is reachable

## netlify.toml target state
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*.pdf"
  [headers.values]
    Content-Disposition = "attachment"
```

## Verification
- Netlify build log shows 0 errors
- Live domain `https://noahwright.dev` returns the home page
- HTTPS cert is active (padlock in browser)
- Resume PDF download works on live domain

## Done When
Site is live at `https://noahwright.dev` and all pages and assets are reachable.
