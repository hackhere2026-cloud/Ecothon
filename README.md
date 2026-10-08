# Doddabetta Hacks

A cinematic, interactive hackathon event website set in Ooty. Doddabetta is the event's creative identity and location reference, with the enhanced real photograph as the backdrop.

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import `hackhere2026-cloud/OOTY`.
2. Use the repository root as the Root Directory (leave it unchanged).
3. Click **Deploy**.

The included `vercel.json` selects the **Other** framework preset, skips dependency installation, validates the site with `node verify.mjs`, and publishes only `dist/`. No environment variables or API keys are required.

If configuring the project manually:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Repository root |
| Install Command | Empty / skipped |
| Build Command | `node verify.mjs` |
| Output Directory | `dist` |

Official reference: [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Run locally

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. This is plain HTML, CSS, and JavaScript; there are no package dependencies or compilation steps.

## Features

- Enhanced real Doddabetta photograph with scroll-driven motion.
- Cinematic loading intro with skip, replay, and reduced-motion support.
- Four interactive challenge tracks and three event-phase previews.
- Downloadable team build brief.
- Registration draft saved only on the current device, with download and clear controls.
- Responsive navigation, native dialogs, FAQs, and optional browser WebMCP tools.

## Event status

The working name is **Doddabetta Hacks**. Dates, exact venue, duration, eligibility, prizes, mentors, sponsors, and official registration are still to be announced. Tracks and event phases are proposed themes, labeled as previews.

**The registration form does not submit an application, send email, or reserve a place.** It is a local draft preview. Add an official registration destination or backend before accepting real applications.

## Files

- `dist/index.html`: event content and accessible controls.
- `dist/hackathon.css`, `dist/hackathon-details.css`: visual design and responsive styling.
- `dist/hackathon.js`: event interactions and local drafts.
- `dist/opening.js`, `dist/opening.css`, `dist/opening-motion.css`: loading intro.
- `dist/assets/real-doddabetta.webp`: enhanced real photograph.
- `REAL-PHOTO-ENHANCEMENT.md`: image enhancement provenance.
- `verify.mjs`: source, asset, navigation, and JavaScript syntax checks.
- `vercel.json`: deployment configuration.

Google Fonts is optional; system fonts are used if it is unavailable.

## Verify

```sh
node verify.mjs
```
