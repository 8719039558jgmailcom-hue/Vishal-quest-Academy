import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Compass, Eye, EyeOff, Footprints, Lock, RotateCcw, Sparkles, Star } from 'lucide-react';
import { AvatarId, ChapterNodeDefinition, Medium, SubjectId } from '../types/quiz';
import { playFootstepSound } from '../utils/soundFx';
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

interface QuestMap3DCanvasProps {
  subjectId: SubjectId;
  medium: Medium;
  nodes: ChapterNodeDefinition[];
  selectedNodeId: string;
  heroName: string;
  avatarId: AvatarId;
  soundEnabled: boolean;
  clearedStages: Record<string, number>;
  isSubjectBossUnlocked: boolean;
  isSubjectBossCleared: boolean;
  onSelectNode: (nodeId: string) => void;
  onActivateNode?: (nodeId: string) => void;
}

interface StationSpec {
  id: string;
  x: number;
  z: number;
  t: number;
  shortLabel: string;
  title: string;
  order: number;
  cleared: boolean;
  unlocked: boolean;
  stars: number;
  isBoss: boolean;
}

interface ProjectedOverlay {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

const BIOME_PALETTES: Record<SubjectId, BiomePalette> = {
  hindi: {
    zenithHex: 0x10223d,
    horizonHex: 0x38587a,
    fogHex: 0x2e4a69,
    grassBase: '#2b4f34',
    grassHighlight: '#4f7a44',
    cliffColor: 0x525866,
    waterDeep: 0x0d3b5c,
    accentHex: 0xf59e0b,
    crystalHex: 0xf59e0b,
  },
  english: {
    zenithHex: 0x0e2444,
    horizonHex: 0x3b668c,
    fogHex: 0x32587a,
    grassBase: '#274d3d',
    grassHighlight: '#477859',
    cliffColor: 0x586270,
    waterDeep: 0x0c4a6e,
    accentHex: 0x38bdf8,
    crystalHex: 0x38bdf8,
  },
  maths: {
    zenithHex: 0x151e42,
    horizonHex: 0x3c4b7d,
    fogHex: 0x32406e,
    grassBase: '#294a42',
    grassHighlight: '#447261',
    cliffColor: 0x50566e,
    waterDeep: 0x173263,
    accentHex: 0xa78bfa,
    crystalHex: 0xa78bfa,
  },
  physics: {
    zenithHex: 0x0b2138,
    horizonHex: 0x2e5875,
    fogHex: 0x264b66,
    grassBase: '#254a3d',
    grassHighlight: '#3f6e59',
    cliffColor: 0x4b5563,
    waterDeep: 0x0b435c,
    accentHex: 0x22d3ee,
    crystalHex: 0x22d3ee,
  },
  chemistry: {
    zenithHex: 0x0d2633,
    horizonHex: 0x2e5e63,
    fogHex: 0x265057,
    grassBase: '#264d36',
    grassHighlight: '#41754c',
    cliffColor: 0x4f5b59,
    waterDeep: 0x0d474a,
    accentHex: 0x34d399,
    crystalHex: 0x34d399,
  },
};

function computeStationCoord(
  index: number,
  totalStations: number
): { x: number; z: number; t: number } {
  const count = Math.max(2, totalStations);
  const t = index / (count - 1);
  const x = THREE.MathUtils.lerp(-11.4, 13.0, t);
  const z = index === count - 1 ? -0.9 : Math.sin(t * Math.PI * 3.1 + 0.65) * 3.05;
  return { x, z, t };
}

// Analytical natural terrain contour with coastal dropoff and scenic hills
function groundHeightAt(x: number, z: number): number {
  const islandDist = Math.hypot(x * 0.72, z * 1.12);
  const edgeDrop = THREE.MathUtils.smoothstep(islandDist, 9.6, 14.5) * 1.65;
  const rollingHills =
    Math.sin(x * 0.26) * Math.cos(z * 0.32) * 0.46 +
    Math.cos(x * 0.13 + z * 0.19) * 0.28 +
    (fbmNoise(x * 0.2 + 20, z * 0.2 + 20, 3) - 0.5) * 0.35;
  return Math.max(-0.55, 0.36 + rollingHills - edgeDrop * 0.6);
}

// Pre-allocated math helpers outside animation loop (zero per-frame GC)
const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _proj = new THREE.Vector3();
const _camGoal = new THREE.Vector3();
const _targetGoal = new THREE.Vector3();
const _dummyMat = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyColor = new THREE.Color();
const _axisY = new THREE.Vector3(0, 1, 0);

export function QuestMap3DCanvas({
  subjectId,
  medium,
  nodes,
  selectedNodeId,
  heroName,
  avatarId,
  soundEnabled,
  clearedStages,
  isSubjectBossUnlocked,
  isSubjectBossCleared,
  onSelectNode,
  onActivateNode,
}: QuestMap3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview'>('follow');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [stationLabels, setStationLabels] = useState<Record<string, ProjectedOverlay>>({});
  const [heroBadgePos, setHeroBadgePos] = useState<ProjectedOverlay>({
    id: 'hero',
    x: 0,
    y: 0,
    visible: false,
  });

  const totalStations = nodes.length + 1;
  const bossCoord = computeStationCoord(totalStations - 1, totalStations);
  const gradeKey = nodes[0]?.grade ?? '12';

  const stations: StationSpec[] = [
    ...nodes.map((node, i) => {
      const coord = computeStationCoord(i, totalStations);
      const stars = clearedStages[node.id] ?? 0;
      const cleared = stars > 0;
      const prevCleared = i === 0 || (clearedStages[nodes[i - 1].id] ?? 0) > 0;
      return {
        id: node.id,
        x: coord.x,
        z: coord.z,
        t: coord.t,
        shortLabel: `Ch.${node.order}`,
        title: node.title[medium],
        order: node.order,
        cleared,
        unlocked: prevCleared,
        stars,
        isBoss: false,
      };
    }),
    {
      id: 'subject-boss',
      x: bossCoord.x,
      z: bossCoord.z,
      t: bossCoord.t,
      shortLabel: medium === 'hi' ? 'बॉस' : 'BOSS',
      title: medium === 'hi' ? 'विषय महाबॉस' : 'Subject Boss',
      order: nodes.length + 1,
      cleared: isSubjectBossCleared,
      unlocked: isSubjectBossUnlocked,
      stars: clearedStages[`${gradeKey}-${subjectId}-boss`] ?? 0,
      isBoss: true,
    },
  ];

  const stationsRef = useRef<StationSpec[]>(stations);
  stationsRef.current = stations;
  const selectedIdRef = useRef<string>(selectedNodeId);
  selectedIdRef.current = selectedNodeId;
  const cameraModeRef = useRef<'follow' | 'overview'>(cameraMode);
  cameraModeRef.current = cameraMode;
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const onSelectRef = useRef(onSelectNode);
  onSelectRef.current = onSelectNode;
  const onActivateRef = useRef(onActivateNode);
  onActivateRef.current = onActivateNode;

  const targetTRef = useRef<number>(0);
  const triggerCameraResetRef = useRef<(() => void) | null>(null);
  const rebuildMaterialsRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const match = stationsRef.current.find((s) => s.id === selectedNodeId);
    if (match) {
      targetTRef.current = match.t;
    }
  }, [selectedNodeId]);

  useEffect(() => {
    rebuildMaterialsRef.current?.();
  }, [clearedStages, isSubjectBossCleared, isSubjectBossUnlocked, selectedNodeId]);

  const palette = BIOME_PALETTES[subjectId] ?? BIOME_PALETTES.hindi;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
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

    // 1. Scene, Atmospheric Horizon Sky Dome & Matched Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(palette.fogHex, 0.017);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const disposables: Array<{ dispose: () => void }> = [];
    disposables.push(envTex);

    const skyDome = createAtmosphericSkyDome(palette);
    scene.add(skyDome.mesh);
    disposables.push(skyDome);

    const texSet = createProceduralTextures(palette, renderer.capabilities.getMaxAnisotropy());
    disposables.push(texSet);

    // 2. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 160);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.065;
    controls.minDistance = 6.0;
    controls.maxDistance = 30.0;
    controls.minPolarAngle = 0.34;
    controls.maxPolarAngle = Math.PI * 0.44;
    controls.enablePan = true;

    let userInteracting = false;
    let manualOverride = false;
    const onControlStart = () => {
      userInteracting = true;
      manualOverride = true;
    };
    const onControlEnd = () => {
      userInteracting = false;
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);

    // 3. Realistic 3-Point Golden-Hour Outdoor Lighting + Citadel Brazier Glow
    const hemiLight = new THREE.HemisphereLight(0xa5c9ff, 0x2b362b, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffe6bd, 2.15);
    sunLight.position.set(16, 20, -14);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 64;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 18;
    sunLight.shadow.camera.bottom = -18;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(palette.accentHex, 0.72);
    rimLight.position.set(-14, 10, 14);
    scene.add(rimLight);

    const citadelPointLight = new THREE.PointLight(0xff922b, 3.2, 11, 1.6);
    const bossPy = groundHeightAt(bossCoord.x, bossCoord.z);
    citadelPointLight.position.set(bossCoord.x, bossPy + 2.2, bossCoord.z);
    scene.add(citadelPointLight);

    // 4. Shimmering Animated PBR Ocean Water
    const seaGeo = new THREE.PlaneGeometry(165, 165);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshStandardMaterial({
      color: palette.waterDeep,
      roughness: 0.16,
      metalness: 0.45,
      bumpMap: texSet.waterBump,
      bumpScale: 0.09,
    });
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    seaMesh.position.y = -0.18;
    seaMesh.receiveShadow = true;
    scene.add(seaMesh);
    disposables.push(seaGeo, seaMat);

    // 5. High-Detail Smooth PBR Terrain Island with Coastal Sand & Moss Blending
    const terrainGeo = new THREE.PlaneGeometry(44, 28, 112, 72);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    const tColors = new Float32Array(posAttr.count * 3);
    const grassTint = new THREE.Color(0xffffff);
    const sandTint = new THREE.Color(0xc2a97e);
    const rockTint = new THREE.Color(0x8c949e);

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = groundHeightAt(vx, vz);
      posAttr.setY(i, vy);

      if (vy < 0.05) {
        _dummyColor.copy(sandTint);
      } else if (vy > 0.78) {
        const blend = THREE.MathUtils.clamp((vy - 0.78) * 1.4, 0, 0.7);
        _dummyColor.copy(grassTint).lerp(rockTint, blend);
      } else {
        const shoreBlend = THREE.MathUtils.clamp((vy - 0.05) * 4.0, 0, 1);
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

    // 6. Ancient Flagstone Road Curve & Paving Slabs + Iron Torch Braziers
    const curvePoints = stationsRef.current.map(
      (c) => new THREE.Vector3(c.x, groundHeightAt(c.x, c.z) + 0.08, c.z)
    );
    const pathCurve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.45);

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
      color: 0x64748b,
      roughness: 0.72,
      metalness: 0.12,
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
      emissiveIntensity: 1.5,
      roughness: 0.25,
    });
    disposables.push(stoneMat, darkGraniteMat, bronzeMat, ironMat, flameMat);

    // Flattened stone causeway ribbon
    const roadGeo = new THREE.TubeGeometry(pathCurve, 96, 0.42, 8, false);
    roadGeo.scale(1, 0.28, 1);
    const roadMesh = new THREE.Mesh(roadGeo, darkGraniteMat);
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);
    disposables.push(roadGeo);

    // Instanced chiseled flagstone paving slabs along the trail
    const paverCount = 44;
    const paverGeo = new THREE.BoxGeometry(0.84, 0.12, 0.62);
    const paverInst = new THREE.InstancedMesh(paverGeo, stoneMat, paverCount);
    paverInst.receiveShadow = true;
    paverInst.castShadow = true;
    for (let i = 0; i < paverCount; i++) {
      const t = i / (paverCount - 1);
      const pt = pathCurve.getPointAt(t);
      const tan = pathCurve.getTangentAt(t);
      const yaw = Math.atan2(tan.x, tan.z);
      _dummyPos.set(pt.x, groundHeightAt(pt.x, pt.z) + 0.04, pt.z);
      _dummyQuat.setFromAxisAngle(_axisY, yaw);
      _dummyScale.set(1 + (i % 3) * 0.06, 1, 1);
      _dummyMat.compose(_dummyPos, _dummyQuat, _dummyScale);
      paverInst.setMatrixAt(i, _dummyMat);
      const tone = 0.82 + (i % 4) * 0.05;
      _dummyColor.setRGB(tone, tone * 0.99, tone * 0.96);
      paverInst.setColorAt(i, _dummyColor);
    }
    paverInst.computeBoundingSphere();
    scene.add(paverInst);
    disposables.push(paverGeo);

    // 5 Realistic Iron Torch Braziers flanking the road bends
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach((tVal, idx) => {
      const pt = pathCurve.getPointAt(tVal);
      const tan = pathCurve.getTangentAt(tVal);
      const perpX = -tan.z;
      const perpZ = tan.x;
      const side = idx % 2 === 0 ? 1 : -1;
      const bx = pt.x + perpX * side * 1.35;
      const bz = pt.z + perpZ * side * 1.35;
      const brazier = createRoadBrazier(darkGraniteMat, ironMat, flameMat, disposables);
      brazier.position.set(bx, groundHeightAt(bx, bz), bz);
      scene.add(brazier);
    });

    // 7. Realistic Broadleaf Trees & Craggy Granite Cliff Outcrops
    const barkMat = new THREE.MeshStandardMaterial({
      map: texSet.barkAlbedo,
      bumpMap: texSet.barkBump,
      bumpScale: 0.08,
      roughness: 0.9,
      metalness: 0.02,
    });
    const canopyMatA = new THREE.MeshStandardMaterial({
      color: 0x2e5c35,
      bumpMap: texSet.terrainBump,
      bumpScale: 0.06,
      roughness: 0.82,
      metalness: 0.02,
    });
    const canopyMatB = new THREE.MeshStandardMaterial({
      color: 0x3b6e3f,
      bumpMap: texSet.terrainBump,
      bumpScale: 0.06,
      roughness: 0.78,
      metalness: 0.03,
    });
    disposables.push(barkMat, canopyMatA, canopyMatB);

    const treeCoords = [
      [-15.2, -3.5],
      [-13.4, 7.3],
      [-9.3, -6.7],
      [-4.1, 7.8],
      [1.2, -6.9],
      [6.4, 7.0],
      [11.4, -6.2],
      [15.6, 4.4],
      [-15.2, 1.9],
      [16.0, -4.6],
      [-7.4, 7.5],
      [2.6, 7.9],
    ];
    treeCoords.forEach(([tx, tz], idx) => {
      const ty = groundHeightAt(tx, tz);
      if (ty < -0.05) return;
      const tree = createRealisticTree(barkMat, canopyMatA, canopyMatB, idx + 1, disposables);
      const s = 0.92 + ((idx * 37) % 28) / 100;
      tree.position.set(tx, ty - 0.04, tz);
      tree.rotation.y = (idx * 1.1) % (Math.PI * 2);
      tree.scale.setScalar(s);
      scene.add(tree);
    });

    // Instanced craggy granite boulders along shoreline & ridge hills
    const rockGeo = createCraggyRockGeometry(7);
    const rockMat = new THREE.MeshStandardMaterial({
      map: texSet.stoneAlbedo,
      bumpMap: texSet.stoneBump,
      bumpScale: 0.14,
      color: palette.cliffColor,
      roughness: 0.88,
      metalness: 0.05,
    });
    const rockSpots: Array<[number, number, number]> = [
      [-14.2, 4.8, 1.15],
      [-10.5, 0.2, 0.72],
      [-4.7, -5.6, 0.95],
      [1.8, 6.2, 0.85],
      [7.3, -5.5, 1.05],
      [14.9, 2.5, 1.25],
      [-13.5, -5.2, 1.2],
      [11.0, 6.2, 1.0],
      [16.8, -1.8, 1.35],
      [-16.4, -0.5, 1.3],
      [-2.0, -7.2, 1.1],
      [5.5, 8.2, 1.15],
    ];
    const rockInst = new THREE.InstancedMesh(rockGeo, rockMat, rockSpots.length);
    rockInst.castShadow = true;
    rockInst.receiveShadow = true;
    rockSpots.forEach(([rx, rz, rScale], i) => {
      const ry = groundHeightAt(rx, rz);
      _dummyPos.set(rx, ry + rScale * 0.18, rz);
      _dummyQuat.setFromAxisAngle(_axisY, i * 1.25);
      _dummyScale.set(rScale * 1.25, rScale * 0.75, rScale);
      _dummyMat.compose(_dummyPos, _dummyQuat, _dummyScale);
      rockInst.setMatrixAt(i, _dummyMat);
      const shade = 0.76 + (i % 3) * 0.1;
      _dummyColor.setRGB(shade, shade, shade * 1.03);
      rockInst.setColorAt(i, _dummyColor);
    });
    rockInst.computeBoundingSphere();
    scene.add(rockInst);
    disposables.push(rockGeo, rockMat);

    // 8. Carved Ancient Waystone Pedestals (1-5) & Boss Citadel Gate (6)
    const clickableProxies: THREE.Object3D[] = [];
    const pedestalVisuals: Array<{
      id: string;
      ringMat: THREE.MeshStandardMaterial;
      gemMesh: THREE.Mesh;
      gimbalRing: THREE.Mesh;
      gemMat: THREE.MeshStandardMaterial;
      worldPos: THREE.Vector3;
      isBoss: boolean;
    }> = [];

    const daisBottomGeo = new THREE.CylinderGeometry(1.18, 1.36, 0.22, 8);
    const daisTopGeo = new THREE.CylinderGeometry(0.96, 1.08, 0.18, 8);
    const runeRingGeo = new THREE.TorusGeometry(0.94, 0.055, 10, 28);
    const gimbalGeo = new THREE.TorusGeometry(0.46, 0.025, 8, 24);
    const gemGeo = new THREE.OctahedronGeometry(0.28, 0);
    const proxyGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.5, 10);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(daisBottomGeo, daisTopGeo, runeRingGeo, gimbalGeo, gemGeo, proxyGeo, proxyMat);

    stationsRef.current.forEach((st) => {
      const py = groundHeightAt(st.x, st.z);
      const stationGroup = new THREE.Group();
      stationGroup.position.set(st.x, py, st.z);

      const daisBottom = new THREE.Mesh(daisBottomGeo, darkGraniteMat);
      daisBottom.position.y = 0.11;
      daisBottom.receiveShadow = true;
      daisBottom.castShadow = true;

      const daisTop = new THREE.Mesh(daisTopGeo, stoneMat);
      daisTop.position.y = 0.3;
      daisTop.receiveShadow = true;
      daisTop.castShadow = true;
      stationGroup.add(daisBottom, daisTop);

      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x000000,
        emissiveIntensity: 0.45,
      });
      const runeRing = new THREE.Mesh(runeRingGeo, ringMat);
      runeRing.rotation.x = Math.PI / 2;
      runeRing.position.y = 0.4;
      stationGroup.add(runeRing);
      disposables.push(ringMat);

      const gemMat = new THREE.MeshStandardMaterial({
        color: palette.accentHex,
        roughness: 0.12,
        metalness: 0.72,
        emissive: palette.accentHex,
        emissiveIntensity: 0.52,
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      gemMesh.position.y = st.isBoss ? 2.75 : 1.9;
      gemMesh.castShadow = true;

      const gimbalRing = new THREE.Mesh(gimbalGeo, bronzeMat);
      gimbalRing.position.y = st.isBoss ? 2.75 : 1.9;
      stationGroup.add(gemMesh, gimbalRing);
      disposables.push(gemMat);

      // Node 6 Ancient Stone Boss Citadel Gate (fluted columns + architrave + portal)
      if (st.isBoss) {
        const plinthGeo = new THREE.BoxGeometry(0.64, 0.26, 0.64);
        const colGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.05, 12);
        const capGeo = new THREE.BoxGeometry(0.56, 0.22, 0.56);
        const archGeo = new THREE.TorusGeometry(0.98, 0.17, 10, 22, Math.PI);
        const portalGeo = new THREE.CircleGeometry(0.84, 24);
        const portalMat = new THREE.MeshStandardMaterial({
          color: 0x6d28d9,
          emissive: 0x9333ea,
          emissiveIntensity: 0.65,
          roughness: 0.15,
          metalness: 0.35,
          transparent: true,
          opacity: 0.78,
          side: THREE.DoubleSide,
        });
        disposables.push(plinthGeo, colGeo, capGeo, archGeo, portalGeo, portalMat);

        [-0.96, 0.96].forEach((cx) => {
          const p = new THREE.Mesh(plinthGeo, darkGraniteMat);
          p.position.set(cx, 0.48, 0);
          p.castShadow = true;
          const col = new THREE.Mesh(colGeo, stoneMat);
          col.position.set(cx, 1.56, 0);
          col.castShadow = true;
          const cap = new THREE.Mesh(capGeo, darkGraniteMat);
          cap.position.set(cx, 2.6, 0);
          cap.castShadow = true;
          stationGroup.add(p, col, cap);
        });

        const arch = new THREE.Mesh(archGeo, darkGraniteMat);
        arch.position.set(0, 2.66, 0);
        arch.castShadow = true;

        const archTrim = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.045, 8, 22, Math.PI), bronzeMat);
        archTrim.position.set(0, 2.66, 0.15);
        disposables.push(archTrim.geometry);

        const portal = new THREE.Mesh(portalGeo, portalMat);
        portal.position.set(0, 1.58, 0);

        stationGroup.add(arch, archTrim, portal);
      }

      const proxy = new THREE.Mesh(proxyGeo, proxyMat);
      proxy.position.y = 1.2;
      proxy.layers.set(1);
      proxy.userData.stationId = st.id;
      stationGroup.add(proxy);
      clickableProxies.push(proxy);

      scene.add(stationGroup);
      pedestalVisuals.push({
        id: st.id,
        ringMat,
        gemMesh,
        gimbalRing,
        gemMat,
        worldPos: new THREE.Vector3(st.x, py + (st.isBoss ? 3.55 : 2.55), st.z),
        isBoss: st.isBoss,
      });
    });

    const refreshPedestalAppearance = () => {
      const currentSelected = selectedIdRef.current;
      stationsRef.current.forEach((st) => {
        const vis = pedestalVisuals.find((p) => p.id === st.id);
        if (!vis) return;
        const isSelected = st.id === currentSelected;
        if (isSelected) {
          vis.ringMat.color.setHex(0xfbbf24);
          vis.ringMat.emissive.setHex(0xf59e0b);
          vis.ringMat.emissiveIntensity = 0.85;
          vis.gemMat.color.setHex(0xfef08a);
          vis.gemMat.emissive.setHex(0xf59e0b);
          vis.gemMat.emissiveIntensity = 0.85;
        } else if (st.cleared) {
          vis.ringMat.color.setHex(0x34d399);
          vis.ringMat.emissive.setHex(0x10b981);
          vis.ringMat.emissiveIntensity = 0.5;
          vis.gemMat.color.setHex(0x6ee7b7);
          vis.gemMat.emissive.setHex(0x10b981);
          vis.gemMat.emissiveIntensity = 0.6;
        } else if (st.unlocked) {
          vis.ringMat.color.setHex(0x38bdf8);
          vis.ringMat.emissive.setHex(0x0ea5e9);
          vis.ringMat.emissiveIntensity = 0.42;
          vis.gemMat.color.setHex(0x7dd3fc);
          vis.gemMat.emissive.setHex(0x0284c7);
          vis.gemMat.emissiveIntensity = 0.5;
        } else {
          vis.ringMat.color.setHex(0x475569);
          vis.ringMat.emissive.setHex(0x1e293b);
          vis.ringMat.emissiveIntensity = 0.15;
          vis.gemMat.color.setHex(0x64748b);
          vis.gemMat.emissive.setHex(0x334155);
          vis.gemMat.emissiveIntensity = 0.12;
        }
      });
    };
    rebuildMaterialsRef.current = refreshPedestalAppearance;
    refreshPedestalAppearance();

    // 9. Modern Game-Grade Articulated 3D Adventurer Rig
    const heroRig = createRealisticHeroRig(avatarId, disposables);
    const initialStation =
      stationsRef.current.find((s) => s.id === selectedIdRef.current) ?? stationsRef.current[0];
    let currentT = initialStation ? initialStation.t : 0;
    targetTRef.current = currentT;

    const startPt = pathCurve.getPointAt(currentT);
    heroRig.root.position.set(startPt.x, groundHeightAt(startPt.x, startPt.z) + 0.36, startPt.z);
    scene.add(heroRig.root);

    const shadowGeo = new THREE.PlaneGeometry(1.4, 1.4);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: texSet.shadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const heroShadow = new THREE.Mesh(shadowGeo, shadowMat);
    heroShadow.position.set(
      heroRig.root.position.x,
      groundHeightAt(heroRig.root.position.x, heroRig.root.position.z) + 0.38,
      heroRig.root.position.z
    );
    scene.add(heroShadow);
    disposables.push(shadowGeo, shadowMat);

    const dustGeo = new THREE.RingGeometry(0.14, 0.28, 16);
    dustGeo.rotateX(-Math.PI / 2);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const dustRing = new THREE.Mesh(dustGeo, dustMat);
    scene.add(dustRing);
    disposables.push(dustGeo, dustMat);

    camera.position.set(
      heroRig.root.position.x + 2.4,
      heroRig.root.position.y + 6.4,
      heroRig.root.position.z + 9.6
    );
    controls.target.set(heroRig.root.position.x, heroRig.root.position.y + 1.0, heroRig.root.position.z);
    controls.update();

    triggerCameraResetRef.current = () => {
      manualOverride = false;
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Raycasting for 3D Pedestal Selection
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
      const distMoved = Math.hypot(e.clientX - pointerDownXY.x, e.clientY - pointerDownXY.y);
      if (distMoved > 7) return;
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableProxies, false);
      if (hits.length > 0) {
        const hitId = hits[0].object.userData.stationId as string | undefined;
        if (hitId) {
          manualOverride = false;
          if (hitId === selectedIdRef.current && onActivateRef.current) {
            onActivateRef.current(hitId);
          } else {
            onSelectRef.current(hitId);
          }
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

    // 11. Animation Loop (Weighty Bipedal Locomotion + Water Wave + Brazier Flicker + Damping)
    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;
    let walkPhase = 0;
    let prevWalkSign = 1;
    let wasWalkingFlag = false;
    let dustAlpha = 0;
    let lastOverlayPush = 0;

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

    const projectOverlays = (elapsed: number) => {
      if (elapsed - lastOverlayPush < 0.042) return;
      lastOverlayPush = elapsed;

      const cw = renderer.domElement.clientWidth;
      const ch = renderer.domElement.clientHeight;
      if (cw === 0 || ch === 0) return;

      const nextLabels: Record<string, ProjectedOverlay> = {};
      pedestalVisuals.forEach((pv) => {
        _proj.copy(pv.worldPos).project(camera);
        const visible = _proj.z > -1 && _proj.z < 1;
        nextLabels[pv.id] = {
          id: pv.id,
          x: ((_proj.x + 1) / 2) * cw,
          y: ((-_proj.y + 1) / 2) * ch,
          visible,
        };
      });
      setStationLabels(nextLabels);

      _proj.set(
        heroRig.root.position.x,
        heroRig.root.position.y + 2.25,
        heroRig.root.position.z
      ).project(camera);
      setHeroBadgePos({
        id: 'hero',
        x: ((_proj.x + 1) / 2) * cw,
        y: ((-_proj.y + 1) / 2) * ch,
        visible: _proj.z > -1 && _proj.z < 1,
      });
    };

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(0.08, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      // Animate ocean waves & citadel torch flicker
      texSet.waterBump.offset.x = (elapsed * 0.025) % 1;
      texSet.waterBump.offset.y = (elapsed * 0.018) % 1;
      citadelPointLight.intensity = 2.9 + Math.sin(elapsed * 9.5) * 0.45;
      flameMat.emissiveIntensity = 1.35 + Math.sin(elapsed * 11.2) * 0.35;

      // Hero Walking Along Stone Road Between Level Nodes
      const diffT = targetTRef.current - currentT;
      const walkingNow = Math.abs(diffT) > 0.003;

      if (walkingNow !== wasWalkingFlag) {
        wasWalkingFlag = walkingNow;
        setIsWalking(walkingNow);
      }

      if (walkingNow) {
        const speedT = 0.25;
        const stepT = Math.sign(diffT) * Math.min(Math.abs(diffT), speedT * delta);
        currentT = THREE.MathUtils.clamp(currentT + stepT, 0, 1);

        pathCurve.getPointAt(currentT, _vA);
        const lookAheadT = THREE.MathUtils.clamp(currentT + Math.sign(diffT) * 0.025, 0, 1);
        pathCurve.getPointAt(lookAheadT, _vB);

        const groundY = groundHeightAt(_vA.x, _vA.z) + 0.36;
        heroRig.root.position.set(_vA.x, groundY, _vA.z);

        const dx = _vB.x - _vA.x;
        const dz = _vB.z - _vA.z;
        if (Math.hypot(dx, dz) > 0.001) {
          const desiredYaw = Math.atan2(dx, dz);
          let deltaYaw = desiredYaw - heroRig.root.rotation.y;
          while (deltaYaw > Math.PI) deltaYaw -= Math.PI * 2;
          while (deltaYaw < -Math.PI) deltaYaw += Math.PI * 2;
          heroRig.root.rotation.y += deltaYaw * (1 - Math.exp(-11 * delta));
        }

        // Natural weighty humanoid stride (counter-twist, hip drop, cloak trail)
        walkPhase += delta * 10.8;
        const swing = Math.sin(walkPhase);
        heroRig.leftLegPivot.rotation.x = swing * 0.58;
        heroRig.rightLegPivot.rotation.x = -swing * 0.58;
        heroRig.leftArmPivot.rotation.x = -swing * 0.48;
        heroRig.rightArmPivot.rotation.x = swing * 0.48;
        heroRig.torsoGroup.rotation.y = -swing * 0.09;
        heroRig.bodyPivot.position.y = Math.abs(swing) * 0.075;
        heroRig.capePivot.rotation.x = 0.28 + Math.abs(Math.sin(walkPhase * 1.1)) * 0.22;
        heroRig.headGroup.rotation.y = swing * 0.06;

        const currSign = swing >= 0 ? 1 : -1;
        if (currSign !== prevWalkSign) {
          prevWalkSign = currSign;
          playFootstepSound(soundEnabledRef.current);
          dustAlpha = 0.42;
          dustRing.position.set(_vA.x, groundY + 0.03, _vA.z);
          dustRing.scale.setScalar(0.55);
        }
      } else {
        const dampFactor = 1 - Math.exp(-9 * delta);
        heroRig.leftLegPivot.rotation.x *= 1 - dampFactor;
        heroRig.rightLegPivot.rotation.x *= 1 - dampFactor;
        heroRig.leftArmPivot.rotation.x *= 1 - dampFactor;
        heroRig.rightArmPivot.rotation.x *= 1 - dampFactor;
        heroRig.torsoGroup.rotation.y *= 1 - dampFactor;
        heroRig.capePivot.rotation.x = THREE.MathUtils.damp(heroRig.capePivot.rotation.x, 0.16, 7, delta);
        heroRig.bodyPivot.position.y = Math.sin(elapsed * 2.2) * 0.022;
        heroRig.headGroup.rotation.y = Math.sin(elapsed * 0.9) * 0.08;
      }

      if (dustAlpha > 0.01) {
        dustAlpha = Math.max(0, dustAlpha - delta * 1.9);
        dustMat.opacity = dustAlpha;
        dustRing.scale.addScalar(delta * 1.8);
      } else {
        dustMat.opacity = 0;
      }

      heroShadow.position.set(
        heroRig.root.position.x,
        groundHeightAt(heroRig.root.position.x, heroRig.root.position.z) + 0.38,
        heroRig.root.position.z
      );

      // Animate hovering arcane relic crystals & astrolabe rings
      pedestalVisuals.forEach((pv, idx) => {
        const baseH = pv.isBoss ? 2.75 : 1.9;
        const bob = Math.sin(elapsed * 2.0 + idx) * 0.1;
        pv.gemMesh.rotation.y = elapsed * 1.1 + idx * 0.8;
        pv.gemMesh.position.y = baseH + bob;
        pv.gimbalRing.position.y = baseH + bob;
        pv.gimbalRing.rotation.x = elapsed * 0.85 + idx;
        pv.gimbalRing.rotation.y = elapsed * 0.65;
      });
      heroRig.weaponGlowMat.emissiveIntensity = 0.45 + Math.sin(elapsed * 3.0) * 0.16;

      if (!userInteracting && !manualOverride) {
        if (cameraModeRef.current === 'overview') {
          _targetGoal.set(0.8, 0.9, 0.2);
          _camGoal.set(0.8, 13.8, 19.8);
        } else {
          _targetGoal.set(
            heroRig.root.position.x,
            heroRig.root.position.y + 1.0,
            heroRig.root.position.z
          );
          _camGoal.set(
            heroRig.root.position.x + 2.3,
            heroRig.root.position.y + 6.4,
            heroRig.root.position.z + 9.8
          );
        }
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetGoal.x, 4.4, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetGoal.y, 4.4, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetGoal.z, 4.4, delta);

        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, 3.8, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, 3.8, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, 3.8, delta);
      }

      controls.update();
      renderer.render(scene, camera);
      projectOverlays(elapsed);

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
  }, [avatarId, subjectId, gradeKey, nodes.length]);

  if (webglError) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0F172A] min-h-[420px] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="font-display text-lg font-bold text-amber-300">
          {medium === 'hi' ? 'अध्याय पथ चयनकर्ता' : 'Chapter Quest Trail'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {stations.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectNode(st.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border ${
                st.id === selectedNodeId
                  ? 'bg-amber-400 text-slate-950 border-white'
                  : 'bg-[#162033] text-slate-100 border-slate-600'
              }`}
            >
              {st.shortLabel} · {st.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-600/80 bg-[#091326] min-h-[440px] sm:min-h-[490px] adventure-card-3d">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Minimal Spec Badge (Solid translucent surface — zero backdrop-blur over WebGL) */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-[#0B1220]/90 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Footprints className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>
            {isWalking
              ? medium === 'hi'
                ? `${heroName} अगले स्तर की ओर चल रहा है...`
                : `${heroName} is walking along the stone trail...`
              : medium === 'hi'
                ? '3D एडवेंचर मैप · ड्रैग करके घुमाएँ या स्तर चुनें'
                : '3D Adventure World · Drag to orbit or select any level'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setControlsCollapsed((prev) => !prev)}
          className="pointer-events-auto inline-flex items-center gap-1.5 bg-[#0B1220]/90 border border-slate-700 hover:border-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
        >
          {controlsCollapsed ? (
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

      {/* Projected Semantic DOM Badges */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {heroBadgePos.visible && (
          <div
            style={{
              transform: `translate3d(${heroBadgePos.x}px, ${heroBadgePos.y}px, 0) translate(-50%, -100%)`,
            }}
            className="absolute top-0 left-0 px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] shadow-md whitespace-nowrap border border-white/70"
          >
            {heroName}
          </div>
        )}

        {stations.map((st) => {
          const pos = stationLabels[st.id];
          if (!pos || !pos.visible) return null;
          const active = st.id === selectedNodeId;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                if (active && onActivateNode) {
                  onActivateNode(st.id);
                } else {
                  onSelectNode(st.id);
                }
              }}
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -100%)`,
              }}
              className={`pointer-events-auto absolute top-0 left-0 px-2 py-1 rounded-md text-[11px] font-bold border shadow-md whitespace-nowrap transition-colors ${
                active
                  ? 'bg-amber-400 text-slate-950 border-white'
                  : st.cleared
                    ? 'bg-emerald-900/95 text-emerald-200 border-emerald-400/80'
                    : st.unlocked
                      ? 'bg-[#0B1220]/92 text-sky-200 border-sky-400/80 hover:border-amber-300'
                      : 'bg-[#0B1220]/88 text-slate-400 border-slate-600'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <span>{st.shortLabel}</span>
                {st.cleared ? (
                  <Star className="w-3 h-3 fill-current text-amber-300" aria-hidden="true" />
                ) : !st.unlocked ? (
                  <Lock className="w-3 h-3 opacity-80" aria-hidden="true" />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compact Collapsible Bottom Control Dock */}
      {!controlsCollapsed && (
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 w-[min(94%,640px)] pointer-events-auto">
          <div className="bg-[#0B1220]/92 border border-slate-700 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xl">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCameraMode('follow');
                  triggerCameraResetRef.current?.();
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  cameraMode === 'follow'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-[#162033] text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>{medium === 'hi' ? 'हीरो कैमरा' : 'Follow Hero'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCameraMode('overview');
                  triggerCameraResetRef.current?.();
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                  cameraMode === 'overview'
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-[#162033] text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-3 h-3" aria-hidden="true" />
                <span>{medium === 'hi' ? 'पूरा 3D मैप' : 'World View'}</span>
              </button>

              <button
                type="button"
                onClick={() => triggerCameraResetRef.current?.()}
                aria-label="Reset camera view"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-[#162033] text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>{medium === 'hi' ? 'रीसेट' : 'Recenter'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1">
              {stations.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectNode(st.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-colors whitespace-nowrap ${
                    st.id === selectedNodeId
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-[#162033] text-slate-300 hover:text-white'
                  }`}
                >
                  {st.isBoss ? 'BOSS' : st.order}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
