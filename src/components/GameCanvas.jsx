// GarmCanvas.jsx

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

import { createScene }                  from '../three/scene';
import { createRoad, recycleZ }         from '../three/road';
import { createTruck }                  from '../three/truck';
import { createScenery }                from '../three/scenery';
import { createTraffic, updateTraffic } from '../three/traffic';
import { spawnSmoke, updateSmoke }      from '../three/smoke';
import { useKeyboard }                  from '../hooks/useKeyboard';
import {
  MAX_FWD, MAX_REV, ACCEL, DECEL,
  STAGE1_MAX, STAGE2_MAX, STAGE3_MAX,
  STEER_ACCEL, STEER_DAMPING, ROAD_LIMIT,
} from '../three/constants';

import HUD            from './HUD';
import LaneIndicator  from './LaneIndicator';
import CollisionFlash from './CollisionFlash';
import HintOverlay    from './HintOverlay';
import ScoreDisplay   from './ScoreDisplay.jsx';
import MusicPlayer    from './MusicPlayer';
import SupportDrawer  from './SupportDrawer';

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const keys      = useKeyboard();
  const popupIdRef = useRef(0);
  const popupTimeoutsRef = useRef([]);

  const [hudData,   setHudData]   = useState({ kmh: 0, gear: 'N', dist: '0.0', lane: 1 });
  const [scoreData, setScoreData] = useState({ score: 0 });
  const [scorePopups, setScorePopups] = useState([]);
  const [flash,     setFlash]     = useState(false);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
  }, []);

  const showScorePopup = useCallback((label) => {
    const id = popupIdRef.current++;
    setScorePopups(current => [...current, { id, label }]);
    const timeoutId = window.setTimeout(() => {
      setScorePopups(current => current.filter(popup => popup.id !== id));
    }, 950);
    popupTimeoutsRef.current.push(timeoutId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    const { renderer, scene, camera, skyMesh, sunDisc, halo, horizonMesh } =
      createScene(canvas);
    const { segs, ground, HALF, SPAN } = createRoad(scene);
    const { truck, wheelMeshes }       = createTruck(scene);
    const { treeObjs, bushObjs, poleObjs } = createScenery(scene);
    const traffic     = createTraffic(scene);
    const smokeParts  = [];
    const colCooldown = new Map();

    let speed         = 0;
    let driveTime     = 0;
    let totalDist     = 0;
    let lateralVel    = 0;
    let shakeAmt      = 0;
    let noAccelFrames = 0;
    let frame         = 0;

    let score         = 0;
    let nextKmScore   = 5;

    const camPos = new THREE.Vector3(0, 7.8, 14.5);
    const camTgt = new THREE.Vector3(0, 3.1, 0);

    let rafId;

    function loop() {
      rafId = requestAnimationFrame(loop);
      frame++;

      const k = keys.current;

      if (noAccelFrames > 0) {
        noAccelFrames--;
        if      (speed > 0) speed = Math.max(0, speed - DECEL);
        else if (speed < 0) speed = Math.min(0, speed + DECEL);
      } else if (k['w']) {
        driveTime += 0.016;
        let dmax;
        if      (driveTime < 1.0) { dmax = STAGE1_MAX; }
        else if (driveTime < 4.5) { const t = (driveTime - 1.0) / 3.5;  dmax = STAGE1_MAX + (STAGE2_MAX - STAGE1_MAX) * t * t; }
        else                       { const t = Math.min((driveTime - 4.5) / 11, 1); dmax = STAGE2_MAX + (STAGE3_MAX - STAGE2_MAX) * t * t * t; }
        speed = Math.min(speed + ACCEL, dmax);
      } else if (k['s']) {
        driveTime = 0;
        speed = Math.max(speed - ACCEL, -MAX_REV);
      } else {
        driveTime = 0;
        if      (speed > 0) speed = Math.max(0, speed - DECEL);
        else if (speed < 0) speed = Math.min(0, speed + DECEL);
      }

      truck.position.z -= speed;
      totalDist        += Math.abs(speed);

      const fovFactor = speed > 0 ? Math.min(speed / MAX_FWD, 1) : 0;
      camera.fov += (65 + fovFactor * 3.5 - camera.fov) * 0.04;
      camera.updateProjectionMatrix();

      const sf  = Math.min(Math.abs(speed) / MAX_FWD, 1);
      const dsa = STEER_ACCEL * (0.4 + sf * 3.6);
      const dd  = STEER_DAMPING - sf * 0.08;
      if (k['a']) lateralVel -= dsa;
      if (k['d']) lateralVel += dsa;
      lateralVel       *= dd;
      truck.position.x += lateralVel;
      if (truck.position.x < -ROAD_LIMIT) { truck.position.x = -ROAD_LIMIT; lateralVel *= -0.2; }
      if (truck.position.x >  ROAD_LIMIT) { truck.position.x =  ROAD_LIMIT; lateralVel *= -0.2; }

      truck.rotation.z += (-lateralVel * 2.2 - truck.rotation.z) * 0.14;
      truck.rotation.x += (speed * 0.05  - truck.rotation.x) * 0.12;
      truck.position.y  = Math.sin(frame * 0.28) * Math.abs(speed) * 0.035;
      wheelMeshes.forEach(w => (w.rotation.x += speed * 1.9));

      const tz = truck.position.z;
      ground.position.z = tz;
      segs.forEach    (s => recycleZ(s, tz, HALF, SPAN));
      treeObjs.forEach(t => recycleZ(t, tz, HALF, SPAN));
      bushObjs.forEach(b => recycleZ(b, tz, HALF, SPAN));
      poleObjs.forEach(p => recycleZ(p, tz, HALF, SPAN));

      const distanceKm = totalDist * 0.05;
      while (distanceKm >= nextKmScore) {
        score += 1;
        nextKmScore += 5;
      }

      const { collision, nearPasses } = updateTraffic(traffic, truck.position, speed, colCooldown);
      if (nearPasses > 0) {
        score += nearPasses * 5;
        for (let i = 0; i < nearPasses; i++) {
          showScorePopup('+5');
        }
      }

if (collision) {
  const bleed   = Math.max(0.35, 1.0 - collision.relSpeed * 2.5);
  speed        *= bleed;
  driveTime     = 0;
  noAccelFrames = 30;
  lateralVel   += (truck.position.x < collision.vx) ? -0.07 : 0.07;
  shakeAmt      = 1.8;
  score         = Math.max(0, score - 10);
  triggerFlash();
  showScorePopup('-10'); // ← add this line
}

      skyMesh.position.copy(camera.position);
      sunDisc.position.z     = tz - 450;
      halo.position.z        = tz - 449;
      horizonMesh.position.z = tz - 520;

      if (frame % 4 === 0) spawnSmoke(scene, smokeParts, truck.position, speed);
      updateSmoke(scene, smokeParts);

      shakeAmt *= 0.80;
      const fwd = speed >= 0 ? 1 : -1;
      camPos.lerp(new THREE.Vector3(truck.position.x, truck.position.y + 7.4, tz + fwd * 14.5), 0.08);
      camTgt.lerp(new THREE.Vector3(truck.position.x, truck.position.y + 3.1, tz - 6), 0.10);
      const shakeDir = frame % 2 === 0 ? 1 : -1;
      camera.position.set(
        camPos.x + shakeDir * shakeAmt * 0.22,
        camPos.y + (Math.random() - 0.5) * shakeAmt * 0.20,
        camPos.z
      );
      camera.lookAt(camTgt);

      if (frame % 3 === 0) {
        const kmh   = Math.round(Math.abs(speed) * 200);
        const gear  = speed > 0.02 ? 'D' : speed < -0.02 ? 'R' : 'N';
        const dist  = distanceKm.toFixed(1);
        const normX = (truck.position.x + ROAD_LIMIT) / (2 * ROAD_LIMIT);
        const lane  = Math.min(2, Math.floor(normX * 3));
        setHudData({ kmh, gear, dist, lane });
        setScoreData({ score });
      }

      renderer.render(scene, camera);
    }

    loop();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      popupTimeoutsRef.current.forEach(window.clearTimeout);
      popupTimeoutsRef.current = [];
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [showScorePopup, triggerFlash]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      <CollisionFlash active={flash} />
      <ScoreDisplay score={scoreData.score} popups={scorePopups} />
      <LaneIndicator lane={hudData.lane} />
      <HintOverlay />
      <HUD kmh={hudData.kmh} gear={hudData.gear} dist={hudData.dist} />
      <MusicPlayer />
      <SupportDrawer />
    </div>
  );
}
