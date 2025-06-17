
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, X, Edit2 } from 'lucide-react';
import { PanelData } from '@/types/panel';

interface Preset {
  id: string;
  name: string;
  panels: PanelData[];
}

interface PresetTabsProps {
  currentPanels: PanelData[];
  onLoadPreset: (panels: PanelData[]) => void;
}

const defaultPresets: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    panels: [
      { id: '1', type: 'viewport', x: 0, y: 0, width: 50, height: 100 },
      { id: '2', type: 'outliner', x: 50, y: 0, width: 50, height: 50 },
      { id: '3', type: 'properties', x: 50, y: 50, width: 50, height: 50 },
    ]
  },
  {
    id: 'single',
    name: 'Single View',
    panels: [
      { id: '1', type: 'viewport', x: 0, y: 0, width: 100, height: 100 }
    ]
  },
  {
    id: 'vertical',
    name: 'Vertical Split',
    panels: [
      { id: '1', type: 'viewport', x: 0, y: 0, width: 50, height: 100 },
      { id: '2', type: 'outliner', x: 50, y: 0, width: 50, height: 100 }
    ]
  }
];

export const PresetTabs: React.FC<PresetTabsProps> = ({ currentPanels, onLoadPreset }) => {
  const [presets, setPresets] = useState<Preset[]>(defaultPresets);
  const [activePreset, setActivePreset] = useState('default');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const saveCurrentPreset = () => {
    setPresets(prev => prev.map(preset => 
      preset.id === activePreset 
        ? { ...preset, panels: [...currentPanels] }
        : preset
    ));
  };

  const handleAddPreset = () => {
    // Save current state before adding new preset
    saveCurrentPreset();
    
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: 'New Preset',
      panels: [...currentPanels] // Use current panels as starting point
    };
    setPresets([...presets, newPreset]);
    setActivePreset(newPreset.id);
    // No need to call onLoadPreset since we're using current panels
  };

  const handleRemovePreset = (presetId: string) => {
    if (presets.length <= 1) return; // Keep at least one preset
    
    const newPresets = presets.filter(p => p.id !== presetId);
    setPresets(newPresets);
    
    if (activePreset === presetId) {
      const newActive = newPresets[0].id;
      setActivePreset(newActive);
      onLoadPreset(newPresets[0].panels);
    }
  };

  const handleEditName = (presetId: string, currentName: string) => {
    setEditingId(presetId);
    setEditingName(currentName);
  };

  const handleSaveName = () => {
    if (editingId && editingName.trim()) {
      setPresets(presets.map(p => 
        p.id === editingId ? { ...p, name: editingName.trim() } : p
      ));
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handlePresetChange = (presetId: string) => {
    // Save current preset state before switching
    saveCurrentPreset();
    
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setActivePreset(presetId);
      onLoadPreset(preset.panels);
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-600 p-2">
      <Tabs value={activePreset} onValueChange={handlePresetChange}>
        <div className="flex items-center gap-2">
          <TabsList className="bg-gray-700">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center group">
                <TabsTrigger 
                  value={preset.id}
                  className="data-[state=active]:bg-gray-600 data-[state=active]:text-white"
                >
                  {editingId === preset.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveName}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="bg-transparent border-none outline-none text-white w-20"
                      autoFocus
                    />
                  ) : (
                    <span>{preset.name}</span>
                  )}
                </TabsTrigger>
                
                {presets.length > 1 && editingId !== preset.id && (
                  <div className="opacity-0 group-hover:opacity-100 flex ml-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditName(preset.id, preset.name);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePreset(preset.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </TabsList>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-600 text-gray-400 hover:text-white"
            onClick={handleAddPreset}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {presets.map((preset) => (
          <TabsContent key={preset.id} value={preset.id} className="hidden">
            {/* Content is handled by the parent component */}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
