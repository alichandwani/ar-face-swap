# Face Detection and AR Models

This directory contains models required for face detection, face mesh generation, and AR face swapping functionality.

## Required Files

The application expects the following files to be placed in this directory:

- `face_detector.weights` - The face detection weights for @vladmandic/face-api
- `face_landmark_68.weights` - Face landmark detection weights
- `face_recognition.weights` - Face recognition model weights
- `face_tracker.data` - Banuba face tracking data
- `face_swap_model.bin` - Pre-trained face swapping model
- `emotion_recognition.data` - Facial expression recognition model

## Generating Models

For Face API models, they should be downloaded from the @vladmandic/face-api distribution. You can download them by running:

```bash
npx face-api-models
```

## Loading

The application will automatically load these models on startup. If any models are missing, appropriate error messages will be displayed. 