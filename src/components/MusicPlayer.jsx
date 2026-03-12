import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Built-in royalty-free ambient tracks ────────────────────────────────────
const BUILT_IN_TRACKS = [
  { id: 'b1', label: 'Bensound Yesterday', src: '/music/bensound-yesterday.mp3' },
];

// ─── Keyframe injection (runs once) ─────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600&display=swap');

  @keyframes mp-panel-in {
    from { opacity: 0; transform: translateX(-12px) scale(0.96); }
    to   { opacity: 1; transform: translateX(0)     scale(1);    }
  }
  @keyframes mp-icon-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,200,80,.45); }
    50%      { box-shadow: 0 0 0 8px rgba(255,200,80,0); }
  }
  @keyframes mp-bar {
    0%,100% { transform: scaleY(.3); }
    50%      { transform: scaleY(1); }
  }
  @keyframes mp-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .mp-panel {
    animation: mp-panel-in .22s cubic-bezier(.22,1,.36,1) both;
  }
  .mp-icon-btn:hover  .mp-icon-ring { opacity:.35; }
  .mp-track-btn:hover { background: rgba(255,255,255,.10) !important; }
  .mp-track-btn.active { background: rgba(255,200,80,.15) !important; border-color: rgba(255,200,80,.5) !important; }
  .mp-upload:hover { border-color: rgba(255,200,80,.6) !important; color: rgba(255,200,80,.9) !important; }
  .mp-close:hover  { color: #fff !important; }
  .mp-playpause:hover { transform: scale(1.1); }
`;

function injectStyles() {
  if (document.getElementById('mp-styles')) return;
  const el = document.createElement('style');
  el.id = 'mp-styles';
  el.textContent = STYLES;
  document.head.appendChild(el);
}

// ─── Tiny icon SVGs ──────────────────────────────────────────────────────────
const IconNote = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);
const IconPause = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);
const IconUpload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

// ─── Animated equalizer bars ─────────────────────────────────────────────────
const EqBars = ({ playing }) => (
  <span style={{ display:'inline-flex', alignItems:'flex-end', gap:2, height:14, marginRight:6 }}>
    {[0, .15, .3].map((delay, i) => (
      <span key={i} style={{
        display:'block', width:3, height:14,
        background:'rgba(255,200,80,.85)', borderRadius:2, transformOrigin:'bottom',
        animation: playing ? `mp-bar .6s ${delay}s ease-in-out infinite` : 'none',
        transform: playing ? undefined : 'scaleY(.3)',
      }}/>
    ))}
  </span>
);

// ─── Main component ──────────────────────────────────────────────────────────
export default function MusicPlayer() {
  const [open,       setOpen]       = useState(false);
  const [playing,    setPlaying]    = useState(false);
  const [trackId,    setTrackId]    = useState(BUILT_IN_TRACKS[0].id);
  const [userTracks, setUserTracks] = useState([]); // {id, label, src}
  const [volume,     setVolume]     = useState(0.65);

  const audioRef   = useRef(new Audio());
  const fileInput  = useRef(null);
  const nextIdRef  = useRef(1);

  // full merged list
  const allTracks  = [...BUILT_IN_TRACKS, ...userTracks];
  const current    = allTracks.find(t => t.id === trackId) || allTracks[0];

  // inject styles once
  useEffect(() => { injectStyles(); }, []);

  // update audio src on track change
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;
    audio.src = current?.src || '';
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, current?.src]);

  // sync play/pause without re-loading src
  useEffect(() => {
    const audio = audioRef.current;
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  }, [playing]);

  // volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // cleanup blob URLs
  useEffect(() => {
    return () => { userTracks.forEach(t => URL.revokeObjectURL(t.src)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTrack = useCallback((id) => {
    if (id === trackId) {
      setPlaying(p => !p);
    } else {
      setTrackId(id);
      setPlaying(true);
    }
  }, [trackId]);

  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src   = URL.createObjectURL(file);
    const label = file.name.replace(/\.[^.]+$/, '').slice(0, 22);
    const id    = `u${nextIdRef.current++}`;
    setUserTracks(prev => [...prev, { id, label, src }]);
    setTrackId(id);
    setPlaying(true);
    e.target.value = '';
  }, []);

  const toggleOpen  = () => setOpen(o => !o);

  // ── Shared style tokens ────────────────────────────────────────────────────
  const glass = {
    background: 'rgba(12,12,16,.88)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,.10)',
  };

  return (
    <div style={{ position:'fixed', bottom:18, left:18, zIndex:9999, fontFamily:"'Rajdhani', sans-serif" }}>

      {/* ── Expandable panel ─────────────────────────────────────────────── */}
      {open && (
        <div className="mp-panel" style={{
          ...glass,
          marginBottom: 10,
          borderRadius: 14,
          width: 230,
          padding: '14px 14px 12px',
          color: '#ddd',
          fontSize: 13,
          boxShadow: '0 8px 32px rgba(0,0,0,.6)',
        }}>

          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ color:'rgba(255,200,80,.9)', fontWeight:600, fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase' }}>
              Now Playing
            </span>
            {/* play / pause mini button */}
            <button className="mp-playpause" onClick={() => setPlaying(p => !p)} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'rgba(255,200,80,.9)', padding:0, lineHeight:1,
              transition:'transform .15s', display:'flex', alignItems:'center',
            }}>
              {playing ? <IconPause/> : <IconPlay/>}
            </button>
          </div>

          {/* Current track name */}
          <div style={{ display:'flex', alignItems:'center', marginBottom:14, minHeight:20 }}>
            <EqBars playing={playing} />
            <span style={{ color:'#fff', fontWeight:600, fontSize:14, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:155 }}>
              {current?.label || '—'}
            </span>
          </div>

          {/* Track list */}
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {allTracks.map(t => {
              const active = t.id === trackId;
              return (
                <button key={t.id} className={`mp-track-btn${active ? ' active' : ''}`}
                  onClick={() => selectTrack(t.id)}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    background: active ? 'rgba(255,200,80,.1)' : 'rgba(255,255,255,.04)',
                    border: `1px solid ${active ? 'rgba(255,200,80,.4)' : 'rgba(255,255,255,.07)'}`,
                    borderRadius:8, padding:'7px 10px', cursor:'pointer',
                    color: active ? 'rgba(255,200,80,.95)' : '#bbb',
                    fontFamily:"inherit", fontSize:13, fontWeight: active ? 600 : 400,
                    textAlign:'left', width:'100%', transition:'background .15s, border-color .15s',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                  }}>
                  {/* spinning disc icon when active */}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"
                    style={{ flexShrink:0, animation: active && playing ? 'mp-spin 2s linear infinite' : 'none', opacity: active ? 1 : .45 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3" fill="rgba(12,12,16,.9)"/>
                  </svg>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Upload button */}
          <button className="mp-upload"
            onClick={() => fileInput.current?.click()}
            style={{
              marginTop:10, width:'100%',
              background:'rgba(255,255,255,.04)',
              border:'1.5px dashed rgba(255,255,255,.18)',
              borderRadius:8, padding:'7px 10px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              color:'rgba(255,255,255,.45)', fontFamily:'inherit', fontSize:12,
              cursor:'pointer', transition:'border-color .2s, color .2s',
            }}>
            <IconUpload/>
            Add from device
          </button>
          <input ref={fileInput} type="file" accept="audio/mp3,audio/*" style={{ display:'none' }} onChange={handleUpload}/>

          {/* Volume row */}
          <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            <input type="range" min="0" max="1" step="0.02" value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              style={{
                flex:1, accentColor:'rgba(255,200,80,.85)', cursor:'pointer',
                height:3, background:'transparent',
              }}/>
          </div>
        </div>
      )}

      {/* ── Floating music icon button ───────────────────────────────────── */}
      <button className="mp-icon-btn"
        onClick={toggleOpen}
        style={{
          ...glass,
          width:46, height:46, borderRadius:13,
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', color: playing ? 'rgba(255,200,80,.95)' : 'rgba(255,255,255,.7)',
          animation: playing && !open ? 'mp-icon-pulse 2s ease-in-out infinite' : 'none',
          transition:'color .2s, box-shadow .2s',
          boxShadow:'0 4px 20px rgba(0,0,0,.5)',
          position:'relative', overflow:'visible',
        }}>

        {/* subtle ring */}
        <span className="mp-icon-ring" style={{
          position:'absolute', inset:-4, borderRadius:17,
          border:'1.5px solid rgba(255,200,80,.25)', opacity:0,
          transition:'opacity .2s',
        }}/>

        <IconNote/>

        {/* tiny playing dot */}
        {playing && (
          <span style={{
            position:'absolute', top:6, right:6,
            width:5, height:5, borderRadius:'50%',
            background:'rgba(255,200,80,.9)',
            boxShadow:'0 0 5px rgba(255,200,80,.8)',
          }}/>
        )}
      </button>

    </div>
  );
}
