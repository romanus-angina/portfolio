import { useEffect, useRef, useState, useCallback } from 'react';

const GridBackground = ({ 
  variant = 'lab',
  animated = true,
  showDots = true,
  showLines = false, // Disabled grid lines
  opacity = 0.15,
       spacing = 60, // Increased spacing for fewer particles
  dotSize = 1,
  className = '',
  interactive = true
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, isHovered: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Simple particle class for grid displacement
         class Particle {
           constructor(x, y) {
             this.originalX = x;
             this.originalY = y;
             this.x = x;
             this.y = y;
             this.targetX = x;
             this.targetY = y;
             this.size = dotSize * 2; // Slightly bigger dots
             this.opacity = 0.6; // More subtle opacity
             this.velocityX = 0;
             this.velocityY = 0;
           }

           update(mouse, isHovered) {
             if (!isHovered) {
               // Smoothly return to original position
               this.targetX = this.originalX;
               this.targetY = this.originalY;
               this.opacity = 0.6;
               this.size = dotSize * 2;
             } else {
               // Calculate distance to mouse
               const dx = mouse.x - this.originalX;
               const dy = mouse.y - this.originalY;
               const distance = Math.sqrt(dx * dx + dy * dy);
               const maxDistance = 150; // Even larger interaction radius

               if (distance < maxDistance) {
                 // Calculate displacement force
                 const force = (1 - distance / maxDistance) * 40; // Much larger displacement
                 const angle = Math.atan2(dy, dx);

                 // Set target position (away from mouse)
                 this.targetX = this.originalX - Math.cos(angle) * force;
                 this.targetY = this.originalY - Math.sin(angle) * force;

                 // Increase opacity and size when close to mouse
                 this.opacity = 0.6 + (1 - distance / maxDistance) * 0.4;
                 this.size = (dotSize * 2) + (1 - distance / maxDistance) * 1;
               } else {
                 this.targetX = this.originalX;
                 this.targetY = this.originalY;
                 this.opacity = 0.6;
                 this.size = dotSize * 2;
               }
             }

             // Smooth interpolation to target position
             const smoothing = 0.25; // More responsive movement
             this.x += (this.targetX - this.x) * smoothing;
             this.y += (this.targetY - this.y) * smoothing;
           }

    draw(ctx, config) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = config.dotColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const getVariantConfig = useCallback(() => {
    const baseConfig = {
      bgColor: '#0F0F0F',
      dotColor: '#28D7FF',
      lineColor: '#1BB8E6',
      labelColor: '#5CE0FF',
      glowColor: '#28D7FF',
      scanColor: '#28D7FF',
      showLabels: false,
      showLines: false, // Default to no lines
      lineOpacity: 0.2,
      dotOpacity: 0.4,
      labelOffset: 3,
      labelFontSize: 10,
      labelInterval: 5
    };

    switch (variant) {
      case 'light':
        return { ...baseConfig, 
          bgColor: '#FFFFFF', 
          dotColor: '#3A3A3A', 
          lineColor: '#2A2A2A', 
          labelColor: '#2A2A2A',
          lineOpacity: 0.1,
          dotOpacity: 0.2
        };
      case 'strong':
        return { ...baseConfig, 
          bgColor: '#1A1A1A', 
          dotColor: '#FFFFFF', 
          lineColor: '#3A3A3A', 
          labelColor: '#3A3A3A', 
          glowColor: '#48F0A5',
          scanColor: '#48F0A5',
          lineOpacity: 0.3,
          dotOpacity: 0.6
        };
             case 'electric':
               return { ...baseConfig,
                 bgColor: '#0F0F0F',
                 dotColor: '#FFFFFF',
                 lineColor: '#1BB8E6',
                 labelColor: '#5CE0FF',
                 glowColor: '#28D7FF',
                 lineOpacity: 0.4,
                 dotOpacity: 0.8
               };
      case 'bio':
        return { ...baseConfig, 
          bgColor: '#0F0F0F', 
          dotColor: '#48F0A5', 
          lineColor: '#2EDB8A', 
          labelColor: '#6FF3B8', 
          glowColor: '#48F0A5',
          scanColor: '#48F0A5',
          lineOpacity: 0.4,
          dotOpacity: 0.8
        };
      case 'purple':
        return { ...baseConfig, 
          bgColor: '#0F0F0F', 
          dotColor: '#A855F7', 
          lineColor: '#9333EA', 
          labelColor: '#C084FC', 
          glowColor: '#A855F7',
          scanColor: '#A855F7',
          lineOpacity: 0.4,
          dotOpacity: 0.8
        };
      case 'orange':
        return { ...baseConfig, 
          bgColor: '#0F0F0F', 
          dotColor: '#F97316', 
          lineColor: '#EA580C', 
          labelColor: '#FB923C', 
          glowColor: '#F97316',
          scanColor: '#F97316',
          lineOpacity: 0.4,
          dotOpacity: 0.8
        };
      case 'pink':
        return { ...baseConfig, 
          bgColor: '#0F0F0F', 
          dotColor: '#EC4899', 
          lineColor: '#DB2777', 
          labelColor: '#F472B6', 
          glowColor: '#EC4899',
          scanColor: '#EC4899',
          lineOpacity: 0.4,
          dotOpacity: 0.8
        };
      case 'cyan':
        return { ...baseConfig, 
          bgColor: '#0F0F0F', 
          dotColor: '#06B6D4', 
          lineColor: '#0891B2', 
          labelColor: '#22D3EE', 
          glowColor: '#06B6D4',
          scanColor: '#06B6D4',
          lineOpacity: 0.4,
          dotOpacity: 0.8
        };
      case 'lab':
        return { ...baseConfig, 
          showLabels: true, 
          showLines: false, // Disabled for lab variant too
          dotColor: '#28D7FF',
          lineColor: '#1BB8E6',
          labelColor: '#5CE0FF',
          glowColor: '#28D7FF',
          scanColor: '#28D7FF',
          lineOpacity: 0.2,
          dotOpacity: 0.4,
          labelOffset: 3,
          labelInterval: 5
        };
      default:
        return baseConfig;
    }
  }, [variant]);

  const updateDimensions = useCallback(() => {
    const newDims = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    console.log('Updating dimensions:', newDims);
    setDimensions(newDims);
  }, []);

  // Force initial dimensions
  useEffect(() => {
    console.log('Force dimensions check:', dimensions);
    if (dimensions.width === 0) {
      console.log('Forcing dimension update...');
      updateDimensions();
    }
  }, [dimensions.width, updateDimensions]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

         // Initialize particles
         const initializeParticles = useCallback((width, height) => {
           const particles = [];
           const cols = Math.ceil(width / spacing);
           const rows = Math.ceil(height / spacing);

           // Add some padding to prevent edge clipping
           const padding = spacing;
           const startX = -padding;
           const startY = -padding;
           const endX = width + padding;
           const endY = height + padding;

           for (let row = 0; row <= rows + 2; row++) {
             for (let col = 0; col <= cols + 2; col++) {
               const x = startX + col * spacing;
               const y = startY + row * spacing;
               // Only add particles that are within or near the viewport
               if (x >= -spacing && x <= endX && y >= -spacing && y <= endY) {
                 particles.push(new Particle(x, y));
               }
             }
           }

           particlesRef.current = particles;
           console.log(`Initialized ${particles.length} particles`);
         }, [spacing]);

  // Simple animation loop focused on displacement
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const config = getVariantConfig();
    const { width, height } = dimensions;
    const mouse = mouseRef.current;
    
    // Fallback dimensions
    const finalWidth = width || canvas.width;
    const finalHeight = height || canvas.height;
    
    console.log('Animating with dimensions:', { width: finalWidth, height: finalHeight, particles: particlesRef.current.length });

    // Clear canvas
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, finalWidth, finalHeight);

    // Draw static grid lines
    if (showLines || config.showLines) {
      ctx.save();
      ctx.strokeStyle = config.lineColor;
      ctx.globalAlpha = config.lineOpacity;
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let i = 0; i <= Math.ceil(finalWidth / spacing); i++) {
        const x = i * spacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, finalHeight);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= Math.ceil(finalHeight / spacing); i++) {
        const y = i * spacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(finalWidth, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Update and draw particles with displacement
    if (showDots) {
      // Debug: Log mouse state occasionally
      if (Math.random() < 0.01) { // 1% chance to log
        console.log('Mouse state:', { x: mouse.x, y: mouse.y, isHovered: mouse.isHovered });
      }
      
      particlesRef.current.forEach((particle, index) => {
        particle.update(mouse, mouse.isHovered);
        particle.draw(ctx, config);
      });
    }

    // Draw coordinate labels for lab variant
    if (config.showLabels) {
      ctx.save();
      ctx.fillStyle = config.labelColor;
      ctx.font = `${config.labelFontSize}px 'IBM Plex Mono', monospace`;
      ctx.globalAlpha = 0.6;

      // X-axis labels
      for (let i = 0; i <= Math.ceil(finalWidth / spacing); i += config.labelInterval) {
        const x = i * spacing;
        if (x < finalWidth - 50) {
          ctx.textAlign = 'center';
          ctx.fillText(`X:${x}`, x, config.labelOffset + config.labelFontSize);
        }
      }

      // Y-axis labels
      for (let i = 0; i <= Math.ceil(finalHeight / spacing); i += config.labelInterval) {
        const y = i * spacing;
        if (y < finalHeight - 20) {
          ctx.textAlign = 'left';
          ctx.fillText(`Y:${y}`, config.labelOffset + config.labelFontSize, y + config.labelOffset);
        }
      }
      ctx.restore();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [dimensions, showDots, showLines, getVariantConfig]);

  // Mouse event handlers
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isHovered = true; // Always hovered when moving
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovered = true;
      console.log('Mouse entered');
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      console.log('Mouse left');
    };

    // Add event listeners to the canvas element instead of window
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Also add to window for broader coverage
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  // Initialize and start animation
  useEffect(() => {
    const { width, height } = dimensions;
    console.log('Canvas initialization:', { width, height, canvas: !!canvasRef.current });
    
    // Fallback: if dimensions are still 0, use window dimensions directly
    const finalWidth = width || window.innerWidth;
    const finalHeight = height || window.innerHeight;
    
    if (finalWidth === 0 || finalHeight === 0) {
      console.log('Still no dimensions, skipping initialization');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('No canvas ref found');
      return;
    }

           // Set canvas size to match viewport exactly
           canvas.width = finalWidth;
           canvas.height = finalHeight;
           canvas.style.width = '100vw';
           canvas.style.height = '100vh';
           console.log('Canvas size set:', { width: finalWidth, height: finalHeight });

    // Initialize particles
    initializeParticles(finalWidth, finalHeight);
    console.log('Particles initialized:', particlesRef.current.length);

    // Start animation
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, initializeParticles, animate]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div 
        ref={containerRef}
        className={`grid-background-loading ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: '#0F0F0F'
        }}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`grid-background-container ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: opacity,
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        className="grid-background-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto'
        }}
      />
    </div>
  );
};

export default GridBackground;