import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../../components/header/Header";
import InherentPage from "./inherent/InherentPage";
import KpmrPage from "./kpmr/KpmrPage";
import { useHeaderStore } from "../../store/headerStore";
import { exportInherent } from "../../utils/export/exportInherent";
import {
  loadInherent,
  saveInherent,
  loadKpmr,
  saveKpmr,
  saveDerived,
  notifyRiskUpdated,
} from "../../utils/storage/riskStorageNilai";
import { computeDerived } from "@/features/Dashboard/pages/RiskProfile-OJK/utils/compute/computeDerived";
import { normalizeInherentRows } from "../../utils/normalize/normalizeInherentRows";
import { normalizeKpmrRows } from "../../utils/normalize/normalizeKpmrRows";

// Komponen tab untuk navigasi antara inherent dan KPMR
function RiskTabs({ value, onChange }) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-8">
        <button
          onClick={() => onChange("inherent")}
          className={`
            py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              value === "inherent"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }
          `}
        >
          INHERENT
        </button>

        <button
          onClick={() => onChange("kpmr")}
          className={`
            py-3 px-1 border-b-2 font-medium text-sm transition-colors
            ${
              value === "kpmr"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            }
          `}
        >
          Kualitas Penerapan Manajemen Risiko
        </button>
      </nav>
    </div>
  );
}

// Membuat signature unik untuk mendeteksi perubahan data inherent
function getInherentSignature(rows = []) {
  return JSON.stringify(
    rows.map((p) => ({
      id: p.id,
      nomor: p.nomor,
      judul: p.judul,
      bobot: p.bobot,
      kategori: p.kategori,
      nilai: (p.nilaiList || []).map((n) => ({
        id: n.id,
        nomor: n.nomor,
        bobot: n.bobot,
        keterangan: n.keterangan,
        riskindikator: n.riskindikator,
        judul: n.judul,
      })),
    }))
  );
}

// Menghitung snapshot dari data inherent untuk disimpan sebagai derived
function computeInherentSnapshot(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      summary: 0,
      meta: { formula: "No data" },
    };
  }

  let totalWeighted = 0;

  rows.forEach((param) => {
    if (!Array.isArray(param.nilaiList)) return;

    param.nilaiList.forEach((nilai) => {
      const derived = computeDerived(nilai, param);
      if (Number.isFinite(derived?.weighted)) {
        totalWeighted += derived.weighted;
      }
    });
  });

  return {
    summary: Number(totalWeighted.toFixed(2)),
    meta: {
      formula: "SUM(all derived.weighted)",
    },
  };
}

