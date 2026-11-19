import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, EyeOff, Pause, Play, RotateCcw } from 'lucide-react';
import { buildAnatomicalToothGroup } from './HeroToothCanvas';

export type ShowcaseModelId = 'tooth' | 'implant' | 'braces' | 'equipment';

interface ModelSpec {
  id: ShowcaseModelId;
  label: string;
  subtitle: string;
  parts: string[];
}

const MODEL_SPECS: ModelSpec[] = [
  {
    id: 'tooth',
    label: '3D Tooth Anatomy',
    subtitle: 'Sculpted enamel crown, cervical collar & bifurcated root structure',
    parts: ['Enamel Crown', 'Cervical Junction', 'Root System'],
  },
  {
    id: 'implant',
    label: '3D Dental Implant',
    subtitle: 'Threaded titanium fixture, prosthetic abutment collar & zirconia crown',
    parts: ['Zirconia Crown', 'Titanium Abutment', 'Threaded Fixture'],
  },
  {
    id: 'braces',
    label: 'Animated Braces Arch',
    subtitle: 'Dental arch crowns, precision orthodontic brackets & continuous archwire',
    parts: ['Dental Arch', 'Orthodontic Brackets', 'NiTi Archwire'],
  },
  {
    id: 'equipment',
    label: 'Dental Handpiece',
    subtitle: 'Ergonomic titanium handpiece body, turbine head & cyan LED curing tip',
    parts: ['Titanium Body', 'Precision Grip', 'Turbine & LED Tip'],
  },
];

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

