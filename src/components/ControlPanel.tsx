import React, { useState, useEffect } from 'react';
import '../styles/ControlPanel.css';

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

interface ControlPanelProps {
  facesDetected: Face[];
  selectedFace: string | null;
  onSelectFace: (faceId: string | null) => void;
  onSettingsChange?: (settings: {
    quality: number;
    preserveExpression: boolean;
    preserveColor: boolean;
  }) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  facesDetected, 
  selectedFace, 
  onSelectFace,
  onSettingsChange
}) => {
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('faces');
  const [effectIntensity, setEffectIntensity] = useState(75);
  const [preserveExpression, setPreserveExpression] = useState(true);
  const [preserveColor, setPreserveColor] = useState(false);
  
  // Call onSettingsChange when settings are updated
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        quality: effectIntensity,
        preserveExpression,
        preserveColor
      });
    }
  }, [effectIntensity, preserveExpression, preserveColor, onSettingsChange]);
  
  const togglePanel = () => {
    setIsPanelExpanded(!isPanelExpanded);
  };
  
  return (
    <div className={`control-panel ${isPanelExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="panel-header">
        <h3>Controls</h3>
        <button 
          className="toggle-button"
          onClick={togglePanel}
        >
          {isPanelExpanded ? '↓' : '↑'}
        </button>
      </div>
      
      {isPanelExpanded && (
        <>
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'faces' ? 'active' : ''}`}
              onClick={() => setActiveTab('faces')}
            >
              Faces
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
            <button 
              className={`tab ${activeTab === 'effects' ? 'active' : ''}`}
              onClick={() => setActiveTab('effects')}
            >
              Effects
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'faces' && (
              <div className="faces-tab">
                <h4>Detected Faces</h4>
                {facesDetected.length === 0 ? (
                  <p className="no-faces">No faces detected</p>
                ) : (
                  <div className="face-list">
                    {facesDetected.map((face) => (
                      <div 
                        key={face.id}
                        className={`face-item ${selectedFace === face.id ? 'selected' : ''}`}
                        onClick={() => onSelectFace(face.id)}
                      >
                        <div className="face-thumbnail">
                          <div className="face-icon">👤</div>
                        </div>
                        <div className="face-info">
                          <span>Face #{face.id.substring(0, 4)}</span>
                        </div>
                      </div>
                    ))}
                    <button 
                      className="clear-selection-btn"
                      onClick={() => onSelectFace(null)}
                      disabled={!selectedFace}
                    >
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h4>Swap Settings</h4>
                <div className="setting-item">
                  <label>
                    <input 
                      type="checkbox"
                      checked={preserveExpression}
                      onChange={(e) => setPreserveExpression(e.target.checked)}
                    />
                    Preserve Expressions
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input 
                      type="checkbox"
                      checked={preserveColor}
                      onChange={(e) => setPreserveColor(e.target.checked)}
                    />
                    Preserve Skin Tone
                  </label>
                </div>
                <div className="setting-item">
                  <label htmlFor="effectIntensity">Effect Intensity: {effectIntensity}%</label>
                  <input 
                    type="range"
                    id="effectIntensity"
                    min="0"
                    max="100"
                    value={effectIntensity}
                    onChange={(e) => setEffectIntensity(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'effects' && (
              <div className="effects-tab">
                <h4>AR Effects</h4>
                <div className="effects-grid">
                  <div className="effect-item active">
                    <div className="effect-icon">🔄</div>
                    <span>Face Swap</span>
                  </div>
                  <div className="effect-item">
                    <div className="effect-icon">✨</div>
                    <span>Beauty</span>
                  </div>
                  <div className="effect-item">
                    <div className="effect-icon">🎨</div>
                    <span>Style</span>
                  </div>
                  <div className="effect-item">
                    <div className="effect-icon">😀</div>
                    <span>Emotion</span>
                  </div>
                  <div className="effect-item">
                    <div className="effect-icon">🎭</div>
                    <span>Masks</span>
                  </div>
                  <div className="effect-item">
                    <div className="effect-icon">⚙️</div>
                    <span>Advanced</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ControlPanel; 