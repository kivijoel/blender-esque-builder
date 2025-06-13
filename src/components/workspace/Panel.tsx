
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PanelData, PanelType } from '@/types/panel';
import { PanelHeader } from './PanelHeader';
import { PanelContent } from './PanelContent';
import { PanelEdge } from './PanelEdge';
import { ResizeHandle } from './ResizeHandle';

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

  const handleAddPanel = (direction: 'left' | 'right' | 'top' | 'bottom') => {
    onAddPanel(direction, data.id);
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
        onAddPanel={handleAddPanel}
      />
      <PanelContent type={data.type} fontSize={fontSize} />
      
      {/* Panel edges for splitting */}
      <PanelEdge 
        position="right" 
        onSplit={() => onAddPanel('right', data.id)} 
      />
      <PanelEdge 
        position="bottom" 
        onSplit={() => onAddPanel('bottom', data.id)} 
      />
      <PanelEdge 
        position="left" 
        onSplit={() => onAddPanel('left', data.id)} 
      />
      <PanelEdge 
        position="top" 
        onSplit={() => onAddPanel('top', data.id)} 
      />

      {/* Resize handles for all edges */}
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
