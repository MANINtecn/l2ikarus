const InfoSection = () => {
  const features = [
    { title: 'Rates Épicas', description: 'XP x10, SP x10, Drop x5 - O equilíbrio perfeito entre progressão e diversão.' },
    { title: 'Eventos Diários', description: 'Torneios PvP, Invasões de Boss e Caça ao Tesouro todos os dias.' },
    { title: 'Sem Pay-to-Win', description: 'Economia balanceada focada no esforço e habilidade do jogador.' },
    { title: 'Suporte 24/7', description: 'Equipe dedicada para garantir que sua jornada seja livre de problemas.' },
  ];

  return (
    <section id="info" style={{ padding: '8rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="heading-font" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>
          Por que jogar no <span style={{ color: 'var(--primary-gold)' }}>L2 Ikarus</span>?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          {features.map((f, i) => (
            <div key={i}>
              <h3 className="heading-font" style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
