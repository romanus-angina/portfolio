import { useEffect, useRef, useState, useCallback, useMemo, useLayoutEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Performance optimization refs
  const animationFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const lastHoverTimeRef = useRef(0);
  const cachedAsciiRef = useRef(new Map()); // Cache ASCII conversions by image path + resolution + char set
  const imageCacheRef = useRef(new Map()); // Cache loaded images
  const observerRef = useRef(null);
  const isMobileRef = useRef(false);
  const performanceMetricsRef = useRef({
    conversionTime: 0,
    cacheHits: 0,
    cacheMisses: 0,
    renderTime: 0
  });

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
      
      // Detect mobile device
      isMobileRef.current = newScreenSize.width <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Calculate new resolution based on screen size
      const newResolution = calculateDynamicResolution(newScreenSize.width, newScreenSize.height);
      setDynamicResolution(newResolution);
    };

    // Initial screen size
    updateScreenSize();

    // Add resize listener with throttling
    let resizeTimeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateScreenSize, 100);
    };
    
    window.addEventListener('resize', throttledResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Convert image to ASCII using HTML5 Canvas with caching
  const convertImageToASCII = useCallback(async () => {
    const startTime = performance.now();
    
    // Prevent multiple simultaneous loads
    if (isLoading) {
      console.log('Image already loading, skipping...');
      return;
    }
    
    // Use dynamic resolution or fallback to props
    const finalWidth = width || dynamicResolution.width;
    const finalHeight = height || dynamicResolution.height;
    
    // Get current character set
    const currentCharSet = characterSets[currentCharSetIndex].chars;
    
    // Create cache key
    const cacheKey = `${imagePath}-${finalWidth}x${finalHeight}-${currentCharSetIndex}-${colorScheme}`;
    
    // Check cache first
    if (cachedAsciiRef.current.has(cacheKey)) {
      performanceMetricsRef.current.cacheHits++;
      const cachedResult = cachedAsciiRef.current.get(cacheKey);
      setAsciiText(cachedResult);
      setIsLoaded(true);
      if (onLoad) {
        onLoad(cachedResult);
      }
      return;
    }
    
    performanceMetricsRef.current.cacheMisses++;
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not ready for image conversion');
      return;
    }
    
    setIsLoading(true);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Check if image is already cached
    let img = imageCacheRef.current.get(imagePath);
    
    if (!img) {
      img = new Image();
      imageCacheRef.current.set(imagePath, img);
      
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.error('Image loading timeout after 10 seconds:', imagePath);
        setIsLoading(false);
        setIsError(true);
      }, 10000); // Increased timeout to 10 seconds
      
      img.onload = () => {
        console.log('Image loaded successfully:', imagePath);
        clearTimeout(timeout);
        setIsLoading(false);
        processImageToASCII(img, finalWidth, finalHeight, currentCharSet, cacheKey, startTime);
      };
      
      img.onerror = (error) => {
        console.error('Error loading image:', imagePath, error);
        console.error('Image load failed. Check if file exists at:', imagePath);
        clearTimeout(timeout);
        setIsLoading(false);
        setIsError(true);
      };
      
      console.log('Starting to load image:', imagePath);
      // Add crossOrigin to handle potential CORS issues
      img.crossOrigin = 'anonymous';
      img.src = imagePath;
    } else if (img.complete && img.naturalWidth > 0) {
      // Image already loaded, process immediately
      console.log('Using cached image:', imagePath);
      processImageToASCII(img, finalWidth, finalHeight, currentCharSet, cacheKey, startTime);
    } else {
      // Image is loading, wait for it
      console.log('Image is already loading, waiting...', imagePath);
      img.onload = () => {
        console.log('Cached image loaded successfully:', imagePath);
        processImageToASCII(img, finalWidth, finalHeight, currentCharSet, cacheKey, startTime);
      };
    }
  }, [imagePath, width, height, dynamicResolution, currentCharSetIndex, colorScheme, onLoad, isLoading]);

  // Process image to ASCII (separated for better performance)
  const processImageToASCII = useCallback((img, finalWidth, finalHeight, currentCharSet, cacheKey, startTime) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
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
      
      // Draw image to canvas maintaining aspect ratio
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      
      // Get image data using actual canvas dimensions
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const data = imageData.data;
      
      // Convert to ASCII using enhanced character selection
      let ascii = '';
      
      // Optimize for mobile: reduce processing
      const stepY = isMobileRef.current ? 3 : 2; // Skip more rows on mobile
      const stepX = isMobileRef.current ? 2 : 1; // Skip more columns on mobile
      
      for (let y = 0; y < canvasHeight; y += stepY) {
        for (let x = 0; x < canvasWidth; x += stepX) {
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
      
      // Cache the result
      cachedAsciiRef.current.set(cacheKey, ascii);
      
      // Track performance
      const endTime = performance.now();
      performanceMetricsRef.current.conversionTime = endTime - startTime;
      
      setAsciiText(ascii);
      setIsLoaded(true);
      
      if (onLoad) {
        onLoad(ascii);
      }
    } catch (error) {
      console.error('Error converting image to ASCII:', error);
      setIsError(true);
    }
  }, [onLoad]);

  // Canvas callback ref
  const canvasCallbackRef = useCallback((node) => {
    if (node) {
      canvasRef.current = node;
      setCanvasReady(true);
    } else {
      setCanvasReady(false);
    }
  }, []);

  // Initialize ASCII conversion when canvas is ready or resolution changes
  useEffect(() => {
    if (canvasReady && canvasRef.current) {
      convertImageToASCII();
    }
  }, [canvasReady, dynamicResolution, currentCharSetIndex, convertImageToASCII]); // Run when canvas becomes ready, resolution changes, or character set changes

  // Intersection Observer for lazy loading
  useEffect(() => {
    // For now, set visible immediately to ensure ASCII art loads
    // TODO: Re-implement proper lazy loading once basic functionality is working
    setIsVisible(true);
    
    // Set up observer for future lazy loading implementation
    const setupObserver = () => {
      if (!observerRef.current && containerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
                observerRef.current?.unobserve(entry.target);
              }
            });
          },
          { 
            threshold: 0.1, 
            rootMargin: isMobileRef.current ? '100px' : '50px'
          }
        );
        
        // Start observing
        observerRef.current.observe(containerRef.current);
      }
    };

    // Try to set up observer after a delay
    const timeout = setTimeout(setupObserver, 500);
    
    // Cleanup
    return () => {
      clearTimeout(timeout);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Enhanced line-by-line animation on load
  useEffect(() => {
    if (isLoaded && containerRef.current && !disableAnimations && !animationsInitializedRef.current) {
      animationsInitializedRef.current = true;
      const lines = containerRef.current.querySelectorAll('.ascii-line');
      
      if (lines.length > 0) {
        // Convert NodeList to Array
        const linesArray = Array.from(lines);
        
        // Optimize animations for mobile
        const isMobile = isMobileRef.current;
        const staggerDelay = isMobile ? 0.15 : 0.08; // Slightly slower for better line-by-line effect
        const duration = isMobile ? 0.5 : 0.7; // Longer duration for smoother effect
        const maxLines = isMobile ? Math.min(8, linesArray.length) : linesArray.length; // More lines on mobile for line-by-line
        
        // Set initial state for all lines
        gsap.set(linesArray, {
          opacity: 0,
          y: isMobile ? 15 : 25,
          scale: 0.95,
          rotationX: isMobile ? 5 : 10,
          transformOrigin: 'center center'
        });
        
        // Animate lines appearing one by one with enhanced effects
        gsap.to(linesArray.slice(0, maxLines), {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: duration,
          stagger: {
            amount: staggerDelay * maxLines, // Total stagger time
            from: "start"
          },
          ease: "power2.out",
        });
      }
    } else if (isLoaded && disableAnimations) {
      // Just show the text immediately if animations are disabled
      const lines = containerRef.current?.querySelectorAll('.ascii-line');
      if (lines) {
        gsap.set(lines, { opacity: 1, y: 0, scale: 1, rotationX: 0 });
      }
    }
  }, [isLoaded, disableAnimations]);

  // Cleanup animations and observers on unmount
  useEffect(() => {
    return () => {
      // Cleanup animations
      gsap.killTweensOf('.ascii-text');
      gsap.killTweensOf('.ascii-char');
      gsap.killTweensOf('.ascii-line');
      
      // Cleanup intersection observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      // Cleanup animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Reset animation state
      isAnimatingRef.current = false;
      
      // Memory cleanup - clear caches if they get too large
      if (cachedAsciiRef.current.size > 50) {
        cachedAsciiRef.current.clear();
      }
      
      if (imageCacheRef.current.size > 20) {
        imageCacheRef.current.clear();
      }
    };
  }, []);

  // Periodic memory cleanup
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Clear old cache entries if memory usage is high
      if (cachedAsciiRef.current.size > 100) {
        const entries = Array.from(cachedAsciiRef.current.entries());
        // Keep only the most recent 50 entries
        cachedAsciiRef.current.clear();
        entries.slice(-50).forEach(([key, value]) => {
          cachedAsciiRef.current.set(key, value);
        });
      }
      
      // Clear image cache if it gets too large
      if (imageCacheRef.current.size > 30) {
        imageCacheRef.current.clear();
      }
    }, 60000); // Run every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Start continuous subtle animations based on intensity (disabled for performance)
  const startContinuousAnimations = useCallback(() => {
    // Disabled for maximum performance
    return;
    
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

  // Trigger line-by-line animation on click
  const triggerLineByLineAnimation = useCallback(() => {
    if (disableAnimations) return;
    
    const lines = containerRef.current?.querySelectorAll('.ascii-line');
    if (!lines || lines.length === 0) return;
    
    const linesArray = Array.from(lines);
    const isMobile = isMobileRef.current;
    
    // Reset all lines
    gsap.set(linesArray, {
      opacity: 0,
      y: 20,
      scale: 0.9,
      rotationX: 15
    });
    
    // Animate lines one by one
    gsap.to(linesArray, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: isMobile ? 0.4 : 0.6,
      stagger: {
        amount: isMobile ? 0.1 : 0.05,
        from: "start"
      },
      ease: "back.out(1.7)"
    });
  }, [disableAnimations]);

  // Trigger wave effect animation
  const triggerWaveAnimation = useCallback(() => {
    if (disableAnimations) return;
    
    const lines = containerRef.current?.querySelectorAll('.ascii-line');
    if (!lines || lines.length === 0) return;
    
    const linesArray = Array.from(lines);
    const isMobile = isMobileRef.current;
    
    // Create wave effect
    linesArray.forEach((line, index) => {
      gsap.to(line, {
        y: -5,
        scale: 1.05,
        duration: 0.3,
        delay: index * 0.05,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    });
  }, [disableAnimations]);

  // Handle click to cycle through character sets and trigger animations
  const handleClick = useCallback(() => {
    if (artStyle) {
      // If art style is fixed, just trigger line-by-line animation
      triggerLineByLineAnimation();
      return;
    }
    
    const nextIndex = (currentCharSetIndex + 1) % characterSets.length;
    setCurrentCharSetIndex(nextIndex);
    
    // Re-convert the image with the new character set
    if (canvasRef.current && isLoaded) {
      convertImageToASCII();
    }
    
    // Trigger line-by-line animation after a short delay
    setTimeout(() => {
      triggerLineByLineAnimation();
    }, 100);
  }, [currentCharSetIndex, characterSets.length, isLoaded, artStyle, triggerLineByLineAnimation]);

  // Handle double-click for wave effect
  const handleDoubleClick = useCallback(() => {
    triggerWaveAnimation();
  }, [triggerWaveAnimation]);

  // Handle hover for 3D rotation effects with performance optimizations
  const handleMouseEnter = useCallback(() => {
    if (disableAnimations || isAnimatingRef.current) {
      return;
    }
    
    // Disable hover effects on mobile for better performance
    if (isMobileRef.current) {
      return;
    }
    
    const now = Date.now();
    if (now - lastHoverTimeRef.current < 200) {
      return; // Throttle rapid hover events
    }
    lastHoverTimeRef.current = now;
    
    const asciiText = containerRef.current;
    if (!asciiText) return;
    
    isAnimatingRef.current = true;
    setIsHovered(true);
    
    // Kill any existing animations first
    gsap.killTweensOf(asciiText);
    gsap.killTweensOf(asciiText.querySelectorAll('.ascii-line'));
    
    // Set initial transform properties for GSAP
    gsap.set(asciiText, {
      transformOrigin: 'center center',
      transformStyle: 'preserve-3d',
      willChange: 'transform'
    });
    
    // Set scale once, then animate only rotation
    gsap.set(asciiText, { scale: 1.05 }); // Reduced scale for better performance
    
    // Smooth 3D rotation using timeline for seamless looping
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.to(asciiText, {
      rotationY: 360,
      rotationX: 2,
      duration: 3,
      ease: 'none',
      onComplete: () => {
        // Reset to 0 for seamless loop
        gsap.set(asciiText, { rotationY: 0 });
      }
    });
  }, [disableAnimations]);

  const handleMouseLeave = useCallback(() => {
    if (disableAnimations || !isAnimatingRef.current) {
      return;
    }
    
    const asciiText = containerRef.current;
    if (!asciiText) return;
    
    isAnimatingRef.current = false;
    setIsHovered(false);
    
    // Kill all animations
    gsap.killTweensOf(asciiText);
    
    // Get current rotation and complete to next 360° mark
    const currentRotation = gsap.getProperty(asciiText, "rotationY") || 0;
    const targetRotation = Math.ceil(currentRotation / 360) * 360;
    
    // Smooth completion
    gsap.to(asciiText, {
      rotationY: targetRotation,
      rotationX: 0,
      scale: 1,
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(asciiText, { rotationY: 0, rotationX: 0, scale: 1 });
      }
    });
  }, [disableAnimations]);

  // Animate individual characters with sophisticated effects
  const animateCharacters = useCallback(() => {
    const characters = containerRef.current?.querySelectorAll('.ascii-char');
    
    if (characters && characters.length > 0) {
      // Limit characters for performance
      const maxChars = isMobileRef.current ? 50 : 100;
      const charsToAnimate = Array.from(characters).slice(0, maxChars);
      
      // Get animation intensity settings
      const intensitySettings = {
        low: { rotation: 1, duration: 0.2, stagger: 0.1 },
        medium: { rotation: 2, duration: 0.3, stagger: 0.15 },
        high: { rotation: 3, duration: 0.4, stagger: 0.2 }
      };
      
      const settings = intensitySettings[animationIntensity] || intensitySettings.medium;
      
      // Reset characters for animation
      gsap.set(charsToAnimate, {
        opacity: 0,
        scale: 0.8,
        rotation: () => Math.random() * settings.rotation - (settings.rotation / 2),
        transformOrigin: 'center center'
      });

      // Animate characters with optimized effects
      gsap.to(charsToAnimate, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: settings.duration,
        stagger: {
          amount: settings.stagger,
          from: 'start'
        },
        ease: 'power2.out'
      });
    }
  }, [animationIntensity]);

  // Performance monitoring (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isLoaded) {
      const totalRequests = performanceMetricsRef.current.cacheHits + performanceMetricsRef.current.cacheMisses;
      const cacheHitRate = totalRequests > 0 ? (performanceMetricsRef.current.cacheHits / totalRequests) * 100 : 0;
      
      console.log('ASCII Art Performance Metrics:', {
        conversionTime: `${performanceMetricsRef.current.conversionTime.toFixed(2)}ms`,
        cacheHits: performanceMetricsRef.current.cacheHits,
        cacheMisses: performanceMetricsRef.current.cacheMisses,
        cacheHitRate: `${cacheHitRate.toFixed(1)}%`,
        isMobile: isMobileRef.current,
        isVisible,
        resolution: `${dynamicResolution.width}x${dynamicResolution.height}`
      });
    }
  }, [isLoaded, isVisible, dynamicResolution]);

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
        ref={containerRef}
        className={`ascii-art-container ${className} ${isHovered ? 'hovered' : ''}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
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
          <div className="ascii-text">
            {asciiText.split('\n').map((line, index) => (
              <div key={index} className="ascii-line">
                {line.split('').map((char, charIndex) => {
                  // Simplified rendering for performance
                  const colorStyle = useColorVariations ? getColorForBrightness(
                    (characterSets[currentCharSetIndex].chars.indexOf(char) / 
                     (characterSets[currentCharSetIndex].chars.length - 1)) * 255
                  ) : {};
                  
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
        
        .ascii-art-container.lazy-loading {
          min-height: 150px;
          background: rgba(40, 215, 255, 0.05);
          border: 1px dashed rgba(40, 215, 255, 0.2);
          border-radius: 8px;
        }
        
        .ascii-lazy-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: #28D7FF;
          opacity: 0.7;
        }
        
        .lazy-loading-icon {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .loading-spinner {
          width: 100%;
          height: 100%;
          border: 2px solid rgba(40, 215, 255, 0.2);
          border-top: 2px solid #28D7FF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        
        .char-set-indicator::after {
          content: ' (Click: cycle, Double-click: wave)';
          font-size: 8px;
          opacity: 0.6;
          margin-left: 4px;
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
          
          /* 3D transform optimizations for smooth rotation */
          transform-style: preserve-3d;
          backface-visibility: visible;
          perspective: 1000px;
          
          /* Ensure GSAP can animate this element smoothly */
          will-change: transform;
          
          /* Hardware acceleration for smoother animations */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }

        .ascii-line {
          display: block;
          transform-style: preserve-3d;
          will-change: transform, opacity;
          /* Remove transition to avoid conflicts with GSAP */
          /* transition: all 0.2s ease; */
        }

        .ascii-char {
          display: inline-block;
          cursor: pointer;
          transform-style: preserve-3d;
          will-change: transform;
          /* Remove transition to avoid conflicts with GSAP */
          /* transition: all 0.2s ease; */
        }
        
        /* Remove individual character hover effects to avoid conflicts with main rotation */
        /* .ascii-char:hover {
          transform: scale(1.3) translateZ(3px) rotate(2deg);
          filter: brightness(1.5) drop-shadow(0 0 8px currentColor);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        } */
        
        /* Remove individual character hover effects to avoid conflicts with main rotation */
        /* .ascii-art-container.hovered .ascii-char {
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ascii-art-container.hovered .ascii-char:hover {
          transform: scale(1.4) translateZ(5px) rotateY(15deg) rotateX(10deg);
          filter: brightness(1.8) drop-shadow(0 0 12px currentColor);
          z-index: 20;
        } */

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
          
          /* Disable hover effects on mobile */
          .ascii-art-container:hover {
            transform: none;
          }
          
          .ascii-art-container:hover .char-set-indicator {
            opacity: 0.7;
            transform: none;
          }
          
          /* Reduce animation complexity on mobile */
          .ascii-line {
            transition: none;
          }
          
          .ascii-char {
            transition: none;
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
          
          .ascii-lazy-placeholder {
            font-size: 0.9rem;
          }
          
          .lazy-loading-icon {
            width: 30px;
            height: 30px;
          }
        }

        @media (max-width: 320px) {
          .ascii-text {
            font-size: 4px;
          }
          
          .ascii-art-container {
            padding: 0.25rem;
            min-height: 100px;
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