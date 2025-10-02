import React from 'react';
import { colorMap } from './FileCabinetData';

const Folder = ({ folder, isActive, onClick }) => {
  const colors = colorMap[folder.color];
  
  return (
    <div 
      className={`folder ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        '--folder-bg': colors.background,
        '--folder-border': colors.border,
        '--folder-text': colors.text,
        '--folder-glow': colors.glow
      }}
    >
      <div className="folder-tab">
        <span className="folder-number">{folder.number}</span>
        <span className="folder-title">{folder.title}</span>
      </div>
      
      <style jsx>{`
        .folder {
          width: 200px;
          height: 60px;
          background: var(--folder-bg);
          border: 1px solid var(--folder-border);
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          box-shadow: var(--shadow-glass);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .folder:hover {
          background: var(--glass-white-medium);
          border-color: var(--border-light-strong);
          box-shadow: var(--shadow-glass-strong), var(--folder-glow);
          transform: translateY(-2px);
        }
        
        .folder.active {
          background: var(--glass-white-strong);
          border-color: var(--folder-border);
          box-shadow: var(--shadow-glass-strong), var(--folder-glow);
          transform: translateY(-4px);
        }
        
        .folder-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
        }
        
        .folder-number {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--folder-text);
          opacity: 0.8;
        }
        
        .folder-title {
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--folder-text);
          text-align: center;
          letter-spacing: -0.01em;
        }
        
        .folder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--folder-text), transparent);
          opacity: 0;
          transition: opacity var(--transition-normal);
        }
        
        .folder:hover::before,
        .folder.active::before {
          opacity: 0.3;
        }
        
        .folder::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--folder-text);
          transition: width var(--transition-normal);
        }
        
        .folder:hover::after,
        .folder.active::after {
          width: 60%;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .folder {
            width: 160px;
            height: 50px;
          }
          
          .folder-title {
            font-size: 0.8rem;
          }
          
          .folder-number {
            font-size: 0.7rem;
          }
        }
        
        @media (max-width: 480px) {
          .folder {
            width: 140px;
            height: 45px;
          }
          
          .folder-tab {
            padding: 6px 12px;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default Folder;
