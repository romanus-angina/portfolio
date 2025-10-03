import React from 'react';
import ASCIIArt from './ASCIIArt';

const FolderIcon = ({ folder, tabPosition = 'right', isActive = false, onClick, isOpen = false }) => {
  const isLeftTab = tabPosition === 'left';

  return (
    <div 
      className={`folder-icon ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''} ${isLeftTab ? 'left-tab' : 'right-tab'}`}
      onClick={onClick}
    >
      <div className="folder-container">
        <div className="folder-body">
          {isOpen && (
            <div className="folder-content">
              <div className="folder-content-header">
                <span className="content-folder-number">{folder.number}</span>
                <h3 className="content-folder-title">{folder.title}</h3>
              </div>
              
              <div className="ascii-art-container">
                <ASCIIArt
                  imagePath={folder.asciiConfig.imagePath}
                  width={folder.asciiConfig.width}
                  height={folder.asciiConfig.height}
                  artStyle={folder.asciiConfig.artStyle}
                  colorScheme={folder.asciiConfig.colorScheme}
                  disableAnimations={folder.asciiConfig.disableAnimations}
                  className="folder-ascii-display"
                />
              </div>
              
              <div className="folder-content-description">
                <p>{folder.description}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="folder-tab">
          <div className="tab-content">
            <div className="tab-letter">{folder.title.charAt(0).toUpperCase()}</div>
            <div className="tab-number">{folder.number}</div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .folder-icon {
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 600px;
          height: 450px;
        }
        
        .folder-icon:hover:not(.open) {
          transform: translateY(-8px) scale(1.02);
        }
        
        .folder-icon.active {
          transform: translateY(-12px) scale(1.05);
        }
        
        .folder-icon.open {
          z-index: 1000;
        }
        
        .folder-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .folder-body {
          position: absolute;
          top: 48px;
          left: 0;
          width: 100%;
          height: calc(100% - 48px);
          background: linear-gradient(135deg, 
            #f5f0dc 0%, 
            #ede8d0 50%, 
            #e5e0c8 100%
          );
          border-radius: 12px 12px 12px 12px;
          border-top: 2px solid rgba(200, 190, 160, 0.3);
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .folder-icon.open .folder-body {
          height: calc(100% - 48px);
          box-shadow: 
            0 16px 32px rgba(0, 0, 0, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.4);
        }
        
        .folder-content {
          width: 100%;
          height: 100%;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          opacity: 0;
          animation: fadeInContent 0.5s ease-out 0.3s forwards;
        }
        
        @keyframes fadeInContent {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .folder-content-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        }
        
        .content-folder-number {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          color: #2a2a2a;
          opacity: 0.6;
          letter-spacing: 1.5px;
        }
        
        .content-folder-title {
          font-family: Arial, sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2a2a2a;
          margin: 0;
          letter-spacing: -0.02em;
        }
        
        .ascii-art-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 8px;
          padding: 20px;
          overflow: auto;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
          max-height: 250px;
        }
        
        .folder-ascii-display {
          transform: scale(0.6);
          transform-origin: center center;
        }
        
        .folder-content-description {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .folder-content-description p {
          margin: 0;
          font-size: 0.95rem;
          color: #2a2a2a;
          line-height: 1.5;
        }
        
        .folder-tab {
          position: absolute;
          top: 0;
          ${isLeftTab ? 'left: 15%' : 'right: 15%'};
          width: 176px;
          height: 0;
          border-bottom: 48px solid #2a2a2a;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          transition: border-bottom-color 0.3s ease;
          z-index: 10;
        }
        
        .folder-tab::before {
          content: '';
          position: absolute;
          left: -3px;
          top: -3px;
          background: #2a2a2a;
          border-radius: 12px 0 0 0;
          width: 72px;
          height: 16px;
          transition: background 0.3s ease;
        }
        
        .folder-tab::after {
          content: '';
          position: absolute;
          right: -3px;
          top: -3px;
          background: #2a2a2a;
          border-radius: 0 12px 0 0;
          width: 72px;
          height: 16px;
          transition: background 0.3s ease;
        }
        
        .tab-content {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 2;
          pointer-events: none;
        }
        
        .tab-letter {
          font-family: 'Arial', sans-serif;
          font-size: 20px;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
          line-height: 1;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
        }
        
        .tab-number {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
          line-height: 1;
          letter-spacing: 1px;
        }
        
        .folder-icon:hover:not(.open) .folder-body {
          background: linear-gradient(135deg, 
            #faf5e6 0%, 
            #f2edda 50%, 
            #eae5d0 100%
          );
          box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        
        .folder-icon:hover:not(.open) .folder-tab {
          border-bottom-color: #3a3a3a;
        }
        
        .folder-icon:hover:not(.open) .folder-tab::before,
        .folder-icon:hover:not(.open) .folder-tab::after {
          background: #3a3a3a;
        }
        
        .folder-icon.active .folder-body {
          background: linear-gradient(135deg, 
            #fffbf0 0%, 
            #f7f2e0 50%, 
            #efeada 100%
          );
          box-shadow: 
            0 16px 32px rgba(0, 0, 0, 0.3),
            inset 0 2px 0 rgba(255, 255, 255, 0.5);
        }
        
        .folder-icon.active .folder-tab {
          border-bottom-color: #4a4a4a;
        }
        
        .folder-icon.active .folder-tab::before,
        .folder-icon.active .folder-tab::after {
          background: #4a4a4a;
        }

        @media (max-width: 768px) {
          .content-folder-title {
            font-size: 1.5rem;
          }
          
          .content-folder-number {
            font-size: 0.8rem;
          }
          
          .ascii-art-container {
            padding: 16px;
          }
          
          .folder-content-description p {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .folder-content {
            padding: 16px;
            gap: 12px;
          }
          
          .content-folder-title {
            font-size: 1.3rem;
          }
          
          .content-folder-number {
            font-size: 0.75rem;
          }
          
          .ascii-art-container {
            padding: 12px;
          }
          
          .folder-content-description {
            padding: 10px 12px;
          }
          
          .folder-content-description p {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FolderIcon;