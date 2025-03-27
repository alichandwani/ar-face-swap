# Setup Guide for AR Face Swap Application

Follow these steps to run the application and publish it to GitHub.

## 1. Set Up Development Environment

### Install Xcode Command Line Tools

```bash
xcode-select --install
```

Follow the prompts to install the Xcode Command Line Tools.

### Install Node.js and npm

1. Download Node.js from [https://nodejs.org/](https://nodejs.org/) (LTS version recommended)
2. Run the installer and follow the installation instructions
3. Verify installation:
   ```bash
   node -v
   npm -v
   ```

## 2. Run the Application

Once Node.js is installed, you can run the application:

```bash
# Navigate to your project directory
cd /Users/alichandwani/Desktop/cursor\ test\ projects/ar\ face\ swap\ app

# Run the installation script
./install.sh

# If the script worked correctly, start the application
npm start
```

The application should open in your default browser at http://localhost:3000

## 3. Test the Application

1. When prompted, allow camera access
2. Wait for all modules to load (Face Detection, Banuba AR, Face Swap Engine)
3. Position one or more faces in the camera view
4. Use the control panel at the bottom of the screen:
   - Select a target face in the "Faces" tab
   - Adjust swap settings in the "Settings" tab
   - Try different effects in the "Effects" tab
5. Verify that the face swap is working as expected

## 4. Publish to GitHub

### Create a GitHub Account (if you don't have one)

Sign up at [https://github.com/](https://github.com/)

### Install Git

Git should be available after installing Xcode Command Line Tools, but if not:

1. Download Git from [https://git-scm.com/download/mac](https://git-scm.com/download/mac)
2. Install Git following the instructions
3. Verify installation:
   ```bash
   git --version
   ```

### Create a New Repository on GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Enter a repository name (e.g., "ar-face-swap")
3. Optionally add a description
4. Keep it public or make it private as preferred
5. Do not initialize with README, .gitignore, or license
6. Click "Create repository"

### Push Your Code to GitHub

```bash
# Navigate to your project directory
cd /Users/alichandwani/Desktop/cursor\ test\ projects/ar\ face\ swap\ app

# Initialize a Git repository
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial commit of AR Face Swap application"

# Add your GitHub repository as the remote origin
git remote add origin https://github.com/YOUR_USERNAME/ar-face-swap.git

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 5. Share Your Application

Now that your code is on GitHub, you can:

1. Share the repository URL with others
2. Deploy the application to a hosting service like GitHub Pages, Netlify, or Vercel
3. Continue developing and pushing updates to GitHub

## Troubleshooting

If you encounter any issues:

- Check the browser console for errors (F12 or Cmd+Option+I in most browsers)
- Ensure your camera is working correctly
- Verify that all dependencies are installed properly
- Make sure your browser supports WebGL (required for Three.js and TensorFlow.js) 