import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import '../styles/ARFaceSwap.css';
import { useFaceMesh } from '../hooks/useFaceMesh';
import { useSwapEngine } from '../hooks/useSwapEngine';
import { useBanubaFaceAR } from '../hooks/useBanubaFaceAR';

interface Face {
  id: string;
  landmarks: any;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  mesh: any;
}

interface ARFaceSwapProps {
  facesDetected: Face[];
  selectedFace: string | null;
}

const ARFaceSwap: React.FC<ARFaceSwapProps> = ({ facesDetected, selectedFace }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const { createFaceMesh, updateFaceMesh } = useFaceMesh();
  const { swapFaces, setTargetFace } = useSwapEngine();
  const { startAR, loadEffect } = useBanubaFaceAR();
  
  // Initialize camera and canvas
  useEffect(() => {
    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStream(stream);
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setErrorMessage('Could not access webcam. Please check permissions and try again.');
      }
    };
    
    initWebcam();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Initialize Banuba AR when video and canvas are ready
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !stream) return;
    
    // Start AR processing
    const cleanup = startAR(videoRef.current, canvasRef.current);
    
    // Load default face swap effect
    loadEffect('face_swap');
    
    return cleanup;
  }, [stream, startAR, loadEffect]);
  
  // Set up Three.js scene for AR rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      facesDetected.forEach(face => {
        // Update 3D face mesh with detected landmarks
        updateFaceMesh(face, scene);
        
        // Apply face swapping if a face is selected
        if (selectedFace && selectedFace !== face.id) {
          const targetFace = facesDetected.find(f => f.id === selectedFace);
          if (targetFace) {
            setTargetFace(targetFace);
            if (videoRef.current) {
              swapFaces(face, targetFace, videoRef.current);
            }
          }
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up Three.js resources
      renderer.dispose();
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          } else if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          }
        }
      });
    };
  }, [facesDetected, selectedFace, updateFaceMesh, swapFaces, setTargetFace]);
  
  // Create 3D meshes for detected faces
  useEffect(() => {
    facesDetected.forEach(face => {
      createFaceMesh(face);
    });
  }, [facesDetected, createFaceMesh]);
  
  if (errorMessage) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{errorMessage}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="ar-container">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="webcam-video"
      />
      <canvas ref={canvasRef} className="ar-canvas" />
      <div className="faces-detected">
        <span>Faces Detected: {facesDetected.length}</span>
        {selectedFace && <span>Target Face: #{selectedFace.substring(0, 4)}</span>}
      </div>
    </div>
  );
};

export default ARFaceSwap; 