import React, { useState } from 'react';

interface PanelEdgeProps {
  position: 'left' | 'right' | 'top' | 'bottom';
  onSplit: () => void;
}

export const PanelEdge: React.FC<PanelEdgeProps> = ({ position, onSplit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getEdgeStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: 10,
    };

    switch (position) {
      case 'right':
        return {
          ...baseStyle,
          right: -2,
          top: 0,
          bottom: 0,
          width: 4,
          cursor: 'ew-resize',
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: -2,
          left: 0,
          right: 0,
          height: 4,
          cursor: 'ns-resize',
        };
      case 'left':
        return {
          ...baseStyle,
          left: -2,
          top: 0,
          bottom: 0,
          width: 4,
          cursor: 'ew-resize',
        };
      case 'top':
        return {
          ...baseStyle,
          top: -2,
          left: 0,
          right: 0,
          height: 4,
          cursor: 'ns-resize',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      style={getEdgeStyle()}
      className="hover:bg-blue-500 hover:bg-opacity-30 transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Removed the + button on hover */}
    </div>
  );
};
