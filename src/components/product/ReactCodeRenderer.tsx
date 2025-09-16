import React, { useMemo, useState } from 'react';
import * as Babel from '@babel/standalone';

interface ReactCodeRendererProps {
  code: string;
  product?: any;
}

const ReactCodeRenderer: React.FC<ReactCodeRendererProps> = ({ code, product }) => {
  const [error, setError] = useState<string | null>(null);

  const RenderedComponent = useMemo(() => {
    try {
      setError(null);
      
      // Clean the code - extract from HTML if needed
      let cleanCode = code;
      if (code.includes('<div>') && code.includes('</div>')) {
        cleanCode = code
          .replace(/<div><font[^>]*>/g, '')
          .replace(/<\/font><\/div>/g, '\n')
          .replace(/<div>/g, '\n')
          .replace(/<\/div>/g, '')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/&nbsp;/g, ' ')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&amp;/g, '&')
          .trim();
      }

      // Check if it's React code
      if (!cleanCode.includes('React') && !cleanCode.includes('const ') && !cleanCode.includes('function ')) {
        return () => <div dangerouslySetInnerHTML={{ __html: code }} />;
      }

      // Prepare the execution environment with all possible dependencies
      const executionScope = {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useMemo: React.useMemo,
        useCallback: React.useCallback,
        useRef: React.useRef,
        // Provide product data
        productData: product || {
          colorGallery: [
            { image: '/lovable-uploads/61b6385b-b745-4933-b0cf-dbce75f6dccf.png', alt: 'iPhone XR White', color: 'White' },
            { image: '/lovable-uploads/7dc3e26d-cd0c-4dbb-ad3e-aceac1facb2f.png', alt: 'iPhone XR Black', color: 'Black' },
            { image: '/lovable-uploads/a40a1a4c-cb01-4ab2-969d-d34f1259d616.png', alt: 'iPhone XR Blue', color: 'Blue' },
            { image: '/lovable-uploads/d4b1c2ca-7039-49ea-8927-0a0756c99848.png', alt: 'iPhone XR Yellow', color: 'Yellow' },
            { image: '/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png', alt: 'iPhone XR Coral', color: 'Coral' },
            { image: '/lovable-uploads/fffe6b21-f10b-4d89-91d3-16414d20c200.png', alt: 'iPhone XR Red', color: '(PRODUCT)RED' }
          ],
          portraitGallery: [
            { image: '/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png', alt: 'iPhone XR Portrait 1' },
            { image: '/lovable-uploads/3f102eef-e5f0-4b4b-8c43-6289a6f59178.png', alt: 'iPhone XR Portrait 2' }
          ]
        }
      };

      // Transform imports to destructuring from scope
      let transformedCode = cleanCode
        .replace(/import\s+React(?:\s*,\s*\{([^}]+)\})?\s+from\s+['"]react['"];?/g, (match, hooks) => {
          if (hooks) {
            const hooksList = hooks.split(',').map(h => h.trim());
            return `const { ${hooksList.join(', ')} } = React;`;
          }
          return '';
        })
        .replace(/import\s+\{([^}]+)\}\s+from\s+['"]react['"];?/g, (match, hooks) => {
          const hooksList = hooks.split(',').map(h => h.trim());
          return `const { ${hooksList.join(', ')} } = React;`;
        })
        .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, ''); // Remove other imports

      // Use Babel to transform JSX to regular JavaScript
      try {
        const transformed = Babel.transform(transformedCode, {
          presets: ['react'],
          plugins: []
        });
        transformedCode = transformed.code || transformedCode;
      } catch (babelError) {
        console.warn('Babel transformation failed, using original code:', babelError);
      }

      // If it's a component definition, extract and return it
      let componentMatch = transformedCode.match(/const\s+(\w+)\s*=\s*\(\s*\)\s*=>/);
      if (!componentMatch) {
        componentMatch = transformedCode.match(/function\s+(\w+)\s*\(/);
      }

      let finalCode = transformedCode;
      if (componentMatch) {
        const componentName = componentMatch[1];
        finalCode = `${transformedCode}\nreturn ${componentName};`;
      } else if (!transformedCode.includes('return ')) {
        // If no explicit component and no return, wrap in a component
        finalCode = `
          const DynamicComponent = () => {
            ${transformedCode}
          };
          return DynamicComponent;
        `;
      }

      // Create the component function with the scope
      const scopeKeys = Object.keys(executionScope);
      const scopeValues = Object.values(executionScope);
      
      const ComponentFunction = new Function(...scopeKeys, finalCode);
      const Component = ComponentFunction(...scopeValues);

      return Component || (() => <div>Component could not be rendered</div>);
      
    } catch (err) {
      console.error('Error executing React code:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Fallback to HTML rendering
      return () => <div dangerouslySetInnerHTML={{ __html: code }} />;
    }
  }, [code, product]);

  if (error) {
    return (
      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
        <p className="text-red-600 text-sm mb-2">⚠️ Component Error: {error}</p>
        <details className="text-xs text-red-500">
          <summary className="cursor-pointer">Show raw code</summary>
          <pre className="mt-2 overflow-auto bg-white p-2 rounded border">
            <code>{code}</code>
          </pre>
        </details>
      </div>
    );
  }

  try {
    return <RenderedComponent />;
  } catch (renderError) {
    return (
      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
        <p className="text-yellow-600 text-sm">⚠️ Render Error: Component could not be displayed</p>
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    );
  }
};

export default ReactCodeRenderer;