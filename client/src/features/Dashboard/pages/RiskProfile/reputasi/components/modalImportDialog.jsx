import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Upload, AlertCircle, CheckCircle, FileText, Database, ChevronRight, ChevronDown, Search, Edit, Save, Eye, EyeOff } from 'lucide-react';
import * as XLSX from 'xlsx';

const ImportModalExcel = ({ isOpen, onClose, onImportComplete, viewYear, viewQuarter, sections = [], createSection, createIndikator, showNotification }) => {
  // ========== STATE ==========
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importSummary, setImportSummary] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [parsingLogs, setParsingLogs] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [stagingData, setStagingData] = useState([]); // NEW: Staging data
  const [editMode, setEditMode] = useState(false); // NEW: Edit mode for staging
  const [config, setConfig] = useState({
    searchHeaderPatterns: true,
    flexibleMapping: true,
    autoDetectStructure: true,
    showStagingView: false, // NEW: Toggle staging view
  });

  const fileInputRef = useRef(null);

  // helper to build stable section key
  const makeSecKey = useCallback((s, idx) => `${s.no ?? 'sec'}-${s.rowNumber ?? 'r'}-${idx}`, []);

  // ========== DEBUG LOG ==========
  const addLog = useCallback((message, type = 'info') => {
    const log = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message,
      type,
    };
    console.log(`[${type.toUpperCase()}] ${message}`);
    setParsingLogs((prev) => [...prev.slice(-200), log]);
  }, []);

  // ========== RESET ==========
  useEffect(() => {
    if (!isOpen) {
      setImportFile(null);
      setImportLoading(false);
      setImportProgress(0);
      setImportSummary(null);
      setImportedData([]);
      setValidationErrors([]);
      setParsingLogs([]);
      setExpandedSections({});
      setStagingData([]); // NEW: Reset staging
      setEditMode(false); // NEW: Reset edit mode
      setConfig({
        searchHeaderPatterns: true,
        flexibleMapping: true,
        autoDetectStructure: true,
        showStagingView: false,
      });
    }
  }, [isOpen]);

  // ========== PARSING UTILS ==========
  const parseValue = useCallback((value) => {
    if (value == null || value === '') return null;

    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return null;

      if (trimmed.includes('%')) {
        const num = parseFloat(
          trimmed
            .replace('%', '')
            .replace(',', '.')
            .replace(/[^\d.-]/g, '')
        );
        return isNaN(num) ? null : num;
      }

      if (trimmed.includes(',') && trimmed.match(/\d,\d/)) {
        const num = parseFloat(trimmed.replace(/\./g, '').replace(',', '.'));
        return isNaN(num) ? null : num;
      }

      if (trimmed.match(/\d[.,]\d{3}/)) {
        const num = parseFloat(trimmed.replace(/\./g, '').replace(',', '.'));
        return isNaN(num) ? null : num;
      }

      const num = parseFloat(trimmed.replace(/[^\d.-]/g, ''));
      if (!isNaN(num)) return num;

      return trimmed;
    }

    return value;
  }, []);

  // ========== UTIL: Expand merged cells into jsonData ==========
  const expandMergedCells = useCallback((worksheet, jsonData) => {
    const merges = worksheet['!merges'] || [];
    merges.forEach((m) => {
      const startR = m.s.r;
      const startC = m.s.c;
      const endR = m.e.r;
      const endC = m.e.c;
      const startAddr = XLSX.utils.encode_cell({ r: startR, c: startC });
      const startCell = worksheet[startAddr];
      const startVal = startCell ? startCell.v ?? '' : '';
      for (let r = startR; r <= endR; r++) {
        if (!jsonData[r]) jsonData[r] = [];
        for (let c = startC; c <= endC; c++) {
          if (jsonData[r][c] == null || jsonData[r][c] === '') {
            jsonData[r][c] = startVal;
          }
        }
      }
    });
    return jsonData;
  }, []);

  // ========== UTIL: Build combined header for multi-row header ==========
  const buildCombinedHeader = useCallback((jsonData, headerRowIndex) => {
    const r1 = jsonData[headerRowIndex] || [];
    const r2 = jsonData[headerRowIndex + 1] || [];
    const max = Math.max(r1.length, r2.length);
    const combined = [];
    for (let c = 0; c < max; c++) {
      const a = (r1[c] || '').toString().trim();
      const b = (r2[c] || '').toString().trim();
      combined[c] = a && b ? `${a} ${b}` : a || b;
    }
    return combined;
  }, []);

  // ========== STAGING MODEL CONFIGURATION ==========
  const STAGING_MODEL = {
    HEADER_RULES: {
      NO: ['no', 'nomer', 'nomor', 'no.', '#'],
      BOBOT_SECTION: ['bobot', 'bobot section', 'weight', 'bobot%'],
      PARAMETER: ['parameter', 'judul', 'deskripsi', 'title', 'section'],
      SUB_NO: ['sub no', 'subno', 'sub-nomor', 'kode', 'kode indikator'],
      INDIKATOR: ['indikator', 'indicator', 'uraian', 'deskripsi indikator'],
      PEMBILANG_LABEL: ['pembilang', 'jumlah keluhan', 'keluhan', 'komplain', 'pemberitaan'],
      PENYEBUT_LABEL: ['penyebut', 'jumlah transaksi', 'transaksi', 'total'],
      BOBOT_INDIKATOR: ['bobot indikator', 'bobot ind', 'weight ind'],
      SUMBER_RISIKO: ['sumber risiko', 'risiko', 'risk source'],
      DAMPAK: ['dampak', 'impact', 'consequence'],
      LOW: ['low', 'rendah'],
      LOW_TO_MODERATE: ['low to moderate', 'rendah ke sedang', 'low to mod'],
      MODERATE: ['moderate', 'sedang'],
      MODERATE_TO_HIGH: ['moderate to high', 'sedang ke tinggi', 'mod to high'],
      HIGH: ['high', 'tinggi'],
      HASIL: ['hasil', 'result', 'score', 'nilai', 'pencapaian'],
      PERINGKAT: ['peringkat', 'ranking', 'rank', 'level'],
      WEIGHTED: ['weighted', 'tertimbang', 'skor tertimbang'],
      KETERANGAN: ['keterangan', 'note', 'catatan', 'remarks'],
    },

    SECTION: {
      raw_row: null,
      no: null,
      bobotSection: null,
      parameter: null,
      description: null,
      confidence: 1.0,
      indicators: [],
    },

    INDICATOR: {
      raw_row: null,
      subNo: null,
      indikator: null,
      pembilangLabel: null,
      pembilangValue: null,
      penyebutLabel: null,
      penyebutValue: null,
      bobotIndikator: null,
      sumberRisiko: null,
      dampak: null,
      low: null,
      lowToModerate: null,
      moderate: null,
      moderateToHigh: null,
      high: null,
      hasil: null,
      hasilText: null,
      peringkat: null,
      weighted: null,
      keterangan: null,
      confidence: 1.0,
      mode: 'NILAI_TUNGGAL',
      isPercent: false,
      formula: null,
    },
  };

  // ========== UTIL: Fuzzy Matching untuk Header ==========
  const findColumnByKeywords = useCallback((headerRow, keywords) => {
    if (!headerRow || !Array.isArray(headerRow)) return -1;

    for (let col = 0; col < headerRow.length; col++) {
      const cellValue = headerRow[col]?.toString().trim().toLowerCase();
      if (!cellValue) continue;

      for (const keyword of keywords) {
        if (cellValue.includes(keyword.toLowerCase())) {
          return col;
        }
      }
    }
    return -1;
  }, []);

  const classifyRowWithAI = async ({ noCell, indikatorCell, row }) => {
    try {
      const res = await fetch('/api/v1/ai/classify-row', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noCell,
          indikatorCell,
          row,
        }),
      });

      if (!res.ok) return null;
      return await res.json(); // { type, confidence }
    } catch {
      return null;
    }
  };

  // ========== HEADER DETECTION / MAPPING dengan Staging Model ==========
  const detectHeaderRow = useCallback(
    (jsonData) => {
      addLog('🔍 Mencari header row dengan pattern matching...');
      const headerPatterns = [
        { keywords: ['no', 'nomer', 'nomor'], weight: 10 },
        { keywords: ['bobot', 'weight', 'bobot%', 'bobot section'], weight: 8 },
        { keywords: ['parameter', 'judul', 'deskripsi', 'indikator'], weight: 7 },
        { keywords: ['sub no', 'subno', 'sub-nomor', 'kode'], weight: 9 },
        { keywords: ['sumber risiko', 'risiko', 'risk'], weight: 6 },
        { keywords: ['dampak', 'impact'], weight: 5 },
        { keywords: ['hasil', 'result', 'score', 'nilai'], weight: 6 },
        { keywords: ['peringkat', 'ranking', 'rank'], weight: 6 },
        { keywords: ['weighted', 'tertimbang', 'skor'], weight: 5 },
        { keywords: ['keterangan', 'note', 'catatan', 'remarks'], weight: 4 },
      ];

      let bestRow = 0;
      let bestScore = 0;
      const rowScores = [];

      for (let i = 0; i < Math.min(40, jsonData.length); i++) {
        const row = jsonData[i];
        if (!row) continue;
        let rowScore = 0;
        const rowMatches = [];

        for (let col = 0; col < Math.min(30, row.length); col++) {
          const cellValue = row[col]?.toString().trim().toLowerCase();
          if (!cellValue) continue;

          for (const pattern of headerPatterns) {
            for (const keyword of pattern.keywords) {
              if (cellValue.includes(keyword)) {
                rowScore += pattern.weight;
                rowMatches.push({
                  col,
                  keyword,
                  cell: cellValue.substring(0, 30),
                });
                break;
              }
            }
          }
        }

        const nonEmptyCount = row.filter((c) => c !== null && c !== '').length;
        if (nonEmptyCount >= 4) rowScore += 2;

        rowScores.push({ row: i, score: rowScore, matches: rowMatches });

        if (rowScore > bestScore) {
          bestScore = rowScore;
          bestRow = i;
        }
      }

      rowScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .forEach((candidate) => {
          addLog(`Baris ${candidate.row + 1}: Score ${candidate.score}, Matches: ${candidate.matches.map((m) => `${m.keyword}(${m.col})`).join(', ')}`, 'debug');
        });

      if (bestScore >= 12) {
        addLog(`✅ Header ditemukan di baris ${bestRow + 1} (score: ${bestScore})`, 'success');
      } else {
        addLog(`⚠ Header tidak jelas, menggunakan baris ${bestRow + 1} sebagai header (score: ${bestScore})`, 'warning');
      }

      return bestRow;
    },
    [addLog]
  );

  const detectColumnMapping = useCallback(
    (headerRow) => {
      addLog('🧭 Mendeteksi mapping kolom menggunakan staging model...');

      if (!headerRow || headerRow.length === 0) {
        addLog('⚠ Header row kosong, menggunakan mapping default', 'warning');
        return Object.keys(STAGING_MODEL.HEADER_RULES).reduce((acc, key) => {
          acc[key] = -1;
          return acc;
        }, {});
      }

      const mapping = {};

      // Gunakan fuzzy matching untuk setiap kolom
      Object.entries(STAGING_MODEL.HEADER_RULES).forEach(([key, keywords]) => {
        const colIndex = findColumnByKeywords(headerRow, keywords);
        if (colIndex !== -1) {
          mapping[key] = colIndex;
          addLog(`   ${key} → Kolom ${String.fromCharCode(65 + colIndex)} ("${headerRow[colIndex]}")`, 'debug');
        } else {
          mapping[key] = -1;
        }
      });

      // Log mapping summary
      const mappedCount = Object.values(mapping).filter((v) => v !== -1).length;
      addLog(`📋 Mapping selesai: ${mappedCount}/${Object.keys(mapping).length} kolom terdeteksi`, 'success');

      return mapping;
    },
    [addLog, findColumnByKeywords]
  );

  const detectRowRole = (row, colMap) => {
    const text = row.join(' ').toLowerCase();

    if (/summary|ringkasan/.test(text)) return 'SUMMARY';
    if (/sangat baik|baik|cukup|buruk|rendah|tinggi/.test(text)) return 'QUALITATIVE';

    const numericCount = row.filter((v) => typeof parseValue(v) === 'number').length;
    if (numericCount >= 1) return 'VALUE';

    if (/jumlah keluhan|keluhan|komplain|pemberitaan/.test(text)) return 'NUMERATOR';
    if (/jumlah transaksi|transaksi|total/.test(text)) return 'DENOMINATOR';

    return 'UNKNOWN';
  };

  // ========== ROW TYPE IDENTIFICATION ==========
  const identifyRowType = useCallback(
    async (row, colMap) => {
      if (!row || row.every((c) => !c || c.toString().trim() === '')) {
        return 'EMPTY';
      }

      const noCell = colMap.NO !== -1 ? row[colMap.NO]?.toString() ?? '' : '';
      const indikatorCell = colMap.INDIKATOR !== -1 ? row[colMap.INDIKATOR]?.toString() ?? '' : '';

      // 1️⃣ RULE-BASED CEPAT
      if (/\d+(\.\d+)?/.test(noCell) && indikatorCell.length > 30) {
        return 'SECTION';
      }

      if (/\d+\.\d+\.\d+/.test(indikatorCell)) {
        return 'INDICATOR';
      }

      // Multi-line numbered indikator (1., 2., 3.)
      if (indikatorCell && indikatorCell.length > 20 && /(1\.|2\.|3\.|4\.)\s+/.test(indikatorCell)) {
        return 'INDICATOR';
      }

      if (!noCell && !indikatorCell) {
        return 'EMPTY';
      }

      // 2️⃣ 🔥 FALLBACK KE AI CLASSIFIER
      const aiResult = await classifyRowWithAI({
        noCell,
        indikatorCell,
        row,
      });

      if (aiResult?.type) {
        addLog(`🤖 AI classify → ${aiResult.type} (${(aiResult.confidence * 100).toFixed(0)}%)`, 'debug');
        return aiResult.type;
      }

      return 'DATA_ROW';
    },
    [addLog]
  );

  const splitMultiLineIndicators = (text) => {
    if (!text) return [];
    const normalized = text.replace(/\r/g, '\n');
    return normalized
      .split(/\n?\s*(?=\d+\.\s+)/)
      .map((s) => s.trim())
      .filter((s) => /^\d+\.\s+/.test(s));
  };

  // ========== EXTRACT TO STAGING MODEL ==========
  const extractToStagingModel = useCallback(
    async (jsonData, headerRowIndex, combinedHeader = null) => {
      addLog(`📊 Memulai ekstraksi ke staging model dari baris ${headerRowIndex + 2}`);

      const stagingSections = [];
      let currentStagingSection = null;

      const colMap = detectColumnMapping(combinedHeader ?? jsonData[headerRowIndex]);

      // Helper untuk membuat staging section
      const createStagingSection = (row, rowIndex) => {
        const section = { ...STAGING_MODEL.SECTION };
        section.raw_row = rowIndex + 1;

        // Map data ke model staging
        if (colMap.NO !== -1) {
          const raw = row[colMap.NO]?.toString() ?? '';
          const match = raw.match(/(\d+(\.\d+)?)/);
          section.no = match ? match[1] : null;
        }

        if (colMap.BOBOT_SECTION !== -1) {
          const bobot = parseValue(row[colMap.BOBOT_SECTION]);
          section.bobotSection = typeof bobot === 'number' ? bobot : 0;
        }

        if (colMap.PARAMETER !== -1) {
          section.parameter = (row[colMap.PARAMETER] || '').toString().trim();
        }

        // Jika PARAMETER tidak ditemukan, coba INDIKATOR
        if (!section.parameter && colMap.INDIKATOR !== -1) {
          section.parameter = (row[colMap.INDIKATOR] || '').toString().trim();
        }

        // Confidence score berdasarkan kelengkapan data
        let confidence = 1.0;
        if (!section.no) confidence *= 0.7;
        if (!section.parameter) confidence *= 0.8;
        section.confidence = confidence;

        return section;
      };

      // Helper untuk membuat staging indicator
      const createStagingIndicator = (row, rowIndex) => {
        const indicator = { ...STAGING_MODEL.INDICATOR };
        indicator.raw_row = rowIndex + 1;

        // 1. SubNo (8.1.1, 8.1.2)
        if (colMap.SUB_NO !== -1) {
          indicator.subNo = (row[colMap.SUB_NO] || '').toString().trim();
        }

        // 2. Indikator (deskripsi lengkap)
        if (!indicator.subNo && colMap.INDIKATOR !== -1) {
          const text = row[colMap.INDIKATOR]?.toString() ?? '';
          const match = text.match(/(\d+\.\d+\.\d+)/);
          if (match) {
            indicator.subNo = match[1];
            // hapus subNo dari teks indikator
            indicator.indikator = text.replace(match[1], '').trim();
          }
        }

        // 3. Pembilang & Penyebut (label)
        if (colMap.PEMBILANG_LABEL !== -1) {
          indicator.pembilangLabel = (row[colMap.PEMBILANG_LABEL] || '').toString().trim();
        }

        if (colMap.PENYEBUT_LABEL !== -1) {
          indicator.penyebutLabel = (row[colMap.PENYEBUT_LABEL] || '').toString().trim();
        }

        // 4. Bobot Indikator (50%, 100%)
        if (colMap.BOBOT_INDIKATOR !== -1) {
          const bobot = parseValue(row[colMap.BOBOT_INDIKATOR]);
          indicator.bobotIndikator = typeof bobot === 'number' ? bobot : 0;
        }

        // 5. Sumber Risiko
        if (colMap.SUMBER_RISIKO !== -1) {
          indicator.sumberRisiko = (row[colMap.SUMBER_RISIKO] || '').toString().trim();
        }

        // 6. Dampak
        if (colMap.DAMPAK !== -1) {
          indicator.dampak = (row[colMap.DAMPAK] || '').toString().trim();
        }

        // 7. Level Risk (Low, Moderate, High)
        const levelFields = ['LOW', 'LOW_TO_MODERATE', 'MODERATE', 'MODERATE_TO_HIGH', 'HIGH'];
        levelFields.forEach((field) => {
          if (colMap[field] !== -1) {
            const val = row[colMap[field]];
            if (val && val.toString().trim()) {
              indicator[field === 'LOW_TO_MODERATE' ? 'lowToModerate' : field === 'MODERATE_TO_HIGH' ? 'moderateToHigh' : field.toLowerCase()] = val.toString().trim();
            }
          }
        });

        // 8. Hasil (pembilangValue & penyebutValue)
        // if (colMap.HASIL !== -1) {
        //   const hasilValue = parseValue(row[colMap.HASIL]);
        //   if (typeof hasilValue === 'number') {
        //     indicator.hasil = hasilValue;
        //     indicator.hasilText = hasilValue.toString();
        //   } else {
        //     indicator.hasilText = (row[colMap.HASIL] || '').toString().trim();
        //   }
        // }

        // 9. Peringkat
        if (colMap.PERINGKAT !== -1) {
          const peringkatValue = parseValue(row[colMap.PERINGKAT]);
          indicator.peringkat = typeof peringkatValue === 'number' ? peringkatValue : 1;
        }

        // 10. Weighted
        if (colMap.WEIGHTED !== -1) {
          const weightedValue = parseValue(row[colMap.WEIGHTED]);
          indicator.weighted = typeof weightedValue === 'number' ? weightedValue : 0;
        }

        // 11. Keterangan
        if (colMap.KETERANGAN !== -1) {
          indicator.keterangan = (row[colMap.KETERANGAN] || '').toString().trim();
        }

        // 12. Mode (deteksi otomatis)
        if (indicator.pembilangLabel && indicator.penyebutLabel) {
          indicator.mode = 'RASIO';
        } else if (indicator.hasil != null) {
          indicator.mode = 'NILAI_TUNGGAL';
        }

        // Confidence score
        let confidence = 1.0;
        if (!indicator.subNo) confidence *= 0.6;
        if (!indicator.indikator) confidence *= 0.5;
        if (!indicator.bobotIndikator) confidence *= 0.8;
        indicator.confidence = confidence;

        return indicator;
      };

      // Scan untuk pembilang/penyebut values
      const scanForPembilangPenyebutValues = (startRowIdx, indicator) => {
        for (let r = startRowIdx + 1; r <= startRowIdx + 3 && r < jsonData.length; r++) {
          const row = jsonData[r];
          if (!row) continue;

          // Cari value numerik di kolom HASIL
          if (colMap.HASIL !== -1) {
            const value = parseValue(row[colMap.HASIL]);
            if (typeof value === 'number') {
              // Jika pembilangValue belum ada, assign sebagai pembilang
              if (indicator.pembilangValue == null && indicator.pembilangLabel) {
                indicator.pembilangValue = value;
                addLog(`   ↳ Found pembilangValue: ${value} untuk ${indicator.subNo}`, 'debug');
                continue;
              }
              // Jika penyebutValue belum ada, assign sebagai penyebut
              if (indicator.penyebutValue == null && indicator.penyebutLabel) {
                indicator.penyebutValue = value;
                addLog(`   ↳ Found penyebutValue: ${value} untuk ${indicator.subNo}`, 'debug');
                continue;
              }
            }
          }
        }

        // Compute hasil jika ada pembilang dan penyebut
        if (indicator.pembilangValue != null && indicator.penyebutValue != null && indicator.penyebutValue !== 0) {
          indicator.hasil = indicator.pembilangValue / indicator.penyebutValue;
          indicator.hasilText = `${indicator.pembilangValue} / ${indicator.penyebutValue}`;
          indicator.mode = 'RASIO';
        }
      };

      // Process rows
      for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row) continue;

        const rowType = await identifyRowType(row, colMap);
        const rowRole = detectRowRole(row, colMap);

        switch (rowType) {
          case 'SECTION': {
            currentStagingSection = createStagingSection(row, i);
            stagingSections.push(currentStagingSection);
            break;
          }

          case 'INDICATOR': {
            if (!currentStagingSection) {
              currentStagingSection = createStagingSection([], i);
              stagingSections.push(currentStagingSection);
            }

            const rawText = colMap.INDIKATOR !== -1 ? row[colMap.INDIKATOR]?.toString() ?? '' : '';

            const parts = splitMultiLineIndicators(rawText);

            if (parts.length) {
              parts.forEach((part) => {
                const indicator = { ...STAGING_MODEL.INDICATOR };
                indicator.raw_row = i + 1;
                indicator.subNo = `${currentStagingSection.no}.${currentStagingSection.indicators.length + 1}`;
                indicator.indikator = part.replace(/^\d+\.\s*/, '').trim();
                indicator.confidence = 1.0;
                if (colMap.SUMBER_RISIKO !== -1) indicator.sumberRisiko = row[colMap.SUMBER_RISIKO]?.toString().trim() ?? null;

                if (colMap.DAMPAK !== -1) indicator.dampak = row[colMap.DAMPAK]?.toString().trim() ?? null;

                currentStagingSection.indicators.push(indicator);
              });
            } else {
              const indicator = createStagingIndicator(row, i);
              currentStagingSection.indicators.push(indicator);
            }
            break;
          }

          case 'DATA_ROW': {
            if (!currentStagingSection || !currentStagingSection.indicators.length) break;

            const indicator = currentStagingSection.indicators[currentStagingSection.indicators.length - 1];

            const value = parseValue(row[colMap.HASIL] ?? row.find(parseValue));

            if (rowRole === 'NUMERATOR' && !indicator.pembilangLabel) {
              indicator.pembilangLabel = row.join(' ').trim();
            }

            if (rowRole === 'DENOMINATOR' && !indicator.penyebutLabel) {
              indicator.penyebutLabel = row.join(' ').trim();
            }

            if (rowRole === 'VALUE') {
              if (indicator.pembilangValue == null) {
                indicator.pembilangValue = value;
              } else if (indicator.penyebutValue == null) {
                indicator.penyebutValue = value;
              }
            }

            if (rowRole === 'SUMMARY' && indicator.weighted == null) {
              indicator.weighted = value;
            }

            break;
          }
        }
      }

      const totalIndicators = stagingSections.reduce((sum, s) => sum + s.indicators.length, 0);
      addLog(`📈 Staging data selesai: ${stagingSections.length} section, ${totalIndicators} indikator`, 'success');

      return stagingSections;
    },
    [addLog, detectColumnMapping, identifyRowType, parseValue]
  );

  // ========== MAP STAGING TO BACKEND ==========
  const mapStagingToBackend = useCallback(
    (stagingSections) => {
      addLog('🔄 Mapping staging data ke format backend...');

      const backendSections = [];

      stagingSections.forEach((stagingSection, sIdx) => {
        // Map Section
        const backendSection = {
          no: stagingSection.no || `SEC-${sIdx + 1}`,
          bobotSection: stagingSection.bobotSection || 0,
          parameter: stagingSection.parameter || `Section ${stagingSection.no}`,
          description: stagingSection.description || null,
          year: viewYear,
          quarter: viewQuarter,
          sortOrder: sIdx,
          isActive: true,
          confidence: stagingSection.confidence,
          indicators: [],
          rowNumber: stagingSection.raw_row,
          stagingData: stagingSection, // Keep staging reference
        };

        // Map Indicators
        stagingSection.indicators.forEach((stagingIndicator, iIdx) => {
          const backendIndicator = {
            // Data utama
            subNo: stagingIndicator.subNo ?? `${stagingSection.no}.${iIdx + 1}`,

            indikator: stagingIndicator.indikator || 'Indikator tanpa deskripsi',

            // Bobot
            bobotIndikator: stagingIndicator.bobotIndikator || 0,

            // Risk data
            sumberRisiko: stagingIndicator.sumberRisiko || '',
            dampak: stagingIndicator.dampak || '',

            // Risk levels
            low: stagingIndicator.low || '',
            lowToModerate: stagingIndicator.lowToModerate || '',
            moderate: stagingIndicator.moderate || '',
            moderateToHigh: stagingIndicator.moderateToHigh || '',
            high: stagingIndicator.high || '',

            // Hasil dan perhitungan
            mode: stagingIndicator.mode || 'NILAI_TUNGGAL',
            pembilangLabel: stagingIndicator.pembilangLabel || null,
            pembilangValue: stagingIndicator.pembilangValue != null ? stagingIndicator.pembilangValue : null,
            penyebutLabel: stagingIndicator.penyebutLabel || null,
            penyebutValue: stagingIndicator.penyebutValue != null ? stagingIndicator.penyebutValue : null,

            // Hasil akhir
            hasil: stagingIndicator.hasil != null ? stagingIndicator.hasil : null,
            hasilText: stagingIndicator.hasilText || '',

            // Ranking dan weighted
            peringkat: stagingIndicator.peringkat || 1,
            weighted: stagingIndicator.weighted != null ? stagingIndicator.weighted : 0,

            // Metadata
            keterangan: stagingIndicator.keterangan || '',
            confidence: stagingIndicator.confidence,
            isPercent: stagingIndicator.isPercent || false,
            formula: stagingIndicator.formula || null,

            // Relasi (akan diisi nanti)
            sectionId: null,
            noSection: stagingSection.no,
            bobotSection: stagingSection.bobotSection,
            sectionLabel: stagingSection.parameter,

            // Field sistem
            year: viewYear,
            quarter: viewQuarter,
            createdBy: 'system-import',
            rowNumber: stagingIndicator.raw_row,
            stagingData: stagingIndicator, // Keep staging reference
          };

          // Auto-compute jika ada data pembilang/penyebut
          if (backendIndicator.pembilangValue != null && backendIndicator.penyebutValue != null && backendIndicator.penyebutValue !== 0 && !backendIndicator.hasil) {
            backendIndicator.hasil = backendIndicator.pembilangValue / backendIndicator.penyebutValue;
            backendIndicator.hasilText = `${backendIndicator.pembilangValue} / ${backendIndicator.penyebutValue}`;
            backendIndicator.mode = 'RASIO';
          }

          // Handle percentage
          if (backendIndicator.hasil && backendIndicator.isPercent) {
            backendIndicator.hasil = backendIndicator.hasil * 100;
            backendIndicator.hasilText = `${backendIndicator.hasil.toFixed(2)}%`;
          }

          backendSection.indicators.push(backendIndicator);
        });

        backendSections.push(backendSection);
      });

      addLog(`✅ Mapping selesai: ${backendSections.length} section`, 'success');
      return backendSections;
    },
    [viewYear, viewQuarter, addLog]
  );

  // ========== VALIDATE STAGING DATA ==========
  const validateStagingData = useCallback((stagingSections) => {
    const errors = [];
    const warnings = [];

    stagingSections.forEach((section) => {
      // Validasi section
      if (!section.no || section.no.trim() === '') {
        errors.push({
          type: 'error',
          message: `Section tanpa nomor`,
          row: section.raw_row,
          confidence: section.confidence,
        });
      }

      if (section.confidence < 0.7) {
        warnings.push({
          type: 'warning',
          message: `Section ${section.no} memiliki confidence rendah (${section.confidence.toFixed(2)})`,
          row: section.raw_row,
        });
      }

      // Validasi indicators
      section.indicators.forEach((indicator) => {
        // Critical validations
        if (!indicator.subNo || indicator.subNo.trim() === '') {
          errors.push({
            type: 'error',
            message: `Indikator tanpa kode pada section ${section.no}`,
            row: indicator.raw_row,
          });
        }

        if (!indicator.indikator || indicator.indikator.trim() === '') {
          warnings.push({
            type: 'warning',
            message: `Indikator ${indicator.subNo} tanpa deskripsi`,
            row: indicator.raw_row,
          });
        }

        // Business logic validations
        if (indicator.bobotIndikator == null) {
          warnings.push({
            type: 'warning',
            message: `Indikator ${indicator.subNo} tidak memiliki bobot`,
            row: indicator.raw_row,
          });
        }

        if (indicator.mode === 'RASIO' && indicator.penyebutValue === 0) {
          errors.push({
            type: 'error',
            message: `Indikator ${indicator.subNo} penyebut tidak boleh 0`,
            row: indicator.raw_row,
          });
        }

        // Confidence warnings
        if (indicator.confidence < 0.6) {
          warnings.push({
            type: 'warning',
            message: `Indikator ${indicator.subNo} memiliki confidence rendah (${indicator.confidence.toFixed(2)})`,
            row: indicator.raw_row,
          });
        }
      });
    });

    return { errors, warnings };
  }, []);

  // ========== PROCESS EXCEL FILE dengan Staging ==========
  const processExcelFile = useCallback(
    async (file) => {
      try {
        addLog('📁 Membaca file Excel...');

        const workbook = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = e.target.result;
              const workbook = XLSX.read(data, {
                type: 'binary',
                cellDates: true,
                cellStyles: false,
                cellFormula: true,
                sheetStubs: true,
              });
              resolve(workbook);
            } catch (error) {
              reject(new Error(`Gagal parse Excel: ${error.message}`));
            }
          };
          reader.onerror = () => reject(new Error('Gagal membaca file'));
          reader.readAsBinaryString(file);
        });

        let sheetName = workbook.SheetNames[0];
        const possibleSheets = workbook.SheetNames.filter((name) => name.toLowerCase().includes('reputasi') || name.toLowerCase().includes('8.') || name.toLowerCase().includes('risk') || name.toLowerCase().includes('indikator'));

        if (possibleSheets.length > 0) {
          sheetName = possibleSheets[0];
          if (possibleSheets.length > 1) addLog(`⚠ Multiple sheets found, using: "${sheetName}"`, 'warning');
        }

        addLog(`📋 Menggunakan sheet: "${sheetName}"`);

        const worksheet = workbook.Sheets[sheetName];
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
        addLog(`Sheet dimensi: ${range.e.r + 1} rows, ${range.e.c + 1} columns`);

        let jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: true,
          raw: false,
        });

        // 1. UNMERGE & FLATTEN HEADER
        jsonData = expandMergedCells(worksheet, jsonData);
        addLog(`📊 Total baris dalam sheet: ${jsonData.length}`);

        // 2. NORMALISASI
        const cleanedData = jsonData;

        // 3. DETECT HEADER
        const headerRow = detectHeaderRow(cleanedData);
        const combinedHeader = buildCombinedHeader(cleanedData, headerRow);

        // 4. EXTRACT TO STAGING MODEL
        const stagingSections = await extractToStagingModel(cleanedData, headerRow, combinedHeader);

        if (!stagingSections || stagingSections.length === 0) {
          throw new Error('Tidak ada data yang bisa diekstrak ke staging model.');
        }

        // 5. VALIDASI STAGING
        const validation = validateStagingData(stagingSections);

        const stableSections = stagingSections
          .map((s) => ({
            ...s,
            indicators: s.indicators.filter((ind) => ind.indikator && ind.indikator.trim().length > 0),
          }))
          .filter((s) => s.no);

        // 6. MAP KE BACKEND
        const backendData = mapStagingToBackend(stableSections);

        const totalIndicators = backendData.reduce((sum, s) => sum + s.indicators.length, 0);
        addLog(`✅ Alur selesai: ${backendData.length} section, ${totalIndicators} indikator`, 'success');

        return {
          staging: stagingSections,
          backend: backendData,
          validation: validation,
        };
      } catch (error) {
        addLog(`❌ Error dalam alur processing: ${error.message}`, 'error');
        throw error;
      }
    },
    [addLog, detectHeaderRow, expandMergedCells, buildCombinedHeader, extractToStagingModel, validateStagingData, mapStagingToBackend]
  );

  // ========== HANDLE FILE SELECT ==========
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      showNotification('error', 'Hanya file Excel/CSV (.xlsx, .xls, .csv) yang didukung');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showNotification('error', 'Ukuran file maksimal 15MB');
      return;
    }

    setImportFile(file);
    setImportLoading(true);
    setImportedData([]);
    setStagingData([]);
    setValidationErrors([]);
    setParsingLogs([]);
    setExpandedSections({});
    setEditMode(false);

    try {
      addLog(`📤 Memproses file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      addLog(`⚙ Mode: Staging + Mapping`);

      const result = await processExcelFile(file);

      // Simpan data staging
      setStagingData(result.staging);

      // Simpan data backend yang sudah di-mapping
      setImportedData(result.backend);

      // Gabungkan error dan warning
      const allValidations = [...result.validation.errors, ...result.validation.warnings];
      setValidationErrors(allValidations);

      // Setup expanded sections
      const expanded = {};
      result.backend.forEach((s, idx) => {
        const k = makeSecKey(s, idx);
        expanded[k] = result.backend.length <= 3;
      });
      setExpandedSections(expanded);

      const errorCount = result.validation.errors.length;
      const warningCount = result.validation.warnings.length;

      if (errorCount > 0) {
        showNotification('error', `Ditemukan ${errorCount} error yang harus diperbaiki`);
      } else if (warningCount > 0) {
        showNotification('warning', `Ditemukan ${warningCount} warning, periksa data`);
      } else {
        showNotification('success', `✅ ${result.backend.length} section, ${result.backend.reduce((sum, s) => sum + s.indicators.length, 0)} indikator siap diimport`);
      }
    } catch (error) {
      console.error('Import error:', error);
      showNotification('error', `Gagal membaca file: ${error.message}`);
      setImportFile(null);
    } finally {
      setImportLoading(false);
    }
  };

  // ========== HANDLE STAGING DATA EDIT ==========
  const updateStagingData = useCallback((sectionIndex, indicatorIndex, field, value) => {
    setStagingData((prev) => {
      const newData = [...prev];
      if (indicatorIndex !== undefined) {
        // Update indicator
        newData[sectionIndex].indicators[indicatorIndex] = {
          ...newData[sectionIndex].indicators[indicatorIndex],
          [field]: value,
          // Update confidence after edit
          confidence: Math.min(1.0, newData[sectionIndex].indicators[indicatorIndex].confidence + 0.1),
        };
      } else {
        // Update section
        newData[sectionIndex] = {
          ...newData[sectionIndex],
          [field]: value,
          confidence: Math.min(1.0, newData[sectionIndex].confidence + 0.1),
        };
      }
      return newData;
    });
  }, []);

  // ========== APPLY STAGING EDITS ==========
  const applyStagingEdits = useCallback(() => {
    addLog('🔄 Menerapkan perubahan staging ke backend...');

    // Re-map staging to backend
    const updatedBackendData = mapStagingToBackend(stagingData);
    setImportedData(updatedBackendData);

    // Re-validate
    const validation = validateStagingData(stagingData);
    const allValidations = [...validation.errors, ...validation.warnings];
    setValidationErrors(allValidations);

    setEditMode(false);
    showNotification('success', 'Perubahan staging telah diterapkan');
  }, [stagingData, mapStagingToBackend, validateStagingData, addLog, showNotification]);

  // ========== IMPORT ==========
  const handleImport = async () => {
    if (!importedData.length) {
      showNotification('error', 'Tidak ada data untuk diimport');
      return;
    }

    setImportLoading(true);
    setImportProgress(0);

    const summary = {
      totalSections: importedData.length,
      totalIndicators: importedData.reduce((sum, s) => sum + s.indicators.length, 0),
      successSections: 0,
      successIndicators: 0,
      errors: [],
    };

    try {
      addLog('🚀 Memulai import ke database...');

      for (let i = 0; i < importedData.length; i++) {
        const section = importedData[i];
        setImportProgress(Math.round((i / importedData.length) * 50));

        try {
          let sectionId;
          const existingSection = sections.find((s) => s.no === section.no && s.year === viewYear && s.quarter === viewQuarter);

          if (existingSection) {
            sectionId = existingSection.id;
            summary.successSections++;
            addLog(`✓ Section ${section.no} sudah ada, menggunakan ID: ${sectionId}`);
          } else {
            const sectionPayload = {
              year: viewYear,
              quarter: viewQuarter,
              no: section.no,
              bobotSection: section.bobotSection || 0,
              parameter: section.parameter || `Section ${section.no}`,
              description: section.description || `Diimpor pada ${new Date().toLocaleDateString('id-ID')}`,
              sortOrder: i,
              isActive: true,
            };

            const newSection = await createSection(sectionPayload);
            sectionId = newSection.id;
            summary.successSections++;
            addLog(`✓ Section ${section.no} dibuat dengan ID: ${sectionId}`);
          }

          for (const indicator of section.indicators) {
            const progress = 50 + Math.round((section.indicators.indexOf(indicator) / section.indicators.length) * 50);
            setImportProgress(progress);

            try {
              let hasilComputed = indicator.hasil;
              if ((hasilComputed == null || hasilComputed === '') && indicator.pembilangValue != null && indicator.penyebutValue != null) {
                if (indicator.penyebutValue !== 0) hasilComputed = indicator.pembilangValue / indicator.penyebutValue;
                else hasilComputed = null;
              }

              const indicatorPayload = {
                year: viewYear,
                quarter: viewQuarter,
                sectionId: sectionId,
                no: section.no,
                sectionLabel: section.parameter || `Section ${section.no}`,
                bobotSection: section.bobotSection || 0,
                subNo: indicator.subNo || `IND-${Date.now()}`,
                indikator: indicator.indikator || 'Indikator tanpa deskripsi',
                bobotIndikator: indicator.bobotIndikator || 0,
                sumberRisiko: indicator.sumberRisiko || '',
                dampak: indicator.dampak || '',
                low: indicator.low || '',
                lowToModerate: indicator.lowToModerate || '',
                moderate: indicator.moderate || '',
                moderateToHigh: indicator.moderateToHigh || '',
                high: indicator.high || '',
                mode: indicator.mode || 'NILAI_TUNGGAL',
                formula: indicator.formula || null,
                isPercent: indicator.isPercent || false,
                pembilangLabel: indicator.pembilangLabel || null,
                pembilangValue: indicator.pembilangValue != null ? indicator.pembilangValue : null,
                penyebutLabel: indicator.penyebutLabel || null,
                penyebutValue: indicator.penyebutValue != null ? indicator.penyebutValue : null,
                hasil: hasilComputed != null ? hasilComputed : null,
                hasilText: indicator.hasilText || '',
                peringkat: indicator.peringkat || 1,
                weighted: indicator.weighted != null ? indicator.weighted : 0,
                keterangan: indicator.keterangan || '',
                createdBy: 'system-import',
              };

              await createIndikator(indicatorPayload);
              summary.successIndicators++;
              addLog(`✓ Indikator ${indicator.subNo} berhasil diimport`);
            } catch (error) {
              summary.errors.push({
                section: section.no,
                indicator: indicator.subNo,
                error: error.message,
              });
              addLog(`✗ Gagal import indikator ${indicator.subNo}: ${error.message}`, 'error');
            }
          }
        } catch (error) {
          summary.errors.push({
            section: section.no,
            error: error.message,
          });
          addLog(`✗ Gagal import section ${section.no}: ${error.message}`, 'error');
        }
      }

      setImportProgress(100);
      setImportSummary(summary);

      if (summary.errors.length === 0) showNotification('success', `✅ Import berhasil! ${summary.successIndicators} indikator diimport`);
      else showNotification('warning', `Import selesai dengan ${summary.errors.length} error`);

      onImportComplete?.(summary);
    } catch (error) {
      console.error('Import error:', error);
      showNotification('error', `Error sistem: ${error.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  // ========== RENDER STAGING VIEW ==========
  const renderStagingView = () => {
    if (!stagingData.length) return null;

    return (
      <div className="mb-6 border rounded-xl overflow-hidden bg-blue-50">
        <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-lg">Staging Data (Preview & Edit)</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{stagingData.length} section</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, showStagingView: !prev.showStagingView }))}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
              >
                {config.showStagingView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {config.showStagingView ? 'Hide' : 'Show'} Staging
              </button>
              {editMode && (
                <button type="button" onClick={applyStagingEdits} className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Save className="w-4 h-4" />
                  Apply Changes
                </button>
              )}
            </div>
          </div>
        </div>

        {config.showStagingView && (
          <div className="max-h-96 overflow-y-auto p-4">
            <div className="space-y-4">
              {stagingData.map((section, sIdx) => (
                <div key={`staging-${sIdx}`} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-blue-700">Section {sIdx + 1}</span>
                        {editMode ? (
                          <input type="text" value={section.no || ''} onChange={(e) => updateStagingData(sIdx, undefined, 'no', e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="No. Section" />
                        ) : (
                          <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">{section.no || 'No section'}</span>
                        )}
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">Confidence: {section.confidence.toFixed(2)}</span>
                      </div>

                      {editMode ? (
                        <textarea
                          value={section.parameter || ''}
                          onChange={(e) => updateStagingData(sIdx, undefined, 'parameter', e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm mb-2"
                          placeholder="Parameter section"
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-gray-700 mb-2">{section.parameter || 'No parameter'}</p>
                      )}
                    </div>
                    <button type="button" onClick={() => setEditMode(!editMode)} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.indicators.map((indicator, iIdx) => (
                      <div key={`indicator-${sIdx}-${iIdx}`} className="border-l-4 border-blue-300 pl-3 py-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {editMode ? (
                                <input type="text" value={indicator.subNo || ''} onChange={(e) => updateStagingData(sIdx, iIdx, 'subNo', e.target.value)} className="border rounded px-2 py-1 text-sm w-32" placeholder="Sub No" />
                              ) : (
                                <span className="font-mono text-sm font-bold text-green-700">{indicator.subNo}</span>
                              )}
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">Confidence: {indicator.confidence.toFixed(2)}</span>
                            </div>

                            {editMode ? (
                              <textarea
                                value={indicator.indikator || ''}
                                onChange={(e) => updateStagingData(sIdx, iIdx, 'indikator', e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm mb-2"
                                placeholder="Deskripsi indikator"
                                rows={2}
                              />
                            ) : (
                              <p className="text-sm text-gray-700 mb-1">{indicator.indikator || 'No description'}</p>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Bobot:</span>
                                {editMode ? (
                                  <input
                                    type="number"
                                    value={indicator.bobotIndikator || ''}
                                    onChange={(e) => updateStagingData(sIdx, iIdx, 'bobotIndikator', parseFloat(e.target.value))}
                                    className="border rounded px-2 py-1 text-sm w-full mt-1"
                                    placeholder="Bobot"
                                  />
                                ) : (
                                  <span className="ml-2">{indicator.bobotIndikator || 0}</span>
                                )}
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Mode:</span>
                                <span className="ml-2">{indicator.mode}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ========== RENDER ==========
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Import Data Reputasi</h1>
              <p className="text-blue-100">
                Periode:{' '}
                <span className="font-semibold">
                  {viewYear} {viewQuarter}
                </span>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors" disabled={importLoading}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Configuration Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-700">Konfigurasi Parsing</h3>
              </div>
              <span className="text-sm text-gray-500">Advanced Options</span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <label className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-blue-50 cursor-pointer">
                <input type="checkbox" checked={config.autoDetectStructure} onChange={(e) => setConfig((prev) => ({ ...prev, autoDetectStructure: e.target.checked }))} className="rounded text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">Auto-detect</div>
                  <div className="text-xs text-gray-500">Deteksi struktur otomatis</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-blue-50 cursor-pointer">
                <input type="checkbox" checked={config.flexibleMapping} onChange={(e) => setConfig((prev) => ({ ...prev, flexibleMapping: e.target.checked }))} className="rounded text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">Flexible Mapping</div>
                  <div className="text-xs text-gray-500">Mapping kolom fleksibel</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-blue-50 cursor-pointer">
                <input type="checkbox" checked={config.searchHeaderPatterns} onChange={(e) => setConfig((prev) => ({ ...prev, searchHeaderPatterns: e.target.checked }))} className="rounded text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">Pattern Search</div>
                  <div className="text-xs text-gray-500">Cari pola header</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-blue-50 cursor-pointer">
                <input type="checkbox" checked={config.showStagingView} onChange={(e) => setConfig((prev) => ({ ...prev, showStagingView: e.target.checked }))} className="rounded text-blue-600" />
                <div>
                  <div className="font-medium text-gray-800">Staging View</div>
                  <div className="text-xs text-gray-500">Tampilkan data staging</div>
                </div>
              </label>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upload File Excel</h2>
              <span className="text-sm text-gray-500">*.xlsx, *.xls, *.csv</span>
            </div>

            <div className={`relative border-3 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${importFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} className="hidden" disabled={importLoading} />

              {importFile ? (
                <div className="flex flex-col items-center animate-fadeIn">
                  <div className="relative mb-4">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="max-w-full">
                    <p className="text-xl font-bold text-gray-800 truncate">{importFile.name}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {(importFile.size / 1024).toFixed(1)} KB • Modified: {new Date(importFile.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImportFile(null);
                    }}
                    className="mt-6 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={importLoading}
                  >
                    Pilih File Lain
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-20 h-20 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">{importLoading ? 'Memproses file...' : 'Klik atau seret file Excel ke sini'}</p>
                  <p className="text-sm text-gray-500 mb-6 max-w-md">
                    Mendukung file Excel tidak terstruktur. Sistem akan mencoba mendeteksi:
                    <br />• Lokasi header otomatis
                    <br />• Mapping kolom fleksibel
                    <br />• Berbagai format penomoran
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all"
                    disabled={importLoading}
                  >
                    Pilih File Excel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Staging View */}
          {renderStagingView()}

          {/* Progress, Logs, Preview, etc. */}
          {parsingLogs.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Log Parsing</span>
                  <div className="flex gap-2">
                    {parsingLogs.filter((l) => l.type === 'success').length > 0 && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{parsingLogs.filter((l) => l.type === 'success').length} ✓</span>}
                    {parsingLogs.filter((l) => l.type === 'warning').length > 0 && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">{parsingLogs.filter((l) => l.type === 'warning').length} ⚠</span>}
                    {parsingLogs.filter((l) => l.type === 'error').length > 0 && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">{parsingLogs.filter((l) => l.type === 'error').length} ✗</span>}
                  </div>
                </div>
                <button type="button" onClick={() => setParsingLogs([])} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto border rounded-lg bg-gray-50">
                {parsingLogs.slice(-200).map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 border-b last:border-0 ${
                      log.type === 'error'
                        ? 'bg-red-50 text-red-700'
                        : log.type === 'warning'
                        ? 'bg-yellow-50 text-yellow-700'
                        : log.type === 'success'
                        ? 'bg-green-50 text-green-700'
                        : log.type === 'debug'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 font-mono text-sm whitespace-pre-wrap break-words">{log.message}</div>
                      <div className="text-xs opacity-50 ml-2 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview */}
          {importedData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-bold text-lg">Data Siap Import</h3>
                    <p className="text-sm text-gray-600">
                      {importedData.length} section • {importedData.reduce((sum, s) => sum + s.indicators.length, 0)} indikator
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newState = {};
                      importedData.forEach((s, idx) => {
                        newState[makeSecKey(s, idx)] = true;
                      });
                      setExpandedSections(newState);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Buka Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedSections({});
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Tutup Semua
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {importedData.map((section, sIdx) => {
                  const secKey = makeSecKey(section, sIdx);

                  return (
                    <div key={secKey} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all" onClick={() => setExpandedSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }))}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {expandedSections[secKey] ? <ChevronDown className="w-5 h-5 text-blue-600" /> : <ChevronRight className="w-5 h-5 text-blue-600" />}
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-xl text-blue-700">{section.no}</span>
                                <span className="font-semibold text-gray-800">{section.parameter || `Section ${section.no}`}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                <span>{section.indicators.length} indikator</span>
                                <span>•</span>
                                <span>Bobot: {typeof section.bobotSection === 'number' ? section.bobotSection.toFixed(2) : section.bobotSection}%</span>
                                <span>•</span>
                                <span>Confidence: {(section.confidence || 1).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${section.indicators.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {section.indicators.length > 0 ? '✓ Ready' : '⚠ Empty'}
                          </div>
                        </div>
                      </div>

                      {expandedSections[secKey] && section.indicators.length > 0 && (
                        <div className="p-4 border-t">
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-700 mb-2">Daftar Indikator:</h4>
                          </div>
                          <div className="space-y-3">
                            {section.indicators.map((indicator, iIdx) => {
                              const indKey = `${secKey}-${indicator.subNo ?? 'sub'}-${indicator.rowNumber ?? iIdx}`;
                              return (
                                <div key={indKey} className="p-4 border rounded-lg bg-gray-50 hover:bg-white transition-colors">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-sm font-bold bg-green-100 text-green-800 px-3 py-1.5 rounded-lg">{indicator.subNo}</span>
                                        <span className="font-medium text-gray-800">
                                          {indicator.indikator.substring(0, 80)}
                                          {indicator.indikator.length > 80 && '...'}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{indicator.mode}</span>
                                      </div>

                                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                                        <div className="bg-white p-2 rounded border">
                                          <div className="font-semibold text-gray-600">Bobot</div>
                                          <div className="text-lg font-bold text-blue-700">{indicator.bobotIndikator}%</div>
                                        </div>
                                        <div className="bg-white p-2 rounded border">
                                          <div className="font-semibold text-gray-600">Peringkat</div>
                                          <div className="text-lg font-bold text-purple-700">{indicator.peringkat}</div>
                                        </div>
                                        <div className="bg-white p-2 rounded border">
                                          <div className="font-semibold text-gray-600">Weighted</div>
                                          <div className="text-lg font-bold text-green-700">{(indicator.weighted || 0).toFixed(4)}</div>
                                        </div>
                                        <div className="bg-white p-2 rounded border">
                                          <div className="font-semibold text-gray-600">Confidence</div>
                                          <div className="text-lg font-bold text-orange-700">{(indicator.confidence || 1).toFixed(2)}</div>
                                        </div>
                                      </div>

                                      {indicator.hasilText && (
                                        <div className="mb-3">
                                          <span className="text-sm font-semibold text-gray-600">Hasil:</span>
                                          <span className="ml-2 font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded">{indicator.hasilText}</span>
                                        </div>
                                      )}

                                      {indicator.pembilangLabel && indicator.pembilangValue && (
                                        <div className="text-sm text-gray-600">
                                          <span className="font-semibold">Pembilang:</span>
                                          <span className="ml-2">
                                            {indicator.pembilangLabel} = {indicator.pembilangValue}
                                          </span>
                                        </div>
                                      )}

                                      {indicator.penyebutLabel && indicator.penyebutValue && (
                                        <div className="text-sm text-gray-600">
                                          <span className="font-semibold">Penyebut:</span>
                                          <span className="ml-2">
                                            {indicator.penyebutLabel} = {indicator.penyebutValue}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation Errors & Actions */}
          {validationErrors.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <h3 className="font-semibold text-lg">Validasi Data</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">{validationErrors.length} item</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{validationErrors.filter((e) => e.type === 'error').length} errors</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{validationErrors.filter((e) => e.type === 'warning').length} warnings</span>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-xl">
                {validationErrors.slice(0, 5).map((error, idx) => (
                  <div key={idx} className={`p-4 border-b last:border-0 ${error.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${error.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>{error.type === 'error' ? '✗' : '⚠'}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${error.type === 'error' ? 'text-red-800' : 'text-yellow-800'}`}>{error.message}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Baris {error.row} • Confidence: {error.confidence?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {validationErrors.length > 5 && <div className="p-4 text-center text-gray-500">...dan {validationErrors.length - 5} pesan validasi lainnya</div>}
              </div>
            </div>
          )}

          <div className="sticky bottom-0 bg-white pt-8 border-t mt-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                {importedData.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">{importedData.length} section</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{importedData.reduce((sum, s) => sum + s.indicators.length, 0)} indikator</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Avg Confidence:{' '}
                        {(
                          importedData.reduce((sum, s) => sum + (s.confidence || 1) + s.indicators.reduce((indSum, ind) => indSum + (ind.confidence || 1), 0), 0) /
                          (importedData.length + importedData.reduce((sum, s) => sum + s.indicators.length, 0))
                        ).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors" disabled={importLoading}>
                  Batal
                </button>

                {importFile && !importLoading && importedData.length > 0 && (
                  <button
                    type="button"
                    onClick={handleImport}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                    disabled={importLoading}
                  >
                    <Upload className="w-5 h-5" />
                    Mulai Import Data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModalExcel;
