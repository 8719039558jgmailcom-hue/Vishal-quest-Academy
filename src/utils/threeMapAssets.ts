import * as THREE from 'three';
import { AvatarId } from '../types/quiz';

export interface BiomePalette {
  zenithHex: number;
  horizonHex: number;
  fogHex: number;
  grassBase: string;
  grassHighlight: string;
  cliffColor: number;
  waterDeep: number;
  accentHex: number;
  crystalHex: number;
}

export interface ProceduralTextureSet {
  terrainAlbedo: THREE.CanvasTexture;
  terrainBump: THREE.CanvasTexture;
  stoneAlbedo: THREE.CanvasTexture;
  stoneBump: THREE.CanvasTexture;
  barkAlbedo: THREE.CanvasTexture;
  barkBump: THREE.CanvasTexture;
  waterBump: THREE.CanvasTexture;
  shadowMap: THREE.CanvasTexture;
  dispose: () => void;
}

// Deterministic pseudo-noise helper so terrain/textures remain consistent & fast
function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2d(xi, yi);
  const b = hash2d(xi + 1, yi);
  const c = hash2d(xi, yi + 1);
  const d = hash2d(xi + 1, yi + 1);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, u), THREE.MathUtils.lerp(c, d, u), v);
}

export function fbmNoise(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    freq *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

export function createProceduralTextures(
  palette: BiomePalette,
  maxAnisotropy: number
): ProceduralTextureSet {
  const aniso = Math.min(8, Math.max(1, maxAnisotropy));

  const setupTex = (canvas: HTMLCanvasElement, isColor: boolean, repeatX = 1, repeatY = 1) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = aniso;
    if (isColor) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    return tex;
  };

  // 1. Realistic Organic Grass & Moss Terrain Albedo + Micro-Bump
  const tSize = 256;
  const tCanvas = document.createElement('canvas');
  tCanvas.width = tSize;
  tCanvas.height = tSize;
  const tCtx = tCanvas.getContext('2d')!;

  const tBumpCanvas = document.createElement('canvas');
  tBumpCanvas.width = tSize;
  tBumpCanvas.height = tSize;
  const tbCtx = tBumpCanvas.getContext('2d')!;

  const baseCol = new THREE.Color(palette.grassBase);
  const hiCol = new THREE.Color(palette.grassHighlight);
  const soilCol = new THREE.Color('#4a3c2c');
  const tmpCol = new THREE.Color();

  const tImg = tCtx.createImageData(tSize, tSize);
  const tbImg = tbCtx.createImageData(tSize, tSize);
  for (let y = 0; y < tSize; y++) {
    for (let x = 0; x < tSize; x++) {
      // Seamless periodic sampling blend
      const n1 = fbmNoise((x / tSize) * 10, (y / tSize) * 10, 4);
      const blade = hash2d(x * 0.9, y * 1.4);
      const mixVal = THREE.MathUtils.clamp(n1 * 1.15 + (blade - 0.5) * 0.18, 0, 1);

      tmpCol.copy(baseCol).lerp(hiCol, mixVal);
      if (n1 < 0.34) {
        tmpCol.lerp(soilCol, (0.34 - n1) * 1.8);
      }

      const idx = (y * tSize + x) * 4;
      tImg.data[idx] = Math.round(tmpCol.r * 255);
      tImg.data[idx + 1] = Math.round(tmpCol.g * 255);
      tImg.data[idx + 2] = Math.round(tmpCol.b * 255);
      tImg.data[idx + 3] = 255;

      const bumpVal = Math.round(THREE.MathUtils.clamp(n1 * 0.7 + blade * 0.3, 0, 1) * 255);
      tbImg.data[idx] = bumpVal;
      tbImg.data[idx + 1] = bumpVal;
      tbImg.data[idx + 2] = bumpVal;
      tbImg.data[idx + 3] = 255;
    }
  }
  tCtx.putImageData(tImg, 0, 0);
  tbCtx.putImageData(tbImg, 0, 0);

  const terrainAlbedo = setupTex(tCanvas, true, 12, 8);
  const terrainBump = setupTex(tBumpCanvas, false, 12, 8);

  // 2. Chiseled Ancient Granite / Cobblestone Albedo + Mortar Bump
  const sSize = 256;
  const sCanvas = document.createElement('canvas');
  sCanvas.width = sSize;
  sCanvas.height = sSize;
  const sCtx = sCanvas.getContext('2d')!;

  const sbCanvas = document.createElement('canvas');
  sbCanvas.width = sSize;
  sbCanvas.height = sSize;
  const sbCtx = sbCanvas.getContext('2d')!;

  sCtx.fillStyle = '#333b48';
  sCtx.fillRect(0, 0, sSize, sSize);
  sbCtx.fillStyle = '#202020';
  sbCtx.fillRect(0, 0, sSize, sSize);

  const rows = 8;
  const cols = 4;
  const rowH = sSize / rows;
  const colW = sSize / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (colW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const bx = c * colW + offset + 2;
      const by = r * rowH + 2;
      const bw = colW - 4;
      const bh = rowH - 4;
      const shade = 112 + Math.floor(hash2d(r * 13 + c, r + c * 7) * 44);
      const warm = Math.floor(hash2d(c, r) * 14);
      sCtx.fillStyle = `rgb(${shade + warm}, ${shade + 4}, ${shade - 4})`;
      sCtx.fillRect(bx, by, bw, bh);

      sCtx.fillStyle = `rgba(255,255,255,0.08)`;
      sCtx.fillRect(bx, by, bw, 3);

      sbCtx.fillStyle = `rgb(${155 + Math.floor(hash2d(r, c) * 70)}, ${155 + Math.floor(hash2d(r, c) * 70)}, ${155 + Math.floor(hash2d(r, c) * 70)})`;
      sbCtx.fillRect(bx, by, bw, bh);
    }
  }
  // Subtle weathered grain over stone
  for (let i = 0; i < 1600; i++) {
    const gx = Math.floor(hash2d(i, 1) * sSize);
    const gy = Math.floor(hash2d(i, 2) * sSize);
    sCtx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';
    sCtx.fillRect(gx, gy, 2, 2);
  }

  const stoneAlbedo = setupTex(sCanvas, true, 4, 4);
  const stoneBump = setupTex(sbCanvas, false, 4, 4);

  // 3. Furrowed Natural Tree Bark Albedo + Bump
  const bSize = 128;
  const bCanvas = document.createElement('canvas');
  bCanvas.width = bSize;
  bCanvas.height = bSize;
  const bCtx = bCanvas.getContext('2d')!;
  const bbCanvas = document.createElement('canvas');
  bbCanvas.width = bSize;
  bbCanvas.height = bSize;
  const bbCtx = bbCanvas.getContext('2d')!;

  for (let y = 0; y < bSize; y++) {
    for (let x = 0; x < bSize; x++) {
      const furrow = fbmNoise((x / bSize) * 18, (y / bSize) * 3.5, 3);
      const r = Math.round(62 + furrow * 52);
      const g = Math.round(44 + furrow * 38);
      const b = Math.round(31 + furrow * 24);
      bCtx.fillStyle = `rgb(${r},${g},${b})`;
      bCtx.fillRect(x, y, 1, 1);

      const bv = Math.round(furrow * 255);
      bbCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
      bbCtx.fillRect(x, y, 1, 1);
    }
  }
  const barkAlbedo = setupTex(bCanvas, true, 2, 2);
  const barkBump = setupTex(bbCanvas, false, 2, 2);

  // 4. Water Surface Ripple Bump Map
  const wSize = 256;
  const wCanvas = document.createElement('canvas');
  wCanvas.width = wSize;
  wCanvas.height = wSize;
  const wCtx = wCanvas.getContext('2d')!;
  const wImg = wCtx.createImageData(wSize, wSize);
  for (let y = 0; y < wSize; y++) {
    for (let x = 0; x < wSize; x++) {
      const waveA = Math.sin((x / wSize) * Math.PI * 8 + Math.cos((y / wSize) * Math.PI * 4));
      const waveB = Math.cos((y / wSize) * Math.PI * 10 - Math.sin((x / wSize) * Math.PI * 6));
      const n = fbmNoise((x / wSize) * 12, (y / wSize) * 12, 3);
      const val = THREE.MathUtils.clamp(0.5 + waveA * 0.18 + waveB * 0.18 + (n - 0.5) * 0.35, 0, 1);
      const idx = (y * wSize + x) * 4;
      const c = Math.round(val * 255);
      wImg.data[idx] = c;
      wImg.data[idx + 1] = c;
      wImg.data[idx + 2] = c;
      wImg.data[idx + 3] = 255;
    }
  }
  wCtx.putImageData(wImg, 0, 0);
  const waterBump = setupTex(wCanvas, false, 18, 18);

  // 5. Soft Grounded Contact Shadow Radial Texture
  const shCanvas = document.createElement('canvas');
  shCanvas.width = 64;
  shCanvas.height = 64;
  const shCtx = shCanvas.getContext('2d')!;
  const grad = shCtx.createRadialGradient(32, 32, 3, 32, 32, 30);
  grad.addColorStop(0, 'rgba(2, 6, 23, 0.72)');
  grad.addColorStop(0.55, 'rgba(2, 6, 23, 0.32)');
  grad.addColorStop(1, 'rgba(2, 6, 23, 0)');
  shCtx.fillStyle = grad;
  shCtx.fillRect(0, 0, 64, 64);
  const shadowMap = new THREE.CanvasTexture(shCanvas);
  shadowMap.colorSpace = THREE.SRGBColorSpace;

  return {
    terrainAlbedo,
    terrainBump,
    stoneAlbedo,
    stoneBump,
    barkAlbedo,
    barkBump,
    waterBump,
    shadowMap,
    dispose: () => {
      terrainAlbedo.dispose();
      terrainBump.dispose();
      stoneAlbedo.dispose();
      stoneBump.dispose();
      barkAlbedo.dispose();
      barkBump.dispose();
      waterBump.dispose();
      shadowMap.dispose();
    },
  };
}

