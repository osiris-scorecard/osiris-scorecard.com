OSIRIS Exports Folder
======================

📥 Drag your Chrome extension exports here!

Files should be named: osiris_@handle_scorecard.json

Then run from the tools folder:
  node batch-import.js

This will convert all exports and update data/accounts.json

After importing, push to GitHub:
  update-and-push.bat  (or .sh for Git Bash)

---

Note: Export files in this folder are ignored by git and won't be committed.
