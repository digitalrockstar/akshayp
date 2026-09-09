# Changelog

Human-facing log of what shipped, newest first. For in-flight state and
next steps, see CONTEXT.md instead — this file only records completed work.

## 2026-09-09
- Reconciled hero subhead copy: was still generic "open to relocation", now matches footer/terminal wording exactly ("open to roles in BLR, Pune, UAE & Europe")
- Initial commit: terminal-themed portfolio site (html, css, js, resume PDF)
- Added CONTEXT.md, CHANGELOG.md, SKILL.md for cross-session continuity
- Replaced "open to relocation (Amsterdam / Europe)" with "open to roles in BLR, Pune, UAE & Europe" in site footer
- Added standing constraint: never include relocation info in CV PDF
- Updated terminal boot line in script.js to match footer: "roles in BLR, Pune, UAE & Europe"
- Fixed terminal box width: was hard-capped at 640px on all viewport sizes, causing a visible gap on tablet/landscape widths (~600-1080px). Now fills available width below 1080px.
- Audited KPI grid, projects grid, skills tree, and contact fields across breakpoints — no other layout issues found
- Fixed "$ whoami" rendering indented: HTML-source whitespace inside #terminalBody was preserved by white-space:pre-wrap and never cleared before the typing animation ran
- Removed terminal box's remaining 640px width cap entirely — it now always fills its container, including on wide desktop screens
- Widened main content column from 980px to 1200px max-width to reduce dead space on wide screens
- Fixed uneven project card column widths caused by long unbreakable titles (e.g. enterprise_data_platform/) forcing their CSS Grid column wider than the others
- Added a terminal-style SVG favicon (assets/favicon.svg), replacing the blank placeholder icon
- Promoted education from a faint trailing line in the skills section to its own full section with sidebar/mobile nav entries and normal panel styling
- Added GPA to education entries: Symbiosis 3.37, Nirma 8.01
- Added content-editability system: /content/*.md,*.csv files + build.js (vanilla Node, no deps) assemble index.html and script.js from marked regions; README/CONTEXT.md updated for the new `node build.js` build step
- Fixed role/title copy in browser tab (global.role → <title>); regenerated index.html after a content-only commit had missed the build step
- Fixed hero headline wrapping to ~2 words/line at every screen size: .hero__headline max-width was 16ch since the initial commit, widened to 26ch
