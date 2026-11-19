# Leeds Intelligence Society

The website for [leedsintelligencesociety.com](https://leedsintelligencesociety.com): a free, in-person society for people building with AI in Leeds.

Plain HTML, CSS and JavaScript. No framework, no build step, no database and no logins. The `public/` folder is the website.

```
public/
  index.html          Home: the founding chapter
  privacy/index.html  Privacy notice
  404.html            Not-found page
  assets/site.css     All styles
  assets/site.js      Form submission (Formspree) and the share button
  assets/leeds-at-dusk.webp  Hero artwork
  _headers            Security headers and caching (Cloudflare)
  robots.txt, sitemap.xml, favicon.svg
wrangler.jsonc        Cloudflare Workers static-assets config
```

## Forms

Both forms post to Formspree. The endpoints are the `action` attributes on the two `<form>` elements in `public/index.html`:

- `#form-join`: "Join the gathering" (consent to society updates is recorded with each submission)
- `#form-support`: "Offer support" (also handles privacy requests)

Formspree's `_gotcha` honeypot is included. Submissions are sent with `fetch`. Without JavaScript the forms still post directly to Formspree.

## Deploying on Cloudflare

Either option works with no build command:

- **Workers (recommended):** connect this repo in Workers & Pages → Create → Import a repository. Leave the build command empty. Cloudflare reads `wrangler.jsonc` and serves `./public`.
- **Pages:** build command *(none)*, output directory `public`.

Then add `leedsintelligencesociety.com` as a custom domain.

## Run locally

```
npx serve public
```

or open `public/index.html` directly (forms need a real server to post).

## Civic Papers

Each proposal is published as a Civic Paper: a paper at `/<subject>/` and an open model at `/<subject>/model/`, sharing the template in `public/assets/civic-paper.css`.

Civic Paper No. 01, *The Leeds Water Guarantee*:

```
src/papers/water.html            The paper's source, with {{cite:…}} and {{n:…}} tokens
public/assets/water/model.js     The model: inputs, sources, evidence register, calculations
public/assets/water/model-page.js  The interactive model page
public/water/index.html          Built paper (generated; do not edit by hand)
public/water/model/index.html    The model page
public/water/lis-civic-paper-01-water.pdf       Generated PDF
public/water/lis-civic-paper-01-evidence.csv    Generated evidence register
scripts/                         build, check and PDF scripts
```

After changing the paper or the model:

```
npm run build   # fills the template from the model, writes the CSV, then checks every figure
npm run pdf     # re-renders the PDF (needs Python Playwright and Chromium)
```

`{{n:a.total}}` inserts a figure from the model (scenario `a`, field `total`), so the paper cannot drift from the model. `{{cite:ea,un}}` inserts numbered references from the `SOURCES` list. The build fails if any token is unfilled or any source id is unknown.

The generated files are committed, so Cloudflare still deploys without a build step.

## Adding a page

Create `public/<name>/index.html`, link `/assets/site.css`, copy the `#rose` SVG symbol from the top of `index.html` for the wordmark, and add the URL to `sitemap.xml`.

## Artwork

The hero image is an original illustration of Leeds at dusk: the Town Hall, the Corn Exchange and Victorian brick above the River Aire, joined by threads of light. It is an artistic imagining, not a geographically exact view.
