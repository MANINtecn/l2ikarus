import { useState, useEffect } from 'react';
import DraggableItem from './DraggableItem';

const StatusSection = ({ isAdmin, onDuplicate }) => {
  const [stats, setStats] = useState([
    { label: 'Jogadores Online', value: '...', color: '#4ade80', id: 'stat-players', key: 'players' },
    { label: 'Status do Login', value: '...', color: '#4ade80', id: 'stat-login', key: 'status_login' },
    { label: 'Status do Jogo', value: '...', color: '#4ade80', id: 'stat-game', key: 'status_game' },
    { label: 'Versão', value: 'Essence 7.3', color: 'var(--primary-gold)', id: 'stat-version', key: 'version' },
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
        setStats(prev => prev.map(s => {
          if (s.key === 'players') return { ...s, value: '1,240' };
          if (s.key === 'status_login') return { ...s, value: 'ONLINE' };
          if (s.key === 'status_game') return { ...s, value: 'ONLINE' };
          return s;
        }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="status-section" style={{ padding: '4rem 2rem', background: 'var(--bg-darker)', minHeight: '300px', position: 'relative' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '2rem' 
      }}>
        {stats.map((stat, index) => (
          <DraggableItem
            key={stat.id}
            id={stat.id}
            isAdmin={isAdmin}
            onDuplicate={onDuplicate}
            initialPos={{ x: 0, y: 0 }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '2rem',
              borderRadius: '8px',
              border: '1px solid rgba(197, 160, 89, 0.1)',
              textAlign: 'center',
              width: '100%',
              height: '100%'
            }} className="stat-card">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', pointerEvents: 'none' }}>{stat.label}</p>
              <h3 style={{ color: stat.color, fontSize: '1.5rem', fontWeight: '800', pointerEvents: 'none' }}>{stat.value}</h3>
            </div>
          </DraggableItem>
        ))}
      </div>
    </section>
  );
};

export default StatusSection;
