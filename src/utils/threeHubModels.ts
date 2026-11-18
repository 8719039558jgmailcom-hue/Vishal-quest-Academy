import * as THREE from 'three';
import { GradeLevel, SubjectId } from '../types/quiz';

export interface AnimatedShrineHandles {
  root: THREE.Group;
  artifactRotor: THREE.Group;
  secondaryRotor: THREE.Group;
  ringMat: THREE.MeshStandardMaterial;
  coreMat: THREE.MeshStandardMaterial;
  accentPoint?: THREE.PointLight;
}

export interface GradeMonumentHandles {
  root: THREE.Group;
  crestRotor: THREE.Group;
  ringMat: THREE.MeshStandardMaterial;
  sealMat: THREE.MeshStandardMaterial;
}

export interface LandmarkMonumentHandles {
  root: THREE.Group;
  rotor: THREE.Group;
  glowMat: THREE.MeshStandardMaterial;
}

// Composite 3D Grade Gateway Monument (Class 10th Ceremonial Arch vs. Class 12th Obsidian Crown Spire)
export function createGradeMonolith(
  grade: GradeLevel,
  stoneMat: THREE.MeshStandardMaterial,
  darkGraniteMat: THREE.MeshStandardMaterial,
  bronzeMat: THREE.MeshStandardMaterial,
  disposables: Array<{ dispose: () => void }>
): GradeMonumentHandles {
  const root = new THREE.Group();
  const is12 = grade === '12';
  const accentHex = is12 ? 0xf59e0b : 0x38bdf8;

  // Stepped octagonal base plinth
  const step1Geo = new THREE.CylinderGeometry(1.55, 1.75, 0.24, 8);
  const step2Geo = new THREE.CylinderGeometry(1.22, 1.38, 0.2, 8);
  const ringGeo = new THREE.TorusGeometry(1.26, 0.055, 10, 32);
  const colGeo = new THREE.CylinderGeometry(0.16, 0.21, is12 ? 2.55 : 2.15, 10);
  const capGeo = new THREE.BoxGeometry(0.46, 0.18, 0.46);
  const lintelGeo = new THREE.BoxGeometry(1.75, 0.26, 0.52);
  disposables.push(step1Geo, step2Geo, ringGeo, colGeo, capGeo, lintelGeo);

  const step1 = new THREE.Mesh(step1Geo, darkGraniteMat);
  step1.position.y = 0.12;
  step1.castShadow = true;
  step1.receiveShadow = true;

  const step2 = new THREE.Mesh(step2Geo, stoneMat);
  step2.position.y = 0.34;
  step2.castShadow = true;
  step2.receiveShadow = true;

  const ringMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 0.45,
    roughness: 0.22,
    metalness: 0.85,
  });
  const sealMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 0.72,
    roughness: 0.18,
    metalness: 0.78,
  });
  disposables.push(ringMat, sealMat);

  const baseRing = new THREE.Mesh(ringGeo, ringMat);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = 0.45;
  root.add(step1, step2, baseRing);

  const colHeight = is12 ? 2.55 : 2.15;
  const colMat = is12 ? darkGraniteMat : stoneMat;
  [-0.68, 0.68].forEach((cx) => {
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(cx, 0.44 + colHeight * 0.5, 0);
    col.castShadow = true;
    col.receiveShadow = true;

    const cap = new THREE.Mesh(capGeo, bronzeMat);
    cap.position.set(cx, 0.44 + colHeight + 0.06, 0);
    cap.castShadow = true;
    root.add(col, cap);
  });

  const lintel = new THREE.Mesh(lintelGeo, darkGraniteMat);
  lintel.position.set(0, 0.44 + colHeight + 0.24, 0);
  lintel.castShadow = true;
  root.add(lintel);

  // Rotating Celestial Crest inside & atop the Gateway
  const crestRotor = new THREE.Group();
  crestRotor.position.set(0, 0.44 + colHeight * 0.54, 0);

  const outerGimbalGeo = new THREE.TorusGeometry(0.42, 0.032, 10, 28);
  const innerCoreGeo = is12
    ? new THREE.OctahedronGeometry(0.24, 0)
    : new THREE.DodecahedronGeometry(0.23, 0);
  disposables.push(outerGimbalGeo, innerCoreGeo);

  const gimbal = new THREE.Mesh(outerGimbalGeo, bronzeMat);
  const core = new THREE.Mesh(innerCoreGeo, sealMat);
  core.castShadow = true;
  crestRotor.add(gimbal, core);

  if (is12) {
    const crownRingGeo = new THREE.TorusGeometry(0.26, 0.024, 8, 24);
    disposables.push(crownRingGeo);
    const crownRing = new THREE.Mesh(crownRingGeo, ringMat);
    crownRing.rotation.x = Math.PI / 3;
    crestRotor.add(crownRing);
  }

  root.add(crestRotor);
  return { root, crestRotor, ringMat, sealMat };
}

