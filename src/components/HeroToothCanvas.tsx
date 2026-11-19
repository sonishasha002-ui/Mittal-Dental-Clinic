import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function buildAnatomicalToothGroup(
  enamelMat: THREE.Material,
  rootMat: THREE.Material,
  collarMat: THREE.Material,
): {
  group: THREE.Group;
  crownGroup: THREE.Group;
  rootsGroup: THREE.Group;
} {
  const group = new THREE.Group();
  const crownGroup = new THREE.Group();
  const rootsGroup = new THREE.Group();

  const crownGeo = new THREE.SphereGeometry(1.05, 64, 48);
  const pos = crownGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    x *= 1.06;
    z *= 0.94;

    if (y > 0) {
      const r2 = x * x + z * z;
      const cuspBoost =
        0.22 * Math.exp(-((x - 0.44) ** 2 + (z - 0.36) ** 2) * 3.1) +
        0.22 * Math.exp(-((x + 0.44) ** 2 + (z - 0.36) ** 2) * 3.1) +
        0.2 * Math.exp(-((x - 0.42) ** 2 + (z + 0.38) ** 2) * 3.1) +
        0.2 * Math.exp(-((x + 0.42) ** 2 + (z + 0.38) ** 2) * 3.1);
      const centralFossa = -0.24 * Math.exp(-r2 * 4.2);
      const grooveX = -0.07 * Math.exp(-(z * z) * 14) * Math.exp(-(x * x) * 1.2);
      const grooveZ = -0.06 * Math.exp(-(x * x) * 14) * Math.exp(-(z * z) * 1.2);
      y = y * 0.68 + cuspBoost + centralFossa + grooveX + grooveZ + 0.14;
    } else {
      const neckTaper = 1 - Math.abs(y) * 0.24;
      x *= neckTaper;
      z *= neckTaper;
      y *= 0.72;
    }

    pos.setXYZ(i, x, y, z);
  }
  crownGeo.computeVertexNormals();
  const crownMesh = new THREE.Mesh(crownGeo, enamelMat);
  crownMesh.position.y = 0.52;
  crownMesh.castShadow = true;
  crownMesh.receiveShadow = true;
  crownGroup.add(crownMesh);

  const collarPoints = [
    new THREE.Vector2(0.01, -0.22),
    new THREE.Vector2(0.62, -0.18),
    new THREE.Vector2(0.84, 0.0),
    new THREE.Vector2(0.8, 0.14),
    new THREE.Vector2(0.01, 0.14),
  ];
  const collarGeo = new THREE.LatheGeometry(collarPoints, 48);
  const collarMesh = new THREE.Mesh(collarGeo, collarMat);
  collarMesh.scale.set(1.03, 1, 0.92);
  collarMesh.position.y = -0.08;
  crownGroup.add(collarMesh);

  const rootConfigs = [
    {
      start: new THREE.Vector3(-0.36, -0.05, 0.24),
      mid: new THREE.Vector3(-0.46, -0.78, 0.28),
      end: new THREE.Vector3(-0.34, -1.52, 0.18),
      rTop: 0.33,
    },
    {
      start: new THREE.Vector3(0.36, -0.05, 0.24),
      mid: new THREE.Vector3(0.46, -0.78, 0.28),
      end: new THREE.Vector3(0.32, -1.52, 0.18),
      rTop: 0.33,
    },
    {
      start: new THREE.Vector3(0.0, -0.05, -0.32),
      mid: new THREE.Vector3(0.02, -0.82, -0.44),
      end: new THREE.Vector3(0.0, -1.58, -0.28),
      rTop: 0.36,
    },
  ];

  rootConfigs.forEach((cfg) => {
    const curve = new THREE.CatmullRomCurve3([cfg.start, cfg.mid, cfg.end]);
    const tubeGeo = new THREE.TubeGeometry(curve, 24, cfg.rTop, 20, false);
    const tPos = tubeGeo.attributes.position;
    const tNorm = new THREE.Vector3();
    const center = new THREE.Vector3();
    for (let i = 0; i < tPos.count; i++) {
      const yVal = tPos.getY(i);
      const t = THREE.MathUtils.clamp(-yVal / 1.6, 0, 1);
      curve.getPointAt(t, center);
      tNorm.set(tPos.getX(i) - center.x, tPos.getY(i) - center.y, tPos.getZ(i) - center.z);
      const scale = Math.max(0.14, 1 - Math.pow(t, 1.15) * 0.86);
      tPos.setXYZ(
        i,
        center.x + tNorm.x * scale,
        center.y + tNorm.y * scale,
        center.z + tNorm.z * scale,
      );
    }
    tubeGeo.computeVertexNormals();
    const rootMesh = new THREE.Mesh(tubeGeo, rootMat);
    rootMesh.castShadow = true;
    rootsGroup.add(rootMesh);

    const tipGeo = new THREE.SphereGeometry(cfg.rTop * 0.15, 16, 12);
    const tipMesh = new THREE.Mesh(tipGeo, rootMat);
    tipMesh.position.copy(cfg.end);
    rootsGroup.add(tipMesh);
  });

  group.add(crownGroup);
  group.add(rootsGroup);
  return { group, crownGroup, rootsGroup };
}

