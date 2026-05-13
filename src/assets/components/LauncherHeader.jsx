import React from 'react';

export default function LauncherHeader() {
  const handleMinimize = () => {
    if (window.electronAPI) window.electronAPI.minimize();
  };

  const handleClose = () => {
    if (window.electronAPI) window.electronAPI.close();
  };

  return (
    <div style={{
      height: '35px',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 15px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20000,
      WebkitAppRegion: 'drag',
      borderBottom: '1px solid rgba(197, 160, 89, 0.2)'
    }}>
      <div style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 'bold' }}>
        SAMURAI CROW <span style={{ opacity: 0.5 }}>| LAUNCHER v1.1</span>
      </div>
      <div style={{ display: 'flex', gap: '15px', WebkitAppRegion: 'no-drag' }}>
        <button onClick={handleMinimize} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.6 }}>—</button>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.6 }}>×</button>
      </div>
    </div>
  );
}