// Composite 6–10 Part Realistic PBR Subject Shrine Models
export function createSubjectShrineModel(
  subjectId: SubjectId,
  stoneMat: THREE.MeshStandardMaterial,
  darkGraniteMat: THREE.MeshStandardMaterial,
  bronzeMat: THREE.MeshStandardMaterial,
  ironMat: THREE.MeshStandardMaterial,
  isSoftwareGl: boolean,
  disposables: Array<{ dispose: () => void }>
): AnimatedShrineHandles {
  const root = new THREE.Group();

  const accentMap: Record<SubjectId, number> = {
    hindi: 0xf59e0b,
    english: 0x38bdf8,
    maths: 0xa78bfa,
    physics: 0x22d3ee,
    chemistry: 0x34d399,
  };
  const accentHex = accentMap[subjectId];

  // Shared Carved Stone & Forged Bronze Shrine Dais
  const dais1Geo = new THREE.CylinderGeometry(1.38, 1.56, 0.24, 8);
  const dais2Geo = new THREE.CylinderGeometry(1.08, 1.24, 0.22, 8);
  const altarGeo = new THREE.CylinderGeometry(0.52, 0.64, 0.68, 8);
  const ringGeo = new THREE.TorusGeometry(1.12, 0.055, 10, 32);
  disposables.push(dais1Geo, dais2Geo, altarGeo, ringGeo);

  const dais1 = new THREE.Mesh(dais1Geo, darkGraniteMat);
  dais1.position.y = 0.12;
  dais1.castShadow = true;
  dais1.receiveShadow = true;

  const dais2 = new THREE.Mesh(dais2Geo, stoneMat);
  dais2.position.y = 0.35;
  dais2.castShadow = true;
  dais2.receiveShadow = true;

  const altar = new THREE.Mesh(altarGeo, darkGraniteMat);
  altar.position.y = 0.8;
  altar.castShadow = true;
  altar.receiveShadow = true;

  const ringMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 0.42,
    roughness: 0.24,
    metalness: 0.84,
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 0.68,
    roughness: 0.16,
    metalness: 0.78,
  });
  disposables.push(ringMat, coreMat);

  const progressRing = new THREE.Mesh(ringGeo, ringMat);
  progressRing.rotation.x = Math.PI / 2;
  progressRing.position.y = 0.47;
  root.add(dais1, dais2, altar, progressRing);

  const artifactRotor = new THREE.Group();
  artifactRotor.position.y = 1.92;
  const secondaryRotor = new THREE.Group();
  secondaryRotor.position.y = 1.92;
  root.add(artifactRotor, secondaryRotor);

  if (subjectId === 'hindi') {
    // Sahitya Temple Shrine: Carved twin sandstone pillars + Golden Manuscript Scroll + Brass Diya
    const parchmentMat = new THREE.MeshStandardMaterial({
      color: 0xe7d3a8,
      roughness: 0.78,
      metalness: 0.04,
    });
    const teakMat = new THREE.MeshStandardMaterial({
      color: 0x5c341d,
      roughness: 0.72,
      metalness: 0.08,
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf97316,
      emissiveIntensity: 1.4,
      roughness: 0.2,
    });
    disposables.push(parchmentMat, teakMat, flameMat);

    const scrollSheetGeo = new THREE.BoxGeometry(0.86, 0.56, 0.06);
    const rollerGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.76, 12);
    const finialGeo = new THREE.SphereGeometry(0.085, 10, 10);
    const diyaBowlGeo = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.04, 0),
        new THREE.Vector2(0.22, 0.04),
        new THREE.Vector2(0.28, 0.14),
        new THREE.Vector2(0.18, 0.14),
      ],
      14
    );
    const flameGeo = new THREE.ConeGeometry(0.075, 0.22, 8);
    disposables.push(scrollSheetGeo, rollerGeo, finialGeo, diyaBowlGeo, flameGeo);

    const sheet = new THREE.Mesh(scrollSheetGeo, parchmentMat);
    sheet.castShadow = true;
    const leftRoll = new THREE.Mesh(rollerGeo, teakMat);
    leftRoll.position.x = -0.45;
    const rightRoll = new THREE.Mesh(rollerGeo, teakMat);
    rightRoll.position.x = 0.45;
    [-0.45, 0.45].forEach((rx) => {
      [-0.4, 0.4].forEach((ry) => {
        const fin = new THREE.Mesh(finialGeo, bronzeMat);
        fin.position.set(rx, ry, 0);
        artifactRotor.add(fin);
      });
    });
    artifactRotor.add(sheet, leftRoll, rightRoll);
    artifactRotor.rotation.x = -0.18;

    const diya = new THREE.Mesh(diyaBowlGeo, bronzeMat);
    diya.position.set(0, -0.74, 0.36);
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, -0.52, 0.36);
    secondaryRotor.add(diya, flame);
  } else if (subjectId === 'english') {
    // Imperial Library Shrine: Stacked Hardcover Tomes + Rotating Armillary Celestial Sphere + Quill Nib
    const crimsonBookMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.74,
      metalness: 0.1,
    });
    const navyBookMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.74,
      metalness: 0.1,
    });
    disposables.push(crimsonBookMat, navyBookMat);

    const bookAGeo = new THREE.BoxGeometry(0.82, 0.15, 0.62);
    const bookBGeo = new THREE.BoxGeometry(0.72, 0.14, 0.56);
    const armillaryRingGeo = new THREE.TorusGeometry(0.46, 0.032, 10, 28);
    const axisGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.08, 8);
    const globeGeo = new THREE.IcosahedronGeometry(0.22, 1);
    disposables.push(bookAGeo, bookBGeo, armillaryRingGeo, axisGeo, globeGeo);

    const bookA = new THREE.Mesh(bookAGeo, navyBookMat);
    bookA.position.set(0, 1.21, 0);
    bookA.castShadow = true;
    const bookB = new THREE.Mesh(bookBGeo, crimsonBookMat);
    bookB.position.set(0.02, 1.35, -0.02);
    bookB.rotation.y = 0.24;
    bookB.castShadow = true;
    root.add(bookA, bookB);

    const ring1 = new THREE.Mesh(armillaryRingGeo, bronzeMat);
    const ring2 = new THREE.Mesh(armillaryRingGeo, bronzeMat);
    ring2.rotation.y = Math.PI / 2;
    const axis = new THREE.Mesh(axisGeo, ironMat);
    axis.rotation.z = 0.32;
    const globe = new THREE.Mesh(globeGeo, coreMat);
    globe.castShadow = true;
    artifactRotor.add(ring1, ring2, axis, globe);

    const ring3 = new THREE.Mesh(armillaryRingGeo, coreMat);
    ring3.scale.setScalar(1.16);
    ring3.rotation.x = Math.PI / 2.5;
    secondaryRotor.add(ring3);
  } else if (subjectId === 'maths') {
    // Cosmic Observatory: Nested Gyroscopic Brass Rings + Floating Amethyst Octahedron Prism
    const outerGyroGeo = new THREE.TorusGeometry(0.62, 0.038, 12, 32);
    const midGyroGeo = new THREE.TorusGeometry(0.46, 0.03, 10, 28);
    const coreOctaGeo = new THREE.OctahedronGeometry(0.27, 0);
    const satGeo = new THREE.TetrahedronGeometry(0.11, 0);
    disposables.push(outerGyroGeo, midGyroGeo, coreOctaGeo, satGeo);

    const outerGyro = new THREE.Mesh(outerGyroGeo, bronzeMat);
    outerGyro.castShadow = true;
    const coreOcta = new THREE.Mesh(coreOctaGeo, coreMat);
    coreOcta.castShadow = true;
    artifactRotor.add(outerGyro, coreOcta);

    const midGyro = new THREE.Mesh(midGyroGeo, bronzeMat);
    midGyro.rotation.x = Math.PI / 2.3;
    secondaryRotor.add(midGyro);

    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const sat = new THREE.Mesh(satGeo, ringMat);
      sat.position.set(Math.cos(ang) * 0.72, 0, Math.sin(ang) * 0.72);
      secondaryRotor.add(sat);
    }
  } else if (subjectId === 'physics') {
    // Electromagnetic Induction Spire: Copper Coil Tower + Orbiting Electron Rings
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.25,
      metalness: 0.88,
    });
    disposables.push(copperMat);

    const coilMastGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.95, 12);
    const coilWrapGeo = new THREE.TorusGeometry(0.21, 0.036, 8, 20);
    const terminalGeo = new THREE.SphereGeometry(0.2, 14, 14);
    const orbitGeo = new THREE.TorusGeometry(0.64, 0.025, 8, 30);
    const electronGeo = new THREE.SphereGeometry(0.075, 10, 10);
    disposables.push(coilMastGeo, coilWrapGeo, terminalGeo, orbitGeo, electronGeo);

    const mast = new THREE.Mesh(coilMastGeo, ironMat);
    mast.position.y = 1.56;
    mast.castShadow = true;
    root.add(mast);

    for (let i = 0; i < 4; i++) {
      const wrap = new THREE.Mesh(coilWrapGeo, copperMat);
      wrap.rotation.x = Math.PI / 2;
      wrap.position.y = 1.32 + i * 0.16;
      root.add(wrap);
    }

    const terminal = new THREE.Mesh(terminalGeo, coreMat);
    terminal.position.y = 2.15;
    terminal.castShadow = true;
    root.add(terminal);

    artifactRotor.position.y = 2.15;
    secondaryRotor.position.y = 2.15;

    const orb1 = new THREE.Mesh(orbitGeo, ringMat);
    orb1.rotation.x = 0.65;
    const e1 = new THREE.Mesh(electronGeo, coreMat);
    e1.position.set(0.64, 0, 0);
    orb1.add(e1);
    artifactRotor.add(orb1);

    const orb2 = new THREE.Mesh(orbitGeo, bronzeMat);
    orb2.rotation.x = -0.65;
    orb2.rotation.y = 0.9;
    const e2 = new THREE.Mesh(electronGeo, coreMat);
    e2.position.set(-0.64, 0, 0);
    orb2.add(e2);
    secondaryRotor.add(orb2);
  } else {
    // Chemistry Alchemical Stand: Forged Iron Tripod + Emerald Glass Retort + Swirling Reaction Core
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd1fae5,
      roughness: 0.08,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 0.96,
      ior: 1.52,
      depthWrite: false,
    });
    disposables.push(glassMat);

    const standBaseGeo = new THREE.CylinderGeometry(0.48, 0.56, 0.1, 12);
    const flaskBodyGeo = new THREE.SphereGeometry(0.42, 16, 14);
    const flaskNeckGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.42, 12);
    const rimGeo = new THREE.TorusGeometry(0.16, 0.025, 8, 20);
    const liquidGeo = new THREE.SphereGeometry(0.32, 14, 12, 0, Math.PI * 2, Math.PI * 0.25, Math.PI * 0.75);
    const crystalGeo = new THREE.OctahedronGeometry(0.14, 0);
    disposables.push(standBaseGeo, flaskBodyGeo, flaskNeckGeo, rimGeo, liquidGeo, crystalGeo);

    const stand = new THREE.Mesh(standBaseGeo, ironMat);
    stand.position.y = 1.18;
    root.add(stand);

    const liquid = new THREE.Mesh(liquidGeo, coreMat);
    liquid.position.y = 1.68;
    root.add(liquid);

    const flaskBody = new THREE.Mesh(flaskBodyGeo, glassMat);
    flaskBody.position.y = 1.68;
    flaskBody.renderOrder = 2;
    const flaskNeck = new THREE.Mesh(flaskNeckGeo, glassMat);
    flaskNeck.position.y = 2.15;
    flaskNeck.renderOrder = 2;
    const rim = new THREE.Mesh(rimGeo, bronzeMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 2.36;
    root.add(flaskBody, flaskNeck, rim);

    artifactRotor.position.y = 2.68;
    secondaryRotor.position.y = 1.72;
    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const mote = new THREE.Mesh(crystalGeo, ringMat);
      mote.scale.setScalar(0.65);
      mote.position.set(Math.cos(ang) * 0.42, (i - 1) * 0.08, Math.sin(ang) * 0.42);
      artifactRotor.add(mote);
    }
    const swirlRing = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.026, 8, 28), bronzeMat);
    swirlRing.rotation.x = Math.PI / 2;
    disposables.push(swirlRing.geometry);
    secondaryRotor.add(swirlRing);
  }

  return { root, artifactRotor, secondaryRotor, ringMat, coreMat };
}