export function DentalModelShowcaseCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeModel, setActiveModel] = useState<ShowcaseModelId>('implant');
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglError, setWebglError] = useState(false);

  const stateRef = useRef({
    activeModel: 'implant' as ShowcaseModelId,
    explodeFactor: 0,
    paused: false,
    resetTrigger: 0,
  });

  useEffect(() => {
    stateRef.current.activeModel = activeModel;
  }, [activeModel]);

  useEffect(() => {
    stateRef.current.explodeFactor = explodeFactor;
  }, [explodeFactor]);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);

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
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 460;
    renderer.setSize(w, h);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(0, 1.0, 6.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0, 0);
    controls.update();

    scene.add(new THREE.HemisphereLight(0xdffaff, 0x061525, 0.95));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x00d9ff, 2.0);
    rimLight.position.set(-4, 2, -4);
    scene.add(rimLight);
    const royalLight = new THREE.PointLight(0x176bff, 1.8, 15);
    royalLight.position.set(3, -1.5, -3);
    scene.add(royalLight);

    const enamelMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.11,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      ior: 1.56,
      sheen: 0.4,
      sheenColor: new THREE.Color(0x00d9ff),
    });

    const rootMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6edf4,
      roughness: 0.35,
      metalness: 0.04,
      clearcoat: 0.25,
    });

    const collarMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f6fa,
      roughness: 0.24,
    });

    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0xcbd6e0,
      metalness: 0.95,
      roughness: 0.18,
      anisotropy: 0.85,
      anisotropyRotation: 0.2,
      clearcoat: 0.4,
    });

    const cyanAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0x00d9ff,
      emissive: 0x0088aa,
      emissiveIntensity: 0.5,
      metalness: 0.72,
      roughness: 0.2,
      clearcoat: 0.85,
    });

    const royalAccentMat = new THREE.MeshPhysicalMaterial({
      color: 0x176bff,
      metalness: 0.82,
      roughness: 0.22,
      clearcoat: 0.65,
    });

    const bracketMetalMat = new THREE.MeshPhysicalMaterial({
      color: 0xe3ecf4,
      metalness: 0.96,
      roughness: 0.14,
      anisotropy: 0.8,
    });

    const ligatureMat = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      emissive: 0x00a8c8,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.15,
    });

    // 1. Tooth Model
    const toothAssembly = buildAnatomicalToothGroup(enamelMat, rootMat, collarMat);
    toothAssembly.group.position.y = 0.1;
    scene.add(toothAssembly.group);

    // 2. Dental Implant Model
    const implantGroup = new THREE.Group();
    const implantCrownGroup = new THREE.Group();
    const implantAbutmentGroup = new THREE.Group();
    const implantFixtureGroup = new THREE.Group();

    const crownLathePts = [
      new THREE.Vector2(0.01, 0.0),
      new THREE.Vector2(0.46, 0.0),
      new THREE.Vector2(0.68, 0.32),
      new THREE.Vector2(0.72, 0.75),
      new THREE.Vector2(0.55, 0.98),
      new THREE.Vector2(0.22, 0.92),
      new THREE.Vector2(0.01, 0.95),
    ];
    const implantCrownMesh = new THREE.Mesh(new THREE.LatheGeometry(crownLathePts, 48), enamelMat);
    implantCrownMesh.scale.set(1.06, 1, 0.92);
    implantCrownMesh.position.y = 0.42;
    implantCrownGroup.add(implantCrownMesh);

    const abutmentMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.41, 0.52, 6),
      cyanAccentMat,
    );
    abutmentMesh.position.y = 0.12;
    const abutmentBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.42, 0.12, 32),
      titaniumMat,
    );
    abutmentBase.position.y = -0.16;
    implantAbutmentGroup.add(abutmentMesh, abutmentBase);

    const fixtureCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.24, 1.45, 32),
      titaniumMat,
    );
    fixtureCore.position.y = -0.96;
    implantFixtureGroup.add(fixtureCore);

    const threadCount = 9;
    for (let i = 0; i < threadCount; i++) {
      const t = i / (threadCount - 1);
      const yPos = -0.36 - t * 1.15;
      const radius = THREE.MathUtils.lerp(0.43, 0.27, t);
      const threadRing = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.036, 12, 36),
        titaniumMat,
      );
      threadRing.rotation.x = Math.PI / 2 + 0.08;
      threadRing.position.y = yPos;
      implantFixtureGroup.add(threadRing);
    }

    const apexCap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), titaniumMat);
    apexCap.position.y = -1.68;
    implantFixtureGroup.add(apexCap);

    implantGroup.add(implantCrownGroup, implantAbutmentGroup, implantFixtureGroup);
    scene.add(implantGroup);

    // 3. Animated Braces Arch
    const bracesGroup = new THREE.Group();
    const teethInArch: {
      toothMesh: THREE.Group;
      basePos: THREE.Vector3;
      baseRotY: number;
      offsetFactor: number;
    }[] = [];
    const bracketMeshes: THREE.Group[] = [];

    const toothPositions = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
    const archCurvePoints: THREE.Vector3[] = [];

    toothPositions.forEach((idxVal, idx) => {
      const angle = idxVal * 0.24;
      const archRadius = 2.55;
      const x = Math.sin(angle) * archRadius;
      const z = (Math.cos(angle) - 1) * archRadius + 0.45;
      const singleToothGroup = new THREE.Group();

      const wScale = idx === 2 || idx === 3 ? 0.42 : 0.36;
      const toothBody = new THREE.Mesh(new THREE.CapsuleGeometry(wScale, 0.65, 12, 24), enamelMat);
      toothBody.scale.set(1.0, 1.0, 0.78);
      singleToothGroup.add(toothBody);

      const bracketGrp = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.08), bracketMetalMat);
      const tieTop = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.12), bracketMetalMat);
      tieTop.position.y = 0.06;
      const tieBot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.12), bracketMetalMat);
      tieBot.position.y = -0.06;
      const ligature = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 24), ligatureMat);
      ligature.position.z = 0.03;
      bracketGrp.add(plate, tieTop, tieBot, ligature);
      bracketGrp.position.set(0, 0.05, wScale * 0.8 + 0.03);

      singleToothGroup.add(bracketGrp);
      bracketMeshes.push(bracketGrp);

      singleToothGroup.position.set(x, 0, z);
      singleToothGroup.rotation.y = angle;
      bracesGroup.add(singleToothGroup);

      teethInArch.push({
        toothMesh: singleToothGroup,
        basePos: new THREE.Vector3(x, 0, z),
        baseRotY: angle,
        offsetFactor: (idx % 2 === 0 ? 1 : -1) * 0.14,
      });

      archCurvePoints.push(new THREE.Vector3(x * 1.15, 0.05, z + Math.cos(angle) * 0.35));
    });

    const wireCurve = new THREE.CatmullRomCurve3(archCurvePoints);
    const archWire = new THREE.Mesh(
      new THREE.TubeGeometry(wireCurve, 64, 0.028, 12, false),
      bracketMetalMat,
    );
    bracesGroup.add(archWire);
    scene.add(bracesGroup);

    // 4. Rotating Dental Handpiece & LED Curing Equipment Model
    const equipmentGroup = new THREE.Group();
    const equipHandleGroup = new THREE.Group();
    const equipCollarGroup = new THREE.Group();
    const equipHeadGroup = new THREE.Group();

    const handlePts = [
      new THREE.Vector2(0.01, -1.65),
      new THREE.Vector2(0.24, -1.6),
      new THREE.Vector2(0.28, -0.9),
      new THREE.Vector2(0.26, 0.0),
      new THREE.Vector2(0.21, 0.65),
      new THREE.Vector2(0.01, 0.65),
    ];
    const handleBody = new THREE.Mesh(new THREE.LatheGeometry(handlePts, 40), titaniumMat);
    equipHandleGroup.add(handleBody);

    // Royal blue & cyan ergonomic grip rings
    for (let i = 0; i < 3; i++) {
      const grip = new THREE.Mesh(
        new THREE.TorusGeometry(0.275, 0.026, 12, 36),
        i === 1 ? cyanAccentMat : royalAccentMat,
      );
      grip.rotation.x = Math.PI / 2;
      grip.position.y = -0.65 + i * 0.25;
      equipHandleGroup.add(grip);
    }

    // Angled neck collar
    const neckMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.21, 0.55, 32),
      titaniumMat,
    );
    neckMesh.position.set(0, 0.9, 0.08);
    neckMesh.rotation.x = 0.28;
    const collarRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.024, 12, 32),
      cyanAccentMat,
    );
    collarRing.rotation.x = Math.PI / 2 + 0.15;
    collarRing.position.set(0, 0.68, 0.02);
    equipCollarGroup.add(neckMesh, collarRing);

    // Contra-angle turbine head + glowing cyan optical curing ring
    const headHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.42, 32),
      titaniumMat,
    );
    headHousing.rotation.x = Math.PI / 2;
    headHousing.position.set(0, 1.18, 0.22);

    const opticalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.032, 16, 36),
      cyanAccentMat,
    );
    opticalRing.position.set(0, 1.18, 0.44);

    const burTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.36, 20),
      bracketMetalMat,
    );
    burTip.rotation.x = Math.PI / 2;
    burTip.position.set(0, 1.18, 0.62);

    equipHeadGroup.add(headHousing, opticalRing, burTip);
    equipmentGroup.add(equipHandleGroup, equipCollarGroup, equipHeadGroup);
    equipmentGroup.rotation.z = -0.32;
    scene.add(equipmentGroup);

    // Grounded glowing stage ring
    const pedestalRing = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 1.56, 64),
      new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      }),
    );
    pedestalRing.rotation.x = -Math.PI / 2;
    pedestalRing.position.y = -1.95;
    scene.add(pedestalRing);

    let frameId = 0;
    let disposed = false;
    let currentExplode = 0;
    let lastResetCount = 0;
    const clock = new THREE.Clock();
    let simTime = 0;

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

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const { activeModel: curModel, explodeFactor: targetExplode, paused: isPaused, resetTrigger } =
        stateRef.current;

      if (resetTrigger !== lastResetCount) {
        lastResetCount = resetTrigger;
        camera.position.set(0, 1.0, 6.2);
        controls.target.set(0, 0, 0);
        controls.update();
      }

      if (!isPaused) {
        simTime += delta;
      }

      currentExplode = THREE.MathUtils.damp(currentExplode, targetExplode, 6, delta);

      toothAssembly.group.visible = curModel === 'tooth';
      implantGroup.visible = curModel === 'implant';
      bracesGroup.visible = curModel === 'braces';
      equipmentGroup.visible = curModel === 'equipment';

      if (curModel === 'tooth') {
        toothAssembly.group.rotation.y = simTime * 0.45;
        toothAssembly.crownGroup.position.y = currentExplode * 0.65;
        toothAssembly.rootsGroup.position.y = -currentExplode * 0.45;
      } else if (curModel === 'implant') {
        implantGroup.rotation.y = simTime * 0.5;
        implantCrownGroup.position.y = currentExplode * 0.72;
        implantAbutmentGroup.position.y = currentExplode * 0.16;
        implantFixtureGroup.position.y = -currentExplode * 0.48;
      } else if (curModel === 'braces') {
        bracesGroup.rotation.y = Math.sin(simTime * 0.45) * 0.35;
        const alignCycle = (Math.sin(simTime * 1.1) + 1) * 0.5;
        teethInArch.forEach((item, i) => {
          const microShift = item.offsetFactor * (1 - alignCycle) * 0.55;
          item.toothMesh.position.y =
            item.basePos.y + microShift + currentExplode * (i % 2 === 0 ? 0.25 : -0.25);
          item.toothMesh.rotation.z = microShift * 0.4;
        });
        archWire.position.z = currentExplode * 0.65;
        bracketMeshes.forEach((b) => {
          b.position.z = 0.34 + currentExplode * 0.25;
        });
      } else if (curModel === 'equipment') {
        equipmentGroup.rotation.y = simTime * 0.55;
        equipHeadGroup.position.y = currentExplode * 0.5;
        equipCollarGroup.position.y = currentExplode * 0.22;
        equipHandleGroup.position.y = -currentExplode * 0.32;
      }

      controls.update();
      renderer.render(scene, camera);

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
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw <= 0 || ch <= 0) return;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      envTex.dispose();
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
  }, []);

  const currentSpec = MODEL_SPECS.find((m) => m.id === activeModel) || MODEL_SPECS[1];

  return (
    <section
      aria-label="Interactive 3D Dental Models"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#061525] via-[#082B48] to-[#061525] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-semibold text-[#00D9FF] tracking-wide mb-2">
              Interactive 3D Clinical Lab
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Explore Dental Anatomy &amp; Equipment in 3D
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#DFFAFF]/75 max-w-md">
            Rotate and separate components to see how implants, orthodontic braces, and precision handpieces work together.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-[#00D9FF]/25 bg-gradient-to-b from-[#082B48]/75 via-[#061525]/95 to-[#040E1A] shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
          {/* Top-left minimal spec label */}
          <div className="px-6 pt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">{currentSpec.label}</h3>
              <p className="text-xs sm:text-sm text-[#DFFAFF]/75">{currentSpec.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#00D9FF]/90 font-medium">
              {currentSpec.parts.map((part, idx) => (
                <span key={part} className="inline-flex items-center gap-2">
                  {idx > 0 && <span aria-hidden="true" className="text-[#DFFAFF]/35">·</span>}
                  <span>{part}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Unobstructed 3D Canvas Viewport */}
          <div className="relative h-[380px] sm:h-[460px] w-full">
            {webglError ? (
              <div className="w-full h-full flex items-center justify-center p-8 text-center text-sm text-[#DFFAFF]/75">
                Interactive 3D view requires WebGL support. All treatment details remain available below.
              </div>
            ) : (
              <div
                ref={mountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                aria-label={`Interactive 3D ${currentSpec.label} viewport`}
              />
            )}
          </div>

          {/* Collapsible Unified Bottom Control Dock */}
          <div className="px-4 pb-5 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((v) => !v)}
              className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#082B48] border border-[#00D9FF]/30 text-xs font-medium text-[#DFFAFF] hover:text-[#00D9FF] transition-colors cursor-pointer"
            >
              {dockCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{dockCollapsed ? 'Show 3D Controls' : 'Hide Controls'}</span>
            </button>

            {!dockCollapsed && (
              <div className="w-full max-w-5xl rounded-2xl bg-[#061525]/95 border border-[#00D9FF]/25 shadow-lg p-3 sm:p-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 bg-[#082B48]/60 p-1 rounded-xl border border-[#00D9FF]/15">
                  {MODEL_SPECS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveModel(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        activeModel === m.id
                          ? 'bg-gradient-to-r from-[#00D9FF] to-[#176BFF] text-[#061525] shadow-[0_0_14px_rgba(0,217,255,0.4)]'
                          : 'text-[#DFFAFF]/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-[#DFFAFF]/85">
                    <span className="whitespace-nowrap">Anatomy Separation</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={explodeFactor}
                      onChange={(e) => setExplodeFactor(Number(e.target.value))}
                      className="w-28 accent-[#00D9FF] cursor-pointer"
                      aria-label="Separate 3D dental anatomy layers"
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00D9FF]/30 text-xs font-semibold text-[#DFFAFF] hover:bg-[#082B48] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{paused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setExplodeFactor(0);
                        setPaused(false);
                        stateRef.current.resetTrigger += 1;
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00D9FF]/30 text-xs font-semibold text-[#DFFAFF] hover:bg-[#082B48] transition-colors whitespace-nowrap cursor-pointer"
                      aria-label="Reset 3D view"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
