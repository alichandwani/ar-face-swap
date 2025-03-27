#!/bin/bash

# This script helps publish the AR Face Swap application to GitHub

# Set to stop on errors
set -e

echo "========================================="
echo "  Publishing AR Face Swap to GitHub      "
echo "========================================="

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    echo "You might need to complete the Xcode Command Line Tools installation."
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Confirm username
read -p "Create repository at github.com/$GITHUB_USERNAME/ar-face-swap? (y/n): " CONFIRM
if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Initializing Git repository..."
git init

echo ""
echo "Adding files to Git..."
git add .

echo ""
echo "Creating initial commit..."
git commit -m "Initial commit of AR Face Swap application"

echo ""
echo "Adding GitHub repository as remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/ar-face-swap.git"

echo ""
echo "Pushing code to GitHub..."
git push -u origin main || git push -u origin master

echo ""
echo "========================================="
echo "  Publishing completed successfully!     "
echo "========================================="
echo ""
echo "Your code is now available at: https://github.com/$GITHUB_USERNAME/ar-face-swap"
echo ""
echo "IMPORTANT: Before running this script, make sure to:"
echo "1. Create a repository named 'ar-face-swap' on GitHub"
echo "2. Do not initialize it with README, .gitignore, or license"
echo ""
echo "If you haven't created the repository yet, go to:"
echo "https://github.com/new"
echo "" 