# Resume PDF

Place the resume PDF here as:

```
public/noah-wright-resume-2026.pdf
```

The filename must match `SITE.resumeUrl` in `src/lib/site.ts` (currently `/noah-wright-resume-2026.pdf`).

The file is served at `/noah-wright-resume-2026.pdf` and downloaded via the
"Download Resume" button on the home and about pages.

The Netlify `Content-Disposition: attachment` header rule in `netlify.toml` ensures
it downloads rather than rendering in-browser.
