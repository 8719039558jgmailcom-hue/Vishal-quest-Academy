import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AvatarId } from '../types/quiz';
import {
  applyStudioEnvironment,
  createSimulationTimer,
  createStudioRenderer,
  detectSoftwareWebGL,
  disposeObjectHierarchy,
} from '../utils/threeHelpers';
import { createRealisticHeroRig } from '../utils/threeMapAssets';

interface Avatar3DPreviewProps {
  avatarId: AvatarId;
  heroName: string;
}

export function Avatar3DPreview({ avatarId, heroName }: Avatar3DPreviewProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createStudioRenderer(isSoftwareGl, { alpha: true, exposure: 1.12 });
    } catch {
      setWebglError(true);
      return;
    }

    const width = Math.max(220, container.clientWidth);
    const height = Math.max(220, container.clientHeight);
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const onContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    const disposables: Array<{ dispose: () => void }> = [];
    applyStudioEnvironment(renderer, scene, disposables);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0.45, 1.52, 3.35);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI * 0.32;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0.96, 0);
    controls.update();

    let userDragging = false;
    const onStart = () => {
      userDragging = true;
    };
    const onEnd = () => {
      userDragging = false;
    };
    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);

    const hemi = new THREE.HemisphereLight(0xa5c9ff, 0x1e293b, 0.95);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffe7c2, 2.25);
    keyLight.position.set(3.2, 4.8, 3.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const accentHex =
      avatarId === 'diya-alchemist'
        ? 0x10b981
        : avatarId === 'kabir-sage'
          ? 0xf59e0b
          : 0x38bdf8;
    const rimLight = new THREE.DirectionalLight(accentHex, 1.4);
    rimLight.position.set(-3.0, 2.5, -2.5);
    scene.add(rimLight);

    // Carved Obsidian Stone Pedestal
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.68,
      metalness: 0.25,
    });
    const runeMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      emissive: accentHex,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.85,
    });
    const stepGeo = new THREE.CylinderGeometry(0.88, 1.02, 0.16, 10);
    const daisGeo = new THREE.CylinderGeometry(0.72, 0.82, 0.14, 10);
    const ringGeo = new THREE.TorusGeometry(0.75, 0.028, 8, 32);
    disposables.push(stoneMat, runeMat, stepGeo, daisGeo, ringGeo);

    const stepMesh = new THREE.Mesh(stepGeo, stoneMat);
    stepMesh.position.y = 0.08;
    stepMesh.receiveShadow = true;
    const daisMesh = new THREE.Mesh(daisGeo, stoneMat);
    daisMesh.position.y = 0.23;
    daisMesh.receiveShadow = true;
    const runeRing = new THREE.Mesh(ringGeo, runeMat);
    runeRing.rotation.x = Math.PI / 2;
    runeRing.position.y = 0.305;
    scene.add(stepMesh, daisMesh, runeRing);

    const heroRig = createRealisticHeroRig(avatarId, disposables);
    heroRig.root.position.y = 0.3;
    scene.add(heroRig.root);

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
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      if (!userDragging) {
        heroRig.root.rotation.y += delta * 0.45;
      }
      heroRig.bodyPivot.position.y = Math.sin(elapsed * 2.2) * 0.022;
      heroRig.capePivot.rotation.x = 0.16 + Math.sin(elapsed * 1.8) * 0.04;
      heroRig.rightArmPivot.rotation.x = -0.18 + Math.sin(elapsed * 1.4) * 0.05;
      heroRig.weaponGlowMat.emissiveIntensity = 0.55 + Math.sin(elapsed * 3.1) * 0.2;

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };
    tick();

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      for (const entry of entries) {
        const w = Math.max(220, entry.contentRect.width);
        const h = Math.max(220, entry.contentRect.height);
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
      timer.dispose();
      resizeObserver.disconnect();
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      disposeObjectHierarchy(heroRig.root);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [avatarId]);

  if (webglError) {
    return (
      <div className="w-full h-56 rounded-xl bg-[#0B1220] border border-slate-700 flex items-center justify-center text-xs text-slate-400">
        {heroName || '3D Hero Preview'}
      </div>
    );
  }

  return (
    <div className="relative w-full h-60 sm:h-64 rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-b from-[#0f1c34] to-[#080f1e]">
      <div ref={mountRef} className="w-full h-full" />
      <p className="absolute bottom-2 left-3 text-[11px] font-medium text-slate-400 pointer-events-none">
        Drag to inspect 3D character
      </p>
    </div>
  );
}
