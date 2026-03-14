#!/bin/bash
# OSIRIS Update and Push
# Run this after importing new scorecards

cd "$(dirname "$0")/.."

echo "📊 Checking for changes in accounts.json..."

if git diff --quiet data/accounts.json; then
  echo "No changes detected in accounts.json"
  exit 0
fi

echo ""
echo "Changes detected! Summary:"
git diff --stat data/accounts.json

echo ""
echo "📝 Committing changes..."
git add data/accounts.json

# Get list of updated/new accounts from the diff
ACCOUNTS=$(git diff --cached data/accounts.json | grep '"handle":' | sed 's/.*"handle": "\(.*\)".*/\1/' | tr '\n' ' ')

git commit -m "$(cat <<EOF
Update scorecards: $ACCOUNTS

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

echo ""
echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "✅ Done! Scorecards updated on GitHub"
