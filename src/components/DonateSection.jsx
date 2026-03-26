import React from 'react';

const DonateSection = () => {
  const donationInfo = [
    {
      title: 'L-COINS',
      description: 'Moeda principal para itens de conveniência e consumíveis no Special Shop.',
      icon: '💎'
    },
    {
      title: 'CUSTOM SKINS',
      description: 'Acesse nosso sistema exclusivo de visuais sem atributos. Estilo puro!',
      icon: '🎭'
    },
    {
      title: 'VIP SYSTEM',
      description: 'Benefícios que economizam seu tempo, sem desbalancear o PvP.',
      icon: '⭐'
    }
  ];

  return (
    <section id="donate" className="donate-section" style={{ padding: '6rem 2rem', background: 'linear-gradient(to bottom, var(--bg-darker), var(--bg-dark))' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: 'var(--primary-gold)', 
          marginBottom: '1rem',
          textTransform: 'uppercase',
          fontWeight: '800'
        }}>Apoie o Servidor</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          O Ikarus Dungeons é mantido por jogadores para jogadores. Todo apoio é investido em infraestrutura e novas atualizações.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {donationInfo.map((item, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.03)',
              padding: '3rem 2rem',
              borderRadius: '16px',
              border: '1px solid rgba(197, 160, 89, 0.1)',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
              cursor: 'default'
            }} className="donate-card">
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
              <h3 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.description}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem' }}>
          <button style={{
            background: 'var(--primary-gold)',
            color: 'var(--bg-dark)',
            padding: '1rem 3rem',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
          }} className="btn-primary">
            Acessar Painel de Doação
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .donate-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary-gold);
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.4);
        }
      `}} />
    </section>
  );
};

export default DonateSection;
