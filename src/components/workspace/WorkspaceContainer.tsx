import React, { useState, useCallback } from 'react';
import { Panel } from './Panel';
import { PresetTabs } from './PresetTabs';
import { PanelData, PanelType } from '@/types/panel';

export const WorkspaceContainer = () => {
  const [panels, setPanels] = useState<PanelData[]>([
    { id: '1', type: 'viewport', x: 0, y: 0, width: 50, height: 100 },
    { id: '2', type: 'outliner', x: 50, y: 0, width: 50, height: 50 },
    { id: '3', type: 'properties', x: 50, y: 50, width: 50, height: 50 },
  ]);

  const loadPreset = useCallback((presetPanels: PanelData[]) => {
    setPanels(presetPanels);
  }, []);

  // Improved edge connection system with better snapping
  const snapToNearbyEdges = useCallback((panels: PanelData[]) => {
    const tolerance = 0.1;
    const snappedPanels = panels.map(panel => ({ ...panel }));

    // Multiple passes to ensure all connections are made
    for (let pass = 0; pass < 5; pass++) {
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

        // Snap to canvas edges with priority for right edge
        if (Math.abs(panel.x) < tolerance) panel.x = 0;
        if (Math.abs(panel.y) < tolerance) panel.y = 0;
        if (Math.abs(panel.x + panel.width - 100) < tolerance) panel.width = 100 - panel.x;
        if (Math.abs(panel.y + panel.height - 100) < tolerance) panel.height = 100 - panel.y;
        
        // Force panels at right edge to stay at right edge
        if (panel.x + panel.width >= 99.9) {
          panel.width = 100 - panel.x;
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
      return snapToNearbyEdges(updated);
    });
  }, [snapToNearbyEdges]);

  const handleResize = useCallback((id: string, direction: 'right' | 'bottom', delta: number) => {
    setPanels(prev => {
      const newPanels = [...prev];
      
      // Find all panels that share the edge being moved
      const resizingPanel = newPanels.find(p => p.id === id);
      if (!resizingPanel) return prev;

      const tolerance = 0.1;
      
      if (direction === 'right') {
        const currentRightEdge = resizingPanel.x + resizingPanel.width;
        const newRightEdge = Math.max(resizingPanel.x + 5, Math.min(100, currentRightEdge + delta));
        const actualDelta = newRightEdge - currentRightEdge;
        
        // Find all panels that share this vertical edge
        const connectedPanels = newPanels.filter(panel => {
          if (panel.id === id) return false;
          
          // Check if panel shares the right edge (either starts at it or ends at it)
          const panelLeft = panel.x;
          const panelRight = panel.x + panel.width;
          const hasVerticalOverlap = panel.y < resizingPanel.y + resizingPanel.height && 
                                   panel.y + panel.height > resizingPanel.y;
          
          return hasVerticalOverlap && (
            Math.abs(panelLeft - currentRightEdge) < tolerance ||
            Math.abs(panelRight - currentRightEdge) < tolerance
          );
        });
        
        // Update the resizing panel
        resizingPanel.width = newRightEdge - resizingPanel.x;
        
        // Update all connected panels
        connectedPanels.forEach(panel => {
          if (Math.abs(panel.x - currentRightEdge) < tolerance) {
            // Panel starts at the edge - move it
            panel.x = newRightEdge;
            panel.width = Math.max(5, panel.width - actualDelta);
          } else if (Math.abs((panel.x + panel.width) - currentRightEdge) < tolerance) {
            // Panel ends at the edge - resize it
            panel.width = Math.max(5, panel.width + actualDelta);
          }
        });
        
      } else { // bottom direction
        const currentBottomEdge = resizingPanel.y + resizingPanel.height;
        const newBottomEdge = Math.max(resizingPanel.y + 5, Math.min(100, currentBottomEdge + delta));
        const actualDelta = newBottomEdge - currentBottomEdge;
        
        // Find all panels that share this horizontal edge
        const connectedPanels = newPanels.filter(panel => {
          if (panel.id === id) return false;
          
          // Check if panel shares the bottom edge (either starts at it or ends at it)
          const panelTop = panel.y;
          const panelBottom = panel.y + panel.height;
          const hasHorizontalOverlap = panel.x < resizingPanel.x + resizingPanel.width && 
                                     panel.x + panel.width > resizingPanel.x;
          
          return hasHorizontalOverlap && (
            Math.abs(panelTop - currentBottomEdge) < tolerance ||
            Math.abs(panelBottom - currentBottomEdge) < tolerance
          );
        });
        
        // Update the resizing panel
        resizingPanel.height = newBottomEdge - resizingPanel.y;
        
        // Update all connected panels
        connectedPanels.forEach(panel => {
          if (Math.abs(panel.y - currentBottomEdge) < tolerance) {
            // Panel starts at the edge - move it
            panel.y = newBottomEdge;
            panel.height = Math.max(5, panel.height - actualDelta);
          } else if (Math.abs((panel.y + panel.height) - currentBottomEdge) < tolerance) {
            // Panel ends at the edge - resize it
            panel.height = Math.max(5, panel.height + actualDelta);
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

  // Improved panel removal with better edge filling
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
      const tolerance = 0.1;
      
      // Create a working copy of remaining panels
      const adjustedPanels = remainingPanels.map(panel => ({ ...panel }));
      
      // Find all panels that can expand into the removed space
      for (let i = 0; i < adjustedPanels.length; i++) {
        const panel = adjustedPanels[i];
        
        // Check if this panel can expand horizontally
        const canExpandRight = Math.abs(panel.x + panel.width - panelToRemove.x) < tolerance &&
                              panel.y < panelToRemove.y + panelToRemove.height &&
                              panel.y + panel.height > panelToRemove.y;
                              
        const canExpandLeft = Math.abs(panel.x - (panelToRemove.x + panelToRemove.width)) < tolerance &&
                             panel.y < panelToRemove.y + panelToRemove.height &&
                             panel.y + panel.height > panelToRemove.y;
        
        // Check if this panel can expand vertically
        const canExpandDown = Math.abs(panel.y + panel.height - panelToRemove.y) < tolerance &&
                             panel.x < panelToRemove.x + panelToRemove.width &&
                             panel.x + panel.width > panelToRemove.x;
                             
        const canExpandUp = Math.abs(panel.y - (panelToRemove.y + panelToRemove.height)) < tolerance &&
                           panel.x < panelToRemove.x + panelToRemove.width &&
                           panel.x + panel.width > panelToRemove.x;

        // Priority: expand the panel that shares the most area with the removed panel
        const sharedWidth = Math.min(panel.x + panel.width, panelToRemove.x + panelToRemove.width) - 
                           Math.max(panel.x, panelToRemove.x);
        const sharedHeight = Math.min(panel.y + panel.height, panelToRemove.y + panelToRemove.height) - 
                            Math.max(panel.y, panelToRemove.y);
        const sharedArea = Math.max(0, sharedWidth) * Math.max(0, sharedHeight);

        if (sharedArea > 0) {
          // Expand horizontally if possible
          if (canExpandRight) {
            panel.width += panelToRemove.width;
          } else if (canExpandLeft) {
            panel.x = panelToRemove.x;
            panel.width += panelToRemove.width;
          }
          
          // Expand vertically if possible
          if (canExpandDown) {
            panel.height += panelToRemove.height;
          } else if (canExpandUp) {
            panel.y = panelToRemove.y;
            panel.height += panelToRemove.height;
          }
          
          // If we expanded this panel, we're done
          if (canExpandRight || canExpandLeft || canExpandDown || canExpandUp) {
            break;
          }
        }
      }

      return snapToNearbyEdges(adjustedPanels);
    });
  }, [snapToNearbyEdges]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-800 overflow-hidden">
      <PresetTabs currentPanels={panels} onLoadPreset={loadPreset} />
      <div className="flex-1 relative">
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
    </div>
  );
};
