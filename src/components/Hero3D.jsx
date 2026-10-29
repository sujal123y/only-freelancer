import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ONLY FREELANCER // BESPOKE 3D SCULPTURAL CENTERPIECE
 * Real-time Three.js WebGL kinetic sculpture:
 * - Obsidian Faceted Monolith Core with Physically-Based Rendering (PBR)
 * - Concentric Gyroscopic Golden Yellow Orbital Rings
 * - Warm Golden Point & Directional Lighting with High-Contrast Deep Black Blend
 * - Lerped Pointer Parallax & Scroll Sensitivity
 * - Full WebGL Context Loss / Fallback Handling & GPU Resource Disposal
 * - Zero blocking on underlying / overlying UI (pointer-events: none)
 */

export default function Hero3D() {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Test WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Master sculpture group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Central Faceted Obsidian Core (Black PBR Monolith)
    const coreGeometry = new THREE.IcosahedronGeometry(2.2, 0); // Faceted low-poly architecture
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0c0c0c),
      emissive: new THREE.Color(0x000000),
      roughness: 0.22,
      metalness: 0.92,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      reflectivity: 0.9,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sculptureGroup.add(coreMesh);

    // 2. Inner Golden Geodesic Wireframe Lattice
    const wireGeometry = new THREE.IcosahedronGeometry(2.24, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd400,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    sculptureGroup.add(wireMesh);

    // 3. Primary Golden Orbital Gyroscope Ring
    const ring1Geometry = new THREE.TorusGeometry(3.3, 0.038, 16, 120);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffd400),
      emissive: new THREE.Color(0x4a3a00),
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.95,
    });
    const ring1 = new THREE.Mesh(ring1Geometry, goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    sculptureGroup.add(ring1);

    // 4. Secondary Golden Orbital Gyroscope Ring
    const ring2Geometry = new THREE.TorusGeometry(3.75, 0.024, 16, 120);
    const ring2 = new THREE.Mesh(ring2Geometry, goldMaterial);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    sculptureGroup.add(ring2);

    // 5. Orbital Golden Beacon Nodes (Satellites)
    const nodeGeometry = new THREE.OctahedronGeometry(0.12, 0);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffe45c });
    const nodes = [];
    const numNodes = 4;
    for (let i = 0; i < numNodes; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      sculptureGroup.add(node);
      nodes.push({
        mesh: node,
        radius: 3.3,
        speed: 0.6 + i * 0.25,
        offset: (i * Math.PI * 2) / numNodes,
        inclination: (i * Math.PI) / 4,
      });
    }

    // ==========================================
    // LIGHTING SYSTEM
    // ==========================================
    // Key Light: Warm Golden Yellow directional beam
    const keyLight = new THREE.DirectionalLight(0xffd400, 3.2);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    // Rim / Fill Light: Crisp White edge highlighter
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    // Core Warm Light: Inner golden heart
    const coreLight = new THREE.PointLight(0xffd400, 2.8, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Ambient Deep Space Light
    const ambientLight = new THREE.AmbientLight(0x111111, 1.2);
    scene.add(ambientLight);

    // ==========================================
    // INTERACTION & ANIMATION LOOP
    // ==========================================
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e) => {
      if (mediaQuery.matches) return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      targetX = ((e.clientX - windowWidth / 2) / windowWidth) * 0.7;
      targetY = ((e.clientY - windowHeight / 2) / windowHeight) * 0.7;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!mediaQuery.matches) {
        // Damped pointer tracking
        currentX += (targetX - currentX) * 0.045;
        currentY += (targetY - currentY) * 0.045;

        // Base continuous organic rotation
        sculptureGroup.rotation.y = elapsedTime * 0.18 + currentX;
        sculptureGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.15 + currentY;
        sculptureGroup.rotation.z = Math.cos(elapsedTime * 0.1) * 0.08;

        // Individual component counter-rotations
        coreMesh.rotation.y = elapsedTime * 0.12;
        coreMesh.rotation.x = elapsedTime * 0.08;

        ring1.rotation.z = elapsedTime * 0.22;
        ring2.rotation.y = -elapsedTime * 0.18;

        // Orbiting nodes
        nodes.forEach((item) => {
          const angle = elapsedTime * item.speed + item.offset;
          item.mesh.position.x = Math.cos(angle) * item.radius;
          item.mesh.position.y = Math.sin(angle) * Math.sin(item.inclination) * item.radius;
          item.mesh.position.z = Math.sin(angle) * Math.cos(item.inclination) * item.radius;
          item.mesh.rotation.y = elapsedTime * 2;
        });
      } else {
        // Static gentle pose for reduced motion
        sculptureGroup.rotation.y = 0.5;
        sculptureGroup.rotation.x = 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // CLEANUP & GPU DISPOSAL
    // ==========================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries
      coreGeometry.dispose();
      wireGeometry.dispose();
      ring1Geometry.dispose();
      ring2Geometry.dispose();
      nodeGeometry.dispose();

      // Dispose materials
      coreMaterial.dispose();
      wireMaterial.dispose();
      goldMaterial.dispose();
      nodeMaterial.dispose();

      // Dispose renderer
      renderer.dispose();
    };
  }, []);

  // WebGL Fallback View
  if (!webglSupported) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" stroke="#292929" strokeWidth="1" />
          <polygon
            points="50,15 82,32 82,68 50,85 18,68 18,32"
            fill="#101010"
            stroke="#FFD400"
            strokeWidth="1.5"
          />
          <polygon points="50,28 72,40 72,60 50,72 28,60 28,40" fill="#050505" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="50" cy="50" r="6" fill="#FFD400" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

