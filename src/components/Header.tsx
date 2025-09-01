import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">MW Data Converter</h1>
            <p className="text-sm text-gray-600">by Mighty Warner</p>
          </div>
        </div>
      </div>
    </header>
  );
}