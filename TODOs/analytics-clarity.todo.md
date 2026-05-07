# Analytics — Microsoft Clarity

## Goal
Integrate Microsoft Clarity session recording and heatmaps via a Next.js Script component, gated behind an environment variable so it only loads in production.

## Scope In
- Clarity project created in clarity.microsoft.com (manual step)
- Clarity tracking ID stored in environment variable `NEXT_PUBLIC_CLARITY_ID`
- Clarity script loaded via `next/script` with `strategy="afterInteractive"` in root layout
- Script only injected when `NEXT_PUBLIC_CLARITY_ID` is set (no-op in dev)
- Environment variable added to Netlify site settings

## Scope Out
- A/B testing via Clarity
- Cookie consent banner (evaluate separately post-launch)

## Dependencies
- foundation-setup.todo.md ✅
- netlify-deploy.todo.md

## Tasks
- [ ] Create Clarity project at clarity.microsoft.com — obtain tracking ID
- [ ] Add `NEXT_PUBLIC_CLARITY_ID` to `.env.local` (local dev, not committed)
- [x] Add `.env.local` to `.gitignore` if not already present
- [x] Add Clarity Script component to `src/app/layout.tsx` (conditional on env var)
- [ ] Add `NEXT_PUBLIC_CLARITY_ID` to Netlify environment variables via Netlify dashboard
- [ ] Deploy to Netlify and verify Clarity shows incoming sessions

## Verification
- In production, DevTools Network shows `clarity.ms` script loaded
- Clarity dashboard shows at least one session within 24 hours of launch
- In dev (no env var set), no Clarity script is injected

## Done When
Clarity is collecting sessions in production and does not load in dev or during SSR.
