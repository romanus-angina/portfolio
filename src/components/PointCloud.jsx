import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const PointCloud = () => {
  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const [isClient, setIsClient] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0, worldX: 0, worldY: 0 });
  const isMouseInside = useRef(false);
  const explosionInProgressRef = useRef(false); // Track explosion state in a ref for immediate access
  
  // Refs for Three.js objects
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const pointCloudRef = useRef(null);
  const animationRef = useRef(null);
  const rotationRef = useRef({ x: -0.2205, y: 0, z: 0 }); // Store current rotation values
  const rotationDirectionRef = useRef(1); // 1 for positive direction, -1 for negative direction
  
  // Configuration for rotation
  const ROTATION_SPEED = 0.0007; 
  const MAX_Y_ROTATION = 0.49; 
  
  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Initialize Three.js scene
  useEffect(() => {
    const mounted = { current: true };
    if (!isClient || !containerRef.current) return;
    
    console.log("Initializing point cloud profile...");
    setStatus("Setting up Three.js...");
    
    const init = async () => {
      try {
        // Dynamically import Three.js
        const THREE = await import('three');

        if (!mounted.current) return;
        
        // Create scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.background = new THREE.Color(0x1e1e24);
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        cameraRef.current = camera;
        camera.position.z = 30;
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        rendererRef.current = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0);
        
        // Clear container and add renderer
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);
        
        // Create a simple cube grid as a fallback
        createSimpleGrid(THREE);
        
        // Add event listeners for mouse movement
        containerRef.current.addEventListener('mousemove', handleMouseMove);
        containerRef.current.addEventListener('mouseenter', () => { isMouseInside.current = true; });
        containerRef.current.addEventListener('mouseleave', () => { 
          isMouseInside.current = false; 
          resetAllParticles();
        });
        
        // Add click event listener for explosion effect
        containerRef.current.addEventListener('click', explodePointCloud);
        
        // Start animation
        animate();
        
        // Try loading the profile image
        loadProfileImage(THREE);
      } catch (err) {
        console.error("Error initializing Three.js:", err);
        setError(`Initialization error: ${err.message}`);
        setLoading(false);
      }
    };
    
    // Start initialization
    init();
    
    // Cleanup function
    return () => {
      mounted.current = false;
      console.log("Cleaning up point cloud resources");
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseenter', () => { isMouseInside.current = true; });
        containerRef.current.removeEventListener('mouseleave', () => { isMouseInside.current = false; });
        containerRef.current.removeEventListener('click', explodePointCloud);
        
        if (rendererRef.current && rendererRef.current.domElement) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {
            console.log("Error removing renderer from DOM:", e);
          }
        }
      }
      
      // Dispose Three.js resources
      try {
        if (pointCloudRef.current) {
          if (pointCloudRef.current.children) {
            pointCloudRef.current.children.forEach(child => {
              if (child.geometry) child.geometry.dispose();
              if (child.material) child.material.dispose();
            });
          }
          
          if (pointCloudRef.current.geometry) {
            pointCloudRef.current.geometry.dispose();
          }
          
          if (pointCloudRef.current.material) {
            pointCloudRef.current.material.dispose();
          }
        }
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      } catch (err) {
        console.error("Error during cleanup:", err);
      }
    };
  }, [isClient]);

  // Explode point cloud on click
  const explodePointCloud = (event) => {
    // Check both state and ref to prevent multiple explosions
    if (isExploding || explosionInProgressRef.current || !pointCloudRef.current || !pointCloudRef.current.children || pointCloudRef.current.children.length === 0) {
      // Prevent default click behavior if explosion is in progress
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // Set exploding state and ref to prevent multiple explosions
    setIsExploding(true);
    explosionInProgressRef.current = true;
    
    // Update cursor to show not-allowed during explosion
    if (containerRef.current) {
      containerRef.current.style.cursor = 'not-allowed';
    }
    
    const particles = pointCloudRef.current.children;
    
    // Stop any ongoing animations
    gsap.killTweensOf(particles.map(p => p.position));
    
    // Apply explosion effect to each particle
    particles.forEach(particle => {
      if (!particle || !particle.userData || !particle.position) return;
      
      // Store original positions if not already stored
      if (!particle.userData.explosionOriginalX) {
        particle.userData.explosionOriginalX = particle.position.x;
        particle.userData.explosionOriginalY = particle.position.y;
        particle.userData.explosionOriginalZ = particle.position.z;
      }
      
      // Calculate random explosion direction
      const explosionDirection = {
        x: (Math.random() * 2 - 1) * 30,
        y: (Math.random() * 2 - 1) * 30,
        z: (Math.random() * 2 - 1) * 30,
      };
      
      // Apply explosion animation
      gsap.to(particle.position, {
        x: particle.position.x + explosionDirection.x,
        y: particle.position.y + explosionDirection.y,
        z: particle.position.z + explosionDirection.z,
        duration: 1.5,
        ease: "power2.out",
      });
    });
    
    // After explosion, animate particles back to their original positions
    setTimeout(() => {
      // Create a timeline for the reassembly animation
      const timeline = gsap.timeline({
        onComplete: () => {
          // Only reset exploding state after a delay to ensure all animations completed
          setTimeout(() => {
            setIsExploding(false);
            explosionInProgressRef.current = false;
            
            // Restore cursor to pointer
            if (containerRef.current) {
              containerRef.current.style.cursor = 'pointer';
            }
          }, 500);
        }
      });
      
      // Random delay for each particle to create a staggered effect
      particles.forEach(particle => {
        if (!particle || !particle.userData) return;
        
        // Random delay between 0 and 1 second
        const delay = Math.random();
        
        // Animate particles back to original positions
        timeline.to(particle.position, {
          x: particle.userData.originalX,
          y: particle.userData.originalY,
          z: particle.userData.originalZ,
          duration: 2,
          ease: "elastic.out(1, 0.3)",
          delay: delay
        }, 0);
      });
    }, 2000);
  };

  // Reset all particles to their original positions
  const resetAllParticles = () => {
    if (isExploding || explosionInProgressRef.current) return; // Don't reset during explosion animation
    
    if (!pointCloudRef.current || !pointCloudRef.current.children) return;
    
    const particles = pointCloudRef.current.children;
    
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      if (!particle || !particle.userData || !particle.position) continue;
      
      gsap.to(particle.position, {
        x: particle.userData.originalX,
        y: particle.userData.originalY,
        z: particle.userData.originalZ,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  // Create a simple colored grid of cubes with circular shape
  const createSimpleGrid = (THREE) => {
    try {
      // Create a group to hold all cubes
      const group = new THREE.Group();
      pointCloudRef.current = group;
      
      // Number of rings and particles per ring
      const numRings = 10;
      const particlesPerRing = 40;
      
      // Create small cubes in a circular pattern
      for (let ring = 0; ring < numRings; ring++) {
        const radius = (ring + 1) * 1.5;
        
        for (let i = 0; i < particlesPerRing; i++) {
          const angle = (i / particlesPerRing) * Math.PI * 2;
          
          // Calculate position
          const posX = Math.cos(angle) * radius;
          const posY = Math.sin(angle) * radius;
          const posZ = 0;
          
          // Create a small cube
          const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
          
          // Different color for each cube based on position
          const hue = (ring / numRings);
          const saturation = 0.7;
          const lightness = 0.5 + (i / particlesPerRing) * 0.3;
          
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue, saturation, lightness)
          });
          
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(posX, posY, posZ);
          
          // Store original position for animation
          cube.userData.originalX = posX;
          cube.userData.originalY = posY;
          cube.userData.originalZ = posZ;
          
          // Store the column index for entrance animation
          cube.userData.columnIndex = Math.floor((posX + 15) / 1.5);
          
          // Move off screen to the right for entrance animation
          cube.position.x += 30;
          
          // Add to group
          group.add(cube);
        }
      }
      
      // Add group to scene
      sceneRef.current.add(group);
      
      // Set initial tilt and store in rotationRef
      group.rotation.x = -0.2205;
      rotationRef.current.x = -0.2205;
      
      // Animate entrance by columns
      animateByColumns(group.children);
      
      console.log("Created circular grid with", group.children.length, "cubes");
    } catch (err) {
      console.error("Error creating grid:", err);
      setError(`Grid creation error: ${err.message}`);
    }
  };
  
  // Animate entrance column by column
  const animateByColumns = (particles) => {
    if (!particles || particles.length === 0) return;
    
    // Find the range of column indices
    let minColumnIndex = Infinity;
    let maxColumnIndex = -Infinity;
    
    particles.forEach(particle => {
      if (particle.userData && particle.userData.columnIndex !== undefined) {
        minColumnIndex = Math.min(minColumnIndex, particle.userData.columnIndex);
        maxColumnIndex = Math.max(maxColumnIndex, particle.userData.columnIndex);
      }
    });
    
    const numColumns = maxColumnIndex - minColumnIndex + 1;
    console.log(`Animating ${numColumns} columns`);
    
    // Animate each column with delay
    for (let col = 0; col <= numColumns; col++) {
      const columnIndex = maxColumnIndex - col; // Right to left
      const columnDelay = col * 0.05; // 50ms delay between columns
      
      // Find particles in this column
      const columnParticles = particles.filter(
        p => p.userData && p.userData.columnIndex === columnIndex
      );
      
      // Animate the particles in this column
      gsap.to(
        columnParticles.map(p => p.position),
        {
          x: (i, target) => columnParticles[i].userData.originalX,
          duration: 0.8,
          delay: columnDelay,
          ease: "power2.out",
          overwrite: true
        }
      );
    }
  };
  
  // Load profile image
  const loadProfileImage = (THREE) => {
    setStatus("Loading profile image...");
    
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        setStatus(`Image loaded: ${img.width}x${img.height}`);
        
        try {
          // Create canvas to process image
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            console.warn("Could not get 2D context for canvas");
            setLoading(false);
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // Create point cloud from image
          createPointCloudFromImage(THREE, imageData, canvas.width, canvas.height);
          
          // Hide loading indicator
          setLoading(false);
        } catch (err) {
          console.error("Error processing image:", err);
          setStatus("Using fallback grid (image processing failed)");
          setLoading(false);
        }
      };
      
      img.onerror = () => {
        console.error("Error loading profile image - file not found or inaccessible");
        setStatus("Using fallback grid (image not found)");
        setLoading(false);
      };
      
      // Try the first path
      img.src = "images/profile.jpg";
      
    } catch (err) {
      console.error("Error setting up image load:", err);
      setStatus("Using fallback grid (image setup failed)");
      setLoading(false);
    }
  };
  
  // Create point cloud from image data in a circular shape
  const createPointCloudFromImage = (THREE, imageData, width, height) => {
    try {
      setStatus("Creating image particles...");
      
      // If we already have a point cloud, remove it
      if (pointCloudRef.current) {
        sceneRef.current.remove(pointCloudRef.current);
      }
      
      // Create a new group to hold particles
      const group = new THREE.Group();
      pointCloudRef.current = group;
      
      // Center the point cloud
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      
      // Max radius of the circle
      const maxRadius = Math.min(width, height) / 2;
      
      // Use spheres instead of point clouds to avoid the Matrix3 error
      const particleGeometry = new THREE.SphereGeometry(0.15, 4, 4);
      
      // Process image pixels in a circular pattern
      let particleCount = 0;
      const maxParticles = 10000; // Maximum number of particles
      const sampleRate = 5; // Sample every nth pixel
      
      // Organize particles by columns for entrance animation
      const columnParticles = {};
      const columnWidth = 1.5; // Width of each column
      
      // Center hole dimensions 
      const centerHoleRadius = 0; 
      
      // Loop through the image in a circular pattern
      for (let radius = centerHoleRadius; radius < maxRadius; radius += sampleRate/2) {
        // More points for outer rings, fewer for inner
        const pointsInThisRing = Math.floor(2 * Math.PI * radius / sampleRate);
        
        // Skip if we don't have at least 8 points in this ring
        if (pointsInThisRing < 8) continue;
        
        // Create particles in a ring
        for (let i = 0; i < pointsInThisRing; i++) {
          if (particleCount >= maxParticles) break;
          
          // Calculate angle and position in the image
          const angle = (i / pointsInThisRing) * Math.PI * 2;
          const imgX = Math.floor(halfWidth + radius * Math.cos(angle));
          const imgY = Math.floor(halfHeight + radius * Math.sin(angle));
          
          // Check if position is inside the image
          if (imgX >= 0 && imgX < width && imgY >= 0 && imgY < height) {
            // Get pixel data
            const i = (imgY * width + imgX) * 4;
            
            // Get color values
            const r = imageData.data[i] / 255;
            const g = imageData.data[i + 1] / 255;
            const b = imageData.data[i + 2] / 255;
            const a = imageData.data[i + 3] / 255;
            
            // Skip transparent or very dark pixels
            const brightness = (r + g + b) / 3;
            if (a < 0.5 || brightness < 0.1) continue;
            
            // Scale for the scene
            const scaleFactor = 15;
            const posX = (radius * Math.cos(angle)) / scaleFactor;
            // Flip Y axis to correct the orientation
            const posY = -(radius * Math.sin(angle)) / scaleFactor;
            // Use depth based on brightness for 2.5D 
            const posZ = brightness * 5; 
            
            // Create material with the pixel color
            const material = new THREE.MeshBasicMaterial({
              color: new THREE.Color(r, g, b)
            });
            
            // Create the particle
            const particle = new THREE.Mesh(particleGeometry, material);
            
            // Position particle at original position
            particle.position.set(posX, posY, posZ);
            
            // Store original position for animation
            particle.userData.originalX = posX;
            particle.userData.originalY = posY;
            particle.userData.originalZ = posZ;
            
            // Determine column index for entrance animation
            const columnIndex = Math.floor((posX + 15) / columnWidth);
            particle.userData.columnIndex = columnIndex;
            
            // Move off screen to the right for entrance animation
            particle.position.x += 30;
            
            // Group by column for animation
            if (!columnParticles[columnIndex]) {
              columnParticles[columnIndex] = [];
            }
            columnParticles[columnIndex].push(particle);
            
            // Add to scene
            group.add(particle);
            particleCount++;
          }
        }
      }
      
      // Add group to scene
      sceneRef.current.add(group);
      
      // Tilt the group more for a better view
      group.rotation.x = -0.2205;
      rotationRef.current.x = -0.2205;
      
      // Animate entrance by columns
      animateByColumns(group.children);
      
      console.log(`Created circular image point cloud with ${particleCount} particles in ${Object.keys(columnParticles).length} columns`);
      setStatus("Rendering point cloud");
    } catch (err) {
      console.error("Error creating point cloud from image:", err);
      setStatus("Using fallback grid (point cloud creation failed)");
    }
  };
  
  // Handle mouse movement for cursor-flow interaction
  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    
    try {
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate normalized mouse position (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Calculate world coordinates (scaled to match our scene)
      const worldX = x * 15;
      const worldY = y * 15;
      
      // Update mouse position
      mousePosition.current = { x, y, worldX, worldY };
    } catch (err) {
      console.error("Mouse movement error:", err);
    }
  };
  
  // Animation loop
  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    try {
      animationRef.current = requestAnimationFrame(animate);
      
      // Apply cursor flow effect to particles
      if (pointCloudRef.current && pointCloudRef.current.children && !isExploding && !explosionInProgressRef.current) {
        const particles = pointCloudRef.current.children;
        
        if (isMouseInside.current) {
          const mouseX = mousePosition.current.worldX;
          const mouseY = mousePosition.current.worldY;
          
          // Parameters for cursor flow effect
          const influenceRadius = 0.375; 
          const pushStrength = 2.5;
          
          // Apply effect to particles
          for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            if (!particle || !particle.userData || !particle.position) continue;
            
            // Get original position
            const origX = particle.userData.originalX;
            const origY = particle.userData.originalY;
            
            // Calculate distance to cursor
            const dx = origX - mouseX;
            const dy = origY - mouseY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // Only affect particles within influence radius
            if (distance < influenceRadius) {
              // Calculate influence factor (stronger effect closer to mouse)
              const influence = 1 - (distance / influenceRadius);
              
              // Repulsion direction (away from cursor)
              const angle = Math.atan2(dy, dx);
              
              // Push particles away from cursor
              const pushX = Math.cos(angle) * pushStrength * influence;
              const pushY = Math.sin(angle) * pushStrength * influence;
              
              // Apply movement directly
              particle.position.x = origX + pushX;
              particle.position.y = origY + pushY;
            } else {
              // Return particles to original position if not affected
              // but only if they're more than a small threshold away
              const currentX = particle.position.x;
              const currentY = particle.position.y;
              const returnThreshold = 0.05;
              
              if (Math.abs(currentX - origX) > returnThreshold || 
                  Math.abs(currentY - origY) > returnThreshold) {
                // Move 20% back toward original position each frame
                particle.position.x += (origX - currentX) * 0.2;
                particle.position.y += (origY - currentY) * 0.2;
              }
            }
          }
        } else {
          // When mouse isn't inside, gradually return all particles to original positions
          for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            if (!particle || !particle.userData || !particle.position) continue;
            
            const origX = particle.userData.originalX;
            const origY = particle.userData.originalY;
            const currentX = particle.position.x;
            const currentY = particle.position.y;
            
            // Check if particle isn't already at original position
            if (Math.abs(currentX - origX) > 0.01 || Math.abs(currentY - origY) > 0.01) {
              // Move 10% back toward original position each frame
              particle.position.x += (origX - currentX) * 0.1;
              particle.position.y += (origY - currentY) * 0.1;
            }
          }
        }
      }
      
      // Apply oscillating rotation with direction changes
      if (pointCloudRef.current) {
        // Calculate new Y rotation based on current direction and speed
        rotationRef.current.y += ROTATION_SPEED * rotationDirectionRef.current;
        
        // Check if we've hit a limit and need to change direction
        if (rotationRef.current.y >= MAX_Y_ROTATION) {
          rotationDirectionRef.current = -1; // Change to negative direction
        } else if (rotationRef.current.y <= -MAX_Y_ROTATION) {
          rotationDirectionRef.current = 1; // Change to positive direction
        }
        
        // Apply the rotation
        pointCloudRef.current.rotation.y = rotationRef.current.y;
      }
      
      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    } catch (err) {
      console.error("Animation error:", err);
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="point-cloud-wrapper">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-indicator">
            {status}
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span> {error}
        </div>
      )}
      
      <div className="profile-container">
        <div 
          ref={containerRef} 
          className={`point-cloud-container ${loading ? 'loading' : ''} ${isExploding ? 'exploding' : ''}`}
          style={{
            width: '300px',
            height: '300px',
            margin: '0 auto',
            borderRadius: '50%', // Make container circular
            overflow: 'hidden',
            position: 'relative',
            background: 'rgba(30, 30, 36, 0.5)',
            zIndex: 1,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            cursor: isExploding || explosionInProgressRef.current ? 'not-allowed' : 'pointer' // Dynamic cursor
          }}
        />
    
      </div>

      <style jsx>{`
        .point-cloud-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 2rem 0;
        }
        
        .profile-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        
        .loading-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 10;
          background-color: rgba(30, 30, 36, 0.7);
          backdrop-filter: blur(4px);
          border-radius: 50%; /* Match container shape */
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .loading-indicator {
          color: #ffffff;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.85rem;
        }
        
        .error-message {
          color: #ff6b6b;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background-color: rgba(255, 107, 107, 0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
        }
        
        .error-icon {
          margin-right: 0.5rem;
        }
        
        .point-cloud-container {
          opacity: 1;
          transform: translateY(0);
        }
        
        .point-cloud-container.loading {
          opacity: 0.5;
          transform: translateY(10px);
        }
        
        .point-cloud-container.exploding {
          pointer-events: none; /* Disable pointer events during explosion */
        }
        
        .profile-caption {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.85rem;
          color: #b3b3b3;
          margin-top: 1.25rem;
          text-align: center;
          letter-spacing: 0.5px;
        }
        
        .interaction-hint {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.5rem;
        }
        
        .caption-highlight {
          color: #ffffff;
          margin: 0 0.25rem;
        }
        
        @media (max-width: 768px) {
          .point-cloud-container {
            width: 250px !important;
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PointCloud;