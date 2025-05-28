
import React from 'react';
import { PanelType } from '@/types/panel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PanelHeaderProps {
  type: PanelType;
  onTypeChange: (type: PanelType) => void;
  onRemove: () => void;
}

const panelTypes: { value: PanelType; label: string }[] = [
  { value: 'viewport', label: '3D Viewport' },
  { value: 'outliner', label: 'Outliner' },
  { value: 'properties', label: 'Properties' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'shader-editor', label: 'Shader Editor' },
  { value: 'text-editor', label: 'Text Editor' },
];

export const PanelHeader: React.FC<PanelHeaderProps> = ({ type, onTypeChange, onRemove }) => {
  return (
    <div className="h-8 bg-gray-700 border-b border-gray-600 flex items-center justify-between px-2">
      <Select value={type} onValueChange={(value: PanelType) => onTypeChange(value)}>
        <SelectTrigger className="h-6 text-xs bg-gray-600 border-gray-500 text-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          {panelTypes.map(({ value, label }) => (
            <SelectItem 
              key={value} 
              value={value}
              className="text-gray-200 hover:bg-gray-600 focus:bg-gray-600"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200 hover:bg-gray-600"
      >
        <X size={12} />
      </Button>
    </div>
  );
};
