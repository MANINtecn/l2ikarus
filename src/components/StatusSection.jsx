const StatusSection = () => {
  const stats = [
    { label: 'Jogadores Online', value: '1,240', color: '#4ade80' },
    { label: 'Status do Login', value: 'ONLINE', color: '#4ade80' },
    { label: 'Status do Jogo', value: 'ONLINE', color: '#4ade80' },
    { label: 'Versão', value: 'Essence 7.3', color: 'var(--primary-gold)' },
  ];

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
