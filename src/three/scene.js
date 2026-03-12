import * as THREE from 'three';

export function createScene(canvas) {
  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // ── Scene & fog ───────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xd4704a, 0.006);

  // ── Camera ────────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 600);

  // ── Gradient sky sphere ───────────────────────────────────────────────────
  const skyMesh = new THREE.Mesh(
    new THREE.SphereGeometry(490, 24, 12),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        zenith:  { value: new THREE.Color(0x1a1235) },
        mid:     { value: new THREE.Color(0xb03060) },
        horizon: { value: new THREE.Color(0xf56a30) },
      },
      vertexShader: `
        varying float vY;
        void main() {
          vY = normalize((modelMatrix * vec4(position,1.0)).xyz).y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform vec3 zenith, mid, horizon;
        varying float vY;
        void main() {
          float t = clamp(vY, -0.1, 1.0);
          vec3 col;
          if (t > 0.18) col = mix(mid, zenith, (t - 0.18) / 0.82);
          else          col = mix(horizon, mid, (t + 0.1) / 0.28);
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  );
  scene.add(skyMesh);

  // ── Sun disc + halo ───────────────────────────────────────────────────────
  const sunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(18, 32),
    new THREE.MeshBasicMaterial({ color: 0xFFD060, transparent: true, opacity: 0.92 })
  );
  sunDisc.position.set(-120, 28, -450);
  scene.add(sunDisc);

  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(34, 32),
    new THREE.MeshBasicMaterial({ color: 0xFF7020, transparent: true, opacity: 0.28 })
  );
  halo.position.set(-120, 28, -449);
  scene.add(halo);

  // ── Lights ────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xff9060, 0.55));

  const sun = new THREE.DirectionalLight(0xffa060, 1.8);
  sun.position.set(-80, 60, -200);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near   = 1;
  sun.shadow.camera.far    = 500;
  sun.shadow.camera.left   = sun.shadow.camera.bottom = -100;
  sun.shadow.camera.right  = sun.shadow.camera.top    =  100;
  sun.shadow.bias          = -0.0005;
  scene.add(sun);
  scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0x3a3a6a, 0.5);
  fill.position.set(60, 40, 100);
  scene.add(fill);

  // ── Horizon glow plane ────────────────────────────────────────────────────
  const horizonMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1200, 220),
    new THREE.MeshBasicMaterial({ color: 0xd4704a, transparent: true, opacity: 0.35, depthWrite: false })
  );
  horizonMesh.position.set(0, 80, -520);
  scene.add(horizonMesh);

  return { renderer, scene, camera, skyMesh, sunDisc, halo, horizonMesh };
}
