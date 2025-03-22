import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const AdvancedPointCloudProfile = () => {
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;
    
    // Log to help with debugging
    console.log("Initializing point cloud...");
    
    let scene, camera, renderer, pointCloud;
    let animationFrameId;
    let mouseX = 0, mouseY = 0;
    
    const init = () => {
      try {
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera - using perspective for more depth
        camera = new THREE.PerspectiveCamera(
          50, 
          1, // Square aspect ratio
          0.1, 
          1000
        );
        camera.position.z = 200;
        
        // Create renderer with explicit pixel ratio
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
        
        // Set pixel ratio and size
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0); // Transparent background
        
        // Append renderer to container
        if (containerRef.current) {
          console.log("Appending renderer to container");
          
          // Clear container first
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
          
          containerRef.current.appendChild(renderer.domElement);
        } else {
          throw new Error("Container ref is not available");
        }
        
        // Skip image loading and directly create a monochrome pattern
        createMonochromePointCloud();
        
        // Add event listeners
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onWindowResize);
        
        // Start animation
        animate();
        setIsInitialized(true);
        console.log("Point cloud initialized successfully");
      } catch (err) {
        console.error("Error initializing point cloud:", err);
        setError(err.message);
      }
    };
    
    const createMonochromePointCloud = () => {
      console.log("Creating monochrome point cloud pattern");
      try {
        // Create a spiral pattern
        const positions = [];
        const colors = [];
        const sizes = [];
        
        const particleCount = 15000;
        const radius = 100;
        
        for (let i = 0; i < particleCount; i++) {
          // Create a spiral pattern
          const progress = i / particleCount;
          const angle = progress * Math.PI * 20;
          const radiusFactor = progress * radius;
          
          // Create a flowing pattern with sine wave variations
          const variation = Math.sin(angle * 2) * 10;
          const x = Math.cos(angle) * (radiusFactor + variation);
          const y = Math.sin(angle) * (radiusFactor + variation);
          const z = (Math.random() - 0.5) * 20;
          
          positions.push(x, y, z);
          
          // White color with slight variations
          const brightness = 0.6 + Math.random() * 0.4;
          colors.push(
            brightness,
            brightness,
            brightness
          );
          
          // Vary size
          sizes.push(1.5 + Math.random());
        }
        
        createPointCloudFromArrays(positions, colors, sizes);
      } catch (err) {
        console.error("Error creating monochrome point cloud:", err);
        setError(err.message);
      }
    };
    
    const createPointCloudFromArrays = (positions, colors, sizes) => {
      try {
        // Create geometry and set attributes
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        // Create shader material for points
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            pointTexture: { value: createPointTexture() },
            mousePosition: { value: new THREE.Vector2(0, 0) }
          },
          vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            uniform vec2 mousePosition;
            
            void main() {
              vColor = color;
              
              // Get base position
              vec3 pos = position;
              
              // Add subtle wave motion based on position and time
              float waveX = sin(position.x * 0.05 + time * 0.5) * 1.5;
              float waveY = cos(position.y * 0.05 + time * 0.3) * 1.5;
              float waveZ = sin(position.z * 0.05 + time * 0.7) * 3.0;
              
              // Mouse interaction - particles move away from mouse 
              float distToMouse = length(mousePosition - vec2(pos.x, pos.y));
              float mouseEffect = 10.0 * exp(-distToMouse * 0.01); // Exponential falloff
              float mouseFactor = clamp(mouseEffect, 0.0, 20.0);
              
              // Direction from mouse
              vec2 direction = normalize(vec2(pos.x, pos.y) - mousePosition);
              
              // Apply mouse effect only for points close to mouse
              if (distToMouse < 50.0) {
                pos.x += direction.x * mouseFactor;
                pos.y += direction.y * mouseFactor;
              }
              
              // Apply wave motion
              pos.x += waveX;
              pos.y += waveY;
              pos.z += waveZ;
              
              // Calculate final position 
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (50.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
              // Get particle texture 
              vec4 texColor = texture2D(pointTexture, gl_PointCoord);
              
              // Discard transparent pixels
              if (texColor.a < 0.1) discard;
              
              // Final color with soft glow effect 
              gl_FragColor = vec4(vColor, texColor.a * 0.8);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true
        });
        
        // Create the particle system
        pointCloud = new THREE.Points(geometry, material);
        scene.add(pointCloud);
        
        console.log("Point cloud created successfully");
      } catch (err) {
        console.error("Error creating point cloud from arrays:", err);
        setError(err.message);
      }
    };
    
    // Create a soft circular texture for points
    const createPointTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      
      const context = canvas.getContext('2d');
      const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };
    
    // Mouse move handler
    const onMouseMove = (event) => {
      if (!containerRef.current) return;
      
      // Get container bounds
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the container
      mouseX = ((event.clientX - rect.left) - rect.width / 2);
      mouseY = (-(event.clientY - rect.top) + rect.height / 2);
      
      // Update shader uniform
      if (pointCloud && pointCloud.material.uniforms) {
        pointCloud.material.uniforms.mousePosition.value.set(mouseX, mouseY);
      }
    };
    
    // Handle window resize
    const onWindowResize = () => {
      if (renderer && containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        if (width && height) {
          renderer.setSize(width, height);
          if (camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update time uniform for shader animation
      if (pointCloud && pointCloud.material.uniforms) {
        pointCloud.material.uniforms.time.value += 0.01;
      }
      
      // Slowly rotate point cloud
      if (pointCloud) {
        pointCloud.rotation.y += 0.001;
      }
      
      // Render the scene
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    // Initialize
    init();
    
    // Cleanup function
    return () => {
      console.log("Cleaning up point cloud resources");
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && renderer && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      if (pointCloud) {
        if (pointCloud.geometry) pointCloud.geometry.dispose();
        if (pointCloud.material) {
          if (pointCloud.material.uniforms && pointCloud.material.uniforms.pointTexture) {
            pointCloud.material.uniforms.pointTexture.value.dispose();
          }
          pointCloud.material.dispose();
        }
      }
      
      if (renderer) renderer.dispose();
    };
  }, [isInitialized]);
  
  return (
    <div className="point-cloud-wrapper">
      {error && (
        <div className="point-cloud-error">
          Error loading point cloud: {error}
        </div>
      )}
      <div 
        ref={containerRef} 
        className="point-cloud-container" 
        style={{ 
          width: '400px', 
          height: '400px',
          margin: '0 auto',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: error ? '1px solid #ffffff' : 'none'
        }}
      />
      <style jsx>{`
        .point-cloud-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .point-cloud-error {
          color: #ffffff;
          margin-bottom: 10px;
          font-size: 14px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default AdvancedPointCloudProfile;