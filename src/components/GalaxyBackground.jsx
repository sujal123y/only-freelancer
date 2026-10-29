import React, { useEffect, useRef } from 'react';

/**
 * ONLY FREELANCER // ULTRA-REALISTIC CINEMATIC GALAXY ENGINE
 * Black, White & Golden Yellow Astronomical Color Grading.
 * Features:
 * - 2,500+ astronomical temperature-mapped stars (Pure White, Crisp Diamond, Warm Gold, Amber)
 * - Authentic 6-point JWST diffraction spikes on prominent beacon stars
 * - Photorealistic logarithmic spiral galaxy with golden core bulge and deep black dust lanes
 * - Volumetric warm golden cosmic dust & subtle interstellar nebulae
 * - Pure deep black (#050505) deep space contrast
 * - Restrained golden shooting star ionization trails
 * - Smooth lerped mouse & scroll parallax with 60fps offscreen-cached rendering
 * - Complete prefers-reduced-motion and mobile optimization
 */

export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = width < 768;

    // Smoothed mouse coordinates (lerp)
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    // ==========================================
    // 1. STAR GENERATION & ASTRONOMICAL COLORS
    // ==========================================
    const starCount = isMobile ? 1200 : 2600;
    const stars = [];

    // Strictly White & Golden Yellow stellar colors
    const starColors = [
      { r: 255, g: 255, b: 255 }, // Pure White (dominant)
      { r: 245, g: 248, b: 255 }, // Crisp Diamond White
      { r: 232, g: 236, b: 242 }, // Soft Silver White
      { r: 255, g: 235, b: 160 }, // Warm Yellow White
      { r: 255, g: 212, b: 0 },   // Premium Golden Yellow (#FFD400)
      { r: 255, g: 228, b: 92 },  // Bright Gold (#FFE45C)
      { r: 240, g: 190, b: 35 },  // Deep Amber Gold
    ];

    // Seed realistic star field
    for (let i = 0; i < starCount; i++) {
      const layer = Math.random();
      let depth, baseRadius, colorIndex;

      if (layer < 0.74) {
        // Deep background stars (tiny, sharp, pure white starlight field)
        depth = 0.08 + Math.random() * 0.15;
        baseRadius = 0.35 + Math.random() * 0.55;
        colorIndex = Math.random() > 0.3 ? 0 : Math.floor(Math.random() * starColors.length);
      } else if (layer < 0.97) {
        // Midground stars (star clusters, slight warm/white glow)
        depth = 0.25 + Math.random() * 0.35;
        baseRadius = 0.75 + Math.random() * 0.85;
        colorIndex = Math.floor(Math.random() * starColors.length);
      } else {
        // Foreground beacon stars with subtle diffraction spikes
        depth = 0.65 + Math.random() * 0.35;
        baseRadius = 1.5 + Math.random() * 1.3;
        colorIndex = Math.random() > 0.5 ? 4 : 0;
      }

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 2.5,
        baseRadius,
        depth,
        color: starColors[colorIndex],
        alpha: 0.25 + Math.random() * 0.75,
        twinkleSpeed: 0.01 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        hasSpikes: layer >= 0.985, // Top 1.5% have telescope diffraction spikes
      });
    }

    // ==========================================
    // 2. OFFSCREEN NEBULA & COSMIC DUST TEXTURES
    // ==========================================
    const nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = width;
    nebulaCanvas.height = height;
    const nCtx = nebulaCanvas.getContext('2d');

    const renderNebulaeToCache = () => {
      if (!nCtx) return;
      nCtx.clearRect(0, 0, width, height);

      // Deep space pure black canvas tone
      nCtx.fillStyle = '#050505';
      nCtx.fillRect(0, 0, width, height);

      // Function to draw realistic organic volumetric gas clouds
      const drawCloud = (cx, cy, rx, ry, angle, colorStops) => {
        nCtx.save();
        nCtx.translate(cx, cy);
        nCtx.rotate(angle);
        nCtx.scale(1, ry / rx);

        const grad = nCtx.createRadialGradient(0, 0, 0, 0, 0, rx);
        colorStops.forEach(([stop, color]) => grad.addColorStop(stop, color));

        nCtx.fillStyle = grad;
        nCtx.beginPath();
        nCtx.arc(0, 0, rx, 0, Math.PI * 2);
        nCtx.fill();
        nCtx.restore();
      };

      // Nebula Cloud 1: Warm Golden Cosmic Light (Upper Right behind hero & services)
      drawCloud(width * 0.78, height * 0.28, width * 0.52, width * 0.38, -0.25, [
        [0, 'rgba(255, 212, 0, 0.085)'],
        [0.35, 'rgba(215, 170, 20, 0.045)'],
        [0.65, 'rgba(120, 90, 10, 0.02)'],
        [1, 'transparent'],
      ]);

      // Nebula Cloud 2: Delicate Gold Starlight Filament (Mid Left)
      drawCloud(width * 0.18, height * 0.55, width * 0.44, width * 0.32, 0.4, [
        [0, 'rgba(255, 228, 92, 0.065)'],
        [0.4, 'rgba(180, 140, 15, 0.035)'],
        [0.7, 'rgba(70, 50, 5, 0.015)'],
        [1, 'transparent'],
      ]);

      // Nebula Cloud 3: Warm Ambient Stellar Haze (Mid Center-Lower)
      drawCloud(width * 0.55, height * 0.72, width * 0.48, width * 0.28, -0.15, [
        [0, 'rgba(255, 240, 180, 0.05)'],
        [0.3, 'rgba(180, 145, 30, 0.025)'],
        [0.65, 'rgba(50, 40, 5, 0.01)'],
        [1, 'transparent'],
      ]);

      // Nebula Cloud 4: Distant Golden Nursery Glow (Lower right)
      drawCloud(width * 0.82, height * 0.82, width * 0.38, width * 0.25, 0.3, [
        [0, 'rgba(255, 212, 0, 0.06)'],
        [0.4, 'rgba(140, 105, 10, 0.025)'],
        [1, 'transparent'],
      ]);

      // ==========================================
      // 3. PHOTOREALISTIC DISTANT SPIRAL GALAXY
      // ==========================================
      const gx = width * 0.72;
      const gy = height * 0.22;
      const galaxyRadius = isMobile ? 140 : 230;

      nCtx.save();
      nCtx.translate(gx, gy);
      nCtx.rotate(-0.55); // Cinematic tilt
      nCtx.scale(1, 0.45); // Perspective slant

      // Galaxy Core Golden Halo
      const coreHalo = nCtx.createRadialGradient(0, 0, 0, 0, 0, galaxyRadius * 0.65);
      coreHalo.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      coreHalo.addColorStop(0.2, 'rgba(255, 235, 160, 0.35)');
      coreHalo.addColorStop(0.5, 'rgba(255, 212, 0, 0.14)');
      coreHalo.addColorStop(0.8, 'rgba(80, 65, 10, 0.03)');
      coreHalo.addColorStop(1, 'transparent');

      nCtx.fillStyle = coreHalo;
      nCtx.beginPath();
      nCtx.arc(0, 0, galaxyRadius * 0.65, 0, Math.PI * 2);
      nCtx.fill();

      // Brilliant Dense White-Gold Core
      const coreCenter = nCtx.createRadialGradient(0, 0, 0, 0, 0, galaxyRadius * 0.14);
      coreCenter.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreCenter.addColorStop(0.4, 'rgba(255, 235, 140, 0.7)');
      coreCenter.addColorStop(1, 'transparent');
      nCtx.fillStyle = coreCenter;
      nCtx.beginPath();
      nCtx.arc(0, 0, galaxyRadius * 0.14, 0, Math.PI * 2);
      nCtx.fill();

      // Two Logarithmic Spiral Arms with millions of unresolved micro-stars
      const numArmStars = isMobile ? 350 : 800;
      for (let arm = 0; arm < 2; arm++) {
        const armOffset = arm * Math.PI;
        for (let j = 0; j < numArmStars; j++) {
          const t = j / numArmStars;
          const theta = t * Math.PI * 3.8 + armOffset;
          const r = Math.pow(t, 0.65) * galaxyRadius;

          // Natural dispersion around the arm spine
          const scatter = (Math.random() - 0.5) * (18 + t * 45);
          const px = Math.cos(theta) * r + scatter;
          const py = Math.sin(theta) * r + scatter * 0.6;

          // Color shifts: warm golden stars and pure white stars
          const starAlpha = (1 - t * 0.7) * (0.25 + Math.random() * 0.65);
          const isGold = Math.random() > 0.45;

          nCtx.fillStyle = isGold
            ? `rgba(255, 212, 0, ${starAlpha})`
            : `rgba(255, 255, 255, ${starAlpha})`;

          const armStarSize = 0.4 + Math.random() * (t > 0.7 ? 1.1 : 0.8);
          nCtx.beginPath();
          nCtx.arc(px, py, armStarSize, 0, Math.PI * 2);
          nCtx.fill();
        }
      }

      // Dark Interstellar Absorption Dust Rifts cutting through the galaxy arms
      nCtx.strokeStyle = 'rgba(5, 5, 5, 0.45)';
      nCtx.lineWidth = 14;
      nCtx.filter = 'blur(6px)';
      nCtx.beginPath();
      for (let a = 0; a < 2; a++) {
        const armOffset = a * Math.PI + 0.25;
        for (let k = 0; k < 60; k++) {
          const t = k / 60;
          const theta = t * Math.PI * 2.8 + armOffset;
          const r = Math.pow(t, 0.7) * (galaxyRadius * 0.85);
          const dx = Math.cos(theta) * r;
          const dy = Math.sin(theta) * r;
          if (k === 0) nCtx.moveTo(dx, dy);
          else nCtx.lineTo(dx, dy);
        }
      }
      nCtx.stroke();
      nCtx.filter = 'none';

      nCtx.restore();
    };

    renderNebulaeToCache();

    // ==========================================
    // 4. REALISTIC SHOOTING STAR (METEOR) ENGINE
    // ==========================================
    const shootingStars = [];

    const spawnShootingStar = () => {
      if (prefersReducedMotion) return;
      const startX = Math.random() * width * 1.2 - width * 0.1;
      const startY = Math.random() * (height * 0.4);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.35; // ~45 deg diagonal
      const speed = 14 + Math.random() * 12; // Fast, realistic hypersonic burn
      const length = 120 + Math.random() * 140;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        life: 1.0,
        decay: 0.022 + Math.random() * 0.015,
        color: '#FFD400',
      });
    };

    // Spawn meteor every 7 to 13 seconds
    let meteorTimer = setInterval(() => {
      if (Math.random() > 0.3) spawnShootingStar();
    }, 8500);

    // Initial shooting star after 2 seconds
    setTimeout(spawnShootingStar, 2200);

    // ==========================================
    // 5. EVENT LISTENERS: PARALLAX & RESIZING
    // ==========================================
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      nebulaCanvas.width = width;
      nebulaCanvas.height = height;
      renderNebulaeToCache();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 6. MAIN 60FPS CINEMATIC RENDER LOOP
    // ==========================================
    let lastTime = performance.now();

    const render = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Smooth lerp mouse & scroll parallax
      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.04;
        mouse.y += (mouse.targetY - mouse.y) * 0.04;
        scrollY += (targetScrollY - scrollY) * 0.06;
      }

      const mouseNormX = (mouse.x - width / 2) / (width / 2);
      const mouseNormY = (mouse.y - height / 2) / (height / 2);

      // 1. Draw cached photorealistic background nebulae & galaxy
      const nebulaParallaxX = mouseNormX * -12;
      const nebulaParallaxY = mouseNormY * -10 - scrollY * 0.025;
      ctx.drawImage(nebulaCanvas, nebulaParallaxX, nebulaParallaxY % height);
      if (nebulaParallaxY % height !== 0) {
        ctx.drawImage(nebulaCanvas, nebulaParallaxX, (nebulaParallaxY % height) + height);
      }

      // 2. Draw Stars with multi-layered depth and twinkling
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Astronomical twinkle computation
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = Math.sin(s.twinklePhase) * 0.35 + 0.65;
        const currentAlpha = s.alpha * twinkle;

        // Parallax offset based on depth
        const parallaxX = s.x + mouseNormX * (s.depth * 30);
        const wrappedY = (s.y - scrollY * (s.depth * 0.35)) % (height * 1.5);
        const parallaxY = (wrappedY < 0 ? wrappedY + height * 1.5 : wrappedY) + mouseNormY * (s.depth * 25);

        // Render Star Point
        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(parallaxX % width, parallaxY % height, s.baseRadius * (0.85 + twinkle * 0.15), 0, Math.PI * 2);
        ctx.fill();

        // 3. Render JWST 6-Point / 4-Point Diffraction Spikes on Beacon Stars
        if (s.hasSpikes && currentAlpha > 0.4) {
          const cx = parallaxX % width;
          const cy = parallaxY % height;
          const spikeLength = s.baseRadius * 12 * twinkle;

          ctx.save();
          ctx.strokeStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();

          // Horizontal & Vertical spikes
          ctx.moveTo(cx - spikeLength, cy);
          ctx.lineTo(cx + spikeLength, cy);
          ctx.moveTo(cx, cy - spikeLength);
          ctx.lineTo(cx, cy + spikeLength);

          // Diagonal subtle secondary spikes
          const diagLen = spikeLength * 0.65;
          ctx.strokeStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha * 0.3})`;
          ctx.moveTo(cx - diagLen, cy - diagLen);
          ctx.lineTo(cx + diagLen, cy + diagLen);
          ctx.moveTo(cx - diagLen, cy + diagLen);
          ctx.lineTo(cx + diagLen, cy - diagLen);

          ctx.stroke();

          // Soft surrounding glow halo
          const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s.baseRadius * 6);
          haloGrad.addColorStop(0, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha * 0.35})`);
          haloGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, s.baseRadius * 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // 4. Render Active Shooting Stars (Meteors) with golden trails
      for (let m = shootingStars.length - 1; m >= 0; m--) {
        const meteor = shootingStars[m];
        meteor.x += meteor.dx;
        meteor.y += meteor.dy;
        meteor.life -= meteor.decay;

        if (meteor.life <= 0 || meteor.x < -100 || meteor.x > width + 100 || meteor.y > height + 100) {
          shootingStars.splice(m, 1);
          continue;
        }

        // Compute tail endpoint
        const tailX = meteor.x - (meteor.dx / Math.hypot(meteor.dx, meteor.dy)) * meteor.length;
        const tailY = meteor.y - (meteor.dy / Math.hypot(meteor.dx, meteor.dy)) * meteor.length;

        const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${meteor.life * 0.95})`);
        grad.addColorStop(0.25, `rgba(255, 212, 0, ${meteor.life * 0.75})`);
        grad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8 * meteor.life;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Bright Meteoroid Head (Pure White)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, 1.4 * meteor.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#050505',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      {/* Deep space vignette for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5, 5, 5, 0.7) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
