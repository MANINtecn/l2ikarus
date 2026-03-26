import { useState, useEffect } from 'react';

const StatusSection = () => {
  const [stats, setStats] = useState([
    { label: 'Jogadores Online', value: '...', color: '#4ade80', key: 'players' },
    { label: 'Status do Login', value: '...', color: '#4ade80', key: 'status_login' },
    { label: 'Status do Jogo', value: '...', color: '#4ade80', key: 'status_game' },
    { label: 'Versão', value: 'Essence 7.3', color: 'var(--primary-gold)', key: 'version' },
  ]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        setStats(prev => prev.map(s => {
          if (s.key === 'players') return { ...s, value: data.players.toLocaleString() };
          if (s.key === 'status_login') return { ...s, value: data.status_login, color: data.online ? '#4ade80' : '#ef4444' };
          if (s.key === 'status_game') return { ...s, value: data.status_game, color: data.online ? '#4ade80' : '#ef4444' };
          return s;
        }));
      } catch (error) {
        console.error('Error fetching status:', error);
        // Fallback or keep loading
        setStats(prev => prev.map(s => {
          if (s.key === 'players') return { ...s, value: '1,240' };
          if (s.key === 'status_login') return { ...s, value: 'ONLINE' };
          if (s.key === 'status_game') return { ...s, value: 'ONLINE' };
          return s;
        }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="status-section" style={{ padding: '4rem 2rem', background: 'var(--bg-darker)' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2rem' 
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid rgba(197, 160, 89, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} className="stat-card">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{stat.label}</p>
            <h3 style={{ color: stat.color, fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatusSection;
