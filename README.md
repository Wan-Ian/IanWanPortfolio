# Ian Wan — Portfolio Site

Static site for GitHub Pages (repo: `github.com/ZhiNuu/IanWanPortfolio`), built from the "Ian Wan Portfolio — Concept" Design canvas mockup. Plain HTML/CSS/JS, no build step.

Live URL once Pages is enabled: `https://zhinuu.github.io/IanWanPortfolio/`

## Structure

- `index.html` — Home
- `about.html` — About
- `projects.html` — Projects list (project 01 links to its own detail page; 02–04 are summary sections until their detail pages are built)
- `contact.html` — Contact
- `projects/project-01.html` — Oscillating-Wing Power Generator: Mechanism detail page
- `projects/gallery-01.html` — Photo gallery for project 01
- `404.html` — not-found page (self-contained; see note below)
- `assets/css/style.css` — shared styles
- `assets/js/site.js` — shared behavior
- `assets/img/` — headshot, project cover photo, gallery photos
- `assets/resume.pdf` — linked by the Download Resume buttons
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `.nojekyll`

## Conventions worth keeping

**Paths are relative, never absolute.** The site is served from a project
subpath (`/IanWanPortfolio/`), so a leading `/` would break every link. Pages
under `projects/` reach shared assets with `../`. The one deliberate exception
is `404.html`, which GitHub Pages serves for a missing URL at any depth: its
links and styles are absolute and inlined, because relative paths there would
resolve against the broken URL.

**GitHub Pages is case-sensitive.** Filenames are lowercase-and-hyphens
throughout; keep them that way even if your OS doesn't care.

**JavaScript is an enhancement, never a requirement.** Every page renders and
navigates with scripting off. The loading overlay is switched off by a
`<noscript>` rule in each page's `<head>` so a blocked script can't leave a
blank white page behind.

**Images.** Photographs are progressive JPEG sized to their render box; they are
not PNG. All `<img>` tags carry `alt`, `width`, `height` and (below the fold)
`loading="lazy"`. Re-exporting a photo? Match or exceed the CSS render width,
and keep the file under ~150 KB.

**Colour.** Text pairs meet WCAG AA (4.5:1) and UI boundaries meet 1.4.11
(3:1). `--border` is the real edge colour; `--border-soft` is decorative only
(the oversized circles) and must not be used for anything that carries meaning.

## Interactive behavior (`assets/js/site.js`)

- **Loading spinner** — `#site-loader` covers the page until `DOMContentLoaded`,
  then fades out. Not `window.load`: that waits on every image, which gated
  first paint on 1.4 MB of gallery photos. A 4 s timeout and a `load` listener
  back it up, and `<noscript>` covers total script failure.
- **Gear cursor trail** — decorative gears spawn behind the real cursor on
  pointer devices, throttled to one per 55 ms and removed after 320 ms. The
  native cursor is never hidden. Skipped entirely on touch and under
  `prefers-reduced-motion`.
- **"Projects" nav dropdown** — a disclosure widget: a real `<button>` with
  `aria-expanded`/`aria-controls` toggling a panel of ordinary links. Closes on
  outside click, on Escape (returning focus to the trigger) and when focus
  leaves. `display: none` while closed, so the links stay out of the tab order.
- **Button / project-title glow** — pure CSS, see `.iw-btn:hover` and
  `.iw-project-title:hover`.

## Still to do

1. **Project 02–04 detail pages.** Only project 01 has a detail page and
   gallery. Build `projects/project-02.html` … `project-04.html` and matching
   `gallery-0N.html` the same way project 01 is built, replace the "Detail page
   in progress." lines on `projects.html`, and repoint the nav dropdown's
   `#project-0N` anchors at the new pages. The cover photos for 02–04 were
   removed from `assets/img/` because nothing referenced them; re-add them with
   their pages.
2. **Re-export the gallery photos at higher resolution.** Several sources are
   smaller than the box they are rendered into (`gallery-01-coupler.jpg` is
   290 px wide, `gallery-01-sketch.jpg` 414 px), so they upscale and look soft
   on a large screen. Aim for roughly 1100 px wide from the originals.
3. **Settle the image rights before publishing.** The Brighton wind tunnel photo
   on `gallery-01.html`, and the full-assembly oscillator images, are flagged in
   `Ian_Wan_Portfolio_Session_Record_9-19-26.pdf` under "Do not use" pending
   written permission and a patent-disclosure answer. Publishing is a public
   disclosure and cannot be undone.

## Deploying to GitHub Pages

1. Copy every file in this folder into the cloned repo root, so `index.html`,
   `assets/` and `projects/` sit at the top level.
2. Commit and push:
   ```
   git add .
   git commit -m "Add portfolio site"
   git push origin main
   ```
3. On github.com: repo → **Settings** → **Pages** → **Build and deployment →
   Source** → **Deploy from a branch** → branch `main`, folder `/ (root)` →
   **Save**.
4. Open `https://zhinuu.github.io/IanWanPortfolio/` and click through Home →
   Projects → the Mechanism page → its gallery → About → Contact, then try
   Download Resume.

Pages redeploys on every push. No Actions workflow is needed.
