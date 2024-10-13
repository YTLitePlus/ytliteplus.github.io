#!/bin/bash

# Variables (Replace with your GitHub username and email)
GITHUB_USER="YTLitePlus"
REPO_NAME="ytliteplus.github.io"

# Create a new local git repository
git init

# Add all files to the git repository
git add .

# Commit changes
git commit -m "Initial commit for Vite project"

# Create a new repository on GitHub using gh CLI
gh repo create $REPO_NAME --public --source=. --remote=origin --push

# Add vite.config.ts file for proper GitHub Pages setup
cat <<EOT > vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/$REPO_NAME/', // base URL for GitHub Pages
  build: {
    outDir: 'dist'
  }
})
EOT

# Commit the vite.config.ts
git add vite.config.ts
git commit -m "Added Vite config for GitHub Pages"

# Push the updated files
git push origin main

# Install dependencies and build the project (using npm)
npm install
npm run build

# Create and push the `gh-pages` branch
git checkout -b gh-pages
git add -f dist
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages

# Return to main branch
git checkout main

# Set up GitHub Pages to use the `gh-pages` branch
gh repo edit --add-topic github-pages
gh pages set-up --branch=gh-pages --dist=dist

# Success message
echo "Vite project has been created, pushed to GitHub, and deployed to GitHub Pages!"