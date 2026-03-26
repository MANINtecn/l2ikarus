import { useState, useEffect, useRef } from 'react';

export default function DraggableItem({ 
  id, 
  children, 
  initialPos = { x: 0, y: 0 }, 
  initialSize = {}, 
  initialStyle = { fontSize: 'inherit', fontFamily: 'inherit' },
  initialText = '',
  isAdmin = false, 
  className = "",
  onDelete = null,
  onDuplicate = null
}) {
  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem(`pos-${id}`);
    return saved ? JSON.parse(saved) : initialPos;
  });
  
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem(`size-${id}`);
    return saved ? JSON.parse(saved) : initialSize;
  });

  const [style, setStyle] = useState(() => {
    const saved = localStorage.getItem(`style-${id}`);
    return saved ? JSON.parse(saved) : initialStyle;
  });

  const [text, setText] = useState(() => {
    const saved = localStorage.getItem(`text-${id}`);
    return saved || initialText;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const elementRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem(`pos-${id}`, JSON.stringify(pos));
    localStorage.setItem(`size-${id}`, JSON.stringify(size));
    localStorage.setItem(`style-${id}`, JSON.stringify(style));
    localStorage.setItem(`text-${id}`, text);
  }, [pos, size, style, text, id]);

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setIsSelected(false);
      }
    };
    if (isAdmin) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isAdmin]);

  const onMouseDown = (e) => {
    if (!isAdmin || e.button !== 0 || e.target.closest('.builder-toolbar') || e.target.classList.contains('resize-handle')) return;
    setIsDragging(true);
    setIsSelected(true);
    const rect = elementRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.preventDefault();
  };

  const onResizeStart = (e) => {
    if (!isAdmin) return;
    setIsResizing(true);
    setIsSelected(true);
    startSize.current = {
      w: elementRef.current.offsetWidth,
      h: elementRef.current.offsetHeight,
      x: e.clientX,
      y: e.clientY,
    };
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDragging) {
        const parentRect = elementRef.current.parentElement.getBoundingClientRect();
        const newX = e.clientX - parentRect.left - offset.current.x;
        const newY = e.clientY - parentRect.top - offset.current.y;
        setPos({ x: newX, y: newY });
      }
      
      if (isResizing) {
        const deltaX = e.clientX - startSize.current.x;
        const deltaY = e.clientY - startSize.current.y;
        setSize({
          width: Math.max(50, startSize.current.w + deltaX),
          height: Math.max(20, startSize.current.h + deltaY),
        });
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing]);

  // Reset Logic
  useEffect(() => {
    const handleReset = () => {
      localStorage.removeItem(`pos-${id}`);
      localStorage.removeItem(`size-${id}`);
      localStorage.removeItem(`style-${id}`);
      localStorage.removeItem(`text-${id}`);
      setPos(initialPos);
      setSize(initialSize);
      setStyle(initialStyle);
      setText(initialText);
    };
    window.addEventListener('reset-layout', handleReset);
    return () => window.removeEventListener('reset-layout', handleReset);
  }, [id, initialPos, initialSize, initialStyle, initialText]);

  // Toolbar Handlers
  const changeFontSize = (delta) => {
    const current = parseInt(style.fontSize) || 16;
    setStyle(prev => ({ ...prev, fontSize: `${current + delta}px` }));
  };

  const toggleFont = () => {
    const fonts = ["'Cinzel', serif", "'Outfit', sans-serif", "inherit"];
    const idx = fonts.indexOf(style.fontFamily);
    setStyle(prev => ({ ...prev, fontFamily: fonts[(idx + 1) % fonts.length] }));
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={onMouseDown}
      className={`${className} ${isAdmin ? 'builder-mode' : ''} ${isSelected ? 'is-selected' : ''}`}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size.width || 'auto',
        height: size.height || 'auto',
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        cursor: isAdmin ? (isDragging ? 'grabbing' : 'grab') : 'default',
        zIndex: isDragging || isResizing || isSelected ? 2000 : (isAdmin ? 100 : 10),
        border: (isAdmin && (isDragging || isResizing || isSelected)) ? '2px solid var(--gold)' : 'none',
        padding: isAdmin ? '4px' : '0',
      }}
    >
      {/* TOOLBAR */}
      {isAdmin && isSelected && (
        <div className="builder-toolbar" style={{
          position: 'absolute', top: '-50px', left: 0, 
          background: '#111', border: '2px solid var(--gold)',
          borderRadius: '4px', display: 'flex', gap: '8px', padding: '8px',
          zIndex: 3000, boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap'
        }}>
          <button onClick={(e) => { e.stopPropagation(); toggleFont(); }} title="Mudar Fonte" style={{ background:'none', color:'var(--gold)', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:'700' }}>🎨 FONTE</button>
          <button onClick={(e) => { e.stopPropagation(); changeFontSize(2); }} title="Aumentar" style={{ background:'none', color:'var(--gold)', border:'none', cursor:'pointer', fontWeight:'700', padding:'0 5px' }}>A+</button>
          <button onClick={(e) => { e.stopPropagation(); changeFontSize(-2); }} title="Diminuir" style={{ background:'none', color:'var(--gold)', border:'none', cursor:'pointer', fontWeight:'700', padding:'0 5px' }}>A-</button>
          <div style={{ width:2, background:'rgba(197,160,89,0.3)', margin:'0 4px' }} />
          {onDuplicate && <button onClick={(e) => { e.stopPropagation(); onDuplicate(id); }} title="Duplicar" style={{ background:'none', color:'var(--gold)', border:'none', cursor:'pointer', fontSize:'14px' }}>📋</button>}
          {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(id); }} title="Excluir" style={{ background:'none', color:'#ff4444', border:'none', cursor:'pointer', fontSize:'14px' }}>🗑️</button>}
          <button onClick={(e) => { e.stopPropagation(); setIsSelected(false); }} title="Fechar" style={{ background:'none', color:'#666', border:'none', cursor:'pointer', fontSize:'12px', marginLeft:'4px' }}>✕</button>
        </div>
      )}

      {/* CONTENT */}
      {text ? (
        <div 
          contentEditable={isAdmin}
          suppressContentEditableWarning
          onBlur={(e) => setText(e.target.innerText)}
          style={{ 
            outline: 'none', 
            width: '100%', 
            height: '100%',
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            textAlign: 'inherit',
            pointerEvents: isAdmin ? 'auto' : 'none'
          }}
        >
          {text}
        </div>
      ) : (
        children
      )}
      
      {isAdmin && (
        <div 
          className="resize-handle"
          onMouseDown={onResizeStart}
          style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '12px', height: '12px', background: 'var(--gold)',
            cursor: 'nwse-resize', zIndex: 10, opacity: 0.7
          }}
        />
      )}
    </div>
  );
}
