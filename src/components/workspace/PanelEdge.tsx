
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

  const getButtonPosition = (): React.CSSProperties => {
    switch (position) {
      case 'right':
        return {
          position: 'absolute',
          right: -8,
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'bottom':
        return {
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={getEdgeStyle()}
      className={`${
        isHovered ? 'bg-blue-500 bg-opacity-50' : 'hover:bg-blue-500 hover:bg-opacity-30'
      } transition-colors duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onSplit}
          className="h-6 w-6 p-0 bg-blue-500 hover:bg-blue-600 text-white"
          style={getButtonPosition()}
        >
          <Plus size={12} />
        </Button>
      )}
    </div>
  );
};
