
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface AddPanelMenuProps {
  onAddPanel: (direction: 'left' | 'right' | 'top' | 'bottom') => void;
}

export const AddPanelMenu: React.FC<AddPanelMenuProps> = ({ onAddPanel }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
        >
          <Plus size={16} className="mr-2" />
          Add Panel
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-gray-700 border-gray-600 text-gray-200"
        align="end"
      >
        <DropdownMenuItem 
          className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
          onClick={() => onAddPanel('left')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Add Left
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
          onClick={() => onAddPanel('right')}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Add Right
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
          onClick={() => onAddPanel('top')}
        >
          <ArrowUp className="mr-2 h-4 w-4" />
          Add Top
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer"
          onClick={() => onAddPanel('bottom')}
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          Add Bottom
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
