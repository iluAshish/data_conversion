import * as XLSX from 'xlsx';
import type { ParsedData } from '../App';

export async function parseFile(file: File): Promise<ParsedData> {
  const fileExtension = file.name.toLowerCase().split('.').pop();
  
  switch (fileExtension) {
    case 'csv':
      return await parseCSV(file);
    case 'xls':
    case 'xlsx':
      return await parseExcel(file);
    case 'pdf':
      return await parsePDF(file);
    default:
      throw new Error('Unsupported file format');
  }
}

async function parseCSV(file: File): Promise<ParsedData> {
  const text = await file.text();
  const lines = text.split(/\r?\n/);
  
  if (lines.length === 0) {
    return { headers: [], rows: [], filename: file.name };
  }
  
  // Parse CSV manually to preserve exact formatting
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };
  
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1)
    .filter(line => line.trim().length > 0)
    .map(line => {
      const parsed = parseCSVLine(line);
      // Ensure all rows have the same number of columns as headers
      while (parsed.length < headers.length) {
        parsed.push('');
      }
      return parsed.slice(0, headers.length);
    });
  
  return { headers, rows, filename: file.name };
}

async function parseExcel(file: File): Promise<ParsedData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { 
    type: 'array',
    raw: true, // Preserve raw values
    cellText: false, // Don't format cells
    cellDates: false // Don't convert dates
  });
  
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to array of arrays preserving exact formatting
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const headers: string[] = [];
  const rows: string[][] = [];
  
  // Get headers from first row
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    const cell = worksheet[cellAddress];
    headers.push(cell ? String(cell.v || '') : '');
  }
  
  // Get data rows
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const rowData: string[] = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      rowData.push(cell ? String(cell.v || '') : '');
    }
    if (rowData.some(cell => cell.trim().length > 0)) {
      rows.push(rowData);
    }
  }
  
  return { headers, rows, filename: file.name };
}

async function parsePDF(file: File): Promise<ParsedData> {
  // For PDF parsing, we'll use a simple text extraction approach
  // In a real implementation, you might want to use a more sophisticated PDF parser
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Simple PDF text extraction - this is a basic implementation
    // For better table extraction, you'd want to use a library like PDF.js
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // Basic text extraction from PDF
    const decoder = new TextDecoder('utf-8');
    const pdfText = decoder.decode(uint8Array);
    
    // Look for text patterns that might be readable
    const textMatches = pdfText.match(/[A-Za-z0-9\s\.,;:!?\-()]+/g);
    if (textMatches) {
      text = textMatches.join(' ');
    }
    
    if (!text.trim()) {
      // If no readable text found, show a message
      return {
        headers: ['Content'],
        rows: [['PDF content could not be extracted as text. The file may contain images or complex formatting.']],
        filename: file.name
      };
    }
    
    // Split into lines and create a single-column table
    const lines = text.split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const headers = ['Content'];
    const rows = lines.map(line => [line]);
    
    return { headers, rows, filename: file.name };
  } catch (error) {
    console.error('PDF parsing error:', error);
    return {
      headers: ['Content'],
      rows: [['Error parsing PDF file. Please try a different file.']],
      filename: file.name
    };
  }
}