export function createAtmosphericSkyDome(palette: BiomePalette): {
  mesh: THREE.Mesh;
  dispose: () => void;
} {
  const skyGeo = new THREE.SphereGeometry(92, 32, 20);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(palette.zenithHex) },
      horizonColor: { value: new THREE.Color(palette.horizonHex) },
      glowColor: { value: new THREE.Color(palette.accentHex) },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 glowColor;
      varying vec3 vWorldPos;
      void main() {
        vec3 dir = normalize(vWorldPos);
        float h = clamp(dir.y * 1.4, 0.0, 1.0);
        vec3 col = mix(horizonColor, topColor, pow(h, 0.65));
        float sunHalo = pow(max(dot(dir, normalize(vec3(0.55, 0.38, -0.65))), 0.0), 10.0);
        col += glowColor * sunHalo * 0.28;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new THREE.Mesh(skyGeo, skyMat);
  return {
    mesh,
    dispose: () => {
      skyGeo.dispose();
      skyMat.dispose();
    },
  };
}

// Organic, non-cartoonish multi-branch oak/cypress tree builder
export function createRealisticTree(
  barkMat: THREE.MeshStandardMaterial,
  canopyMatA: THREE.MeshStandardMaterial,
  canopyMatB: THREE.MeshStandardMaterial,
  seed: number,
  disposables: Array<{ dispose: () => void }>
): THREE.Group {
  const group = new THREE.Group();

  // Tapered main trunk + root flare
  const trunkGeo = new THREE.CylinderGeometry(0.11, 0.23, 1.45, 9);
  const trunk = new THREE.Mesh(trunkGeo, barkMat);
  trunk.position.y = 0.7;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);
  disposables.push(trunkGeo);

  // Two angled structural limbs
  const limbGeo = new THREE.CylinderGeometry(0.055, 0.095, 0.8, 7);
  disposables.push(limbGeo);

  const limb1 = new THREE.Mesh(limbGeo, barkMat);
  limb1.position.set(0.24, 1.25, 0.08);
  limb1.rotation.z = -0.58;
  limb1.rotation.y = seed * 1.3;
  limb1.castShadow = true;

  const limb2 = new THREE.Mesh(limbGeo, barkMat);
  limb2.position.set(-0.22, 1.15, -0.1);
  limb2.rotation.z = 0.54;
  limb2.rotation.y = seed * 2.1;
  limb2.castShadow = true;
  group.add(limb1, limb2);

  // Sculpted organic foliage clusters (deformed smooth-shaded subdivided icosahedrons — never flat cartoon cones)
  const makeLeafCluster = (radius: number, sx: number, sy: number, sz: number, mat: THREE.MeshStandardMaterial) => {
    const geo = new THREE.IcosahedronGeometry(radius, 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const n = 0.86 + fbmNoise(vx * 2.4 + seed, vz * 2.4 + vy, 2) * 0.34;
      pos.setXYZ(i, vx * n * sx, vy * n * sy, vz * n * sz);
    }
    geo.computeVertexNormals();
    disposables.push(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const mainCrown = makeLeafCluster(0.74, 1.25, 0.85, 1.15, canopyMatA);
  mainCrown.position.set(0, 1.85, 0);

  const sideCrown1 = makeLeafCluster(0.55, 1.15, 0.88, 1.05, canopyMatB);
  sideCrown1.position.set(0.45, 1.56, 0.18);

  const sideCrown2 = makeLeafCluster(0.52, 1.1, 0.84, 1.1, canopyMatA);
  sideCrown2.position.set(-0.42, 1.5, -0.18);

  const topCrown = makeLeafCluster(0.44, 1.05, 0.92, 1.05, canopyMatB);
  topCrown.position.set(0.06, 2.26, -0.05);

  group.add(mainCrown, sideCrown1, sideCrown2, topCrown);
  return group;
}

// Craggy granite boulder builder for rocky outcrops & coastal cliffs
export function createCraggyRockGeometry(seed = 1): THREE.BufferGeometry {
  const geo = new THREE.DodecahedronGeometry(1, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const n = 0.72 + fbmNoise(vx * 1.9 + seed, vz * 1.9 + vy * 1.4, 3) * 0.56;
    pos.setXYZ(i, vx * n * 1.15, vy * n * 0.82, vz * n);
  }
  geo.computeVertexNormals();
  return geo;
}

// Realistic wrought-iron & stone fire brazier along the ancient road
export function createRoadBrazier(
  stoneMat: THREE.MeshStandardMaterial,
  ironMat: THREE.MeshStandardMaterial,
  flameMat: THREE.MeshStandardMaterial,
  disposables: Array<{ dispose: () => void }>
): THREE.Group {
  const g = new THREE.Group();

  const plinthGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.35, 8);
  const shaftGeo = new THREE.CylinderGeometry(0.14, 0.19, 0.82, 8);
  const bowlGeo = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.05, 0),
      new THREE.Vector2(0.18, 0.08),
      new THREE.Vector2(0.32, 0.25),
      new THREE.Vector2(0.28, 0.28),
      new THREE.Vector2(0.15, 0.12),
    ],
    12
  );
  const emberGeo = new THREE.IcosahedronGeometry(0.14, 1);
  disposables.push(plinthGeo, shaftGeo, bowlGeo, emberGeo);

  const plinth = new THREE.Mesh(plinthGeo, stoneMat);
  plinth.position.y = 0.175;
  plinth.castShadow = true;
  plinth.receiveShadow = true;

  const shaft = new THREE.Mesh(shaftGeo, stoneMat);
  shaft.position.y = 0.74;
  shaft.castShadow = true;

  const bowl = new THREE.Mesh(bowlGeo, ironMat);
  bowl.position.y = 1.12;
  bowl.castShadow = true;

  const ember = new THREE.Mesh(emberGeo, flameMat);
  ember.position.y = 1.32;
  ember.scale.set(0.95, 1.35, 0.95);

  g.add(plinth, shaft, bowl, ember);
  return g;
}

