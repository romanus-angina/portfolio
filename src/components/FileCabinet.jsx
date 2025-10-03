import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import FolderIcon from './FolderIcon';
import { folderData } from './FileCabinetData';

const FileCabinet = () => {
  const [activeFolder, setActiveFolder] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const fileCabinetRef = useRef(null);
  const folderRefs = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin();
    }
  }, []);

  const handleFolderClick = (folder, index) => {
    if (isAnimating) return;
    
    if (activeFolder && activeFolder.id === folder.id) {
      closeFolder(index);
    } else {
      openFolder(folder, index);
    }
  };

  const openFolder = (folder, clickedIndex) => {
    setIsAnimating(true);
    
    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveFolder(folder);
        setIsAnimating(false);
      }
    });

    const clickedFolder = folderRefs.current[clickedIndex];
    const otherFolders = folderRefs.current.filter((_, i) => i !== clickedIndex);

    timeline
      .to({}, { duration: 0.05 })
      
      .to(clickedFolder, {
        scaleY: 1.1,
        duration: 0.15,
        ease: "power2.out",
        transformOrigin: "center bottom"
      }, "pulse")
      
      .to(clickedFolder, {
        scaleY: 1,
        duration: 0.15,
        ease: "power2.in"
      }, "pulse+=0.15")
      
      .to(otherFolders, {
        opacity: 0.4,
        duration: 0.3,
        ease: "power2.inOut"
      }, "dimming")
      
      .to(clickedFolder, {
        scaleY: 1.8,
        duration: 0.6,
        ease: "power3.out",
        transformOrigin: "center bottom"
      }, "opening");
  };

  const closeFolder = (clickedIndex) => {
    if (!activeFolder) return;
    
    setIsAnimating(true);
    
    const timeline = gsap.timeline({
      onComplete: () => {
        setActiveFolder(null);
        setIsAnimating(false);
      }
    });

    timeline.to(folderRefs.current, {
      x: 0,
      y: 0,
      z: (i) => -i * 60,
      rotateX: -2,
      rotateY: 0,
      scaleY: 1,
      scaleX: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.03,
      ease: "power2.out"
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFolder) {
        const clickedInsideFolder = folderRefs.current.some(ref => ref && ref.contains(event.target));
        if (!clickedInsideFolder) {
          const activeFolderIndex = folderData.findIndex(f => f.id === activeFolder.id);
          closeFolder(activeFolderIndex);
        }
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
                ref={el => folderRefs.current[index] = el}
                style={{
                  transform: `
                    translateZ(${-index * 60}px)
                    rotateX(-2deg)
                  `,
                  zIndex: activeFolder && activeFolder.id === folder.id ? 1000 : folderData.length - index,
                  '--folder-index': index
                }}
              >
                <FolderIcon
                  folder={folder}
                  tabPosition={getTabPosition(index)}
                  isActive={activeFolder && activeFolder.id === folder.id}
                  isOpen={activeFolder && activeFolder.id === folder.id}
                  onClick={() => handleFolderClick(folder, index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
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
          align-items: center;
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
          perspective: 1500px;
          perspective-origin: center 40%;
        }

        .drawer {
          transform-style: preserve-3d;
          transform: rotateX(-28deg) rotateZ(0deg);
          position: relative;
        }

        .stacked-folders {
          position: relative;
          width: 600px;
          height: 450px;
          transform-style: preserve-3d;
          margin: 0 auto;
        }

        .folder-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 600px;
          height: 450px;
          transform-style: preserve-3d;
          transform-origin: center top;
          filter: brightness(calc(1 - var(--folder-index) * 0.05));
        }

        .folder-wrapper:hover:not(:has(.folder-icon.open)) {
          transform: 
            translateZ(calc(var(--folder-index) * -60px + 20px))
            rotateX(-2deg)
            scale(1.02);
          filter: brightness(1.05) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
          z-index: 100;
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
            perspective-origin: center 25%;
          }

          .drawer {
            transform: rotateX(-25deg) rotateZ(0deg);
          }

          .stacked-folders {
            width: 400px;
            height: 350px;
          }

          .folder-wrapper {
            width: 400px;
            height: 350px;
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
            perspective-origin: center 20%;
          }

          .drawer {
            transform: rotateX(-22deg) rotateZ(0deg);
          }

          .stacked-folders {
            width: 300px;
            height: 280px;
          }

          .folder-wrapper {
            width: 300px;
            height: 280px;
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