# CONTEXT.md — read before doing anything else

> Purpose: give any fresh session (any machine, any login) the minimum
> tokens needed to resume work correctly. This is NOT a changelog for
> humans — that's CHANGELOG.md. This is working memory for whoever
> (or whatever) picks up the repo next.
>
> Rules for editing this file (token-minimal by design):
> 1. "State" section is OVERWRITTEN each session, never appended to.
>    Write current facts only — the git log is the history, not this file.
> 2. "Decisions" and "Gotchas" are append-only, but DELETE entries once
>    resolved or irrelevant — don't just let them accumulate.
> 3. One fact per line. Fragments, not sentences. No connective prose,
>    no restating what's already true elsewhere in the file.
> 4. Every entry should be readable in under 15 words. If it needs more,
>    link to the PR/issue (`see #142`) instead of explaining inline.
> 5. Omit empty sections entirely rather than writing "none."
> 6. Keep total file under ~150 lines. Archive (don't just leave) old
>    material to docs/context-archive/YYYY-MM.md past that.
> 7. Never put secrets, tokens, or credentials in this file — it's
>    committed to git history and readable by anyone with repo access.

## Standing constraints (never prune — only remove if explicitly reversed)
- Do NOT include relocation preference/location info in the CV PDF (assets/Akshay_Patel_Resume.pdf), ever, unless explicitly told otherwise in a future task.

## State (as of 2026-09-09)
- Branch: master
- Last commit: pending push, this session
- Status: terminal box was hard-capped at 640px with no responsive override, causing visible gap on tablet/landscape widths (~600-1080px). Fixed: now fills available width below 1080px, still caps at 640px on wide desktop.
- Next: no open work — awaiting next task
- Blocked on: nothing

## Known gotchas
- No build step, no backend, no DB — pure static HTML/CSS/JS
- All text content lives in index.html directly, not in data files
- KPI numbers driven by data-num/data-prefix/data-suffix attrs, animated by script.js on scroll
- Deploy target is Render static site — publish dir is repo root, no build command
- "open_to" / location-preference copy exists in TWO places: script.js (terminal boot line, ~line 14) and index.html (contact/status field, ~line 274). Update both together.
- index.html line ~64 hero subhead also says "open to relocation" generically (no location named) — not yet reconciled with the BLR/Pune/UAE/Europe wording used elsewhere; flag to user if this should change too
- .terminal has width:100% + max-width:640px, overridden to max-width:100% below 1080px (was previously hard-capped at 640px on all widths — caused visible gap on tablet/landscape viewports)
