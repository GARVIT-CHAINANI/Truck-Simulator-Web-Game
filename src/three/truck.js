import * as THREE from 'three';

const bodyMat    = new THREE.MeshLambertMaterial({ color: 0xC0392B });
const cabMat     = new THREE.MeshLambertMaterial({ color: 0xD04030 });
const darkMat    = new THREE.MeshLambertMaterial({ color: 0x181818 });
const chromeMat  = new THREE.MeshLambertMaterial({ color: 0xC8C8C8 });
const glassMat   = new THREE.MeshLambertMaterial({ color: 0x8870A0, transparent: true, opacity: 0.6 });
const hlMat      = new THREE.MeshLambertMaterial({ color: 0xFFFACC, emissive: 0xFFFF88, emissiveIntensity: 1.0 });
const tlMat      = new THREE.MeshLambertMaterial({ color: 0xFF2200, emissive: 0xFF1100, emissiveIntensity: 0.7 });
const darkRedMat = new THREE.MeshLambertMaterial({ color: 0x8B1A0A });
const stepMat    = new THREE.MeshLambertMaterial({ color: 0x484848 });
const grilleMat  = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });

function bx(truck, w, h, d, mat, px, py, pz) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(px, py, pz);
  m.castShadow = true;
  m.receiveShadow = true;
  truck.add(m);
  return m;
}

