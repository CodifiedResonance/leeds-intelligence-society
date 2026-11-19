# Fact watch

Every Civic Paper is re-checked every week against its sources. This file is the procedure. The weekly scheduled task follows it, and anyone can run it by hand.

## What is watched

Each paper has a watch list at `src/papers/<subject>.watch.json`. Each claim records what the paper says, where it appears, the sources to check, what to look for, and a `mode`:

- `auto`: the fact is a status, date, stage, name or title, and the correction does not change the paper's argument or recommendation. Apply it and publish.
- `review`: a correction would change the model's figures, the recommendation or a decision sought. Prepare the change but do not publish it to `main`.

A new paper is not finished until it has a watch list. See `CLAUDE.md`.

## The weekly run

1. Clone the repo. Run `npm run build` to confirm it starts clean.
2. For each `src/papers/*.watch.json`, and each claim in it:
   - Search for current information. Prefer primary sources: gov.uk, bills.parliament.uk, legislation.gov.uk, Hansard, the regulator, the company's own publications, ONS. Use news reports only to find the primary source.
   - Decide: **unchanged**, **changed**, or **uncertain** (sources conflict or nothing reliable found).
3. **Unchanged:** nothing to edit for that claim.
4. **Changed, mode `auto`:** edit the paper template (`src/papers/<subject>.html`) and, if needed, the model's `SOURCES` (add the new source; do not renumber by deleting old ones unless they are no longer cited). Keep the paper's style: plain British English, short sentences, every new fact cited.
5. **Changed, mode `review`, or any change that alters a figure, the recommendation, a decision sought or the summary's argument:** make the change on a branch named `fact-watch/YYYY-MM-DD`, push the branch, and do not merge it. Describe it in the run report.
6. **Uncertain:** change nothing. Say what was found in the run report.
7. If anything changed on `main`:
   - Bump `VERSION` in the paper's model module by 0.0.1 (0.9 → 0.9.1).
   - Add a line at the top of the paper's version history, under the `fact-watch` comment: version, date, and one sentence per change with what changed and why.
8. In every run, set `CHECKED` in the model module to today's date (for example `26 November 2026`), even if nothing else changed. The paper's "Facts checked" date is a promise to readers.
9. Run `npm run build`. It must report that all figures match. Then run `npm run pdf`. If the PDF cannot be rebuilt, push nothing to `main`; put everything on the branch instead and say why.
10. Append an entry to `docs/fact-watch-log.md`: date, papers checked, each claim's result, and links to any sources used for changes.
11. Commit to `main` with a message starting `Fact watch YYYY-MM-DD:` and push. Commit the log, the `CHECKED` date and any `auto` changes together.

## Rules

- Never invent a fact or a source. If it cannot be verified from a source that can be cited, it does not go in.
- Never change the paper's recommendation, decisions sought or conclusions on `main`. Those are the author's to change.
- A deadline that has passed is a `review` change, even if the claim is marked `auto`.
- Keep facts about people and parties neutral: state what was said or done, with a source.
- If the build or check fails for a reason unrelated to the watch, stop and report it. Do not try to fix unrelated code.

## Run report

End each run with a short report, newest first:

- What changed on `main` (if anything), with the new version number.
- Any branch to review, with what it changes and why it needs the author.
- Anything uncertain.
- The next obvious date to watch (for example a bill's next stage or a consultation closing).
