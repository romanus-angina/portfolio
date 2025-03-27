import { useEffect, useRef } from 'react';

const CursorGlow = () => {
  const glowRef = useRef(null);
  
  useEffect(() => {
    const glow = glowRef.current;
    
    if (!glow) return;
    
    
    glow.style.opacity = "0.50";
    
    const onMouseMove = (e) => {
      // Direct DOM manipulation for maximum performance and consistency
      if (glow) {
        // Update position without changing any other properties
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };
    
    // Set up event listener
    document.addEventListener('mousemove', onMouseMove);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);
  
  // Build smooth gradient with 30 steps
  const buildUltraSmoothGradient = () => {
    const steps = 30;
    let gradient = 'radial-gradient(circle at center,';
    
    for (let i = 0; i <= steps; i++) {
      const percentage = (i / steps) * 100;
      
      // Calculate opacity with a smooth curve that tapers off gradually
      // Cubic function for smoother tapering at the edges
      let opacity;
      if (i === 0) {
        opacity = 0.35; 
      } else {
        // Cubic function that starts higher and falls off very gradually
        const t = i / steps;
        opacity = 0.35 * Math.pow(1 - t, 3);
        
        // Ensure we never go below 0.001 until the very end
        if (i < steps && opacity < 0.001) opacity = 0.001;
        if (i === steps) opacity = 0; // Final step is always 0
      }
      
      // Add the color stop
      gradient += ` rgba(255, 255, 255, ${opacity.toFixed(5)}) ${percentage.toFixed(2)}%`;
      
      if (i < steps) {
        gradient += ',';
      }
    }
    
    gradient += ')';
    return gradient;
  };
  
  return (
    <div 
      ref={glowRef} 
      className="cursor-glow"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9998,
        width: '1000px',
        height: '1000px',
        left: 0,
        top: 0,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: buildUltraSmoothGradient(),
        mixBlendMode: 'screen',
        willChange: 'left, top'
      }}
    />
  );
};

export default CursorGlow;