// Modern game-grade articulated proportional 3D Adventurer Rig (non-cartoonish)
export interface GameHeroRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  torsoGroup: THREE.Group;
  leftLegPivot: THREE.Group;
  rightLegPivot: THREE.Group;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
  capePivot: THREE.Group;
  headGroup: THREE.Group;
  weaponGlowMat: THREE.MeshStandardMaterial;
}

export function createRealisticHeroRig(
  avatarId: AvatarId,
  disposables: Array<{ dispose: () => void }>
): GameHeroRig {
  const palette =
    avatarId === 'diya-alchemist'
      ? { cloth: 0x0f514b, cloak: 0x3b1f6e, trim: 0x10b981, steel: 0x94a3b8 }
      : avatarId === 'kabir-sage'
        ? { cloth: 0x7c2d12, cloak: 0x7f1d1d, trim: 0xd97706, steel: 0xcbd5e1 }
        : { cloth: 0x1e3a8a, cloak: 0x92400e, trim: 0xeab308, steel: 0xbec7d5 };

  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd9a784,
    roughness: 0.65,
    metalness: 0.03,
  });
  const clothMat = new THREE.MeshStandardMaterial({
    color: palette.cloth,
    roughness: 0.82,
    metalness: 0.05,
  });
  const cloakMat = new THREE.MeshStandardMaterial({
    color: palette.cloak,
    roughness: 0.88,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });
  const steelMat = new THREE.MeshStandardMaterial({
    color: palette.steel,
    roughness: 0.24,
    metalness: 0.88,
  });
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: palette.trim,
    roughness: 0.28,
    metalness: 0.86,
  });
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x2d1e15,
    roughness: 0.78,
    metalness: 0.08,
  });
  const weaponGlowMat = new THREE.MeshStandardMaterial({
    color: palette.trim,
    roughness: 0.2,
    metalness: 0.75,
    emissive: palette.trim,
    emissiveIntensity: 0.5,
  });
  disposables.push(skinMat, clothMat, cloakMat, steelMat, bronzeMat, leatherMat, weaponGlowMat);

  // Articulated legs with athletic human proportions (hip pivot at y = 0.74 -> ground flush at 0)
  const makeLeg = (xOffset: number): THREE.Group => {
    const hip = new THREE.Group();
    hip.position.set(xOffset, 0.74, 0);

    const thighGeo = new THREE.CylinderGeometry(0.1, 0.082, 0.36, 12);
    const kneeGeo = new THREE.SphereGeometry(0.086, 10, 10);
    const shinGeo = new THREE.CylinderGeometry(0.08, 0.072, 0.32, 12);
    const footGeo = new THREE.BoxGeometry(0.14, 0.09, 0.26);
    disposables.push(thighGeo, kneeGeo, shinGeo, footGeo);

    const thigh = new THREE.Mesh(thighGeo, clothMat);
    thigh.position.y = -0.18;
    thigh.castShadow = true;

    const kneePad = new THREE.Mesh(kneeGeo, steelMat);
    kneePad.position.set(0, -0.36, 0.02);
    kneePad.castShadow = true;

    const greave = new THREE.Mesh(shinGeo, leatherMat);
    greave.position.y = -0.52;
    greave.castShadow = true;

    const boot = new THREE.Mesh(footGeo, leatherMat);
    boot.position.set(0, -0.695, 0.05);
    boot.castShadow = true;

    hip.add(thigh, kneePad, greave, boot);
    return hip;
  };

  const leftLegPivot = makeLeg(-0.125);
  const rightLegPivot = makeLeg(0.125);
  bodyPivot.add(leftLegPivot, rightLegPivot);

  // Sculpted Torso Group (waist, cuirass chestplate, leather belt, tasset plates)
  const torsoGroup = new THREE.Group();
  bodyPivot.add(torsoGroup);

  const cuirassPts = [
    new THREE.Vector2(0.0, 0),
    new THREE.Vector2(0.17, 0.02),
    new THREE.Vector2(0.21, 0.22),
    new THREE.Vector2(0.25, 0.44),
    new THREE.Vector2(0.22, 0.56),
    new THREE.Vector2(0.1, 0.62),
  ];
  const cuirassGeo = new THREE.LatheGeometry(cuirassPts, 16);
  const breastGeo = new THREE.CylinderGeometry(0.23, 0.19, 0.34, 12);
  const beltGeo = new THREE.CylinderGeometry(0.2, 0.21, 0.08, 14);
  const buckleGeo = new THREE.BoxGeometry(0.1, 0.085, 0.05);
  const skirtGeo = new THREE.CylinderGeometry(0.2, 0.26, 0.24, 14, 1, true);
  disposables.push(cuirassGeo, breastGeo, beltGeo, buckleGeo, skirtGeo);

  const tunic = new THREE.Mesh(cuirassGeo, clothMat);
  tunic.position.y = 0.72;
  tunic.castShadow = true;

  const cuirass = new THREE.Mesh(breastGeo, steelMat);
  cuirass.position.set(0, 1.12, 0.01);
  cuirass.scale.set(1.06, 1, 0.84);
  cuirass.castShadow = true;

  const belt = new THREE.Mesh(beltGeo, leatherMat);
  belt.position.y = 0.85;

  const buckle = new THREE.Mesh(buckleGeo, bronzeMat);
  buckle.position.set(0, 0.85, 0.2);

  const tasset = new THREE.Mesh(skirtGeo, leatherMat);
  tasset.position.y = 0.73;

  torsoGroup.add(tunic, cuirass, belt, buckle, tasset);

  // Flowing multi-plane weathered cloak
  const capePivot = new THREE.Group();
  capePivot.position.set(0, 1.3, -0.17);
  const cloakGeo = new THREE.PlaneGeometry(0.52, 0.86, 4, 6);
  cloakGeo.translate(0, -0.43, 0);
  const cPos = cloakGeo.attributes.position;
  for (let i = 0; i < cPos.count; i++) {
    const cy = cPos.getY(i);
    const cx = cPos.getX(i);
    cPos.setX(i, cx * (0.85 + Math.abs(cy) * 0.35));
    cPos.setZ(i, Math.sin(cx * 4) * 0.03 - Math.abs(cy) * 0.08);
  }
  cloakGeo.computeVertexNormals();
  disposables.push(cloakGeo);
  const cloakMesh = new THREE.Mesh(cloakGeo, cloakMat);
  cloakMesh.castShadow = true;
  capePivot.add(cloakMesh);
  capePivot.rotation.x = 0.18;
  torsoGroup.add(capePivot);

  // Articulated Arms + Pauldrons + Gauntlets
  const makeArm = (xOffset: number): THREE.Group => {
    const shoulder = new THREE.Group();
    shoulder.position.set(xOffset, 1.26, 0);

    const pauldronGeo = new THREE.SphereGeometry(0.115, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const armGeo = new THREE.CylinderGeometry(0.068, 0.06, 0.28, 10);
    const bracerGeo = new THREE.CylinderGeometry(0.066, 0.056, 0.24, 10);
    const handGeo = new THREE.SphereGeometry(0.062, 10, 10);
    disposables.push(pauldronGeo, armGeo, bracerGeo, handGeo);

    const pauldron = new THREE.Mesh(pauldronGeo, steelMat);
    pauldron.castShadow = true;

    const upperArm = new THREE.Mesh(armGeo, clothMat);
    upperArm.position.y = -0.15;
    upperArm.castShadow = true;

    const bracer = new THREE.Mesh(bracerGeo, bronzeMat);
    bracer.position.y = -0.37;
    bracer.castShadow = true;

    const gauntlet = new THREE.Mesh(handGeo, leatherMat);
    gauntlet.position.y = -0.5;

    shoulder.add(pauldron, upperArm, bracer, gauntlet);
    return shoulder;
  };

  const leftArmPivot = makeArm(-0.29);
  const rightArmPivot = makeArm(0.29);

  if (avatarId === 'arya-knight') {
    const hiltGeo = new THREE.BoxGeometry(0.18, 0.035, 0.035);
    const gripGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8);
    const bladeGeo = new THREE.BoxGeometry(0.035, 0.025, 0.72);
    const shieldGeo = new THREE.CylinderGeometry(0.26, 0.22, 0.045, 8);
    disposables.push(hiltGeo, gripGeo, bladeGeo, shieldGeo);

    const grip = new THREE.Mesh(gripGeo, leatherMat);
    grip.rotation.x = Math.PI / 2;
    grip.position.set(0, -0.51, 0.04);
    const hilt = new THREE.Mesh(hiltGeo, bronzeMat);
    hilt.position.set(0, -0.51, 0.13);
    const blade = new THREE.Mesh(bladeGeo, steelMat);
    blade.position.set(0, -0.51, 0.49);
    blade.castShadow = true;
    rightArmPivot.add(grip, hilt, blade);

    const shield = new THREE.Mesh(shieldGeo, steelMat);
    shield.rotation.z = Math.PI / 2;
    shield.position.set(-0.09, -0.39, 0.08);
    shield.castShadow = true;
    const shieldBoss = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), bronzeMat);
    shieldBoss.position.set(-0.115, -0.39, 0.08);
    disposables.push(shieldBoss.geometry);
    leftArmPivot.add(shield, shieldBoss);
  } else if (avatarId === 'diya-alchemist') {
    const shaftGeo = new THREE.CylinderGeometry(0.022, 0.026, 1.32, 10);
    const cageGeo = new THREE.OctahedronGeometry(0.11, 0);
    const orbGeo = new THREE.SphereGeometry(0.07, 12, 12);
    disposables.push(shaftGeo, cageGeo, orbGeo);

    const staff = new THREE.Mesh(shaftGeo, leatherMat);
    staff.rotation.x = Math.PI / 2.6;
    staff.position.set(0, -0.4, 0.26);
    const cage = new THREE.Mesh(cageGeo, bronzeMat);
    cage.position.set(0, -0.18, 0.78);
    const core = new THREE.Mesh(orbGeo, weaponGlowMat);
    core.position.set(0, -0.18, 0.78);
    rightArmPivot.add(staff, cage, core);
  } else {
    const rodGeo = new THREE.CylinderGeometry(0.022, 0.025, 1.24, 10);
    const ringGeo = new THREE.TorusGeometry(0.09, 0.016, 8, 16);
    const tomeGeo = new THREE.BoxGeometry(0.2, 0.26, 0.06);
    disposables.push(rodGeo, ringGeo, tomeGeo);

    const rod = new THREE.Mesh(rodGeo, bronzeMat);
    rod.rotation.x = Math.PI / 2.6;
    rod.position.set(0, -0.4, 0.24);
    const astrolabe = new THREE.Mesh(ringGeo, weaponGlowMat);
    astrolabe.position.set(0, -0.19, 0.74);
    const tome = new THREE.Mesh(tomeGeo, cloakMat);
    tome.position.set(-0.06, -0.45, 0.14);
    leftArmPivot.add(tome);
    rightArmPivot.add(rod, astrolabe);
  }

  torsoGroup.add(leftArmPivot, rightArmPivot);

  // Realistic Sculpted Head / Knight Visor Helm / Scholar Hood (Zero cartoon dot eyes)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.46, 0);

  const neckGeo = new THREE.CylinderGeometry(0.068, 0.08, 0.12, 10);
  const headGeo = new THREE.SphereGeometry(0.145, 16, 16);
  headGeo.scale(0.92, 1.08, 0.98);
  disposables.push(neckGeo, headGeo);

  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = -0.08;
  headGroup.add(neck);

  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 0.04;
  head.castShadow = true;
  headGroup.add(head);

  if (avatarId === 'arya-knight') {
    const helmGeo = new THREE.SphereGeometry(0.165, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.68);
    const visorGeo = new THREE.BoxGeometry(0.24, 0.08, 0.14);
    const plumeGeo = new THREE.BoxGeometry(0.04, 0.12, 0.24);
    disposables.push(helmGeo, visorGeo, plumeGeo);

    const helm = new THREE.Mesh(helmGeo, steelMat);
    helm.position.y = 0.05;
    helm.castShadow = true;

    const visor = new THREE.Mesh(visorGeo, bronzeMat);
    visor.position.set(0, 0.06, 0.1);

    const plume = new THREE.Mesh(plumeGeo, cloakMat);
    plume.position.set(0, 0.21, -0.02);
    headGroup.add(helm, visor, plume);
  } else {
    const hoodGeo = new THREE.SphereGeometry(0.168, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const browBandGeo = new THREE.TorusGeometry(0.148, 0.018, 8, 20);
    disposables.push(hoodGeo, browBandGeo);

    const hood = new THREE.Mesh(hoodGeo, cloakMat);
    hood.position.set(0, 0.05, -0.02);
    hood.rotation.x = -0.22;
    hood.castShadow = true;

    const circlet = new THREE.Mesh(browBandGeo, bronzeMat);
    circlet.rotation.x = Math.PI / 2 - 0.15;
    circlet.position.set(0, 0.09, 0.01);
    headGroup.add(hood, circlet);
  }

  torsoGroup.add(headGroup);

  return {
    root,
    bodyPivot,
    torsoGroup,
    leftLegPivot,
    rightLegPivot,
    leftArmPivot,
    rightArmPivot,
    capePivot,
    headGroup,
    weaponGlowMat,
  };
}

