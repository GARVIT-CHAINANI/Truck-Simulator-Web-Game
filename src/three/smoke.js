import * as THREE from 'three';

const smokeMat = new THREE.MeshBasicMaterial({
  color: 0x7a5a3a,
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

export function spawnSmoke(scene, smokeParts, truckPos, speed) {
  if (Math.abs(speed) < 0.03) return;

  [-1.55, 1.55].forEach(px => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), smokeMat.clone());
    m.position.set(
      truckPos.x + px,
      truckPos.y + 5.25,
      truckPos.z - 0.6
    );
    m.userData = {
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        0.05 + Math.abs(speed) * 0.12,
        (Math.random() - 0.5) * 0.04
      ),
      life: 1.0,
    };
    scene.add(m);
    smokeParts.push(m);
  });
}

export function updateSmoke(scene, smokeParts) {
  for (let i = smokeParts.length - 1; i >= 0; i--) {
    const p = smokeParts[i];
    p.position.add(p.userData.vel);
    p.userData.life     -= 0.017;
    p.material.opacity   = p.userData.life * 0.25;
    p.scale.setScalar(1 + (1 - p.userData.life) * 4);
    if (p.userData.life <= 0) {
      scene.remove(p);
      smokeParts.splice(i, 1);
    }
  }
}
