# Updating the Data Finder

Everything students see comes from two files:

| File | What it holds |
|---|---|
| `site/data/sources.yaml` | Every data source, one block each. **This is the file you'll edit.** |
| `site/data/topics.yaml` | The tabs, topics, "What is one row?" options, and access types. |

The "Start Here" page is `site/content/start-here.md`. The intro text above the search box is `site/content/_index.md`.

## Easiest way: edit on github.com

1. Go to the repository on GitHub and open `site/data/sources.yaml`.
2. Click the pencil icon (Edit).
3. Make your change (see below).
4. Click **Commit changes…**, then **Commit changes** again.
5. The site updates in about a minute. Watch progress on the **Actions** tab. A green check means it's live.

If the Actions run turns **red**, the live site is unchanged. Open the failed run and its "Build" step. The error names the problem, for example `"ANES" uses unknown topic "us-electons"`. Fix the typo and commit again.

## Add a source

Copy this block, paste it anywhere in `sources.yaml` (the site sorts alphabetically), and fill it in:

```yaml
- name: Full Name of the Dataset
  abbr: ABBR
  url: https://example.org/data
  description: "One or two plain-language sentences on what it measures."
  topics: [regimes]
  units: [countries]
  access: free
  coverage: "Worldwide, 1990–present"
  keywords: [democracy, elections, whatever students might type]
```

- **topics**: one or more slugs from `topics.yaml` (e.g. `us-elections`, `regimes`, `conflict`, `migration`).
- **units** ("What is one row?"): `people`, `countries`, `states`, `events`, `elections`, `officials`, `policies`, `portal`.
- **access**: `free`, `registration`, `library`, or `browse`.
- **keywords** are what make search work. List the concepts and variables a student might type, even if they aren't in the description. Add `beginner friendly` to include the source under the "Beginner-friendly only" filter.
- Optional extras: `links:` (more buttons) and `note:` (small italic tip). See existing entries for examples.

Rules of thumb:
- Indent with **spaces**, never tabs, and line fields up under `name`.
- Put text containing a colon (`:`) in "double quotes".

## Remove or change a source

Delete or edit its block, from `- name:` down to the line before the next `- name:`.

## Add a topic

Add a line to the right group in `topics.yaml`, e.g. `- { slug: religion, label: "Religion & politics" }`. Then use `religion` in sources' `topics:` lists.

## Broken links

On the 1st of every month, GitHub checks every link and **emails you if any are dead or now redirect to a different website**. Open the run on the Actions tab to see which links. Links listed as BLOCKED are sites that refuse automated checkers; they're almost always fine.

To run the check yourself: Actions tab → "Monthly link check" → **Run workflow**. Or locally: `python3 scripts/check_links.py`.

After a review, update `last_reviewed` in `site/hugo.yaml` so the footer date stays honest.

## Preview locally (optional)

```bash
cd ~/data-finder/site
hugo server        # then open http://localhost:1313/polisci-data/
```
