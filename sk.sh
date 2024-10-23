#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    echo -e "${BLUE}[DEPLOY]:${NC} $1"
}

# Check if repository exists
if [ ! -d .git ]; then
    print_message "${RED}Error: Not a git repository. Please run this script from the root of your git repository.${NC}"
    exit 1
fi

# Ensure all changes are committed
if [[ -n $(git status -s) ]]; then
    print_message "${RED}You have uncommitted changes. Please commit them first.${NC}"
    git status
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_message "Installing dependencies..."
    npm install
fi

# Update vite.config.ts if it doesn't exist
if [ ! -f "vite.config.ts" ]; then
    print_message "Creating vite.config.ts..."
    cat > vite.config.ts << EOL
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    }
})
EOL
fi

# Build the project
print_message "Building the project..."
npm run build

# Create or update .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_message "Creating .gitignore..."
    echo "node_modules/
dist/
.env
.DS_Store" > .gitignore
fi

# Create or update deploy script in package.json if needed
if ! grep -q "\"deploy\":" package.json; then
    print_message "Adding deploy script to package.json..."
    # Use temporary file to maintain JSON formatting
    jq '.scripts.deploy = "gh-pages -d dist"' package.json > temp.json && mv temp.json package.json
fi

# Install gh-pages if not already installed
if ! npm list gh-pages >/dev/null 2>&1; then
    print_message "Installing gh-pages package..."
    npm install --save-dev gh-pages
fi

# Create dist directory if it doesn't exist
mkdir -p dist

# Deploy to GitHub Pages
print_message "Deploying to GitHub Pages..."
npm run deploy

print_message "${GREEN}Deployment complete! Your site should be live in a few minutes.${NC}"
print_message "Don't forget to check your GitHub repository settings to ensure GitHub Pages is enabled and set to deploy from the gh-pages branch."

# Provide next steps
print_message "Next steps:"
print_message "1. Go to your repository settings on GitHub"
print_message "2. Navigate to Pages settings"
print_message "3. Ensure the source is set to 'Deploy from a branch'"
print_message "4. Select 'gh-pages' branch and '/ (root)' folder"
print_message "5. Click Save"
print_message "\nYour site will be available at: https://ytliteplus.github.io"