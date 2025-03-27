#!/bin/bash

# AR Face Swap installation script

echo "========================================="
echo "  AR Face Swap Application Installation  "
echo "========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or later."
    echo "Visit https://nodejs.org/ to download and install Node.js"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 14 ]; then
    echo "Node.js version is too old. Please upgrade to v14 or later."
    echo "Current version: $NODE_VERSION"
    exit 1
fi

echo "Node.js version $NODE_VERSION detected."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm."
    exit 1
fi

echo "Installing dependencies..."
npm install

# Create models directory if it doesn't exist
mkdir -p public/models

# Fetch face-api.js models
echo "Downloading face detection models..."
npx face-api-models
# Move models to the correct directory
if [ -d "node_modules/@vladmandic/face-api/model" ]; then
    cp -r node_modules/@vladmandic/face-api/model/* public/models/
    echo "Face detection models installed successfully."
else
    echo "Warning: Face detection models not found. The application may not work correctly."
fi

# Create Banuba mock models
echo "Creating mock Banuba AR models..."
touch public/models/face_tracker.data
touch public/models/face_swap_model.bin
touch public/models/emotion_recognition.data
echo "Mock models created."

# Update Banuba API key
echo "Configuring Banuba API key..."
BANUBA_TOKEN="Qk5CILg4rQ/5pSbj+Eu+QvaGC5c7QhbR8OPr6A3W695OtWDJ+S/uGzQ/GCf3cJdPOAzA8OsVQMH2AITpHk8ZL8YWTz7zXc+ewweTZtIoaXS3SbTq4IPp4FpXOtYax713V2UM99tS7M0EL4dV+FjcXNe7iAZJn+robJqsQ7eAybPaYyCGfPHjVK/r22BRnIW2veoMExJCRjb749WLrgyD4Ff2sS/rAEF5D6mMqb9z45m6L9PxEjJtYMfFRdmYoWrlKbOYpUdkSFLMWA6n/nfOEAklTwRL6oXOfgfiq6M49tZ0u0fPyBZlu8h2Vaxn1rdXNFSHA6u2LjMOqK8NHhbfJEKHg6kwuaKO5OXPN9/I+sFpJIBIaGTlKDpqQ7PM32Gm9S4l2dSV+w/wKLUkG6eschZUcy5KyMIbN01dh5E74vExyjSI8UYwwJ1lm5xYk2xpRCn8bjuy4r1YcXNrAJ9BqD5Q+Hm/KCk/qZ72WGwoXqH//0rLsffdupRA7glsqWCcdUkfSwR8gAS4sDIFGJeQ2sCgDl9M8mmFK7wR97Zb40jWJmtd3wgEbvrY8uDOO/1z3Ja0bPnGV1ObZ/2nQ/wk13ELohMJlTmMvKOPnsj6Gh8bPjJ73s40kXlMknm1Sivw+1vOJw48gkAAhxpq8+pU+5s="

# Verify everything is set up correctly
echo "Verifying installation..."
if [ -f "package.json" ] && [ -d "node_modules" ] && [ -d "public/models" ]; then
    echo "Installation successful!"
    echo ""
    echo "To start the application, run: npm start"
    echo ""
else
    echo "Installation may have issues. Please check the logs above."
fi 