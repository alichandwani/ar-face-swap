# AR Face Swap App

A real-time augmented reality application that detects faces using face-api.js and demonstrates face mesh visualization with simulated face swapping capabilities.

## Features

- Real-time face detection using face-api.js
- Facial landmark visualization
- Simulated face swapping between detected faces
- Interactive control panel with settings
- Performance metrics display (FPS, face count)

## Demo Version

This repository contains a standalone demo version of the AR Face Swap application that runs directly in your browser without requiring any installation or build process.

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam access
- Browser support for WebGL and MediaDevices API

## Quick Start

1. Clone this repository or download the files
2. Open `index.html` directly in your browser
3. Allow camera access when prompted
4. Position your face in the view to see detection in action
5. If multiple faces are detected, select one to enable face swapping

## How It Works

The application uses:
- face-api.js for face detection and landmark recognition
- HTML Canvas for visualization and overlay effects
- CSS for responsive UI design

## Usage Instructions

1. **Face Detection**: Position your face in front of the camera
2. **Face Selection**: Click on a detected face in the control panel to select it
3. **Face Swapping**: When multiple faces are detected and one is selected, a simulated face swap effect will be shown
4. **Settings**: Adjust intensity, expression preservation, and other settings in the control panel

## Controls

- **Faces Tab**: View and select detected faces
- **Settings Tab**: Adjust face swap parameters
- **Effects Tab**: Choose different visual effects (face swap is the default)
- **Control Panel Toggle**: Collapse or expand the control panel with the arrow button

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari 14+
- Edge

## Privacy Note

This demo runs entirely client-side and does not transmit any camera data over the internet. All processing happens locally in your browser.

## Future Improvements

- Enhanced face swapping algorithm
- More realistic blending and color matching
- Additional AR effects and filters
- Video recording functionality
- Mobile optimization

## License

MIT

## Acknowledgements

- [Banuba](https://www.banuba.com/) for Face AR technology
- [TensorFlow.js](https://www.tensorflow.org/js) for machine learning capabilities
- [Three.js](https://threejs.org/) for 3D rendering
- [Face API](https://github.com/vladmandic/face-api) for facial detection and landmarks 