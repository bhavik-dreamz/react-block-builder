#!/usr/bin/env bash
# Quick push helper for react-block-builder
# Usage:  ./.push.sh "commit message"   OR   ./.push.sh   (uses last commit msg)
set -euo pipefail
MSG="${1:-Initial import of apps/dev-app from builder-mono}"
git add -A
if git diff --cached --quiet; then
  echo "no changes to commit"
else
  git commit -m "$MSG"
fi
git push origin main
