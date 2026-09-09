# Akshay Patel — Portfolio

A single-page, terminal / data-pipeline themed portfolio site. Plain HTML, CSS and vanilla JS, no backend, no database. Content lives in `/content/*.md` and `*.csv` files and is assembled into `index.html`/`script.js` by a small Node build script — no framework, no npm dependencies.

## Structure

```
content/     editable site content (md/csv) — edit these, not index.html directly
build.js     assembles content/* into index.html and script.js (node build.js)
index.html   page structure; text inside <!--BUILD:x--> markers is generated, don't hand-edit it
style.css    design system (dark, monospace, amber/teal accents)
script.js    terminal boot animation, scroll-based nav highlighting, KPI count-up
assets/      downloadable resume PDF
```

## Run locally

```
node build.js
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy on Render (static site, free tier)

1. Push this folder to a new GitHub repository (see commands below).
2. In Render, click **New +** then **Static Site**.
3. Connect the GitHub repo.
4. Settings:
   - Build Command: `node build.js`
   - Publish Directory: `.` (repo root)
5. Click **Create Static Site**. Render will give you a `.onrender.com` URL.
6. Optional: add a custom domain later from the site's Settings tab.

Every future `git push` to the main branch auto-redeploys (Render re-runs `node build.js` before publishing).

## Push to GitHub

```
git init
git add .
git commit -m "portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Updating content

Edit the files in `content/`, then run `node build.js` and commit both the content change and the regenerated `index.html`/`script.js`.

```
content/global.md       shared values (name, email, phone, location, open_to, status, ...)
content/hero.md         hero headline + subhead
content/terminal.md     terminal boot animation lines
content/about.md        about section lede/body/tag pills
content/highlights.csv  KPI grid — prefix,num,suffix,label
content/experience.md   work history — one ## <years> block per job
content/projects.csv    project cards — title,desc,impact,tags (tags pipe-separated)
content/skills.csv      skills tree rows, in display order — name,desc
content/education.csv   education entries — years,degree
```

`global.md` values like `open_to` are referenced with `{{global.open_to}}` from other content files (see `hero.md`, `terminal.md`) — edit it once there and it updates everywhere it's used, including the lowercase terminal-styled variant.

KPI numbers in the Impact section are set via `data-num`, `data-prefix` and `data-suffix` attributes on `.kpi__num` elements (generated from `highlights.csv`), animated by `script.js` on scroll.
