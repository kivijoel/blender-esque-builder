
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

  // Helper function to snap and maintain edge connections
  const snapAndMaintainEdges = useCallback((panels: PanelData[]) => {
    const snapThreshold = 0.5; // Very tight snapping
    const snappedPanels = [...panels];

    // Multiple passes to ensure all edges are connected
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < snappedPanels.length; i++) {
        const panel = snappedPanels[i];
        
        for (let j = 0; j < snappedPanels.length; j++) {
          if (i === j) continue;
          const otherPanel = snappedPanels[j];

          // Snap right edge to left edge (horizontal connection)
          const rightEdge = panel.x + panel.width;
          if (Math.abs(rightEdge - otherPanel.x) < snapThreshold &&
              panel.y < otherPanel.y + otherPanel.height &&
              panel.y + panel.height > otherPanel.y) {
            // Force perfect alignment
            panel.width = otherPanel.x - panel.x;
          }

          // Snap left edge to right edge (horizontal connection)
          const otherRightEdge = otherPanel.x + otherPanel.width;
          if (Math.abs(panel.x - otherRightEdge) < snapThreshold &&
              panel.y < otherPanel.y + otherPanel.height &&
              panel.y + panel.height > otherPanel.y) {
            // Force perfect alignment
            const widthDiff = panel.x - otherRightEdge;
            panel.x = otherRightEdge;
            panel.width += widthDiff;
          }

          // Snap bottom edge to top edge (vertical connection)
          const bottomEdge = panel.y + panel.height;
          if (Math.abs(bottomEdge - otherPanel.y) < snapThreshold &&
              panel.x < otherPanel.x + otherPanel.width &&
              panel.x + panel.width > otherPanel.x) {
            // Force perfect alignment
            panel.height = otherPanel.y - panel.y;
          }

          // Snap top edge to bottom edge (vertical connection)
          const otherBottomEdge = otherPanel.y + otherPanel.height;
          if (Math.abs(panel.y - otherBottomEdge) < snapThreshold &&
              panel.x < otherPanel.x + otherPanel.width &&
              panel.x + panel.width > otherPanel.x) {
            // Force perfect alignment
            const heightDiff = panel.y - otherBottomEdge;
            panel.y = otherBottomEdge;
            panel.height += heightDiff;
          }
        }
      }
    }

    return snappedPanels;
  }, []);

  const updatePanel = useCallback((id: string, updates: Partial<PanelData>) => {
    setPanels(prev => {
      const updated = prev.map(panel => 
        panel.id === id ? { ...panel, ...updates } : panel
      );
      return snapAndMaintainEdges(updated);
    });
  }, [snapAndMaintainEdges]);

  const handleResize = useCallback((id: string, direction: 'right' | 'bottom', delta: number) => {
    setPanels(prev => {
      const newPanels = [...prev];
      const resizingPanel = newPanels.find(p => p.id === id);
      
      if (!resizingPanel) return prev;

      if (direction === 'right') {
        const oldRightEdge = resizingPanel.x + resizingPanel.width;
        const newWidth = Math.max(5, Math.min(95, resizingPanel.width + delta));
        const newRightEdge = resizingPanel.x + newWidth;
        
        resizingPanel.width = newWidth;

        // Find and adjust connected panels on the right
        for (const panel of newPanels) {
          if (panel.id === id) continue;
          
          // If panel is directly connected on the right, maintain the connection
          if (Math.abs(panel.x - oldRightEdge) < 1 &&
              panel.y < resizingPanel.y + resizingPanel.height &&
              panel.y + panel.height > resizingPanel.y) {
            const connectionDelta = newRightEdge - oldRightEdge;
            panel.x = newRightEdge;
            panel.width = Math.max(5, panel.width - connectionDelta);
          }
        }
      } else { // bottom direction
        const oldBottomEdge = resizingPanel.y + resizingPanel.height;
        const newHeight = Math.max(5, Math.min(95, resizingPanel.height + delta));
        const newBottomEdge = resizingPanel.y + newHeight;
        
        resizingPanel.height = newHeight;

        // Find and adjust connected panels below
        for (const panel of newPanels) {
          if (panel.id === id) continue;
          
          // If panel is directly connected below, maintain the connection
          if (Math.abs(panel.y - oldBottomEdge) < 1 &&
              panel.x < resizingPanel.x + resizingPanel.width &&
              panel.x + panel.width > resizingPanel.x) {
            const connectionDelta = newBottomEdge - oldBottomEdge;
            panel.y = newBottomEdge;
            panel.height = Math.max(5, panel.height - connectionDelta);
          }
        }
      }
      
      return snapAndMaintainEdges(newPanels);
    });
  }, [snapAndMaintainEdges]);

  const addPanelFromMenu = useCallback((direction: 'left' | 'right' | 'top' | 'bottom') => {
    setPanels(prev => {
      const newId = Date.now().toString();
      const newPanels = [...prev];
      const newPanelSize = 25; // 25% for new panels
      
      if (direction === 'right') {
        // Shrink all existing panels proportionally
        const shrinkRatio = (100 - newPanelSize) / 100;
        newPanels.forEach(panel => {
          panel.width *= shrinkRatio;
          panel.x *= shrinkRatio;
        });
        
        // Add new panel on the right edge
        const rightmostX = Math.max(...newPanels.map(p => p.x + p.width));
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: rightmostX,
          y: 0,
          width: newPanelSize,
          height: 100
        });
      } else if (direction === 'left') {
        // Shrink and shift all existing panels
        const shrinkRatio = (100 - newPanelSize) / 100;
        newPanels.forEach(panel => {
          panel.width *= shrinkRatio;
          panel.x = panel.x * shrinkRatio + newPanelSize;
        });
        
        // Add new panel on the left
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: 0,
          y: 0,
          width: newPanelSize,
          height: 100
        });
      } else if (direction === 'bottom') {
        // Shrink all existing panels proportionally
        const shrinkRatio = (100 - newPanelSize) / 100;
        newPanels.forEach(panel => {
          panel.height *= shrinkRatio;
          panel.y *= shrinkRatio;
        });
        
        // Add new panel at the bottom
        const bottomY = Math.max(...newPanels.map(p => p.y + p.height));
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: 0,
          y: bottomY,
          width: 100,
          height: newPanelSize
        });
      } else if (direction === 'top') {
        // Shrink and shift all existing panels
        const shrinkRatio = (100 - newPanelSize) / 100;
        newPanels.forEach(panel => {
          panel.height *= shrinkRatio;
          panel.y = panel.y * shrinkRatio + newPanelSize;
        });
        
        // Add new panel at the top
        newPanels.push({
          id: newId,
          type: 'viewport',
          x: 0,
          y: 0,
          width: 100,
          height: newPanelSize
        });
      }
      
      return snapAndMaintainEdges(newPanels);
    });
  }, [snapAndMaintainEdges]);

  const addPanel = useCallback((direction: 'left' | 'right' | 'top' | 'bottom', targetId: string) => {
    setPanels(prev => {
      const targetPanel = prev.find(p => p.id === targetId);
      if (!targetPanel) return prev;

      const newId = Date.now().toString();
      const newPanels = [...prev];
      
      if (direction === 'right') {
        // Split target panel horizontally
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
        // Split target panel horizontally
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
        // Split target panel vertically
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
        // Split target panel vertically
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
      
      return snapAndMaintainEdges(newPanels);
    });
  }, [snapAndMaintainEdges]);

  const removePanel = useCallback((id: string) => {
    setPanels(prev => {
      const panelToRemove = prev.find(p => p.id === id);
      if (!panelToRemove || prev.length <= 1) return prev;

      const remainingPanels = prev.filter(panel => panel.id !== id);
      
      // Find panels that should expand to fill the removed panel's space
      const adjustedPanels = remainingPanels.map(panel => {
        let newPanel = { ...panel };

        // Check adjacency with tight tolerance for perfect connections
        const tolerance = 0.1;
        
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

        // Expand to fill space and maintain perfect connections
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

        return newPanel;
      });

      return snapAndMaintainEdges(adjustedPanels);
    });
  }, [snapAndMaintainEdges]);

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
