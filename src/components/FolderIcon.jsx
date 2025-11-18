import React from 'react';

const FolderIcon = ({ folder, isOpen, onClick, tabPosition = 'right', style }) => {

  return (
    <div
      className={`folder-icon ${isOpen ? 'open' : 'closed'} tab-${tabPosition}`}
      onClick={onClick}
      style={style}
    >
      <div className="folder-tab">
        <span className="folder-title">{folder.title}</span>
      </div>

      <div className="folder-body">
        {isOpen && (
          <div className="folder-contents">
            {/* Placeholder for folder contents */
            <h3>{folder.title}</h3>
            }
          </div>
        )}
      </div>

      <style jsx>{`
        .folder-icon {
          position: absolute;
          width: 55vw;
          height: 80px;
          cursor: pointer;
          transition: height 0.4s ease-out, transform 0.4s ease-out;
          overflow: hidden;
        }

        .folder-icon.open {
          height: 400px;
          tramsform: translateY(-150px);
          z-index: 10;
        }

        .folder-tab {
          position: absolute;
          top: 0;
          width: 176px;
          height: 0;
          border-bottom: 48px solid #2a2a2a;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          transition: border-bottom-color 0.3s ease;
          z-index: 10;
      }

      .folder-tab::before {
        content: '';
        position: absolute;
        top: -4.5px;
        left: -6px;
        width: 24px;
        height: 20px;
        background: #2a2a2a;
        border-radius: 8px 0 0 0;
        transform: skewX(-18deg);
        transform-origin: bottom right;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%);
        // border: 2px solid red;
      }

      .folder-tab::after {
        content: '';
        position: absolute;
        top: -4.5px;
        right: -6px;
        width: 24px;
        height: 20px;
        background: #2a2a2a;
        border-radius: 0 8px 0 0;
        transform: skewX(18deg);
        transform-origin: bottom left;
        clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
        // border: 2px solid red;
      }
      
      .folder-title {
        position: absolute;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-weight: bold;
        font-size: 14px;
        white-space: nowrap;
        pointer-events: none;
      }
      .tab-left .folder-tab {
          left: 10%;
        }

      .tab-center .folder-tab {
        left: 50%;
        transform: translateX(-50%);
      }

      .tab-right .folder-tab {
        right: 10%;
      }

      .folder-body {
        position: absolute;
        top: 48px;
        width: 100%;
        left: 0;
        height: calc(100% - 40px);
        background: linear-gradient(135deg, #f5f0dc, #ede8d0, #e5e0c8);
        border-radius: 8px 8px 8px 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .folder-icon.open .folder-body {
        overflow: visible;
      }

      .folder-content {
        padding: 1rem;
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      `}</style>
    </div>
  );
};

export default FolderIcon;
          