export function createTruck(scene) {
  const truck = new THREE.Group();

  // Trailer body
  bx(truck, 2.8, 2.6, 8.5, bodyMat,    0, 2.15, 3.2);
  bx(truck, 2.8, 0.12, 8.5, chromeMat, 0, 3.47, 3.2);

  for (let rz = -3.5; rz <= 3.5; rz += 1.5) {
    bx(truck, 0.05, 2.55, 0.12, darkRedMat, -1.41, 2.15, 3.2 + rz);
    bx(truck, 0.05, 2.55, 0.12, darkRedMat,  1.41, 2.15, 3.2 + rz);
  }

  bx(truck, 1.35, 2.45, 0.1, darkRedMat, -0.72, 2.1, 7.3);
  bx(truck, 1.35, 2.45, 0.1, darkRedMat,  0.72, 2.1, 7.3);
  bx(truck, 0.42, 0.22, 0.08, tlMat,    -1.1, 0.95, 7.35);
  bx(truck, 0.42, 0.22, 0.08, tlMat,     1.1, 0.95, 7.35);

  // Cab
  bx(truck, 2.8, 2.3, 3.6, cabMat, 0, 1.95, -1.85);
  bx(truck, 2.65, 0.75, 1.8, cabMat, 0, 3.15, -1.1);
  bx(truck, 2.9, 0.12, 0.5, darkRedMat, 0, 3.6, -2.9);

  // Glass
  bx(truck, 2.3, 1.15, 0.08, glassMat,  0, 2.4, -3.5);
  bx(truck, 0.08, 0.75, 1.1, glassMat, -1.41, 2.4, -2.1);
  bx(truck, 0.08, 0.75, 1.1, glassMat,  1.41, 2.4, -2.1);

  // Headlights
  bx(truck, 0.55, 0.28, 0.08, hlMat, -0.85, 1.6, -3.65);
  bx(truck, 0.55, 0.28, 0.08, hlMat,  0.85, 1.6, -3.65);
  bx(truck, 0.3, 0.18, 0.08, hlMat,  -1.1, 0.75, -3.65);
  bx(truck, 0.3, 0.18, 0.08, hlMat,   1.1, 0.75, -3.65);

  // Grille
  bx(truck, 1.8, 0.9, 0.08, grilleMat, 0, 1.05, -3.65);
  for (let gy = -0.15; gy <= 0.35; gy += 0.25) {
    bx(truck, 1.8, 0.06, 0.1, chromeMat, 0, 1.05 + gy, -3.62);
  }

  // Bumper
  bx(truck, 3.0, 0.28, 0.35, chromeMat,  0, 0.4, -3.6);
  bx(truck, 0.08, 0.55, 0.35, chromeMat, -1.1, 0.65, -3.6);
  bx(truck, 0.08, 0.55, 0.35, chromeMat,  1.1, 0.65, -3.6);

  // Steps
  bx(truck, 0.48, 0.1, 0.48, stepMat, -1.65, 0.55, -2.8);
  bx(truck, 0.48, 0.1, 0.48, stepMat, -1.65, 0.90, -2.8);
  bx(truck, 0.48, 0.1, 0.48, stepMat,  1.65, 0.55, -2.8);
  bx(truck, 0.48, 0.1, 0.48, stepMat,  1.65, 0.90, -2.8);

  // Exhaust stacks
  bx(truck, 0.08, 1.2, 0.08, chromeMat, -0.5, 3.85, -1.2);
  bx(truck, 0.08, 1.2, 0.08, chromeMat,  0.5, 3.85, -1.2);

  // Mirrors
  bx(truck, 0.36, 0.06, 0.06, chromeMat, -1.6, 2.85, -3.2);
  bx(truck, 0.36, 0.06, 0.06, chromeMat,  1.6, 2.85, -3.2);
  bx(truck, 0.18, 0.28, 0.05, darkMat,   -1.88, 2.85, -3.2);
  bx(truck, 0.18, 0.28, 0.05, darkMat,    1.88, 2.85, -3.2);

  // Fifth wheel plate
  bx(truck, 2.2, 0.12, 1.8, chromeMat, 0, 0.96, 0.8);

  // Front axle/tyres
  [-1.7, 1.7].forEach(x => {
    const ft = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 2, 12), chromeMat);
    ft.rotation.z = Math.PI / 2;
    ft.position.set(x, 0.72, -0.6);
    ft.castShadow = true;
    truck.add(ft);
  });

  // Exhaust pipes
  [-1.55, 1.55].forEach(x => {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.8, 8), chromeMat);
    ex.position.set(x, 3.8, -0.6);
    ex.castShadow = true;
    truck.add(ex);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.25, 8), chromeMat);
    tip.position.set(x, 5.1, -0.6);
    truck.add(tip);
  });

  // Wheels
  const wheelMeshes = [];
  [
    [-1.68, 0.52, -2.7], [1.68, 0.52, -2.7],
    [-1.68, 0.52,  0.2], [1.68, 0.52,  0.2],
    [-1.85, 0.52,  1.8], [1.85, 0.52,  1.8],
    [-1.68, 0.52,  2.5], [1.68, 0.52,  2.5],
    [-1.68, 0.52,  4.6], [1.68, 0.52,  4.6],
  ].forEach(([x, y, z]) => {
    const g = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.22, 10, 20), darkMat);
    tire.rotation.y = Math.PI / 2;
    g.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.24, 10), chromeMat);
    rim.rotation.z = Math.PI / 2;
    g.add(rim);
    for (let n = 0; n < 6; n++) {
      const a = (n / 6) * Math.PI * 2;
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 5), darkMat);
      nut.rotation.z = Math.PI / 2;
      nut.position.set(0.14, Math.sin(a) * 0.2, Math.cos(a) * 0.2);
      g.add(nut);
    }
    g.castShadow = true;
    g.position.set(x, y, z);
    truck.add(g);
    wheelMeshes.push(g);
  });

  // Axles
  [[0, 0.52, -2.7], [0, 0.52, 0.2], [0, 0.52, 1.8], [0, 0.52, 4.6]].forEach(([x, y, z]) => {
    const ax = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 6), chromeMat);
    ax.rotation.z = Math.PI / 2;
    ax.position.set(x, y, z);
    truck.add(ax);
  });

  // Headlight spots
  const leftLight = new THREE.SpotLight(0xfff4c2, 5, 60, Math.PI / 7, 0.4, 1);
  leftLight.position.set(-0.85, 1.6, -3.7);
  leftLight.castShadow = true;
  leftLight.target.position.set(-0.85, 1.6, -20);
  truck.add(leftLight);
  truck.add(leftLight.target);

  const rightLight = new THREE.SpotLight(0xfff4c2, 5, 60, Math.PI / 7, 0.4, 1);
  rightLight.position.set(0.85, 1.6, -3.7);
  rightLight.castShadow = true;
  rightLight.target.position.set(0.85, 1.6, -20);
  truck.add(rightLight);
  truck.add(rightLight.target);

  scene.add(truck);
  return { truck, wheelMeshes };
}
