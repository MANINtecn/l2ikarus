import { useState, useEffect, useRef } from 'react';

export default function DraggableItem({ id, children, initialPos = { x: 0, y: 0 }, initialSize = {}, isAdmin = false, className = "" }) {
  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem(`pos-${id}`);
    return saved ? JSON.parse(saved) : initialPos;
  });
  
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem(`size-${id}`);
    return saved ? JSON.parse(saved) : initialSize;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });
  const elementRef = useRef(null);

  // Drag logic
  const onMouseDown = (e) => {
    if (!isAdmin || e.button !== 0 || e.target.classList.contains('resize-handle')) return;
    setIsDragging(true);
    const rect = elementRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.preventDefault();
  };

  // Resize logic
  const onResizeStart = (e) => {
    if (!isAdmin) return;
    setIsResizing(true);
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
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem(`pos-${id}`, JSON.stringify(pos));
      }
      if (isResizing) {
        setIsResizing(false);
        localStorage.setItem(`size-${id}`, JSON.stringify(size));
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing, pos, size, id]);

  // Reset Layout
  useEffect(() => {
    const handleReset = () => {
      localStorage.removeItem(`pos-${id}`);
      localStorage.removeItem(`size-${id}`);
      setPos(initialPos);
      setSize(initialSize);
    };
    window.addEventListener('reset-layout', handleReset);
    return () => window.removeEventListener('reset-layout', handleReset);
  }, [id, initialPos, initialSize]);

  return (
    <div
      ref={elementRef}
      onMouseDown={onMouseDown}
      className={`${className} ${isDragging ? 'dragging' : ''} ${isAdmin ? 'builder-mode' : ''}`}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size.width || 'auto',
        height: size.height || 'auto',
        cursor: isAdmin ? (isDragging ? 'grabbing' : 'grab') : 'default',
        zIndex: isDragging || isResizing ? 2000 : (isAdmin ? 100 : 10),
        userSelect: isAdmin ? 'none' : 'auto',
        border: (isAdmin && (isDragging || isResizing)) ? '1px dashed var(--gold)' : 'none',
      }}
    >
      {children}
      
      {isAdmin && (
        <div 
          className="resize-handle"
          onMouseDown={onResizeStart}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '12px',
            height: '12px',
            background: 'var(--gold)',
            cursor: 'nwse-resize',
            zIndex: 10,
            opacity: 0.7
          }}
        />
      )}
    </div>
  );
}
