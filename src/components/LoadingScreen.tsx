import React from 'react';
import '../styles/LoadingScreen.css';

interface LoadingScreenProps {
  faceDetection?: boolean;
  ar?: boolean;
  swapEngine?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  faceDetection = false, 
  ar = false, 
  swapEngine = false 
}) => {
  const calculateProgress = () => {
    const total = 3; // Total number of modules
    const loaded = [faceDetection, ar, swapEngine].filter(Boolean).length;
    return Math.round((loaded / total) * 100);
  };

  const progress = calculateProgress();
  
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-circle"></div>
        <h2>Loading AR Face Swap</h2>
        <p>Initializing models and AR systems...</p>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">{progress}%</div>
        </div>
        
        <div className="loading-modules">
          <div className={`module-item ${faceDetection ? 'loaded' : ''}`}>
            <span className="module-status">{faceDetection ? '✓' : '⟳'}</span>
            <span className="module-name">Face Detection</span>
          </div>
          <div className={`module-item ${ar ? 'loaded' : ''}`}>
            <span className="module-status">{ar ? '✓' : '⟳'}</span>
            <span className="module-name">Banuba AR</span>
          </div>
          <div className={`module-item ${swapEngine ? 'loaded' : ''}`}>
            <span className="module-status">{swapEngine ? '✓' : '⟳'}</span>
            <span className="module-name">Face Swap Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 