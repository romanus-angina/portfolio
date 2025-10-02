import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import FolderIcon from './FolderIcon';
import OpenFolder from './OpenFolder';
import { folderData } from './FileCabinetData';

const FileCabinet = () => {
  const [activeFolder, setActiveFolder] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const fileCabinetRef = useRef(null);
  const openFolderRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin();
    }
  }, []);

  const handleFolderClick = (folder) => {
    if (isAnimating) return;
    
    if (activeFolder && activeFolder.id === folder.id) {
      closeFolder();
    } else {
      openFolder(folder);
    }
  };

  const openFolder = (folder) => {
    setIsAnimating(true);
    setActiveFolder(folder);
    
    if (openFolderRef.current) {
      gsap.fromTo(openFolderRef.current, 
        {
          scale: 0.7,
          opacity: 0,
          y: 30,
          rotationX: -15,
          rotationY: 5
        },
        {
          scale: 1.1,
          opacity: 1,
          y: -20,
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => setIsAnimating(false)
        }
      );
    }
  };

  const closeFolder = () => {
    if (!activeFolder) return;
    
    setIsAnimating(true);
    
    if (openFolderRef.current) {
      gsap.to(openFolderRef.current, 
        {
          scale: 0.7,
          opacity: 0,
          y: 30,
          rotationX: -15,
          rotationY: 5,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            setActiveFolder(null);
            setIsAnimating(false);
          }
        }
      );
    } else {
      setActiveFolder(null);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFolder && openFolderRef.current && !openFolderRef.current.contains(event.target)) {
        closeFolder();
      }
    };

    if (activeFolder) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeFolder]);

  // Calculate tab position based on index - alternates left/right like filing cabinet
  const getTabPosition = (index) => {
    // Create a pattern that mimics the reference image
    const pattern = ['right', 'left', 'right', 'right', 'left', 'right'];
    return pattern[index % pattern.length];
  };

  return (
    <section id="file-cabinet" className="file-cabinet-section">
      <h2 className="section-title animate-in">File Cabinet</h2>
      
      <div className="file-cabinet-container" ref={fileCabinetRef}>
        <div className="stacked-folders">
          {folderData.map((folder, index) => (
            <div 
              key={folder.id} 
              className="folder-wrapper"
              style={{
                transform: `
                  translateY(${index * 35}px) 
                  translateZ(${-index * 15}px) 
                  rotateX(20deg)
                `,
                zIndex: folderData.length - index,
                '--folder-index': index
              }}
            >
              <FolderIcon
                folder={folder}
                tabPosition={getTabPosition(index)}
                isActive={activeFolder && activeFolder.id === folder.id}
                onClick={() => handleFolderClick(folder)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {activeFolder && (
        <div className="open-folder-wrapper" ref={openFolderRef}>
          <OpenFolder folder={activeFolder} onClose={closeFolder} />
        </div>
      )}
      
      <style jsx>{`
        .file-cabinet-section {
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          perspective: 1200px;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 3rem;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .file-cabinet-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          perspective: 1200px;
        }

        .stacked-folders {
          position: relative;
          width: 600px;
          height: 600px;
          transform-style: preserve-3d;
        }

        .folder-wrapper {
          position: absolute;
          top: 0;
          left: 50%;
          transform-origin: center center;
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 600px;
          margin-left: -300px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .folder-wrapper:hover {
          transform: 
            translateY(calc(var(--folder-index) * 35px - 8px)) 
            translateZ(calc(var(--folder-index) * -15px + 20px)) 
            rotateX(20deg) 
            scale(1.02);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
        }

        .open-folder-wrapper {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          width: 90%;
          max-width: 800px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .file-cabinet-section {
            padding: 3rem 1.5rem;
            perspective: 800px;
          }
          
          .section-title {
            font-size: 1.75rem;
            margin-bottom: 2rem;
          }

          .stacked-folders {
            width: 400px;
            height: 500px;
          }

          .folder-wrapper {
            width: 400px;
            margin-left: -200px;
          }

          .folder-wrapper {
            transform: 
              translateY(calc(var(--folder-index) * 25px)) 
              translateZ(calc(var(--folder-index) * -10px)) 
              rotateX(15deg);
          }

          .folder-wrapper:hover {
            transform: 
              translateY(calc(var(--folder-index) * 25px - 6px)) 
              translateZ(calc(var(--folder-index) * -10px + 15px)) 
              rotateX(15deg) 
              scale(1.02);
          }
        }

        @media (max-width: 480px) {
          .file-cabinet-section {
            padding: 2rem 1rem;
            perspective: 600px;
          }
          
          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .stacked-folders {
            width: 300px;
            height: 400px;
          }

          .folder-wrapper {
            width: 300px;
            margin-left: -150px;
          }

          .folder-wrapper {
            transform: 
              translateY(calc(var(--folder-index) * 20px)) 
              translateZ(calc(var(--folder-index) * -8px)) 
              rotateX(12deg);
          }

          .folder-wrapper:hover {
            transform: 
              translateY(calc(var(--folder-index) * 20px - 4px)) 
              translateZ(calc(var(--folder-index) * -8px + 10px)) 
              rotateX(12deg) 
              scale(1.01);
          }
        }

        /* Animation for section entrance */
        .animate-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Staggered folder entrance animation */
        .folder-wrapper {
          opacity: 0;
          animation: fadeInFolder 0.6s ease-out forwards;
          animation-delay: calc(var(--folder-index) * 0.1s);
        }

        @keyframes fadeInFolder {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default FileCabinet;