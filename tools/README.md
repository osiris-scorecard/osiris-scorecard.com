# OSIRIS Tools

## Export Converter

Converts Chrome extension exports to the accounts.json format.

### Usage

```bash
node convert-export.js <export-file.json>
```

### Example

```bash
node convert-export.js osiris_@bellingcat_scorecard.json
```

### Adding Manual Data

Edit the `manualData` object in `convert-export.js` to add display names and summaries:

```javascript
const manualData = {
  '@bellingcat': {
    displayName: 'Bellingcat',
    summary: 'Open-source investigative journalism collective. Highly reliable fact-checking and media verification.'
  },
  '@account2': {
    displayName: 'Account 2 Name',
    summary: 'Brief description of account...'
  }
};
```

### What Gets Converted

**From Extension Export:**
- `account_handle` → `handle`
- `cis_grade` → `cis`
- `factuality_score` (0-10) → `factualityScore` (0-100)
- `pst_tags` → `positionTags`
- `posts_reviewed_count` → `totalPosts`
- `posts_pending_count` → `pendingPosts`
- `last_reviewed` → `lastUpdated` (formatted as "14 Mar 2026")
- `content_flags` → `contentFlags`
- `hard_visibility_flags` → `hardFlags`

**Auto-Generated:**
- `id` (from handle, e.g., "@bellingcat" → "bellingcat")

**Manual (from manualData):**
- `displayName` (fallback to handle if not provided)
- `summary` (optional, leave blank if not provided)
