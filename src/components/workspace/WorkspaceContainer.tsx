import React, { useState, useCallback } from 'react';
import { Panel } from './Panel';
import { AddPanelMenu } from './AddPanelMenu';
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

  const addPanelFromMenu = useCallback((direction: 'left' | 'right' | 'top' | 'bottom') => {
    setPanels(prev => {
      const newId = Date.now().toString();
      const newPanels = [...prev];
      
      if (direction === 'right') {
        // Add new panel to the right of the entire workspace
        const rightmostX = Math.max(...prev.map(p => p.x + p.width));
        const availableWidth = 100 - rightmostX;
        const newWidth = Math.max(20, availableWidth);
        
        // Adjust existing panels if needed
        if (availableWidth < 20) {
          const shrinkRatio = 0.8;
          newPanels.forEach(panel => {
            panel.width *= shrinkRatio;
            panel.x *= shrinkRatio;
          });
        }
        
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: rightmostX * (availableWidth < 20 ? 0.8 : 1),
          y: 0,
          width: newWidth * (availableWidth < 20 ? 0.2 : 1),
          height: 100
        });
      } else if (direction === 'left') {
        // Add new panel to the left, shift others right
        const newWidth = 25;
        newPanels.forEach(panel => {
          panel.x += newWidth;
          panel.width = Math.max(10, panel.width - newWidth / prev.length);
        });
        
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: 0,
          y: 0,
          width: newWidth,
          height: 100
        });
      } else if (direction === 'bottom') {
        // Add new panel to the bottom
        const bottomY = Math.max(...prev.map(p => p.y + p.height));
        const availableHeight = 100 - bottomY;
        const newHeight = Math.max(20, availableHeight);
        
        // Adjust existing panels if needed
        if (availableHeight < 20) {
          const shrinkRatio = 0.8;
          newPanels.forEach(panel => {
            panel.height *= shrinkRatio;
            panel.y *= shrinkRatio;
          });
        }
        
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: 0,
          y: bottomY * (availableHeight < 20 ? 0.8 : 1),
          width: 100,
          height: newHeight * (availableHeight < 20 ? 0.2 : 1)
        });
      } else if (direction === 'top') {
        // Add new panel to the top, shift others down
        const newHeight = 25;
        newPanels.forEach(panel => {
          panel.y += newHeight;
          panel.height = Math.max(10, panel.height - newHeight / prev.length);
        });
        
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: 0,
          y: 0,
          width: 100,
          height: newHeight
        });
      }
      
      return newPanels;
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
      const tolerance = 0.1;
      
      // Find panels that should expand to fill the removed panel's space
      const adjustedPanels = remainingPanels.map(panel => {
        let newPanel = { ...panel };

        // Check if panel is directly adjacent to the removed panel
        const isRightAdjacent = Math.abs(panel.x - (panelToRemove.x + panelToRemove.width)) < tolerance &&
                               panel.y < panelToRemove.y + panelToRemove.height &&
                               panel.y + panel.height > panelToRemove.y;

        const isLeftAdjacent = Math.abs(panelToRemove.x - (panel.x + panel.width)) < tolerance &&
                              panel.y < panelToRemove.y + panelToRemove.height &&
                              panel.y + panel.height > panelToRemove.y;

        const isBottomAdjacent = Math.abs(panel.y - (panelToRemove.y + panelToRemove.height)) < tolerance &&
                                panel.x < panelToRemove.x + panelToRemove.width &&
                                panel.x + panel.width > panelToRemove.x;

        const isTopAdjacent = Math.abs(panelToRemove.y - (panel.y + panel.height)) < tolerance &&
                             panel.x < panelToRemove.x + panelToRemove.width &&
                             panel.x + panel.width > panelToRemove.x;

        // Expand panel to fill the removed panel's space
        if (isRightAdjacent) {
          // Panel is to the right of removed panel - expand left
          newPanel.x = panelToRemove.x;
          newPanel.width = panel.width + panelToRemove.width;
        } else if (isLeftAdjacent) {
          // Panel is to the left of removed panel - expand right
          newPanel.width = panel.width + panelToRemove.width;
        }

        if (isBottomAdjacent) {
          // Panel is below removed panel - expand up
          newPanel.y = panelToRemove.y;
          newPanel.height = panel.height + panelToRemove.height;
        } else if (isTopAdjacent) {
          // Panel is above removed panel - expand down
          newPanel.height = panel.height + panelToRemove.height;
        }

        return newPanel;
      });

      return adjustedPanels;
    });
  }, []);

  return (
    <div className="w-full h-screen relative bg-gray-800 overflow-hidden">
      <AddPanelMenu onAddPanel={addPanelFromMenu} />
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
