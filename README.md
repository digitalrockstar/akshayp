# Akshay Patel — Portfolio

A single-page, terminal / data-pipeline themed portfolio site. Plain HTML, CSS and vanilla JS. No build step, no backend, no database.

## Structure

```
index.html   all page content and sections
style.css    design system (dark, monospace, amber/teal accents)
script.js    terminal boot animation, scroll-based nav highlighting, KPI count-up
assets/      downloadable resume PDF
```

## Run locally

Any static file server works, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy on Render (static site, free tier)

1. Push this folder to a new GitHub repository (see commands below).
2. In Render, click **New +** then **Static Site**.
3. Connect the GitHub repo.
4. Settings:
   - Build Command: leave blank (nothing to build)
   - Publish Directory: `.` (repo root)
5. Click **Create Static Site**. Render will give you a `.onrender.com` URL.
6. Optional: add a custom domain later from the site's Settings tab.

Every future `git push` to the main branch auto-redeploys.

## Push to GitHub

```
git init
git add .
git commit -m "portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Updating content later

All text lives directly in `index.html` (experience, projects, skills, contact).
KPI numbers in the Impact section are set via `data-num`, `data-prefix` and `data-suffix` attributes on `.kpi__num` elements, animated by `script.js` on scroll.
