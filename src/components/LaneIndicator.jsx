export default function LaneIndicator({ lane }) {
  return (
    <div style={{
      position: 'fixed',
      top: 18,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          border: '1px solid rgba(255,180,100,0.3)',
          background: i === lane
            ? 'rgba(255,180,100,0.75)'
            : 'rgba(255,180,100,0.18)',
          boxShadow: i === lane ? '0 0 6px rgba(255,180,100,0.5)' : 'none',
          transition: 'background 0.25s',
        }} />
      ))}
    </div>
  );
}
