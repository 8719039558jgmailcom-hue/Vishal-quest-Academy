import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface Disposable {
  dispose: () => void;
}

export interface SimulationTimer {
  update: (timestamp?: number) => void;
  getDelta: () => number;
  getElapsed: () => number;
  dispose: () => void;
}

/**
 * Probes WebGL2 renderer string to detect software rasterizers (SwiftShader/llvmpipe/WARP)
 * and immediately frees the probe context so browser WebGL context slots are never exhausted.
 */
export function detectSoftwareWebGL(): boolean {
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
}

/**
 * Creates a Three.js r187+ WebGLRenderer with ACESFilmicToneMapping, SRGBColorSpace,
 * and modern PCFShadowMap (avoiding removed PCFSoftShadowMap deprecation warnings).
 */
export function createStudioRenderer(
  isSoftwareGl: boolean,
  options: { alpha?: boolean; exposure?: number } = {}
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    alpha: options.alpha ?? false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = options.exposure ?? 1.08;
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  return renderer;
}

/**
 * Generates an environment reflection cubemap via PMREMGenerator + RoomEnvironment,
 * then immediately disposes both the temporary RoomEnvironment scene and PMREMGenerator.
 */
export function applyStudioEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  disposables: Disposable[]
): THREE.Texture {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const envTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
  scene.environment = envTarget.texture;
  disposables.push(envTarget);
  roomEnvironment.dispose();
  pmremGenerator.dispose();
  return envTarget.texture;
}

/**
 * Uses modern THREE.Timer (replacing deprecated THREE.Clock since r183)
 * with Page Visibility awareness and clean disposal.
 */
export function createSimulationTimer(): SimulationTimer {
  const timer = new THREE.Timer();
  if (typeof document !== 'undefined') {
    timer.connect(document);
  }
  return {
    update: (timestamp?: number) => {
      timer.update(timestamp);
    },
    getDelta: () => Math.min(0.08, timer.getDelta()),
    getElapsed: () => timer.getElapsed(),
    dispose: () => {
      timer.dispose();
    },
  };
}

/**
 * Safely traverses a procedural Three.js hierarchy and disposes geometries and materials.
 */
export function disposeObjectHierarchy(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof THREE.InstancedMesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
      obj.dispose();
      return;
    }
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else if (obj.material) {
        obj.material.dispose();
      }
    }
  });
}
