import { useEffect, useRef } from 'react';

export default function Speedometer({ kmh }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const S    = 150;
    const cx   = S / 2;
    const cy   = S / 2;
    const r    = 64;
    const sA   = Math.PI * 0.75;
    const eA   = Math.PI * 2.25;
    const maxK = 120;

    ctx.clearRect(0, 0, S, S);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, sA, eA);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth   = 9;
    ctx.stroke();

    // Filled arc
    const frac = Math.min(kmh / maxK, 1);
    if (frac > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, sA, sA + (eA - sA) * frac);
      const g = ctx.createLinearGradient(0, S, S, 0);
      g.addColorStop(0,   '#FFB347');
      g.addColorStop(0.6, '#FF6030');
      g.addColorStop(1,   '#FF2020');
      ctx.strokeStyle = g;
      ctx.lineWidth   = 9;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const a = sA + (eA - sA) * (i / 10);
      const major = i % 5 === 0;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r - (major ? 16 : 10)), cy + Math.sin(a) * (r - (major ? 16 : 10)));
      ctx.lineTo(cx + Math.cos(a) * (r + 2),                  cy + Math.sin(a) * (r + 2));
      ctx.strokeStyle = major ? 'rgba(255,200,140,0.55)' : 'rgba(255,200,140,0.2)';
      ctx.lineWidth   = major ? 2 : 1;
      ctx.stroke();
    }

    // Needle
    const na = sA + (eA - sA) * frac;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(na);
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(r - 18, 0);
    ctx.strokeStyle = '#FF4020';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.stroke();
    ctx.restore();

    // Centre dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,220,180,0.9)';
    ctx.fill();
  }, [kmh]);

  return (
    <div style={{ position: 'relative', width: 150, height: 150 }}>
      <canvas ref={canvasRef} width={150} height={150} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -44%)', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: '#fff', fontFamily: "'Courier New', monospace", lineHeight: 1 }}>
          {kmh}
        </div>
        <div style={{ fontSize: 10, color: '#c08060', letterSpacing: 4 }}>KM/H</div>
      </div>
    </div>
  );
}
