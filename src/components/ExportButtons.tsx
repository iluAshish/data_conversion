import React from 'react';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ParsedData } from '../App';

interface ExportButtonsProps {
  data: ParsedData;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const exportToCSV = () => {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => 
        row.map(cell => {
          // Escape quotes and wrap in quotes if contains comma or quote
          const escaped = cell.replace(/"/g, '""');
          return cell.includes(',') || cell.includes('"') || cell.includes('\n') 
            ? `"${escaped}"` 
            : cell;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${getBaseName(data.filename)}.csv`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    // Generate buffer and create blob
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    downloadFile(blob, `${getBaseName(data.filename)}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Data Export', 20, 20);
    doc.setFontSize(10);
    doc.text(`Source: ${data.filename}`, 20, 30);
    
    // Create table
    autoTable(doc, {
      head: [data.headers],
      body: data.rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
      margin: { top: 40, right: 10, bottom: 10, left: 10 },
      tableWidth: 'auto',
      columnStyles: {},
    });
    
    doc.save(`${getBaseName(data.filename)}.pdf`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getBaseName = (filename: string): string => {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center px-6 py-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors group"
        >
          <File className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Export as CSV</div>
            <div className="text-sm opacity-90">Comma-separated values</div>
          </div>
          <Download className="w-4 h-4 ml-3 opacity-75" />
        </button>

        <button
          onClick={exportToExcel}
          className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors group"
        >
          <FileSpreadsheet className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Export as Excel</div>
            <div className="text-sm opacity-90">Microsoft Excel format</div>
          </div>
          <Download className="w-4 h-4 ml-3 opacity-75" />
        </button>

        <button
          onClick={exportToPDF}
          className="flex items-center justify-center px-6 py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors group"
        >
          <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Export as PDF</div>
            <div className="text-sm opacity-90">Portable document format</div>
          </div>
          <Download className="w-4 h-4 ml-3 opacity-75" />
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Exported files will contain the exact same data as shown in the preview table above. 
          No data formatting or conversion will be applied.
        </p>
      </div>
    </div>
  );
}