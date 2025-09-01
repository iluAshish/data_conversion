# MW Data Converter

A free, client-side data conversion tool by Mighty Warner that allows you to upload CSV, Excel, or PDF files and convert them to different formats while preserving your data exactly as uploaded.

## Features

- **File Upload**: Support for CSV, Excel (.xls/.xlsx), and PDF files (up to 50MB)
- **Data Preservation**: No auto-conversion of dates, numbers, or removal of leading zeros
- **Preview**: View your data in a clean table format (first 200 rows)
- **Export Options**: Download as CSV, Excel (.xlsx), or PDF
- **Client-Side Processing**: Your data never leaves your browser
- **No Registration Required**: Completely free to use

## Quick Start

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the provided local URL (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Use

1. **Upload**: Drag and drop a file or click "Choose File" to upload your CSV, Excel, or PDF file
2. **Preview**: Review your data in the preview table to ensure it's parsed correctly
3. **Export**: Click any of the export buttons to download your data in the desired format

## Sample Files

The `samples` directory contains example files you can use to test the converter:

- `sample-data.csv` - Product inventory data
- `employee-data.csv` - Employee information
- `financial-report.csv` - Financial data with preserved formatting

## Supported File Types

### CSV Files
- Preserves exact text formatting
- Handles quoted fields with commas
- Maintains leading zeros and text-formatted numbers

### Excel Files (.xls/.xlsx)
- Reads all cell values as text to preserve formatting
- Maintains original data types and formatting
- Supports both legacy (.xls) and modern (.xlsx) formats

### PDF Files
- Extracts text content line by line
- Each line becomes a row in a single-column table
- Note: Complex PDF layouts may not extract perfectly

## Data Privacy

- All processing happens in your browser (client-side)
- No data is sent to external servers
- No analytics or tracking
- Your files and data remain completely private

## Technical Details

- Built with React, TypeScript, and Vite
- Uses SheetJS (xlsx) for Excel file parsing
- Uses jsPDF for PDF generation
- Styled with Tailwind CSS
- Icons from Lucide React

## Browser Compatibility

- Modern browsers with ES2020 support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

## License

This is a free tool provided by Mighty Warner. No license restrictions for personal or commercial use.

---

**MW Data Converter** - Convert your data files while preserving every detail.