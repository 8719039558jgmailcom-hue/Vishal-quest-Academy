import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Crown,
  Eye,
  EyeOff,
  Footprints,
  Lock,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { getChapterNodesForSubject, getSubjectBookSections } from '../data/mpboardIndex';
import { SUBJECT_REALMS } from '../data/questConfig';
import { AdventurerState, GradeLevel, Medium, SubjectId } from '../types/quiz';
import { playFootstepSound, playPortalTransitionSound } from '../utils/soundFx';
import {
  createColosseumPavilion,
  createGradeMonolith,
  createGrandBossFortress,
  createSubjectShrineModel,
} from '../utils/threeHubModels';
import {
  BiomePalette,
  createAtmosphericSkyDome,
  createCraggyRockGeometry,
  createProceduralTextures,
  createRealisticHeroRig,
  createRealisticTree,
  createRoadBrazier,
  fbmNoise,
} from '../utils/threeMapAssets';

export type HubLandmarkId =
  | 'grade-10'
  | 'grade-12'
  | SubjectId
  | 'grand-boss'
  | 'multiplayer'
  | 'barracks';

interface LandmarkConfig {
  id: HubLandmarkId;
  kind: 'grade' | 'subject' | 'boss' | 'multiplayer' | 'barracks';
  x: number;
  z: number;
  labelHeight: number;
  subjectId?: SubjectId;
  gradeTarget?: GradeLevel;
}

const HUB_LANDMARKS: LandmarkConfig[] = [
  { id: 'grade-10', kind: 'grade', x: -5.4, z: -1.8, labelHeight: 3.6, gradeTarget: '10' },
  { id: 'grade-12', kind: 'grade', x: 5.4, z: -1.8, labelHeight: 3.9, gradeTarget: '12' },
  { id: 'hindi', kind: 'subject', x: -11.4, z: 3.1, labelHeight: 3.15, subjectId: 'hindi' },
  { id: 'english', kind: 'subject', x: -5.8, z: 6.1, labelHeight: 3.15, subjectId: 'english' },
  { id: 'maths', kind: 'subject', x: 0.0, z: 7.2, labelHeight: 3.25, subjectId: 'maths' },
  { id: 'physics', kind: 'subject', x: 5.8, z: 6.1, labelHeight: 3.25, subjectId: 'physics' },
  { id: 'chemistry', kind: 'subject', x: 11.4, z: 3.1, labelHeight: 3.25, subjectId: 'chemistry' },
  { id: 'grand-boss', kind: 'boss', x: 0.0, z: -10.2, labelHeight: 4.15 },
  { id: 'multiplayer', kind: 'multiplayer', x: 10.6, z: -5.4, labelHeight: 3.1 },
  { id: 'barracks', kind: 'barracks', x: -10.6, z: -5.4, labelHeight: 3.0 },
];

const SANCTUARY_PALETTE: BiomePalette = {
  zenithHex: 0x0c1e38,
  horizonHex: 0x35587a,
  fogHex: 0x294666,
  grassBase: '#274c33',
  grassHighlight: '#4a7a44',
  cliffColor: 0x4f5968,
  waterDeep: 0x0b3957,
  accentHex: 0xf59e0b,
  crystalHex: 0x38bdf8,
};

function groundHeightAt(x: number, z: number): number {
  const islandDist = Math.hypot(x * 0.72, z * 0.94);
  const edgeDrop = THREE.MathUtils.smoothstep(islandDist, 9.8, 15.4) * 1.9;
  const summitBoost = Math.exp(-Math.pow((x - 0) / 5.5, 2) - Math.pow((z + 10.2) / 4.2, 2)) * 1.15;
  const rollingHills =
    Math.sin(x * 0.22) * Math.cos(z * 0.25) * 0.34 +
    (fbmNoise(x * 0.18 + 14, z * 0.18 + 14, 3) - 0.5) * 0.24;
  return Math.max(-0.55, 0.42 + rollingHills + summitBoost - edgeDrop * 0.72);
}

interface ProjectedTag {
  x: number;
  y: number;
  visible: boolean;
}

interface WorldHub3DCanvasProps {
  grade: GradeLevel;
  medium: Medium;
  adventurer: AdventurerState;
  onlineCount: number;
  gradeBossSeals: number;
  grandBossUnlocked: boolean;
  grandBossCleared: boolean;
  onGradeChange: (grade: GradeLevel) => void;
  onOpenSubjectMap: (subjectId: SubjectId) => void;
  onStartGrandBoss: (grade: GradeLevel) => void;
  onOpenMultiplayer: () => void;
  onOpenLeaderboard: () => void;
  onOpenBarracks: () => void;
}

// Module-scope pre-allocated math objects for zero per-frame GC
const _vTarget = new THREE.Vector3();
const _camGoal = new THREE.Vector3();
const _targetGoal = new THREE.Vector3();
const _proj = new THREE.Vector3();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyMat = new THREE.Matrix4();
const _dummyColor = new THREE.Color();
const _axisY = new THREE.Vector3(0, 1, 0);

