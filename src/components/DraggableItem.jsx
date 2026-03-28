import { useState, useEffect, useRef } from 'react';

const safeJsonParse = (str, fallback) => {
  try {
    const parsed = JSON.parse(str);
    return parsed !== null ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

export default function DraggableItem({ 
  id, 
  children, 
  initialPos = { x: 0, y: 0 }, 
  initialSize = {}, 
  initialStyle = { fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' },
  initialText = '',
  isAdmin = false, 
  className = "",
  onDelete = null,
  onDuplicate = null
}) {
  // Ensure defaults are always objects
  const safeInitialPos = initialPos || { x: 0, y: 0 };
  const safeInitialSize = initialSize || {};
  const safeInitialStyle = initialStyle || { fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit' };

  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem(`pos-${id}`);
    return saved ? safeJsonParse(saved, safeInitialPos) : safeInitialPos;
  });
  
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem(`size-${id}`);
    return saved ? safeJsonParse(saved, safeInitialSize) : safeInitialSize;
  });

  const [style, setStyle] = useState(() => {
    const saved = localStorage.getItem(`style-${id}`);
    if (saved) {
        const parsed = safeJsonParse(saved, safeInitialStyle);
        // Merge with initial style to ensure all keys exist
        return { ...safeInitialStyle, ...parsed };
    }
    return safeInitialStyle;
  });

  const [text, setText] = useState(() => {
    const saved = localStorage.getItem(`text-${id}`);
    return (saved !== null && saved !== undefined) ? saved : initialText;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const elementRef = useRef(null);

  // Persistence
  useEffect(() => {
    if (!id) return;
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
    
    setIsSelected(true);
    
    // Only prevent default and start dragging if we're not clicking into an editable area
    if (e.target.getAttribute('contenteditable') !== 'true') {
      setIsDragging(true);
      const rect = elementRef.current.getBoundingClientRect();
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      e.preventDefault();
    }
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
      setPos(safeInitialPos);
      setSize(safeInitialSize);
      setStyle(safeInitialStyle);
      setText(initialText);
    };
    window.addEventListener('reset-layout', handleReset);
    return () => window.removeEventListener('reset-layout', handleReset);
  }, [id, safeInitialPos, safeInitialSize, safeInitialStyle, initialText]);

  // Toolbar Handlers
  const changeFontSize = (delta) => {
    const current = parseInt(style.fontSize) || 16;
    setStyle(prev => ({ ...prev, fontSize: `${current + delta}px` }));
  };

  const toggleFont = () => {
    const fonts = ["'Cinzel', serif", "'Outfit', sans-serif", "inherit"];
    const currentFont = style.fontFamily || "inherit";
    const idx = fonts.indexOf(currentFont);
    setStyle(prev => ({ ...prev, fontFamily: fonts[(idx + 1) % fonts.length] }));
  };

  const toggleColor = () => {
    const colors = ["var(--gold)", "#FFFFFF", "#FF4444", "#44AAFF", "#00FF00", "inherit"];
    const currentColor = style.color || "inherit";
    const idx = colors.indexOf(currentColor);
    setStyle(prev => ({ ...prev, color: colors[(idx + 1) % colors.length] }));
  };

  const displayPos = pos || { x: 0, y: 0 };

  return (
    <div
      ref={elementRef}
      onMouseDown={onMouseDown}
      className={`${className} ${isAdmin ? 'builder-mode' : ''} ${isSelected ? 'is-selected' : ''}`}
      style={{
        position: 'absolute',
        left: displayPos.x,
        top: displayPos.y,
        width: size?.width || 'auto',
        height: size?.height || 'auto',
        fontSize: style?.fontSize,
        fontFamily: style?.fontFamily,
        color: style?.color,
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
          <button onClick={(e) => { e.stopPropagation(); toggleColor(); }} title="Mudar Cor" style={{ background:'none', color:style.color === 'inherit' ? 'var(--gold)' : style.color, border:'none', cursor:'pointer', fontWeight:'700' }}>☀ COR</button>
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
            pointerEvents: isAdmin ? 'auto' : 'none',
            whiteSpace: 'pre-wrap'
          }}
        >
          {text}
        </div>
      ) : (
        children
      )}
      
      {isAdmin && (
        <>
          <div 
            className="resize-handle"
            onMouseDown={onResizeStart}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '14px', height: '14px', background: 'var(--gold)',
              cursor: 'nwse-resize', zIndex: 10, opacity: 0.8,
              borderRadius: '2px'
            }}
          />
          
          {/* SIZE INDICATOR */}
          {(isResizing || isDragging) && (
            <div style={{
              position: 'absolute',
              bottom: '-35px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0a0b12',
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              fontSize: '11px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: '800',
              zIndex: 5000,
              pointerEvents: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-main)'
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              </svg>
              <span>
                {Math.round(elementRef.current?.offsetWidth || 0)} 
                <span style={{ opacity: 0.4, margin: '0 4px' }}>×</span> 
                {Math.round(elementRef.current?.offsetHeight || 0)}
                <span style={{ fontSize: '9px', opacity: 0.6, marginLeft: '2px' }}>PX</span>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
