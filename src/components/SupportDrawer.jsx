import { useEffect, useState } from 'react';

const SUPPORT_LINK = 'https://rzp.io/rzp/TMBjhIuX';

const panelStyles = {
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  width: 'min(60vw, 760px)',
  maxWidth: '100vw',
  padding: '28px 24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background:
    'linear-gradient(180deg, rgba(34,22,12,0.98) 0%, rgba(17,11,7,0.98) 100%)',
  borderLeft: '1px solid rgba(255,255,255,0.12)',
  boxShadow: '-18px 0 44px rgba(0,0,0,0.45)',
  backdropFilter: 'blur(18px)',
  zIndex: 10020,
  transition: 'transform 240ms cubic-bezier(.22,1,.36,1)',
};

function CoffeeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9h10a0 0 0 0 1 0 0v4a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5V9a0 0 0 0 1 0 0Z" />
      <path d="M16 10h1a3 3 0 1 1 0 6h-1" />
      <path d="M8 3c1 1 1 2 0 3" />
      <path d="M12 3c1 1 1 2 0 3" />
      <path d="M16 3c1 1 1 2 0 3" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function SupportDrawer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open support panel"
        style={{
          position: 'fixed',
          right: 18,
          bottom: 18,
          width: 60,
          height: 60,
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 999,
          background:
            'radial-gradient(circle at 30% 30%, rgba(255,220,160,0.95) 0%, rgba(183,99,44,0.96) 72%, rgba(92,46,16,0.98) 100%)',
          color: '#221107',
          boxShadow: '0 16px 28px rgba(0,0,0,0.42)',
          cursor: 'pointer',
          zIndex: 10010,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CoffeeIcon />
      </button>

      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.48)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
          zIndex: 10015,
        }}
      />

      <aside
        aria-hidden={!open}
        style={{
          ...panelStyles,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 28,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#ffd4a8' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <CoffeeIcon />
              </div>
              <div>
                <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.8 }}>
                  Support Me
                </p>
                <h2 style={{ fontSize: 28, lineHeight: 1.05, color: '#fff4e8', marginTop: 4 }}>
                  Buy me a cup of coffee
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support panel"
              style={{
                width: 42,
                height: 42,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 20,
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              padding: 24,
              borderRadius: 24,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p style={{ color: 'rgba(255,244,232,0.92)', fontSize: 18, lineHeight: 1.5 }}>
              If you enjoy the drive and want to support future updates, you can use the button
              below.
            </p>

            <p style={{ color: 'rgba(255,212,168,0.72)', fontSize: 14, lineHeight: 1.6, marginTop: 14 }}>
              Replace the placeholder link in this component with your Razorpay payment URL.
            </p>
          </div>
        </div>

        <a
          href={SUPPORT_LINK}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 58,
            width: '100%',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #ffdfb3 0%, #d48542 100%)',
            color: '#271105',
            textDecoration: 'none',
            fontSize: 18,
            fontWeight: 700,
            boxShadow: '0 14px 28px rgba(0,0,0,0.28)',
          }}
        >
          Buy me a cup of coffee
        </a>
      </aside>
    </>
  );
}
