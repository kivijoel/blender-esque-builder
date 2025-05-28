
import React from 'react';
import { PanelType } from '@/types/panel';

interface PanelContentProps {
  type: PanelType;
  fontSize: number;
}

export const PanelContent: React.FC<PanelContentProps> = ({ type, fontSize }) => {
  const getContent = () => {
    switch (type) {
      case 'viewport':
        return (
          <div className="p-4 text-gray-300">
            <h3 className="font-semibold mb-2">3D Viewport</h3>
            <div className="bg-gray-900 rounded p-4 mb-2 min-h-20">
              <div className="text-center text-gray-500">3D Scene Viewport</div>
            </div>
            <p className="text-sm">Use Ctrl+Scroll to change text size</p>
          </div>
        );
      case 'outliner':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Outliner</h3>
            <div className="space-y-1">
              <div className="flex items-center text-sm">▼ Scene Collection</div>
              <div className="flex items-center text-sm ml-4">📦 Cube</div>
              <div className="flex items-center text-sm ml-4">💡 Light</div>
              <div className="flex items-center text-sm ml-4">📷 Camera</div>
            </div>
          </div>
        );
      case 'properties':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Properties</h3>
            <div className="space-y-2">
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400">Object Properties</div>
                <div className="text-sm">Location: X: 0.0 Y: 0.0 Z: 0.0</div>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <div className="text-xs text-gray-400">Modifier Properties</div>
                <div className="text-sm">No modifiers</div>
              </div>
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Timeline</h3>
            <div className="bg-gray-900 rounded p-2 h-20">
              <div className="text-center text-gray-500">Timeline Controls</div>
            </div>
          </div>
        );
      case 'shader-editor':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Shader Editor</h3>
            <div className="bg-gray-900 rounded p-4 h-32">
              <div className="text-center text-gray-500">Node Editor</div>
            </div>
          </div>
        );
      case 'text-editor':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Text Editor</h3>
            <div className="bg-gray-900 rounded p-2 font-mono text-sm">
              <div className="text-green-400"># Python Script</div>
              <div>import bpy</div>
              <div>print("Hello Blender!")</div>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-gray-300">Unknown panel type</div>;
    }
  };

  return (
    <div className="h-full overflow-auto" style={{ fontSize: `${fontSize}px` }}>
      {getContent()}
    </div>
  );
};
