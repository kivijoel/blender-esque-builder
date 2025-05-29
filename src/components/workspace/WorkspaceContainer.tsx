
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

  const handleResize = useCallback((id: string, direction: 'right' | 'bottom', delta: number) => {
    setPanels(prev => {
      return prev.map(panel => {
        if (panel.id === id) {
          if (direction === 'right') {
            const newWidth = Math.max(10, Math.min(90, panel.width + delta));
            
            // Find panels to the right that need to be adjusted
            prev.forEach(otherPanel => {
              if (otherPanel.id !== id && 
                  Math.abs(otherPanel.x - (panel.x + panel.width)) < 1 && // Adjacent on right
                  otherPanel.y < panel.y + panel.height && 
                  otherPanel.y + otherPanel.height > panel.y) {
                const widthChange = newWidth - panel.width;
                otherPanel.x = panel.x + newWidth;
                otherPanel.width = Math.max(10, otherPanel.width - widthChange);
              }
            });
            
            return { ...panel, width: newWidth };
          } else {
            const newHeight = Math.max(10, Math.min(90, panel.height + delta));
            
            // Find panels below that need to be adjusted
            prev.forEach(otherPanel => {
              if (otherPanel.id !== id && 
                  Math.abs(otherPanel.y - (panel.y + panel.height)) < 1 && // Adjacent below
                  otherPanel.x < panel.x + panel.width && 
                  otherPanel.x + otherPanel.width > panel.x) {
                const heightChange = newHeight - panel.height;
                otherPanel.y = panel.y + newHeight;
                otherPanel.height = Math.max(10, otherPanel.height - heightChange);
              }
            });
            
            return { ...panel, height: newHeight };
          }
        }
        return panel;
      });
    });
  }, []);

  const addPanel = useCallback((direction: 'left' | 'right' | 'top' | 'bottom', targetId: string) => {
    setPanels(prev => {
      const targetPanel = prev.find(p => p.id === targetId);
      if (!targetPanel) return prev;

      const newId = Date.now().toString();
      const newPanels = [...prev];
      
      if (direction === 'right') {
        // Split horizontally - target panel gets smaller, new panel added to the right
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
      } else if (direction === 'left') {
        // Split horizontally - new panel added to the left, target panel moves right
        const newWidth = targetPanel.width / 2;
        newPanels.forEach(panel => {
          if (panel.id === targetId) {
            panel.x = targetPanel.x + newWidth;
            panel.width = newWidth;
          }
        });
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y,
          width: newWidth,
          height: targetPanel.height
        });
      } else if (direction === 'bottom') {
        // Split vertically - target panel gets smaller, new panel added below
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
      } else if (direction === 'top') {
        // Split vertically - new panel added above, target panel moves down
        const newHeight = targetPanel.height / 2;
        newPanels.forEach(panel => {
          if (panel.id === targetId) {
            panel.y = targetPanel.y + newHeight;
            panel.height = newHeight;
          }
        });
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y,
          width: targetPanel.width,
          height: newHeight
        });
      }
      
      return newPanels;
    });
  }, []);

  const removePanel = useCallback((id: string) => {
    setPanels(prev => {
      const panelToRemove = prev.find(p => p.id === id);
      if (!panelToRemove || prev.length <= 1) return prev;

      const remainingPanels = prev.filter(panel => panel.id !== id);
      
      // Find adjacent panels and expand them to fill the space
      const adjustedPanels = remainingPanels.map(panel => {
        // Check if panel is adjacent to the removed panel
        const isRightAdjacent = panel.x === panelToRemove.x + panelToRemove.width;
        const isBottomAdjacent = panel.y === panelToRemove.y + panelToRemove.height;
        const isLeftAdjacent = panelToRemove.x === panel.x + panel.width;
        const isTopAdjacent = panelToRemove.y === panel.y + panel.height;

        let newPanel = { ...panel };

        // Expand horizontally if adjacent
        if (isRightAdjacent && panel.y === panelToRemove.y && panel.height === panelToRemove.height) {
          newPanel.x = panelToRemove.x;
          newPanel.width = panel.width + panelToRemove.width;
        } else if (isLeftAdjacent && panel.y === panelToRemove.y && panel.height === panelToRemove.height) {
          newPanel.width = panel.width + panelToRemove.width;
        }

        // Expand vertically if adjacent
        if (isBottomAdjacent && panel.x === panelToRemove.x && panel.width === panelToRemove.width) {
          newPanel.y = panelToRemove.y;
          newPanel.height = panel.height + panelToRemove.height;
        } else if (isTopAdjacent && panel.x === panelToRemove.x && panel.width === panelToRemove.width) {
          newPanel.height = panel.height + panelToRemove.height;
        }

        return newPanel;
      });

      return adjustedPanels;
    });
  }, []);

  return (
    <div className="w-full h-screen relative bg-gray-800 overflow-hidden">
      {panels.map(panel => (
        <Panel
          key={panel.id}
          data={panel}
          allPanels={panels}
          onUpdate={updatePanel}
          onAddPanel={addPanel}
          onRemovePanel={removePanel}
          onResize={handleResize}
        />
      ))}
    </div>
  );
};
