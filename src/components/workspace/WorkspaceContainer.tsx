
import React, { useState, useCallback } from 'react';
import { Panel } from './Panel';
import { PanelData, PanelType } from '@/types/panel';

export const WorkspaceContainer = () => {
  const [panels, setPanels] = useState<PanelData[]>([
    { id: '1', type: 'viewport', x: 0, y: 0, width: 50, height: 100 },
    { id: '2', type: 'outliner', x: 50, y: 0, width: 50, height: 50 },
    { id: '3', type: 'properties', x: 50, y: 50, width: 50, height: 50 },
  ]);

  // Improved edge connection system
  const snapToNearbyEdges = useCallback((panels: PanelData[]) => {
    const tolerance = 0.1;
    const snappedPanels = panels.map(panel => ({ ...panel }));

    // Multiple passes to ensure all connections are made
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < snappedPanels.length; i++) {
        const panel = snappedPanels[i];
        
        for (let j = 0; j < snappedPanels.length; j++) {
          if (i === j) continue;
          const otherPanel = snappedPanels[j];

          // Snap vertical edges (left-right connections)
          const panelRight = panel.x + panel.width;
          const otherRight = otherPanel.x + otherPanel.width;

          // Check if panels overlap vertically
          const verticalOverlap = panel.y < otherPanel.y + otherPanel.height && 
                                 panel.y + panel.height > otherPanel.y;

          if (verticalOverlap) {
            // Snap right edge to left edge
            if (Math.abs(panelRight - otherPanel.x) < tolerance) {
              panel.width = otherPanel.x - panel.x;
            }
            // Snap left edge to right edge
            if (Math.abs(panel.x - otherRight) < tolerance) {
              const widthDiff = panel.x - otherRight;
              panel.x = otherRight;
              panel.width += widthDiff;
            }
            // Snap left edges together
            if (Math.abs(panel.x - otherPanel.x) < tolerance) {
              panel.x = otherPanel.x;
            }
            // Snap right edges together
            if (Math.abs(panelRight - otherRight) < tolerance) {
              panel.width = otherRight - panel.x;
            }
          }

          // Snap horizontal edges (top-bottom connections)
          const panelBottom = panel.y + panel.height;
          const otherBottom = otherPanel.y + otherPanel.height;

          // Check if panels overlap horizontally
          const horizontalOverlap = panel.x < otherPanel.x + otherPanel.width && 
                                   panel.x + panel.width > otherPanel.x;

          if (horizontalOverlap) {
            // Snap bottom edge to top edge
            if (Math.abs(panelBottom - otherPanel.y) < tolerance) {
              panel.height = otherPanel.y - panel.y;
            }
            // Snap top edge to bottom edge
            if (Math.abs(panel.y - otherBottom) < tolerance) {
              const heightDiff = panel.y - otherBottom;
              panel.y = otherBottom;
              panel.height += heightDiff;
            }
            // Snap top edges together
            if (Math.abs(panel.y - otherPanel.y) < tolerance) {
              panel.y = otherPanel.y;
            }
            // Snap bottom edges together
            if (Math.abs(panelBottom - otherBottom) < tolerance) {
              panel.height = otherBottom - panel.y;
            }
          }
        }

        // Snap to canvas edges
        if (Math.abs(panel.x) < tolerance) panel.x = 0;
        if (Math.abs(panel.y) < tolerance) panel.y = 0;
        if (Math.abs(panel.x + panel.width - 100) < tolerance) panel.width = 100 - panel.x;
        if (Math.abs(panel.y + panel.height - 100) < tolerance) panel.height = 100 - panel.y;
      }
    }

    return snappedPanels;
  }, []);

  const updatePanel = useCallback((id: string, updates: Partial<PanelData>) => {
    setPanels(prev => {
      const updated = prev.map(panel => 
        panel.id === id ? { ...panel, ...updates } : panel
      );
      return snapToNearbyEdges(updated);
    });
  }, [snapToNearbyEdges]);

  const handleResize = useCallback((id: string, direction: 'right' | 'bottom', delta: number) => {
    setPanels(prev => {
      const newPanels = [...prev];
      const resizingPanel = newPanels.find(p => p.id === id);
      
      if (!resizingPanel) return prev;

      if (direction === 'right') {
        const oldRightEdge = resizingPanel.x + resizingPanel.width;
        const newWidth = Math.max(5, Math.min(95, resizingPanel.width + delta));
        const newRightEdge = resizingPanel.x + newWidth;
        const connectionDelta = newRightEdge - oldRightEdge;
        
        resizingPanel.width = newWidth;

        // Find and move all panels that share this vertical edge
        newPanels.forEach(panel => {
          if (panel.id === id) return;
          
          // Panels that start at the old right edge
          if (Math.abs(panel.x - oldRightEdge) < 0.1) {
            panel.x = newRightEdge;
            panel.width = Math.max(5, panel.width - connectionDelta);
          }
          // Panels that end at the old right edge
          else if (Math.abs((panel.x + panel.width) - oldRightEdge) < 0.1) {
            panel.width = Math.max(5, panel.width + connectionDelta);
          }
        });

      } else { // bottom direction
        const oldBottomEdge = resizingPanel.y + resizingPanel.height;
        const newHeight = Math.max(5, Math.min(95, resizingPanel.height + delta));
        const newBottomEdge = resizingPanel.y + newHeight;
        const connectionDelta = newBottomEdge - oldBottomEdge;
        
        resizingPanel.height = newHeight;

        // Find and move all panels that share this horizontal edge
        newPanels.forEach(panel => {
          if (panel.id === id) return;
          
          // Panels that start at the old bottom edge
          if (Math.abs(panel.y - oldBottomEdge) < 0.1) {
            panel.y = newBottomEdge;
            panel.height = Math.max(5, panel.height - connectionDelta);
          }
          // Panels that end at the old bottom edge
          else if (Math.abs((panel.y + panel.height) - oldBottomEdge) < 0.1) {
            panel.height = Math.max(5, panel.height + connectionDelta);
          }
        });
      }
      
      return snapToNearbyEdges(newPanels);
    });
  }, [snapToNearbyEdges]);

  const addPanel = useCallback((direction: 'left' | 'right' | 'top' | 'bottom', targetId: string) => {
    setPanels(prev => {
      const targetPanel = prev.find(p => p.id === targetId);
      if (!targetPanel) return prev;

      const newId = Date.now().toString();
      let newPanels = [...prev];
      
      let newPanel: PanelData;
      
      if (direction === 'right') {
        const newWidth = targetPanel.width / 2;
        const newX = targetPanel.x + newWidth;
        
        // Update target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, width: newWidth }
            : panel
        );
        
        // Move panels that were to the right
        newPanels = newPanels.map(panel => {
          if (panel.id === targetId) return panel;
          if (Math.abs(panel.x - (targetPanel.x + targetPanel.width)) < 0.1) {
            return { ...panel, x: newX + newWidth, width: Math.max(5, panel.width - newWidth) };
          }
          return panel;
        });
        
        newPanel = {
          id: newId,
          type: 'viewport',
          x: newX,
          y: targetPanel.y,
          width: newWidth,
          height: targetPanel.height
        };
      } else if (direction === 'left') {
        const newWidth = targetPanel.width / 2;
        
        // Move target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, x: targetPanel.x + newWidth, width: newWidth }
            : panel
        );
        
        newPanel = {
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y,
          width: newWidth,
          height: targetPanel.height
        };
      } else if (direction === 'bottom') {
        const newHeight = targetPanel.height / 2;
        const newY = targetPanel.y + newHeight;
        
        // Update target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, height: newHeight }
            : panel
        );
        
        // Move panels that were below
        newPanels = newPanels.map(panel => {
          if (panel.id === targetId) return panel;
          if (Math.abs(panel.y - (targetPanel.y + targetPanel.height)) < 0.1) {
            return { ...panel, y: newY + newHeight, height: Math.max(5, panel.height - newHeight) };
          }
          return panel;
        });
        
        newPanel = {
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: newY,
          width: targetPanel.width,
          height: newHeight
        };
      } else { // top
        const newHeight = targetPanel.height / 2;
        
        // Move target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, y: targetPanel.y + newHeight, height: newHeight }
            : panel
        );
        
        newPanel = {
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y,
          width: targetPanel.width,
          height: newHeight
        };
      }
      
      newPanels.push(newPanel);
      return snapToNearbyEdges(newPanels);
    });
  }, [snapToNearbyEdges]);

  const removePanel = useCallback((id: string) => {
    setPanels(prev => {
      const panelToRemove = prev.find(p => p.id === id);
      if (!panelToRemove) return prev;

      // If this is the last panel, create a new empty panel
      if (prev.length <= 1) {
        return [{
          id: Date.now().toString(),
          type: 'viewport',
          x: 0,
          y: 0,
          width: 100,
          height: 100
        }];
      }

      const remainingPanels = prev.filter(panel => panel.id !== id);
      
      // Find the best panel to expand into the removed space
      const adjustedPanels = remainingPanels.map(panel => {
        let newPanel = { ...panel };
        const tolerance = 0.1;
        
        // Check for exact edge adjacency
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

        // Expand into the removed panel's space
        if (isRightAdjacent) {
          newPanel.x = panelToRemove.x;
          newPanel.width = panel.width + panelToRemove.width;
        } else if (isLeftAdjacent) {
          newPanel.width = panel.width + panelToRemove.width;
        }

        if (isBottomAdjacent) {
          newPanel.y = panelToRemove.y;
          newPanel.height = panel.height + panelToRemove.height;
        } else if (isTopAdjacent) {
          newPanel.height = panel.height + panelToRemove.height;
        }

        // Handle canvas edge cases
        if (panelToRemove.x === 0 && isRightAdjacent) {
          newPanel.x = 0;
        }
        if (panelToRemove.y === 0 && isBottomAdjacent) {
          newPanel.y = 0;
        }
        if (Math.abs(panelToRemove.x + panelToRemove.width - 100) < tolerance && isLeftAdjacent) {
          newPanel.width = 100 - panel.x;
        }
        if (Math.abs(panelToRemove.y + panelToRemove.height - 100) < tolerance && isTopAdjacent) {
          newPanel.height = 100 - panel.y;
        }

        return newPanel;
      });

      return snapToNearbyEdges(adjustedPanels);
    });
  }, [snapToNearbyEdges]);

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
