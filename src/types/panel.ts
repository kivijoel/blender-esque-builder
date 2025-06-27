
export type PanelType = 
  | 'viewport' 
  | 'outliner' 
  | 'properties' 
  | 'timeline' 
  | 'shader-editor' 
  | 'text-editor'
  | 'html-parser'
  | 'parsed-data'
  | 'console'
  | 'file-browser'
  | 'inspector'
  | 'animation'
  | 'materials'
  | 'geometry'
  | 'modifiers'
  | 'constraints'
  | 'physics'
  | 'scripting'
  | 'compositor'
  | 'video-editor'
  | 'image-editor'
  | 'uv-editor'
  | 'graph-editor'
  | 'dope-sheet'
  | 'nla-editor'
  | 'clip-editor'
  | 'spreadsheet';

export interface PanelData {
  id: string;
  type: PanelType;
  x: number;
  y: number;
  width: number;
  height: number;
}
