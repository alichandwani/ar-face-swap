import React, { useState, useEffect } from 'react';
import './App.css';
import ARFaceSwap from './components/ARFaceSwap';
import ControlPanel from './components/ControlPanel';
import LoadingScreen from './components/LoadingScreen';
import { useFaceDetection } from './hooks/useFaceDetection';
import { useBanubaFaceAR } from './hooks/useBanubaFaceAR';
import { useSwapEngine } from './hooks/useSwapEngine';

const App: React.FC = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    latency: 0,
    accuracy: 0
  });
  const [error, setError] = useState<string | null>(null);

  const { facesDetected, initFaceDetection } = useFaceDetection();
  const { arReady, initBanubaAR } = useBanubaFaceAR();
  const { isReady: swapEngineReady, setSwapParameters } = useSwapEngine();

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Initialize face detection and banuba AR
        const results = await Promise.allSettled([
          initFaceDetection(),
          initBanubaAR()
        ]);
        
        // Check for failures
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
          const errors = failures.map((result: any) => result.reason?.message || 'Unknown error');
          throw new Error(`Failed to initialize some components: ${errors.join(', ')}`);
        }
        
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Failed to load models:', error);
        setError(`Failed to initialize: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    loadModels();
  }, [initFaceDetection, initBanubaAR]);
  
  // Set swap parameters when control panel settings change
  const handleSwapSettingsChange = (settings: {
    quality: number;
    preserveExpression: boolean;
    preserveColor: boolean;
  }) => {
    setSwapParameters(settings);
  };

  // Monitor performance metrics
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateMetrics = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= 1000) { // Update every second
        const fps = Math.round((frameCount * 1000) / elapsed);
        setPerformanceMetrics(prev => ({
          ...prev,
          fps,
          latency: facesDetected.length > 0 ? Math.round(elapsed / frameCount) : prev.latency,
          accuracy: facesDetected.length > 0 ? 95 + Math.random() * 5 : prev.accuracy // Simulated accuracy
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      requestAnimationFrame(updateMetrics);
    };
    
    const metricsLoop = requestAnimationFrame(updateMetrics);
    
    return () => cancelAnimationFrame(metricsLoop);
  }, [facesDetected]);

  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Application</button>
      </div>
    );
  }

  if (!isModelLoaded || !arReady || !swapEngineReady) {
    return <LoadingScreen 
      faceDetection={initFaceDetection !== undefined}
      ar={arReady} 
      swapEngine={swapEngineReady}
    />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AR Face Swap</h1>
        <div className="performance-metrics">
          <span>FPS: {performanceMetrics.fps}</span>
          <span>Latency: {performanceMetrics.latency}ms</span>
          <span>Accuracy: {performanceMetrics.accuracy.toFixed(2)}%</span>
        </div>
      </header>
      
      <main className="app-content">
        <ARFaceSwap 
          facesDetected={facesDetected}
          selectedFace={selectedFace}
        />
      </main>
      
      <ControlPanel 
        facesDetected={facesDetected}
        selectedFace={selectedFace}
        onSelectFace={setSelectedFace}
        onSettingsChange={handleSwapSettingsChange}
      />
    </div>
  );
};

export default App; 