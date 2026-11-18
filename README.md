# Political Science Data Finder

A searchable guide to datasets for undergraduate research in political science, compiled by Matthew Fails (Oakland University). Students can search by concept or variable (e.g. *turnout*, *civil war*, *corruption*) and filter by topic, by unit of analysis ("What is one row?"), and by how the data are accessed.

- **Live site:** https://matthewfails.github.io/polisci-data/
- **Repository:** https://github.com/matthewfails/polisci-data
- **Local copy:** `~/data-finder/` in WSL (Windows path: `\\wsl.localhost\Ubuntu\home\mdf\data-finder`)
- **Sources:** 159 (as of 2026-11-18)
- **Linked from:** the Teaching page of [matthewfails.github.io/matthewfails-site](https://matthewfails.github.io/matthewfails-site/teaching/)

## Where things are

| Path | What it is |
|---|---|
| `site/data/sources.yaml` | **Every data source**, one block each. The file you edit to add, change, or remove sources. |
| `site/data/topics.yaml` | Tabs, topics, "What is one row?" options, and access types |
| `site/content/start-here.md` | The "Start Here" page (how to find a dataset) |
| `site/content/_index.md` | Intro text above the search box |
| `site/hugo.yaml` | Site settings, including the "links last checked" date in the footer |
| `site/layouts/`, `site/assets/` | Page templates, styles, and the search/filter script |
| `scripts/check_links.py` | Checks every link for dead pages or redirects to other websites |
| `UPDATING.md` | **Step-by-step guide to updating the site** |
| `REVIEW.md` | Changes made when converting the original "Data Sources" document (Oct 2026) |
| `CLAUDE.md` | Notes for Claude Code sessions working on this project |

## How it works

- Built with [Hugo](https://gohugo.io/) (no theme or other dependencies) and published to GitHub Pages.
- **Every commit to `main` updates the live site** in about a minute, including edits made directly on github.com. If `sources.yaml` has a typo, the update stops with an error naming the entry, and the live site stays as it was.
- **Monthly link check:** on the 1st of each month, a GitHub Action checks every link and emails the owner if any are dead or now redirect to a different website. It can't tell when a landing page still loads but the dataset behind it is gone, so occasional manual review is still worthwhile.

## Preview locally

```bash
cd ~/data-finder/site
hugo server      # then open http://localhost:1313/polisci-data/
```

## Change log

| Date | Change |
|---|---|
| 2026-10-27 | Site launched with 160 sources converted from the "Data Sources" document (link fixes and removals listed in `REVIEW.md`). Linked from the Teaching page of the academic site. |
| 2026-10-27 | Removed Database of Databases (landing page loads, but the database itself is gone). 159 sources. |
| 2026-10-28 | Cooperative Election Study (CES) now links to its new home at Tufts Tisch College. |
| 2026-11-18 | CSES entry gained a link to the new CSES Data Playground (explore the data and download country aggregates in the browser); also tagged as country-level and beginner-friendly. |
