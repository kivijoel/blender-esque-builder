
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';

interface PanelCornerAddProps {
  onAddPanel: (direction: 'left' | 'right' | 'top' | 'bottom') => void;
}

export const PanelCornerAdd: React.FC<PanelCornerAddProps> = ({ onAddPanel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  const handlePlusClick = () => {
    setShowDirections(true);
  };

  const handleDirectionClick = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    onAddPanel(direction);
    setShowDirections(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowDirections(false);
  };

  return (
    <div
      className="absolute top-1 right-1 z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && !showDirections && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handlePlusClick}
          className="h-5 w-5 p-0 bg-blue-500 hover:bg-blue-600 text-white opacity-80 hover:opacity-100"
        >
          <Plus size={10} />
        </Button>
      )}

      {showDirections && (
        <div className="relative">
          {/* Center plus button */}
          <Button
            size="sm"
            variant="secondary"
            className="h-5 w-5 p-0 bg-blue-500 text-white"
          >
            <Plus size={10} />
          </Button>

          {/* Direction buttons */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('top')}
            className="absolute -top-6 left-0 h-4 w-5 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowUp size={8} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('right')}
            className="absolute top-0 -right-6 h-5 w-4 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowRight size={8} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('bottom')}
            className="absolute -bottom-6 left-0 h-4 w-5 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowDown size={8} />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleDirectionClick('left')}
            className="absolute top-0 -left-6 h-5 w-4 p-0 bg-green-500 hover:bg-green-600 text-white"
          >
            <ArrowLeft size={8} />
          </Button>
        </div>
      )}
    </div>
  );
};
