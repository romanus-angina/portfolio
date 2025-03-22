import { useEffect, useRef } from 'react';

const MetallicBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    
    return () => {
      // No cleanup needed
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="background-container"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: -10,
        overflow: 'hidden',
      }}
    >
      <div className="metallic-bg">
        <div className="metallic-overlay"></div>
      </div>
      
      <style jsx>{`
        .metallic-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #1e1e24;
          background-image: linear-gradient(135deg, 
                            rgba(50, 50, 55, 0.4) 0%, 
                            rgba(30, 30, 35, 0.5) 20%, 
                            rgba(40, 40, 45, 0.3) 40%, 
                            rgba(25, 25, 30, 0.4) 60%, 
                            rgba(35, 35, 40, 0.3) 80%, 
                            rgba(30, 30, 35, 0.5) 100%);
          background-attachment: fixed;
        }
        
        .metallic-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
          background-size: 150px 150px;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default MetallicBackground;