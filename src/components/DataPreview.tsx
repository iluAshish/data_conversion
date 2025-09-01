import React, { useState, useMemo } from 'react';
import type { ParsedData } from '../App';

interface DataPreviewProps {
  data: ParsedData;
}

export function DataPreview({ data }: DataPreviewProps) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const rowHeight = 40;
  const visibleRows = Math.min(10, data.rows.length);
  const containerHeight = visibleRows * rowHeight + 50; // +50 for header
  
  const displayData = useMemo(() => {
    return data.rows.slice(0, 200); // Show first 200 rows
  }, [data.rows]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">File: {data.filename}</h3>
        {data.rows.length > 200 && (
          <p className="text-sm text-amber-600 mt-1">
            Showing first 200 rows of {data.rows.length} total rows
          </p>
        )}
      </div>
      
      <div 
        className="overflow-auto" 
        style={{ height: `${containerHeight}px` }}
        onScroll={handleScroll}
      >
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {data.headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50"
                >
                  {header || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors"
                style={{ height: `${rowHeight}px` }}
              >
                {data.headers.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                    title={row[colIndex] || ''}
                  >
                    {row[colIndex] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}