import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * ASCIIArt Component - Customizable ASCII Art Generator
 * 
 * Converts an image to ASCII art with customizable color schemes.
 * Perfect for folder previews with different color themes.
 * 
 * @param {string} imagePath - Path to the image file
 * @param {number} width - Fixed width (optional, uses dynamic resolution if null)
 * @param {number} height - Fixed height (optional, uses dynamic resolution if null)
 * @param {string} asciiChars - Character set for ASCII conversion
 * @param {string} className - Additional CSS classes
 * @param {function} onLoad - Callback when ASCII art is generated
 * @param {boolean} useColorVariations - Enable/disable color variations
 * @param {string} colorScheme - Color scheme: 'white', 'green', 'blue', 'purple', 'orange', 'red'
 */
const ASCIIArt = ({ 
  imagePath = '/images/profile.jpg',
  width = null, // Will be calculated dynamically
  height = null, // Will be calculated dynamically
  asciiChars = ' .:-=+*#%@',
  className = '',
  onLoad = null,
  useColorVariations = true,
  colorScheme = 'white' // 'white', 'green', 'blue', 'purple', 'orange', 'red', or custom object
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [asciiText, setAsciiText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [dynamicResolution, setDynamicResolution] = useState({ width: 120, height: 80 });

  // Predefined color schemes
  const colorSchemes = {
    white: {
      dark: { r: 0.8, g: 0.8, b: 1.0, intensity: [40, 140] },
      medium: { r: 0.9, g: 0.9, b: 1.0, intensity: [140, 200] },
      light: { r: 1.0, g: 1.0, b: 1.0, intensity: [200, 255] }
    },
    green: {
      dark: { r: 0.2, g: 0.6, b: 0.3, intensity: [40, 140] },
      medium: { r: 0.3, g: 0.8, b: 0.4, intensity: [140, 200] },
      light: { r: 0.6, g: 1.0, b: 0.7, intensity: [200, 255] }
    },
    blue: {
      dark: { r: 0.2, g: 0.4, b: 1.0, intensity: [40, 140] },
      medium: { r: 0.2, g: 0.6, b: 1.0, intensity: [140, 200] },
      light: { r: 0.4, g: 0.8, b: 1.0, intensity: [200, 255] }
    },
    purple: {
      dark: { r: 0.4, g: 0.2, b: 0.8, intensity: [40, 140] },
      medium: { r: 0.6, g: 0.3, b: 0.9, intensity: [140, 200] },
      light: { r: 0.8, g: 0.5, b: 1.0, intensity: [200, 255] }
    },
    orange: {
      dark: { r: 0.8, g: 0.4, b: 0.2, intensity: [40, 140] },
      medium: { r: 1.0, g: 0.6, b: 0.3, intensity: [140, 200] },
      light: { r: 1.0, g: 0.8, b: 0.5, intensity: [200, 255] }
    },
    red: {
      dark: { r: 0.8, g: 0.2, b: 0.2, intensity: [40, 140] },
      medium: { r: 1.0, g: 0.3, b: 0.3, intensity: [140, 200] },
      light: { r: 1.0, g: 0.6, b: 0.6, intensity: [200, 255] }
    }
  };

  // Calculate color for character based on brightness and color scheme
  const getColorForBrightness = (brightness) => {
    // Normalize brightness to 0-1 range
    const normalizedBrightness = brightness / 255;
    
    // Get color scheme (handle both string keys and custom objects)
    const scheme = typeof colorScheme === 'string' 
      ? (colorSchemes[colorScheme] || colorSchemes.white)
      : colorScheme;
    
    // Define color ranges
    const darkThreshold = 0.3;
    const mediumThreshold = 0.7;
    
    let colorConfig;
    let intensity;
    
    if (normalizedBrightness < darkThreshold) {
      // Dark areas
      colorConfig = scheme.dark;
      intensity = normalizedBrightness / darkThreshold;
    } else if (normalizedBrightness < mediumThreshold) {
      // Medium areas
      colorConfig = scheme.medium;
      intensity = (normalizedBrightness - darkThreshold) / (mediumThreshold - darkThreshold);
    } else {
      // Light areas
      colorConfig = scheme.light;
      intensity = (normalizedBrightness - mediumThreshold) / (1 - mediumThreshold);
    }
    
    // Calculate final color values
    const baseIntensity = colorConfig.intensity[0] + (colorConfig.intensity[1] - colorConfig.intensity[0]) * intensity;
    const r = Math.floor(baseIntensity * colorConfig.r);
    const g = Math.floor(baseIntensity * colorConfig.g);
    const b = Math.floor(baseIntensity * colorConfig.b);
    
    return {
      color: `rgb(${r}, ${g}, ${b})`,
      textShadow: `0 0 8px rgba(${r}, ${g}, ${b}, 0.8)`
    };
  };

  // Calculate dynamic resolution based on screen size
  const calculateDynamicResolution = (screenWidth, screenHeight) => {
    // Base resolution for mobile (320px width)
    const baseWidth = 320;
    const baseResolution = { width: 80, height: 60 };
    
    // Calculate scale factor based on screen width
    const scaleFactor = Math.min(screenWidth / baseWidth, 3); // Cap at 3x for very large screens
    
    // Calculate resolution with scale factor
    const newWidth = Math.round(baseResolution.width * scaleFactor);
    const newHeight = Math.round(baseResolution.height * scaleFactor);
    
    // Ensure minimum resolution
    const minWidth = 60;
    const minHeight = 45;
    
    return {
      width: Math.max(newWidth, minWidth),
      height: Math.max(newHeight, minHeight)
    };
  };

  // Handle screen size changes and update resolution
  useEffect(() => {
    const updateScreenSize = () => {
      const newScreenSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      setScreenSize(newScreenSize);
      
      // Calculate new resolution based on screen size
      const newResolution = calculateDynamicResolution(newScreenSize.width, newScreenSize.height);
      setDynamicResolution(newResolution);
    };

    // Initial screen size
    updateScreenSize();

    // Add resize listener
    window.addEventListener('resize', updateScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Convert image to ASCII using HTML5 Canvas
  const convertImageToASCII = async () => {
    // Use dynamic resolution or fallback to props
    const finalWidth = width || dynamicResolution.width;
    const finalHeight = height || dynamicResolution.height;
    
    console.log('ASCIIArt: Starting conversion...');
    console.log('Image path:', imagePath);
    console.log('Width:', finalWidth, 'Height:', finalHeight);
    console.log('Screen size:', screenSize);
    console.log('Dynamic resolution:', dynamicResolution);
    
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
        let canvasWidth = finalWidth;
        let canvasHeight = finalHeight;
        
        // Maintain aspect ratio
        if (aspectRatio > 1) {
          // Image is wider than tall
          canvasHeight = Math.round(finalWidth / aspectRatio);
        } else {
          // Image is taller than wide
          canvasWidth = Math.round(finalHeight * aspectRatio);
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
        
        // Convert to ASCII using enhanced character selection
        let ascii = '';
        for (let y = 0; y < canvasHeight; y += 2) { // Skip every other row
          for (let x = 0; x < canvasWidth; x += 1) {
            const index = (y * canvasWidth + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // Calculate brightness using standard luminance formula
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Use simple character selection for now
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

  // Initialize ASCII conversion when canvas is ready or resolution changes
  useEffect(() => {
    if (canvasReady && canvasRef.current) {
      console.log('ASCIIArt: Canvas is ready, starting conversion');
      convertImageToASCII();
    }
  }, [canvasReady, dynamicResolution]); // Run when canvas becomes ready or resolution changes

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

  // Error state - simple fallback
  if (isError) {
    return (
      <div className={`ascii-art-container ${className}`}>
        <div className="ascii-error">
          <div className="error-icon">⚠️</div>
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
                {line.split('').map((char, charIndex) => {
                  // Calculate color based on character position in brightness range
                  const charBrightness = (asciiChars.indexOf(char) / (asciiChars.length - 1)) * 255;
                  const colorStyle = useColorVariations ? getColorForBrightness(charBrightness) : {};
                  
                  return (
                    <span 
                      key={charIndex} 
                      className="ascii-char"
                      style={colorStyle}
                    >
                      {char}
                    </span>
                  );
                })}
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
          color: #FFFFFF; /* Fallback white color */
          text-align: center;
          white-space: pre;
          letter-spacing: 0;
          opacity: 0.9;
          user-select: none;
          cursor: default;
          
          /* Simple 3D effect similar to point cloud */
          transform: perspective(1000px) rotateX(5deg) rotateY(-2deg);
          transform-style: preserve-3d;
          
          /* Gentle floating animation */
          animation: float3d 6s ease-in-out infinite;
        }

        .ascii-char {
          display: inline-block;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .ascii-char:hover {
          transform: scale(1.2) translateZ(2px);
          filter: brightness(1.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

        /* Responsive design with dynamic resolution */
        @media (max-width: 1200px) {
          .ascii-text {
            font-size: 7px;
          }
        }

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
          
          .ascii-art-container {
            padding: 0.5rem;
            min-height: 120px;
          }
        }

        @media (max-width: 320px) {
          .ascii-text {
            font-size: 4px;
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