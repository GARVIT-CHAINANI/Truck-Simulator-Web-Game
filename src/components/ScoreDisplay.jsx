// ScoreDisplay.jsx

const panelStyle = {
  position: 'fixed',
  top: 18,
  left: 18,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,160,80,0.15)',
  borderRadius: 12,
  padding: '10px 18px',
  pointerEvents: 'none',
  fontFamily: "'Courier New', monospace",
  minWidth: 130,
};

const popupWrapStyle = {
  position: 'fixed',
  top: 100,
  left: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  pointerEvents: 'none',
};

function popupStyle(label, index) {
  const isNeg = label.startsWith('-');
  return {
    alignSelf: 'flex-start',
    padding: '5px 12px',
    borderRadius: 999,
    border: isNeg
      ? '1px solid rgba(255,100,100,0.35)'
      : '1px solid rgba(120,255,190,0.24)',
    background: isNeg
      ? 'rgba(38,8,8,0.85)'
      : 'rgba(10,28,18,0.78)',
    color: isNeg ? '#ff7070' : '#9ff7c1',
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: 0.5,
    boxShadow: isNeg
      ? '0 4px 18px rgba(255,60,60,0.18)'
      : '0 4px 18px rgba(0,0,0,0.18)',
    animation: `score-popup 950ms ease-out forwards`,
    animationDelay: `${index * 60}ms`,
    opacity: 0,
  };
}

export default function ScoreDisplay({ score, popups = [] }) {
  return (
    <>
      <style>{`
        @keyframes score-popup {
          0%   { opacity: 0; transform: translateY(6px) scale(0.92); }
          15%  { opacity: 1; transform: translateY(0)   scale(1.06); }
          30%  { transform: scale(1); }
          100% { opacity: 0; transform: translateY(-14px) scale(1.02); }
        }
      `}</style>

      <div style={panelStyle}>
        <div style={{ fontSize: 10, color: '#c08060', letterSpacing: 3, marginBottom: 4 }}>
          SCORE
        </div>
        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', lineHeight: 1 }}>
          {score.toLocaleString()}
        </div>
      </div>

      <div style={popupWrapStyle}>
        {popups.map((popup, index) => (
          <div key={popup.id} style={popupStyle(popup.label, index)}>
            {popup.label}
          </div>
        ))}
      </div>
    </>
  );
}