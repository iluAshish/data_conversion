import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet, FileText } from 'lucide-react';
import { parseFile } from '../utils/fileParser';
import type { ParsedData } from '../App';

interface FileUploadProps {
  onDataParsed: (data: ParsedData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function FileUpload({ onDataParsed, isLoading, setIsLoading }: FileUploadProps) {
  const handleFileSelect = useCallback(async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf'
    ];

    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isValidExtension = ['csv', 'xls', 'xlsx', 'pdf'].includes(fileExtension || '');

    if (!allowedTypes.includes(file.type) && !isValidExtension) {
      alert('Please upload a CSV, Excel (.xls/.xlsx), or PDF file');
      return;
    }

    setIsLoading(true);
    
    try {
      const parsedData = await parseFile(file);
      onDataParsed(parsedData);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the file format and try again.');
      setIsLoading(false);
    }
  }, [onDataParsed, setIsLoading]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors bg-white"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600">Processing your file...</p>
          </div>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upload Your Data File
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your file here, or click to browse
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.xls,.xlsx,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose File
            </label>
            
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                CSV, Excel
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </div>
              <span>Max 50MB</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}