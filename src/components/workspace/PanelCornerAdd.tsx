
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';

interface PanelCornerAddProps {
  onAddPanel: (direction: 'left' | 'right' | 'top' | 'bottom') => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PanelCornerAdd: React.FC<PanelCornerAddProps> = ({ 
  onAddPanel, 
  position = 'top-right' 
}) => {
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showDirections) {
      timeout = setTimeout(() => {
        setShowDirections(false);
      }, 5000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [showDirections]);

  const handlePlusClick = () => {
    setShowDirections(true);
  };

  const handleDirectionClick = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    onAddPanel(direction);
    setShowDirections(false);
  };

  const handleMouseLeave = () => {
    setShowDirections(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-1 left-1';
      case 'bottom-right':
        return 'bottom-1 right-1';
      case 'bottom-left':
        return 'bottom-1 left-1';
      default:
        return 'top-1 right-1';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} z-20`}
      onMouseLeave={handleMouseLeave}
    >
      {!showDirections && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handlePlusClick}
          className="h-4 w-4 p-0 bg-blue-500 hover:bg-blue-600 text-white opacity-80 hover:opacity-100"
        >
          <Plus size={8} />
        </Button>
      )}

      {showDirections && (
        <div className="relative">
          {/* Center plus button */}
          <Button
            size="sm"
            variant="secondary"
            className="h-4 w-4 p-0 bg-blue-500 text-white"
          >
            <Plus size={8} />
          </Button>

          {/* Direction buttons */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('top')}
            className="absolute -top-5 left-0 h-3 w-4 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowUp size={6} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('right')}
            className="absolute top-0 -right-5 h-4 w-3 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowRight size={6} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('bottom')}
            className="absolute -bottom-5 left-0 h-3 w-4 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowDown size={6} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('left')}
            className="absolute top-0 -left-5 h-4 w-3 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowLeft size={6} />
          </Button>
        </div>
      )}
    </div>
  );
};
