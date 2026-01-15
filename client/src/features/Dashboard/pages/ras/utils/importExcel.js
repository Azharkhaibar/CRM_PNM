import * as XLSX from 'xlsx';

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // convert ke JSON
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawRows.length < 3) {
          reject("Format file tidak valid atau kosong.");
          return;
        }

        let headerRowIndex = rawRows.findIndex(row => 
          row && row.some(cell => typeof cell === 'string' && (cell.includes('Risiko') || cell.includes('No')))
        );

        if (headerRowIndex === -1) headerRowIndex = 0;

        const headers = rawRows[headerRowIndex];

        const colIdx = {};
        headers.forEach((h, idx) => {
          if (!h) return;
          const cleanHeader = h.toString().trim().replace(/\r\n|\n/g, ' '); 
          
          if (cleanHeader.includes('risiko') && !cleanHeader.includes('sikap') && !cleanHeader.includes('sumber')) 
            colIdx.riskCategory = idx;
          else if (cleanHeader === 'No') colIdx.no = idx;
          else if (cleanHeader.includes('Parameter') || cleanHeader.includes('indikator')) 
            colIdx.parameter = idx;
          else if (cleanHeader.includes('RKAP')) colIdx.rkapTarget = idx;
          else if (cleanHeader.includes('Tipe Data')) colIdx.dataTypeExplanation = idx;
          else if (cleanHeader.includes('Limit')) colIdx.rasLimit = idx;
          else if (cleanHeader.includes('Sikap')) colIdx.riskStance = idx;
          else if (cleanHeader.includes('Statement')) colIdx.statement = idx;
          else if (cleanHeader.includes('Keterangan')) colIdx.notes = idx;
          else if (cleanHeader.includes('Realisasi') || ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].some(m => cleanHeader.includes(m))) colIdx.actualValue = idx;
        });

        const parsedData = [];
        let currentParent = null; 

        for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
          const row = rawRows[i];
          if (!row || row.length === 0) continue;

          const rawParam = row[colIdx.parameter];

          const isChild = !row[colIdx.no] && rawParam && (
            String(rawParam).includes('(Pembilang)') || 
            String(rawParam).includes('(Penyebut)') ||
            String(rawParam).includes('Jumlah') 
          );

          if (!isChild) {
            const newItem = {
              id: Date.now() + i, 
              riskCategory: row[colIdx.riskCategory] || (currentParent ? currentParent.riskCategory : ''), 
              no: row[colIdx.no],
              parameter: row[colIdx.parameter],
              rkapTarget: row[colIdx.rkapTarget],
              dataTypeExplanation: row[colIdx.dataTypeExplanation],
              rasLimit: row[colIdx.rasLimit],
              riskStance: row[colIdx.riskStance],
              statement: row[colIdx.statement],
              notes: row[colIdx.notes],
              manualQuarterValue: row[colIdx.actualValue],
              unitType: 'PERCENTAGE', 
              hasNumeratorDenominator: false, 
              numeratorLabel: '', numeratorValue: '', denominatorLabel: '', denominatorValue: ''
            };

            // Auto-detect unit type based on format
            const valStr = String(newItem.manualQuarterValue || '');
            const limitStr = String(newItem.rasLimit || '');
            if (valStr.includes('%') || limitStr.includes('%')) newItem.unitType = 'PERCENTAGE';
            else if (valStr.toLowerCase().includes('rp') || limitStr.toLowerCase().includes('rp')) newItem.unitType = 'RUPIAH';
            else if (String(newItem.rkapTarget).toLowerCase().includes('x')) newItem.unitType = 'X';

            if (!newItem.riskCategory && currentParent) newItem.riskCategory = currentParent.riskCategory;
            if (newItem.parameter) {
                currentParent = newItem;
                parsedData.push(newItem);
            }
          } else {
            if (currentParent) {
              currentParent.hasNumeratorDenominator = true;
              const label = String(rawParam).replace(/\(Pembilang\)|\(Penyebut\)/gi, '').trim();
              const val = row[colIdx.actualValue];
              if (String(rawParam).toLowerCase().includes('pembilang') || !currentParent.numeratorLabel) {
                currentParent.numeratorLabel = label;
                currentParent.numeratorValue = val;
              } else {
                currentParent.denominatorLabel = label;
                currentParent.denominatorValue = val;
              }
            }
          }
        }
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};