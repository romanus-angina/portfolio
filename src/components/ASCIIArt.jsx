import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
  colorScheme = 'white', // 'white', 'green', 'blue', 'purple', 'orange', 'red', or custom object
  animationIntensity = 'medium', // 'low', 'medium', 'high'
  disableAnimations = true, // Set to false to enable animations for performance
  artStyle = null // 'classic', 'detailed', 'dense', 'blocks', 'lines', 'tech', 'organic', or null for cycling
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationsInitializedRef = useRef(false);
  const [asciiText, setAsciiText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [dynamicResolution, setDynamicResolution] = useState({ width: 120, height: 80 });
  const [currentCharSetIndex, setCurrentCharSetIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Predefined character sets for different art styles
  const characterSets = [
    { name: 'Standard', chars: ' .:-=+*#%@', style: 'classic' },
    { name: 'Detailed', chars: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$', style: 'detailed' },
    { name: 'Dense', chars: ' .:-=+*#%@&$', style: 'dense' },
    { name: 'Blocks', chars: ' ░▒▓█', style: 'blocks' },
    { name: 'Lines', chars: ' │─┌┐└┘├┤┬┴┼', style: 'lines' },
    { name: 'Tech', chars: ' .:;+=xX$&', style: 'tech' },
    { name: 'Organic', chars: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$', style: 'organic' }
  ];

  // Set initial character set based on artStyle prop
  useEffect(() => {
    if (artStyle) {
      const styleIndex = characterSets.findIndex(set => set.style === artStyle);
      if (styleIndex !== -1) {
        setCurrentCharSetIndex(styleIndex);
      }
    }
  }, [artStyle]);

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
    
    // Get current character set
    const currentCharSet = characterSets[currentCharSetIndex].chars;
    
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
            const charIndex = Math.floor((brightness / 255) * (currentCharSet.length - 1));
            ascii += currentCharSet[charIndex];
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
  }, [canvasReady, dynamicResolution, currentCharSetIndex]); // Run when canvas becomes ready, resolution changes, or character set changes

  // Enhanced animation on load (only run once)
  useEffect(() => {
    if (isLoaded && containerRef.current && !disableAnimations && !animationsInitializedRef.current) {
      animationsInitializedRef.current = true;
      const lines = containerRef.current.querySelectorAll('.ascii-line');
      
      if (lines.length > 0) {
        // First animate lines appearing
        gsap.fromTo(lines, 
          { 
            opacity: 0, 
            y: 20
          },
          { 
            opacity: 1, 
            y: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              // Then animate individual characters
              animateCharacters();
            }
          }
        );
      }
    } else if (isLoaded && disableAnimations) {
      // Just show the text immediately if animations are disabled
      const lines = containerRef.current?.querySelectorAll('.ascii-line');
      if (lines) {
        gsap.set(lines, { opacity: 1, y: 0 });
      }
    }
  }, [isLoaded, disableAnimations]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      // Kill all GSAP animations when component unmounts
      gsap.killTweensOf('.ascii-text');
      gsap.killTweensOf('.ascii-char');
      gsap.killTweensOf('.ascii-line');
    };
  }, []);

  // Start continuous subtle animations based on intensity (optimized for performance)
  const startContinuousAnimations = useCallback(() => {
    if (disableAnimations) return;
    
    // Disable continuous animations for better performance
    return;
    
    const characters = containerRef.current?.querySelectorAll('.ascii-char');
    
    if (characters && characters.length > 0) {
      // Only animate a subset of characters for better performance
      const maxAnimatedChars = Math.min(10, characters.length); // Further reduced to 10
      const animatedChars = Array.from(characters).slice(0, maxAnimatedChars);
      
      // Get animation intensity settings (reduced for performance)
      const intensitySettings = {
        low: { brightness: 1.01, movement: 0.2, duration: 10 },
        medium: { brightness: 1.02, movement: 0.3, duration: 8 },
        high: { brightness: 1.03, movement: 0.4, duration: 6 }
      };
      
      const settings = intensitySettings[animationIntensity] || intensitySettings.medium;
      
      // Single pulsing glow effect for the entire text (much more performant)
      gsap.to('.ascii-text', {
        filter: `brightness(${settings.brightness})`,
        duration: settings.duration,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });

      // Only animate a few characters with subtle movement
      animatedChars.forEach((char, index) => {
        gsap.to(char, {
          y: settings.movement * Math.sin(index * 0.3), // Reduced frequency
          duration: settings.duration + (index * 0.2),
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: index * 0.2
        });
      });
    }
  }, [disableAnimations, animationIntensity]);

  // Handle click to cycle through character sets (only when artStyle is null)
  const handleClick = useCallback(() => {
    if (artStyle) return; // Don't allow cycling when a specific art style is set
    
    const nextIndex = (currentCharSetIndex + 1) % characterSets.length;
    setCurrentCharSetIndex(nextIndex);
    
    // Re-convert the image with the new character set
    if (canvasRef.current && isLoaded) {
      convertImageToASCII();
    }
  }, [currentCharSetIndex, characterSets.length, isLoaded, artStyle]);

  // Handle hover for 3D rotation effects with momentum (optimized)
  const handleMouseEnter = useCallback(() => {
    console.log('🎯 MOUSE ENTER - Hover effect triggered!');
    setIsHovered(true);
    
    if (!disableAnimations) {
      console.log('🎯 Animations enabled, looking for ASCII text element...');
      const asciiText = containerRef.current;
      console.log('🎯 ASCII text element found:', !!asciiText);
      if (asciiText) {
        console.log('🎯 Starting GSAP rotation animation...');
        
        // Kill any existing animations first
        gsap.killTweensOf(asciiText);
        
        // Set initial transform properties for GSAP
        gsap.set(asciiText, {
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d'
        });
        
        // Set scale once, then animate only rotation
        gsap.set(asciiText, { scale: 1.1 });
        
        // Smooth continuous Y-axis rotation only
        gsap.to(asciiText, {
          rotationY: '+=360', // Relative rotation for smooth continuous spinning
          duration: 2,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            console.log('🎯 Animation updating...', gsap.getProperty(asciiText, 'rotationY'));
          }
        });
        console.log('🎯 GSAP animation started!');
      }
    } else {
      console.log('🎯 Animations disabled');
    }
  }, [disableAnimations]);

  const handleMouseLeave = useCallback(() => {
    console.log('🎯 MOUSE LEAVE - Stopping hover effect');
    setIsHovered(false);
    
    if (!disableAnimations) {
      const asciiText = containerRef.current;
      if (asciiText) {
        console.log('🎯 Smooth ease-out to original position...');
        // Smooth ease-out to original position
        gsap.killTweensOf(asciiText);
        gsap.to(asciiText, {
          rotationY: 0,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
          onComplete: () => {
            console.log('🎯 Ease-out complete');
          }
        });
      }
    }
  }, [disableAnimations]);

  // Animate individual characters with sophisticated effects (optimized)
  const animateCharacters = useCallback(() => {
    const characters = containerRef.current?.querySelectorAll('.ascii-char');
    
    if (characters && characters.length > 0) {
      // Get animation intensity settings
      const intensitySettings = {
        low: { rotation: 2, duration: 0.3, stagger: 0.3 },
        medium: { rotation: 3, duration: 0.4, stagger: 0.5 },
        high: { rotation: 5, duration: 0.6, stagger: 0.8 }
      };
      
      const settings = intensitySettings[animationIntensity] || intensitySettings.medium;
      
      // Reset characters for animation
      gsap.set(characters, {
        opacity: 0,
        scale: 0.9,
        rotation: () => Math.random() * settings.rotation - (settings.rotation / 2),
        transformOrigin: 'center center'
      });

      // Animate characters with optimized effects
      gsap.to(characters, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: settings.duration,
        stagger: {
          amount: settings.stagger,
          from: 'start'
        },
        ease: 'power2.out',
        onComplete: () => {
          // Start continuous subtle animations
          startContinuousAnimations();
        }
      });
    }
  }, [animationIntensity, startContinuousAnimations]);

  // Always render the canvas, even in loading state

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
      <div 
        className={`ascii-art-container ${className} ${isHovered ? 'hovered' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: artStyle ? 'default' : 'pointer' }}
      >
        {/* Character set indicator */}
        <div className="char-set-indicator">
          {artStyle ? `${characterSets[currentCharSetIndex].name} (${artStyle})` : characterSets[currentCharSetIndex].name}
        </div>
        
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
                  const currentCharSet = characterSets[currentCharSetIndex].chars;
                  const charBrightness = (currentCharSet.indexOf(char) / (currentCharSet.length - 1)) * 255;
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
          transition: all 0.3s ease;
        }
        
        .char-set-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(40, 215, 255, 0.2);
          color: #28D7FF;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-family: 'IBM Plex Mono', monospace;
          border: 1px solid rgba(40, 215, 255, 0.3);
          backdrop-filter: blur(10px);
          z-index: 10;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        
        .ascii-art-container:hover .char-set-indicator {
          opacity: 1;
          background: rgba(40, 215, 255, 0.3);
          transform: scale(1.05);
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
          transform: perspective(1000px);
          transform-style: preserve-3d;
          /* Remove transition to avoid conflicts with GSAP */
          /* transition: transform 0.3s ease; */
          
          /* Remove CSS animation to avoid conflicts with GSAP */
          /* animation: float3d 6s ease-in-out infinite; */
          
          /* Ensure GSAP can animate this element */
          will-change: transform;
        }

        .ascii-char {
          display: inline-block;
          transition: all 0.2s ease;
          cursor: pointer;
          transform-style: preserve-3d;
        }
        
        /* Remove individual character hover effects to avoid conflicts with main rotation */
        /* .ascii-char:hover {
          transform: scale(1.3) translateZ(3px) rotate(2deg);
          filter: brightness(1.5) drop-shadow(0 0 8px currentColor);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        } */
        
        /* 3D rotation effects for hover state */
        .ascii-art-container.hovered .ascii-char {
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ascii-art-container.hovered .ascii-char:hover {
          transform: scale(1.4) translateZ(5px) rotateY(15deg) rotateX(10deg);
          filter: brightness(1.8) drop-shadow(0 0 12px currentColor);
          z-index: 20;
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

        /* Hover effects - now handled by GSAP */

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

        /* Hover effects - now handled by GSAP */

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