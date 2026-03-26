import { useState, useEffect, useRef } from 'react';

export default function DraggableItem({ id, children, initialPos = { x: 0, y: 0 }, className = "" }) {
  const [pos, setPos] = useState(() => {
    const saved = localStorage.getItem(`pos-${id}`);
    return saved ? JSON.parse(saved) : initialPos;
  });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const elementRef = useRef(null);

  const onMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    const rect = elementRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const parentRect = elementRef.current.parentElement.getBoundingClientRect();
      const newX = e.clientX - parentRect.left - offset.current.x;
      const newY = e.clientY - parentRect.top - offset.current.y;
      
      setPos({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem(`pos-${id}`, JSON.stringify(pos));
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, pos, id]);

  // Handle Reset Layout
  useEffect(() => {
    const handleReset = () => {
      localStorage.removeItem(`pos-${id}`);
      setPos(initialPos);
    };
    window.addEventListener('reset-layout', handleReset);
    return () => window.removeEventListener('reset-layout', handleReset);
  }, [id, initialPos]);

  return (
    <div
      ref={elementRef}
      onMouseDown={onMouseDown}
      className={`${className} ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 1000 : 10,
        userSelect: 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
      }}
    >
      {children}
    </div>
  );
}
