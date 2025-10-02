import React from 'react';
import ASCIIArt from './ASCIIArt';
import { colorMap } from './FileCabinetData';

const OpenFolder = ({ folder, onClose }) => {
  const colors = colorMap[folder.color];
  
  return (
    <div 
      className="open-folder"
      style={{
        '--folder-bg': colors.background,
        '--folder-border': colors.border,
        '--folder-text': colors.text,
        '--folder-glow': colors.glow
      }}
    >
      <div className="open-folder-header">
        <div className="folder-info">
          <span className="folder-number">{folder.number}</span>
          <h3 className="folder-title">{folder.title}</h3>
        </div>
        <button className="close-button" onClick={onClose} aria-label="Close folder">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      <div className="open-folder-content">
        <div className="ascii-container">
          <ASCIIArt
            imagePath={folder.asciiConfig.imagePath}
            width={folder.asciiConfig.width}
            height={folder.asciiConfig.height}
            artStyle={folder.asciiConfig.artStyle}
            colorScheme={folder.asciiConfig.colorScheme}
            disableAnimations={folder.asciiConfig.disableAnimations}
            className="folder-ascii-art"
          />
        </div>
        
        <div className="folder-description">
          <p>{folder.description}</p>
        </div>
      </div>
      
      <style jsx>{`
        .open-folder {
          width: 300px;
          height: 200px;
          background: var(--folder-bg);
          border: 1px solid var(--folder-border);
          border-radius: 12px;
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--shadow-glass-strong), var(--folder-glow);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }
        
        .open-folder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .folder-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .folder-number {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--folder-text);
          opacity: 0.8;
        }
        
        .folder-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 600;
          color: var(--folder-text);
          margin: 0;
          letter-spacing: -0.01em;
        }
        
        .close-button {
          background: none;
          border: none;
          color: var(--folder-text);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }
        
        .open-folder-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          gap: 12px;
        }
        
        .ascii-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
        }
        
        .folder-ascii-art {
          transition: transform var(--transition-normal);
        }
        
        .folder-ascii-art:hover {
          transform: rotateY(15deg) rotateX(5deg);
        }
        
        .folder-description {
          text-align: center;
        }
        
        .folder-description p {
          font-size: 0.8rem;
          color: var(--folder-text);
          opacity: 0.8;
          margin: 0;
          line-height: 1.4;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .open-folder {
            width: 280px;
            height: 180px;
          }
          
          .open-folder-content {
            padding: 12px;
            gap: 8px;
          }
          
          .ascii-container {
            min-height: 60px;
          }
        }
        
        @media (max-width: 480px) {
          .open-folder {
            width: 260px;
            height: 160px;
          }
          
          .open-folder-header {
            padding: 8px 12px;
          }
          
          .folder-title {
            font-size: 0.9rem;
          }
          
          .open-folder-content {
            padding: 8px;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default OpenFolder;
