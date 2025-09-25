#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/home/sahon/Desktop/Hello Zombie"
REMOTE_URL="https://github.com/zombiecoder1/Hello-Zombie.git"

cd "$REPO_DIR"

if [ ! -d .git ]; then
  git init
  git remote add origin "$REMOTE_URL" || true
fi

git checkout -B windows
git add -A
git commit -m "Initial Windows setup" || true

git checkout -B linux
git add -A
git commit -m "Initial Linux setup" || true

echo "Windows branch HEAD: $(git rev-parse windows)"
echo "Linux branch HEAD:   $(git rev-parse linux)"
echo "To push:"
echo "  git push -u origin windows"
echo "  git push -u origin linux"


