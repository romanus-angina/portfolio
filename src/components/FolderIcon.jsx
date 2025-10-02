import React from 'react';

const FolderIcon = ({ folder, tabPosition = 'right', isActive = false, onClick }) => {
  const isLeftTab = tabPosition === 'left';

  return (
    <div 
      className={`folder-icon ${isActive ? 'active' : ''} ${isLeftTab ? 'left-tab' : 'right-tab'}`}
      onClick={onClick}
    >
      <div className="folder-container">
        <div className="folder-body"></div>
        
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
        
        .folder-icon:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .folder-icon.active {
          transform: translateY(-12px) scale(1.05);
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
        }
        
        .folder-tab {
          position: absolute;
          top: 0;
          ${isLeftTab ? 'left: 15%' : 'right: 15%'};;
          width: 176px;
          height: 0;
          border-bottom: 48px solid #2a2a2a;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          transition: border-bottom-color 0.3s ease;
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
        
        .folder-icon:hover .folder-body {
          background: linear-gradient(135deg, 
            #faf5e6 0%, 
            #f2edda 50%, 
            #eae5d0 100%
          );
          box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
        
        .folder-icon:hover .folder-tab {
          border-bottom-color: #3a3a3a;
        }
        
        .folder-icon:hover .folder-tab::before,
        .folder-icon:hover .folder-tab::after {
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
      `}</style>
    </div>
  );
};

export default FolderIcon;