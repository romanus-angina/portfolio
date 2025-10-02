import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * ASCIIArt Component - Simple and Clean
 * 
 * Converts an image to ASCII art with basic processing.
 */
const ASCIIArt = ({ 
  imagePath = '/images/profile.jpg',
  width = 120,
  height = 80,
  asciiChars = ' .:-=+*#%@',
  className = '',
  onLoad = null
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [asciiText, setAsciiText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  // Convert image to ASCII using HTML5 Canvas
  const convertImageToASCII = async () => {
    console.log('ASCIIArt: Starting conversion...');
    console.log('Image path:', imagePath);
    console.log('Width:', width, 'Height:', height);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('ASCIIArt: Canvas not ready');
      return;
    }

    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('ASCIIArt: Image load timeout after 3 seconds');
      setIsError(true);
    }, 3000);
    
    img.onload = () => {
      console.log('ASCIIArt: Image loaded successfully');
      clearTimeout(timeout);
      
      try {
        // Calculate aspect ratio and set canvas size
        const aspectRatio = img.width / img.height;
        let canvasWidth = width;
        let canvasHeight = height;
        
        // Maintain aspect ratio
        if (aspectRatio > 1) {
          // Image is wider than tall
          canvasHeight = Math.round(width / aspectRatio);
        } else {
          // Image is taller than wide
          canvasWidth = Math.round(height * aspectRatio);
        }
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        console.log('Canvas size set to:', canvasWidth, 'x', canvasHeight);
        console.log('Original image aspect ratio:', aspectRatio);
        
        // Draw image to canvas maintaining aspect ratio
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        console.log('Image drawn to canvas');
        
        // Get image data using actual canvas dimensions
        const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;
        console.log('Image data length:', data.length);
        console.log('Processing dimensions:', canvasWidth, 'x', canvasHeight);
        
        // Convert to ASCII using actual canvas dimensions
        let ascii = '';
        for (let y = 0; y < canvasHeight; y += 2) { // Skip every other row
          for (let x = 0; x < canvasWidth; x += 1) {
            const index = (y * canvasWidth + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // Calculate brightness
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            ascii += asciiChars[charIndex];
          }
          ascii += '\n';
        }
        
        console.log('ASCII conversion complete!');
        console.log('ASCII length:', ascii.length);
        console.log('First 100 chars:', ascii.substring(0, 100));
        
        setAsciiText(ascii);
        setIsLoaded(true);
        
        if (onLoad) {
          onLoad(ascii);
        }
      } catch (error) {
        console.error('Error converting image to ASCII:', error);
        setIsError(true);
      }
    };
    
    img.onerror = (error) => {
      console.error('Error loading image:', imagePath, error);
      clearTimeout(timeout);
      setIsError(true);
    };
    
    console.log('Setting image source to:', imagePath);
    img.src = imagePath;
  };

  // Canvas callback ref
  const canvasCallbackRef = useCallback((node) => {
    console.log('ASCIIArt: Canvas callback called with node:', node);
    if (node) {
      console.log('ASCIIArt: Canvas element received', node);
      console.log('ASCIIArt: Canvas dimensions:', node.width, 'x', node.height);
      canvasRef.current = node;
      setCanvasReady(true);
    } else {
      console.log('ASCIIArt: Canvas element removed');
      setCanvasReady(false);
    }
  }, []);

  // Initialize ASCII conversion when canvas is ready
  useEffect(() => {
    if (canvasReady && canvasRef.current) {
      console.log('ASCIIArt: Canvas is ready, starting conversion');
      convertImageToASCII();
    }
  }, [canvasReady]); // Run when canvas becomes ready

  // Animate ASCII text on load
  useEffect(() => {
    if (isLoaded && containerRef.current) {
      const lines = containerRef.current.querySelectorAll('.ascii-line');
      
      if (lines.length > 0) {
        gsap.fromTo(lines, 
          { 
            opacity: 0, 
            y: 20
          },
          { 
            opacity: 1, 
            y: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "power2.out"
          }
        );
      }
    }
  }, [isLoaded]);

  // Always render the canvas, even in loading state
  console.log('ASCIIArt: Rendering component, isLoaded:', isLoaded, 'isError:', isError);

  // Error state
  if (isError) {
    const fallbackASCII = `
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║        ASCII ART COMPONENT           ║
    ║                                      ║
    ║     Image failed to load or          ║
    ║     processing timeout occurred       ║
    ║                                      ║
    ║     Check console for details        ║
    ║                                      ║
    ╚══════════════════════════════════════╝
    `;
    
    return (
      <div className={`ascii-art-container ${className}`}>
        <div className="ascii-error">
          <div className="error-icon">⚠️</div>
          <pre className="fallback-ascii">{fallbackASCII}</pre>
          <p>Failed to load image</p>
        </div>
      </div>
    );
  }

  // Main ASCII art display
  return (
    <>
      <div className={`ascii-art-container ${className}`}>
        <canvas ref={canvasCallbackRef} style={{ display: 'none' }} />
        
        {/* Loading overlay */}
        {!isLoaded && !isError && (
          <div className="ascii-loading">
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
            <p>Processing image...</p>
            <p>Path: {imagePath}</p>
          </div>
        )}
        
        {/* ASCII text display */}
        {isLoaded && (
          <div ref={containerRef} className="ascii-text">
            {asciiText.split('\n').map((line, index) => (
              <div key={index} className="ascii-line">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .ascii-art-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          padding: 2rem;
          position: relative;
        }

        .ascii-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          line-height: 1;
          color: #FFFFFF;
          text-align: center;
          white-space: pre;
          letter-spacing: 0;
          opacity: 0.9;
          user-select: none;
          cursor: default;
          
          /* Simple 3D effect similar to point cloud */
          transform: perspective(1000px) rotateX(5deg) rotateY(-2deg);
          transform-style: preserve-3d;
          
          /* Layered text shadow for depth */
          text-shadow: 
            0 0 5px rgba(255, 255, 255, 0.8),
            0 0 10px rgba(255, 255, 255, 0.6),
            0 0 15px rgba(255, 255, 255, 0.4),
            0 0 20px rgba(255, 255, 255, 0.2),
            0 1px 0 rgba(255, 255, 255, 0.1),
            0 2px 0 rgba(255, 255, 255, 0.05),
            0 3px 0 rgba(255, 255, 255, 0.02);
          
          /* Subtle glow */
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
          
          /* Gentle floating animation */
          animation: float3d 6s ease-in-out infinite;
        }

        .ascii-line {
          display: block;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
        }

        .ascii-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #28D7FF;
        }

        .loading-dots {
          display: flex;
          gap: 0.5rem;
        }

        .loading-dots span {
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.2s);
        }

        .loading-dots span:nth-child(1) { --i: 0; }
        .loading-dots span:nth-child(2) { --i: 1; }
        .loading-dots span:nth-child(3) { --i: 2; }

        .ascii-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #ff6b6b;
        }

        .error-icon {
          font-size: 2rem;
        }

        .fallback-ascii {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 8px;
          color: #FFFFFF;
          text-align: center;
          white-space: pre;
          margin: 1rem 0;
          opacity: 0.8;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(0.8); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2); 
          }
        }

        @keyframes float3d {
          0%, 100% {
            transform: perspective(1000px) rotateX(5deg) rotateY(-2deg) translateY(0px);
          }
          50% {
            transform: perspective(1000px) rotateX(3deg) rotateY(-1deg) translateY(-5px);
          }
        }

        /* Hover effects */
        .ascii-art-container:hover .ascii-text {
          transform: perspective(1000px) rotateX(2deg) rotateY(-1deg) translateY(-10px) scale(1.05);
          filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .ascii-text {
            font-size: 6px;
          }
          
          .ascii-art-container {
            padding: 1rem;
            min-height: 150px;
          }
        }

        @media (max-width: 480px) {
          .ascii-text {
            font-size: 5px;
          }
        }

        /* Hover effects */
        .ascii-art-container:hover .ascii-text {
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
          transition: filter 0.3s ease;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .ascii-line {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
};

export default ASCIIArt;