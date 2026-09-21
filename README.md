# Ian Wan — Portfolio Site

Static site for GitHub Pages (repo: `github.com/ZhiNuu/IanWanPortfolio`), built from the "Ian Wan Portfolio — Concept" Design canvas mockup. Plain HTML/CSS/JS, no build step.

Live URL once Pages is enabled: `https://zhinuu.github.io/IanWanPortfolio/`

## Structure

- `index.html` — Home
- `about.html` — About
- `projects.html` — Projects list; all four link to their detail pages
- `contact.html` — Contact
- `projects/project-01.html` … `project-04.html` — the four project detail pages
- `projects/gallery-01.html`, `gallery-03.html`, `gallery-04.html` — photo galleries.
  Project 02 has no gallery: the portfolio PDF carries a single bench photo for it,
  which sits on the detail page instead. Add `gallery-02.html` if more photos turn up.
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
`loading="lazy"`. Re-exporting a photo? Match or exceed the CSS render width.

**Nothing is cropped.** There is no `object-fit: cover` and no forced
`aspect-ratio` anywhere on the site. Every image — photograph, CAD view,
drawing, schematic, FEA plot, screenshot — is shown whole, centred on a cream
mat inside its frame with an 18px inset, and capped by height (440px, 540px for
a full-width item, 480px for a project cover) so rows stay even. A portrait
renders narrow inside its card rather than being trimmed to fill the column.
The single exception is the circular headshot frame, which trims about 8px from
a 650x642 source; that is the avatar shape, not a content crop.

**Colour.** Text pairs meet WCAG AA (4.5:1) and UI boundaries meet 1.4.11
(3:1). `--border` is the real edge colour; `--border-soft` is decorative only
(the oversized circles) and must not be used for anything that carries meaning.

## Interactive behavior (`assets/js/site.js`)

- **Loading spinner** — `#site-loader` covers the page until `DOMContentLoaded`,
  then fades out. Not `window.load`: that waits on every image, which gated
  first paint on 1.4 MB of gallery photos. A 4 s timeout and a `load` listener
  back it up, and `<noscript>` covers total script failure.
- **Gear cursor** — a gear replaces the native pointer and is repositioned
  from the latest pointer coordinates every animation frame, so a cursor is
  always on screen, including when the mouse is completely still. Ghost gears
  trail behind it and fade out in 420 ms. The gear grows from 26px to 36px over
  links and buttons, which is the affordance the native pointer-hand would
  otherwise give.

  `cursor: none` is applied by the script (`html.iw-gear-cursor`), never from
  the stylesheet, so a blocked script leaves the native pointer alone. It never
  starts on touch or coarse pointers, under `prefers-reduced-motion`, or under
  `forced-colors`, and it tears itself down if any of those change while the
  page is open or if a real touch happens on a hybrid laptop.
- **"Projects" nav dropdown** — a disclosure widget: a real `<button>` with
  `aria-expanded`/`aria-controls` toggling a panel of ordinary links. Closes on
  outside click, on Escape (returning focus to the trigger) and when focus
  leaves. `display: none` while closed, so the links stay out of the tab order.
- **Button / project-title glow** — pure CSS, see `.iw-btn:hover` and
  `.iw-project-title:hover`.

## Still to do

1. **Settle the image rights before publishing.** The Brighton wind tunnel photo
   on `gallery-01.html`, and the full-assembly oscillator images, are flagged in
   `Ian_Wan_Portfolio_Session_Record_9-19-26.pdf` under "Do not use" pending
   written permission and a patent-disclosure answer. Publishing is a public
   disclosure and cannot be undone.
2. **Project 02 photo coverage.** One bench photo exists. A wiring or block
   diagram drawn rather than photographed would suit it, and sidesteps the
   silkscreen problem the session record raises about board photos.
3. **A few sources are still small.** `gallery-01-cura.jpg` (550px) and
   `gallery-03-flexural.jpg` (546px) came out of the PDF at that size. Re-export
   from the originals if you have them.

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