// Apex 2027 Grand Boss Fortress Citadel Gate
export function createGrandBossFortress(
  darkGraniteMat: THREE.MeshStandardMaterial,
  bronzeMat: THREE.MeshStandardMaterial,
  flameMat: THREE.MeshStandardMaterial,
  disposables: Array<{ dispose: () => void }>
): LandmarkMonumentHandles {
  const root = new THREE.Group();

  const crimsonMat = new THREE.MeshStandardMaterial({
    color: 0x7f1d1d,
    roughness: 0.78,
    metalness: 0.14,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xea580c,
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.75,
  });
  disposables.push(crimsonMat, glowMat);

  const daisGeo = new THREE.CylinderGeometry(1.75, 2.05, 0.36, 8);
  const plinthGeo = new THREE.BoxGeometry(0.68, 0.32, 0.68);
  const colGeo = new THREE.CylinderGeometry(0.2, 0.26, 2.35, 10);
  const archGeo = new THREE.TorusGeometry(1.06, 0.19, 10, 24, Math.PI);
  const hornGeo = new THREE.ConeGeometry(0.14, 0.65, 6);
  const portalGeo = new THREE.CircleGeometry(0.9, 24);
  const portalMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412,
    emissive: 0xea580c,
    emissiveIntensity: 0.75,
    transparent: true,
    opacity: 0.78,
    side: THREE.DoubleSide,
  });
  disposables.push(daisGeo, plinthGeo, colGeo, archGeo, hornGeo, portalGeo, portalMat);

  const dais = new THREE.Mesh(daisGeo, darkGraniteMat);
  dais.position.y = 0.18;
  dais.castShadow = true;
  dais.receiveShadow = true;
  root.add(dais);

  [-1.06, 1.06].forEach((cx) => {
    const p = new THREE.Mesh(plinthGeo, darkGraniteMat);
    p.position.set(cx, 0.5, 0);
    p.castShadow = true;
    const col = new THREE.Mesh(colGeo, darkGraniteMat);
    col.position.set(cx, 1.78, 0);
    col.castShadow = true;
    const horn = new THREE.Mesh(hornGeo, bronzeMat);
    horn.position.set(cx * 1.15, 3.12, 0);
    horn.rotation.z = -Math.sign(cx) * 0.42;
    const ember = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), flameMat);
    ember.position.set(cx, 3.1, 0.25);
    disposables.push(ember.geometry);
    root.add(p, col, horn, ember);
  });

  const arch = new THREE.Mesh(archGeo, darkGraniteMat);
  arch.position.set(0, 2.95, 0);
  arch.castShadow = true;
  const portal = new THREE.Mesh(portalGeo, portalMat);
  portal.position.set(0, 1.85, 0);
  root.add(arch, portal);

  const rotor = new THREE.Group();
  rotor.position.set(0, 2.05, 0.12);
  const sealRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.035, 8, 24), bronzeMat);
  const sealGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), glowMat);
  disposables.push(sealRing.geometry, sealGem.geometry);
  rotor.add(sealRing, sealGem);
  root.add(rotor);

  return { root, rotor, glowMat };
}

