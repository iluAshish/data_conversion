import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { ExportButtons } from './components/ExportButtons';
import { Header } from './components/Header';

export interface ParsedData {
  headers: string[];
  rows: string[][];
  filename: string;
}

function App() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataParsed = (data: ParsedData) => {
    setParsedData(data);
    setIsLoading(false);
  };

  const handleReset = () => {
    setParsedData(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!parsedData ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Convert Your Data Files
              </h1>
              <p className="text-lg text-gray-600">
                Upload CSV, Excel, or PDF files and convert them to any format you need.
                Your data stays exactly as uploaded - no modifications or auto-conversions.
              </p>
            </div>
            
            <FileUpload 
              onDataParsed={handleDataParsed}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Data Preview</h2>
                <p className="text-gray-600">
                  {parsedData.rows.length} rows × {parsedData.headers.length} columns
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Upload New File
              </button>
            </div>
            
            <DataPreview data={parsedData} />
            
            <ExportButtons data={parsedData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;