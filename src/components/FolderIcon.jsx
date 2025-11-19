import React from 'react';

const FolderIcon = ({ folder, isOpen, onClick, tabPosition = 'right', style, zDepth = 0 }) => {

  return (
    <div
      className={`folder-icon ${isOpen ? 'open' : 'closed'} tab-${tabPosition}`}
      onClick={onClick}
      style={style}
    >
      <div className="folder-3d-container">
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
      </div>
        
   

      <style jsx>{`
        .folder-icon {
          position: absolute;
          width: 55vw;
          cursor: pointer;
          /* Don't apply transforms here - use 3d-container */
        }

        .folder-3d-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: center bottom;
          transform: rotateX(${isOpen ? 0 : 12}deg) translateZ(${zDepth}px);
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }

        .folder-tab {
          position: absolute;
          top: 0;
          width: 176px;
          height: 0;
          border-bottom: 48px solid #2a2a2a;
          border-left: 16px solid transparent;
          border-right: 16px solid transparent;
          transition: border-bottom-color 0.3s ease, filter 0.3s ease;
          z-index: 10;
          transform-style: preserve-3d;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))
                  drop-shadow(0 1px 0 rgba(0, 0, 0, 0.15));
      }

      .folder-tab::before {
        content: '';
        position: absolute;
        top: -3.5px;
        left: -6px;
        width: 75px;
        height: 16px;
        background: #2a2a2a;
        border-radius: 8px 0 0 0;
        transform: skewX(-18deg);
        transform-origin: bottom right;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 100%);
        transition: background 0.3s ease;
      }

      .folder-tab::after {
        content: '';
        position: absolute;
        top: -3.5px;
        right: -6px;
        width: 75px;
        height: 16px;
        background: #2a2a2a;
        border-radius: 0 8px 0 0;
        transform: skewX(18deg);
        transform-origin: bottom left;
        clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
        transition: background 0.3s ease;
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
        height: calc(100% - 48px);
        background:
          linear-gradient(135deg, #f5f0dc 0%, #ede8d0 50%, #e5e0c8 100%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.01) 2px,
            rgba(0, 0, 0, 0.01) 4px
          );
        border-radius: 0 0 8px 8px;
        overflow: hidden;
        transform-style: preserve-3d;

        /* Dynamic shadow based on state */
        box-shadow:
          0 ${isOpen ? '25px 50px' : '10px 20px'} rgba(0, 0, 0, ${isOpen ? 0.3 : 0.2}),
          0 ${isOpen ? '10px 20px' : '4px 8px'} rgba(0, 0, 0, ${isOpen ? 0.15 : 0.1}),
          inset 0 2px 0 rgba(255, 255, 255, 0.5),
          inset 2px 0 0 rgba(255, 255, 255, 0.3),
          inset -2px 0 0 rgba(180, 170, 140, 0.4);

        /* Edge highlights */
        border-top: 3px solid rgba(200, 190, 160, 0.6);
        border-left: 2px solid rgba(200, 190, 160, 0.4);
        border-right: 2px solid rgba(160, 150, 120, 0.5);

        transition: box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 12px 12px 12px 12px;
      }

      .folder-body::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.08), transparent);
        pointer-events: none;
        z-index: 1;
      }

      .folder-icon.open .folder-body {
        overflow: visible;
      }

      .folder-contents {
        padding: 2rem;
        opacity: 0;
        animation: fadeInSlideUp 0.5s ease-out 0.3s forwards;
      }

      /* Hover effects for closed folders */
      .folder-icon.closed:hover .folder-3d-container {
        transform: rotateX(9deg) translateZ(${zDepth + 8}px);
      }

      .folder-icon.closed:hover .folder-tab {
        border-bottom-color: #3a3a3a;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4))
                drop-shadow(0 1px 0 rgba(0, 0, 0, 0.2));
      }

      .folder-icon.closed:hover .folder-tab::before,
      .folder-icon.closed:hover .folder-tab::after {
        background: #3a3a3a;
      }

      .folder-icon.closed:hover .folder-body {
        box-shadow:
          0 15px 30px rgba(0, 0, 0, 0.25),
          0 6px 12px rgba(0, 0, 0, 0.15),
          inset 0 2px 0 rgba(255, 255, 255, 0.6),
          inset 2px 0 0 rgba(255, 255, 255, 0.4),
          inset -2px 0 0 rgba(180, 170, 140, 0.5);
      }

      @keyframes fadeInSlideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      `}</style>
    </div>
  );
};

export default FolderIcon;