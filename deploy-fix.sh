#!/bin/bash

# Set environment variables for production
export NEXT_PUBLIC_SITE_URL="https://after-dark-website.vercel.app"

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Update deployment configuration and fix navigation URLs for production"

# Push to main branch
git push origin main

echo "Deployment script completed. Your site will be available at: https://after-dark-website.vercel.app" 