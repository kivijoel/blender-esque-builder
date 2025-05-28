
export type PanelType = 
  | 'viewport' 
  | 'outliner' 
  | 'properties' 
  | 'timeline' 
  | 'shader-editor' 
  | 'text-editor';

export interface PanelData {
  id: string;
  type: PanelType;
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
}
