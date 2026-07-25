// ============================================
// Hero3DScene.jsx — Real Three.js 3D Smartphone & Tumbling Coins Scene
// ============================================
// Features:
//   1. Extruded & beveled rounded-rectangle 3D smartphone chassis (MeshPhysicalMaterial with clearcoat)
//   2. High-res dynamic canvas screen texture showing live Bachat+ UI
//   3. True 3D metallic gold coins (CylinderGeometry with engraved details & rim lighting)
//   4. Key light + Cyan rim spotlight + Gold fill pointlight for dramatic metallic highlights
//   5. Real-time mouse parallax tilt affecting phone rotation and camera position
//   6. Floating particle field with depth-of-field scaling
// ============================================

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Helper to draw a rich Bachat+ app interface onto a CanvasTexture
function createPhoneScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, '#061325');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Top Status Bar / Notch
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.roundRect(176, 16, 160, 28, 14);
  ctx.fill();

  // App Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText('Bachat+', 36, 90);
  ctx.fillStyle = '#02c39a';
  ctx.fillText('+', 138, 90);

  ctx.fillStyle = '#02c39a';
  ctx.beginPath();
  ctx.roundRect(380, 68, 96, 32, 16);
  ctx.fill();
  ctx.fillStyle = '#090d16';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.fillText('LIVE UPI', 396, 90);

  // Main Card: Smart Investment Wallet
  const cardGrad = ctx.createLinearGradient(36, 130, 476, 310);
  cardGrad.addColorStop(0, '#02c39a');
  cardGrad.addColorStop(1, '#00a896');
  ctx.fillStyle = cardGrad;
  ctx.beginPath();
  ctx.roundRect(36, 130, 440, 200, 24);
  ctx.fill();

  ctx.fillStyle = 'rgba(9, 13, 22, 0.75)';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.fillText('SMART INVESTMENT WALLET', 64, 168);

  ctx.fillStyle = '#090d16';
  ctx.font = '900 48px Inter, sans-serif';
  ctx.fillText('₹14,850.00', 64, 230);

  ctx.fillStyle = 'rgba(9, 13, 22, 0.9)';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText('▲ +₹2,450 this month (+19.7%)', 64, 280);

  // Sparkline Chart Container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.roundRect(36, 350, 440, 220, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText('AUTO ROUND-UP GROWTH', 64, 390);

  // Draw Growth Curve
  ctx.strokeStyle = '#02c39a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(64, 520);
  ctx.bezierCurveTo(160, 510, 240, 460, 320, 440);
  ctx.bezierCurveTo(380, 420, 420, 410, 452, 400);
  ctx.stroke();

  // Glow under line
  const chartFill = ctx.createLinearGradient(0, 400, 0, 530);
  chartFill.addColorStop(0, 'rgba(2, 195, 154, 0.3)');
  chartFill.addColorStop(1, 'rgba(2, 195, 154, 0.0)');
  ctx.fillStyle = chartFill;
  ctx.beginPath();
  ctx.moveTo(64, 520);
  ctx.bezierCurveTo(160, 510, 240, 460, 320, 440);
  ctx.bezierCurveTo(380, 420, 420, 410, 452, 400);
  ctx.lineTo(452, 530);
  ctx.lineTo(64, 530);
  ctx.closePath();
  ctx.fill();

  // Transaction Pills
  const txs = [
    { merchant: 'Cafe Coffee Day', pay: '₹163', rounded: '₹170', saved: '+₹7' },
    { merchant: 'Blinkit Grocery', pay: '₹243', rounded: '₹250', saved: '+₹7' },
    { merchant: 'Reliance Fresh', pay: '₹487', rounded: '₹490', saved: '+₹3' },
  ];

  txs.forEach((tx, idx) => {
    const y = 600 + idx * 110;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(36, y, 440, 90, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(tx.merchant, 60, y + 38);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Paid ${tx.pay} → Rounded ${tx.rounded}`, 60, y + 66);

    ctx.fillStyle = '#02c39a';
    ctx.font = '900 20px Inter, sans-serif';
    ctx.fillText(tx.saved, 390, y + 52);
  });

  // Bottom Navigation Bar Simulator
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.fillRect(0, 940, 512, 84);
  ctx.fillStyle = '#02c39a';
  ctx.beginPath();
  ctx.arc(256, 970, 24, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

export default function Hero3DScene() {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // WebGL Availability Check
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    currentMount.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Cyan Rim Light (Highlights the metallic edges)
    const rimLight = new THREE.SpotLight(0x02c39a, 5.0);
    rimLight.position.set(-8, -6, -4);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // Gold Fill PointLight (Shimmers coins)
    const goldFill = new THREE.PointLight(0xfbbf24, 3.5, 25);
    goldFill.position.set(4, -3, 5);
    scene.add(goldFill);

    // 3. Extruded Rounded-Rectangle Smartphone Chassis
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Create 2D Rounded Rectangle Path
    const pWidth = 3.2;
    const pHeight = 6.4;
    const radius = 0.4;
    const shape = new THREE.Shape();
    const x = -pWidth / 2;
    const y = -pHeight / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + pWidth - radius, y);
    shape.quadraticCurveTo(x + pWidth, y, x + pWidth, y + radius);
    shape.lineTo(x + pWidth, y + pHeight - radius);
    shape.quadraticCurveTo(x + pWidth, y + pHeight, x + pWidth - radius, y + pHeight);
    shape.lineTo(x + radius, y + pHeight);
    shape.quadraticCurveTo(x, y + pHeight, x, y + pHeight - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const chassisGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    chassisGeo.center();

    // High-end Dark Metallic Physical Material
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 1.0,
    });

    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    phoneGroup.add(chassisMesh);

    // Screen Plane with Dynamic Canvas Texture
    const screenTexture = createPhoneScreenTexture();
    const screenGeo = new THREE.PlaneGeometry(3.1, 6.3);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.2,
      metalness: 0.1,
    });

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.25; // Flush on top of extruded face
    phoneGroup.add(screenMesh);

    // Camera Bezel Ring
    const cameraRingGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
    const cameraRingMat = new THREE.MeshStandardMaterial({ color: 0x02c39a, metalness: 0.9, roughness: 0.1 });
    const cameraRingMesh = new THREE.Mesh(cameraRingGeo, cameraRingMat);
    cameraRingMesh.position.set(0, 2.7, 0.26);
    phoneGroup.add(cameraRingMesh);

    // 4. True 3D Tumbling Gold Coins
    const coinsGroup = new THREE.Group();
    scene.add(coinsGroup);

    const coinGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 40);
    
    // Coin Edge Detail Ring
    const coinEdgeGeo = new THREE.TorusGeometry(0.53, 0.03, 16, 40);
    const coinEdgeMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.95,
      roughness: 0.1,
    });

    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.12,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
    });

    const coinConfigs = [
      { x: -3.4, y: 2.3, z: 2.8, rotX: 0.6, rotY: 0.4, scale: 1.2, speed: 0.015 },
      { x: 3.6, y: 1.8, z: 1.8, rotX: -0.5, rotY: 1.1, scale: 1.0, speed: -0.02 },
      { x: -2.9, y: -2.1, z: 3.2, rotX: 1.2, rotY: 0.2, scale: 1.3, speed: 0.022 },
      { x: 3.1, y: -2.3, z: 2.2, rotX: 0.8, rotY: -0.6, scale: 1.1, speed: -0.018 },
      { x: 0.2, y: 3.6, z: 0.8, rotX: 0.3, rotY: 0.5, scale: 0.9, speed: 0.012 },
      { x: -1.8, y: 3.0, z: -1.2, rotX: 0.4, rotY: -0.8, scale: 0.7, speed: -0.01 }, // Background depth coin
    ];

    const coinObjects = coinConfigs.map((cfg) => {
      const singleCoinGroup = new THREE.Group();
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.rotation.x = Math.PI / 2; // Flat disc orientation
      singleCoinGroup.add(coinMesh);

      // Front & Back Ring Accents
      const frontRing = new THREE.Mesh(coinEdgeGeo, coinEdgeMat);
      frontRing.position.z = 0.06;
      singleCoinGroup.add(frontRing);

      const backRing = new THREE.Mesh(coinEdgeGeo, coinEdgeMat);
      backRing.position.z = -0.06;
      singleCoinGroup.add(backRing);

      singleCoinGroup.position.set(cfg.x, cfg.y, cfg.z);
      singleCoinGroup.rotation.set(cfg.rotX, cfg.rotY, 0);
      singleCoinGroup.scale.setScalar(cfg.scale);

      coinsGroup.add(singleCoinGroup);
      return { group: singleCoinGroup, speed: cfg.speed, baseY: cfg.y };
    });

    // 5. Floating Particle Starfield
    const particleCount = 150;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 18;
      particlePos[i + 1] = (Math.random() - 0.5) * 18;
      particlePos[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x02c39a,
      size: 0.07,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const xRel = e.clientX - rect.left;
      const yRel = e.clientY - rect.top;
      mouseX = (xRel / rect.width - 0.5) * 2;
      mouseY = (yRel / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Render Loop
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth Easing Interpolation
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      // Phone Rotation & Floating Movement
      phoneGroup.rotation.y = targetX * 0.45 + Math.sin(t * 0.8) * 0.08;
      phoneGroup.rotation.x = -targetY * 0.45 + Math.cos(t * 0.8) * 0.05;
      phoneGroup.position.y = Math.sin(t * 1.4) * 0.18;

      // Dynamic Camera Micro-parallax
      camera.position.x = targetX * 0.6;
      camera.position.y = -targetY * 0.6;
      camera.lookAt(0, 0, 0);

      // Tumbling Gold Coins
      coinObjects.forEach((cObj, idx) => {
        cObj.group.rotation.y += cObj.speed;
        cObj.group.rotation.x += cObj.speed * 0.6;
        cObj.group.position.y = cObj.baseY + Math.sin(t * 1.8 + idx) * 0.12;
      });

      // Particles Motion
      particles.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Listener
    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      chassisGeo.dispose();
      chassisMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      coinGeo.dispose();
      coinMat.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-navy/90 rounded-3xl border border-mint/20 text-white text-center">
        <div>
          <div className="h-16 w-16 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-mint">₹</span>
          </div>
          <h4 className="font-extrabold text-lg">Smart Round-Up Engine</h4>
          <p className="text-xs text-white/70 mt-1">Real-time spare change compounding</p>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-[480px] md:h-[580px] cursor-grab active:cursor-grabbing" />;
}