// Eastern Harbor Pavilion: Multiplayer Colosseum & Global Trophy Cup Monument
export function createColosseumPavilion(
  stoneMat: THREE.MeshStandardMaterial,
  darkGraniteMat: THREE.MeshStandardMaterial,
  bronzeMat: THREE.MeshStandardMaterial,
  disposables: Array<{ dispose: () => void }>
): LandmarkMonumentHandles {
  const root = new THREE.Group();

  const glowMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.88,
  });
  const bannerMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.72,
    metalness: 0.12,
    side: THREE.DoubleSide,
  });
  disposables.push(glowMat, bannerMat);

  const deckGeo = new THREE.CylinderGeometry(1.6, 1.75, 0.3, 12);
  const colGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.75, 10);
  const domeRingGeo = new THREE.TorusGeometry(1.18, 0.1, 8, 24);
  const cupGeo = new THREE.LatheGeometry(
    [
      new THREE.Vector2(0.0, 0),
      new THREE.Vector2(0.22, 0.04),
      new THREE.Vector2(0.08, 0.16),
      new THREE.Vector2(0.08, 0.34),
      new THREE.Vector2(0.32, 0.62),
      new THREE.Vector2(0.28, 0.66),
      new THREE.Vector2(0.0, 0.48),
    ],
    16
  );
  disposables.push(deckGeo, colGeo, domeRingGeo, cupGeo);

  const deck = new THREE.Mesh(deckGeo, stoneMat);
  deck.position.y = 0.15;
  deck.castShadow = true;
  deck.receiveShadow = true;
  root.add(deck);

  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const col = new THREE.Mesh(colGeo, darkGraniteMat);
    col.position.set(Math.cos(ang) * 1.18, 1.15, Math.sin(ang) * 1.18);
    col.castShadow = true;
    root.add(col);
  }

  const crownRing = new THREE.Mesh(domeRingGeo, stoneMat);
  crownRing.rotation.x = Math.PI / 2;
  crownRing.position.y = 2.04;
  crownRing.castShadow = true;
  root.add(crownRing);

  const rotor = new THREE.Group();
  rotor.position.set(0, 1.05, 0);
  const trophyCup = new THREE.Mesh(cupGeo, glowMat);
  trophyCup.castShadow = true;
  const orbitHalo = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.025, 8, 24), bronzeMat);
  orbitHalo.position.y = 0.45;
  orbitHalo.rotation.x = Math.PI / 3;
  disposables.push(orbitHalo.geometry);
  rotor.add(trophyCup, orbitHalo);
  root.add(rotor);

  return { root, rotor, glowMat };
}
