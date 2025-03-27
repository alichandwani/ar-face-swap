import { useState, useCallback, useEffect, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Face {
  id: string;
  landmarks: faceapi.FaceLandmarks68;
  box: Box;
  mesh: any;
}

export const useFaceDetection = () => {
  const [facesDetected, setFacesDetected] = useState<Face[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const detectionInterval = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const initFaceDetection = useCallback(async () => {
    try {
      // Load faceapi models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ]);
      
      setIsModelLoaded(true);
      console.log('Face detection models loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading face detection models:', error);
      return false;
    }
  }, []);
  
  const startFaceDetection = useCallback((video: HTMLVideoElement) => {
    if (!isModelLoaded) return;
    
    videoRef.current = video;
    
    const detectFaces = async () => {
      if (!videoRef.current) return;
      
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      });
      
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current, 
          options
        )
        .withFaceLandmarks()
        .withFaceExpressions();
        
        // Map detections to our Face interface with unique IDs
        const faces: Face[] = detections.map((detection, index) => {
          const existingFace = facesDetected.find(
            (face, idx) => idx === index && 
            Math.abs(face.box.x - detection.detection.box.x) < 20 &&
            Math.abs(face.box.y - detection.detection.box.y) < 20
          );
          
          return {
            id: existingFace?.id || `face-${Date.now()}-${index}`,
            landmarks: detection.landmarks,
            box: detection.detection.box,
            mesh: null // Will be populated by Three.js
          };
        });
        
        setFacesDetected(faces);
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };
    
    // Start detection loop
    detectFaces();
    detectionInterval.current = window.setInterval(detectFaces, 100); // 10 FPS detection rate
    
    return () => {
      if (detectionInterval.current) {
        window.clearInterval(detectionInterval.current);
      }
    };
  }, [isModelLoaded, facesDetected]);
  
  const stopFaceDetection = useCallback(() => {
    if (detectionInterval.current) {
      window.clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopFaceDetection();
    };
  }, [stopFaceDetection]);
  
  return {
    facesDetected,
    isModelLoaded,
    initFaceDetection,
    startFaceDetection,
    stopFaceDetection
  };
}; 