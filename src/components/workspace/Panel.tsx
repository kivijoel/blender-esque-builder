
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PanelData, PanelType } from '@/types/panel';
import { PanelHeader } from './PanelHeader';
import { PanelContent } from './PanelContent';
import { PanelEdge } from './PanelEdge';
import { ResizeHandle } from './ResizeHandle';
import { PanelCornerAdd } from './PanelCornerAdd';

interface PanelProps {
  data: PanelData;
  allPanels: PanelData[];
  onUpdate: (id: string, updates: Partial<PanelData>) => void;
  onAddPanel: (direction: 'left' | 'right' | 'top' | 'bottom', targetId: string) => void;
  onRemovePanel: (id: string) => void;
  onResize: (id: string, direction: 'right' | 'bottom', delta: number) => void;
}

export const Panel: React.FC<PanelProps> = ({ data, allPanels, onUpdate, onAddPanel, onRemovePanel, onResize }) => {
  const [fontSize, setFontSize] = useState(14);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      setFontSize(prev => Math.max(8, Math.min(32, prev + delta)));
    }
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('wheel', handleWheel, { passive: false });
      return () => panel.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleTypeChange = (newType: PanelType) => {
    onUpdate(data.id, { type: newType });
  };

  const handleResetTextSize = () => {
    setFontSize(14);
  };

  const handleCornerAdd = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    onAddPanel(direction, data.id);
  };

  // Check if a corner should show the + button (no overlapping panels)
  const shouldShowCorner = (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => {
    const tolerance = 0.1;
    
    for (const panel of allPanels) {
      if (panel.id === data.id) continue;
      
      let cornerX: number, cornerY: number;
      
      switch (position) {
        case 'top-right':
          cornerX = data.x + data.width;
          cornerY = data.y;
          break;
        case 'top-left':
          cornerX = data.x;
          cornerY = data.y;
          break;
        case 'bottom-right':
          cornerX = data.x + data.width;
          cornerY = data.y + data.height;
          break;
        case 'bottom-left':
          cornerX = data.x;
          cornerY = data.y + data.height;
          break;
      }
      
      // Check if this corner matches any corner of another panel
      const otherCorners = [
        { x: panel.x, y: panel.y }, // top-left
        { x: panel.x + panel.width, y: panel.y }, // top-right
        { x: panel.x, y: panel.y + panel.height }, // bottom-left
        { x: panel.x + panel.width, y: panel.y + panel.height }, // bottom-right
      ];
      
      for (const corner of otherCorners) {
        if (Math.abs(corner.x - cornerX) < tolerance && Math.abs(corner.y - cornerY) < tolerance) {
          // If this panel's ID is greater, don't show the button (let the other panel show it)
          return data.id < panel.id;
        }
      }
    }
    
    return true;
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${data.x}%`,
    top: `${data.y}%`,
    width: `${data.width}%`,
    height: `${data.height}%`,
    fontSize: `${fontSize}px`,
  };

  return (
    <div
      ref={panelRef}
      className={`border border-gray-600 bg-gray-850 ${isDragging ? 'opacity-80' : ''}`}
      style={style}
    >
      <PanelHeader 
        type={data.type} 
        onTypeChange={handleTypeChange}
        onRemove={() => onRemovePanel(data.id)}
        onResetTextSize={handleResetTextSize}
      />
      <PanelContent type={data.type} fontSize={fontSize} />
      
      {/* Corner add buttons - only show if no overlapping panels */}
      {shouldShowCorner('top-right') && (
        <PanelCornerAdd onAddPanel={handleCornerAdd} position="top-right" />
      )}
      {shouldShowCorner('top-left') && (
        <PanelCornerAdd onAddPanel={handleCornerAdd} position="top-left" />
      )}
      {shouldShowCorner('bottom-right') && (
        <PanelCornerAdd onAddPanel={handleCornerAdd} position="bottom-right" />
      )}
      {shouldShowCorner('bottom-left') && (
        <PanelCornerAdd onAddPanel={handleCornerAdd} position="bottom-left" />
      )}
      
      {/* Panel edges for splitting */}
      <PanelEdge 
        position="right" 
        onSplit={() => onAddPanel('right', data.id)} 
      />
      <PanelEdge 
        position="bottom" 
        onSplit={() => onAddPanel('bottom', data.id)} 
      />

      {/* Resize handles */}
      <ResizeHandle
        direction="right"
        onResize={(delta) => onResize(data.id, 'right', delta)}
      />
      <ResizeHandle
        direction="bottom"
        onResize={(delta) => onResize(data.id, 'bottom', delta)}
      />
    </div>
  );
};
