import React, {useState, useRef, useEffect} from 'react';

const FolderIcon = ({ folder, isOpen, onClick, tabPosition = 'right', style, zDepth = 0 }) => {
  const OPEN_POSITION_VH = 10.5;
  const DRAG_THRESHOLD_VH = 0.5;
  const SNAP_TOLERANCE_VH = 1;
  const MAX_ROTATION_DEG = 12;
  const FOLDER_WIDTH_VW = 60;
  const FOLDER_HEIGHT_VH = 25;
  const FOLDER_LEFT_OFFSET_PERCENT = -4.5;

  const [dragTopPosition, setDragTopPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mouseY: 0, topPosition: 0 });
  const hasMoved = useRef(false);

  const initialTop = style?.top ? parseFloat(style.top) : 0;
  const MIN_TOP = OPEN_POSITION_VH;
  const MAX_TOP = initialTop;

  const handleMouseDown = (e) => {
    if (e.target.closest('.folder-contents')) return;

    setIsDragging(true);
    hasMoved.current = false;

    const currentTop = dragTopPosition !== null ? dragTopPosition : initialTop;
    dragStart.current = {
      mouseY: e.clientY,
      topPosition: currentTop,
    };

    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaY = (e.clientY - dragStart.current.mouseY) / window.innerHeight * 100;

      if (Math.abs(deltaY) > DRAG_THRESHOLD_VH) {
        hasMoved.current = true;
      }

      let newTop = dragStart.current.topPosition + deltaY;
      newTop = Math.max(MIN_TOP, Math.min(MAX_TOP, newTop));

      setDragTopPosition(newTop);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      setIsDragging(false);

      if (!hasMoved.current) return;

      const threshold = (MIN_TOP + MAX_TOP) / 2;
      const currentTop = dragTopPosition !== null ? dragTopPosition : initialTop;

      if (currentTop < threshold) {
        setDragTopPosition(MIN_TOP);
        if (!isOpen && onClick) {
          onClick();
        }
      } else {
        setDragTopPosition(null);
        if (isOpen && onClick) {
          onClick();
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragTopPosition, initialTop, MIN_TOP, MAX_TOP, isOpen, onClick]);

  useEffect(() => {
    if (!isDragging) {
      setDragTopPosition(null);
    }
  }, [isOpen, isDragging]);

  const handleClick = (e) => {
    if (!hasMoved.current && onClick) {
      onClick(e);
    }
  };

  const currentTop = dragTopPosition !== null ? dragTopPosition : initialTop;
  const dragRange = MAX_TOP - MIN_TOP;
  const dragProgress = dragRange > 0 ? (currentTop - MIN_TOP) / dragRange : 0;
  const rotation = dragProgress * MAX_ROTATION_DEG;

  const isAtTop = currentTop <= MIN_TOP + SNAP_TOLERANCE_VH;

  const upArrowCursor = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='12' y1='20' x2='12' y2='6' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='6' x2='8' y2='10' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='6' x2='16' y2='10' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='20' x2='12' y2='6' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='12' y1='6' x2='8' y2='10' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='12' y1='6' x2='16' y2='10' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 12 12, pointer";

  const downArrowCursor = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='12' y1='4' x2='12' y2='18' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='18' x2='16' y2='14' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='18' x2='8' y2='14' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='4' x2='12' y2='18' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='12' y1='18' x2='16' y2='14' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='12' y1='18' x2='8' y2='14' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\") 12 12, pointer";

  const combinedStyle = {
    ...style,
    top: `${currentTop}vh`,
    transition: isDragging ? 'none' : 'top 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: isAtTop ? downArrowCursor : upArrowCursor,
  };

  return (
    <div
      className={`folder-icon ${isOpen ? 'open' : 'closed'} tab-${tabPosition}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={combinedStyle}
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
          left: ${FOLDER_LEFT_OFFSET_PERCENT}%;
          width: ${FOLDER_WIDTH_VW}vw;
          height: ${FOLDER_HEIGHT_VH}vh;
          user-select: none;
        }

        .folder-3d-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: center bottom;
          transform: rotateX(${isDragging ? rotation : (isOpen ? 0 : 12)}deg) translateZ(${zDepth}px);
          transition: ${isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'};
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
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
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
        background: #e8e4d0;
        border-radius: 0 0 8px 8px;
        overflow: hidden;
        transform-style: preserve-3d;

        /* Simplified shadow */
        box-shadow:
          0 ${isOpen ? '25px 50px' : '12px 24px'} rgba(0, 0, 0, ${isOpen ? 0.3 : 0.25});

        transition: box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 12px 12px 12px 12px;
      }

      .folder-icon.open .folder-body {
        overflow: visible;
      }

      .folder-contents {
        padding: 2rem;
        opacity: 0;
        animation: fadeInSlideUp 0.5s ease-out 0.3s forwards;
      }

      .folder-icon.closed:hover .folder-3d-container {
        transform: rotateX(9deg) translateZ(${zDepth + 8}px);
      }

      .folder-icon.closed:hover .folder-tab {
        border-bottom-color: #3a3a3a;
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
      }

      .folder-icon.closed:hover .folder-tab::before,
      .folder-icon.closed:hover .folder-tab::after {
        background: #3a3a3a;
      }

      .folder-icon.closed:hover .folder-body {
        box-shadow:
          0 16px 32px rgba(0, 0, 0, 0.3);
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