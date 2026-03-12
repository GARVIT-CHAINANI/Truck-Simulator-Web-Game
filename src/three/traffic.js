// traffic.js

import * as THREE from 'three';
import { LANES, TRUCK_HX, TRUCK_HZ, TRUCK_Z_BIAS } from './constants';

const TRAFFIC_COLORS = [0xd4d0c8, 0x4a7fc1, 0xe8c14a, 0xc14a4a, 0x6abf6a];
const trafficMats    = TRAFFIC_COLORS.map(c => new THREE.MeshLambertMaterial({ color: c }));
const darkMat        = new THREE.MeshLambertMaterial({ color: 0x111111 });
const lightMat       = new THREE.MeshLambertMaterial({
  color: 0xff4422,
  emissive: 0xff2200,
  emissiveIntensity: 0.6,
});

const TRAFFIC_MIN_AHEAD = 140;
const TRAFFIC_MAX_AHEAD = 360;
const TRAFFIC_RECYCLE_BEHIND = 30;
const TRAFFIC_RECYCLE_TOO_FAR_AHEAD = 500;

function makeVehicle(type, colorMat) {
  const g = new THREE.Group();

  if (type === 0) {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 4.2), colorMat);
    body.position.y = 0.75;
    body.castShadow = true;
    g.add(body);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 2.2), colorMat);
    cab.position.set(0, 1.43, -0.3);
    cab.castShadow = true;
    g.add(cab);

    const rl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.07), lightMat);
    rl.position.set(0, 0.82, 2.12);
    g.add(rl);
  } else {
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.8, 4.6), colorMat);
    body.position.y = 1.1;
    body.castShadow = true;
    g.add(body);

    const rl = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.2, 0.07), lightMat);
    rl.position.set(0, 0.55, 2.32);
    g.add(rl);
  }

  [[-0.9, 0, -1.3], [0.9, 0, -1.3], [-0.9, 0, 1.3], [0.9, 0, 1.3]].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 8), darkMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.32, z);
    g.add(w);
  });

  return g;
}

export function createTraffic(scene) {
  const pool = [];
  for (let i = 0; i < 5; i++) {
    const mesh = makeVehicle(i % 2, trafficMats[i % trafficMats.length]);
    const laneX = LANES[i % LANES.length];
    mesh.position.set(laneX, 0, -(150 + i * 130));
    mesh.userData = {
      trafficSpeed: 0.16 + Math.random() * 0.08,
      laneX,
      lastRelZ: null,
      nearPassAwarded: false,
    };
    scene.add(mesh);
    pool.push(mesh);
  }
  return pool;
}

function safeRecycle(v, traffic, truckPos) {
  const others = traffic.filter(o => o !== v);
  const shuffled = [...LANES].sort(() => Math.random() - 0.5);

  const laneScore = lane =>
    others.filter(o => o.userData.laneX === lane && o.position.z < truckPos.z).length;

  const chosenLane = shuffled.reduce((best, lane) =>
    laneScore(lane) < laneScore(best) ? lane : best
  );

  let bestZ = truckPos.z - (TRAFFIC_MIN_AHEAD + Math.random() * (TRAFFIC_MAX_AHEAD - TRAFFIC_MIN_AHEAD));
  let bestGap = 0;

  for (let attempt = 0; attempt < 10; attempt++) {
    const candidateZ =
      truckPos.z - (TRAFFIC_MIN_AHEAD + Math.random() * (TRAFFIC_MAX_AHEAD - TRAFFIC_MIN_AHEAD));

    const minGap = others.reduce((min, o) => {
      return Math.min(min, Math.abs(candidateZ - o.position.z));
    }, Infinity);

    if (minGap > bestGap) {
      bestGap = minGap;
      bestZ = candidateZ;
      if (minGap > 80) break;
    }
  }

  return { laneX: chosenLane, z: bestZ };
}

export function updateTraffic(traffic, truckPos, speed, colCooldown) {
  let collision = null;
  let nearPasses = 0;
  const truckBodyZ = truckPos.z + TRUCK_Z_BIAS;

  traffic.forEach(v => {
    v.position.z -= v.userData.trafficSpeed;
    const relZ = v.position.z - truckPos.z;
    const prevRelZ = v.userData.lastRelZ;
    let collided = false;

    const cd = colCooldown.get(v) || 0;
    if (cd > 0) {
      colCooldown.set(v, cd - 1);
    } else if (Math.abs(speed) > 0.008) {
      const dx = Math.abs(truckPos.x - v.position.x);
      const dz = Math.abs(truckBodyZ - v.position.z);
      if (dx < TRUCK_HX + 1.1 && dz < TRUCK_HZ + 2.4) {
        collision = { relSpeed: Math.abs(speed - v.userData.trafficSpeed), vx: v.position.x };
        colCooldown.set(v, 45);
        collided = true;
      }
    }

    if (
      prevRelZ !== null &&
      prevRelZ < 0 &&
      relZ >= 0 &&
      !collided &&
      !v.userData.nearPassAwarded
    ) {
      const dx = Math.abs(truckPos.x - v.position.x);
      const dz = Math.abs(truckBodyZ - v.position.z);
      if (dx < TRUCK_HX + 1.8 && dz < TRUCK_HZ + 7) {
        nearPasses += 1;
        v.userData.nearPassAwarded = true;
      }
    }

    if (relZ > TRAFFIC_RECYCLE_BEHIND || relZ < -TRAFFIC_RECYCLE_TOO_FAR_AHEAD) {
      const { laneX, z } = safeRecycle(v, traffic, truckPos);
      v.userData.laneX = laneX;
      v.userData.trafficSpeed = 0.16 + Math.random() * 0.08;
      v.userData.lastRelZ = null;
      v.userData.nearPassAwarded = false;
      v.position.x = laneX;
      v.position.z = z;
      return;
    }

    v.userData.lastRelZ = relZ;
  });

  return { collision, nearPasses };
}