export function HeroToothCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onMqChange);
    return () => mq.removeEventListener('change', onMqChange);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0.25, 0.65, 6.85);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.68;
    controls.target.set(0, -0.05, 0);
    controls.update();

    // Volumetric Studio Lighting on Deep Midnight Navy
    const hemiLight = new THREE.HemisphereLight(0xdffaff, 0x061525, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.25);
    keyLight.position.set(4.5, 6.5, 5.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00d9ff, 2.2);
    cyanRimLight.position.set(-4.8, 2.8, -3.5);
    scene.add(cyanRimLight);

    const royalFillLight = new THREE.PointLight(0x176bff, 2.4, 16);
    royalFillLight.position.set(3.2, -2.0, -2.5);
    scene.add(royalFillLight);

    const tealUnderGlow = new THREE.PointLight(0x00c6b7, 1.8, 12);
    tealUnderGlow.position.set(0, -2.2, 2.2);
    scene.add(tealUnderGlow);

    // Enamel & root materials
    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.11,
      metalness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      ior: 1.56,
      sheen: 0.45,
      sheenRoughness: 0.2,
      sheenColor: new THREE.Color(0x00d9ff),
      envMapIntensity: 1.3,
    });

    const collarMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f6fa,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
    });

    const rootMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6edf4,
      roughness: 0.34,
      metalness: 0.04,
      clearcoat: 0.3,
      clearcoatRoughness: 0.28,
    });

    const heroPivot = new THREE.Group();
    scene.add(heroPivot);

    const { group: toothGroup } = buildAnatomicalToothGroup(enamelMat, rootMat, collarMat);
    toothGroup.scale.setScalar(1.08);
    toothGroup.position.y = 0.15;
    heroPivot.add(toothGroup);

    // Three Glowing Cyan & Royal-Blue Orbital Rings
    const ringMatCyan = new THREE.MeshPhysicalMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.6,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.9,
    });

    const ringMatTeal = new THREE.MeshStandardMaterial({
      color: 0x00c6b7,
      emissive: 0x00c6b7,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.5,
      transparent: true,
      opacity: 0.65,
    });

    const ringMatRoyal = new THREE.MeshStandardMaterial({
      color: 0x176bff,
      emissive: 0x176bff,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.6,
      transparent: true,
      opacity: 0.52,
    });

    const orbitalGroup = new THREE.Group();
    heroPivot.add(orbitalGroup);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.024, 20, 140), ringMatCyan);
    ring1.rotation.set(Math.PI * 0.42, 0.26, 0.18);
    orbitalGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.34, 0.016, 16, 140), ringMatTeal);
    ring2.rotation.set(-Math.PI * 0.36, -0.34, 0.42);
    orbitalGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.62, 0.012, 16, 140), ringMatRoyal);
    ring3.rotation.set(Math.PI * 0.22, 0.48, -0.25);
    orbitalGroup.add(ring3);

    // Orbital luminous photonic nodes
    const beadGeo = new THREE.SphereGeometry(0.068, 16, 16);
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0xdffaff,
      emissive: 0x00d9ff,
      emissiveIntensity: 1.8,
      roughness: 0.08,
    });
    const bead1 = new THREE.Mesh(beadGeo, beadMat);
    const bead2 = new THREE.Mesh(beadGeo, beadMat);
    const bead3 = new THREE.Mesh(beadGeo, beadMat);
    ring1.add(bead1);
    ring2.add(bead2);
    ring3.add(bead3);

    // Expanding Blue Energy Wave Rings beneath the tooth
    const waveGroup = new THREE.Group();
    waveGroup.position.y = -1.92;
    scene.add(waveGroup);

    const waveMat1 = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const waveMat2 = new THREE.MeshBasicMaterial({
      color: 0x176bff,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const waveRing1 = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.15, 72), waveMat1);
    waveRing1.rotation.x = -Math.PI / 2;
    const waveRing2 = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.15, 72), waveMat2);
    waveRing2.rotation.x = -Math.PI / 2;
    waveGroup.add(waveRing1, waveRing2);

    // Volumetric cyan/royal floor glow disc
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const gCtx = glowCanvas.getContext('2d');
    if (gCtx) {
      const grad = gCtx.createRadialGradient(128, 128, 6, 128, 128, 126);
      grad.addColorStop(0, 'rgba(0, 217, 255, 0.42)');
      grad.addColorStop(0.42, 'rgba(23, 107, 255, 0.18)');
      grad.addColorStop(1, 'rgba(6, 21, 37, 0)');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 256, 256);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    glowTex.colorSpace = THREE.SRGBColorSpace;
    const floorGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false }),
    );
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.y = -2.02;
    scene.add(floorGlow);

    // Instanced floating glowing dental micro-particles
    const particleCount = 72;
    const particleGeo = new THREE.OctahedronGeometry(0.04, 1);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xdffaff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.9,
      roughness: 0.18,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particles.frustumCulled = false;

    const particleData: {
      angle: number;
      radius: number;
      yBase: number;
      speed: number;
      scale: number;
      phase: number;
    }[] = [];
    const _dummy = new THREE.Object3D();

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (i % 7) * 0.25;
      const radius = 1.65 + ((i * 37) % 100) / 58;
      const yBase = (((i * 53) % 100) / 100 - 0.5) * 3.8;
      const speed = 0.16 + ((i * 19) % 100) / 420;
      const scale = 0.45 + ((i * 29) % 100) / 115;
      const phase = i * 0.618;
      particleData.push({ angle, radius, yBase, speed, scale, phase });

      _dummy.position.set(Math.cos(angle) * radius, yBase, Math.sin(angle) * radius);
      _dummy.scale.setScalar(scale);
      _dummy.updateMatrix();
      particles.setMatrixAt(i, _dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
    particles.computeBoundingSphere();
    scene.add(particles);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let frameId = 0;
    let disposed = false;
    let contextLost = false;
    const clock = new THREE.Clock();

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function tick() {
      if (disposed) return;
      if (contextLost) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (!prefersReduced) {
        currentMouseX = THREE.MathUtils.damp(currentMouseX, targetMouseX, 4.5, delta);
        currentMouseY = THREE.MathUtils.damp(currentMouseY, targetMouseY, 4.5, delta);

        toothGroup.rotation.y = elapsed * 0.36 + currentMouseX * 0.28;
        toothGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.07 - currentMouseY * 0.14;
        toothGroup.position.y = 0.15 + Math.sin(elapsed * 1.15) * 0.12;

        ring1.rotation.z = 0.18 + elapsed * 0.24;
        ring2.rotation.z = 0.42 - elapsed * 0.18;
        ring3.rotation.z = -0.25 + elapsed * 0.12;
        orbitalGroup.rotation.y = currentMouseX * 0.2;
        orbitalGroup.rotation.x = -currentMouseY * 0.14;

        bead1.position.set(Math.cos(elapsed * 0.95) * 2.02, Math.sin(elapsed * 0.95) * 2.02, 0);
        bead2.position.set(Math.cos(-elapsed * 0.7) * 2.34, Math.sin(-elapsed * 0.7) * 2.34, 0);
        bead3.position.set(Math.cos(elapsed * 0.5) * 2.62, Math.sin(elapsed * 0.5) * 2.62, 0);

        // Energy wave expansion pulse
        const w1 = (elapsed * 0.42) % 1;
        const w2 = (elapsed * 0.42 + 0.5) % 1;
        waveRing1.scale.setScalar(0.8 + w1 * 1.6);
        waveMat1.opacity = (1 - w1) * 0.45;
        waveRing2.scale.setScalar(0.8 + w2 * 1.6);
        waveMat2.opacity = (1 - w2) * 0.38;

        for (let i = 0; i < particleCount; i++) {
          const p = particleData[i];
          const a = p.angle + elapsed * p.speed;
          const y = p.yBase + Math.sin(elapsed * 0.85 + p.phase) * 0.22;
          _dummy.position.set(Math.cos(a) * p.radius, y, Math.sin(a) * p.radius);
          _dummy.rotation.set(elapsed * 0.5 + p.phase, elapsed * 0.4, 0);
          _dummy.scale.setScalar(p.scale);
          _dummy.updateMatrix();
          particles.setMatrixAt(i, _dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);

      if (prefersReduced) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReduced) {
        renderer.render(scene, camera);
      }
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.dispose();
      envTexture.dispose();
      glowTex.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (webglUnavailable || reducedMotion) {
    return (
      <div
        className="relative w-full h-full flex items-center justify-center rounded-3xl bg-gradient-to-br from-[#082B48]/90 via-[#061525] to-[#082B48] border border-[#00D9FF]/25 p-8"
        role="img"
        aria-label="3D Dental Anatomy Visualization for Mittal Dental Clinic"
      >
        <svg viewBox="0 0 280 280" className="w-64 h-64 drop-shadow-[0_0_24px_rgba(0,217,255,0.28)]" aria-hidden="true">
          <defs>
            <linearGradient id="fallbackToothDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#DFFAFF" />
              <stop offset="100%" stopColor="#8DE8F5" />
            </linearGradient>
          </defs>
          <ellipse cx="140" cy="140" rx="112" ry="38" fill="none" stroke="#00D9FF" strokeOpacity="0.65" strokeWidth="2" transform="rotate(-18 140 140)" />
          <ellipse cx="140" cy="140" rx="122" ry="44" fill="none" stroke="#176BFF" strokeOpacity="0.45" strokeWidth="1.5" transform="rotate(16 140 140)" />
          <path
            d="M95 70 C74 70 66 95 72 122 C76 144 86 164 90 208 C92 222 106 226 113 210 C122 188 128 166 140 166 C152 166 158 188 167 210 C174 226 188 222 190 208 C194 164 204 144 208 122 C214 95 206 70 185 70 C168 70 156 80 140 80 C124 80 112 70 95 70 Z"
            fill="url(#fallbackToothDark)"
          />
          <circle cx="222" cy="96" r="5" fill="#00D9FF" />
          <circle cx="58" cy="184" r="4" fill="#00C6B7" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[470px] lg:min-h-[560px]">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Interactive 3D rotating porcelain tooth with glowing cyan orbital rings and energy waves"
      />
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-[#082B48]/90 border border-[#00D9FF]/30 text-[11px] font-medium text-[#DFFAFF] tracking-wide whitespace-nowrap">
        Drag to inspect 3D anatomy
      </div>
    </div>
  );
}
