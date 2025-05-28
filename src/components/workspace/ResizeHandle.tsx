
import React, { useState, useCallback, useRef } from 'react';

interface ResizeHandleProps {
  direction: 'right' | 'bottom';
  onResize: (delta: number) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ direction, onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };

    const handleMouseMove = (e: MouseEvent) => {
      const delta = direction === 'right' 
        ? e.clientX - startPosRef.current.x 
        : e.clientY - startPosRef.current.y;
      
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const deltaPercentage = direction === 'right' 
        ? (delta / containerWidth) * 100
        : (delta / containerHeight) * 100;
      
      onResize(deltaPercentage);
      startPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [direction, onResize]);

  const getHandleStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: 20,
      backgroundColor: isResizing ? '#3b82f6' : 'transparent',
    };

    if (direction === 'right') {
      return {
        ...baseStyle,
        right: -2,
        top: 0,
        bottom: 0,
        width: 4,
        cursor: 'ew-resize',
      };
    } else {
      return {
        ...baseStyle,
        bottom: -2,
        left: 0,
        right: 0,
        height: 4,
        cursor: 'ns-resize',
      };
    }
  };

  return (
    <div
      style={getHandleStyle()}
      onMouseDown={handleMouseDown}
      className="hover:bg-blue-500 hover:bg-opacity-50 transition-colors duration-200"
    />
  );
};
