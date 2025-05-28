
import React, { useState, useCallback } from 'react';
import { Panel } from './Panel';
import { PanelData, PanelType } from '@/types/panel';

export const WorkspaceContainer = () => {
  const [panels, setPanels] = useState<PanelData[]>([
    { id: '1', type: 'viewport', x: 0, y: 0, width: 50, height: 100 },
    { id: '2', type: 'outliner', x: 50, y: 0, width: 50, height: 50 },
    { id: '3', type: 'properties', x: 50, y: 50, width: 50, height: 50 },
  ]);

  const updatePanel = useCallback((id: string, updates: Partial<PanelData>) => {
    setPanels(prev => prev.map(panel => 
      panel.id === id ? { ...panel, ...updates } : panel
    ));
  }, []);

  const addPanel = useCallback((direction: 'left' | 'right' | 'top' | 'bottom', targetId: string) => {
    setPanels(prev => {
      const targetPanel = prev.find(p => p.id === targetId);
      if (!targetPanel) return prev;

      const newId = Date.now().toString();
      const newPanels = [...prev];
      
      if (direction === 'right') {
        // Split horizontally
        const newWidth = targetPanel.width / 2;
        newPanels.forEach(panel => {
          if (panel.id === targetId) {
            panel.width = newWidth;
          }
        });
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: targetPanel.x + newWidth,
          y: targetPanel.y,
          width: newWidth,
          height: targetPanel.height
        });
      } else if (direction === 'bottom') {
        // Split vertically
        const newHeight = targetPanel.height / 2;
        newPanels.forEach(panel => {
          if (panel.id === targetId) {
            panel.height = newHeight;
          }
        });
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y + newHeight,
          width: targetPanel.width,
          height: newHeight
        });
      }
      
      return newPanels;
    });
  }, []);

  const removePanel = useCallback((id: string) => {
    setPanels(prev => prev.filter(panel => panel.id !== id));
  }, []);

  return (
    <div className="w-full h-screen relative bg-gray-800 overflow-hidden">
      {panels.map(panel => (
        <Panel
          key={panel.id}
          data={panel}
          onUpdate={updatePanel}
          onAddPanel={addPanel}
          onRemovePanel={removePanel}
        />
      ))}
    </div>
  );
};
