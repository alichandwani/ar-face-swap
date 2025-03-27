# Installation Instructions for AR Face Swap

Follow these steps in your terminal to set up all necessary tools for a fully working AR Face Swap demo.

## Step 1: Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When prompted for a password, enter your macOS user password. The cursor won't move as you type (this is normal for security).

After installation, follow the instructions that Homebrew provides to add it to your PATH. It will look something like:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Step 2: Install Node.js and npm

```bash
brew install node
```

Verify the installation:

```bash
node -v
npm -v
```

## Step 3: Install the AR Face Swap demo dependencies

Navigate to your project directory:

```bash
cd "/Users/alichandwani/Desktop/cursor test projects/ar face swap app"
```

Create a new file called `package.json`:

```bash
touch package.json
```

In Cursor, edit `package.json` to include:

```json
{
  "name": "ar-face-swap",
  "version": "1.0.0",
  "description": "AR Face Swap application using face-api.js and TensorFlow.js",
  "main": "index.js",
  "scripts": {
    "start": "serve -s ."
  },
  "dependencies": {
    "face-api.js": "^0.22.2",
    "serve": "^14.2.0"
  }
}
```

Then install the dependencies:

```bash
npm install
```

## Step 4: Create a fully working demo with real face detection

Use Cursor to edit the `index.html` file to include face-api.js for real face detection.

## Step 5: Run the demo

```bash
npm start
```

The demo should now be running at http://localhost:5000 (or whatever port is displayed in your terminal).

---

## Alternative: Use CDN links (No Node.js required)

If you're still having issues with installing Node.js, you can edit your index.html to use CDN links directly:

In Cursor, edit the `index.html` file to include these script tags in the head section:

```html
<script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.18.0/dist/tf.min.js"></script>
```

Then modify the JavaScript in the file to use the real face-api.js for detection instead of the mock detection system.

Open the HTML file directly in your browser to test. 