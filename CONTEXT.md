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
- Status: reconciled hero subhead copy with footer/terminal wording (was still saying generic "open to relocation")
- Next: build content-editability system (md/csv content files + build-time HTML generation), per user request and prior cross-account discussion
- Blocked on: nothing

## Known gotchas
- No build step, no backend, no DB — pure static HTML/CSS/JS (about to change: build step being added for content assembly, see State)
- All text content lives in index.html directly, not in data files
- KPI numbers driven by data-num/data-prefix/data-suffix attrs, animated by script.js on scroll
- Deploy target is Render static site — publish dir is repo root, no build command yet (will need one once build step lands)
- "open_to" / location-preference copy exists in THREE places: script.js (terminal boot line), index.html hero subhead, index.html contact/status field. All three now read "open to roles in BLR, Pune, UAE & Europe" — keep in sync until content system removes this duplication
- .terminal is width:100% with no max-width cap at all now — always fills its container on every screen size, by design (previous versions capped it at 640px, which looked like unused space on wide desktop)
- #terminalBody uses white-space:pre-wrap — any HTML-source indentation/newlines left inside that div render as visible whitespace. typeLines() clears it via innerHTML="" before appending; if editing that markup, keep the clear or re-flatten the div to a single line
- .card has min-width:0 and .card__title has overflow-wrap:break-word — needed because CSS Grid's 1fr columns still size to the largest unbreakable content per column by default; long slash-suffixed project titles (enterprise_data_platform/) were forcing their column wider than the other two. Keep these rules if adding more project cards with long identifier-style titles.
- main max-width is 1200px (was 980px) — intentional widening for better desktop space usage, not a typo
- Sidebar/mobile nav are driven entirely by data-target attrs matched against section ids in script.js — adding a new section just needs a matching <li>/<a> pair in both .pipeline__nodes and .mobilebar, no JS changes needed
- Education is its own section (#education, "$ cat education.txt") between skills and contact, using the existing .field/.panel pattern (same as contact) — not a standalone .edu paragraph anymore
