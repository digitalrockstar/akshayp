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
- Last commit: fixed About section paragraph width (was wrapping ~500px short of panel's right edge on wide/landscape screens) — pushed
- Status: two separate width-cap bugs found and fixed today — hero__headline (16ch, fixed font-size-relative) and .panel p (68ch, fixed ch-width vs a much wider panel box). Worth a broader pass checking other fixed-width/ch caps against actual rendered container widths if more "text doesn't fill its box" reports come in
- Next: nothing queued
- Blocked on: nothing

## Known gotchas
- Generic p{max-width:68ch} is still in effect site-wide except inside .panel (overridden to max-width:none there) — if a new <p> is added somewhere with a much wider container than 68ch (~580px), check whether it needs the same panel-style override
- The missed-build-step issue has recurred twice (global.md role change, terminal.md text change) — both times content/ was edited+pushed without running `node build.js` first, so the deployed site didn't reflect the edit until a follow-up rebuild+push. Get Render's Build Command set to `node build.js` to make this self-healing (still unverified from this sandbox) — until then, always run `node build.js` locally before every commit that touches content/
- global.role (content/global.md) currently only feeds the <title> tag — no visible on-page text uses it; if visible role text should also change, that's in content/hero.md and/or global.meta_description, not global.role
- Content lives in /content/*.md,*.csv; index.html/script.js have <!--BUILD:x-->/<!--/BUILD:x--> (or /* BUILD:x */) regions that are overwritten by `node build.js` — never hand-edit text inside those regions, edit /content/ and rebuild instead
- global.md's `open_to` is the single source for the open-to-roles copy, referenced via {{global.open_to}} from hero.md/terminal.md — terminal line auto-lowercases it, no more manual 3-way sync needed
- CSV field values are NOT trimmed by build.js (intentional — e.g. highlights.csv suffix " Cr" needs its leading space); don't "clean up" apparent whitespace in the CSV files
- KPI numbers driven by data-num/data-prefix/data-suffix attrs (now generated from highlights.csv), animated by script.js on scroll
- .terminal is width:100% with no max-width cap at all now — always fills its container on every screen size, by design (previous versions capped it at 640px, which looked like unused space on wide desktop)
- #terminalBody uses white-space:pre-wrap — any HTML-source indentation/newlines left inside that div render as visible whitespace. typeLines() clears it via innerHTML="" before appending; if editing that markup, keep the clear or re-flatten the div to a single line
- .card has min-width:0 and .card__title has overflow-wrap:break-word — needed because CSS Grid's 1fr columns still size to the largest unbreakable content per column by default; long slash-suffixed project titles (enterprise_data_platform/) were forcing their column wider than the other two. Keep these rules if adding more project cards with long identifier-style titles.
- main max-width is 1200px (was 980px) — intentional widening for better desktop space usage, not a typo
- Sidebar/mobile nav are driven entirely by data-target attrs matched against section ids in script.js — adding a new section just needs a matching <li>/<a> pair in both .pipeline__nodes and .mobilebar, no JS changes needed
- Education is its own section (#education, "$ cat education.txt") between skills and contact, using the existing .field/.panel pattern (same as contact) — not a standalone .edu paragraph anymore
