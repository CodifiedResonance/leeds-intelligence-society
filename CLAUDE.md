# Leeds Intelligence Society: working in this repo

leedsintelligencesociety.com. A static site: `public/` is the website, deployed by Cloudflare from `main` with no build step. Read `README.md` for the layout.

## Rules for every change

- No logins, databases or third-party scripts. Forms post to Formspree. `public/_headers` sets a strict Content Security Policy: no inline `<script>` code and no `style=""` attributes. Use the stylesheets and external scripts.
- The author's name is **Andrew Thomas** in every paper, citation, notice and piece of metadata.
- British English. Plain, direct sentences. No invented facts: every factual claim in a Civic Paper is cited.
- Generated files are committed (`public/water/index.html`, the PDF, the CSV). Never edit them by hand. Edit the source and run the build.

## Civic Papers

A Civic Paper is a proposal for the city, published as:

1. `src/papers/<subject>.html`: the paper's source, built into `public/<subject>/index.html`. It uses the shared template `public/assets/civic-paper.css` and the same structure as No. 01: cover with status, version, date, author and "Facts checked"; tools row (PDF, print, cite, evidence CSV, model); summary; decisions sought, each addressed to the body that can take it; numbered sections; annexes for method, evidence register and sources; colophon with interests, status, licence and version history.
2. `public/assets/<subject>/model.js`: the model, with inputs, `SOURCES`, `REGISTER`, `VERSION` and `CHECKED`. Every figure in the paper comes from it through `{{n:…}}` tokens.
3. `public/<subject>/model/`: the interactive model page.
4. Contact links: the decisions box, the cite box, the colophon and the top bar each link to `/contact/?paper=<subject>`. Add the paper to the "Regarding" list in `public/contact/index.html` with `data-paper="<subject>"`.
5. `src/papers/<subject>.watch.json`: **required.** The time-sensitive claims in the paper, for the weekly fact watch. A paper without a watch list is not finished.
6. Build, check and PDF scripts in `scripts/`, run with `npm run build` and `npm run pdf`.

## Fact watch

Facts are re-checked every week by a scheduled task. The procedure is `docs/fact-watch.md`; the history is `docs/fact-watch-log.md`. Status facts are corrected automatically. Changes that would alter figures, the recommendation or a decision sought go to a `fact-watch/` branch for the author to review.
