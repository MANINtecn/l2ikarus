import React from 'react';
import DraggableItem from './DraggableItem';

const RoadmapSection = ({ isAdmin, onDuplicate }) => {
  const steps = [
    {
      id: 'road-1',
      date: 'MARÇO 20',
      title: 'VÍDEO DE INTRODUÇÃO',
      description: 'Lançamento do vídeo oficial apresentando as mecânicas únicas do Ikarus Dungeons.',
      status: 'completed'
    },
    {
      id: 'road-2',
      date: 'ABRIL 05',
      title: 'OPEN BETA',
      description: 'Teste de stress e balanceamento final com a comunidade. Recompensas exclusivas para testers.',
      status: 'active'
    },
    {
      id: 'road-3',
      date: 'ABRIL 15',
      title: 'GRAND OPENING',
      description: 'Abertura oficial dos portões. A jornada épica começa aqui!',
      status: 'upcoming'
    }
  ];

  return (
    <section id="roadmap" className="roadmap-section" style={{ padding: '6rem 2rem', background: 'var(--bg-dark)', minHeight: '800px', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', height: '100%' }}>
        
        <DraggableItem 
          id="roadmap-header" isAdmin={isAdmin} 
          initialPos={{ x: 0, y: 0 }}
          onDuplicate={onDuplicate}
        >
          <h2 style={{ 
            textAlign: 'center', fontSize: '2.5rem', color: 'var(--primary-gold)', 
            marginBottom: '4rem', textTransform: 'uppercase', fontWeight: '800', width: '100%',
            pointerEvents: 'none'
          }}>Roadmap do Servidor</h2>
        </DraggableItem>
        
        <div style={{ position: 'relative', marginTop: '100px' }}>
          {/* Vertical Line */}
          <div style={{ 
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', 
            width: '2px', height: '100%', background: 'rgba(197, 160, 89, 0.2)', zIndex: 1,
            pointerEvents: 'none'
          }} />

          {steps.map((step, index) => (
            <div key={step.id} style={{ 
              display: 'flex', justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
              width: '100%', marginBottom: '4rem', position: 'relative', zIndex: 2
            }}>
              <DraggableItem 
                id={step.id} isAdmin={isAdmin} 
                initialPos={{ x: 0, y: 0 }} initialSize={{ width: 450 }}
                onDuplicate={onDuplicate}
              >
                <div style={{ 
                  width: '100%', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '12px',
                  border: `1px solid ${step.status === 'active' ? 'var(--primary-gold)' : 'rgba(197, 160, 89, 0.1)'}`,
                  boxShadow: step.status === 'active' ? '0 0 20px rgba(197, 160, 89, 0.1)' : 'none'
                }}>
                  <span style={{ color: 'var(--primary-gold)', fontSize: '0.9rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', pointerEvents: 'none' }}>{step.date}</span>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', pointerEvents: 'none' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', pointerEvents: 'none' }}>{step.description}</p>
                </div>
              </DraggableItem>

              {/* Dot on line */}
              <div style={{
                position: 'absolute', left: '50%', top: '20px', transform: 'translateX(-50%)',
                width: '16px', height: '16px', borderRadius: '50%',
                background: step.status === 'upcoming' ? 'var(--bg-dark)' : 'var(--primary-gold)',
                border: '2px solid var(--primary-gold)', zIndex: 10,
                boxShadow: step.status === 'active' ? '0 0 15px var(--primary-gold)' : 'none',
                pointerEvents: 'none'
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
