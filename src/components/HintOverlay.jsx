const K = ({ children }) => (
  <span style={{
    border: '1px solid rgba(255,180,100,0.3)',
    borderRadius: 3,
    padding: '1px 6px',
    color: 'rgba(255,180,100,0.65)',
    margin: '0 3px',
  }}>
    {children}
  </span>
);

export default function HintOverlay() {
  return (
    <div style={{
      position: 'fixed',
      top: 18,
      right: 18,
      color: 'rgba(255,180,100,0.4)',
      fontFamily: "'Courier New', monospace",
      fontSize: 11,
      letterSpacing: 2,
      pointerEvents: 'none',
    }}>
      <K>W</K>Drive &nbsp;<K>S</K>Reverse &nbsp;<K>A</K>/<K>D</K>Lane
    </div>
  );
}
