import React from 'react';
import DraggableItem from './DraggableItem';

const DonateSection = ({ isAdmin, onDuplicate }) => {
  const donationInfo = [
    {
      id: 'don-1',
      title: 'L-COINS',
      description: 'Moeda principal para itens de conveniência e consumíveis no Special Shop.',
      icon: '💎'
    },
    {
      id: 'don-2',
      title: 'CUSTOM SKINS',
      description: 'Acesse nosso sistema exclusivo de visuais sem atributos. Estilo puro!',
      icon: '🎭'
    },
    {
      id: 'don-3',
      title: 'VIP SYSTEM',
      description: 'Benefícios que economizam seu tempo, sem desbalancear o PvP.',
      icon: '⭐'
    }
  ];

  return (
    <section id="donate" className="donate-section" style={{ padding: '6rem 2rem', background: 'linear-gradient(to bottom, var(--bg-darker), var(--bg-dark))', minHeight: '800px', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', height: '100%' }}>
        
        <DraggableItem 
          id="donate-header" isAdmin={isAdmin} 
          initialPos={{ x: 0, y: 0 }}
          onDuplicate={onDuplicate}
        >
          <div style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-gold)', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '800', pointerEvents: 'none' }}>Apoie o Servidor</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto', pointerEvents: 'none' }}>
              O Ikarus Dungeons é mantido por jogadores para jogadores. Todo apoio é investido em infraestrutura e novas atualizações.
            </p>
          </div>
        </DraggableItem>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem', marginTop: '150px'
        }}>
          {donationInfo.map((item, index) => (
            <DraggableItem 
              key={item.id} id={item.id} isAdmin={isAdmin} 
              initialPos={{ x: 0, y: 0 }}
              className="donate-card"
              onDuplicate={onDuplicate}
            >
              <div style={{
                background: 'rgba(255,255,255,0.03)', padding: '3rem 2rem', borderRadius: '16px',
                border: '1px solid rgba(197, 160, 89, 0.1)', transition: 'all 0.3s ease',
                width: '100%', height: '100%'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem', pointerEvents: 'none' }}>{item.icon}</div>
                <h3 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', pointerEvents: 'none' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', pointerEvents: 'none' }}>{item.description}</p>
              </div>
            </DraggableItem>
          ))}
        </div>

        <DraggableItem 
          id="donate-btn" isAdmin={isAdmin} 
          initialPos={{ x: window.innerWidth / 2 - 150, y: 650 }}
          onDuplicate={onDuplicate}
        >
          <button className="btn-primary" style={{
            background: 'var(--primary-gold)', color: 'var(--bg-dark)',
            padding: '1rem 3rem', borderRadius: '4px', fontSize: '1.1rem',
            fontWeight: 'bold', border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}>
            Acessar Painel de Doação
          </button>
        </DraggableItem>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .donate-card:hover { transform: translateY(-10px); border-color: var(--primary-gold); }
        .btn-primary:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(197, 160, 89, 0.4); }
      `}} />
    </section>
  );
};

export default DonateSection;
