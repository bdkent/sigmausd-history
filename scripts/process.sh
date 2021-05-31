#!/bin/bash

echo RESET GIT CHECKOUT
cd ~/git/sigmausd-history
git fetch
git reset --hard origin/main

chmod +x ~/git/sigmausd-history/scripts/process.sh

echo CREATE DAILY DATA 
npx ts-node --project ~/git/sigmausd-history/tsconfig.node.json ~/git/sigmausd-history/src/process.ts ~/sigma/data/$(date +%y-%m-%d) > ~/git/sigmausd-history/public/data/daily/$(date +%Y-%m-%d).json

echo ADD NEW DATA
git add ~/git/sigmausd-history/public/data/daily/*.json

echo COMMIT NEW DATA
git commit -m "adding $(date +%y-%m-%d).json"

git push
