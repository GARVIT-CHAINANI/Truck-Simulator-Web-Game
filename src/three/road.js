import * as THREE from 'three';
import { ROAD_W, SEG_LEN, NUM_SEGS, HALF, SPAN, LANE_SPACING } from './constants';

const roadMat     = new THREE.MeshLambertMaterial({ color: 0x222022 });
const shoulderMat = new THREE.MeshLambertMaterial({ color: 0x2e2a2e });
const whiteMat    = new THREE.MeshLambertMaterial({ color: 0xe8e8e8 });
const yellowMat   = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });

function buildSeg(scene, z) {
  const g = new THREE.Group();

  const road = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W, 0.22, SEG_LEN), roadMat);
  road.receiveShadow = true;
  g.add(road);

  [-1, 1].forEach(s => {
    const sh = new THREE.Mesh(new THREE.BoxGeometry(2, 0.20, SEG_LEN), shoulderMat);
    sh.position.x = s * (ROAD_W / 2 + 1);
    g.add(sh);
  });

  [-1, 1].forEach(s => {
    const el = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.23, SEG_LEN), whiteMat);
    el.position.x = s * (ROAD_W / 2 - 0.2);
    g.add(el);
  });

  for (let d = -25; d <= 25; d += 10) {
    const dash = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.23, 5), yellowMat);
    dash.position.z = d;
    g.add(dash);
  }

  [-LANE_SPACING, LANE_SPACING].forEach(lx => {
    for (let d = -25; d <= 25; d += 10) {
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.23, 4), whiteMat);
      dash.position.set(lx, 0.01, d);
      g.add(dash);
    }
  });

  g.position.set(0, 0, z);
  scene.add(g);
  return g;
}

export function createRoad(scene) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 1200),
    new THREE.MeshLambertMaterial({ color: 0x3a3020 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const segs = [];
  for (let i = 0; i < NUM_SEGS; i++) {
    segs.push(buildSeg(scene, -i * SEG_LEN + SEG_LEN * 6));
  }

  return { segs, ground, HALF, SPAN };
}

/** Teleport an object so it always stays within one SPAN of the truck */
export function recycleZ(obj, truckZ, half, span) {
  const dz = obj.position.z - truckZ;
  if (dz >  half) obj.position.z -= span;
  if (dz < -half) obj.position.z += span;
}