export function WorldHub3DCanvas({
  grade,
  medium,
  adventurer,
  onlineCount,
  gradeBossSeals,
  grandBossUnlocked,
  grandBossCleared,
  onGradeChange,
  onOpenSubjectMap,
  onStartGrandBoss,
  onOpenMultiplayer,
  onOpenLeaderboard,
  onOpenBarracks,
}: WorldHub3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [selectedId, setSelectedId] = useState<HubLandmarkId>('hindi');
  const [cameraMode, setCameraMode] = useState<'overview' | 'focus'>('overview');
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isEnteringPortal, setIsEnteringPortal] = useState(false);
  const [tags, setTags] = useState<Record<string, ProjectedTag>>({});

  const gradeRef = useRef(grade);
  gradeRef.current = grade;
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;
  const soundEnabledRef = useRef(adventurer.soundEnabled);
  soundEnabledRef.current = adventurer.soundEnabled;
  const clearedRef = useRef(adventurer.clearedStages);
  clearedRef.current = adventurer.clearedStages;
  const bossesRef = useRef(adventurer.bossesDefeated);
  bossesRef.current = adventurer.bossesDefeated;
  const grandUnlockedRef = useRef(grandBossUnlocked);
  grandUnlockedRef.current = grandBossUnlocked;

  const callbacksRef = useRef({
    onGradeChange,
    onOpenSubjectMap,
    onStartGrandBoss,
    onOpenMultiplayer,
    onOpenLeaderboard,
    onOpenBarracks,
  });
  callbacksRef.current = {
    onGradeChange,
    onOpenSubjectMap,
    onStartGrandBoss,
    onOpenMultiplayer,
    onOpenLeaderboard,
    onOpenBarracks,
  };

  const heroGoalPosRef = useRef(new THREE.Vector3(0, groundHeightAt(0, 1.4), 1.4));
  const manualOverrideRef = useRef(false);
  const diveTargetRef = useRef<HubLandmarkId | null>(null);
  const diveTimerRef = useRef<number | null>(null);
  const refreshVisualStateRef = useRef<(() => void) | null>(null);

  const subjectMetaMap = useMemo(() => {
    const out = {} as Record<
      SubjectId,
      {
        clearedCount: number;
        totalCount: number;
        stars: number;
        bossCleared: boolean;
        realmTitle: string;
        books: string;
        sections: string;
      }
    >;
    for (const realm of SUBJECT_REALMS) {
      const nodes = getChapterNodesForSubject(grade, realm.id);
      const clearedCount = nodes.filter((n) => (adventurer.clearedStages[n.id] ?? 0) > 0).length;
      const bossCleared = adventurer.bossesDefeated.includes(`${grade}-${realm.id}`);
      const stars =
        nodes.reduce((sum, n) => sum + (adventurer.clearedStages[n.id] ?? 0), 0) +
        (adventurer.clearedStages[`${grade}-${realm.id}-boss`] ?? 0);
      out[realm.id] = {
        clearedCount,
        totalCount: nodes.length,
        stars,
        bossCleared,
        realmTitle: grade === '10' ? realm.realmName10[medium] : realm.realmName12[medium],
        books: grade === '10' ? realm.ncertBooks10[medium] : realm.ncertBooks12[medium],
        sections: getSubjectBookSections(grade, realm.id)
          .map((s) => s.label[medium])
          .join(' · '),
      };
    }
    return out;
  }, [adventurer.bossesDefeated, adventurer.clearedStages, grade, medium]);

  // Keyboard shortcut 'H' for Cinema Mode HUD collapse/expand
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setHudCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (diveTimerRef.current !== null) window.clearTimeout(diveTimerRef.current);
    };
  }, []);

  // Refresh shrine rings when grade or progress updates
  useEffect(() => {
    refreshVisualStateRef.current?.();
  }, [grade, adventurer.clearedStages, adventurer.bossesDefeated, grandBossUnlocked, selectedId]);

  const moveHeroNearLandmark = (id: HubLandmarkId) => {
    const lm = HUB_LANDMARKS.find((l) => l.id === id);
    if (!lm) return;
    // Stand in front/plaza-side of the monument plinth so hero faces the shrine naturally
    const len = Math.hypot(lm.x, lm.z) || 1;
    const stepBack = 2.05;
    const gx = lm.x - (lm.x / len) * stepBack;
    const gz = lm.z - (lm.z / len) * stepBack;
    heroGoalPosRef.current.set(gx, groundHeightAt(gx, gz), gz);
  };

  const launchIntoLandmark = (id: HubLandmarkId) => {
    if (isEnteringPortal) return;
    const lm = HUB_LANDMARKS.find((l) => l.id === id);
    if (!lm) return;

    if (lm.kind === 'grade' && lm.gradeTarget) {
      setSelectedId(id);
      moveHeroNearLandmark(id);
      manualOverrideRef.current = false;
      setCameraMode('focus');
      playPortalTransitionSound(soundEnabledRef.current);
      callbacksRef.current.onGradeChange(lm.gradeTarget);
      return;
    }

    if (lm.kind === 'boss' && !grandUnlockedRef.current) {
      setSelectedId('grand-boss');
      moveHeroNearLandmark('grand-boss');
      manualOverrideRef.current = false;
      setCameraMode('focus');
      return;
    }

    setSelectedId(id);
    moveHeroNearLandmark(id);
    manualOverrideRef.current = false;
    setIsEnteringPortal(true);
    diveTargetRef.current = id;
    playPortalTransitionSound(soundEnabledRef.current);

    if (diveTimerRef.current !== null) window.clearTimeout(diveTimerRef.current);
    diveTimerRef.current = window.setTimeout(() => {
      diveTargetRef.current = null;
      setIsEnteringPortal(false);
      if (lm.kind === 'subject' && lm.subjectId) {
        callbacksRef.current.onOpenSubjectMap(lm.subjectId);
      } else if (lm.kind === 'boss') {
        callbacksRef.current.onStartGrandBoss(gradeRef.current);
      } else if (lm.kind === 'multiplayer') {
        callbacksRef.current.onOpenMultiplayer();
      } else if (lm.kind === 'barracks') {
        callbacksRef.current.onOpenBarracks();
      }
    }, 360);
  };

  const selectOrLaunchLandmark = (id: HubLandmarkId, forceFocus = true) => {
    const lm = HUB_LANDMARKS.find((l) => l.id === id);
    if (!lm) return;

    // Clicking either 3D Grade Monument switches active grade immediately while smoothly focusing
    if (lm.kind === 'grade' && lm.gradeTarget) {
      setSelectedId(id);
      moveHeroNearLandmark(id);
      manualOverrideRef.current = false;
      if (forceFocus) setCameraMode('focus');
      if (gradeRef.current !== lm.gradeTarget) {
        playPortalTransitionSound(soundEnabledRef.current);
        callbacksRef.current.onGradeChange(lm.gradeTarget);
      }
      return;
    }

    // Second click on an already-focused shrine/landmark dives into the portal!
    if (selectedIdRef.current === id && cameraModeRef.current === 'focus') {
      launchIntoLandmark(id);
      return;
    }

    setSelectedId(id);
    moveHeroNearLandmark(id);
    manualOverrideRef.current = false;
    if (forceFocus) setCameraMode('focus');
  };

  const selectOrLaunchRef = useRef(selectOrLaunchLandmark);
  selectOrLaunchRef.current = selectOrLaunchLandmark;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) ?? '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = Math.max(320, container.clientWidth);
    const height = Math.max(320, container.clientHeight);
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(SANCTUARY_PALETTE.fogHex, 0.0145);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const disposables: Array<{ dispose: () => void }> = [];
    disposables.push(envTex);

    const skyDome = createAtmosphericSkyDome(SANCTUARY_PALETTE);
    scene.add(skyDome.mesh);
    disposables.push(skyDome);

    const texSet = createProceduralTextures(
      SANCTUARY_PALETTE,
      renderer.capabilities.getMaxAnisotropy()
    );
    disposables.push(texSet);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 180);
    camera.position.set(0, 14.5, 22.4);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minDistance = 6.5;
    controls.maxDistance = 32;
    controls.minPolarAngle = 0.34;
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.target.set(0, 1.0, 0.6);
    controls.update();

    let userInteracting = false;
    const onControlStart = () => {
      userInteracting = true;
      manualOverrideRef.current = true;
    };
    const onControlEnd = () => {
      userInteracting = false;
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    // Three-Point Golden-Hour Outdoor Lighting
    const hemiLight = new THREE.HemisphereLight(0xa5c9ff, 0x2b3b2c, 0.9);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffe7c2, 2.2);
    sunLight.position.set(18, 22, -16);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 70;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.72);
    rimLight.position.set(-16, 10, 16);
    scene.add(rimLight);

    const summitGlow = new THREE.PointLight(0xf97316, 2.8, 12, 1.6);
    summitGlow.position.set(0, groundHeightAt(0, -10.2) + 2.6, -10.2);
    scene.add(summitGlow);

    // Animated Ocean Plane
    const seaGeo = new THREE.PlaneGeometry(180, 180);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshStandardMaterial({
      color: SANCTUARY_PALETTE.waterDeep,
      roughness: 0.16,
      metalness: 0.45,
      bumpMap: texSet.waterBump,
      bumpScale: 0.09,
    });
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    seaMesh.position.y = -0.2;
    seaMesh.receiveShadow = true;
    scene.add(seaMesh);
    disposables.push(seaGeo, seaMat);

    // Sculpted Sanctuary Island Terrain with Vertex Color Blending
    const terrainGeo = new THREE.PlaneGeometry(46, 38, 112, 92);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const tColors = new Float32Array(posAttr.count * 3);
    const grassTint = new THREE.Color(0xffffff);
    const sandTint = new THREE.Color(0xc5ac82);
    const rockTint = new THREE.Color(0x8a939e);

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = groundHeightAt(vx, vz);
      posAttr.setY(i, vy);

      if (vy < 0.06) {
        _dummyColor.copy(sandTint);
      } else if (vy > 0.85) {
        const blend = THREE.MathUtils.clamp((vy - 0.85) * 1.15, 0, 0.72);
        _dummyColor.copy(grassTint).lerp(rockTint, blend);
      } else {
        const shoreBlend = THREE.MathUtils.clamp((vy - 0.06) * 3.8, 0, 1);
        _dummyColor.copy(sandTint).lerp(grassTint, shoreBlend);
      }
      tColors[i * 3] = _dummyColor.r;
      tColors[i * 3 + 1] = _dummyColor.g;
      tColors[i * 3 + 2] = _dummyColor.b;
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(tColors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: texSet.terrainAlbedo,
      bumpMap: texSet.terrainBump,
      bumpScale: 0.14,
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.03,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    disposables.push(terrainGeo, terrainMat);

    // Shared Realistic Stone, Granite, Bronze, Iron, Flame Materials
    const stoneMat = new THREE.MeshStandardMaterial({
      map: texSet.stoneAlbedo,
      bumpMap: texSet.stoneBump,
      bumpScale: 0.09,
      color: 0xcbd5e1,
      roughness: 0.78,
      metalness: 0.08,
    });
    const darkGraniteMat = new THREE.MeshStandardMaterial({
      map: texSet.stoneAlbedo,
      bumpMap: texSet.stoneBump,
      bumpScale: 0.08,
      color: 0x5c6b7e,
      roughness: 0.72,
      metalness: 0.14,
    });
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xd4a34a,
      roughness: 0.28,
      metalness: 0.86,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.36,
      metalness: 0.82,
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf97316,
      emissiveIntensity: 1.45,
      roughness: 0.25,
    });
    disposables.push(stoneMat, darkGraniteMat, bronzeMat, ironMat, flameMat);

    // Central Sanctuary Courtyard Floor Ring & Radiating Flagstone Causeways
    const plazaGeo = new THREE.CylinderGeometry(2.6, 2.85, 0.18, 12);
    const plazaRingGeo = new THREE.TorusGeometry(2.45, 0.07, 8, 36);
    const plazaY = groundHeightAt(0, 1.2);
    const plaza = new THREE.Mesh(plazaGeo, stoneMat);
    plaza.position.set(0, plazaY + 0.06, 1.2);
    plaza.receiveShadow = true;
    plaza.castShadow = true;
    const plazaRim = new THREE.Mesh(plazaRingGeo, bronzeMat);
    plazaRim.rotation.x = Math.PI / 2;
    plazaRim.position.set(0, plazaY + 0.16, 1.2);
    scene.add(plaza, plazaRim);
    disposables.push(plazaGeo, plazaRingGeo);

    // Radiating flagstone ribbons from plaza center (0, 1.2) to each landmark
    const paverGeo = new THREE.BoxGeometry(0.84, 0.1, 0.56);
    const paverMatrices: THREE.Matrix4[] = [];
    HUB_LANDMARKS.forEach((lm) => {
      const start = new THREE.Vector3(0, groundHeightAt(0, 1.2) + 0.05, 1.2);
      const end = new THREE.Vector3(lm.x, groundHeightAt(lm.x, lm.z) + 0.05, lm.z);
      const steps = Math.max(5, Math.round(start.distanceTo(end) / 1.15));
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const px = THREE.MathUtils.lerp(start.x, end.x, t);
        const pz = THREE.MathUtils.lerp(start.z, end.z, t);
        const py = groundHeightAt(px, pz) + 0.04;
        const yaw = Math.atan2(end.x - start.x, end.z - start.z);
        _dummyPos.set(px, py, pz);
        _dummyQuat.setFromAxisAngle(_axisY, yaw);
        _dummyScale.set(1, 1, 1);
        const m = new THREE.Matrix4().compose(_dummyPos, _dummyQuat, _dummyScale);
        paverMatrices.push(m);
      }
    });
    const paverInst = new THREE.InstancedMesh(paverGeo, stoneMat, paverMatrices.length);
    paverInst.receiveShadow = true;
    paverInst.castShadow = true;
    paverMatrices.forEach((m, idx) => {
      paverInst.setMatrixAt(idx, m);
      const tone = 0.8 + (idx % 4) * 0.05;
      _dummyColor.setRGB(tone, tone * 0.99, tone * 0.96);
      paverInst.setColorAt(idx, _dummyColor);
    });
    paverInst.computeBoundingSphere();
    scene.add(paverInst);
    disposables.push(paverGeo);

    // Courtyard & Avenue Iron Fire Braziers
    [
      [-3.1, 0.4],
      [3.1, 0.4],
      [-7.8, 1.2],
      [7.8, 1.2],
      [-2.3, -6.2],
      [2.3, -6.2],
    ].forEach(([bx, bz]) => {
      const brazier = createRoadBrazier(darkGraniteMat, ironMat, flameMat, disposables);
      brazier.position.set(bx, groundHeightAt(bx, bz), bz);
      scene.add(brazier);
    });

    // Organic Broadleaf Trees & Craggy Cliffs around Island Perimeter
    const barkMat = new THREE.MeshStandardMaterial({
      map: texSet.barkAlbedo,
      bumpMap: texSet.barkBump,
      bumpScale: 0.08,
      roughness: 0.9,
      metalness: 0.02,
    });
    const canopyMatA = new THREE.MeshStandardMaterial({
      color: 0x2c5a34,
      bumpMap: texSet.terrainBump,
      bumpScale: 0.06,
      roughness: 0.82,
      metalness: 0.02,
    });
    const canopyMatB = new THREE.MeshStandardMaterial({
      color: 0x3b6d40,
      bumpMap: texSet.terrainBump,
      bumpScale: 0.06,
      roughness: 0.78,
      metalness: 0.03,
    });
    disposables.push(barkMat, canopyMatA, canopyMatB);

    const treeCoords: Array<[number, number]> = [
      [-15.2, -1.8],
      [-14.6, 6.2],
      [-9.2, 9.6],
      [-3.6, 10.4],
      [3.6, 10.4],
      [9.2, 9.6],
      [14.6, 6.2],
      [15.2, -1.8],
      [-14.2, -9.2],
      [-6.8, -11.8],
      [6.8, -11.8],
      [14.2, -9.2],
      [-8.5, -2.0],
      [8.5, -2.0],
    ];
    treeCoords.forEach(([tx, tz], idx) => {
      const ty = groundHeightAt(tx, tz);
      if (ty < -0.05) return;
      const tree = createRealisticTree(barkMat, canopyMatA, canopyMatB, idx + 3, disposables);
      const s = 0.9 + ((idx * 29) % 26) / 100;
      tree.position.set(tx, ty - 0.04, tz);
      tree.rotation.y = (idx * 1.15) % (Math.PI * 2);
      tree.scale.setScalar(s);
      scene.add(tree);
    });

    const rockGeo = createCraggyRockGeometry(11);
    const rockMat = new THREE.MeshStandardMaterial({
      map: texSet.stoneAlbedo,
      bumpMap: texSet.stoneBump,
      bumpScale: 0.14,
      color: SANCTUARY_PALETTE.cliffColor,
      roughness: 0.88,
      metalness: 0.05,
    });
    const rockSpots: Array<[number, number, number]> = [
      [-15.5, 2.2, 1.2],
      [15.5, 2.2, 1.2],
      [-4.2, -12.2, 1.5],
      [4.2, -12.2, 1.5],
      [-13.0, -7.8, 1.1],
      [13.0, -7.8, 1.1],
      [-9.0, 8.2, 0.9],
      [9.0, 8.2, 0.9],
      [0, -13.6, 1.65],
    ];
    const rockInst = new THREE.InstancedMesh(rockGeo, rockMat, rockSpots.length);
    rockInst.castShadow = true;
    rockInst.receiveShadow = true;
    rockSpots.forEach(([rx, rz, rScale], i) => {
      const ry = groundHeightAt(rx, rz);
      _dummyPos.set(rx, ry + rScale * 0.18, rz);
      _dummyQuat.setFromAxisAngle(_axisY, i * 1.1);
      _dummyScale.set(rScale * 1.25, rScale * 0.78, rScale);
      _dummyMat.compose(_dummyPos, _dummyQuat, _dummyScale);
      rockInst.setMatrixAt(i, _dummyMat);
    });
    rockInst.computeBoundingSphere();
    scene.add(rockInst);
    disposables.push(rockGeo, rockMat);

    // Build All 10 Interactive 3D Landmark Monuments + Proxy Colliders
    const clickableProxies: THREE.Object3D[] = [];
    const proxyGeo = new THREE.CylinderGeometry(1.75, 1.75, 3.4, 10);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(proxyGeo, proxyMat);

    const landmarkAnimators: Array<{
      id: HubLandmarkId;
      worldTagPos: THREE.Vector3;
      focusPos: THREE.Vector3;
      update: (elapsed: number) => void;
      refreshState: () => void;
    }> = [];

    HUB_LANDMARKS.forEach((lm, idx) => {
      const py = groundHeightAt(lm.x, lm.z);
      const wrap = new THREE.Group();
      wrap.position.set(lm.x, py, lm.z);

      // Face landmarks gracefully inward/toward camera
      if (lm.kind === 'subject') {
        wrap.rotation.y = Math.atan2(-lm.x, -lm.z + 18) * 0.35;
      } else if (lm.kind === 'grade') {
        wrap.rotation.y = lm.x < 0 ? 0.35 : -0.35;
      }

      const proxy = new THREE.Mesh(proxyGeo, proxyMat);
      proxy.position.y = 1.6;
      proxy.layers.set(1);
      proxy.userData.landmarkId = lm.id;
      wrap.add(proxy);
      clickableProxies.push(proxy);

      if (lm.kind === 'grade' && lm.gradeTarget) {
        const gModel = createGradeMonolith(
          lm.gradeTarget,
          stoneMat,
          darkGraniteMat,
          bronzeMat,
          disposables
        );
        wrap.add(gModel.root);
        const gradeVal = lm.gradeTarget;
        landmarkAnimators.push({
          id: lm.id,
          worldTagPos: new THREE.Vector3(lm.x, py + lm.labelHeight, lm.z),
          focusPos: new THREE.Vector3(lm.x, py + 1.4, lm.z),
          update: (elapsed) => {
            gModel.crestRotor.rotation.y = elapsed * (gradeRef.current === gradeVal ? 1.55 : 0.65);
            gModel.crestRotor.position.y =
              (gradeVal === '12' ? 1.82 : 1.6) + Math.sin(elapsed * 2.1 + idx) * 0.08;
          },
          refreshState: () => {
            const isActiveGrade = gradeRef.current === gradeVal;
            const isSel = selectedIdRef.current === lm.id;
            gModel.ringMat.emissiveIntensity = isActiveGrade ? 1.1 : isSel ? 0.8 : 0.25;
            gModel.sealMat.emissiveIntensity = isActiveGrade ? 1.15 : 0.38;
          },
        });
      } else if (lm.kind === 'subject' && lm.subjectId) {
        const sModel = createSubjectShrineModel(
          lm.subjectId,
          stoneMat,
          darkGraniteMat,
          bronzeMat,
          ironMat,
          isSoftwareGl,
          disposables
        );
        wrap.add(sModel.root);
        const subId = lm.subjectId;
        const baseY1 = sModel.artifactRotor.position.y;
        const baseY2 = sModel.secondaryRotor.position.y;

        landmarkAnimators.push({
          id: lm.id,
          worldTagPos: new THREE.Vector3(lm.x, py + lm.labelHeight, lm.z),
          focusPos: new THREE.Vector3(lm.x, py + 1.5, lm.z),
          update: (elapsed) => {
            const boost = selectedIdRef.current === lm.id ? 1.65 : 1.0;
            sModel.artifactRotor.rotation.y = elapsed * 0.72 * boost + idx;
            sModel.artifactRotor.position.y = baseY1 + Math.sin(elapsed * 2.2 + idx) * 0.075;
            sModel.secondaryRotor.rotation.y = -elapsed * 0.95 * boost;
            sModel.secondaryRotor.position.y = baseY2 + Math.cos(elapsed * 1.9 + idx) * 0.04;
          },
          refreshState: () => {
            const isSel = selectedIdRef.current === lm.id;
            const bossDone = bossesRef.current.includes(`${gradeRef.current}-${subId}`);
            sModel.ringMat.emissiveIntensity = isSel ? 1.1 : bossDone ? 0.85 : 0.42;
            sModel.coreMat.emissiveIntensity = isSel ? 1.05 : bossDone ? 0.9 : 0.6;
          },
        });
      } else if (lm.kind === 'boss') {
        const bossModel = createGrandBossFortress(darkGraniteMat, bronzeMat, flameMat, disposables);
        wrap.add(bossModel.root);
        landmarkAnimators.push({
          id: lm.id,
          worldTagPos: new THREE.Vector3(lm.x, py + lm.labelHeight, lm.z),
          focusPos: new THREE.Vector3(lm.x, py + 1.8, lm.z),
          update: (elapsed) => {
            bossModel.rotor.rotation.y = elapsed * (grandUnlockedRef.current ? 1.15 : 0.25);
            bossModel.rotor.rotation.z = Math.sin(elapsed * 1.4) * 0.14;
          },
          refreshState: () => {
            bossModel.glowMat.emissiveIntensity = grandUnlockedRef.current ? 1.05 : 0.22;
          },
        });
      } else if (lm.kind === 'multiplayer') {
        const colModel = createColosseumPavilion(stoneMat, darkGraniteMat, bronzeMat, disposables);
        wrap.add(colModel.root);
        landmarkAnimators.push({
          id: lm.id,
          worldTagPos: new THREE.Vector3(lm.x, py + lm.labelHeight, lm.z),
          focusPos: new THREE.Vector3(lm.x, py + 1.4, lm.z),
          update: (elapsed) => {
            colModel.rotor.rotation.y = elapsed * 0.85;
            colModel.rotor.position.y = 1.05 + Math.sin(elapsed * 2.0) * 0.06;
          },
          refreshState: () => {
            colModel.glowMat.emissiveIntensity = selectedIdRef.current === lm.id ? 1.1 : 0.65;
          },
        });
      } else {
        // Hero Barracks Armor & Forge Stand at (-10.6, -5.4)
        const baseGeo = new THREE.CylinderGeometry(1.3, 1.46, 0.26, 8);
        const anvilBodyGeo = new THREE.BoxGeometry(0.68, 0.42, 0.4);
        const postGeo = new THREE.CylinderGeometry(0.06, 0.075, 1.65, 8);
        const shieldGeo = new THREE.CylinderGeometry(0.36, 0.3, 0.06, 8);
        const orbHaloGeo = new THREE.TorusGeometry(0.62, 0.035, 8, 24);
        const bGlowMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.65,
          roughness: 0.2,
          metalness: 0.8,
        });
        disposables.push(baseGeo, anvilBodyGeo, postGeo, shieldGeo, orbHaloGeo, bGlowMat);

        const base = new THREE.Mesh(baseGeo, darkGraniteMat);
        base.position.y = 0.13;
        base.castShadow = true;
        base.receiveShadow = true;

        const anvil = new THREE.Mesh(anvilBodyGeo, ironMat);
        anvil.position.set(0, 0.46, 0.18);
        anvil.castShadow = true;

        const post = new THREE.Mesh(postGeo, bronzeMat);
        post.position.set(0, 1.08, -0.22);
        post.castShadow = true;

        const rotor = new THREE.Group();
        rotor.position.set(0, 1.65, 0);
        const crestShield = new THREE.Mesh(shieldGeo, bronzeMat);
        crestShield.rotation.x = Math.PI / 2;
        const halo = new THREE.Mesh(orbHaloGeo, bGlowMat);
        rotor.add(crestShield, halo);

        wrap.add(base, anvil, post, rotor);

        landmarkAnimators.push({
          id: lm.id,
          worldTagPos: new THREE.Vector3(lm.x, py + lm.labelHeight, lm.z),
          focusPos: new THREE.Vector3(lm.x, py + 1.4, lm.z),
          update: (elapsed) => {
            rotor.rotation.y = elapsed * 0.78;
            rotor.position.y = 1.65 + Math.sin(elapsed * 2.1) * 0.06;
          },
          refreshState: () => {
            bGlowMat.emissiveIntensity = selectedIdRef.current === lm.id ? 1.1 : 0.65;
          },
        });
      }

      scene.add(wrap);
    });

    const refreshAllShrines = () => {
      landmarkAnimators.forEach((a) => a.refreshState());
    };
    refreshVisualStateRef.current = refreshAllShrines;
    refreshAllShrines();

    // Floating Ambient Firefly/Arcane Wisps (Instanced Points)
    const moteCount = 65;
    const moteGeo = new THREE.BufferGeometry();
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePositions[i * 3] = (Math.sin(i * 12.7) * 0.5 + (i % 7) / 7 - 0.5) * 26;
      motePositions[i * 3 + 1] = 1.4 + ((i * 17) % 100) * 0.045;
      motePositions[i * 3 + 2] = (Math.cos(i * 9.3) * 0.5 + (i % 5) / 5 - 0.5) * 22;
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.14,
      transparent: true,
      opacity: 0.72,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);
    disposables.push(moteGeo, moteMat);

    // 6 Soaring High-Altitude Sky Birds circling the sanctuary peaks
    const birdGeo = new THREE.BufferGeometry();
    const birdVerts = new Float32Array([
      -0.45, 0.06, -0.08, 0, 0, 0.14, 0, 0, -0.14,
      0.45, 0.06, -0.08, 0, 0, -0.14, 0, 0, 0.14,
    ]);
    birdGeo.setAttribute('position', new THREE.BufferAttribute(birdVerts, 3));
    birdGeo.computeVertexNormals();
    const birdMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const birds: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(birdGeo, birdMat);
      scene.add(b);
      birds.push(b);
    }
    disposables.push(birdGeo, birdMat);

    // Hero Adventurer 3D Rig inside the Courtyard
    const heroRig = createRealisticHeroRig(adventurer.avatarId, disposables);
    heroRig.root.position.set(0, groundHeightAt(0, 1.4) + 0.36, 1.4);
    scene.add(heroRig.root);

    const shadowGeo = new THREE.PlaneGeometry(1.45, 1.45);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: texSet.shadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const heroShadow = new THREE.Mesh(shadowGeo, shadowMat);
    scene.add(heroShadow);
    disposables.push(shadowGeo, shadowMat);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting Setup (Hover + Click on 3D Landmark Colliders)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownXY = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownXY = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownXY.x, e.clientY - pointerDownXY.y);
      if (dist > 7) return;
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableProxies, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.landmarkId as HubLandmarkId | undefined;
        if (hitId) {
          selectOrLaunchRef.current(hitId, true);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableProxies, false);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Main Game World Loop
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let walkPhase = 0;
    let prevWalkSign = 1;
    let wasWalking = false;
    let lastTagPush = 0;

    const afterDraw = (cb: () => void) => {
      if (disposed) return;
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } catch {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const pushProjectedTags = (elapsed: number) => {
      if (elapsed - lastTagPush < 0.045) return;
      lastTagPush = elapsed;
      const cw = renderer.domElement.clientWidth;
      const ch = renderer.domElement.clientHeight;
      if (cw === 0 || ch === 0) return;
      const next: Record<string, ProjectedTag> = {};
      landmarkAnimators.forEach((a) => {
        _proj.copy(a.worldTagPos).project(camera);
        next[a.id] = {
          x: ((_proj.x + 1) / 2) * cw,
          y: ((-_proj.y + 1) / 2) * ch,
          visible: _proj.z > -1 && _proj.z < 1,
        };
      });
      setTags(next);
    };

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(0.08, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      // Water wave & torch flame animation
      texSet.waterBump.offset.x = (elapsed * 0.022) % 1;
      texSet.waterBump.offset.y = (elapsed * 0.016) % 1;
      summitGlow.intensity = (grandUnlockedRef.current ? 3.4 : 1.5) + Math.sin(elapsed * 8.5) * 0.4;
      flameMat.emissiveIntensity = 1.35 + Math.sin(elapsed * 10.4) * 0.35;

      // Animate all 10 3D landmark rotors
      landmarkAnimators.forEach((a) => a.update(elapsed));

      // Gentle wisp drift & soaring sky birds
      motes.rotation.y = elapsed * 0.03;
      motes.position.y = Math.sin(elapsed * 0.9) * 0.18;
      birds.forEach((b, i) => {
        const ang = elapsed * 0.24 + i * 1.05;
        const radius = 10 + (i % 3) * 3.5;
        b.position.set(
          Math.cos(ang) * radius,
          7.6 + (i % 2) * 1.4 + Math.sin(elapsed * 1.4 + i) * 0.3,
          Math.sin(ang) * radius * 0.7 - 3
        );
        b.rotation.y = -ang;
        b.rotation.z = Math.sin(elapsed * 5.2 + i) * 0.12;
      });

      // Hero Locomotion across Island Terrain
      const goal = heroGoalPosRef.current;
      const dx = goal.x - heroRig.root.position.x;
      const dz = goal.z - heroRig.root.position.z;
      const dist = Math.hypot(dx, dz);
      const walkingNow = dist > 0.12;

      if (walkingNow !== wasWalking) {
        wasWalking = walkingNow;
        setIsWalking(walkingNow);
      }

      if (walkingNow) {
        const moveStep = Math.min(dist, 5.4 * delta);
        const nx = heroRig.root.position.x + (dx / dist) * moveStep;
        const nz = heroRig.root.position.z + (dz / dist) * moveStep;
        heroRig.root.position.set(nx, groundHeightAt(nx, nz) + 0.36, nz);

        const desiredYaw = Math.atan2(dx, dz);
        let dYaw = desiredYaw - heroRig.root.rotation.y;
        while (dYaw > Math.PI) dYaw -= Math.PI * 2;
        while (dYaw < -Math.PI) dYaw += Math.PI * 2;
        heroRig.root.rotation.y += dYaw * (1 - Math.exp(-10 * delta));

        walkPhase += delta * 11.2;
        const swing = Math.sin(walkPhase);
        heroRig.leftLegPivot.rotation.x = swing * 0.56;
        heroRig.rightLegPivot.rotation.x = -swing * 0.56;
        heroRig.leftArmPivot.rotation.x = -swing * 0.45;
        heroRig.rightArmPivot.rotation.x = swing * 0.45;
        heroRig.torsoGroup.rotation.y = -swing * 0.08;
        heroRig.bodyPivot.position.y = Math.abs(swing) * 0.07;
        heroRig.capePivot.rotation.x = 0.28 + Math.abs(Math.sin(walkPhase * 1.1)) * 0.2;

        const currSign = swing >= 0 ? 1 : -1;
        if (currSign !== prevWalkSign) {
          prevWalkSign = currSign;
          playFootstepSound(soundEnabledRef.current);
        }
      } else {
        const damp = 1 - Math.exp(-9 * delta);
        heroRig.leftLegPivot.rotation.x *= 1 - damp;
        heroRig.rightLegPivot.rotation.x *= 1 - damp;
        heroRig.leftArmPivot.rotation.x *= 1 - damp;
        heroRig.rightArmPivot.rotation.x *= 1 - damp;
        heroRig.torsoGroup.rotation.y *= 1 - damp;
        heroRig.bodyPivot.position.y = Math.sin(elapsed * 2.1) * 0.02;
        heroRig.capePivot.rotation.x = THREE.MathUtils.damp(
          heroRig.capePivot.rotation.x,
          0.16,
          7,
          delta
        );

        // Turn hero smoothly to face selected monument when standing beside it
        const selLm = landmarkAnimators.find((a) => a.id === selectedIdRef.current);
        if (selLm) {
          const fx = selLm.focusPos.x - heroRig.root.position.x;
          const fz = selLm.focusPos.z - heroRig.root.position.z;
          if (Math.hypot(fx, fz) > 0.2) {
            const lookYaw = Math.atan2(fx, fz);
            let dYaw = lookYaw - heroRig.root.rotation.y;
            while (dYaw > Math.PI) dYaw -= Math.PI * 2;
            while (dYaw < -Math.PI) dYaw += Math.PI * 2;
            heroRig.root.rotation.y += dYaw * (1 - Math.exp(-6 * delta));
          }
        }
      }

      heroShadow.position.set(
        heroRig.root.position.x,
        groundHeightAt(heroRig.root.position.x, heroRig.root.position.z) + 0.38,
        heroRig.root.position.z
      );

      // Smooth Camera Choreography: Portal Dive -> Focused Landmark -> Sanctuary Overview
      if (diveTargetRef.current) {
        const lm = landmarkAnimators.find((a) => a.id === diveTargetRef.current);
        if (lm) {
          _targetGoal.copy(lm.focusPos);
          _camGoal.set(lm.focusPos.x, lm.focusPos.y + 1.2, lm.focusPos.z + 2.4);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetGoal.x, 9, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetGoal.y, 9, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetGoal.z, 9, delta);
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 8.5, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 8.5, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 8.5, delta);
        }
      } else if (!userInteracting && !manualOverrideRef.current) {
        if (cameraModeRef.current === 'focus') {
          const lm = landmarkAnimators.find((a) => a.id === selectedIdRef.current);
          if (lm) {
            _vTarget.copy(lm.focusPos);
            _targetGoal.set(_vTarget.x, _vTarget.y, _vTarget.z);
            const dirLen = Math.hypot(_vTarget.x, _vTarget.z) || 1;
            const outX = _vTarget.x / dirLen;
            const outZ = _vTarget.z / dirLen;
            _camGoal.set(
              _vTarget.x + outX * 4.5 + 1.4,
              _vTarget.y + 4.4,
              Math.max(_vTarget.z + 7.2, _vTarget.z + outZ * 5.2 + 4.5)
            );
          }
        } else {
          _targetGoal.set(0, 1.0, 0.4);
          _camGoal.set(0, 14.4, 22.2);
        }

        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetGoal.x, 4.2, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetGoal.y, 4.2, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetGoal.z, 4.2, delta);
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 3.8, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 3.8, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 3.8, delta);
      }

      controls.update();
      renderer.render(scene, camera);
      pushProjectedTags(elapsed);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      for (const entry of entries) {
        const w = Math.max(320, entry.contentRect.width);
        const h = Math.max(320, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      heroRig.root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [adventurer.avatarId]);

  const selectedRealm = SUBJECT_REALMS.find((r) => r.id === selectedId);
  const selectedSubjectMeta = selectedRealm ? subjectMetaMap[selectedRealm.id] : null;

  if (webglError) {
    return (
      <div className="bg-[#0F172A] border border-slate-700 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-white">
            {medium === 'hi' ? `कक्षा ${grade}वीं — विषय हब` : `Class ${grade}th — Subject Portals`}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onGradeChange('10')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                grade === '10' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-200'
              }`}
            >
              10th
            </button>
            <button
              type="button"
              onClick={() => onGradeChange('12')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                grade === '12' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-200'
              }`}
            >
              12th
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SUBJECT_REALMS.map((realm) => (
            <button
              key={realm.id}
              type="button"
              onClick={() => onOpenSubjectMap(realm.id)}
              className="p-4 rounded-xl bg-[#162033] border border-slate-700 hover:border-amber-400 text-left space-y-1"
            >
              <p className="font-display font-bold text-white">{realm.name[medium]}</p>
              <p className="text-xs text-slate-400">
                {subjectMetaMap[realm.id].clearedCount}/{subjectMetaMap[realm.id].totalCount}{' '}
                {medium === 'hi' ? 'अध्याय' : 'Chapters'}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[640px] max-h-[900px] overflow-hidden bg-[#091326]">
      {/* Pure Isolated WebGL Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* World-Projected Interactive 3D Landmark Tags (Zero backdrop-blur over WebGL) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {HUB_LANDMARKS.map((lm) => {
          const pt = tags[lm.id];
          if (!pt || !pt.visible) return null;
          const isSelected = selectedId === lm.id;

          if (lm.kind === 'grade' && lm.gradeTarget) {
            const isCurrentGrade = grade === lm.gradeTarget;
            return (
              <button
                key={lm.id}
                type="button"
                onClick={() => selectOrLaunchLandmark(lm.id, true)}
                style={{ transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -100%)` }}
                className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-1 rounded-lg border text-[11px] font-bold whitespace-nowrap transition-colors shadow-lg ${
                  isCurrentGrade
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : 'bg-[#0B1220]/92 text-slate-100 border-slate-600 hover:border-sky-400'
                }`}
              >
                {medium === 'hi'
                  ? `कक्षा ${lm.gradeTarget}वीं लोक`
                  : `Class ${lm.gradeTarget}th Gate`}
              </button>
            );
          }

          if (lm.kind === 'subject' && lm.subjectId) {
            const realm = SUBJECT_REALMS.find((r) => r.id === lm.subjectId)!;
            const meta = subjectMetaMap[lm.subjectId];
            return (
              <button
                key={lm.id}
                type="button"
                onClick={() => selectOrLaunchLandmark(lm.id, true)}
                style={{ transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -100%)` }}
                className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-1.5 rounded-lg border text-left transition-colors shadow-lg ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : meta.bossCleared
                      ? 'bg-emerald-950/92 text-emerald-200 border-emerald-500/70 hover:border-emerald-300'
                      : 'bg-[#0B1220]/92 text-slate-100 border-slate-600 hover:border-amber-400'
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
                  {meta.bossCleared && (
                    <Crown
                      className={`w-3 h-3 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`}
                      aria-hidden="true"
                    />
                  )}
                  <span>{realm.name[medium]}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      isSelected ? 'text-slate-900' : 'text-slate-300'
                    }`}
                  >
                    {meta.clearedCount}/{meta.totalCount}
                  </span>
                </span>
              </button>
            );
          }

          if (lm.kind === 'boss') {
            return (
              <button
                key={lm.id}
                type="button"
                onClick={() => selectOrLaunchLandmark(lm.id, true)}
                style={{ transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -100%)` }}
                className={`pointer-events-auto absolute top-0 left-0 px-3 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : grandBossUnlocked
                      ? 'bg-red-950/92 text-amber-200 border-amber-400/80 hover:border-amber-300'
                      : 'bg-[#0B1220]/92 text-slate-300 border-slate-600'
                }`}
              >
                {grandBossUnlocked ? (
                  <Swords className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                )}
                <span>
                  {medium === 'hi' ? '2027 महाबॉस गढ़' : '2027 Grand Boss Citadel'}
                </span>
              </button>
            );
          }

          if (lm.kind === 'multiplayer') {
            return (
              <button
                key={lm.id}
                type="button"
                onClick={() => selectOrLaunchLandmark(lm.id, true)}
                style={{ transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -100%)` }}
                className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : 'bg-[#0B1220]/92 text-sky-200 border-sky-500/70 hover:border-sky-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {medium === 'hi'
                    ? `अखाड़ा व लीडरबोर्ड (${onlineCount})`
                    : `Arena & Leaderboard (${onlineCount})`}
                </span>
              </button>
            );
          }

          return (
            <button
              key={lm.id}
              type="button"
              onClick={() => selectOrLaunchLandmark(lm.id, true)}
              style={{ transform: `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -100%)` }}
              className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap shadow-lg flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-white'
                  : 'bg-[#0B1220]/92 text-slate-200 border-slate-600 hover:border-amber-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{medium === 'hi' ? 'अवतार बैरक' : 'Hero Barracks'}</span>
            </button>
          );
        })}
      </div>

      {/* Top Subtle Status & Camera Strip (No Mid-Left / Mid-Right Cards) */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-[#0B1220]/92 border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-slate-200">
          <Footprints className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <span>
            {isWalking
              ? medium === 'hi'
                ? `${adventurer.heroName} 3D तीर्थ की ओर बढ़ रहा है...`
                : `${adventurer.heroName} traversing the sanctuary...`
              : medium === 'hi'
                ? `कक्षा ${grade}वीं · किसी भी 3D मंदिर पर क्लिक करें`
                : `Class ${grade}th Sanctuary · Click any 3D monument or drag to orbit`}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              manualOverrideRef.current = false;
              setCameraMode('overview');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              cameraMode === 'overview'
                ? 'bg-amber-400 text-slate-950 border-white'
                : 'bg-[#0B1220]/92 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{medium === 'hi' ? 'संपूर्ण द्वीप' : 'World View'}</span>
          </button>

          <button
            type="button"
            onClick={() => setHudCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1.5 bg-[#0B1220]/92 border border-slate-700 hover:border-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            title="Shortcut: H"
          >
            {hudCollapsed ? (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>{medium === 'hi' ? 'कंट्रोल दिखाएँ' : 'Show HUD'}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>{medium === 'hi' ? 'सिनिमा व्यू' : 'Cinema Mode'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unified Collapsible Bottom Adventure Dock (100% Unobstructed Central 3D Viewport) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[min(980px,95vw)] transition-transform duration-300 ${
          hudCollapsed ? 'translate-y-[125%]' : 'translate-y-0'
        }`}
      >
        <div className="bg-[#0B1220]/94 border border-slate-700 rounded-2xl p-3.5 sm:p-4 shadow-2xl space-y-3">
          {/* Quick Landmark Selector Row: Class 10 / Class 12 + 5 Subjects + Grand Boss + Multiplayer */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['10', '12'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => selectOrLaunchLandmark(g === '10' ? 'grade-10' : 'grade-12', true)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 border transition-colors ${
                  grade === g
                    ? 'bg-sky-600 border-sky-400 text-white'
                    : 'bg-[#162033] border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {medium === 'hi' ? `${g}वीं` : `Class ${g}th`}
              </button>
            ))}

            <span className="text-slate-700 mx-0.5 select-none" aria-hidden="true">
              |
            </span>

            {SUBJECT_REALMS.map((realm) => {
              const meta = subjectMetaMap[realm.id];
              const isSel = selectedId === realm.id;
              return (
                <button
                  key={realm.id}
                  type="button"
                  onClick={() => selectOrLaunchLandmark(realm.id, true)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                    isSel
                      ? 'bg-amber-400 text-slate-950 border-white font-bold'
                      : 'bg-[#162033] text-slate-200 border-slate-700 hover:border-amber-400/70'
                  }`}
                >
                  {meta.bossCleared && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${isSel ? 'text-slate-950' : 'text-emerald-400'}`}
                      aria-hidden="true"
                    />
                  )}
                  <span>{realm.name[medium]}</span>
                  <span className="font-mono text-[10px] opacity-80 tabular-nums">
                    {meta.clearedCount}/{meta.totalCount}
                  </span>
                </button>
              );
            })}

            <span className="text-slate-700 mx-0.5 select-none" aria-hidden="true">
              |
            </span>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 bg-[#162033] text-amber-300 border border-slate-700 hover:border-amber-400"
            >
              <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{medium === 'hi' ? 'लीडरबोर्ड' : 'Leaderboard'}</span>
            </button>
          </div>

          {/* Focused Landmark Inspector + Primary Launch CTA */}
          <div className="pt-2.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {selectedRealm && selectedSubjectMeta ? (
              <>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-amber-400 truncate">
                    {selectedSubjectMeta.realmTitle} · Class {grade}th NCERT
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                    {selectedRealm.name[medium]} — {selectedSubjectMeta.books}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {selectedSubjectMeta.sections} ·{' '}
                    <span className="font-mono text-amber-300 tabular-nums">
                      {selectedSubjectMeta.clearedCount}/{selectedSubjectMeta.totalCount}{' '}
                      {medium === 'hi' ? 'अध्याय' : 'Chapters'} ·{' '}
                      <Star className="w-3 h-3 inline text-amber-400 fill-current mr-0.5" aria-hidden="true" />
                      {selectedSubjectMeta.stars}/{(selectedSubjectMeta.totalCount + 1) * 3}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      manualOverrideRef.current = false;
                      setCameraMode('focus');
                      moveHeroNearLandmark(selectedRealm.id);
                    }}
                    aria-label="Center camera on shrine"
                    className="p-2.5 rounded-xl bg-[#162033] border border-slate-700 text-slate-300 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => launchIntoLandmark(selectedRealm.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl adventure-btn-gold whitespace-nowrap"
                  >
                    <Swords className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {medium === 'hi'
                        ? `${selectedRealm.name.hi} 3D मैप खोलें`
                        : `Enter ${selectedRealm.name.en} 3D Map`}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            ) : selectedId === 'grand-boss' ? (
              <>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-amber-400 tabular-nums">
                    {medium === 'hi'
                      ? `कक्षा ${grade}वीं महाबॉस गढ़ · बॉस मुहरें: ${gradeBossSeals}/5`
                      : `Class ${grade}th Endgame Citadel · Subject Boss Seals: ${gradeBossSeals}/5`}
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                    {medium === 'hi'
                      ? `2027 MP बोर्ड महाबॉस (सभी 5 विषय)`
                      : `2027 MP Board Grand Boss (All 5 Subjects)`}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {grandBossUnlocked
                      ? medium === 'hi'
                        ? '10-प्रहार संयुक्त परीक्षा युद्ध के लिए द्वार खुले हैं।'
                        : 'Citadel gates unsealed for the 10-strike combined board raid.'
                      : medium === 'hi'
                        ? 'खोलने के लिए किसी भी 1 विषय का अंतिम बॉस हराएँ।'
                        : 'Defeat any 1 Subject Final Boss at the end of a chapter trail to unlock.'}
                  </p>
                </div>
                {grandBossUnlocked ? (
                  <button
                    type="button"
                    onClick={() => launchIntoLandmark('grand-boss')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl adventure-btn-gold whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>
                      {grandBossCleared
                        ? medium === 'hi'
                          ? 'महाबॉस से फिर लड़ें'
                          : 'Rematch Grand Boss'
                        : medium === 'hi'
                          ? 'महाबॉस युद्ध शुरू करें'
                          : 'Challenge Grand Boss'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => selectOrLaunchLandmark('hindi', true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-[#162033] border border-slate-700 hover:border-amber-400 rounded-xl whitespace-nowrap shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'पहला विषय चुनें' : 'Explore a Subject Shrine'}</span>
                  </button>
                )}
              </>
            ) : selectedId === 'multiplayer' ? (
              <>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-sky-400 tabular-nums">
                    {medium === 'hi'
                      ? `${onlineCount} छात्र अभी ऑनलाइन`
                      : `${onlineCount} Students Online Now`}
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                    {medium === 'hi'
                      ? 'स्टडी स्क्वाड, लाइव 1v1 द्वंद्व व ग्लोबल लीडरबोर्ड'
                      : 'Study Squads, Live 1v1 Duels & Global Leaderboard'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenLeaderboard}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl whitespace-nowrap"
                  >
                    <Trophy className="w-4 h-4" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'लीडरबोर्ड' : 'Leaderboard'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => launchIntoLandmark('multiplayer')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl whitespace-nowrap"
                  >
                    <Users className="w-4 h-4" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'अखाड़ा खोलें' : 'Enter Arena'}</span>
                  </button>
                </div>
              </>
            ) : selectedId === 'barracks' ? (
              <>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-amber-400">
                    {adventurer.heroName} · {adventurer.bioTitle}
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                    {medium === 'hi'
                      ? 'अवतार चुनें, फोटो बदलें और युद्ध इतिहास देखें'
                      : 'Customize 3D Avatar, Portrait & View Battle History'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => launchIntoLandmark('barracks')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl adventure-btn-gold whitespace-nowrap shrink-0"
                >
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{medium === 'hi' ? 'अवतार बैरक खोलें' : 'Open Hero Barracks'}</span>
                </button>
              </>
            ) : (
              <>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-semibold text-sky-400">
                    {medium === 'hi'
                      ? `सक्रिय पाठ्यक्रम: कक्षा ${grade}वीं MP बोर्ड NCERT`
                      : `Active Syllabus: Class ${grade}th MP Board New NCERT`}
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold text-white truncate">
                    {medium === 'hi'
                      ? 'सभी 5 विषय मंदिर और नोट्स सक्रिय हैं'
                      : 'All 5 Subject Shrines & Dedicated Notes Active'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => selectOrLaunchLandmark('hindi', true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl adventure-btn-gold whitespace-nowrap shrink-0"
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  <span>{medium === 'hi' ? 'विषय चुनें' : 'Inspect Hindi Shrine'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
