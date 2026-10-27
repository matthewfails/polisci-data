# CLAUDE.md: data-finder

Live at https://matthewfails.github.io/polisci-data/ (repo matthewfails/polisci-data, published 2026-10-27; linked from the academic site Teaching page). Searchable guide to political science datasets for undergraduates, built from Matthew Fails's "Data Sources" PDF (Oct 2026). Standalone Hugo site (no theme, no npm) deployed to GitHub Pages; visual style copied from the academic site (`~/matthewfails-site`).

## Layout
- `site/data/sources.yaml`: all entries (single source of truth; owner edits this on github.com)
- `site/data/topics.yaml`: tab groups → topics, units ("What is one row?", with `short` labels for cards), access types
- `site/layouts/index.html`: finder page. Validates sources.yaml and calls `errorf` on unknown topic/unit/access or a missing required field, so typos fail the build and don't silently drop entries
- `site/assets/js/finder.js`: client-side filtering; state in the URL hash (`#q=…&topic=…&units=…&access=…&easy=1&tab=…`) so filtered views are linkable
- `site/content/start-here.md`: rewritten "How to find a data set" section from the PDF
- `scripts/check_links.py`: DEAD / MOVED (cross-domain redirect, which catches hijacked domains) / BLOCKED. Monthly Action `.github/workflows/check-links.yml`
- `UPDATING.md`: owner guide. `REVIEW.md`: changes made vs. the original PDF

## Workflow
1. `git pull` first (owner edits on github.com).
2. Build: `cd site && hugo --gc --minify -d /tmp/df/polisci-data`, then serve `/tmp/df` and open `/polisci-data/`.
3. Show the owner before pushing; push to `main` deploys.

## Facts worth keeping
- congressionalbills.org was hijacked by a gambling site (2026); the data now lives on the Syracuse Policy Agendas Project page. Never link the old domain.
- CIA World Factbook was discontinued in Feb 2026; the entry is kept as "archived."
- dynamicdemocracy.org is parked; use Warshaw's data page. politicalleaders.org is parked; PLAD is at plad.uni-goettingen.de.
- Subscription items (CQ, Polling the Nations, Vital Statistics, HSUS, Roper iPoll, PRS/ICRG, IISS) point to OU's A–Z list (oakland.libguides.com/az/databases). Which of them OU actually licenses is unverified.
- Headless screenshots: the Playwright Chromium in WSL lacks libnss3; use Windows Chrome headless (`/mnt/c/Program Files/Google/Chrome/Application/chrome.exe`) with a Windows `--screenshot` path. Headless Chrome has a ~500px minimum window, so test phone width via a 390px iframe wrapper page.
