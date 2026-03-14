# OSIRIS — osiris-scorecard.com

Open Source Intelligence Reliability & Integrity Scorecard.

## Structure

```
├── index.html              Homepage
├── scorecards.html         Searchable scorecards directory
├── about.html              About page
├── methodology.html        Full methodology
├── CNAME                   Custom domain config (do not delete)
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── accounts.json       ← All account data lives here
└── scorecards/
    ├── template.html       Template (reference only)
    └── [account-id].html   One file per rated account
```

## Adding a new account

1. Add the account object to `data/accounts.json`
2. Create a new file in `scorecards/` named `[account-id].html` — copy `scorecards/template.html` as the base
3. Commit and push — GitHub Pages updates automatically within ~60 seconds

## Account JSON format

```json
{
  "id": "unique-slug",
  "handle": "@Handle",
  "platform": "X/Twitter",
  "displayName": "Display Name",
  "focus": "Ukraine conflict",
  "cis": "B+",
  "cisColor": "green",
  "factualityScore": 78,
  "positionTags": ["Pro-Ukraine"],
  "stanceSignal": "Editorial",
  "totalPosts": 42,
  "pendingPosts": 8,
  "lastUpdated": "2026-02-20",
  "summary": "Brief summary for the card.",
  "breakdown": {
    "accurate": 28,
    "mostlyAccurate": 7,
    "mixed": 4,
    "inaccurate": 2,
    "false": 1
  }
}
```

## Hosting

Hosted on GitHub Pages with custom domain `osiris-scorecard.com`.  
The `CNAME` file must remain in the root — do not delete it.
