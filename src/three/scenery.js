import * as THREE from 'three';
import { ROAD_W, SPAN, SEG_LEN } from './constants';

const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
const leafMats = [0x2e5c18, 0x1e4410, 0x3a7020, 0x264e14].map(
  c => new THREE.MeshLambertMaterial({ color: c })
);
const bushMat = new THREE.MeshLambertMaterial({ color: 0x2a4f14 });
const poleMat = new THREE.MeshLambertMaterial({ color: 0x7a6a50 });

const rng = (a, b) => a + Math.random() * (b - a);

function makeTree(scene, x, z, sc) {
  const g  = new THREE.Group();
  const h  = (3.2 + Math.random() * 2) * sc;
  const lm = leafMats[Math.floor(Math.random() * leafMats.length)];

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * sc, 0.28 * sc, h, 6), trunkMat);
  trunk.position.y = h / 2;
  trunk.castShadow = true;
  g.add(trunk);

  for (let i = 0; i < 3; i++) {
    const r  = (2.5 - i * 0.5) * sc;
    const ch = (3.5 - i * 0.6) * sc;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, ch, 7), lm);
    cone.position.y = h + i * ch * 0.52;
    cone.castShadow = true;
    g.add(cone);
  }

  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

function makeBush(scene, x, z) {
  const g = new THREE.Group();
  [[0, 0.4, 0], [0.7, 0.35, 0.2], [-0.5, 0.32, -0.1]].forEach(([dx, dy, dz]) => {
    const b = new THREE.Mesh(
      new THREE.SphereGeometry(0.45 + Math.random() * 0.3, 6, 5),
      bushMat
    );
    b.position.set(dx, dy, dz);
    b.scale.y = 0.72;
    b.castShadow = true;
    g.add(b);
  });
  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

function makePole(scene, x, z) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 8, 6), poleMat);
  pole.position.y = 4;
  pole.castShadow = true;
  g.add(pole);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.12), poleMat);
  bar.position.y = 7.5;
  g.add(bar);
  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

export function createScenery(scene) {
  const SLOTS    = 50;
  const treeObjs = [];
  const bushObjs = [];
  const poleObjs = [];

  for (let i = 0; i < SLOTS; i++) {
    const z = -i * (SPAN / SLOTS) + SEG_LEN * 4;

    treeObjs.push(makeTree(scene,  rng(ROAD_W / 2 + 3, ROAD_W / 2 + 24), z, rng(0.7, 1.4)));
    treeObjs.push(makeTree(scene, -rng(ROAD_W / 2 + 3, ROAD_W / 2 + 24), z, rng(0.7, 1.4)));

    if (i % 2 === 0) {
      bushObjs.push(makeBush(scene,  rng(ROAD_W / 2 + 2, ROAD_W / 2 + 14), z + rng(-10, 10)));
      bushObjs.push(makeBush(scene, -rng(ROAD_W / 2 + 2, ROAD_W / 2 + 14), z + rng(-10, 10)));
    }

    if (i % 3 === 0) {
      poleObjs.push(makePole(scene, -ROAD_W / 2 - 4, z));
    }
  }

  return { treeObjs, bushObjs, poleObjs };
}
