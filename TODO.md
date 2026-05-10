# TODO — Mobile vertical journal mode

## Step 1 — Inspect and list targets

- [ ] Find all pages that contain `article.spread.stack` and flip JS (`prevBtn`, `nextBtn`, `go(delta)`, `transform: rotateY`).
- [ ] Confirm whether `assets/css/responsive.css` exists and is used.

## Step 2 — Implement shared mobile mode switch

- [ ] Add a consistent mobile breakpoint rule: `@media (max-width: 768px)`.
- [ ] On mobile, disable flip transforms and make spreads stack vertically.
- [ ] Ensure `overflow-x: hidden` and enable vertical scrolling.

## Step 3 — Mobile navigation changes

- [ ] On mobile, convert fixed nav buttons to scroll-to-section behavior (not page-flip).
- [ ] Make buttons thumb-friendly (>=48px touch target) and avoid covering content.

## Step 4 — Mobile cover scaling

- [ ] On mobile, scale the index/title covers proportionally (no overflow/cropping).

## Step 5 — Image behavior

- [x] Ensure images/videos are responsive on mobile without important cropping (prefer `object-fit: contain` where appropriate).

## Step 6 — Apply edits across all relevant pages

- [ ] Update: `index.html`, `prologue.html`, `toc.html`, `titlepage.html`, `dedicationpage.html`, `chapter1.html`…`chapter8.html`, `epilogue.html`.

## Step 7 — Testing

- [ ] Test mobile portrait at 360×640, 375×667, 414×896.
- [ ] Verify: no horizontal scroll, smooth scrolling, readable typography.
