import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AvatarId } from '../types/quiz';
import {
  applyStudioEnvironment,
  createSimulationTimer,
  createStudioRenderer,
  detectSoftwareWebGL,
  disposeObjectHierarchy,
} from '../utils/threeHelpers';
import {
  BiomePalette,
  createAtmosphericSkyDome,
  createProceduralTextures,
  createRealisticHeroRig,
  createRoadBrazier,
  createWarriorBossRig,
} from '../utils/threeMapAssets';

interface Battle3DStageProps {
  avatarId: AvatarId;
  clashEffect: { id: number; outcome: 'hit' | 'miss' } | null;
  bossHpPercent: number;
  playerHpPercent: number;
}

const ARENA_PALETTE: BiomePalette = {
  zenithHex: 0x0b1528,
  horizonHex: 0x3b2638,
  fogHex: 0x1e1b2c,
  grassBase: '#27313d',
  grassHighlight: '#3e4a59',
  cliffColor: 0x475569,
  waterDeep: 0x0f172a,
  accentHex: 0xf59e0b,
  crystalHex: 0xf97316,
};

export function Battle3DStage({
  avatarId,
  clashEffect,
  bossHpPercent,
  playerHpPercent,
}: Battle3DStageProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const strikeSignalRef = useRef<{ outcome: 'hit' | 'miss'; timer: number } | null>(null);
  const lastClashIdRef = useRef<number>(0);

  useEffect(() => {
    if (clashEffect && clashEffect.id !== lastClashIdRef.current) {
      lastClashIdRef.current = clashEffect.id;
      strikeSignalRef.current = { outcome: clashEffect.outcome, timer: 0.72 };
    }
  }, [clashEffect]);

  const bossHpRef = useRef(bossHpPercent);
  bossHpRef.current = bossHpPercent;
  const playerHpRef = useRef(playerHpPercent);
  playerHpRef.current = playerHpPercent;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createStudioRenderer(isSoftwareGl, { exposure: 1.12 });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = Math.max(300, container.clientWidth);
    const height = Math.max(200, container.clientHeight);
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(ARENA_PALETTE.fogHex, 0.032);

    const disposables: Array<{ dispose: () => void }> = [];
    applyStudioEnvironment(renderer, scene, disposables);
    const sky = createAtmosphericSkyDome(ARENA_PALETTE);
    scene.add(sky.mesh);
    disposables.push(sky);

    const texSet = createProceduralTextures(ARENA_PALETTE, renderer.capabilities.getMaxAnisotropy());
    disposables.push(texSet);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(0, 2.55, 6.2);
    camera.lookAt(0, 1.05, 0);

    // 3-Point Arena Lighting + Warm Brazier Glow
    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.9);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.25);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf97316, 0.95);
    rimLight.position.set(-4, 4, -5);
    scene.add(rimLight);

    const clashPointLight = new THREE.PointLight(0xfbbf24, 0, 8, 1.5);
    clashPointLight.position.set(0, 1.35, 0.4);
    scene.add(clashPointLight);

    // Stone Citadel Battle Dais + Inscribed Combat Ring
    const floorMat = new THREE.MeshStandardMaterial({
      map: texSet.stoneAlbedo,
      bumpMap: texSet.stoneBump,
      bumpScale: 0.1,
      color: 0x64748b,
      roughness: 0.78,
      metalness: 0.14,
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({
      map: texSet.stoneAlbedo,
      bumpMap: texSet.stoneBump,
      bumpScale: 0.09,
      color: 0x334155,
      roughness: 0.76,
      metalness: 0.16,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.85,
    });
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf97316,
      emissiveIntensity: 1.6,
      roughness: 0.25,
    });
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xb45309,
      emissiveIntensity: 0.4,
      roughness: 0.3,
      metalness: 0.85,
    });
    disposables.push(floorMat, darkStoneMat, ironMat, flameMat, ringMat);

    const daisGeo = new THREE.CylinderGeometry(4.4, 4.9, 0.45, 24);
    const dais = new THREE.Mesh(daisGeo, floorMat);
    dais.position.y = -0.225;
    dais.receiveShadow = true;
    scene.add(dais);
    disposables.push(daisGeo);

    const runeCircleGeo = new THREE.TorusGeometry(2.6, 0.045, 8, 48);
    runeCircleGeo.rotateX(Math.PI / 2);
    const runeCircle = new THREE.Mesh(runeCircleGeo, ringMat);
    runeCircle.position.y = 0.025;
    scene.add(runeCircle);
    disposables.push(runeCircleGeo);

    // Flanking Iron Braziers
    [-3.1, 3.1].forEach((bx) => {
      const brazier = createRoadBrazier(darkStoneMat, ironMat, flameMat, disposables);
      brazier.position.set(bx, 0, -1.65);
      brazier.scale.setScalar(0.9);
      scene.add(brazier);
    });

    // Spawn Exact Chosen Player 3D Hero (Left) & Armored Warrior Boss (Right)
    const heroRig = createRealisticHeroRig(avatarId, disposables);
    heroRig.root.position.set(-1.65, 0, 0);
    heroRig.root.rotation.y = Math.PI / 2;
    scene.add(heroRig.root);

    const bossRig = createWarriorBossRig(disposables);
    bossRig.root.position.set(1.65, 0, 0);
    bossRig.root.rotation.y = -Math.PI / 2;
    scene.add(bossRig.root);

    // Ground Contact Shadows
    const shadowGeo = new THREE.PlaneGeometry(1.5, 1.5);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: texSet.shadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
    });
    const heroShadow = new THREE.Mesh(shadowGeo, shadowMat);
    heroShadow.position.set(-1.65, 0.02, 0);
    const bossShadow = new THREE.Mesh(shadowGeo, shadowMat);
    bossShadow.position.set(1.65, 0.02, 0);
    bossShadow.scale.setScalar(1.25);
    scene.add(heroShadow, bossShadow);
    disposables.push(shadowGeo, shadowMat);

    // Steel Spark / Clash Shockwave Ring
    const shockGeo = new THREE.RingGeometry(0.18, 0.36, 20);
    shockGeo.rotateY(Math.PI / 2);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const shockwave = new THREE.Mesh(shockGeo, shockMat);
    shockwave.position.set(0, 1.15, 0.15);
    scene.add(shockwave);
    disposables.push(shockGeo, shockMat);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const timer = createSimulationTimer();
    let frameId = 0;
    let disposed = false;

    const afterDraw = (cb: (ts?: number) => void) => {
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
            frameId = window.setTimeout(() => cb(), 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } catch {
        frameId = window.setTimeout(() => cb(), 80);
      }
    };

    const tick = (timestamp?: number) => {
      if (disposed) return;
      timer.update(timestamp);
      const dt = timer.getDelta();
      const elapsed = timer.getElapsed();

      flameMat.emissiveIntensity = 1.45 + Math.sin(elapsed * 12) * 0.35;

      // Idle Combat Stances
      let heroX = -1.65;
      let bossX = 1.65;
      let heroArmRot = -0.32 + Math.sin(elapsed * 2.5) * 0.06;
      let bossArmRot = -0.4 + Math.cos(elapsed * 2.2) * 0.06;
      let heroLean = 0.06;
      let bossLean = 0.05;

      if (strikeSignalRef.current) {
        strikeSignalRef.current.timer -= dt;
        const rem = Math.max(0, strikeSignalRef.current.timer);
        const progress = 1 - rem / 0.72; // 0 -> 1
        const lunge = Math.sin(Math.min(1, progress * 1.4) * Math.PI);

        if (strikeSignalRef.current.outcome === 'hit') {
          heroX = -1.65 + lunge * 1.42;
          bossX = 1.65 + (progress > 0.3 ? Math.sin((progress - 0.3) * Math.PI) * 0.42 : 0);
          heroArmRot = progress < 0.35 ? -1.45 : 0.75;
          heroLean = 0.25 * lunge;
          bossLean = -0.22 * (progress > 0.3 ? 1 : 0);
          shockMat.color.setHex(0x34d399);
          clashPointLight.color.setHex(0xfbbf24);
        } else {
          bossX = 1.65 - lunge * 1.45;
          heroX = -1.65 - (progress > 0.3 ? Math.sin((progress - 0.3) * Math.PI) * 0.42 : 0);
          bossArmRot = progress < 0.35 ? -1.55 : 0.85;
          bossLean = 0.26 * lunge;
          heroLean = -0.24 * (progress > 0.3 ? 1 : 0);
          shockMat.color.setHex(0xef4444);
          clashPointLight.color.setHex(0xf97316);
        }

        const impactPulse = Math.max(0, 1 - Math.abs(progress - 0.38) * 3.8);
        clashPointLight.intensity = impactPulse * 5.2;
        shockMat.opacity = impactPulse * 0.85;
        shockwave.scale.setScalar(0.6 + progress * 2.5);
        shockwave.position.x = strikeSignalRef.current.outcome === 'hit' ? 0.35 : -0.35;

        if (rem <= 0) {
          strikeSignalRef.current = null;
          clashPointLight.intensity = 0;
          shockMat.opacity = 0;
        }
      }

      heroRig.root.position.x = THREE.MathUtils.damp(heroRig.root.position.x, heroX, 14, dt);
      bossRig.root.position.x = THREE.MathUtils.damp(bossRig.root.position.x, bossX, 14, dt);
      heroRig.rightArmPivot.rotation.x = THREE.MathUtils.damp(heroRig.rightArmPivot.rotation.x, heroArmRot, 16, dt);
      bossRig.rightArmPivot.rotation.x = THREE.MathUtils.damp(bossRig.rightArmPivot.rotation.x, bossArmRot, 16, dt);
      heroRig.torsoGroup.rotation.x = THREE.MathUtils.damp(heroRig.torsoGroup.rotation.x, heroLean, 12, dt);
      bossRig.torsoGroup.rotation.x = THREE.MathUtils.damp(bossRig.torsoGroup.rotation.x, bossLean, 12, dt);

      heroRig.leftArmPivot.rotation.x = -0.55;
      bossRig.leftArmPivot.rotation.x = -0.55;
      heroRig.bodyPivot.position.y = Math.sin(elapsed * 2.8) * 0.025;
      bossRig.bodyPivot.position.y = Math.cos(elapsed * 2.3) * 0.025;

      heroShadow.position.x = heroRig.root.position.x;
      bossShadow.position.x = bossRig.root.position.x;

      // Subtle Boss & Hero defeated tilt if HP reaches 0
      if (bossHpRef.current <= 0) {
        bossRig.root.rotation.z = THREE.MathUtils.damp(bossRig.root.rotation.z, -0.38, 4, dt);
      }
      if (playerHpRef.current <= 0) {
        heroRig.root.rotation.z = THREE.MathUtils.damp(heroRig.root.rotation.z, 0.38, 4, dt);
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    const ro = new ResizeObserver((entries) => {
      if (disposed) return;
      for (const entry of entries) {
        const w = Math.max(300, entry.contentRect.width);
        const h = Math.max(200, entry.contentRect.height);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      timer.dispose();
      ro.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);

      disposeObjectHierarchy(heroRig.root);
      disposeObjectHierarchy(bossRig.root);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [avatarId]);

  if (webglUnavailable) {
    return null;
  }

  return (
    <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-slate-700/90 bg-[#0B1220]">
      <div ref={mountRef} className="w-full h-full" />
      <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-slate-300">
        <span className="bg-[#0B1220]/85 border border-slate-700 px-2.5 py-0.5 rounded">
          Hero 3D Combat Stance
        </span>
        <span className="bg-[#0B1220]/85 border border-slate-700 px-2.5 py-0.5 rounded text-amber-300">
          Armored Warrior Boss
        </span>
      </div>
    </div>
  );
}
