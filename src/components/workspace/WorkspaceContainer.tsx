
import React, { useState, useCallback } from 'react';
import { Panel } from './Panel';
import { PanelData, PanelType } from '@/types/panel';

export const WorkspaceContainer = () => {
  const [panels, setPanels] = useState<PanelData[]>([
    { id: '1', type: 'viewport', x: 0, y: 0, width: 50, height: 100 },
    { id: '2', type: 'outliner', x: 50, y: 0, width: 50, height: 50 },
    { id: '3', type: 'properties', x: 50, y: 50, width: 50, height: 50 },
  ]);

  // Helper function to find nearby edges and connect panels
  const connectToNearbyEdges = useCallback((panels: PanelData[]) => {
    const connectionThreshold = 5; // 5% threshold for nearby edges
    const connectedPanels = [...panels];

    for (let i = 0; i < connectedPanels.length; i++) {
      const panel = connectedPanels[i];
      
      for (let j = 0; j < connectedPanels.length; j++) {
        if (i === j) continue;
        const otherPanel = connectedPanels[j];

        // Check for nearby right-left edge connection
        const rightEdge = panel.x + panel.width;
        if (Math.abs(rightEdge - otherPanel.x) < connectionThreshold &&
            panel.y < otherPanel.y + otherPanel.height &&
            panel.y + panel.height > otherPanel.y) {
          // Connect the edges
          panel.width = otherPanel.x - panel.x;
        }

        // Check for nearby left-right edge connection
        const otherRightEdge = otherPanel.x + otherPanel.width;
        if (Math.abs(panel.x - otherRightEdge) < connectionThreshold &&
            panel.y < otherPanel.y + otherPanel.height &&
            panel.y + panel.height > otherPanel.y) {
          // Connect the edges
          const widthDiff = panel.x - otherRightEdge;
          panel.x = otherRightEdge;
          panel.width += widthDiff;
        }

        // Check for nearby bottom-top edge connection
        const bottomEdge = panel.y + panel.height;
        if (Math.abs(bottomEdge - otherPanel.y) < connectionThreshold &&
            panel.x < otherPanel.x + otherPanel.width &&
            panel.x + panel.width > otherPanel.x) {
          // Connect the edges
          panel.height = otherPanel.y - panel.y;
        }

        // Check for nearby top-bottom edge connection
        const otherBottomEdge = otherPanel.y + otherPanel.height;
        if (Math.abs(panel.y - otherBottomEdge) < connectionThreshold &&
            panel.x < otherPanel.x + otherPanel.width &&
            panel.x + panel.width > otherPanel.x) {
          // Connect the edges
          const heightDiff = panel.y - otherBottomEdge;
          panel.y = otherBottomEdge;
          panel.height += heightDiff;
        }
      }
    }

    return connectedPanels;
  }, []);

  const updatePanel = useCallback((id: string, updates: Partial<PanelData>) => {
    setPanels(prev => {
      const updated = prev.map(panel => 
        panel.id === id ? { ...panel, ...updates } : panel
      );
      return connectToNearbyEdges(updated);
    });
  }, [connectToNearbyEdges]);

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

        // Find and adjust all connected panels on the right
        for (const panel of newPanels) {
          if (panel.id === id) continue;
          
          // Check if panel is connected on the right with exact precision
          if (Math.abs(panel.x - oldRightEdge) < 0.01 &&
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

        // Find and adjust all connected panels below
        for (const panel of newPanels) {
          if (panel.id === id) continue;
          
          // Check if panel is connected below with exact precision
          if (Math.abs(panel.y - oldBottomEdge) < 0.01 &&
              panel.x < resizingPanel.x + resizingPanel.width &&
              panel.x + panel.width > resizingPanel.x) {
            const connectionDelta = newBottomEdge - oldBottomEdge;
            panel.y = newBottomEdge;
            panel.height = Math.max(5, panel.height - connectionDelta);
          }
        }
      }
      
      return connectToNearbyEdges(newPanels);
    });
  }, [connectToNearbyEdges]);

  const addPanel = useCallback((direction: 'left' | 'right' | 'top' | 'bottom', targetId: string) => {
    setPanels(prev => {
      const targetPanel = prev.find(p => p.id === targetId);
      if (!targetPanel) return prev;

      const newId = Date.now().toString();
      let newPanels = [...prev];
      
      // Create new panel based on direction
      let newPanel: PanelData;
      
      if (direction === 'right') {
        const newWidth = targetPanel.width / 2;
        // Update target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, width: newWidth }
            : panel
        );
        // Create new panel
        newPanel = {
          id: newId,
          type: 'viewport',
          x: targetPanel.x + newWidth,
          y: targetPanel.y,
          width: newWidth,
          height: targetPanel.height
        };
      } else if (direction === 'left') {
        const newWidth = targetPanel.width / 2;
        // Update target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, x: targetPanel.x + newWidth, width: newWidth }
            : panel
        );
        // Create new panel
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
        // Update target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, height: newHeight }
            : panel
        );
        // Create new panel
        newPanel = {
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y + newHeight,
          width: targetPanel.width,
          height: newHeight
        };
      } else { // top
        const newHeight = targetPanel.height / 2;
        // Update target panel
        newPanels = newPanels.map(panel => 
          panel.id === targetId 
            ? { ...panel, y: targetPanel.y + newHeight, height: newHeight }
            : panel
        );
        // Create new panel
        newPanel = {
          id: newId,
          type: 'viewport',
          x: targetPanel.x,
          y: targetPanel.y,
          width: targetPanel.width,
          height: newHeight
        };
      }
      
      // Add the new panel
      newPanels.push(newPanel);
      
      // Connect to nearby edges
      return connectToNearbyEdges(newPanels);
    });
  }, [connectToNearbyEdges]);

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

      return connectToNearbyEdges(adjustedPanels);
    });
  }, [connectToNearbyEdges]);

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
