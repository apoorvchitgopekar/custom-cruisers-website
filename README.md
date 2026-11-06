# Custom Cruisers East Africa Ltd — Website

A single-page, responsive landing and service website. Plain HTML, CSS and
vanilla JavaScript — no build step, ready for GitHub Pages.

## Structure

```
custom-cruisers-website/
├── index.html            # The whole site (all sections)
├── README.md
└── assets/
    ├── css/style.css     # Design tokens + all styling
    ├── js/main.js        # Nav, counters, reveals, form validation
    └── img/logo.jpg      # Brand logo
```

All paths are relative (`./assets/...`), so the site works at
`https://<username>.github.io/<repo-name>/` without any changes.

## Replacing brand assets

| What | Where | Notes |
|------|-------|-------|
| Logo | `assets/img/logo.jpg` | Drop in an SVG/PNG and update the two `<img class="brand-logo">` tags in `index.html` (header + footer). A transparent-background PNG/SVG looks best. |
| Hero photo | `assets/css/style.css` → `.hero-media` | Replace the CSS pattern with `background: url("../img/hero.jpg") center/cover;` (keep the `::after` overlay for text contrast). |
| Workshop photo | `index.html` → `#workshop` section | Swap the `.media-placeholder` block for a real `<img>` (1200×900 recommended). |
| Contact details | `index.html` → `#contact` section + footer | Phone, email and addresses are placeholders — search for `+254 700 000 000` and `customcruisers.example`. |
| Social links | `index.html` footer | Point the three `href="#"` links at your real profiles. |
| Brand colors | `assets/css/style.css` → `:root` | `--primary` (blue) and `--accent-red` were sampled from the logo. |
| Stats | `index.html` → `.stats-bar` | Edit the `data-count` numbers and labels. |

## Making the contact form live

The form currently validates input but stores nothing. To receive submissions:

1. Create a free form endpoint at [Formspree](https://formspree.io) (or Getform,
   Basin, Web3Forms — all work on static sites).
2. In `assets/js/main.js`, find the `DEMO ONLY` comment inside the submit
   handler and replace the status-message lines with the `fetch()` call shown
   there, using your endpoint URL.

## Deploying to GitHub Pages

### 1. Create the repository

On [github.com/new](https://github.com/new), create a repository, e.g.
`custom-cruisers-website` (public, no README — this folder already has one).

### 2. Push this folder

From inside this folder:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<username>/custom-cruisers-website.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. On GitHub, open the repository → **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Choose branch `main`, folder `/ (root)`, and click **Save**.
4. Wait a minute or two, then visit
   `https://<username>.github.io/custom-cruisers-website/`.

### 4. Updating the site

Edit the files, then:

```bash
git add .
git commit -m "Update content"
git push
```

Pages redeploys automatically within a couple of minutes.

## Accessibility notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`), labelled form fields,
  visible focus rings, `aria-live` validation messages, and star ratings with
  text alternatives.
- All motion (counters, reveals, smooth scroll) is disabled when the visitor
  has `prefers-reduced-motion` set.
- Color contrast meets WCAG AA on the dark palette.
