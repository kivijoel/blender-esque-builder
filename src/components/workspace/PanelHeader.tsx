
import React from 'react';
import { PanelType } from '@/types/panel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { X, Menu, Settings, Maximize2, Minimize2, Copy, RotateCcw, Plus, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface PanelHeaderProps {
  type: PanelType;
  onTypeChange: (type: PanelType) => void;
  onRemove: () => void;
  onResetTextSize: () => void;
  onAddPanel: (direction: 'left' | 'right' | 'top' | 'bottom') => void;
}

const panelTypes: { value: PanelType; label: string }[] = [
  { value: 'viewport', label: '3D Viewport' },
  { value: 'outliner', label: 'Outliner' },
  { value: 'properties', label: 'Properties' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'shader-editor', label: 'Shader Editor' },
  { value: 'text-editor', label: 'Text Editor' },
  { value: 'html-parser', label: 'HTML Parser' },
  { value: 'parsed-data', label: 'Parsed Data' },
  { value: 'console', label: 'Console' },
  { value: 'file-browser', label: 'File Browser' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'animation', label: 'Animation' },
  { value: 'materials', label: 'Materials' },
  { value: 'geometry', label: 'Geometry' },
  { value: 'modifiers', label: 'Modifiers' },
  { value: 'constraints', label: 'Constraints' },
  { value: 'physics', label: 'Physics' },
  { value: 'scripting', label: 'Scripting' },
  { value: 'compositor', label: 'Compositor' },
  { value: 'video-editor', label: 'Video Editor' },
  { value: 'image-editor', label: 'Image Editor' },
  { value: 'uv-editor', label: 'UV Editor' },
  { value: 'graph-editor', label: 'Graph Editor' },
  { value: 'dope-sheet', label: 'Dope Sheet' },
  { value: 'nla-editor', label: 'NLA Editor' },
  { value: 'clip-editor', label: 'Clip Editor' },
  { value: 'spreadsheet', label: 'Spreadsheet' },
];

export const PanelHeader: React.FC<PanelHeaderProps> = ({ type, onTypeChange, onRemove, onResetTextSize, onAddPanel }) => {
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="hover:bg-gray-600 focus:bg-gray-600">
                <Plus className="mr-2 h-3 w-3" />
                Add Panel
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-gray-700 border-gray-600">
                <DropdownMenuItem 
                  className="hover:bg-gray-600 focus:bg-gray-600 text-gray-200"
                  onClick={() => onAddPanel('left')}
                >
                  <ArrowLeft className="mr-2 h-3 w-3" />
                  Add Left
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-gray-600 focus:bg-gray-600 text-gray-200"
                  onClick={() => onAddPanel('right')}
                >
                  <ArrowRight className="mr-2 h-3 w-3" />
                  Add Right
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-gray-600 focus:bg-gray-600 text-gray-200"
                  onClick={() => onAddPanel('top')}
                >
                  <ArrowUp className="mr-2 h-3 w-3" />
                  Add Top
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-gray-600 focus:bg-gray-600 text-gray-200"
                  onClick={() => onAddPanel('bottom')}
                >
                  <ArrowDown className="mr-2 h-3 w-3" />
                  Add Bottom
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
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
          <SelectContent className="bg-gray-700 border-gray-600 max-h-60 overflow-y-auto">
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
