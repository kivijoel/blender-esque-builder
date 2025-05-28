
import React from 'react';
import { PanelType } from '@/types/panel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { X, Menu, Settings, Maximize2, Minimize2, Copy, RotateCcw } from 'lucide-react';

interface PanelHeaderProps {
  type: PanelType;
  onTypeChange: (type: PanelType) => void;
  onRemove: () => void;
  onResetTextSize: () => void;
}

const panelTypes: { value: PanelType; label: string }[] = [
  { value: 'viewport', label: '3D Viewport' },
  { value: 'outliner', label: 'Outliner' },
  { value: 'properties', label: 'Properties' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'shader-editor', label: 'Shader Editor' },
  { value: 'text-editor', label: 'Text Editor' },
];

export const PanelHeader: React.FC<PanelHeaderProps> = ({ type, onTypeChange, onRemove, onResetTextSize }) => {
  return (
    <div className="h-8 bg-gray-700 border-b border-gray-600 flex items-center justify-between px-2">
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200 hover:bg-gray-600"
            >
              <Menu size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-gray-700 border-gray-600 text-gray-200"
            align="start"
          >
            <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
              <Settings className="mr-2 h-3 w-3" />
              Panel Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-gray-600 focus:bg-gray-600"
              onClick={onResetTextSize}
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              Reset Text Size
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
              <Maximize2 className="mr-2 h-3 w-3" />
              Maximize Panel
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
              <Minimize2 className="mr-2 h-3 w-3" />
              Minimize Panel
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
              <Copy className="mr-2 h-3 w-3" />
              Duplicate Panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
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
      </div>
      
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
