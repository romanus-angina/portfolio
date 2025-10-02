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

  const getTabPosition = (index) => {
    const pattern = ['right', 'left', 'right', 'right', 'left', 'right'];
    return pattern[index % pattern.length];
  };

  return (
    <section id="file-cabinet" className="file-cabinet-section">
      <h2 className="section-title animate-in">File Cabinet</h2>
      
      <div className="file-cabinet-container" ref={fileCabinetRef}>
        <div className="drawer">
          <div className="stacked-folders">
            {folderData.map((folder, index) => (
              <div 
                key={folder.id} 
                className="folder-wrapper"
                style={{
                  transform: `
                    translateX(${index * 70}px)
                    rotateY(-10deg)
                  `,
                  zIndex: index,
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
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          perspective: 1200px;
          perspective-origin: center center;
          overflow-x: auto;
        }

        .drawer {
          transform-style: preserve-3d;
          transform: rotateX(35deg) rotateY(5deg);
        }

        .stacked-folders {
          position: relative;
          width: 1000px;
          height: 450px;
          transform-style: preserve-3d;
        }

        .folder-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 600px;
          height: 450px;
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .folder-wrapper:hover {
          transform: 
            translateX(calc(var(--folder-index) * 70px))
            translateY(-10px)
            rotateY(-10deg)
            scale(1.03);
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
          z-index: 100;
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

        @media (max-width: 768px) {
          .file-cabinet-section {
            padding: 3rem 1.5rem;
          }
          
          .section-title {
            font-size: 1.75rem;
            margin-bottom: 2rem;
          }

          .file-cabinet-container {
            perspective: 900px;
          }

          .drawer {
            transform: rotateX(30deg) rotateY(5deg);
          }

          .stacked-folders {
            width: 800px;
            height: 350px;
          }

          .folder-wrapper {
            width: 400px;
            height: 350px;
            transform: 
              translateX(calc(var(--folder-index) * 50px))
              rotateY(-10deg);
          }

          .folder-wrapper:hover {
            transform: 
              translateX(calc(var(--folder-index) * 50px))
              translateY(-8px)
              rotateY(-10deg)
              scale(1.02);
          }
        }

        @media (max-width: 480px) {
          .file-cabinet-section {
            padding: 2rem 1rem;
          }
          
          .section-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .file-cabinet-container {
            perspective: 700px;
          }

          .drawer {
            transform: rotateX(25deg) rotateY(5deg);
          }

          .stacked-folders {
            width: 600px;
            height: 280px;
          }

          .folder-wrapper {
            width: 300px;
            height: 280px;
            transform: 
              translateX(calc(var(--folder-index) * 35px))
              rotateY(-10deg);
          }

          .folder-wrapper:hover {
            transform: 
              translateX(calc(var(--folder-index) * 35px))
              translateY(-6px)
              rotateY(-10deg)
              scale(1.01);
          }
        }

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