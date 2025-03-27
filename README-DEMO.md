# AR Face Swap Demo

This is a simplified demonstration version of the AR Face Swap application that doesn't require Node.js or any other dependencies to run. It showcases the user interface and basic functionality using mock face detection.

## Running the Demo

To run the demo, simply open the `index.html` file in your web browser:

1. Double-click on the `index.html` file in your file explorer
2. Allow camera access when prompted
3. The application will simulate loading the required components and then start
4. Move your face around to see how the demo detects and visualizes faces

## Features Demonstrated

- User interface layout with control panel and tabs
- Mock face detection with random positioning
- Simulated face swapping when multiple faces are detected
- Performance metrics (FPS counter)
- Face mesh visualization

## Testing the Demo

1. **Camera Access**: When the demo loads, it will request access to your camera. Allow this to see your camera feed in the background.

2. **Loading Process**: The demo will simulate the loading of various components with a progress bar.

3. **Face Detection**: Once loaded, the application will show random rectangles representing detected faces. Each face will have landmark points displayed.

4. **Face Swapping**: When multiple faces are detected, the demo will simulate face swapping by highlighting one face in red and drawing an arrow to another face.

5. **Control Panel**: Explore the control panel at the bottom of the screen:
   - Toggle it open/closed using the arrow button
   - Switch between tabs (Faces, Settings, Effects)
   - Try adjusting the settings (they don't affect the actual demo but show the UI)

## Note About This Demo

This standalone demo uses simulated face detection and doesn't include the actual face detection or AR face swapping capabilities of the full application. It's designed to give you a visual representation of how the interface works without requiring any dependencies.

The full application would require:
- Node.js and npm
- TensorFlow.js for machine learning
- Three.js for 3D rendering
- Face API for face detection
- Banuba SDK for AR features

## Next Steps

To implement the full application with actual face detection and swapping capabilities, follow the instructions in the main README.md and SETUP_GUIDE.md files. 