// Towering Realistic Armored Warrior Boss Rig (dark obsidian steel, bronze trim, rune greatsword, horned helm)
export function createWarriorBossRig(disposables: Array<{ dispose: () => void }>): GameHeroRig {
  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x222938,
    roughness: 0.28,
    metalness: 0.9,
  });
  const crimsonMat = new THREE.MeshStandardMaterial({
    color: 0x6b141e,
    roughness: 0.85,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.3,
    metalness: 0.86,
  });
  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x1c1411,
    roughness: 0.82,
    metalness: 0.08,
  });
  const weaponGlowMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.85,
    roughness: 0.18,
    metalness: 0.72,
  });
  disposables.push(darkSteelMat, crimsonMat, brassMat, leatherMat, weaponGlowMat);

  const makeBossLeg = (xOffset: number): THREE.Group => {
    const hip = new THREE.Group();
    hip.position.set(xOffset, 0.82, 0);

    const thighGeo = new THREE.CylinderGeometry(0.125, 0.105, 0.4, 12);
    const kneeGeo = new THREE.DodecahedronGeometry(0.11, 0);
    const shinGeo = new THREE.CylinderGeometry(0.1, 0.088, 0.36, 12);
    const bootGeo = new THREE.BoxGeometry(0.17, 0.1, 0.3);
    disposables.push(thighGeo, kneeGeo, shinGeo, footGeoOrBoot(bootGeo));

    function footGeoOrBoot(g: THREE.BoxGeometry) {
      return g;
    }

    const thigh = new THREE.Mesh(thighGeo, leatherMat);
    thigh.position.y = -0.2;
    thigh.castShadow = true;

    const knee = new THREE.Mesh(kneeGeo, brassMat);
    knee.position.set(0, -0.4, 0.03);
    knee.castShadow = true;

    const shin = new THREE.Mesh(shinGeo, darkSteelMat);
    shin.position.y = -0.58;
    shin.castShadow = true;

    const boot = new THREE.Mesh(bootGeo, darkSteelMat);
    boot.position.set(0, -0.77, 0.05);
    boot.castShadow = true;

    hip.add(thigh, knee, shin, boot);
    return hip;
  };

  const leftLegPivot = makeBossLeg(-0.15);
  const rightLegPivot = makeBossLeg(0.15);
  bodyPivot.add(leftLegPivot, rightLegPivot);

  const torsoGroup = new THREE.Group();
  bodyPivot.add(torsoGroup);

  const cuirassGeo = new THREE.CylinderGeometry(0.3, 0.22, 0.54, 12);
  const beltGeo = new THREE.CylinderGeometry(0.24, 0.25, 0.1, 12);
  const tassetGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.28, 12, 1, true);
  disposables.push(cuirassGeo, beltGeo, tassetGeo);

  const cuirass = new THREE.Mesh(cuirassGeo, darkSteelMat);
  cuirass.position.set(0, 1.15, 0);
  cuirass.scale.set(1.12, 1, 0.86);
  cuirass.castShadow = true;

  const chestRune = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), weaponGlowMat);
  chestRune.position.set(0, 1.2, 0.23);
  chestRune.scale.set(1, 1.35, 0.45);
  disposables.push(chestRune.geometry);

  const belt = new THREE.Mesh(beltGeo, brassMat);
  belt.position.y = 0.87;

  const tasset = new THREE.Mesh(tassetGeo, crimsonMat);
  tasset.position.y = 0.75;

  torsoGroup.add(cuirass, chestRune, belt, tasset);

  // Tattered Crimson War Cloak
  const capePivot = new THREE.Group();
  capePivot.position.set(0, 1.38, -0.22);
  const cloakGeo = new THREE.PlaneGeometry(0.66, 1.0, 4, 6);
  cloakGeo.translate(0, -0.5, 0);
  cloakGeo.computeVertexNormals();
  disposables.push(cloakGeo);
  const cloak = new THREE.Mesh(cloakGeo, crimsonMat);
  cloak.castShadow = true;
  capePivot.add(cloak);
  capePivot.rotation.x = 0.16;
  torsoGroup.add(capePivot);

  // Heavy Armored Pauldrons & Gauntlets + Greatsword + Tower Shield
  const makeBossArm = (xOffset: number): THREE.Group => {
    const shoulder = new THREE.Group();
    shoulder.position.set(xOffset, 1.36, 0);

    const pauldronGeo = new THREE.SphereGeometry(0.16, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const armGeo = new THREE.CylinderGeometry(0.082, 0.072, 0.32, 10);
    const bracerGeo = new THREE.CylinderGeometry(0.082, 0.07, 0.26, 10);
    const handGeo = new THREE.BoxGeometry(0.11, 0.11, 0.12);
    disposables.push(pauldronGeo, armGeo, bracerGeo, handGeo);

    const pauldron = new THREE.Mesh(pauldronGeo, darkSteelMat);
    pauldron.castShadow = true;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 6), brassMat);
    spike.position.set(Math.sign(xOffset) * 0.09, 0.13, 0);
    spike.rotation.z = -Math.sign(xOffset) * 0.45;
    disposables.push(spike.geometry);

    const arm = new THREE.Mesh(armGeo, leatherMat);
    arm.position.y = -0.18;
    const bracer = new THREE.Mesh(bracerGeo, darkSteelMat);
    bracer.position.y = -0.43;
    const gauntlet = new THREE.Mesh(handGeo, brassMat);
    gauntlet.position.y = -0.57;

    shoulder.add(pauldron, spike, arm, bracer, gauntlet);
    return shoulder;
  };

  const leftArmPivot = makeBossArm(-0.37);
  const rightArmPivot = makeBossArm(0.37);

  // Rune Greatsword in right hand
  const hiltGeo = new THREE.BoxGeometry(0.28, 0.045, 0.05);
  const bladeGeo = new THREE.BoxGeometry(0.065, 0.025, 1.15);
  const edgeGlowGeo = new THREE.BoxGeometry(0.02, 0.03, 0.95);
  disposables.push(hiltGeo, bladeGeo, edgeGlowGeo);

  const hilt = new THREE.Mesh(hiltGeo, brassMat);
  hilt.position.set(0, -0.58, 0.14);
  const blade = new THREE.Mesh(bladeGeo, darkSteelMat);
  blade.position.set(0, -0.58, 0.72);
  blade.castShadow = true;
  const edgeGlow = new THREE.Mesh(edgeGlowGeo, weaponGlowMat);
  edgeGlow.position.set(0, -0.58, 0.7);
  rightArmPivot.add(hilt, blade, edgeGlow);

  // Heavy Hexagonal Tower Shield in left hand
  const shieldGeo = new THREE.CylinderGeometry(0.36, 0.3, 0.06, 6);
  const bossUmboGeo = new THREE.SphereGeometry(0.09, 10, 10);
  disposables.push(shieldGeo, bossUmboGeo);
  const shield = new THREE.Mesh(shieldGeo, darkSteelMat);
  shield.rotation.z = Math.PI / 2;
  shield.position.set(-0.11, -0.44, 0.1);
  shield.castShadow = true;
  const umbo = new THREE.Mesh(bossUmboGeo, weaponGlowMat);
  umbo.position.set(-0.15, -0.44, 0.1);
  leftArmPivot.add(shield, umbo);

  torsoGroup.add(leftArmPivot, rightArmPivot);

  // Horned Obsidian War Helm with Glowing Visor Slit
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.56, 0);

  const helmGeo = new THREE.CylinderGeometry(0.155, 0.175, 0.3, 12);
  const crestGeo = new THREE.BoxGeometry(0.045, 0.16, 0.28);
  const visorGeo = new THREE.BoxGeometry(0.2, 0.035, 0.06);
  const hornGeo = new THREE.ConeGeometry(0.042, 0.24, 8);
  disposables.push(helmGeo, crestGeo, visorGeo, hornGeo);

  const helm = new THREE.Mesh(helmGeo, darkSteelMat);
  helm.position.y = 0.04;
  helm.castShadow = true;

  const crest = new THREE.Mesh(crestGeo, crimsonMat);
  crest.position.set(0, 0.22, -0.02);

  const visor = new THREE.Mesh(visorGeo, weaponGlowMat);
  visor.position.set(0, 0.06, 0.15);

  const leftHorn = new THREE.Mesh(hornGeo, brassMat);
  leftHorn.position.set(-0.16, 0.18, 0.02);
  leftHorn.rotation.z = 0.58;

  const rightHorn = new THREE.Mesh(hornGeo, brassMat);
  rightHorn.position.set(0.16, 0.18, 0.02);
  rightHorn.rotation.z = -0.58;

  headGroup.add(helm, crest, visor, leftHorn, rightHorn);
  torsoGroup.add(headGroup);

  root.scale.setScalar(1.16);

  return {
    root,
    bodyPivot,
    torsoGroup,
    leftLegPivot,
    rightLegPivot,
    leftArmPivot,
    rightArmPivot,
    capePivot,
    headGroup,
    weaponGlowMat,
  };
}