export default function KreditProduk() {
  const {
    year,
    activeQuarter,
    search,
    exportRequestId,
    resetExport,
  } = useHeaderStore();

  const CATEGORY_ID = "kredit-produk";

  const [activeTab, setActiveTab] = useState("inherent");
  const [inherentRows, setInherentRows] = useState([]);
  const [kpmrRows, setKpmrRows] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [lastSavedSignature, setLastSavedSignature] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const didMountRef = useRef(false);
  const initialRowsRef = useRef([]);
  const saveTimeoutRef = useRef(null);

  // Menyimpan data inherent dengan debouncing dan signature checking
  const saveInherentData = useCallback(() => {
    if (!isDataReady || !initialLoadDone || inherentRows.length === 0) {
      return false;
    }

    const currentSignature = getInherentSignature(inherentRows);
    
    if (currentSignature === lastSavedSignature && !isSaving) {
      return true;
    }

    setIsSaving(true);
    
    try {
      saveInherent({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        rows: inherentRows,
      });

      const derivedValues = inherentRows.flatMap(param => 
        (param.nilaiList || []).map(nilai => computeDerived(nilai, param))
      );
      
      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        values: derivedValues,
      });

      notifyRiskUpdated();
      
      setLastSavedSignature(currentSignature);
      
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [inherentRows, isDataReady, year, activeQuarter, initialLoadDone, lastSavedSignature, isSaving]);

  // Debounced save effect untuk inherent data
  useEffect(() => {
    if (!isDataReady || !initialLoadDone) return;
    
    if (activeTab !== "inherent") return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const currentSignature = getInherentSignature(inherentRows);
      
      if (currentSignature !== lastSavedSignature) {
        saveInherentData();
      }
    }, 2000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [inherentRows, activeTab, isDataReady, initialLoadDone, lastSavedSignature, saveInherentData]);

  // Expose save function ke window object untuk external trigger
  useEffect(() => {
    if (activeTab === "inherent") {
      window.saveInherentData = () => {
        if (isSaving) {
          return false;
        }
        
        const success = saveInherentData();
        return success;
      };
    }
    
    return () => {
      delete window.saveInherentData;
    };
  }, [saveInherentData, activeTab, isSaving]);

  // Load data saat tahun atau quarter berubah
  useEffect(() => {
    setIsDataReady(false);
    setInitialLoadDone(false);

    const inh = loadInherent({
      categoryId: CATEGORY_ID,
      year,
      quarter: activeQuarter,
    });

    const kpmr = loadKpmr({
      categoryId: CATEGORY_ID,
      year,
    });

    const normalizedInh = inh && inh.length > 0 ? normalizeInherentRows(inh) : [];
    initialRowsRef.current = normalizedInh;
    
    setLastSavedSignature(getInherentSignature(normalizedInh));
    
    setInherentRows(normalizedInh);
    setKpmrRows(kpmr && kpmr.length > 0 ? normalizeKpmrRows(kpmr) : []);

    setIsDataReady(true);
    setInitialLoadDone(true);
  }, [year, activeQuarter]);

  // Handle beforeunload untuk mencegah kehilangan data yang belum disimpan
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      
      const handleBeforeUnload = (e) => {
        if (activeTab === "inherent" && inherentRows.length > 0) {
          const currentSignature = getInherentSignature(inherentRows);
          if (currentSignature !== lastSavedSignature) {
            e.preventDefault();
            e.returnValue = "Ada perubahan yang belum disimpan. Yakin ingin keluar?";
            
            saveInherentData();
            return e.returnValue;
          }
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [activeTab, inherentRows, lastSavedSignature, saveInherentData]);

  // Handle export request dari header
  useEffect(() => {
    if (!exportRequestId || !isDataReady) return;

    if (activeTab === "inherent") {
      exportInherent({
        rows: inherentRows,
        year,
        quarter: activeQuarter,
        categoryLabel: "KreditProduk",
      });
    }

    resetExport();
  }, [
    exportRequestId,
    isDataReady,
    activeTab,
    inherentRows,
    year,
    activeQuarter,
    resetExport,
  ]);

  // Handler untuk perubahan tab dengan pengecekan perubahan data
  const handleTabChange = useCallback((tab) => {
    if (activeTab === "inherent" && inherentRows.length > 0) {
      const currentSignature = getInherentSignature(inherentRows);
      if (currentSignature !== lastSavedSignature) {

      }
    }
    
    setActiveTab(tab);
  }, [activeTab, inherentRows, lastSavedSignature]);

  // Expose save KPMR function ke window object
  useEffect(() => {
    if (activeTab === "kpmr") {
      window.saveKpmrData = () => {
        try {
          saveKpmr({
            categoryId: CATEGORY_ID,
            year,
            rows: kpmrRows,
          });
          return true;
        } catch (error) {
          console.error("Gagal menyimpan KPMR:", error);
          return false;
        }
      };
    }
    
    return () => {
      delete window.saveKpmrData;
    };
  }, [kpmrRows, year, activeTab]);

  // Immediate save function untuk KPMR data
  const saveKpmrDataImmediate = useCallback((rowsToSave = null) => {
    const rows = rowsToSave || kpmrRows;
    
    try {
      saveKpmr({
        categoryId: CATEGORY_ID,
        year,
        rows: rows,
      });
      return true;
    } catch (error) {
      console.error("Gagal menyimpan KPMR:", error);
      return false;
    }
  }, [kpmrRows, year]);

  // Immediate save function untuk inherent data dengan snapshot calculation
  const saveInherentDataImmediate = useCallback((rowsToSave = null) => {
    const rows = rowsToSave || inherentRows;
    
    if (!isDataReady || !initialLoadDone) {
      console.log('Cannot save: data not ready');
      return false;
    }

    console.log('Saving inherent data:', rows.length, 'parameters');
    
    setIsSaving(true);
    
    try {
      saveInherent({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        rows: rows,
      });

      console.log('Saved to localStorage successfully');
      
      const derivedValues = rows.flatMap(param => 
        (param.nilaiList || []).map(nilai => computeDerived(nilai, param))
      );
      
      const snapshot = computeInherentSnapshot(rows);
      
      saveDerived({
        categoryId: CATEGORY_ID,
        year,
        quarter: activeQuarter,
        snapshot: snapshot,
        values: derivedValues,
      });

      notifyRiskUpdated();
      setLastSavedSignature(getInherentSignature(rows));
      
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isDataReady, year, activeQuarter, initialLoadDone, inherentRows]);


  useEffect(() => {
    if (activeTab === "inherent") {
      window.saveInherentData = () => {
        if (isSaving) {
          console.log("Already saving, skipping...");
          return false;
        }
        
        const success = saveInherentDataImmediate();
        return success;
      };
    }
    
    return () => {
      delete window.saveInherentData;
    };
  }, [saveInherentDataImmediate, activeTab, isSaving]);

  return (
    <div className="w-full space-y-4">
      <Header title="Risk Profile – Kredit Produk" />

      <RiskTabs
        value={activeTab}
        onChange={handleTabChange}
      />

      <div className="w-full">
        {activeTab === "inherent" && (
          <InherentPage
            rows={inherentRows}
            setRows={setInherentRows}
            search={search}
            active
            onSaveData={saveInherentDataImmediate} 
          />
        )}

        {activeTab === "kpmr" && (
          <KpmrPage
            rows={kpmrRows}
            setRows={setKpmrRows}
            search={search}
            onSaveData={saveKpmrDataImmediate}
          />
        )}
      </div>
    </div>
  );
}