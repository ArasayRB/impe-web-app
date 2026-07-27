import * as XLSX from 'xlsx';

export async function importFile(
  file: File
): Promise<Record<string, any>[]> {

  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: 'array'
  });

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet);
}