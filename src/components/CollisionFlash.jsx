export default function CollisionFlash({ active }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      background: active ? 'rgba(255,130,40,0.20)' : 'rgba(255,130,40,0.0)',
      transition: active ? 'none' : 'background 0.35s ease-out',
    }} />
  );
}
