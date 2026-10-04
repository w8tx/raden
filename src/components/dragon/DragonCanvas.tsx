import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface DragonCanvasProps {
  className?: string;
  isHero?: boolean;
}

export const DragonCanvas: React.FC<DragonCanvasProps> = ({ className = '', isHero = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for the entire dragon
    const dragonGroup = new THREE.Group();
    scene.add(dragonGroup);

    // Initial position: slightly to the right on desktop for hero balance
    const isMobile = window.innerWidth < 768;
    dragonGroup.position.set(isMobile ? 0 : 1.2, isMobile ? -0.4 : -0.2, 0);
    dragonGroup.scale.setScalar(isMobile ? 0.75 : 1.05);

    // Materials
    const obsidianScaleMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f0707,
      metalness: 0.9,
      roughness: 0.22,
    });

    const crimsonChitinMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d0000,
      emissive: 0x1f0000,
      metalness: 0.8,
      roughness: 0.35,
    });

    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff1a1a,
    });

    const spineGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xe50914,
      wireframe: true,
    });

    // 1. Dragon Skull & Head
    const headGroup = new THREE.Group();

    // Cranium
    const craniumGeo = new THREE.ConeGeometry(0.55, 1.4, 7);
    craniumGeo.rotateX(Math.PI / 2);
    const cranium = new THREE.Mesh(craniumGeo, obsidianScaleMaterial);
    cranium.scale.set(0.9, 0.6, 1.2);
    headGroup.add(cranium);

    // Snout / Upper Jaw
    const snoutGeo = new THREE.BoxGeometry(0.5, 0.35, 1.1);
    const snout = new THREE.Mesh(snoutGeo, obsidianScaleMaterial);
    snout.position.set(0, -0.05, 0.7);
    headGroup.add(snout);

    // Lower Jaw
    const jawGeo = new THREE.BoxGeometry(0.42, 0.2, 0.9);
    const jaw = new THREE.Mesh(jawGeo, crimsonChitinMaterial);
    jaw.position.set(0, -0.28, 0.6);
    headGroup.add(jaw);

    // Glowing Crimson Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const leftEye = new THREE.Mesh(eyeGeo, eyeGlowMaterial);
    leftEye.position.set(0.24, 0.12, 0.45);
    const rightEye = new THREE.Mesh(eyeGeo, eyeGlowMaterial);
    rightEye.position.set(-0.24, 0.12, 0.45);
    headGroup.add(leftEye);
    headGroup.add(rightEye);

    // Eye glow point lights
    const eyeLight = new THREE.PointLight(0xff1a1a, 2.5, 2.5);
    eyeLight.position.set(0, 0.15, 0.6);
    headGroup.add(eyeLight);

    // Horns (Serrated & Curved Backwards)
    const hornGeo = new THREE.ConeGeometry(0.12, 1.2, 6);
    hornGeo.rotateX(-Math.PI / 3);

    const leftHorn = new THREE.Mesh(hornGeo, obsidianScaleMaterial);
    leftHorn.position.set(0.32, 0.45, -0.4);
    leftHorn.rotation.z = -0.3;
    leftHorn.rotation.y = 0.2;
    headGroup.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeo, obsidianScaleMaterial);
    rightHorn.position.set(-0.32, 0.45, -0.4);
    rightHorn.rotation.z = 0.3;
    rightHorn.rotation.y = -0.2;
    headGroup.add(rightHorn);

    // Secondary Brow Spikes
    const spikeGeo = new THREE.ConeGeometry(0.07, 0.6, 5);
    spikeGeo.rotateX(-Math.PI / 3);
    const leftSpike = new THREE.Mesh(spikeGeo, crimsonChitinMaterial);
    leftSpike.position.set(0.22, 0.3, 0.1);
    leftSpike.rotation.z = -0.4;
    headGroup.add(leftSpike);

    const rightSpike = new THREE.Mesh(spikeGeo, crimsonChitinMaterial);
    rightSpike.position.set(-0.22, 0.3, 0.1);
    rightSpike.rotation.z = 0.4;
    headGroup.add(rightSpike);

    dragonGroup.add(headGroup);

    // 2. Articulated Spine Segments
    const spineSegments: THREE.Group[] = [];
    const segmentCount = 12;

    for (let i = 0; i < segmentCount; i++) {
      const segGroup = new THREE.Group();
      const progress = i / segmentCount;
      const radius = (1 - progress * 0.65) * 0.45;

      const bodyGeo = new THREE.DodecahedronGeometry(radius, 1);
      const bodyMesh = new THREE.Mesh(bodyGeo, i % 2 === 0 ? obsidianScaleMaterial : crimsonChitinMaterial);
      segGroup.add(bodyMesh);

      // Dorsal Fin / Spine Ridge
      const finGeo = new THREE.ConeGeometry(radius * 0.6, radius * 1.8, 4);
      finGeo.rotateX(-Math.PI / 4);
      const finMesh = new THREE.Mesh(finGeo, spineGlowMaterial);
      finMesh.position.set(0, radius * 0.8, 0);
      segGroup.add(finMesh);

      segGroup.position.set(
        Math.sin(i * 0.5) * 0.2,
        -i * 0.35,
        -i * 0.45
      );

      dragonGroup.add(segGroup);
      spineSegments.push(segGroup);
    }

    // 3. Articulated Dragon Wings (Sweeping leathery wings)
    const wingsGroup = new THREE.Group();
    wingsGroup.position.set(0, -0.2, -0.5);

    // Left Wing Armature & Membrane
    const leftWingArm = new THREE.Group();
    const wingBoneGeo = new THREE.CylinderGeometry(0.06, 0.04, 1.8, 6);
    wingBoneGeo.rotateZ(Math.PI / 2.8);
    const leftBone = new THREE.Mesh(wingBoneGeo, obsidianScaleMaterial);
    leftBone.position.set(0.9, 0.7, 0);
    leftWingArm.add(leftBone);

    // Left Wing Webbing / Membrane
    const leftMembraneShape = new THREE.Shape();
    leftMembraneShape.moveTo(0, 0);
    leftMembraneShape.lineTo(1.8, 1.2);
    leftMembraneShape.lineTo(2.4, 0.6);
    leftMembraneShape.lineTo(1.9, -0.2);
    leftMembraneShape.lineTo(1.2, -0.4);
    leftMembraneShape.lineTo(0.4, -0.2);
    leftMembraneShape.closePath();

    const leftMembraneGeo = new THREE.ShapeGeometry(leftMembraneShape);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x4a0000,
      emissive: 0x220000,
      roughness: 0.4,
      metalness: 0.6,
      side: THREE.DoubleSide,
    });
    const leftMembrane = new THREE.Mesh(leftMembraneGeo, wingMat);
    leftMembrane.position.set(0, 0, -0.05);
    leftWingArm.add(leftMembrane);
    wingsGroup.add(leftWingArm);

    // Right Wing Armature & Membrane (Mirrored)
    const rightWingArm = new THREE.Group();
    const rightBone = new THREE.Mesh(wingBoneGeo, obsidianScaleMaterial);
    rightBone.rotation.y = Math.PI;
    rightBone.position.set(-0.9, 0.7, 0);
    rightWingArm.add(rightBone);

    const rightMembrane = new THREE.Mesh(leftMembraneGeo, wingMat);
    rightMembrane.rotation.y = Math.PI;
    rightMembrane.position.set(0, 0, -0.05);
    rightWingArm.add(rightMembrane);
    wingsGroup.add(rightWingArm);

    dragonGroup.add(wingsGroup);

    // 4. Volumetric 3D Crimson Embers orbiting the Dragon
    const emberCount = 65;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberSpeeds = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 4;
      emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      emberSpeeds[i] = Math.random() * 0.02 + 0.008;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xff1a1a,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    dragonGroup.add(emberPoints);

    // Lighting Setup
    // Key Crimson Rim Light from behind
    const rimLight = new THREE.DirectionalLight(0xff1a1a, 4.5);
    rimLight.position.set(3, 4, -4);
    scene.add(rimLight);

    // Front soft ambient & directional
    const ambientLight = new THREE.AmbientLight(0x1a0505, 1.2);
    scene.add(ambientLight);

    const frontKey = new THREE.DirectionalLight(0xffffff, 0.8);
    frontKey.position.set(-2, 3, 4);
    scene.add(frontKey);

    // Pulsing Core Chest Light
    const coreLight = new THREE.PointLight(0xe50914, 2.5, 4);
    coreLight.position.set(0, -0.5, 0.2);
    dragonGroup.add(coreLight);

    // Animation & Interaction Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let scrollY = 0;
    let clock = new THREE.Clock();

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX;
      mouseY = normY;
      targetRotY = normX * 0.35;
      targetRotX = -normY * 0.25;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    let animationId: number;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Subtle breathing motion
      const breath = Math.sin(elapsed * 1.8) * 0.08;
      const floatY = Math.sin(elapsed * 1.2) * 0.12;

      // Head follows cursor smoothly
      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.06;
      headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.06;
      headGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.05;

      // Wings gentle flapping cycle
      const wingFlap = Math.sin(elapsed * 2.2) * 0.22;
      leftWingArm.rotation.z = 0.2 + wingFlap;
      rightWingArm.rotation.z = -0.2 - wingFlap;

      // Serpentine spine physics
      for (let i = 0; i < spineSegments.length; i++) {
        const seg = spineSegments[i];
        const lag = (i + 1) * 0.25;
        seg.position.x = Math.sin(elapsed * 1.5 - lag) * (0.15 + i * 0.02);
        seg.rotation.y = Math.sin(elapsed * 1.2 - lag) * 0.15;
        seg.rotation.z = Math.cos(elapsed * 1.0 - lag) * 0.08;
      }

      // Dragon root position lerp with scroll
      const scrollOffset = Math.min(scrollY * 0.0012, 1.2);
      dragonGroup.position.y = (isMobile ? -0.4 : -0.2) + floatY - scrollOffset;
      dragonGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.1;

      // Eye light and core light subtle pulse
      const pulse = Math.sin(elapsed * 3.0) * 0.4 + 1.8;
      eyeLight.intensity = pulse;
      coreLight.intensity = pulse * 1.2;

      // Animate orbiting embers
      const positions = emberGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3 + 1] += emberSpeeds[i];
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -2.0;
          positions[i * 3] = (Math.random() - 0.5) * 3.5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src="/src/assets/images/dragon_hero_cinematic_1791114781863.jpg"
          alt="Crimson Red Dragon Visual"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-80 mix-blend-screen"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Cinematic Background Scrim behind 3D Dragon */}
      {isHero && (
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-lighten pointer-events-none overflow-hidden">
          <img
            src="/src/assets/images/dragon_hero_cinematic_1791114781863.jpg"
            alt="Red Dragon Silhouette"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter contrast-125 brightness-75 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
        </div>
      )}

      {/* Three.js Interactive Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full" />
    </div>
  );
};
