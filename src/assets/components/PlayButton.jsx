import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function PlayButton() {
  const [status, setStatus] = useState('checking'); // checking, ready, updating, playing
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular verificação de arquivos no início
    setTimeout(async () => {
      if (window.electronAPI) {
        try {
          const result = await window.electronAPI.checkFiles();
          if (result.status === 'ready') {
            setStatus('ready');
          }
        } catch (e) {
          setError('Erro na verificação de arquivos.');
          setStatus('ready'); // Fallback para permitir jogar
        }
      } else {
        setStatus('ready'); // Modo browser
      }
    }, 2000);
  }, []);

  const handlePlay = async () => {
    if (status !== 'ready') return;
    
    setStatus('playing');
    if (window.electronAPI) {
      const result = await window.electronAPI.launchGame();
      if (!result.success) {
        setError(result.error);
        setStatus('ready');
      } else {
        // Opcional: Fechar o launcher após abrir o jogo
        // window.electronAPI.close();
        setTimeout(() => setStatus('ready'), 5000); // Reset após 5s
      }
    } else {
      alert('Funcionalidade disponível apenas no Launcher!');
      setStatus('ready');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 15000,
      textAlign: 'center',
      width: '100%',
      maxWidth: '600px'
    }}>
      {error && <p style={{ color: '#ff4444', fontSize: '0.7rem', marginBottom: '10px' }}>{error}</p>}
      
      <div className="glass-panel" style={{
        padding: '1.5rem 3rem',
        border: '1px solid rgba(197, 160, 89, 0.3)',
        background: 'rgba(5, 5, 8, 0.9)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Barra de progresso ao fundo */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: 'var(--gold)',
          width: `${status === 'checking' ? 100 : progress}%`,
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px var(--gold)',
          opacity: (status === 'checking' || status === 'updating') ? 1 : 0
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 className="cinzel" style={{ color: 'var(--gold)', margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>
              {status === 'checking' && 'VERIFICANDO INTEGRIDADE...'}
              {status === 'ready' && 'SISTEMA PRONTO'}
              {status === 'updating' && 'ATUALIZANDO CLIENTE...'}
              {status === 'playing' && 'LANÇANDO JOGO...'}
            </h4>
            <p style={{ color: 'var(--text-mute)', fontSize: '0.6rem', letterSpacing: '1px', marginTop: '5px' }}>
              {status === 'checking' && 'Sincronizando com o servidor Samurai Crow'}
              {status === 'ready' && 'Todos os arquivos estão atualizados.'}
              {status === 'playing' && 'Iniciando L2.exe - Bom jogo, Samurai!'}
            </p>
          </div>

          <button 
            onClick={handlePlay}
            disabled={status !== 'ready'}
            className={`btn ${status === 'ready' ? 'btn-primary' : 'btn-disabled'}`}
            style={{ 
              padding: '1rem 4rem', 
              fontSize: '1.5rem', 
              boxShadow: status === 'ready' ? '0 0 30px rgba(197, 160, 89, 0.2)' : 'none',
              filter: status !== 'ready' ? 'grayscale(1)' : 'none'
            }}
          >
            {status === 'playing' ? 'EXECUTANDO' : 'JOGAR AGORA'}
          </button>
        </div>
      </div>
    </div>
  );
}
