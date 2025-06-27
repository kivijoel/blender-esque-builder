
import React, { useState } from 'react';
import { PanelType } from '@/types/panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PanelContentProps {
  type: PanelType;
  fontSize: number;
}

export const PanelContent: React.FC<PanelContentProps> = ({ type, fontSize }) => {
  const [htmlUrl, setHtmlUrl] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleParseHtml = async () => {
    if (!htmlUrl) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, you would use a CORS proxy or backend service
      // For now, we'll simulate parsing
      setTimeout(() => {
        setParsedData({
          title: 'Sample Page Title',
          headings: ['Main Heading', 'Sub Heading 1', 'Sub Heading 2'],
          links: ['https://example.com/link1', 'https://example.com/link2'],
          images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
          text: 'Sample parsed text content from the webpage...'
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      setIsLoading(false);
    }
  };

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
      case 'html-parser':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">HTML Parser</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter website URL to parse..."
                  value={htmlUrl}
                  onChange={(e) => setHtmlUrl(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
                <Button
                  onClick={handleParseHtml}
                  disabled={isLoading || !htmlUrl}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Parsing...' : 'Parse'}
                </Button>
              </div>
              <div className="bg-gray-900 rounded p-2 text-sm">
                <div className="text-gray-400">Drop HTML link above to parse website content</div>
                <div className="text-gray-500 mt-1">Extracts: titles, headings, links, images, text</div>
              </div>
            </div>
          </div>
        );
      case 'parsed-data':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Parsed Data</h3>
            {parsedData ? (
              <div className="space-y-2 text-sm">
                <div className="bg-gray-700 p-2 rounded">
                  <div className="font-semibold text-blue-400">Title:</div>
                  <div>{parsedData.title}</div>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <div className="font-semibold text-green-400">Headings:</div>
                  {parsedData.headings?.map((heading: string, i: number) => (
                    <div key={i} className="ml-2">• {heading}</div>
                  ))}
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <div className="font-semibold text-yellow-400">Links:</div>
                  {parsedData.links?.map((link: string, i: number) => (
                    <div key={i} className="ml-2 text-blue-300">• {link}</div>
                  ))}
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <div className="font-semibold text-purple-400">Text Content:</div>
                  <div className="text-gray-300 text-xs">{parsedData.text}</div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded p-4 text-center text-gray-500">
                No parsed data available. Use HTML Parser to extract data from a website.
              </div>
            )}
          </div>
        );
      case 'console':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Console</h3>
            <div className="bg-gray-900 rounded p-2 font-mono text-sm h-32 overflow-y-auto">
              <div className="text-green-400">$ Ready</div>
              <div className="text-gray-400">Console output will appear here...</div>
            </div>
          </div>
        );
      case 'file-browser':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">File Browser</h3>
            <div className="space-y-1 text-sm">
              <div>📁 Project</div>
              <div className="ml-4">📄 scene.blend</div>
              <div className="ml-4">📄 materials.blend</div>
              <div className="ml-4">📁 Textures</div>
            </div>
          </div>
        );
      case 'inspector':
        return (
          <div className="p-2 text-gray-300">
            <h3 className="font-semibold mb-2">Inspector</h3>
            <div className="bg-gray-700 p-2 rounded text-sm">
              <div className="text-gray-400">Selected Object:</div>
              <div>Cube.001</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-gray-300">
            <h3 className="font-semibold mb-2">{type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}</h3>
            <div className="bg-gray-900 rounded p-4 text-center text-gray-500">
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} content
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-auto" style={{ fontSize: `${fontSize}px` }}>
      {getContent()}
    </div>
  );
};
