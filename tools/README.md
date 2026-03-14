# OSIRIS Tools

## Batch Import (Recommended)

The easiest way to import multiple accounts at once.

### Quick Start

1. **Add manual data** (displayName and summary) to `manual-data.json`:
   ```json
   {
     "@bellingcat": {
       "displayName": "Bellingcat",
       "summary": "Open-source investigative journalism collective. Highly reliable fact-checking and media verification."
     },
     "@account2": {
       "displayName": "Account Name",
       "summary": "Brief description..."
     }
   }
   ```

2. **Drop your export files** into `tools/exports/` folder

3. **Run the batch import**:
   ```bash
   cd tools
   node batch-import.js
   ```

That's it! All accounts will be added/updated in `data/accounts.json`.

4. **Push to GitHub**:
   ```bash
   update-and-push.bat
   ```
   Or in Git Bash: `./update-and-push.sh`

---

## Single Account Import

For importing one account at a time.

### Usage

```bash
node convert-export.js <export-file.json>
```

### Example

```bash
node convert-export.js osiris_@bellingcat_scorecard.json
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
