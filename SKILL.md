---
name: repo-context
description: >
  Use this skill whenever working inside a git repository — before making
  any code changes, running commands, or answering questions about repo
  state. Ensures continuity across sessions/accounts/machines by treating
  CONTEXT.md as shared working memory. Trigger on any git repo task:
  "continue working on X", "what's the state of Y", "pick up where we
  left off", or any request to modify files in a repo that has a
  CONTEXT.md at its root.
---

# Repo Context Protocol

## Before starting any task in a git repo

1. Check the repo root for `CONTEXT.md`.
   - If it doesn't exist, create it from the template (ask the user once
     whether to initialize it, or just create a minimal one and mention it).
2. Read `CONTEXT.md` fully before responding to the task or touching any files.
3. Cross-check its "State" section against actual repo state
   (`git log -1`, `git status`, `git branch`) — the file may be stale.
   If it's stale, note the discrepancy to the user briefly, don't silently trust it.
4. Use the "Decisions log" and "Known gotchas" sections to avoid repeating
   past mistakes or re-litigating settled decisions.

## While working

- If you make a decision that would matter to a future session (a
  non-obvious tradeoff, a rejected approach, a constraint discovered
  mid-task), note it — don't wait until the end and try to reconstruct it.

## After every sub-task (not just at session end)

Treat each completed sub-task as a hand-off point — assume the next
person to touch this repo may be a different session, a different
account, or a different person on the team, with zero shared context
beyond what's in the repo. Do not batch this up for "end of session";
do it after each discrete unit of work so a hand-off is never more than
one sub-task stale.

1. Overwrite CONTEXT.md's "State" section — branch, last commit,
   one-line status, the single next action, anything blocking progress.
2. Append one line to CHANGELOG.md for the sub-task just completed —
   this is the human-facing "what shipped," different from CONTEXT.md's
   "what's in-flight." Keep it factual and short:
   `- Fixed token refresh race condition in auth/session.py`
   Don't restate CONTEXT.md's contents here — CHANGELOG.md is what
   happened, CONTEXT.md is what's next.
3. `git add -A && git commit` with a message describing the sub-task,
   then `git push` immediately. Don't leave completed work unpushed —
   an unpushed commit is invisible to anyone else picking this up.
4. If a push fails (auth expired, conflict, etc.), say so plainly and
   stop — don't silently continue working on more sub-tasks with
   unpushed state piling up behind an unresolved failure.

## Before ending the session

1. Confirm the last sub-task's CONTEXT.md/CHANGELOG.md/push cycle above
   actually completed — don't leave a partial cycle hanging.
2. If the file has grown past ~150 lines, move stale/resolved entries to
   `docs/context-archive/<YYYY-MM>.md` and keep CONTEXT.md lean.
3. Commit CONTEXT.md alongside the actual code change, not as a separate
   commit — keeps history clean and avoids drift.

## Standing constraints vs. in-flight state

CONTEXT.md's "Standing constraints" section (if present) holds durable
project rules — things that must hold true across every future session
regardless of what task is active (e.g. "never put X in file Y unless
explicitly told otherwise"). Unlike "State," this section is NOT pruned
or overwritten between sessions — only edited if the user explicitly
reverses a rule. Always check this section before doing any work, not
just "State" — a standing constraint can silently make an otherwise
reasonable-looking change wrong. If the user gives an instruction that
sounds like a durable rule rather than a one-off task ("never do X",
"always do Y going forward", "don't include Z until I say so"), add it
here rather than to personal/account memory — memory doesn't travel
across accounts or org members, and a repo-level rule needs to.

## Hard rules

- Push cadence is per sub-task, not per session. A "sub-task" is any
  independently-completable unit (one fixed bug, one endpoint added,
  one test suite passing) — if you'd describe it as "done, moving on
  to the next thing" in your own head, that's a push point.
- Never write secrets, tokens, or credentials into CONTEXT.md — it's
  committed to git and visible in history forever.
- Never treat CONTEXT.md as a changelog. If the user wants a human-facing
  changelog, that's CHANGELOG.md — a different document with different
  content (what shipped, not what's in-flight).
- Prefer overwriting over appending in "State" — a file that only grows
  stops being cheap to read, which defeats the purpose.

## Token-minimal writing rules (apply every time you touch CONTEXT.md)

The whole point of this file is that a new session reads it and spends
as few tokens as possible getting oriented. Every line either earns its
place or gets cut.

1. **Overwrite, don't narrate.** "State" is replaced wholesale each
   session. Never write "previously we did X, then Y, then Z" — just
   write the current fact. The git log already has the history; this
   file is not a second copy of it.
2. **One fact per line, no connective prose.** Write
   `Next: fix retry logic in worker.py` not "The next thing that needs
   to happen is that someone should go and fix the retry logic inside
   worker.py." Fragments are fine. Full sentences are not required
   anywhere in this file.
3. **No restating unchanged information.** If "Known gotchas" already
   covers something, don't repeat it in "State" or "Decisions log."
   Each fact lives in exactly one place.
4. **Diff-sized entries only.** A "Decisions log" or "Open questions"
   entry should be answerable in under 15 words. If it needs more than
   that, it belongs in a linked PR/issue, not in this file — write
   `see #142` instead of restating the reasoning.
5. **Prune on every edit, not just when the file gets long.** Before
   adding a new line, check whether an old line it makes obsolete can
   be deleted outright (not archived — deleted). Archiving is for
   material with future reference value; most resolved gotchas and
   answered questions have none and should just go.
6. **No status adjectives without a fact attached.** Don't write
   "things are going well" or "made good progress" — say what changed
   (`3 endpoints migrated, 2 remain`) or say nothing.
7. **Skip sections that are empty.** Don't write "Open questions: none"
   — just omit the heading for that session's edit. Empty scaffolding
   costs tokens on every future read for zero information.
