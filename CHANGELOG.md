# Changelog

Human-facing log of what shipped, newest first. For in-flight state and
next steps, see CONTEXT.md instead — this file only records completed work.

## 2026-09-09
- Initial commit: terminal-themed portfolio site (html, css, js, resume PDF)
- Added CONTEXT.md, CHANGELOG.md, SKILL.md for cross-session continuity
- Replaced "open to relocation (Amsterdam / Europe)" with "open to roles in BLR, Pune, UAE & Europe" in site footer
- Added standing constraint: never include relocation info in CV PDF
- Updated terminal boot line in script.js to match footer: "roles in BLR, Pune, UAE & Europe"
- Fixed terminal box width: was hard-capped at 640px on all viewport sizes, causing a visible gap on tablet/landscape widths (~600-1080px). Now fills available width below 1080px.
- Audited KPI grid, projects grid, skills tree, and contact fields across breakpoints — no other layout issues found
- Fixed "$ whoami" rendering indented: HTML-source whitespace inside #terminalBody was preserved by white-space:pre-wrap and never cleared before the typing animation ran
