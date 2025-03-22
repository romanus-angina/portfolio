import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const ThreeBackground = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const pointcloudsRef = useRef(null);
  const spheresRef = useRef([]);
  const clockRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      1, 
      10000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(scene.position);
    camera.updateMatrix();
    
    // Initialize clock for animations
    const clock = new THREE.Clock();
    clockRef.current = clock;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Make background transparent
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Point cloud generation
    const pointSize = 0.05;
    const width = 80;
    const length = 160;
    
    // Utility functions for point cloud generation
    function generatePointCloudGeometry(color, width, length) {
      const geometry = new THREE.BufferGeometry();
      const numPoints = width * length;
      
      const positions = new Float32Array(numPoints * 3);
      const colors = new Float32Array(numPoints * 3);
      
      let k = 0;
      
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < length; j++) {
          const u = i / width;
          const v = j / length;
          const x = u - 0.5;
          const y = (Math.cos(u * Math.PI * 4) + Math.sin(v * Math.PI * 8)) / 20;
          const z = v - 0.5;
          
          positions[3 * k] = x;
          positions[3 * k + 1] = y;
          positions[3 * k + 2] = z;
          
          const intensity = (y + 0.1) * 5;
          colors[3 * k] = color.r * intensity;
          colors[3 * k + 1] = color.g * intensity;
          colors[3 * k + 2] = color.b * intensity;
          
          k++;
        }
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.computeBoundingBox();
      
      return geometry;
    }
    
    function generatePointcloud(color, width, length) {
      const geometry = generatePointCloudGeometry(color, width, length);
      const material = new THREE.PointsMaterial({ 
        size: pointSize, 
        vertexColors: true,
        transparent: true,
        opacity: 0.7
      });
      
      return new THREE.Points(geometry, material);
    }
    
    // Create the point clouds
    const pcBuffer = generatePointcloud(new THREE.Color(0.1, 0.2, 0.5), width, length);
    pcBuffer.scale.set(5, 10, 10);
    pcBuffer.position.set(-5, 0, 0);
    scene.add(pcBuffer);
    
    const pcBuffer2 = generatePointcloud(new THREE.Color(0.05, 0.2, 0.4), width, length);
    pcBuffer2.scale.set(5, 10, 10);
    pcBuffer2.position.set(0, 0, 0);
    scene.add(pcBuffer2);
    
    const pcBuffer3 = generatePointcloud(new THREE.Color(0.1, 0.3, 0.6), width, length);
    pcBuffer3.scale.set(5, 10, 10);
    pcBuffer3.position.set(5, 0, 0);
    scene.add(pcBuffer3);
    
    pointcloudsRef.current = [pcBuffer, pcBuffer2, pcBuffer3];
    
    // Create interaction spheres
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3498db,
      transparent: true,
      opacity: 0.8
    });
    
    const spheres = [];
    for (let i = 0; i < 40; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphere);
      spheres.push(sphere);
    }
    spheresRef.current = spheres;
    
    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.1;
    
    // Mouse position tracking
    const pointer = new THREE.Vector2();
    
    function onPointerMove(event) {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    // Window resize handler
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Animation variables
    let spheresIndex = 0;
    let toggle = 0;
    const rotateY = new THREE.Matrix4().makeRotationY(0.001);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Rotate camera slightly
      camera.applyMatrix4(rotateY);
      camera.updateMatrixWorld();
      
      // Raycasting for interactions
      raycaster.setFromCamera(pointer, camera);
      
      const intersections = raycaster.intersectObjects(pointcloudsRef.current, false);
      const intersection = (intersections.length) > 0 ? intersections[0] : null;
      
      if (toggle > 0.02 && intersection !== null) {
        spheres[spheresIndex].position.copy(intersection.point);
        spheres[spheresIndex].scale.set(1, 1, 1);
        spheresIndex = (spheresIndex + 1) % spheres.length;
        toggle = 0;
      }
      
      // Update sphere sizes
      for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[i];
        sphere.scale.multiplyScalar(0.98);
        sphere.scale.clampScalar(0.01, 1);
      }
      
      toggle += clock.getDelta();
      
      // Render the scene
      renderer.render(scene, camera);
    }
    
    // Set up event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('pointermove', onPointerMove);
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('pointermove', onPointerMove);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of resources
      if (pointcloudsRef.current) {
        pointcloudsRef.current.forEach(pc => {
          pc.geometry.dispose();
          pc.material.dispose();
        });
      }
      
      if (spheresRef.current) {
        spheresRef.current.forEach(sphere => {
          sphere.geometry.dispose();
          sphere.material.dispose();
        });
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: -1, // Behind all content
        opacity: 0.7 // Slightly transparent
      }}
    />
  );
};

export default ThreeBackground;